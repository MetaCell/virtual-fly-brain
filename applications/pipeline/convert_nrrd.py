#!/usr/bin/env python3
"""
Convert NRRD volume files to Neuroglancer precomputed format
with a mesh generated from the external volume boundary.

This script:
  1. Reads the NRRD file
  2. Converts to precomputed format (segmentation or image layer)
  3. For segmentation data, generates a single mesh from the outer boundary
     of all non-zero voxels via marching cubes

Volume conversion approach matches MetaCell/virtual-fly-brain converter.py:
  - Detects voxel spacing and origin from NRRD header
  - Writes data as-is (no thresholding/relabeling for integer data)
  - Writes chunks/mesh fragments uncompressed -- the whole neuroglancer/ output folder is
    zipped as a single artifact afterward (see mesh_compression/zip_output.py) instead of per-chunk gzip/
    brotli, so Neuroglancer's client-side zip-kvstore adapter can decompress it without any
    server-side Content-Encoding hacks.

Mesh-size reduction (mask cleanup, decimation, Draco) is implemented in
mesh_compression/ and wired in here -- see mesh_compression/README.md
Two independent knobs:
  - mask ("none"|"otsu"|"minmax"): whether/how to mask before meshing. Masking (Otsu/
    percentile/explicit band) helps a lot on sparse data but is known to BACKFIRE on
    dense data (e.g. whole-brain templates, confirmed: +23% bigger). Applied exactly as
    requested -- this is a choice you make, not something the code decides for you.
  - mesh_format ("legacy"|"multires_draco"): legacy is marching cubes + optional pyfqmr
    decimation (decimate_fraction), safe on both densities, zero extra deps.
    multires_draco is CZI's multi-resolution Draco mesh (max_simplification_error),
    competitive-or-better size plus free LOD, but requires extra dependencies -- see
    mesh_compression/README.md.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import tempfile

import numpy as np
import nrrd
import requests
import trimesh
from cloudvolume import CloudVolume
from cloudvolume.mesh import Mesh

try:
    from skimage import measure
except ImportError:
    print("ERROR: scikit-image required. Install with: pip install scikit-image")
    sys.exit(1)

import mesh_compression


def vfb_image_url(vfb_id: str, template_id: str, filename: str) -> str:
    prefix = vfb_id.replace("VFB_", "")
    first4, last4 = prefix[:4], prefix[4:]
    return f"https://www.virtualflybrain.org/data/VFB/i/{first4}/{last4}/{template_id}/{filename}"


def download_file(url: str, dest: str) -> str:
    resp = requests.get(url, stream=True, timeout=120)
    resp.raise_for_status()
    with open(dest, "wb") as f:
        for chunk in resp.iter_content(1024 * 1024):
            f.write(chunk)
    return dest


def detect_spacing(header: dict) -> list[float]:
    if "space directions" in header and header["space directions"] is not None:
        try:
            dirs = header["space directions"]
            return [float(np.linalg.norm(d)) if d is not None else 1.0 for d in dirs][::-1]
        except Exception:
            pass
    if "spacings" in header:
        try:
            return list(map(float, header["spacings"]))[::-1]
        except Exception:
            pass
    return [1.0, 1.0, 1.0]


def detect_origin(header: dict) -> list[float]:
    """Extract space origin from NRRD header and convert to XYZ order."""
    if "space origin" in header and header["space origin"] is not None:
        try:
            origin = header["space origin"]
            return [float(x) for x in origin[::-1]]
        except Exception:
            pass
    return [0.0, 0.0, 0.0]


def validate_mesh_params(mask: str, mesh_min_intensity: int | None, mesh_max_intensity: int | None,
                          mesh_percentile: float | None, mesh_format: str, decimate_fraction: float,
                          generate_mesh: bool, verbose: bool = True) -> None:
    """Reject mesh-related flag combinations that are contradictory or meaningless,
    rather than silently ignoring one of them. Called once, early -- by both CLIs'
    main() (before any NRRD I/O) and convert_nrrd() itself (defense-in-depth for
    direct/programmatic callers like vfb_pipeline.py) -- so a bad combination fails
    fast instead of surfacing after expensive work has already run.
    """
    have_percentile = mesh_percentile is not None
    have_range = mesh_min_intensity is not None or mesh_max_intensity is not None
    have_mesh_intensity_args = have_percentile or have_range

    if mask == "none" and have_mesh_intensity_args:
        raise ValueError(
            "--mesh-min-intensity/--mesh-max-intensity/--mesh-percentile only apply "
            "when --mask is 'otsu' or 'minmax' -- they have no effect with the default "
            "--mask none. Did you forget --mask minmax?"
        )
    if mask == "otsu" and have_mesh_intensity_args:
        raise ValueError(
            "--mesh-min-intensity/--mesh-max-intensity/--mesh-percentile are only used "
            "with --mask minmax, not --mask otsu."
        )
    if mask == "minmax":
        if have_range and have_percentile:
            raise ValueError(
                "--mask minmax takes either --mesh-percentile OR "
                "--mesh-min-intensity/--mesh-max-intensity, not both."
            )
        if not have_range and not have_percentile:
            raise ValueError(
                "--mask minmax requires --mesh-percentile, or --mesh-min-intensity/"
                "--mesh-max-intensity, to be set."
            )
    if mesh_format == "multires_draco" and decimate_fraction > 0:
        raise ValueError(
            "--decimate-fraction only applies to --mesh-format legacy (pyfqmr "
            "decimation); multires_draco has its own simplification via "
            "--max-simplification-error instead. Can't combine legacy decimation with Draco."
        )

    if not generate_mesh:
        touched = []
        if mask != "none":
            touched.append(f"--mask {mask}")
        if have_mesh_intensity_args:
            touched.append("--mesh-min-intensity/--mesh-max-intensity/--mesh-percentile")
        if mesh_format != "legacy":
            touched.append(f"--mesh-format {mesh_format}")
        if decimate_fraction > 0:
            touched.append("--decimate-fraction")
        if touched and verbose:
            print(f"  WARNING: --generate-mesh not set -- {', '.join(touched)} will have "
                  f"no effect (no mesh is being generated). Pass --generate-mesh if you "
                  f"meant to use these.")


def convert_nrrd(
    nrrd_path: str,
    output_dir: str,
    dataset_name: str,
    threshold: float | None = None,
    dust_threshold: int = 100,
    merge_segments: bool = False,
    min_intensity: int | None = None,
    max_intensity: int | None = None,
    generate_mesh: bool = False,
    mask: str = "none",
    mesh_min_intensity: int | None = None,
    mesh_max_intensity: int | None = None,
    mesh_percentile: float | None = None,
    mesh_format: str = "legacy",
    decimate_fraction: float = 0.0,
    max_simplification_error: int = 10,
    mesh_obj_path: str | None = None,
    verbose: bool = True
):
    """Convert an NRRD volume to precomputed format with external-boundary mesh.

    The volume is written as-is (matching converter.py behaviour) -- min_intensity/
    max_intensity zero voxels in the STORED volume (destructive, unrelated to meshing).
    A single mesh is generated from the outer boundary of non-zero voxels, rather than
    one mesh per segmented region.

    mesh_obj_path: if given (and generate_mesh is True), the mesh is loaded from this
    OBJ file instead of running marching cubes on the NRRD volume -- mask/mesh_format/
    decimate_fraction/max_simplification_error are ignored in that case (see
    _generate_mesh_from_obj). Volume chunks (0/) are still written from the NRRD either
    way; only the mesh source changes. See vfb_pipeline.py's --mesh-from-obj.

    Everything below mesh-size reduction is OPTIONAL and each choice is independent --
    see mesh_compression/README.md for the full validation. Three separate decisions,
    each on its own axis (pick at most one thing per axis; axes combine freely):

      1. generate_mesh: False (default) | True. Whether to generate a mesh from the
         volume's external boundary at all -- off by default since most instances
         already ship a usable volume_man.obj (see vfb_pipeline.py) and don't need one
         regenerated from the NRRD. When True, mesh_obj_path picks the source: an
         existing volume_man.obj (used as-is) or marching cubes on the NRRD (default).
      2. mask: "none" (default -- no mask cleanup at all) | "otsu" (automatic threshold,
         no extra params) | "minmax" (explicit band -- supply mesh_percentile for a
         per-sample floor, OR mesh_min_intensity/mesh_max_intensity for a fixed band;
         not both). Pick ONE of otsu/minmax, or leave at "none". Applied exactly as
         requested -- masking is known to backfire on dense data (e.g. whole-brain
         templates, confirmed: +23% bigger), so choosing otsu/minmax there is a real
         risk you're opting into, not something this function protects you from.
      3. mesh_format: "legacy" (default) | "multires_draco". Pick ONE. Under "legacy",
         decimate_fraction (default 0.0 = off) optionally simplifies the mesh afterward
         (pyfqmr, safe on both sparse and dense data). Under "multires_draco",
         max_simplification_error (default 10) controls Draco's own simplification
         instead -- decimate_fraction is ignored in that case. Can't combine decimation
         with Draco (they're different mesh formats), but masking (axis 2) combines
         freely with either.
    """
    validate_mesh_params(mask, mesh_min_intensity, mesh_max_intensity, mesh_percentile,
                         mesh_format, decimate_fraction, generate_mesh, verbose)

    if verbose:
        print(f"Reading NRRD: {nrrd_path}")

    data, header = nrrd.read(nrrd_path)
    if data.ndim != 3:
        raise RuntimeError(f"Expected 3D volume, got ndim={data.ndim}")

    # Transpose from ZYX (NRRD) to XYZ (Neuroglancer)
    arr = np.transpose(data, (2, 1, 0)).copy()
    voxel_size = detect_spacing(header)
    voxel_offset = detect_origin(header)

    if verbose:
        print(f"  Shape (XYZ): {arr.shape}")
        print(f"  Voxel size:  {voxel_size}")
        print(f"  Voxel offset: {voxel_offset}")
        print(f"  Dtype:       {arr.dtype}")
        print(f"  Value range: [{arr.min()}, {arr.max()}]")

    # Apply intensity filtering if specified (for segmentation data)
    if np.issubdtype(arr.dtype, np.integer):
        if min_intensity is not None or max_intensity is not None:
            original_segments = len(np.unique(arr[arr > 0]))
            if min_intensity is not None:
                arr[arr < min_intensity] = 0
            if max_intensity is not None:
                arr[arr > max_intensity] = 0
            filtered_segments = len(np.unique(arr[arr > 0]))
            if verbose:
                print(f"  Intensity filter: {original_segments} segments -> {filtered_segments} segments")
                print(f"  Range: [{min_intensity or 'any'}, {max_intensity or 'any'}]")

    # Determine layer type
    is_segmentation = np.issubdtype(arr.dtype, np.integer)
    layer_type = "segmentation" if is_segmentation else "image"
    dtype_str = str(np.dtype(arr.dtype).name)

    dest_local = os.path.join(output_dir, dataset_name)
    os.makedirs(dest_local, exist_ok=True)
    dest = f"file://{dest_local}"

    # Write precomputed volume
    info = {
        "data_type": dtype_str,
        "num_channels": 1,
        "scales": [{
            "chunk_sizes": [[64, 64, 64]],
            "encoding": "raw",
            "key": "0",
            "resolution": voxel_size,
            "size": list(arr.shape),
            "voxel_offset": voxel_offset,
        }],
        "type": layer_type,
    }

    if is_segmentation and generate_mesh:
        # Only declare a mesh directory when we're actually going to write one --
        # otherwise Neuroglancer requests neuroglancer/mesh/info and gets a 404
        # (see _generate_external_mesh/_generate_draco_mesh for what populates it).
        # segment_properties is NOT declared: our mesh is always a single merged
        # blob with a placeholder label ("Segment N"), never real per-segment
        # labels, so a segment_properties list would be misleading rather than
        # informative (see NEUROGLANCER_STANDARDIZATION.md item 3).
        info["mesh"] = "mesh"

    vol = CloudVolume(dest, mip=0, info=info, compress=False)
    vol.commit_info()
    vol[:, :, :] = arr

    if verbose:
        print(f"  Wrote precomputed volume to {dest_local}")
        print(f"  Layer type: {layer_type}")

    # Generate mesh from the external boundary of all non-zero voxels, or from an
    # existing volume_man.obj if mesh_obj_path was given
    if is_segmentation:
        if generate_mesh and mesh_obj_path:
            if verbose:
                touched = []
                if mask != "none":
                    touched.append(f"--mask {mask}")
                if mesh_format != "legacy":
                    touched.append(f"--mesh-format {mesh_format}")
                if decimate_fraction > 0:
                    touched.append("--decimate-fraction")
                if mesh_min_intensity is not None or mesh_max_intensity is not None or mesh_percentile is not None:
                    touched.append("--mesh-min-intensity/--mesh-max-intensity/--mesh-percentile")
                if touched:
                    print(f"  WARNING: mesh_obj_path set -- {', '.join(touched)} will have no "
                          f"effect (mesh sourced from {mesh_obj_path}, no marching cubes step runs).")
            _generate_mesh_from_obj(mesh_obj_path, arr, dest_local, vol, verbose)
        elif generate_mesh:
            _generate_external_mesh(
                arr, dest_local, vol, voxel_size, voxel_offset, dust_threshold, verbose,
                mask=mask,
                mesh_min_intensity=mesh_min_intensity, mesh_max_intensity=mesh_max_intensity,
                mesh_percentile=mesh_percentile, mesh_format=mesh_format,
                decimate_fraction=decimate_fraction, max_simplification_error=max_simplification_error,
            )
        else:
            if verbose:
                print("  generate_mesh=False, skipping mesh generation")

    return dest_local


def _setup_mesh_metadata(dest_local, vol, verbose):
    """Ensure mesh metadata is properly configured (matches meshes_generator.py)."""
    needs_update = False
    if "mesh" not in vol.info or vol.info["mesh"] is None:
        vol.info["mesh"] = "mesh"
        needs_update = True
    if needs_update:
        vol.commit_info()

    mesh_dir = os.path.join(dest_local, "mesh")
    os.makedirs(mesh_dir, exist_ok=True)

    mesh_info = {
        "@type": "neuroglancer_legacy_mesh",
        "mip": 0,
        "vertex_quantization_bits": 10,
        "lod_scale_multiplier": 1.0,
    }
    with open(os.path.join(mesh_dir, "info"), "w") as f:
        json.dump(mesh_info, f, indent=2)

    if verbose:
        print("  Mesh metadata configured (legacy format)")


def _select_mesh_mask(arr: np.ndarray, mask: str,
                      mesh_min_intensity: int | None, mesh_max_intensity: int | None,
                      mesh_percentile: float | None, verbose: bool) -> np.ndarray:
    """Mask used ONLY for meshing -- never touches the stored volume. `mask` always
    applies exactly as requested ("none" default, "otsu", or "minmax" -- percentile OR
    fixed band, not both; see convert_nrrd()'s docstring). Otsu/minmax are known to
    backfire on dense data (confirmed: +23% bigger on a whole-brain template) -- that's
    a real risk you're opting into by choosing mask != "none" on dense data, not
    something this function protects you from.

    Parameter-combination validation (otsu/minmax vs mesh_min_intensity/mesh_max_intensity/
    mesh_percentile) happens upfront in validate_mesh_params(), called by convert_nrrd()
    before this is ever reached -- not repeated here."""
    if mask == "none":
        if verbose:
            print("  No mask cleanup (mask='none', the default -- pass mask='otsu' or "
                  "mask='minmax' to opt in)")
        return arr > 0

    if mask == "otsu":
        if verbose:
            print("  Otsu mask")
        return mesh_compression.otsu_mask(arr)

    if mask == "minmax":
        have_percentile = mesh_percentile is not None
        if have_percentile:
            lo = mesh_compression.percentile_intensity(arr, mesh_percentile)
            if verbose:
                print(f"  Percentile mask (p{mesh_percentile} -> min_intensity={lo})")
            return mesh_compression.intensity_band_mask(arr, min_intensity=lo)
        if verbose:
            print(f"  Intensity band mask [{mesh_min_intensity}, {mesh_max_intensity}]")
        return mesh_compression.intensity_band_mask(arr, mesh_min_intensity, mesh_max_intensity)

    raise ValueError(f"Unknown mask {mask!r}, expected 'none', 'otsu', or 'minmax'")


def _generate_external_mesh(arr, dest_local, vol, voxel_size, voxel_offset, dust_threshold, verbose,
                            mask="none", mesh_min_intensity=None, mesh_max_intensity=None,
                            mesh_percentile=None, mesh_format="legacy",
                            decimate_fraction=0.0, max_simplification_error=10):
    """Generate a single mesh from the outer boundary of the mesh mask (see
    _select_mesh_mask). A single mesh with segment ID = the lowest non-zero segment ID
    present, vertices transformed to physical coordinates including voxel_offset.
    """

    if mesh_format == "legacy":
        _setup_mesh_metadata(dest_local, vol, verbose)

    mesh_mask = _select_mesh_mask(arr, mask, mesh_min_intensity, mesh_max_intensity,
                                  mesh_percentile, verbose)
    voxel_count = int(np.sum(mesh_mask))

    if voxel_count == 0:
        if verbose:
            print("  No non-zero voxels found, skipping mesh generation")
        return

    if voxel_count < dust_threshold:
        if verbose:
            print(f"  Skipping mesh: only {voxel_count} non-zero voxels (< {dust_threshold})")
        return

    all_segments = np.unique(arr)
    all_segments = all_segments[all_segments > 0]
    mesh_seg_id = int(all_segments[0])

    if mesh_format == "multires_draco":
        _generate_draco_mesh(
            mesh_mask, dest_local, voxel_size, mesh_seg_id,
            max_simplification_error, verbose
        )
        return
    if mesh_format != "legacy":
        raise ValueError(f"Unknown mesh_format {mesh_format!r}, expected 'legacy' or 'multires_draco'")

    if verbose:
        print(f"  Creating merged mesh from {voxel_count} voxels...")

    try:
        vertices, faces, _, _ = measure.marching_cubes(mesh_mask, level=0.5, allow_degenerate=False)
    except (ValueError, RuntimeError) as e:
        if verbose:
            print(f"  Failed to generate merged mesh: {e}")
        return

    if len(vertices) == 0 or len(faces) == 0:
        if verbose:
            print("  Merged mesh has no geometry")
        return

    # Transform vertices to physical coordinates (resolution + offset)
    vertices = vertices.astype(np.float32)
    vertices[:, 0] = vertices[:, 0] * voxel_size[0] + voxel_offset[0]
    vertices[:, 1] = vertices[:, 1] * voxel_size[1] + voxel_offset[1]
    vertices[:, 2] = vertices[:, 2] * voxel_size[2] + voxel_offset[2]
    faces = faces.astype(np.uint32)

    if verbose:
        print(f"  Merged mesh: {len(vertices)} vertices, {len(faces)} faces")

    if decimate_fraction > 0:
        vertices, faces = mesh_compression.decimate_mesh(vertices, faces, decimate_fraction)
        if verbose:
            print(
                f"  Decimated ({decimate_fraction:.0%} target reduction): "
                f"{len(vertices)} vertices, {len(faces)} faces"
            )

    mesh_obj = Mesh(vertices, faces, segid=mesh_seg_id)
    vol.mesh.put(mesh_obj, compress=False)

    if verbose:
        print(f"  Wrote merged external boundary mesh (segment ID {mesh_seg_id})")


def _generate_mesh_from_obj(obj_path, arr, dest_local, vol, verbose):
    """Use an existing volume_man.obj as the mesh source instead of marching cubes
    on the NRRD volume (see vfb_pipeline.py's --mesh-from-obj). The OBJ is used
    as-is -- mask/mesh_format/decimate_fraction/max_simplification_error don't apply
    here, only to the marching-cubes path in _generate_external_mesh.
    """
    _setup_mesh_metadata(dest_local, vol, verbose)

    mesh = trimesh.load(obj_path, force="mesh")
    if not isinstance(mesh, trimesh.Trimesh):
        raise ValueError(f"Could not load as triangle mesh: {obj_path}")

    all_segments = np.unique(arr)
    all_segments = all_segments[all_segments > 0]
    if len(all_segments) == 0:
        if verbose:
            print("  No non-zero voxels found, skipping mesh generation")
        return
    mesh_seg_id = int(all_segments[0])

    # OBJ vertices are physical microns; Neuroglancer's precomputed world coordinates
    # here are nanometers (matches the NRRD-derived voxel_size) -- same conversion as
    # vfb_pipeline.write_precomputed uses for the OBJ-only path.
    vertices = (mesh.vertices * 1000.0).astype(np.float32)
    faces = mesh.faces.astype(np.uint32)

    if verbose:
        print(f"  Using mesh from {obj_path}: {len(vertices)} vertices, {len(faces)} faces")

    mesh_obj = Mesh(vertices, faces, segid=mesh_seg_id)
    vol.mesh.put(mesh_obj, compress=False)

    if verbose:
        print(f"  Wrote mesh from volume_man.obj (segment ID {mesh_seg_id})")


def _generate_draco_mesh(
    mask, dest_local, voxel_size, mesh_seg_id,
    max_simplification_error, verbose
):
    """CZI multi-resolution Draco mesh (see mesh_compression.generate_draco_mesh). Requires a
    SEPARATE precomputed segmentation dataset (resolution forced to [1,1,1] to work around
    a real float-precision bug in igneous -- see mesh_compression/README.md), generated in a
    throwaway temp directory next to dest_local, with just the resulting mesh_multires/
    directory moved into dest_local afterward and its resolution metadata patched to the
    real per-sample values (mesh geometry doesn't depend on this metadata, only
    display-space scaling does)."""
    import shutil

    label_arr = mask.astype(np.uint8)
    draco_tmp = dest_local + "__draco_tmp"
    if os.path.isdir(draco_tmp):
        shutil.rmtree(draco_tmp)
    os.makedirs(draco_tmp, exist_ok=True)

    tmp_info = {
        "data_type": "uint8",
        "num_channels": 1,
        "scales": [{
            "chunk_sizes": [[64, 64, 64]],
            "encoding": "raw",
            "key": "0",
            "resolution": [1.0, 1.0, 1.0],  # igneous float-precision workaround
            "size": list(label_arr.shape),
            "voxel_offset": [0, 0, 0],
        }],
        "type": "segmentation",
    }
    tmp_vol = CloudVolume(f"file://{draco_tmp}", mip=0, info=tmp_info, compress=False)
    tmp_vol.commit_info()
    tmp_vol[:, :, :] = label_arr

    mesh_compression.generate_draco_mesh(
        draco_tmp, mesh_directory="mesh_multires",
        max_simplification_error=max_simplification_error,
        mesh_shape=label_arr.shape,
    )

    src_mesh = os.path.join(draco_tmp, "mesh_multires")
    dst_mesh = os.path.join(dest_local, "mesh_multires")
    if os.path.isdir(dst_mesh):
        shutil.rmtree(dst_mesh)
    shutil.move(src_mesh, dst_mesh)

    mesh_info_path = os.path.join(dst_mesh, "info")
    with open(mesh_info_path) as f:
        mesh_info = json.load(f)
    mesh_info["spatial_index"]["resolution"] = voxel_size
    mesh_info["spatial_index"]["chunk_size"] = [256.0 * r for r in voxel_size]
    mesh_info["transform"] = [
        voxel_size[0], 0, 0, 0,
        0, voxel_size[1], 0, 0,
        0, 0, voxel_size[2], 0,
    ]
    with open(mesh_info_path, "w") as f:
        json.dump(mesh_info, f, indent=2)

    # point the main dataset's info at mesh_multires/ instead of the legacy mesh/ dir
    info_path = os.path.join(dest_local, "info")
    with open(info_path) as f:
        info = json.load(f)
    info["mesh"] = "mesh_multires"
    with open(info_path, "w") as f:
        json.dump(info, f, indent=2)

    shutil.rmtree(draco_tmp)

    if verbose:
        print(f"  Wrote multi-resolution Draco mesh (segment ID {mesh_seg_id})")


def main():
    parser = argparse.ArgumentParser(
        description="Convert NRRD volumes to Neuroglancer precomputed format with meshes"
    )
    parser.add_argument("--input-nrrd", default=None,
                        help="Path to local NRRD file")
    parser.add_argument("--vfb-id", default=None,
                        help="VFB image ID to download NRRD from server")
    parser.add_argument("--template-id", default="VFB_00101567",
                        help="Template ID for URL construction (default: JRC2018Unisex)")
    parser.add_argument("--output-dir", required=True,
                        help="Output directory for precomputed datasets")
    parser.add_argument("--dataset-name", default=None,
                        help="Name for the output dataset (default: derived from input)")
    parser.add_argument("--threshold", type=float, default=None,
                        help="(unused, kept for CLI compatibility)")
    parser.add_argument("--dust-threshold", type=int, default=100,
                        help="Minimum voxel count for mesh generation (default: 100)")
    parser.add_argument("--merge-segments", action="store_true",
                        help="(unused, kept for CLI compatibility)")
    parser.add_argument("--min-intensity", type=int, default=None,
                        help="Minimum segment ID/intensity to keep in the STORED volume "
                             "(destructive, values below will be set to 0)")
    parser.add_argument("--max-intensity", type=int, default=None,
                        help="Maximum segment ID/intensity to keep in the STORED volume "
                             "(destructive, values above will be set to 0)")
    parser.add_argument("--generate-mesh", action="store_true",
                        help="Generate a marching-cubes mesh from the NRRD volume's external "
                             "boundary (default: off). Independent of --mesh-format/--mask/"
                             "--decimate-fraction/etc, which only take effect when this is set.")
    parser.add_argument("--mask", choices=["none", "otsu", "minmax"], default="none",
                        help="OPTIONAL. 'none' (default): no mask cleanup. 'otsu': automatic "
                             "threshold, no extra params needed. 'minmax': explicit intensity "
                             "band -- also set --mesh-percentile, OR --mesh-min-intensity/"
                             "--mesh-max-intensity (not both). Pick at most one. Known to "
                             "backfire on dense data (e.g. whole-brain templates) -- safest on "
                             "sparse data.")
    parser.add_argument("--mesh-min-intensity", type=int, default=None,
                        help="--mask minmax only: fixed band floor (stored volume untouched)")
    parser.add_argument("--mesh-max-intensity", type=int, default=None,
                        help="--mask minmax only: fixed band ceiling (stored volume untouched)")
    parser.add_argument("--mesh-percentile", type=float, default=None,
                        help="--mask minmax only: per-sample percentile-derived floor, instead of "
                             "a fixed --mesh-min-intensity/--mesh-max-intensity band")
    parser.add_argument("--mesh-format", choices=["legacy", "multires_draco"], default="legacy",
                        help="Pick at most one mesh generation method. 'legacy' (default): marching "
                             "cubes, no extra deps -- optionally add --decimate-fraction to simplify "
                             "afterward. 'multires_draco': CZI's multi-res Draco mesh instead (extra "
                             "deps, see mesh_compression/README.md) -- tune with "
                             "--max-simplification-error. Can't combine legacy decimation with Draco.")
    parser.add_argument("--decimate-fraction", type=float, default=0.0,
                        help="OPTIONAL, --mesh-format legacy only. pyfqmr decimation target "
                             "reduction (default: 0.0 = off; e.g. 0.7 removes ~70%% of triangles). "
                             "Safe on both sparse and dense data -- see mesh_compression/README.md.")
    parser.add_argument("--max-simplification-error", type=int, default=10,
                        help="--mesh-format multires_draco only. Draco simplification error "
                             "tolerance (default: 10, the library default) -- lower is gentler.")
    parser.add_argument("--force", action="store_true",
                        help="Regenerate even if --output-dir/--dataset-name already has an "
                             "info file (default: skip existing results without touching them)")
    parser.add_argument("--compress", action="store_true",
                        help="Zip the output neuroglancer/ folder into a single artifact "
                             "(default: off, leaves the raw uncompressed tree as-is). "
                             "No gzip/brotli choice anymore -- if set, this simply zips the "
                             "whole folder; see mesh_compression/zip_output.py.")
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()

    if not args.input_nrrd and not args.vfb_id:
        parser.error("Must provide either --input-nrrd or --vfb-id")

    try:
        validate_mesh_params(args.mask, args.mesh_min_intensity, args.mesh_max_intensity,
                              args.mesh_percentile, args.mesh_format, args.decimate_fraction,
                              args.generate_mesh, args.verbose)
    except ValueError as e:
        parser.error(str(e))

    output_dir = os.path.abspath(os.path.expanduser(args.output_dir))
    os.makedirs(output_dir, exist_ok=True)

    nrrd_path = args.input_nrrd
    dataset_name = args.dataset_name
    tmp_nrrd = None

    # Skip early (before downloading anything) if this dataset already exists and
    # --force wasn't passed -- effective name mirrors what's resolved below: explicit
    # --dataset-name, else --vfb-id, else the input NRRD's own filename.
    effective_name = dataset_name or args.vfb_id or (
        os.path.splitext(os.path.basename(nrrd_path))[0] if nrrd_path else None
    )
    if effective_name and not args.force:
        existing_info = os.path.join(output_dir, effective_name, "info")
        if os.path.isfile(existing_info):
            print(f"Skipping {effective_name!r} -- already exists at {output_dir}/{effective_name}/ "
                  f"(pass --force to regenerate)")
            return

    if not nrrd_path:
        url = vfb_image_url(args.vfb_id, args.template_id, "volume.nrrd")
        if args.verbose:
            print(f"Downloading NRRD: {url}")
        tmp_nrrd = tempfile.NamedTemporaryFile(suffix=".nrrd", delete=False)
        nrrd_path = tmp_nrrd.name
        tmp_nrrd.close()
        download_file(url, nrrd_path)
        dataset_name = dataset_name or args.vfb_id

    if not dataset_name:
        dataset_name = os.path.splitext(os.path.basename(nrrd_path))[0]

    try:
        dest_local = convert_nrrd(
            nrrd_path, output_dir, dataset_name,
            threshold=args.threshold,
            dust_threshold=args.dust_threshold,
            merge_segments=args.merge_segments,
            min_intensity=args.min_intensity,
            max_intensity=args.max_intensity,
            generate_mesh=args.generate_mesh,
            mask=args.mask,
            mesh_min_intensity=args.mesh_min_intensity,
            mesh_max_intensity=args.mesh_max_intensity,
            mesh_percentile=args.mesh_percentile,
            mesh_format=args.mesh_format,
            decimate_fraction=args.decimate_fraction,
            max_simplification_error=args.max_simplification_error,
            verbose=args.verbose,
        )
    finally:
        if tmp_nrrd:
            os.unlink(nrrd_path)

    if args.compress:
        mesh_compression.zip_neuroglancer_dir(dest_local, verbose=args.verbose)

    print(f"Done. Output at: {output_dir}/{dataset_name}")


if __name__ == "__main__":
    main()
