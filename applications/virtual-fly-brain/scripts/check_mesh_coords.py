#!/usr/bin/env python3
"""Debug mesh and volume coordinate spaces"""
import json
import sys
import os

if len(sys.argv) < 2:
    print("Usage: python check_mesh_coords.py <dataset_path>")
    sys.exit(1)

dataset_path = sys.argv[1]

# Read main info
with open(os.path.join(dataset_path, "info"), "r") as f:
    info = json.load(f)

print("=== Dataset Info ===")
print(f"Type: {info['type']}")
print(f"Data type: {info['data_type']}")
print(f"Volume size (XYZ): {info['scales'][0]['size']}")
print(f"Resolution (XYZ): {info['scales'][0]['resolution']}")
print(f"Chunk sizes: {info['scales'][0]['chunk_sizes']}")

# Calculate physical bounds
size = info["scales"][0]["size"]
resolution = info["scales"][0]["resolution"]
physical_bounds = [s * r for s, r in zip(size, resolution)]
print(f"Physical bounds: {physical_bounds}")

# Read mesh info if exists
mesh_info_path = os.path.join(dataset_path, "mesh", "info")
if os.path.exists(mesh_info_path):
    print("\n=== Mesh Info ===")
    with open(mesh_info_path, "r") as f:
        mesh_info = json.load(f)
    print(json.dumps(mesh_info, indent=2))

    # Check a sample mesh file
    mesh_dir = os.path.join(dataset_path, "mesh")
    mesh_files = [
        f
        for f in os.listdir(mesh_dir)
        if f.endswith(".gz") or (f.isdigit() and not f.endswith(".gz"))
    ]

    if mesh_files:
        sample_mesh = mesh_files[0]
        print(f"\nSample mesh file: {sample_mesh}")

        # Try to read and check coordinates
        try:
            from cloudvolume import CloudVolume
            from cloudvolume.mesh import Mesh

            vol = CloudVolume(f"file://{dataset_path}", mip=0)

            # Get segment ID from filename
            seg_id = int(sample_mesh.replace(".gz", "").replace(":", "_").split("_")[0])

            try:
                mesh = vol.mesh.get(seg_id)
                if mesh and len(mesh.vertices) > 0:
                    print(f"\nMesh {seg_id} vertices:")
                    print(f"  Min: {mesh.vertices.min(axis=0)}")
                    print(f"  Max: {mesh.vertices.max(axis=0)}")
                    print(f"  Shape: {mesh.vertices.shape}")

                    # Compare with volume bounds
                    max_voxel = mesh.vertices.max(axis=0)
                    print(f"\nComparison:")
                    print(f"  Volume size (voxels): {size}")
                    print(f"  Mesh max (should be <= volume size): {max_voxel}")

                    if any(max_voxel > size):
                        print(f"  ⚠ WARNING: Mesh vertices exceed volume bounds!")
                    else:
                        print(f"  ✓ Mesh vertices within volume bounds")
            except Exception as e:
                print(f"  Error loading mesh: {e}")

        except Exception as e:
            print(f"Error: {e}")
else:
    print("\n⚠ No mesh info found")
