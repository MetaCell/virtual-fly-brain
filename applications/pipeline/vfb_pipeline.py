#!/usr/bin/env python3
"""
VFB pipeline: precomputed (Neuroglancer-format) data for every VFB image folder.

For each image folder
  /data/VFB/i/{first4}/{last4}/{template_id}/   (the image store, read-write)
  ├── volume.nrrd           (existing)
  ├── volume.swc            (existing, skeletons only)
  ├── volume_man.obj        (existing mesh; generated from volume.swc when missing)
  ├── volume.obj, volume.wlz, thumbnail*.png   (existing, untouched)
  └── precomputed.zip       ← this pipeline's one output: a precomputed dataset
                              (info, 0/ chunks, mesh/) zipped as a single archive
                              that Neuroglancer reads through its zip kvstore:
                              https://.../VFB_xxx/precomputed.zip|zip:|neuroglancer-precomputed:
                              plus provenance.json (pipeline version + source file
                              stamps) so a re-run knows when it is up to date.

What gets written depends on what the image IS (its VFB category, from the KB),
not on the voxel dtype -- every VFB NRRD is uint8:

  category      layer          chunks (0/)      mesh
  template      image          intensities      none
  expression    image          intensities      none       (GAL4/split patterns, MCFO fragments)
  object        segmentation   {0,1}            segment 1: volume_man.obj when it has faces,
                                                 else generated from volume.swc, else
                                                 marching cubes on the NRRD
                                                 (neurons, clones, painted domains)

Axes and units: everything is X, Y, Z -- the NRRD as pynrrd returns it, the OBJ/SWC
vertices, and the precomputed output. No transposes, no swaps. Source files are in
microns; the precomputed resolution and mesh vertices are written in nanometres, the
unit the precomputed spec defines (so VFB data composes with other precomputed
sources such as FlyWire's).

The build happens in --work-dir (local scratch), and only the finished zip is
moved into the image folder: written as precomputed.zip.tmp-<pid> and renamed, so
a reader never sees a partial file and a killed run leaves nothing to mistake for
output.

Discovery: --use-kb (production datasets only, with the category) or a filesystem
scan (category: template when vfb_id == template_id, else decided from the data).

Usage:
  python vfb_pipeline.py --image-root /data --use-kb --template VFB_00101567 --dry-run
  python vfb_pipeline.py --image-root /data --ids VFB_00101567 VFB_00102107 --work-dir /scratch
  python vfb_pipeline.py --image-root /data --ids-file batch.txt --work-dir /scratch
"""
from __future__ import annotations

import argparse
import datetime as _dt
import json
import logging
import os
import shutil
import sys
import time
import zipfile
from pathlib import Path

import numpy as np
import requests
import trimesh
from cloudvolume import CloudVolume
from cloudvolume.mesh import Mesh

from convert_nrrd import (
    NM_PER_UM,
    convert_nrrd as _convert_nrrd,
    validate_mesh_params as _validate_mesh_params,
)
import mesh_compression

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# Bump when the output format or conversion changes in a way that should make
# existing precomputed.zip files stale (they are regenerated on the next run).
PIPELINE_VERSION = "2"

OUTPUT_NAME = "precomputed"               # work folder name and the zip's basename
OUTPUT_ZIP = OUTPUT_NAME + ".zip"
PROVENANCE_NAME = "provenance.json"       # entry inside the zip (Neuroglancer ignores it)
SOURCE_FILES = ("volume.nrrd", "volume_man.obj", "volume.swc")   # stamped in provenance

IMAGE_ROOT = "/data"
VFB_DATA_DIR = os.path.join(IMAGE_ROOT, "VFB", "i")

# Fallback resolution (um, JRC2018Unisex) for a mesh-only build of an image folder
# with no volume.nrrd to read the real voxel size from.
DEFAULT_RESOLUTION = [0.5189161, 0.5189161, 1.0]

# Never converted, whatever else is asked for: the FlyEM hemibrain-aligned versions of images are not wanted.
EXCLUDED_TEMPLATES = {"VFB_00101384"}  # JRC FlyEM Hemibrain

KB_ENDPOINT = os.environ.get("VFB_KB", "http://kb.virtualflybrain.org")
KB_USER = "neo4j"          # the published read-only pair
KB_PASSWORD = "vfb"
KB_FOLDER_URL_PREFIX = "http://www.virtualflybrain.org/data/"

CATEGORY_TEMPLATE = "template"
CATEGORY_EXPRESSION = "expression"
CATEGORY_OBJECT = "object"

log = logging.getLogger("vfb_pipeline")


# ---------------------------------------------------------------------------
# KB discovery (read-only Cypher over the HTTP transaction endpoint)
# ---------------------------------------------------------------------------

def kb_query(cypher: str, endpoint: str = KB_ENDPOINT) -> list[dict]:
    """Run one read-only Cypher statement and return rows as dicts."""
    r = requests.post(f"{endpoint}/db/data/transaction/commit",
                      auth=(KB_USER, KB_PASSWORD), timeout=600,
                      json={"statements": [{"statement": cypher}]})
    r.raise_for_status()
    body = r.json()
    if body.get("errors"):
        raise RuntimeError(f"KB query failed: {body['errors']}")
    res = body["results"][0]
    return [dict(zip(res["columns"], row["row"])) for row in res["data"]]


def _safe_ids(ids: list[str] | None) -> list[str]:
    """Only simple VFB-style short_forms go into Cypher literals."""
    return [t for t in (ids or []) if t and all(ch.isalnum() or ch == "_" for ch in t)]


def _folder_to_dir(folder_url: str, image_root: str) -> str | None:
    if not folder_url or not folder_url.startswith(KB_FOLDER_URL_PREFIX):
        return None
    return os.path.join(image_root, folder_url[len(KB_FOLDER_URL_PREFIX):].rstrip("/"))


def iter_kb_image_dirs(image_root: str = IMAGE_ROOT, templates: list[str] | None = None):
    """Yield (image_dir, vfb_id, template_id, category) for every live image in a
    production dataset, registered to one of `templates` (all templates when None).

    `in_register_with` points at the template *channel* (VFBc_…); the anatomical
    template individual (VFB_…) is reached via (channel)-[:depicts]->(template), so
    the template filter is applied there. JFRC2 (VFBc_00017894) is excluded as before.

    category: 'expression' when the individual is typed by a VFBexp_ (expression
    pattern / split) or VFBext_ (fragment) class, else 'object' (FBbt-typed neurons,
    clones, painted domains). Template images come from iter_kb_template_dirs().
    """
    safe = _safe_ids(templates)
    clause = f"  AND t.short_form IN [{', '.join(repr(t) for t in safe)}]\n" if safe else ""
    cypher = f"""
        MATCH (c:Individual)-[:depicts]->(i:Individual)-[:has_source]->(ds:DataSet)
        MATCH (c)-[r:in_register_with]->(tc:Template)-[:depicts]->(t:Template)
        WHERE ds.production[0] = true
          AND r.folder IS NOT NULL
          AND (r.block IS NULL OR NOT r.block[0] = 'Missing Image')
          AND NOT tc.short_form = 'VFBc_00017894'
        {clause}
        OPTIONAL MATCH (i)-[:INSTANCEOF]->(cl:Class)
        WITH DISTINCT i, r.folder[0] AS folder, t.short_form AS template,
             collect(DISTINCT cl.short_form) AS classes
        RETURN i.short_form AS id, folder, template,
               CASE WHEN any(x IN classes WHERE x STARTS WITH 'VFBexp_' OR x STARTS WITH 'VFBext_')
                    THEN '{CATEGORY_EXPRESSION}' ELSE '{CATEGORY_OBJECT}' END AS category
    """
    log.info("Querying KB at %s for live image directories...", KB_ENDPOINT)
    n = 0
    for row in kb_query(cypher):
        image_dir = _folder_to_dir(row["folder"], image_root)
        if image_dir is None:
            log.debug("  Skipping unexpected folder URL: %s", row["folder"])
            continue
        n += 1
        yield image_dir, row["id"], row["template"] or os.path.basename(image_dir), row["category"]
    log.info("KB returned %d live image directories", n)


def iter_kb_template_dirs(image_root: str = IMAGE_ROOT, templates: list[str] | None = None):
    """Yield (image_dir, template_id, template_id, 'template') for each template's own
    image folder. Templates usually have no has_source DataSet, so the main query
    omits them; their folder lives on the channel's self in_register_with edge."""
    safe = _safe_ids(templates)
    clause = f"  AND t.short_form IN [{', '.join(repr(t) for t in safe)}]\n" if safe else ""
    cypher = f"""
        MATCH (tc:Template)-[:depicts]->(t:Template)
        MATCH (tc)-[rt:in_register_with]->(tc)
        WHERE rt.folder IS NOT NULL
          AND NOT tc.short_form = 'VFBc_00017894'
        {clause}
        RETURN DISTINCT t.short_form AS template, rt.folder[0] AS folder
    """
    for row in kb_query(cypher):
        image_dir = _folder_to_dir(row["folder"], image_root)
        if image_dir is not None:
            yield image_dir, row["template"], row["template"], CATEGORY_TEMPLATE


# ---------------------------------------------------------------------------
# Discovery: find image directories and classify them
# ---------------------------------------------------------------------------

_VOLUME_FILES = {"volume.nrrd", "volume.swc", "volume.wlz", "volume.obj", "volume_man.obj"}


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


def _stamp(path: Path) -> dict | None:
    try:
        st = path.stat()
    except FileNotFoundError:
        return None
    return {"size": st.st_size, "mtime": int(st.st_mtime)}


def source_stamps(image_dir: str) -> dict:
    """size/mtime of the files the output is derived from (None when absent)."""
    d = Path(image_dir)
    return {name: _stamp(d / name) for name in SOURCE_FILES}


def read_provenance(zip_path: Path) -> dict | None:
    """provenance.json from inside precomputed.zip, or None if absent/unreadable.
    Reads only the central directory plus one small entry."""
    try:
        with zipfile.ZipFile(zip_path) as zf:
            if PROVENANCE_NAME not in zf.namelist():
                return None
            return json.loads(zf.read(PROVENANCE_NAME))
    except (zipfile.BadZipFile, OSError, ValueError):
        return None


def classify_dir(image_dir: str) -> dict:
    """What is in an image directory and whether its precomputed.zip is current."""
    d = Path(image_dir)
    obj = d / "volume_man.obj"
    zip_path = d / OUTPUT_ZIP
    has_zip = zip_path.is_file()
    prov = read_provenance(zip_path) if has_zip else None
    stamps = source_stamps(image_dir)
    up_to_date = bool(
        prov
        and prov.get("pipeline_version") == PIPELINE_VERSION
        and prov.get("sources") == stamps
    )
    return {
        "has_swc": (d / "volume.swc").is_file(),
        "has_nrrd": (d / "volume.nrrd").is_file(),
        "has_obj_man": obj.is_file(),
        "has_obj_man_faces": has_faces(str(obj)) if obj.is_file() else False,
        "has_zip": has_zip,
        "provenance": prov,
        "sources": stamps,
        "up_to_date": up_to_date,
    }


# ---------------------------------------------------------------------------
# SWC → OBJ conversion
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
    tmp_path = f"{obj_path}.tmp-{os.getpid()}"
    mesh.export(tmp_path, file_type="obj")
    os.replace(tmp_path, obj_path)          # readers never see a partial file
    log.info("  Saved: %s (%d vertices, %d faces)",
             obj_path, len(mesh.vertices), len(mesh.faces))
    return obj_path


# ---------------------------------------------------------------------------
# OBJ → Neuroglancer precomputed
# ---------------------------------------------------------------------------


# ---------------------------------------------------------------------------
# OBJ → precomputed (mesh only, for an object with no volume.nrrd)
# ---------------------------------------------------------------------------

def write_mesh_only_precomputed(obj_path: str, output_dir: str,
                                resolution: list[float] = DEFAULT_RESOLUTION,
                                segment_id: int = 1) -> None:
    """A segmentation dataset holding just one legacy mesh (no 0/ chunks).

    OBJ vertices are X, Y, Z in microns, as is `resolution`; both are written in
    nanometres (the spec's unit), nothing is swapped. The declared grid is anchored
    on the mesh's bounding box (voxel_offset in VOXEL units) so Neuroglancer's
    default view lands on it.
    """
    mesh = trimesh.load(obj_path, force="mesh")
    if not isinstance(mesh, trimesh.Trimesh):
        raise ValueError("Could not load as triangle mesh: " + obj_path)
    mesh.vertices = mesh.vertices * NM_PER_UM
    resolution = [r * NM_PER_UM for r in resolution]
    log.info("  Writing mesh-only precomputed: %s (%d verts, %d faces)",
             output_dir, len(mesh.vertices), len(mesh.faces))
    os.makedirs(output_dir, exist_ok=True)
    mesh_max = mesh.vertices.max(axis=0)
    mesh_min = mesh.vertices.min(axis=0)
    size = [int(np.ceil((mesh_max[i] - mesh_min[i]) / resolution[i])) + 2 for i in range(3)]
    voxel_offset = [int(np.floor(mesh_min[i] / resolution[i])) for i in range(3)]
    info = {
        "data_type": "uint8",
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
    vol = CloudVolume("file://" + output_dir, mip=0, info=info, compress=False)
    vol.commit_info()
    mesh_dir = os.path.join(output_dir, "mesh")
    os.makedirs(mesh_dir, exist_ok=True)
    with open(os.path.join(mesh_dir, "info"), "w") as f:
        json.dump({"@type": "neuroglancer_legacy_mesh"}, f)
    vol.mesh.put(Mesh(mesh.vertices.astype(np.float32), mesh.faces.astype(np.uint32),
                      segid=segment_id), compress=False)


# ---------------------------------------------------------------------------
# Per-image processing
# ---------------------------------------------------------------------------

def decide_layer_type(category: str | None, status: dict, nrrd_path: str | None) -> str:
    """image for templates and expression patterns, segmentation for objects.
    Without a KB category (filesystem scan): a volume_man.obj with faces means an
    object; otherwise a single-valued mask is an object and intensities are an image."""
    if category == CATEGORY_TEMPLATE or category == CATEGORY_EXPRESSION:
        return "image"
    if category == CATEGORY_OBJECT:
        return "segmentation"
    if status["has_obj_man_faces"] or status["has_swc"]:
        return "segmentation"
    if nrrd_path:
        import nrrd
        data, _ = nrrd.read(nrrd_path)
        return "segmentation" if len(np.unique(data[data > 0])) <= 1 else "image"
    return "segmentation"


def _write_provenance(folder: str, **fields) -> None:
    with open(os.path.join(folder, PROVENANCE_NAME), "w") as f:
        json.dump({"pipeline_version": PIPELINE_VERSION,
                   "generated": _dt.datetime.now(_dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
                   **fields}, f, indent=1, sort_keys=True)


def _replace_into(src: str, dest: str) -> None:
    """Move a finished file into place atomically for readers: copy to a sibling
    tmp name in the destination folder, then rename over the final name."""
    tmp = f"{dest}.tmp-{os.getpid()}"
    try:
        shutil.copyfile(src, tmp)
        os.replace(tmp, dest)
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)
        if os.path.exists(src):
            os.remove(src)


def process_image(image_dir: str, vfb_id: str, template_id: str, category: str | None,
                  work_dir: str, force: bool = False, dry_run: bool = False,
                  resolution: list[float] = DEFAULT_RESOLUTION,
                  mask: str = "none", mesh_min_intensity: int | None = None,
                  mesh_max_intensity: int | None = None, mesh_percentile: float | None = None,
                  mesh_format: str = "legacy", decimate_fraction: float = 0.0,
                  max_simplification_error: int = 10, layer_type: str = "auto",
                  compress: bool = True) -> dict:
    """Build precomputed.zip for one image folder. Returns a status dict."""
    status = classify_dir(image_dir)
    result = {"vfb_id": vfb_id, "template_id": template_id, "image_dir": image_dir,
              "obj_generated": False, "precomputed_generated": False,
              "skipped": False, "error": None}

    if status["up_to_date"] and not force:
        result["skipped"] = True
        log.debug("  [%s] precomputed.zip is current, skipping", vfb_id)
        return result
    if not status["has_nrrd"] and not status["has_obj_man_faces"] and not status["has_swc"]:
        result["skipped"] = True
        log.info("  [%s] nothing to convert (no volume.nrrd, volume_man.obj or volume.swc)", vfb_id)
        return result

    nrrd_path = os.path.join(image_dir, "volume.nrrd") if status["has_nrrd"] else None
    lt = layer_type if layer_type != "auto" else decide_layer_type(category, status, nrrd_path)
    result.update(category=category, layer_type=lt, pipeline_version=PIPELINE_VERSION,
                  sources=status["sources"])
    needs_obj = lt == "segmentation" and status["has_swc"] and not status["has_obj_man_faces"]
    have_obj = status["has_obj_man_faces"] or needs_obj
    if lt == "segmentation":
        mesh_source = ("volume_man.obj" if status["has_obj_man_faces"]
                       else "volume.swc" if needs_obj
                       else "marching-cubes")
    else:
        mesh_source = None

    log.info("[%s] %s category=%s layer=%s nrrd=%s obj=%s swc=%s zip=%s%s",
             vfb_id, image_dir, category, lt, status["has_nrrd"],
             "faces" if status["has_obj_man_faces"] else status["has_obj_man"],
             status["has_swc"], status["has_zip"],
             " (stale)" if status["has_zip"] else "")
    if dry_run:
        if needs_obj:
            log.info("  Would generate: volume_man.obj from volume.swc")
        log.info("  Would write: %s (%s%s%s)", OUTPUT_ZIP, lt,
                 ", chunks from volume.nrrd" if nrrd_path else ", mesh only",
                 f", mesh from {mesh_source}" if mesh_source else "")
        return result

    # Step 1: volume_man.obj from volume.swc when an object has no usable mesh
    if needs_obj:
        try:
            generate_obj_from_swc(image_dir)
            result["obj_generated"] = True
            status["sources"] = source_stamps(image_dir)
        except Exception as e:
            result["error"] = f"OBJ generation failed: {e}"
            log.error("  ERROR generating OBJ: %s", e)
            return result

    # Step 2: build the dataset in the work dir
    t0 = time.time()
    build_root = os.path.join(work_dir, f"{vfb_id}-{template_id}")
    out_dir = os.path.join(build_root, OUTPUT_NAME)
    shutil.rmtree(build_root, ignore_errors=True)
    os.makedirs(build_root)
    obj_path = os.path.join(image_dir, "volume_man.obj") if have_obj else None
    try:
        if nrrd_path:
            _convert_nrrd(nrrd_path=nrrd_path, output_dir=build_root, dataset_name=OUTPUT_NAME,
                          layer_type=lt, generate_mesh=(lt == "segmentation"),
                          mesh_obj_path=obj_path if lt == "segmentation" else None,
                          mask=mask, mesh_min_intensity=mesh_min_intensity,
                          mesh_max_intensity=mesh_max_intensity, mesh_percentile=mesh_percentile,
                          mesh_format=mesh_format, decimate_fraction=decimate_fraction,
                          max_simplification_error=max_simplification_error,
                          verbose=log.isEnabledFor(logging.DEBUG))
        else:
            write_mesh_only_precomputed(obj_path, out_dir, resolution=resolution)
        _write_provenance(out_dir, vfb_id=vfb_id, template_id=template_id, category=category,
                          layer_type=lt, mesh_source=mesh_source, sources=status["sources"])

        # Step 3: zip and move the one finished file into the image folder
        if compress:
            zip_path = mesh_compression.zip_neuroglancer_dir(out_dir, verbose=log.isEnabledFor(logging.DEBUG))
            _replace_into(zip_path, os.path.join(image_dir, OUTPUT_ZIP))
        else:
            final = os.path.join(image_dir, OUTPUT_NAME)
            shutil.rmtree(final, ignore_errors=True)
            shutil.copytree(out_dir, final)
        result["precomputed_generated"] = True
        result["bytes"] = os.path.getsize(os.path.join(image_dir, OUTPUT_ZIP)) if compress else None
        result["seconds"] = round(time.time() - t0, 1)
        log.info("  [%s] wrote %s (%s, %.1f MB) in %.1fs", vfb_id, OUTPUT_ZIP if compress else OUTPUT_NAME, lt,
                 (result["bytes"] or 0) / 1e6, result["seconds"])
    except Exception as e:
        result["error"] = f"Precomputed generation failed: {e}"
        log.error("  ERROR generating precomputed: %s", e, exc_info=log.isEnabledFor(logging.DEBUG))
    finally:
        shutil.rmtree(build_root, ignore_errors=True)
    return result


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def _order_targets(targets: list[tuple], template_order: list[str]) -> list[tuple]:
    """Template groups in the requested order (then the rest); within a group the
    template image itself first, then by id."""
    rank = {tid: i for i, tid in enumerate(template_order)}
    return sorted(targets, key=lambda t: (rank.get(t[2], len(rank)), t[2],
                                          0 if t[1] == t[2] else 1, t[1]))


def main():
    parser = argparse.ArgumentParser(
        description="VFB pipeline: precomputed.zip (Neuroglancer precomputed) for each image folder")
    g = parser.add_mutually_exclusive_group()
    g.add_argument("--ids", nargs="+", help="Specific VFB IDs to process")
    g.add_argument("--ids-file", help="File with VFB IDs (one per line; '#' comments)")
    g.add_argument("--use-kb", action="store_true",
                   help="Discover live images (production datasets) and their category from the KB")
    g.add_argument("--targets-file",
                   help="TSV of image_dir<TAB>vfb_id<TAB>template_id<TAB>category (as --list-targets "
                        "writes it): one batch of a planned run, no KB access needed")
    parser.add_argument("--list-targets", metavar="TSV",
                        help="Write the discovered targets (after --template filtering and ordering) "
                             "to this TSV and exit without converting anything")
    parser.add_argument("--results", metavar="JSONL",
                        help="Append one JSON line per processed image (status, size, seconds, error)")
    parser.add_argument("--image-root", default=IMAGE_ROOT,
                        help="Directory that contains VFB/i/ (default: %(default)s)")
    parser.add_argument("--work-dir", default=None,
                        help="Local scratch for building each dataset before its zip is moved into "
                             "the image folder (default: a temp dir). Needs room for one uncompressed "
                             "dataset (a full template-sized image volume is ~120 MB raw chunks).")
    parser.add_argument("--template", nargs="+", metavar="TEMPLATE_ID",
                        help="Only process images aligned to these template short_forms "
                             "(e.g. VFB_00101567), in this order. Required (except with "
                             "--targets-file): space is limited, so only alignments named here get a "
                             "precomputed.zip. The template image itself always goes first.")
    parser.add_argument("--layer-type", choices=["auto", "image", "segmentation"], default="auto",
                        help="Override the per-image decision (default: auto = from the KB category)")
    parser.add_argument("--resolution", type=float, nargs=3, default=DEFAULT_RESOLUTION,
                        help="Voxel size [x y z] in um for a mesh-only build of a folder with no "
                             "volume.nrrd (default: JRC2018U)")
    parser.add_argument("--force", action="store_true",
                        help="Regenerate even when precomputed.zip is current")
    parser.add_argument("--no-compress", action="store_true",
                        help="Debug: leave an uncompressed precomputed/ folder in the image dir "
                             "instead of precomputed.zip")
    parser.add_argument("--mask", choices=["none", "otsu", "minmax"], default="none",
                        help="Marching-cubes path only (objects with no mesh): mask cleanup before "
                             "meshing. 'minmax' also needs --mesh-percentile or "
                             "--mesh-min-intensity/--mesh-max-intensity.")
    parser.add_argument("--mesh-min-intensity", type=int, default=None)
    parser.add_argument("--mesh-max-intensity", type=int, default=None)
    parser.add_argument("--mesh-percentile", type=float, default=None)
    parser.add_argument("--mesh-format", choices=["legacy", "multires_draco"], default="legacy")
    parser.add_argument("--decimate-fraction", type=float, default=0.0,
                        help="Marching-cubes path, legacy format: pyfqmr target reduction (0 = off)")
    parser.add_argument("--max-simplification-error", type=int, default=10)
    parser.add_argument("--dry-run", action="store_true", help="Show what would be done")
    parser.add_argument("--verbose", "-v", action="store_true")
    args = parser.parse_args()

    try:
        _validate_mesh_params(args.mask, args.mesh_min_intensity, args.mesh_max_intensity,
                              args.mesh_percentile, args.mesh_format, args.decimate_fraction,
                              True, args.verbose)
    except ValueError as e:
        parser.error(str(e))

    logging.basicConfig(level=logging.INFO,
                        format="%(asctime)s [%(levelname)s] %(message)s", datefmt="%Y-%m-%d %H:%M:%S")
    if args.verbose:
        log.setLevel(logging.DEBUG)       # ours only -- cloud-volume's schema layer is very chatty at DEBUG

    vfb_data_dir = os.path.join(args.image_root, "VFB", "i")
    if not os.path.isdir(vfb_data_dir):
        log.error("VFB data directory not found: %s (set --image-root to the dir containing VFB/i/)",
                  vfb_data_dir)
        sys.exit(1)

    if not args.template and not args.targets_file:
        parser.error("--template is required: name the template alignment(s) to convert (e.g. VFB_00101567)")

    # Collect (image_dir, vfb_id, template_id, category)
    if args.ids or args.ids_file:
        ids = args.ids or [l.strip() for l in open(args.ids_file) if l.strip() and not l.startswith("#")]
        targets = []
        for vfb_id in ids:
            dirs = find_image_dir(vfb_id, vfb_data_dir)
            if not dirs:
                log.warning("No directories found for %s", vfb_id)
            for d in dirs:
                tid = os.path.basename(d)
                targets.append((d, vfb_id, tid, CATEGORY_TEMPLATE if vfb_id == tid else None))
    elif args.targets_file:
        targets = []
        with open(args.targets_file) as f:
            for line in f:
                if line.strip() and not line.startswith("#"):
                    d, v, t, c = line.rstrip("\n").split("\t")
                    targets.append((d, v, t, c or None))
    elif args.use_kb:
        targets = list(iter_kb_template_dirs(args.image_root, args.template))
        seen = {t[0] for t in targets}
        targets += [t for t in iter_kb_image_dirs(args.image_root, args.template) if t[0] not in seen]
    else:
        log.info("Scanning %s for image directories...", vfb_data_dir)
        targets = [(d, v, t, CATEGORY_TEMPLATE if v == t else None) for d, v, t in iter_image_dirs(vfb_data_dir)]
        log.info("Found %d image directories", len(targets))

    # Only the templates named with --template (space is limited: the operator says which alignments get a
    # precomputed.zip) and never an excluded one. A --targets-file was already made by a --template run.
    wanted = set(args.template) if args.template else None
    before = len(targets)
    targets = [t for t in targets if t[2] not in EXCLUDED_TEMPLATES and (wanted is None or t[2] in wanted)]
    log.info("Template filter %s (excluding %s): %d / %d directories match",
             sorted(wanted) if wanted else "targets file", sorted(EXCLUDED_TEMPLATES), len(targets), before)
    targets = _order_targets(targets, args.template or [])
    if not targets:
        log.info("No image directories to process")
        return
    if args.list_targets:
        with open(args.list_targets, "w") as f:
            for d, v, t, c in targets:
                f.write(f"{d}\t{v}\t{t}\t{c or ''}\n")
        log.info("Wrote %d targets to %s", len(targets), args.list_targets)
        return

    work_dir = args.work_dir or os.path.join(os.environ.get("TMPDIR", "/tmp"), "vfb-precomputed")
    os.makedirs(work_dir, exist_ok=True)

    start = time.time()
    stats = {"total": len(targets), "obj_generated": 0, "precomputed_generated": 0, "skipped": 0, "errors": 0}
    for i, (image_dir, vfb_id, template_id, category) in enumerate(targets, 1):
        if i % 500 == 0 or args.verbose:
            log.info("Progress: %d / %d", i, stats["total"])
        r = process_image(image_dir, vfb_id, template_id, category, work_dir,
                          force=args.force, dry_run=args.dry_run, resolution=args.resolution,
                          mask=args.mask, mesh_min_intensity=args.mesh_min_intensity,
                          mesh_max_intensity=args.mesh_max_intensity, mesh_percentile=args.mesh_percentile,
                          mesh_format=args.mesh_format, decimate_fraction=args.decimate_fraction,
                          max_simplification_error=args.max_simplification_error,
                          layer_type=args.layer_type, compress=not args.no_compress)
        for k in ("obj_generated", "precomputed_generated", "skipped"):
            stats[k] += bool(r[k])
        stats["errors"] += bool(r["error"])
        if args.results and not args.dry_run:
            with open(args.results, "a") as f:
                f.write(json.dumps(r, sort_keys=True) + "\n")

    log.info("=" * 60)
    log.info("Pipeline Summary%s", " (DRY RUN)" if args.dry_run else "")
    log.info("=" * 60)
    log.info("  Total image dirs:      %d", stats["total"])
    log.info("  OBJ generated:         %d", stats["obj_generated"])
    log.info("  Precomputed generated: %d", stats["precomputed_generated"])
    log.info("  Skipped (up to date):  %d", stats["skipped"])
    log.info("  Errors:                %d", stats["errors"])
    log.info("  Elapsed:               %.1fs", time.time() - start)
    if stats["errors"] > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
