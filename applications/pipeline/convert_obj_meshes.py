#!/usr/bin/env python3
"""
Category B: Convert existing OBJ mesh files to Neuroglancer precomputed mesh format.

For neurons that already have proper triangulated OBJ meshes (volume_man.obj),
this converts them directly to precomputed format without needing marching cubes.
This is the fastest conversion path.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import tempfile

import numpy as np
import requests
import trimesh
from cloudvolume import CloudVolume
from cloudvolume.mesh import Mesh


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


def has_faces(obj_path: str) -> bool:
    """Check if an OBJ file has face definitions (is a real mesh vs point cloud)."""
    with open(obj_path) as f:
        for line in f:
            if line.startswith("f "):
                return True
    return False


def load_obj_mesh(obj_path: str) -> trimesh.Trimesh:
    """Load an OBJ file as a trimesh object."""
    mesh = trimesh.load(obj_path, force="mesh")
    if not isinstance(mesh, trimesh.Trimesh):
        raise ValueError(f"Could not load {obj_path} as a triangle mesh")
    return mesh


def convert_obj_to_precomputed(obj_path: str, output_dir: str, vfb_id: str,
                                resolution: list[float], segment_id: int = 1,
                                label: str | None = None, verbose: bool = True):
    """Convert a single OBJ mesh to precomputed format."""

    if verbose:
        print(f"Loading OBJ: {obj_path}")

    if not has_faces(obj_path):
        raise ValueError(f"{obj_path} is a point cloud (no faces). Use convert_swc_to_mesh.py or convert_nrrd.py instead.")

    mesh = load_obj_mesh(obj_path)

    if verbose:
        print(f"  Vertices: {len(mesh.vertices)}")
        print(f"  Faces: {len(mesh.faces)}")
        print(f"  Bounds: {mesh.bounds}")

    dest_local = os.path.join(output_dir, vfb_id)
    os.makedirs(dest_local, exist_ok=True)
    dest = f"file://{dest_local}"

    # Compute volume bounds from mesh extents
    mesh_min = mesh.vertices.min(axis=0)
    mesh_max = mesh.vertices.max(axis=0)

    # Size in voxels (ceiling to cover the mesh)
    size = [
        int(np.ceil((mesh_max[i] - mesh_min[i]) / resolution[i])) + 2
        for i in range(3)
    ]

    # Write a minimal segmentation info (we only need mesh, not volume)
    info = {
        "data_type": "uint32",
        "num_channels": 1,
        "scales": [{
            "chunk_sizes": [[64, 64, 64]],
            "encoding": "raw",
            "key": "0",
            "resolution": resolution,
            "size": size,
            "voxel_offset": [0, 0, 0],
        }],
        "type": "segmentation",
        "mesh": "mesh",
        "segment_properties": "segment_properties",
    }

    vol = CloudVolume(dest, mip=0, info=info, compress=False)
    vol.commit_info()

    # Setup mesh directory
    mesh_dir = os.path.join(dest_local, "mesh")
    os.makedirs(mesh_dir, exist_ok=True)
    mesh_info = {"@type": "neuroglancer_legacy_mesh"}
    with open(os.path.join(mesh_dir, "info"), "w") as f:
        json.dump(mesh_info, f, indent=2)

    # Convert vertices to the expected coordinate space
    # OBJ vertices from VFB are already in physical coordinates (microns)
    vertices = mesh.vertices.astype(np.float32)
    faces = mesh.faces.astype(np.uint32)

    mesh_obj = Mesh(vertices, faces, segid=segment_id)
    vol.mesh.put(mesh_obj, compress=False)

    # Create segment properties
    seg_dir = os.path.join(dest_local, "segment_properties")
    os.makedirs(seg_dir, exist_ok=True)
    display_label = label or vfb_id
    seg_info = {
        "@type": "neuroglancer_segment_properties",
        "inline": {
            "ids": [str(segment_id)],
            "properties": [
                {"id": "label", "type": "label", "values": [display_label]},
                {"id": "description", "type": "description", "values": [vfb_id]},
            ],
        },
    }
    with open(os.path.join(seg_dir, "info"), "w") as f:
        json.dump(seg_info, f, indent=2)

    if verbose:
        print(f"  Wrote precomputed mesh to {dest_local}")

    return dest_local


def main():
    parser = argparse.ArgumentParser(
        description="Convert OBJ mesh files to Neuroglancer precomputed format"
    )
    parser.add_argument("--input-obj", default=None,
                        help="Path to local OBJ file (mutually exclusive with --vfb-id)")
    parser.add_argument("--vfb-id", default=None,
                        help="VFB image ID to download OBJ from server")
    parser.add_argument("--template-id", default="VFB_00101567",
                        help="Template ID for URL construction (default: JRC2018Unisex)")
    parser.add_argument("--output-dir", required=True,
                        help="Output directory for precomputed datasets")
    parser.add_argument("--resolution", type=float, nargs=3,
                        default=[518.9161, 518.9161, 1000.0],
                        help="Voxel resolution in nm [x y z] (default: JRC2018U)")
    parser.add_argument("--label", default=None,
                        help="Display label for the mesh segment")
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()

    if not args.input_obj and not args.vfb_id:
        parser.error("Must provide either --input-obj or --vfb-id")

    output_dir = os.path.abspath(os.path.expanduser(args.output_dir))
    os.makedirs(output_dir, exist_ok=True)

    obj_path = args.input_obj
    vfb_id = args.vfb_id or os.path.splitext(os.path.basename(args.input_obj))[0]

    if not obj_path:
        # Download from VFB
        url = vfb_image_url(args.vfb_id, args.template_id, "volume_man.obj")
        if args.verbose:
            print(f"Downloading OBJ: {url}")
        with tempfile.NamedTemporaryFile(suffix=".obj", delete=False) as tmp:
            obj_path = tmp.name
        try:
            download_file(url, obj_path)
            convert_obj_to_precomputed(
                obj_path, output_dir, vfb_id,
                resolution=args.resolution, label=args.label, verbose=args.verbose,
            )
        finally:
            os.unlink(obj_path)
    else:
        convert_obj_to_precomputed(
            obj_path, output_dir, vfb_id,
            resolution=args.resolution, label=args.label, verbose=args.verbose,
        )

    print(f"Done. Output at: {output_dir}/{vfb_id}")


if __name__ == "__main__":
    main()
