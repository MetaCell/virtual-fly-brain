#!/usr/bin/env python3
"""
Category C: Convert SWC skeleton files to OBJ meshes (volume_man.obj).

For neurons that have SWC tracings but no proper mesh (only a point-cloud OBJ),
this script inflates the skeleton into a tubular mesh and saves it as OBJ.

The generated OBJ can then be converted to Neuroglancer precomputed format
using convert_obj_meshes.py (Category B), keeping a single reusable mesh
artifact (volume_man.obj) for future use.

Two mesh-generation approaches are provided:
  1. navis-based (preferred): Uses navis.conversion.tree2meshneuron() with CGAL
  2. trimesh-based (fallback): Manually creates truncated cones along each edge
"""
from __future__ import annotations

import argparse
import os
import sys
import tempfile

import numpy as np
import requests
import trimesh


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


# ---------------------------------------------------------------------------
# SWC parsing
# ---------------------------------------------------------------------------

def parse_swc(filepath: str) -> dict:
    """Parse an SWC file into a dict of nodes.

    Returns:
        {node_id: {"x": float, "y": float, "z": float,
                    "radius": float, "parent": int, "type": int}}
    """
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
                radius = float('nan')
            nodes[node_id] = {
                "type": int(parts[1]),
                "x": float(parts[2]),
                "y": float(parts[3]),
                "z": float(parts[4]),
                "radius": radius,
                "parent": int(parts[6]),
            }
    return nodes


# ---------------------------------------------------------------------------
# Approach 1: navis-based conversion (preferred)
# ---------------------------------------------------------------------------

def swc_to_mesh_navis(swc_path: str, verbose: bool = True) -> trimesh.Trimesh:
    """Convert SWC to mesh using navis (requires navis + CGAL or scipy)."""
    try:
        import navis
    except ImportError:
        raise ImportError("navis required for this method. Install with: pip install navis")

    if verbose:
        print("  Using navis for SWC → mesh conversion")

    neuron = navis.read_swc(swc_path)

    if verbose:
        print(f"  Loaded neuron: {neuron.n_nodes} nodes, {neuron.n_branches} branches")

    # Convert TreeNeuron to MeshNeuron
    mesh_neuron = navis.conversion.tree2meshneuron(neuron)

    if verbose:
        print(f"  Generated mesh: {len(mesh_neuron.vertices)} vertices, {len(mesh_neuron.faces)} faces")

    return trimesh.Trimesh(
        vertices=mesh_neuron.vertices,
        faces=mesh_neuron.faces,
    )


# ---------------------------------------------------------------------------
# Approach 2: trimesh-based tube generation (fallback)
# ---------------------------------------------------------------------------

def create_tube_segment(p1: np.ndarray, p2: np.ndarray, r1: float, r2: float,
                        n_sides: int = 8) -> trimesh.Trimesh:
    """Create a truncated cone (tube segment) between two points."""
    direction = p2 - p1
    length = np.linalg.norm(direction)
    if length < 1e-10:
        return None

    # Create a unit cylinder and transform it
    # Use trimesh's creation utilities
    cylinder = trimesh.creation.cylinder(
        radius=1.0, height=length, sections=n_sides
    )

    # Scale radii: cylinder goes from -height/2 to +height/2 along Z
    verts = cylinder.vertices.copy()
    # Scale top vs bottom radius
    top_mask = verts[:, 2] > 0
    bottom_mask = ~top_mask
    verts[top_mask, 0] *= r2
    verts[top_mask, 1] *= r2
    verts[bottom_mask, 0] *= r1
    verts[bottom_mask, 1] *= r1

    cylinder.vertices = verts

    # Align cylinder to the direction vector
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

    # Translate to midpoint
    midpoint = (p1 + p2) / 2.0
    cylinder.apply_translation(midpoint)

    return cylinder


def swc_to_mesh_tubes(swc_path: str, tube_sides: int = 20,
                      min_radius: float = 0.2, verbose: bool = True) -> trimesh.Trimesh:
    """Convert SWC to mesh by creating tube segments along each edge.

    min_radius of 0.5 gives visible but not chunky tubes (Geppetto's
    SWCReader.java uses 1.0, but that's too thick for precomputed meshes).
    """
    nodes = parse_swc(swc_path)

    if verbose:
        print(f"  Using tube generation: {len(nodes)} nodes, {tube_sides} sides per tube")

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

    # Also add spheres at branch points for smoother junctions
    branch_points = set()
    child_count = {}
    for node in nodes.values():
        pid = node["parent"]
        if pid > 0:
            child_count[pid] = child_count.get(pid, 0) + 1
    for nid, count in child_count.items():
        if count > 1:
            branch_points.add(nid)

    for nid in branch_points:
        node = nodes[nid]
        r = node["radius"] if not np.isnan(node["radius"]) else min_radius
        r = max(r, min_radius)
        sphere = trimesh.creation.icosphere(subdivisions=1, radius=r)
        sphere.apply_translation([node["x"], node["y"], node["z"]])
        meshes.append(sphere)

    if not meshes:
        raise ValueError("No tube segments could be generated from SWC")

    if verbose:
        print(f"  Created {len(meshes)} tube/sphere primitives, merging...")

    combined = trimesh.util.concatenate(meshes)

    if verbose:
        print(f"  Merged mesh: {len(combined.vertices)} vertices, {len(combined.faces)} faces")

    return combined


def swc_to_obj(swc_path: str, obj_path: str, method: str = "navis",
               tube_sides: int = 20, verbose: bool = True) -> trimesh.Trimesh:
    """Convert SWC to OBJ mesh file.

    Returns the generated trimesh for inspection/further use.
    """
    if verbose:
        print(f"Converting SWC: {swc_path}")

    if method == "navis":
        try:
            mesh = swc_to_mesh_navis(swc_path, verbose=verbose)
        except ImportError:
            if verbose:
                print("  navis not available, falling back to tube method")
            mesh = swc_to_mesh_tubes(swc_path, tube_sides=tube_sides,
                                     verbose=verbose)
    else:
        mesh = swc_to_mesh_tubes(swc_path, tube_sides=tube_sides,
                                 verbose=verbose)

    mesh.export(obj_path, file_type="obj")

    if verbose:
        print(f"  Saved OBJ: {obj_path} "
              f"({len(mesh.vertices)} vertices, {len(mesh.faces)} faces)")

    return mesh


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Convert SWC skeleton files to OBJ meshes (and optionally to precomputed format)"
    )
    parser.add_argument("--input-swc", default=None,
                        help="Path to local SWC file")
    parser.add_argument("--vfb-id", default=None,
                        help="VFB image ID to download SWC from server")
    parser.add_argument("--template-id", default="VFB_00101567",
                        help="Template ID for URL construction (default: JRC2018Unisex)")
    parser.add_argument("--output-dir", required=True,
                        help="Output directory (OBJ saved here as volume_man.obj)")
    parser.add_argument("--resolution", type=float, nargs=3,
                        default=[518.9161, 518.9161, 1000.0],
                        help="Voxel resolution in nm [x y z] (default: JRC2018U)")
    parser.add_argument("--method", choices=["navis", "tubes"], default="navis",
                        help="Mesh generation method (default: navis)")
    parser.add_argument("--tube-sides", type=int, default=20,
                        help="Number of sides per tube segment (tubes method only, default: 20 to match Geppetto)")
    parser.add_argument("--label", default=None,
                        help="Display label for the mesh segment")
    parser.add_argument("--precomputed", action="store_true",
                        help="Also convert the OBJ to precomputed format")
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()

    if not args.input_swc and not args.vfb_id:
        parser.error("Must provide either --input-swc or --vfb-id")

    output_dir = os.path.abspath(os.path.expanduser(args.output_dir))
    os.makedirs(output_dir, exist_ok=True)
    vfb_id = args.vfb_id or os.path.splitext(os.path.basename(args.input_swc))[0]

    swc_path = args.input_swc
    tmp_swc = None

    if not swc_path:
        url = vfb_image_url(args.vfb_id, args.template_id, "volume.swc")
        if args.verbose:
            print(f"Downloading SWC: {url}")
        tmp_swc = tempfile.NamedTemporaryFile(suffix=".swc", delete=False)
        swc_path = tmp_swc.name
        tmp_swc.close()
        download_file(url, swc_path)

    # Step 1: SWC → OBJ (the durable artifact)
    obj_path = os.path.join(output_dir, "volume_man.obj")
    try:
        swc_to_obj(swc_path, obj_path, method=args.method,
                   tube_sides=args.tube_sides, verbose=args.verbose)
    finally:
        if tmp_swc:
            os.unlink(swc_path)

    # Step 2 (optional): OBJ → precomputed (via convert_obj_meshes)
    if args.precomputed:
        from convert_obj_meshes import convert_obj_to_precomputed
        convert_obj_to_precomputed(
            obj_path, output_dir, vfb_id,
            resolution=args.resolution, label=args.label, verbose=args.verbose,
        )

    print(f"Done. OBJ at: {obj_path}")
    if args.precomputed:
        print(f"Precomputed at: {output_dir}/{vfb_id}")


if __name__ == "__main__":
    main()
