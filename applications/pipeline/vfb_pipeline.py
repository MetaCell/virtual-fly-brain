#!/usr/bin/env python3
"""
VFB Jenkins Pipeline: Generate missing volume_man.obj files from SWC skeletons
and create Neuroglancer precomputed mesh data.

Designed to run on the VFB Jenkins server where
https://www.virtualflybrain.org/data/ is mounted at /IMAGE_WRITE/

Workflow:
  1. Discover image directories (filesystem scan or KB query)
  2. For each image with volume.swc but no volume_man.obj → generate OBJ
  3. For each image with volume_man.obj but no neuroglancer/ → generate precomputed

Discovery modes:
  - Default: scan /IMAGE_WRITE/VFB/i/ filesystem
  - --use-kb: query kb.virtualflybrain.org for live images from production
    datasets only (requires vfb-connect package)

Folder structure per image:
  /IMAGE_WRITE/VFB/i/{first4}/{last4}/{template_id}/
  ├── volume.swc            (existing)
  ├── volume.obj            (existing, auto-generated point cloud)
  ├── volume_man.obj        ← generated from SWC if missing
  ├── volume.nrrd           (existing)
  ├── volume.wlz            (existing)
  ├── neuroglancer/         ← NEW precomputed mesh (chunks/mesh written uncompressed,
  │   ├── info                no segment_properties/ -- our mesh is always a single
  │   └── mesh/                synthetic merged segment, never real per-segment labels)
  │       ├── info
  │       ├── 1:0
  │       └── 1:0:1
  └── neuroglancer.zip      ← whole neuroglancer/ folder zipped as one artifact,
                              only when --compress is passed (see mesh_compression/zip_output.py);
                              this is what Neuroglancer's client-side zip-kvstore
                              adapter reads via HTTP
                              Range requests, instead of per-chunk gzip/brotli
                              + a server-side Content-Encoding hack.

Neuroglancer URL (directory form, still works locally):
  precomputed://https://www.virtualflybrain.org/data/VFB/i/{first4}/{last4}/{template_id}/neuroglancer

Usage:
  # Dry run — show what would be done
  python vfb_pipeline.py --dry-run

  # Process everything
  python vfb_pipeline.py

  # Process specific IDs
  python vfb_pipeline.py --ids VFB_00000001 VFB_00000002

  # Use KB to discover only live images from production datasets
  python vfb_pipeline.py --use-kb

  # Process from a file
  python vfb_pipeline.py --ids-file missing_objs.txt

  # Force regeneration even if outputs exist
  python vfb_pipeline.py --force
"""
from __future__ import annotations

import argparse
import importlib.util
import json
import logging
import os
import shutil
import sys
import time
import types
import zipfile
from pathlib import Path

import numpy as np
import trimesh
from cloudvolume import CloudVolume
from cloudvolume.mesh import Mesh

# Import NRRD converter (same package)
try:
    from convert_nrrd import (
        convert_nrrd as _convert_nrrd,
        validate_mesh_params as _validate_mesh_params,
        read_nrrd_voxel_size as _read_nrrd_voxel_size,
    )
except ImportError:
    _convert_nrrd = None
    _validate_mesh_params = None
    _read_nrrd_voxel_size = None

import mesh_compression

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

IMAGE_ROOT = "/IMAGE_WRITE"
VFB_DATA_DIR = os.path.join(IMAGE_ROOT, "VFB", "i")

# Fallback resolution (um, JRC2018Unisex), used by write_precomputed() ONLY when an
# image directory has no volume.nrrd of its own to read the real voxel size from --
# see process_image()'s Step 2a and read_nrrd_voxel_size() in convert_nrrd.py.
DEFAULT_RESOLUTION = [0.5189161, 0.5189161, 1.0]

# Default processing order when --template is not given.
# Templates listed here are processed first, in order; any others come after.
# Short_forms of the anatomical template individual (VFB_…), matching both the
# filesystem directory name and `t.short_form` returned by the KB query.
DEFAULT_TEMPLATE_ORDER = [
    "VFB_00101567",  # JRC2018U / JRC2018Unisex
    "VFB_00200000",  # JRCVNC2018U / JRC2018UnisexVNC
]

# KB (Knowledge Base) endpoint for VFBconnect
KB_ENDPOINT = "http://kb.virtualflybrain.org"
KB_USER = "neo4j"
KB_PASSWORD = "vfb"

# Folder URL prefix in KB → local path mapping
KB_FOLDER_URL_PREFIX = "http://www.virtualflybrain.org/data/"

log = logging.getLogger("vfb_pipeline")


# ---------------------------------------------------------------------------
# KB Discovery: query kb.virtualflybrain.org for live image directories
# ---------------------------------------------------------------------------

def _get_neo4j_connect():
    """Import Neo4jConnect without triggering vfb_connect's slow __init__.

    The vfb_connect package's __init__.py instantiates a global VfbConnect
    object that connects to PDB and caches all terms, which blocks for a very
    long time.  We bypass this by stubbing the top-level package and importing
    the Neo4j module directly.
    """
    # If already imported (e.g. caller already set up the bypass), just use it
    if "vfb_connect.neo.neo4j_tools" in sys.modules:
        mod = sys.modules["vfb_connect.neo.neo4j_tools"]
        return mod.Neo4jConnect, mod.dict_cursor

    # Remove any existing stub so find_spec works on the real package
    saved = sys.modules.pop("vfb_connect", None)
    try:
        spec = importlib.util.find_spec("vfb_connect")
    finally:
        # Restore or re-stub immediately
        if saved is not None:
            sys.modules["vfb_connect"] = saved

    if spec is None or spec.submodule_search_locations is None:
        raise ImportError("vfb_connect is not installed — pip install vfb-connect")

    pkg = types.ModuleType("vfb_connect")
    pkg.__path__ = list(spec.submodule_search_locations)
    sys.modules["vfb_connect"] = pkg
    from vfb_connect.neo.neo4j_tools import Neo4jConnect, dict_cursor  # noqa: E402
    return Neo4jConnect, dict_cursor


def iter_kb_image_dirs(image_root: str = IMAGE_ROOT,
                       templates: list[str] | None = None):
    """Query KB for live image folders from production datasets.

    Yields (image_dir, vfb_id, template_id) tuples, matching the
    interface of iter_image_dirs().

    The ``in_register_with`` edge points at a *channel* individual (``VFBc_…``).
    The anatomical template individual (``VFB_…``) is reached via
    ``(channel)-[:depicts]->(template)``, so filtering by template short_form
    must be applied to the template node, not the channel.

    ``templates``: optional list of template short_forms (e.g. ``VFB_00101567``)
    to restrict the query to.
    """
    Neo4jConnect, dict_cursor = _get_neo4j_connect()
    nc = Neo4jConnect(endpoint=KB_ENDPOINT, usr=KB_USER, pwd=KB_PASSWORD)

    template_clause = ""
    if templates:
        # Guard against Cypher injection: only allow simple VFB-style ids.
        safe = [t for t in templates if all(ch.isalnum() or ch == "_" for ch in t)]
        if not safe:
            log.warning("No valid template short_forms in filter %s", templates)
            return
        quoted = ", ".join("'" + t + "'" for t in safe)
        template_clause = f"          AND t.short_form IN [{quoted}]\n"

    query = f"""
        MATCH (c:Individual)-[:depicts]->(i:Individual)-[:has_source]->(ds:DataSet)
        MATCH (c)-[r:in_register_with]->(tc:Template)-[:depicts]->(t:Template)
        WHERE ds.production[0] = true
          AND r.folder IS NOT NULL
          AND (r.block IS NULL OR NOT r.block[0] = 'Missing Image')
          AND NOT tc.short_form = 'VFBc_00017894'
{template_clause}        RETURN DISTINCT i.short_form AS id, r.folder[0] AS folder, t.short_form AS template
    """

    log.info("Querying KB at %s for live image directories...", KB_ENDPOINT)
    results = nc.commit_list([query])
    rows = dict_cursor(results)

    count = 0
    for row in rows:
        folder_url = row["folder"]
        vfb_id = row["id"]

        # Map URL to local path: replace URL prefix with IMAGE_ROOT
        if not folder_url.startswith(KB_FOLDER_URL_PREFIX):
            log.debug("  Skipping unexpected folder URL: %s", folder_url)
            continue

        rel_path = folder_url[len(KB_FOLDER_URL_PREFIX):]
        # Strip trailing slash
        rel_path = rel_path.rstrip("/")
        image_dir = os.path.join(image_root, rel_path)

        # Prefer the template individual's short_form from the KB; fall back
        # to the last path component if the query didn't return one.
        template_id = row.get("template") or os.path.basename(image_dir)

        count += 1
        yield image_dir, vfb_id, template_id

    log.info("KB returned %d live image directories", count)


def get_kb_template_image_dirs(templates: list[str],
                               image_root: str = IMAGE_ROOT) -> list[tuple]:
    """Fetch each template's own image folder from the KB.

    Returns a list of (image_dir, vfb_id, template_id) tuples where
    vfb_id == template_id. Unlike iter_kb_image_dirs(), this does NOT filter
    on production datasets — templates frequently lack a has_source edge to a
    DataSet, so the main query would otherwise omit them.

    Folder URLs live on the template channel's self in_register_with edge
    (tc)-[rt:in_register_with]->(tc), not on the c→tc edge that
    iter_kb_image_dirs follows. URL→path mapping uses the same
    KB_FOLDER_URL_PREFIX so the rest of the pipeline is unchanged.
    """
    if not templates:
        return []

    # Guard against Cypher injection: only allow simple VFB-style ids.
    safe = [t for t in templates if all(ch.isalnum() or ch == "_" for ch in t)]
    if not safe:
        return []

    Neo4jConnect, dict_cursor = _get_neo4j_connect()
    nc = Neo4jConnect(endpoint=KB_ENDPOINT, usr=KB_USER, pwd=KB_PASSWORD)

    quoted = ", ".join("'" + t + "'" for t in safe)
    query = f"""
        MATCH (tc:Template)-[:depicts]->(t:Template)
        MATCH (tc)-[rt:in_register_with]->(tc)
        WHERE t.short_form IN [{quoted}]
          AND rt.folder IS NOT NULL
        RETURN DISTINCT t.short_form AS template, rt.folder[0] AS folder
    """

    log.info("Querying KB for template image folders: %s", safe)
    rows = dict_cursor(nc.commit_list([query]))

    out = []
    for row in rows:
        folder_url = row["folder"]
        tid = row["template"]
        if not folder_url.startswith(KB_FOLDER_URL_PREFIX):
            log.debug("  Skipping unexpected folder URL: %s", folder_url)
            continue
        rel_path = folder_url[len(KB_FOLDER_URL_PREFIX):].rstrip("/")
        image_dir = os.path.join(image_root, rel_path)
        out.append((image_dir, tid, tid))
    return out


# ---------------------------------------------------------------------------
# Discovery: find image directories and classify them
# ---------------------------------------------------------------------------

# Volume files that indicate an image directory
_VOLUME_FILES = {"volume.nrrd", "volume.swc", "volume.wlz", "volume.obj"}


def _has_volume_files(directory: Path) -> bool:
    """Return True if the directory contains any recognised volume file."""
    return any((directory / f).is_file() for f in _VOLUME_FILES)


def iter_image_dirs(vfb_data_dir: str = VFB_DATA_DIR):
    """Yield (image_dir, vfb_id, template_id) for every image directory under VFB/i/.

    Directory layout: VFB/i/{first4}/{last4}/{template_id}/volume.nrrd
    Only yields template directories that contain recognised volume files.
    """
    vfb_data = Path(vfb_data_dir)
    if not vfb_data.is_dir():
        log.error("VFB data directory not found: %s", vfb_data)
        return

    for first4 in sorted(vfb_data.iterdir()):
        if not first4.is_dir():
            continue
        for last4 in sorted(first4.iterdir()):
            if not last4.is_dir():
                continue
            # Each subdirectory under last4/ is a template alignment
            for template_dir in sorted(last4.iterdir()):
                if not template_dir.is_dir():
                    continue
                if _has_volume_files(template_dir):
                    vfb_id = "VFB_" + first4.name + last4.name
                    yield str(template_dir), vfb_id, template_dir.name


def find_image_dir(vfb_id: str, vfb_data_dir: str = VFB_DATA_DIR) -> list[str]:
    """Find all image directories for a given VFB ID (may be aligned to multiple templates).

    Only returns template sub-directories that contain recognised volume files.
    """
    prefix = vfb_id.replace("VFB_", "")
    first4, last4 = prefix[:4], prefix[4:]
    parent = Path(vfb_data_dir) / first4 / last4
    if not parent.is_dir():
        return []
    return [str(d) for d in sorted(parent.iterdir()) if d.is_dir() and _has_volume_files(d)]


def has_faces(obj_path: str) -> bool:
    """Check if an OBJ file has face definitions (real mesh vs point cloud)."""
    with open(obj_path) as f:
        for line in f:
            if line.startswith("f "):
                return True
    return False


def _zip_has_volume_chunks(zip_path: Path) -> bool:
    """Whether a compressed neuroglancer.zip contains 0/ volume chunks, without
    extracting anything -- mirrors the uncompressed (d / "neuroglancer" / "0").is_dir()
    check for the case where the source folder was removed after zipping (see
    process_image()'s compress step)."""
    try:
        with zipfile.ZipFile(zip_path) as zf:
            return any(n.startswith("0/") for n in zf.namelist())
    except zipfile.BadZipFile:
        return False


def classify_dir(image_dir: str) -> dict:
    """Classify what files exist and what needs to be done for an image directory."""
    d = Path(image_dir)
    ng_dir = d / "neuroglancer"
    ng_zip = d / "neuroglancer.zip"
    has_ng_dir = (ng_dir / "info").is_file()
    has_ng_zip = ng_zip.is_file()
    return {
        "has_swc": (d / "volume.swc").is_file(),
        "has_nrrd": (d / "volume.nrrd").is_file(),
        "has_obj_man": (d / "volume_man.obj").is_file(),
        "has_obj_man_faces": (
            has_faces(str(d / "volume_man.obj"))
            if (d / "volume_man.obj").is_file()
            else False
        ),
        # --compress removes neuroglancer/ after zipping it (see process_image()), so
        # a completed compressed instance only has neuroglancer.zip, no folder.
        "has_neuroglancer": has_ng_dir or has_ng_zip,
        # 0/ directory holds the volume chunks. Mesh-only outputs from
        # write_precomputed() have neuroglancer/info but no neuroglancer/0/. Checked
        # inside the zip too, since compress removes the loose folder.
        "has_volume_chunks": (
            (ng_dir / "0").is_dir()
            or (has_ng_zip and _zip_has_volume_chunks(ng_zip))
        ),
    }


# ---------------------------------------------------------------------------
# SWC → OBJ conversion (imported from convert_swc_to_mesh)
# ---------------------------------------------------------------------------

def parse_swc(filepath: str) -> dict:
    """Parse an SWC file into a dict of nodes."""
    nodes = {}
    with open(filepath) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            parts = line.split()
            if len(parts) < 7:
                continue
            node_id = int(parts[0])
            try:
                radius = float(parts[5])
            except ValueError:
                radius = float("nan")
            nodes[node_id] = {
                "type": int(parts[1]),
                "x": float(parts[2]),
                "y": float(parts[3]),
                "z": float(parts[4]),
                "radius": radius,
                "parent": int(parts[6]),
            }
    return nodes


def create_tube_segment(p1, p2, r1, r2, n_sides=20):
    """Create a truncated cone (tube segment) between two points."""
    direction = p2 - p1
    length = np.linalg.norm(direction)
    if length < 1e-10:
        return None

    cylinder = trimesh.creation.cylinder(radius=1.0, height=length, sections=n_sides)
    verts = cylinder.vertices.copy()
    top_mask = verts[:, 2] > 0
    bottom_mask = ~top_mask
    verts[top_mask, 0] *= r2
    verts[top_mask, 1] *= r2
    verts[bottom_mask, 0] *= r1
    verts[bottom_mask, 1] *= r1
    cylinder.vertices = verts

    direction_norm = direction / length
    z_axis = np.array([0, 0, 1.0])
    if np.allclose(direction_norm, z_axis):
        rotation = np.eye(4)
    elif np.allclose(direction_norm, -z_axis):
        rotation = trimesh.transformations.rotation_matrix(np.pi, [1, 0, 0])
    else:
        axis = np.cross(z_axis, direction_norm)
        axis = axis / np.linalg.norm(axis)
        angle = np.arccos(np.clip(np.dot(z_axis, direction_norm), -1, 1))
        rotation = trimesh.transformations.rotation_matrix(angle, axis)

    cylinder.apply_transform(rotation)
    cylinder.apply_translation((p1 + p2) / 2.0)
    return cylinder


def swc_to_mesh(swc_path: str, min_radius: float = 0.2,
                tube_sides: int = 20) -> trimesh.Trimesh:
    """Convert SWC skeleton to a tubular trimesh."""
    nodes = parse_swc(swc_path)
    if not nodes:
        raise ValueError("No nodes found in SWC file: " + swc_path)

    meshes = []
    for node_id, node in nodes.items():
        parent_id = node["parent"]
        if parent_id < 0 or parent_id not in nodes:
            continue
        parent = nodes[parent_id]
        p1 = np.array([parent["x"], parent["y"], parent["z"]])
        p2 = np.array([node["x"], node["y"], node["z"]])
        r1 = parent["radius"] if not np.isnan(parent["radius"]) else min_radius
        r1 = max(r1, min_radius)
        r2 = node["radius"] if not np.isnan(node["radius"]) else min_radius
        r2 = max(r2, min_radius)
        tube = create_tube_segment(p1, p2, r1, r2, n_sides=tube_sides)
        if tube is not None:
            meshes.append(tube)

    # Spheres at branch points
    child_count = {}
    for node in nodes.values():
        pid = node["parent"]
        if pid > 0:
            child_count[pid] = child_count.get(pid, 0) + 1

    for nid, count in child_count.items():
        if count > 1 and nid in nodes:
            node = nodes[nid]
            r = node["radius"] if not np.isnan(node["radius"]) else min_radius
            r = max(r, min_radius)
            sphere = trimesh.creation.icosphere(subdivisions=1, radius=r)
            sphere.apply_translation([node["x"], node["y"], node["z"]])
            meshes.append(sphere)

    if not meshes:
        raise ValueError("No tube segments could be generated from: " + swc_path)

    return trimesh.util.concatenate(meshes)


def generate_obj_from_swc(image_dir: str) -> str:
    """Generate volume_man.obj from volume.swc in the given directory.

    Returns the path to the created OBJ file.
    """
    swc_path = os.path.join(image_dir, "volume.swc")
    obj_path = os.path.join(image_dir, "volume_man.obj")

    log.info("  Generating OBJ from SWC: %s", swc_path)
    mesh = swc_to_mesh(swc_path)
    mesh.export(obj_path, file_type="obj")
    log.info("  Saved: %s (%d vertices, %d faces)",
             obj_path, len(mesh.vertices), len(mesh.faces))
    return obj_path


# ---------------------------------------------------------------------------
# OBJ → Neuroglancer precomputed
# ---------------------------------------------------------------------------

def write_precomputed(obj_path: str, output_dir: str,
                      resolution: list[float] = DEFAULT_RESOLUTION,
                      segment_id: int = 1, swap_xz: bool = False):
    """Convert OBJ mesh to Neuroglancer precomputed format (uncompressed).

    `resolution` must be in the OBJ's own physical units (microns), matching
    whatever this image's (or its template's) volume.nrrd header reports via
    detect_spacing() -- see process_image()'s Step 2a, which resolves this per
    image before calling here. No unit conversion is applied to the mesh: OBJ
    vertices are already physical microns, same as `resolution`, so the two stay
    in the same coordinate space as the NRRD path (convert_nrrd.py) -- these used
    to disagree by a hardcoded 1000x nm conversion here, which misaligned/oversized
    OBJ-path meshes relative to anything produced via the NRRD path (e.g. templates,
    always NRRD-path -- see is_template_image in process_image()).

    swap_xz: some pre-existing volume_man.obj files (built upstream directly off the
    raw NRRD array) store vertices in NRRD's native (Z, Y, X) order instead of
    Neuroglancer's (X, Y, Z) -- the same axis reshuffle convert_nrrd.py applies via
    np.transpose(data, (2, 1, 0)) for the volume itself. Confirmed empirically
    (VFB_jrchk0ew): obj column 0 matched the correct physical Z range, column 2
    matched X, column 1 (Y) was already correct. Only pass True for such
    pre-existing objs -- ones generate_obj_from_swc() builds from a .swc file this
    run are already in true X,Y,Z (no NRRD array involved) and must NOT be swapped.
    """

    mesh = trimesh.load(obj_path, force="mesh")
    if not isinstance(mesh, trimesh.Trimesh):
        raise ValueError("Could not load as triangle mesh: " + obj_path)

    if swap_xz:
        mesh.vertices = mesh.vertices[:, [2, 1, 0]]

    log.info("  Writing precomputed: %s (%d verts, %d faces)",
             output_dir, len(mesh.vertices), len(mesh.faces))

    os.makedirs(output_dir, exist_ok=True)
    dest = "file://" + output_dir

    mesh_max = mesh.vertices.max(axis=0)
    mesh_min = mesh.vertices.min(axis=0)
    size = [
        int(np.ceil((mesh_max[i] - mesh_min[i]) / resolution[i])) + 2
        for i in range(3)
    ]
    # voxel_offset is in VOXEL units (physical origin = voxel_offset * resolution) --
    # anchor the declared grid at the mesh's own bounding box, not [0, 0, 0]. A mesh
    # that isn't near world-origin (e.g. an individual neuron registered onto a
    # whole-brain template, sitting at physical position ~300+ instead of ~0) would
    # otherwise declare a grid nowhere near its actual vertices, and Neuroglancer's
    # default camera (centered on the declared grid) would never show it.
    voxel_offset = [int(np.floor(mesh_min[i] / resolution[i])) for i in range(3)]

    info = {
        "data_type": "uint32",
        "num_channels": 1,
        "type": "segmentation",
        "mesh": "mesh",
        "scales": [{
            "chunk_sizes": [[64, 64, 64]],
            "encoding": "raw",
            "key": "0",
            "resolution": resolution,
            "size": size,
            "voxel_offset": voxel_offset,
        }],
    }

    vol = CloudVolume(dest, mip=0, info=info, compress=False)
    vol.commit_info()

    # Mesh directory
    mesh_dir = os.path.join(output_dir, "mesh")
    os.makedirs(mesh_dir, exist_ok=True)
    with open(os.path.join(mesh_dir, "info"), "w") as f:
        json.dump({"@type": "neuroglancer_legacy_mesh"}, f)

    vertices = mesh.vertices.astype(np.float32)
    faces = mesh.faces.astype(np.uint32)
    mesh_obj = Mesh(vertices, faces, segid=segment_id)
    vol.mesh.put(mesh_obj, compress=False)
    # No segment_properties -- this is always a single synthetic segment with a
    # placeholder label ("mesh"), never real per-segment labels, so a
    # segment_properties list would be misleading rather than informative
    # (see NEUROGLANCER_STANDARDIZATION.md item 3).

    log.info("  Precomputed written: %s", output_dir)


# ---------------------------------------------------------------------------
# Pipeline logic
# ---------------------------------------------------------------------------

def process_image(image_dir: str, vfb_id: str, template_id: str,
                  force: bool = False, overwrite: bool = False,
                  dry_run: bool = False,
                  merge_segments: bool = False,
                  min_intensity: int | None = None,
                  max_intensity: int | None = None,
                  resolution: list[float] = DEFAULT_RESOLUTION,
                  generate_mesh: bool = False,
                  mesh_from_obj: bool = False,
                  mask: str = "none",
                  mesh_min_intensity: int | None = None,
                  mesh_max_intensity: int | None = None,
                  mesh_percentile: float | None = None,
                  mesh_format: str = "legacy",
                  decimate_fraction: float = 0.0,
                  max_simplification_error: int = 10,
                  compress: bool = False) -> dict:
    """Process a single image directory. Returns a status dict.

    generate_mesh/mask/mesh_*/decimate_fraction/max_simplification_error are passed
    straight through to convert_nrrd.convert_nrrd() for the NRRD path -- see that
    function's docstring for what each one does. The OBJ mesh path (write_precomputed,
    above) doesn't generate a mesh from a volume mask, so none of this applies there.

    mesh_from_obj: only relevant when generate_mesh is also set. generate_mesh forces
    the NRRD path (even for a non-template image that would otherwise take the
    lightweight OBJ-only path) -- mesh_from_obj then picks the mesh source within it:
    if this image directory has a usable volume_man.obj, that OBJ is used as the mesh
    source instead of running marching cubes on the NRRD volume (mask/mesh_*/
    decimate_fraction/max_simplification_error are then ignored for this image).
    Falls back to marching-cubes NRRD generation, same as mesh_from_obj=False, when no
    usable volume_man.obj exists.
    """

    # --overwrite: remove existing neuroglancer/ (and/or its zipped artifact -- see
    # the compress step below, which removes the folder after zipping, so a
    # completed --compress run leaves only neuroglancer.zip) so it will be regenerated
    ng_dir = os.path.join(image_dir, "neuroglancer")
    ng_zip = ng_dir + ".zip"
    if overwrite:
        if os.path.isdir(ng_dir):
            if dry_run:
                log.info("  [%s] Would delete existing neuroglancer/ for overwrite", vfb_id)
            else:
                log.info("  [%s] Deleting existing neuroglancer/ (--overwrite)", vfb_id)
                shutil.rmtree(ng_dir)
        if os.path.isfile(ng_zip):
            if dry_run:
                log.info("  [%s] Would delete existing neuroglancer.zip for overwrite", vfb_id)
            else:
                log.info("  [%s] Deleting existing neuroglancer.zip (--overwrite)", vfb_id)
                os.remove(ng_zip)

    status = classify_dir(image_dir)
    result = {
        "vfb_id": vfb_id,
        "template_id": template_id,
        "image_dir": image_dir,
        "obj_generated": False,
        "precomputed_generated": False,
        "skipped": False,
        "error": None,
    }

    # Template images are volume data (the brain/VNC itself). Always go via
    # the NRRD path so neuroglancer/ contains the 0/ volume chunks, not just
    # a mesh from volume_man.obj.
    is_template_image = vfb_id == template_id

    needs_obj = status["has_swc"] and (not status["has_obj_man"] or
                                        (status["has_obj_man"] and not status["has_obj_man_faces"]))
    needs_precomputed = not status["has_neuroglancer"]
    # Template images need volume chunks, not just a mesh. If the existing
    # neuroglancer/ output was produced by the OBJ-only path, neuroglancer/0/
    # will be missing and we need to regenerate via the NRRD path.
    if (is_template_image and status["has_nrrd"]
            and status["has_neuroglancer"]
            and not status["has_volume_chunks"]):
        needs_precomputed = True
        # Wipe the mesh-only output (folder and/or its zipped artifact -- compress
        # removes the folder after zipping, see the compress step below) so
        # convert_nrrd writes a clean tree.
        ng_path = Path(image_dir) / "neuroglancer"
        ng_zip_path = Path(ng_zip)
        if not dry_run:
            if ng_path.is_dir():
                log.info("  [%s] Existing neuroglancer/ has no 0/ chunks — removing for regeneration", vfb_id)
                shutil.rmtree(ng_path)
            if ng_zip_path.is_file():
                log.info("  [%s] Existing neuroglancer.zip has no 0/ chunks — removing for regeneration", vfb_id)
                ng_zip_path.unlink()
    has_usable_obj = status["has_obj_man"] and status["has_obj_man_faces"]

    if force:
        if status["has_swc"]:
            needs_obj = True
        needs_precomputed = True

    if not needs_obj and not needs_precomputed:
        result["skipped"] = True
        log.debug("  [%s] Already complete, skipping", vfb_id)
        return result

    obj_status = ("mesh" if status["has_obj_man_faces"]
                  else "no-faces" if status["has_obj_man"]
                  else "missing")
    log.info("[%s] %s (swc=%s, nrrd=%s, obj_man=%s, ng=%s, ng_0=%s)",
             vfb_id, image_dir,
             status["has_swc"], status["has_nrrd"], obj_status,
             status["has_neuroglancer"], status["has_volume_chunks"])

    if dry_run:
        if needs_obj:
            log.info("  Would generate: volume_man.obj from volume.swc")
        # Mirrors the real Step 2a/2b dispatch below (has_usable_obj may still flip to
        # True post-dry-run once Step 1 actually generates the OBJ from SWC).
        predicted_has_obj = has_usable_obj or needs_obj
        predicted_use_nrrd = status["has_nrrd"] and (
            is_template_image or not predicted_has_obj or generate_mesh
        )
        suffix = " (template image)" if is_template_image else ""
        if needs_precomputed and predicted_use_nrrd:
            if generate_mesh and mesh_from_obj and predicted_has_obj:
                log.info("  Would generate: neuroglancer/ (including 0/ chunks) from volume.nrrd, "
                         "mesh from volume_man.obj%s", suffix)
            else:
                log.info("  Would generate: neuroglancer/ (including 0/ chunks) from volume.nrrd%s", suffix)
        elif needs_precomputed and predicted_has_obj:
            log.info("  Would generate: neuroglancer/ from volume_man.obj")
        return result

    # Step 1: Generate OBJ from SWC if needed
    if needs_obj:
        try:
            generate_obj_from_swc(image_dir)
            result["obj_generated"] = True
            has_usable_obj = True
        except Exception as e:
            result["error"] = f"OBJ generation failed: {e}"
            log.error("  ERROR generating OBJ: %s", e)
            return result

    # Template images always need volume chunks, so always go via NRRD. Non-template
    # images with a usable obj normally take the lightweight OBJ-only path (Step 2a)
    # and skip NRRD entirely -- but generate_mesh is an explicit request to run the
    # NRRD-based mesh pipeline, so it forces the NRRD path too, for any image;
    # mesh_from_obj then picks the mesh source within it (see Step 2b below).
    use_nrrd_path = needs_precomputed and status["has_nrrd"] and (
        is_template_image or not has_usable_obj or generate_mesh
    )

    # Step 2a: Generate precomputed from OBJ (mesh-only)
    if needs_precomputed and has_usable_obj and not use_nrrd_path:
        try:
            obj_path = os.path.join(image_dir, "volume_man.obj")
            ng_dir = os.path.join(image_dir, "neuroglancer")
            # Prefer this image's own volume.nrrd header for the physical voxel size --
            # matches the NRRD path's convention exactly (see convert_nrrd.detect_spacing),
            # so an OBJ-path mesh sits in the same coordinate space as anything produced
            # via the NRRD path (e.g. the template it's aligned to). Only falls back to
            # the passed-in `resolution` (default: DEFAULT_RESOLUTION) when this image
            # has no volume.nrrd of its own to read.
            obj_resolution = resolution
            if status["has_nrrd"] and _read_nrrd_voxel_size is not None:
                try:
                    obj_resolution = _read_nrrd_voxel_size(os.path.join(image_dir, "volume.nrrd"))
                except Exception as e:
                    log.warning("  [%s] Could not read volume.nrrd header for resolution, "
                                "falling back to %s: %s", vfb_id, resolution, e)
            # status["has_obj_man_faces"] reflects classify_dir()'s PRE-run snapshot --
            # True only if the obj already existed (and had faces) before Step 1 ran,
            # i.e. a pre-existing external obj (needs the Z,Y,X->X,Y,Z swap), never one
            # generate_obj_from_swc() just built this run from a .swc.
            write_precomputed(obj_path, ng_dir, resolution=obj_resolution,
                               swap_xz=status["has_obj_man_faces"])
            result["precomputed_generated"] = True
        except Exception as e:
            result["error"] = f"Precomputed generation failed: {e}"
            log.error("  ERROR generating precomputed: %s", e)

    # Step 2b: Generate precomputed (with 0/ volume chunks) from NRRD
    elif use_nrrd_path:
        if _convert_nrrd is None:
            result["error"] = "convert_nrrd module not available"
            log.error("  ERROR: convert_nrrd module could not be imported")
        else:
            try:
                nrrd_path = os.path.join(image_dir, "volume.nrrd")
                mesh_obj_path = (os.path.join(image_dir, "volume_man.obj")
                                 if generate_mesh and mesh_from_obj and has_usable_obj
                                 else None)
                if mesh_obj_path:
                    log.info("  Generating neuroglancer/ (with 0/ chunks) from NRRD: %s, "
                             "mesh from volume_man.obj", nrrd_path)
                else:
                    log.info("  Generating neuroglancer/ (with 0/ chunks) from NRRD: %s", nrrd_path)
                # convert_nrrd writes to {output_dir}/{dataset_name}/, so passing
                # image_dir + "neuroglancer" produces image_dir/neuroglancer/ with
                # the 0/ chunk directory, mesh/, segment_properties/ all inside it.
                _convert_nrrd(
                    nrrd_path=nrrd_path,
                    output_dir=image_dir,
                    dataset_name="neuroglancer",
                    merge_segments=merge_segments,
                    min_intensity=min_intensity,
                    max_intensity=max_intensity,
                    generate_mesh=generate_mesh,
                    mask=mask,
                    mesh_min_intensity=mesh_min_intensity,
                    mesh_max_intensity=mesh_max_intensity,
                    mesh_percentile=mesh_percentile,
                    mesh_format=mesh_format,
                    decimate_fraction=decimate_fraction,
                    max_simplification_error=max_simplification_error,
                    mesh_obj_path=mesh_obj_path,
                    # status["has_obj_man_faces"] is classify_dir()'s pre-run snapshot --
                    # True only for a pre-existing external obj (needs the swap), never
                    # one generate_obj_from_swc() just built this run.
                    mesh_obj_swap_xz=bool(mesh_obj_path) and status["has_obj_man_faces"],
                    verbose=log.isEnabledFor(logging.DEBUG),
                )
                result["precomputed_generated"] = True
            except Exception as e:
                result["error"] = f"NRRD precomputed generation failed: {e}"
                log.error("  ERROR generating precomputed from NRRD: %s", e)

    if result["precomputed_generated"] and compress:
        try:
            mesh_compression.zip_neuroglancer_dir(ng_dir, verbose=log.isEnabledFor(logging.DEBUG))
            # Remove the uncompressed source now that it's safely inside the zip --
            # otherwise both copies linger on disk (see classify_dir(), which treats
            # neuroglancer.zip alone as a complete, already-done output).
            shutil.rmtree(ng_dir)
        except Exception as e:
            result["error"] = f"Zipping neuroglancer/ failed: {e}"
            log.error("  ERROR zipping neuroglancer/: %s", e)

    return result


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="VFB Jenkins Pipeline: generate volume_man.obj and neuroglancer precomputed data"
    )
    input_group = parser.add_mutually_exclusive_group()
    input_group.add_argument("--ids", nargs="+",
                             help="Specific VFB IDs to process")
    input_group.add_argument("--ids-file",
                             help="File with VFB IDs (one per line)")

    parser.add_argument("--image-root", default=IMAGE_ROOT,
                        help="Root of VFB image data (default: /IMAGE_WRITE)")
    parser.add_argument("--use-kb", action="store_true",
                        help="Query kb.virtualflybrain.org for live images instead of scanning the filesystem")
    parser.add_argument("--template", nargs="+", metavar="TEMPLATE_ID",
                        help="Only process image directories aligned to the given template(s), "
                             "given as the anatomical template individual's short_form "
                             "(e.g. VFB_00101567 for JRC2018Unisex). Applied to the KB template "
                             "node (not the VFBc_ channel) and to the filesystem directory name. "
                             "When omitted, all templates are processed in the order defined "
                             "by DEFAULT_TEMPLATE_ORDER (JRC2018U, then JRCVNC2018U), then the rest. "
                             "Within each template group, the template image itself "
                             "(vfb_id == template_id) is processed first.")
    parser.add_argument("--resolution", type=float, nargs=3,
                        default=DEFAULT_RESOLUTION,
                        help="Fallback voxel resolution in um [x y z] (default: JRC2018U) for "
                             "the OBJ-only mesh path -- only used when an image directory has no "
                             "volume.nrrd of its own; when it does, that file's own header "
                             "spacing is used instead, to stay in the same coordinate space as "
                             "the NRRD path (see process_image()'s Step 2a).")
    parser.add_argument("--force", action="store_true",
                        help="Regenerate even if output already exists")
    parser.add_argument("--overwrite", action="store_true",
                        help="Delete existing neuroglancer/ folder and regenerate from scratch")
    parser.add_argument("--merge-segments", action="store_true",
                        help="Merge all non-zero voxels into a single segment for NRRD conversion")
    parser.add_argument("--min-intensity", type=int, default=None,
                        help="Minimum segment ID/intensity to keep in the STORED volume "
                             "(destructive, values below will be set to 0)")
    parser.add_argument("--max-intensity", type=int, default=None,
                        help="Maximum segment ID/intensity to keep in the STORED volume "
                             "(destructive, values above will be set to 0)")
    parser.add_argument("--generate-mesh", action="store_true",
                        help="Generate a mesh for the volume (default: off) -- most instances "
                             "already have a usable volume_man.obj and don't need one regenerated. "
                             "Forces the NRRD path (with 0/ volume chunks) even for a non-template "
                             "image that would otherwise take the lightweight OBJ-only path. By "
                             "default this runs marching cubes on the volume's external boundary; "
                             "pass --mesh-from-obj to source the mesh from an existing "
                             "volume_man.obj instead.")
    parser.add_argument("--mesh-from-obj", action="store_true",
                        help="With --generate-mesh: if this image directory has a usable "
                             "volume_man.obj, use it as the mesh source instead of running "
                             "marching cubes on the NRRD volume -- --mask/--mesh-*/"
                             "--decimate-fraction/--max-simplification-error are ignored for "
                             "that image, since no marching-cubes step runs. Falls back to "
                             "marching-cubes NRRD generation, same as without this flag, when no "
                             "usable volume_man.obj exists. Volume chunks (0/) are still "
                             "generated from the NRRD either way -- only the mesh source changes.")
    parser.add_argument("--mask", choices=["none", "otsu", "minmax"], default="none",
                        help="NRRD path, OPTIONAL. 'none' (default): no mask cleanup. 'otsu': "
                             "automatic threshold. 'minmax': explicit band -- also set "
                             "--mesh-percentile, OR --mesh-min-intensity/--mesh-max-intensity "
                             "(not both). Pick at most one. Known to backfire on dense data "
                             "(e.g. whole-brain templates) -- safest on sparse data.")
    parser.add_argument("--mesh-min-intensity", type=int, default=None,
                        help="--mask minmax only: fixed band floor (stored volume untouched)")
    parser.add_argument("--mesh-max-intensity", type=int, default=None,
                        help="--mask minmax only: fixed band ceiling (stored volume untouched)")
    parser.add_argument("--mesh-percentile", type=float, default=None,
                        help="--mask minmax only: per-sample percentile-derived floor, instead of "
                             "a fixed --mesh-min-intensity/--mesh-max-intensity band")
    parser.add_argument("--mesh-format", choices=["legacy", "multires_draco"], default="legacy",
                        help="NRRD path, pick at most one. 'legacy' (default): marching cubes, no "
                             "extra deps -- optionally add --decimate-fraction to simplify "
                             "afterward. 'multires_draco': CZI's multi-res Draco mesh instead "
                             "(extra deps: igneous/zmesh/DracoPy) -- tune with "
                             "--max-simplification-error. Can't combine legacy decimation with Draco.")
    parser.add_argument("--decimate-fraction", type=float, default=0.0,
                        help="NRRD path, OPTIONAL, --mesh-format legacy only. pyfqmr decimation "
                             "target reduction (default: 0.0 = off; e.g. 0.7 removes ~70%% of "
                             "triangles). Safe on both sparse and dense data.")
    parser.add_argument("--max-simplification-error", type=int, default=10,
                        help="NRRD path, --mesh-format multires_draco only. Draco simplification "
                             "error tolerance (default: 10) -- lower is gentler.")
    parser.add_argument("--compress", action="store_true",
                        help="Zip each instance's neuroglancer/ folder into a single artifact "
                             "(default: off, leaves the raw uncompressed tree as-is). No "
                             "gzip/brotli choice anymore -- if set, this simply zips the whole "
                             "folder; see mesh_compression/zip_output.py.")
    parser.add_argument("--dry-run", action="store_true",
                        help="Show what would be done without making changes")
    parser.add_argument("--verbose", "-v", action="store_true",
                        help="Verbose output")
    args = parser.parse_args()

    if _validate_mesh_params is not None:
        try:
            _validate_mesh_params(args.mask, args.mesh_min_intensity, args.mesh_max_intensity,
                                   args.mesh_percentile, args.mesh_format, args.decimate_fraction,
                                   args.generate_mesh, args.verbose)
        except ValueError as e:
            parser.error(str(e))

    # Setup logging
    level = logging.DEBUG if args.verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    vfb_data_dir = os.path.join(args.image_root, "VFB", "i")

    if not os.path.isdir(vfb_data_dir):
        log.error("VFB data directory not found: %s", vfb_data_dir)
        log.error("Set --image-root to the directory that contains VFB/i/")
        sys.exit(1)

    # Collect targets
    if args.ids:
        targets = []
        for vfb_id in args.ids:
            for d in find_image_dir(vfb_id, vfb_data_dir):
                template_id = os.path.basename(d)
                targets.append((d, vfb_id, template_id))
            if not find_image_dir(vfb_id, vfb_data_dir):
                log.warning("No directories found for %s", vfb_id)
    elif args.ids_file:
        targets = []
        with open(args.ids_file) as f:
            for line in f:
                vfb_id = line.strip()
                if not vfb_id or vfb_id.startswith("#"):
                    continue
                for d in find_image_dir(vfb_id, vfb_data_dir):
                    template_id = os.path.basename(d)
                    targets.append((d, vfb_id, template_id))
    elif args.use_kb:
        log.info("Using KB to discover live image directories...")
        targets = list(iter_kb_image_dirs(args.image_root, templates=args.template))
        log.info("Found %d live image directories from KB", len(targets))
    else:
        # Scan all
        log.info("Scanning %s for image directories...", vfb_data_dir)
        targets = list(iter_image_dirs(vfb_data_dir))
        log.info("Found %d image directories", len(targets))

    # Filter / order by template. Template images (vfb_id == template_id) are
    # fetched directly from the KB and prepended so they always run first,
    # regardless of how (or whether) the main query returned them.
    if args.template:
        wanted = set(args.template)
        before = len(targets)
        targets = [t for t in targets if t[2] in wanted]
        log.info("Template filter %s: %d / %d directories match",
                 sorted(wanted), len(targets), before)

        order = {tid: i for i, tid in enumerate(args.template)}

        template_targets: list[tuple] = []
        if args.use_kb:
            try:
                template_targets = get_kb_template_image_dirs(args.template, args.image_root)
            except Exception as e:
                log.warning("Could not fetch template image folders from KB: %s", e)

        # Drop any main-query entries that point at the same folder as a
        # template image, so we don't process the template directory twice.
        template_dirs = {tt[0] for tt in template_targets}
        if template_dirs:
            targets = [t for t in targets if t[0] not in template_dirs]

        template_targets.sort(key=lambda t: order.get(t[2], len(order)))
        targets.sort(key=lambda t: (order.get(t[2], len(order)), t[1]))

        for tt in template_targets:
            log.info("Template image first: %s (%s)", tt[0], tt[1])
        targets = template_targets + targets
    else:
        # Default: order by template priority; within a group, template image
        # first (vfb_id == template_id), then the rest by vfb_id.
        priority = {tid: i for i, tid in enumerate(DEFAULT_TEMPLATE_ORDER)}
        targets.sort(key=lambda t: (priority.get(t[2], len(priority)),
                                    t[2],
                                    0 if t[1] == t[2] else 1,
                                    t[1]))

    if not targets:
        log.info("No image directories to process")
        return

    # Process
    start = time.time()
    stats = {
        "total": len(targets),
        "obj_generated": 0,
        "precomputed_generated": 0,
        "skipped": 0,
        "errors": 0,
    }

    for i, (image_dir, vfb_id, template_id) in enumerate(targets, 1):
        if i % 500 == 0 or args.verbose:
            log.info("Progress: %d / %d", i, stats["total"])

        result = process_image(
            image_dir, vfb_id, template_id,
            force=args.force, overwrite=args.overwrite,
            dry_run=args.dry_run,
            merge_segments=args.merge_segments,
            min_intensity=args.min_intensity,
            max_intensity=args.max_intensity,
            resolution=args.resolution,
            generate_mesh=args.generate_mesh,
            mesh_from_obj=args.mesh_from_obj,
            mask=args.mask,
            mesh_min_intensity=args.mesh_min_intensity,
            mesh_max_intensity=args.mesh_max_intensity,
            mesh_percentile=args.mesh_percentile,
            mesh_format=args.mesh_format,
            decimate_fraction=args.decimate_fraction,
            max_simplification_error=args.max_simplification_error,
            compress=args.compress,
        )

        if result["obj_generated"]:
            stats["obj_generated"] += 1
        if result["precomputed_generated"]:
            stats["precomputed_generated"] += 1
        if result["skipped"]:
            stats["skipped"] += 1
        if result["error"]:
            stats["errors"] += 1

    elapsed = time.time() - start

    # Summary
    log.info("=" * 60)
    log.info("Pipeline Summary%s", " (DRY RUN)" if args.dry_run else "")
    log.info("=" * 60)
    log.info("  Total image dirs:      %d", stats["total"])
    log.info("  OBJ generated:         %d", stats["obj_generated"])
    log.info("  Precomputed generated: %d", stats["precomputed_generated"])
    log.info("  Skipped (up to date):  %d", stats["skipped"])
    log.info("  Errors:                %d", stats["errors"])
    log.info("  Elapsed:               %.1fs", elapsed)

    if stats["errors"] > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
