#!/usr/bin/env python3
"""
Category A: Convert VFB templates with painted domains (index regions) to
Neuroglancer precomputed segmentation format with per-region meshes.

The template NRRD is a label field where each voxel integer value maps to
a specific anatomical region (neuropil). This script:
  1. Fetches template metadata from the VFB API (domain labels, indices, ontology IDs)
  2. Downloads the template NRRD
  3. Converts to precomputed segmentation format
  4. Generates meshes for each anatomical region via marching cubes
  5. Creates segment properties with real anatomical labels
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
from cloudvolume import CloudVolume
from cloudvolume.lib import Bbox
from cloudvolume.mesh import Mesh

try:
    from skimage import measure
except ImportError:
    print("ERROR: scikit-image required. Install with: pip install scikit-image")
    sys.exit(1)


# ---------------------------------------------------------------------------
# VFB helpers
# ---------------------------------------------------------------------------

def vfb_image_url(vfb_id: str, template_id: str, filename: str) -> str:
    """Build the canonical VFB data URL for an image file."""
    prefix = vfb_id.replace("VFB_", "")
    first4, last4 = prefix[:4], prefix[4:]
    return f"https://www.virtualflybrain.org/data/VFB/i/{first4}/{last4}/{template_id}/{filename}"


def fetch_template_metadata(template_id: str) -> dict:
    """Fetch template info from the VFB API, including painted domain mappings."""
    url = f"https://solr.virtualflybrain.org/solr/ontology/select?q=short_form:{template_id}&fl=*&wt=json"
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    return resp.json()


def download_file(url: str, dest: str) -> str:
    """Download a file from a URL to a local path."""
    resp = requests.get(url, stream=True, timeout=120)
    resp.raise_for_status()
    with open(dest, "wb") as f:
        for chunk in resp.iter_content(1024 * 1024):
            f.write(chunk)
    return dest


# ---------------------------------------------------------------------------
# Conversion
# ---------------------------------------------------------------------------

def detect_spacing(header: dict) -> list[float]:
    if "space directions" in header and header["space directions"] is not None:
        try:
            dirs = header["space directions"]
            return [abs(float(np.linalg.norm(d))) if d is not None else 1.0 for d in dirs][::-1]
        except Exception:
            pass
    if "spacings" in header:
        try:
            return list(map(float, header["spacings"]))[::-1]
        except Exception:
            pass
    return [1.0, 1.0, 1.0]


def create_segment_properties(local_path: str, domain_map: dict, verbose: bool = True):
    """Create segment_properties with real anatomical labels from the domain map."""
    seg_dir = os.path.join(local_path, "segment_properties")
    os.makedirs(seg_dir, exist_ok=True)

    ids = []
    labels = []
    descriptions = []

    for idx in sorted(domain_map.keys()):
        domain = domain_map[idx]
        ids.append(str(idx))
        labels.append(domain.get("label", f"Segment {idx}"))
        type_label = domain.get("type_label", "")
        type_id = domain.get("type_id", "")
        desc = f"{type_label} ({type_id})" if type_id else type_label or f"Index {idx}"
        descriptions.append(desc)

    info = {
        "@type": "neuroglancer_segment_properties",
        "inline": {
            "ids": ids,
            "properties": [
                {"id": "label", "type": "label", "values": labels},
                {"id": "description", "type": "description", "values": descriptions},
            ],
        },
    }
    with open(os.path.join(seg_dir, "info"), "w") as f:
        json.dump(info, f, indent=2)

    if verbose:
        print(f"  Created segment properties for {len(ids)} domains")


def convert_template(template_id: str, domains: dict, output_dir: str,
                     dust_threshold: int = 50, verbose: bool = True):
    """Full pipeline: download template NRRD → precomputed segmentation + meshes."""

    nrrd_url = vfb_image_url(template_id, template_id, "volume.nrrd")
    if verbose:
        print(f"Downloading template NRRD: {nrrd_url}")

    with tempfile.NamedTemporaryFile(suffix=".nrrd", delete=False) as tmp:
        tmp_path = tmp.name
    try:
        download_file(nrrd_url, tmp_path)
        data, header = nrrd.read(tmp_path)
    finally:
        os.unlink(tmp_path)

    if data.ndim != 3:
        raise RuntimeError(f"Expected 3D volume, got ndim={data.ndim}")

    # Transpose from ZYX (NRRD) to XYZ (Neuroglancer)
    arr = np.transpose(data, (2, 1, 0)).copy()
    voxel_size = detect_spacing(header)

    if verbose:
        print(f"  Shape (XYZ): {arr.shape}")
        print(f"  Voxel size:  {voxel_size}")
        print(f"  Dtype:       {arr.dtype}")
        unique = np.unique(arr)
        print(f"  Unique values: {len(unique)} (range {unique.min()}-{unique.max()})")

    # Ensure integer type for segmentation
    if not np.issubdtype(arr.dtype, np.integer):
        arr = arr.astype(np.uint32)
    dtype_str = str(np.dtype(arr.dtype).name)

    dest_local = os.path.join(output_dir, template_id)
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
            "voxel_offset": [0, 0, 0],
        }],
        "type": "segmentation",
        "mesh": "mesh",
        "segment_properties": "segment_properties",
    }

    vol = CloudVolume(dest, mip=0, info=info, compress=False)
    vol.commit_info()
    vol[:, :, :] = arr

    if verbose:
        print(f"  Wrote precomputed volume to {dest_local}")

    # Setup mesh directory
    mesh_dir = os.path.join(dest_local, "mesh")
    os.makedirs(mesh_dir, exist_ok=True)
    mesh_info = {
        "@type": "neuroglancer_legacy_mesh",
        "mip": 0,
    }
    with open(os.path.join(mesh_dir, "info"), "w") as f:
        json.dump(mesh_info, f, indent=2)

    # Create segment properties from domain map
    create_segment_properties(dest_local, domains, verbose)

    # Generate meshes per segment
    all_segments = np.unique(arr)
    all_segments = all_segments[all_segments > 0]
    resolution = voxel_size

    if verbose:
        print(f"  Generating meshes for {len(all_segments)} segments...")

    generated = 0
    for seg_id in all_segments:
        mask = arr == seg_id
        voxel_count = np.sum(mask)
        if voxel_count < dust_threshold:
            continue

        try:
            vertices, faces, _, _ = measure.marching_cubes(mask, level=0.5, allow_degenerate=False)
        except (ValueError, RuntimeError):
            continue

        if len(vertices) == 0 or len(faces) == 0:
            continue

        # Transform to physical coordinates
        vertices = vertices.astype(np.float32)
        vertices[:, 0] *= resolution[0]
        vertices[:, 1] *= resolution[1]
        vertices[:, 2] *= resolution[2]

        mesh_obj = Mesh(vertices, faces.astype(np.uint32), segid=int(seg_id))
        vol.mesh.put(mesh_obj, compress=True)
        generated += 1

        if verbose:
            domain_label = domains.get(int(seg_id), {}).get("label", f"Segment {seg_id}")
            print(f"    [{seg_id}] {domain_label}: {len(vertices)} verts, {len(faces)} faces")

    if verbose:
        print(f"  Generated {generated} meshes out of {len(all_segments)} segments")

    return dest_local


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Convert VFB templates with painted domains to precomputed format"
    )
    parser.add_argument("--template-id", required=True,
                        help="VFB template ID (e.g., VFB_00101567)")
    parser.add_argument("--output-dir", required=True,
                        help="Output directory for precomputed datasets")
    parser.add_argument("--domains-json", default=None,
                        help="Optional JSON file with domain mappings (index→label). "
                             "If not provided, will use numeric segment IDs.")
    parser.add_argument("--dust-threshold", type=int, default=50,
                        help="Minimum voxel count for mesh generation (default: 50)")
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()

    output_dir = os.path.abspath(os.path.expanduser(args.output_dir))
    os.makedirs(output_dir, exist_ok=True)

    # Load domain mappings
    domains = {}
    if args.domains_json and os.path.exists(args.domains_json):
        with open(args.domains_json) as f:
            raw = json.load(f)
            # Expects {index: {label, type_label, type_id, vfb_id}} or similar
            domains = {int(k): v for k, v in raw.items()}
    else:
        if args.verbose:
            print("No domain mapping provided; segment properties will use numeric IDs.")

    convert_template(
        template_id=args.template_id,
        domains=domains,
        output_dir=output_dir,
        dust_threshold=args.dust_threshold,
        verbose=args.verbose,
    )

    print(f"Done. Output at: {output_dir}/{args.template_id}")


if __name__ == "__main__":
    main()
