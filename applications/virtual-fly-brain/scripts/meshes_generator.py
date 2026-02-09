#!/usr/bin/env python3
"""
Complete mesh generation and setup for precomputed segmentation volumes.
Automatically creates segment properties for Neuroglancer to discover segments.
Supports parallel processing for faster mesh generation.
"""
import os
import sys
import json
from cloudvolume import CloudVolume
from cloudvolume.mesh import Mesh
from cloudvolume.lib import Bbox
import numpy as np
from multiprocessing import Pool, cpu_count

try:
    from skimage import measure
except ImportError:
    print("ERROR: scikit-image not installed. Install with: pip install scikit-image")
    sys.exit(1)


def create_segment_properties(local_path, segment_ids, verbose=True):
    """Create segment_properties directory with info file listing all segments."""

    segment_props_dir = os.path.join(local_path, "segment_properties")
    os.makedirs(segment_props_dir, exist_ok=True)

    # Create the info file
    info_path = os.path.join(segment_props_dir, "info")
    info = {
        "@type": "neuroglancer_segment_properties",
        "inline": {
            "ids": [str(seg_id) for seg_id in segment_ids],
            "properties": [
                {
                    "id": "label",
                    "type": "label",
                    "values": [f"Segment {seg_id}" for seg_id in segment_ids],
                },
                {
                    "id": "description",
                    "type": "description",
                    "values": [f"Segment ID {seg_id}" for seg_id in segment_ids],
                },
            ],
        },
    }

    with open(info_path, "w") as f:
        json.dump(info, f, indent=2)

    if verbose:
        print(f"  ✓ Created segment properties for {len(segment_ids)} segments")


def setup_mesh_metadata(dataset_path, local_path, verbose=True):
    """Ensure mesh metadata is properly configured."""
    vol = CloudVolume(dataset_path, mip=0, use_https=False)

    # Update main info with mesh and segment_properties
    needs_update = False
    if "mesh" not in vol.info or vol.info["mesh"] is None:
        vol.info["mesh"] = "mesh"
        needs_update = True

    if "segment_properties" not in vol.info or vol.info["segment_properties"] is None:
        vol.info["segment_properties"] = "segment_properties"
        needs_update = True

    if needs_update:
        vol.commit_info()
        if verbose:
            print(f"  ✓ Updated main info (mesh + segment_properties)")

    # Create mesh directory
    mesh_dir = os.path.join(local_path, "mesh")
    os.makedirs(mesh_dir, exist_ok=True)

    # Get resolution and voxel_offset from the volume info
    resolution = vol.info["scales"][0]["resolution"]
    voxel_offset = vol.info["scales"][0].get("voxel_offset", [0, 0, 0])

    # Create mesh info with legacy format (multi-res format not supported by CloudVolume)
    mesh_info_path = os.path.join(mesh_dir, "info")
    mesh_info = {
        "@type": "neuroglancer_legacy_mesh",
        "mip": 0,
        "vertex_quantization_bits": 10,
        "lod_scale_multiplier": 1.0,
    }

    with open(mesh_info_path, "w") as f:
        json.dump(mesh_info, f, indent=2)

    if verbose:
        print(f"  ✓ Mesh metadata configured (legacy format)")
        print(f"    Resolution: {resolution}")
        print(f"    Voxel offset: {voxel_offset}")


def generate_single_mesh(args):
    """Generate mesh for a single segment (worker function for parallel processing)"""
    from scipy import ndimage

    seg_id, data, dust_threshold, filter_noise = args

    try:
        mask = data == seg_id
        voxel_count = np.sum(mask)

        if voxel_count < dust_threshold:
            return {"status": "skipped", "seg_id": seg_id, "voxels": voxel_count}

        # Optional: Remove noise by keeping only largest connected component
        if filter_noise:
            # Find bounding box of the mask to reduce computation
            coords = np.argwhere(mask)
            if len(coords) == 0:
                return {"status": "empty", "seg_id": seg_id}

            min_coords = coords.min(axis=0)
            max_coords = coords.max(axis=0)

            # Extract just the bounding box region
            bbox_mask = mask[
                min_coords[0] : max_coords[0] + 1,
                min_coords[1] : max_coords[1] + 1,
                min_coords[2] : max_coords[2] + 1,
            ]

            # Label only the bounding box region
            labeled, num_features = ndimage.label(bbox_mask)
            if num_features > 1:
                # Find largest component
                component_sizes = [
                    (labeled == i).sum() for i in range(1, num_features + 1)
                ]
                largest_component = np.argmax(component_sizes) + 1
                bbox_mask = labeled == largest_component
                new_voxel_count = np.sum(bbox_mask)

                # If we filtered out too much, skip this segment
                if new_voxel_count < dust_threshold:
                    return {
                        "status": "skipped",
                        "seg_id": seg_id,
                        "voxels": new_voxel_count,
                        "filtered": True,
                    }

                # Update the full mask with the filtered bbox
                mask[:] = False
                mask[
                    min_coords[0] : max_coords[0] + 1,
                    min_coords[1] : max_coords[1] + 1,
                    min_coords[2] : max_coords[2] + 1,
                ] = bbox_mask

        try:
            vertices, faces, normals, values = measure.marching_cubes(
                mask, level=0.5, allow_degenerate=False
            )
        except (ValueError, RuntimeError):
            return {"status": "no_surface", "seg_id": seg_id}

        if len(vertices) == 0 or len(faces) == 0:
            return {"status": "empty", "seg_id": seg_id}

        vertices = vertices.astype(np.float32)
        faces = faces.astype(np.uint32)

        return {
            "status": "success",
            "seg_id": seg_id,
            "vertices": vertices,
            "faces": faces,
            "voxel_count": voxel_count,
        }

    except Exception as e:
        return {"status": "error", "seg_id": seg_id, "error": str(e)}


def generate_merged_mesh(data, verbose=True):
    """Generate a single mesh from all non-zero voxels in the volume."""
    from scipy import ndimage

    # Create mask of all non-zero voxels
    mask = data > 0
    voxel_count = np.sum(mask)

    if verbose:
        print(f"  Creating merged mesh from {voxel_count} voxels...")

    try:
        vertices, faces, normals, values = measure.marching_cubes(
            mask, level=0.5, allow_degenerate=False
        )
    except (ValueError, RuntimeError) as e:
        if verbose:
            print(f"  ✗ Failed to generate merged mesh: {e}")
        return None

    if len(vertices) == 0 or len(faces) == 0:
        if verbose:
            print(f"  ✗ Merged mesh has no geometry")
        return None

    vertices = vertices.astype(np.float32)
    faces = faces.astype(np.uint32)

    if verbose:
        print(f"  ✓ Merged mesh: {len(vertices)} vertices, {len(faces)} faces")

    return {"vertices": vertices, "faces": faces}


def generate_meshes_with_skimage(
    dataset_path,
    dust_threshold=100,
    verbose=True,
    num_workers=None,
    filter_noise=False,  # Disabled by default - too slow
    merge_segments=False,
):
    """Generate meshes using scikit-image marching cubes."""

    if verbose:
        print(f"\nProcessing: {dataset_path}")
        print("=" * 60)

    if dataset_path.startswith("file://"):
        local_path = dataset_path.replace("file://", "")
        local_path = os.path.expanduser(local_path)
        dataset_path = "file://" + local_path
    else:
        local_path = dataset_path

    setup_mesh_metadata(dataset_path, local_path, verbose)

    vol = CloudVolume(dataset_path, mip=0, use_https=False)
    bbox = Bbox([0, 0, 0], vol.info["scales"][0]["size"])
    data = vol[bbox.to_slices()]

    if data.ndim == 4:
        data = data[:, :, :, 0]

    if verbose:
        print(f"  Volume shape: {data.shape}, dtype: {data.dtype}")
        print(f"  Resolution:  {vol.info['scales'][0]['resolution']}")

    # Find ALL unique segments (including those we won't mesh)
    all_segments = np.unique(data)
    all_segments = all_segments[all_segments > 0]  # Exclude background

    if verbose:
        print(f"  Found {len(all_segments)} non-zero segments")

    resolution = vol.info["scales"][0]["resolution"]
    voxel_offset = vol.info["scales"][0].get("voxel_offset", [0, 0, 0])

    # Handle merged vs individual mesh generation
    if merge_segments:
        if verbose:
            print(f"\n  Generating single merged mesh from all segments...")
            print(
                f"  Note: Vertices will be transformed to physical coordinates (resolution: {resolution})"
            )

        # Use segment ID 1 for the merged mesh
        create_segment_properties(local_path, [1], verbose)

        merged_mesh = generate_merged_mesh(data, verbose)

        if merged_mesh:
            # Transform vertices to physical coordinates
            vertices = merged_mesh["vertices"].copy()
            vertices[:, 0] = vertices[:, 0] * resolution[0] + voxel_offset[0]
            vertices[:, 1] = vertices[:, 1] * resolution[1] + voxel_offset[1]
            vertices[:, 2] = vertices[:, 2] * resolution[2] + voxel_offset[2]

            mesh_obj = Mesh(vertices, merged_mesh["faces"], segid=1)
            vol.mesh.put(mesh_obj, compress=True)

            return {
                "generated": 1,
                "skipped": 0,
                "failed": 0,
                "total": 1,
                "segments_with_meshes": [1],
            }
        else:
            return {
                "generated": 0,
                "skipped": 0,
                "failed": 1,
                "total": 1,
                "segments_with_meshes": [],
            }

    # Individual segment mesh generation (original behavior)
    # Create segment properties for ALL segments
    create_segment_properties(local_path, all_segments.tolist(), verbose)

    # Determine number of workers
    if num_workers is None:
        num_workers = min(
            4, max(1, cpu_count() - 2)
        )  # Use max 4 workers, leave 2 cores free

    if verbose:
        print(f"\n  Generating meshes (dust threshold: {dust_threshold} voxels)...")
        print(f"  Using {num_workers} parallel workers")
        print(f"  Noise filtering: {'enabled' if filter_noise else 'disabled'}")
        print(
            f"  Note: Vertices will be transformed to physical coordinates (resolution: {resolution})"
        )

    meshes_generated = 0
    meshes_skipped = 0
    meshes_failed = 0
    segments_with_meshes = []

    # Prepare arguments for parallel processing
    mesh_args = [
        (seg_id, data, dust_threshold, filter_noise) for seg_id in all_segments
    ]

    # Process in parallel
    if num_workers > 1:
        with Pool(processes=num_workers) as pool:
            results = pool.map(generate_single_mesh, mesh_args)
    else:
        # Sequential processing for debugging
        results = [generate_single_mesh(arg) for arg in mesh_args]

    # Write meshes and collect statistics
    for idx, result in enumerate(results):
        seg_id = result["seg_id"]
        status = result["status"]

        if verbose and (idx + 1) % 10 == 0:
            print(f"    Processed {idx+1}/{len(all_segments)} segments...")

        if status == "success":
            # Transform vertices to physical coordinates
            vertices = result["vertices"].copy()
            vertices[:, 0] = vertices[:, 0] * resolution[0] + voxel_offset[0]
            vertices[:, 1] = vertices[:, 1] * resolution[1] + voxel_offset[1]
            vertices[:, 2] = vertices[:, 2] * resolution[2] + voxel_offset[2]

            # Write mesh to cloudvolume
            mesh_obj = Mesh(vertices, result["faces"], segid=int(seg_id))
            vol.mesh.put(mesh_obj, compress=True)
            segments_with_meshes.append(int(seg_id))
            meshes_generated += 1

            if verbose and meshes_generated <= 5:
                print(
                    f"    Segment {seg_id}: ✓ ({len(result['vertices'])} verts, {len(result['faces'])} faces)"
                )

        elif status == "skipped":
            meshes_skipped += 1
        else:
            meshes_failed += 1

    if verbose:
        print(f"\n  Summary:")
        print(f"    ✓ Generated: {meshes_generated} meshes")
        print(f"    ⊘ Skipped:   {meshes_skipped} segments")
        print(f"    ✗ Failed:    {meshes_failed} segments")
        print(f"    📋 Total segments in properties: {len(all_segments)}")

    return {
        "generated": meshes_generated,
        "skipped": meshes_skipped,
        "failed": meshes_failed,
        "total": len(all_segments),
        "segments_with_meshes": segments_with_meshes,
    }


def generate_neuroglancer_state(
    datasets_info, base_url="http://localhost:8080/precomputed", output_path=None
):
    """Generate a Neuroglancer JSON state with all segments pre-selected."""

    layers = []

    # Get resolution from first dataset for dimensions
    first_dataset_path = datasets_info[0]["path"].replace("file://", "")
    with open(os.path.join(first_dataset_path, "info"), "r") as f:
        first_info = json.load(f)

    resolution = first_info["scales"][0]["resolution"]
    size = first_info["scales"][0]["size"]

    # Calculate appropriate position (center of volume)
    position = [s // 2 for s in size]

    for dataset_info in datasets_info:
        dataset_path = dataset_info["path"]
        dataset_name = os.path.basename(dataset_path.rstrip("/"))
        segments = dataset_info.get("segments_with_meshes", [])

        # Select first 10 segments by default (for performance)
        selected_segments = [str(s) for s in segments[:10]]

        layer = {
            "type": "segmentation",
            "source": {
                "url": f"precomputed://{base_url}/{dataset_name}",
                "subsources": {"default": True, "mesh": True, "properties": True},
                "enableDefaultSubsources": False,
            },
            "tab": "segments",
            "segments": selected_segments,
            "hideSegmentZero": True,
            "selectedAlpha": 1.0,
            "notSelectedAlpha": 0.15,
            "objectAlpha": 0.8,
            "meshRenderScale": 1,
            "meshSilhouetteRendering": 3,
            "name": dataset_name,
            "visible": True,
            # Apply coordinate transform to meshes to account for resolution
            "transform": [
                [resolution[0], 0, 0, 0],
                [0, resolution[1], 0, 0],
                [0, 0, resolution[2], 0],
            ],
        }
        layers.append(layer)

    state = {
        "dimensions": {
            "x": [resolution[0] * 1e-6, "m"],  # Convert to meters
            "y": [resolution[1] * 1e-6, "m"],
            "z": [resolution[2] * 1e-6, "m"],
        },
        "position": position,
        "crossSectionScale": max(size) // 100,  # Auto-scale based on volume size
        "projectionScale": max(size) * 2,
        "projectionOrientation": [0, 0, 0, 1],  # Default orientation
        "layers": layers,
        "layout": "4panel",
        "showAxisLines": True,  # Show axis lines for reference
    }

    if output_path:
        with open(output_path, "w") as f:
            json.dump(state, f, indent=2)
        print(f"\n✓ Saved Neuroglancer state to: {output_path}")

    return state


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Generate meshes and segment properties for precomputed segmentation volumes"
    )
    parser.add_argument(
        "--input-path",
        required=True,
        help="Path to precomputed dataset directory (containing one or more datasets)",
    )
    parser.add_argument(
        "--dust-threshold",
        type=int,
        default=100,
        help="Minimum voxel count for mesh generation (default: 100)",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=None,
        help="Number of parallel workers for mesh generation (default: CPU count - 1)",
    )
    parser.add_argument(
        "--no-filter-noise",
        action="store_true",
        help="Disable noise filtering (keep all connected components)",
    )
    parser.add_argument(
        "--filter-noise",
        action="store_true",
        help="Enable noise filtering to keep only largest connected component (slow!)",
    )
    parser.add_argument(
        "--merge-segments",
        action="store_true",
        help="Merge all segments into a single mesh per dataset",
    )
    parser.add_argument(
        "--verbose", action="store_true", help="Print detailed progress"
    )
    parser.add_argument(
        "--output-state",
        help="Output path for Neuroglancer JSON state file (will be saved in input-path if not specified)",
    )
    parser.add_argument(
        "--base-url",
        default="http://localhost:8080",
        help="Base URL for HTTP server in generated state (default: http://localhost:8080)",
    )

    args = parser.parse_args()

    # Expand and normalize input path
    input_path = os.path.abspath(os.path.expanduser(args.input_path))

    if not os.path.isdir(input_path):
        raise ValueError(f"Input path does not exist: {input_path}")

    # Find all dataset directories in the input path
    # A dataset directory has an 'info' file in it
    datasets = []
    for item in os.listdir(input_path):
        item_path = os.path.join(input_path, item)
        if os.path.isdir(item_path) and os.path.exists(os.path.join(item_path, "info")):
            datasets.append(f"file://{item_path}")

    if not datasets:
        raise ValueError(
            f"No precomputed datasets found in {input_path}. Make sure directories contain 'info' files."
        )

    if args.verbose:
        print(f"Found {len(datasets)} precomputed datasets in {input_path}")
        for ds in datasets:
            print(f"  - {os.path.basename(ds.replace('file://', ''))}")

    total_stats = {"generated": 0, "skipped": 0, "failed": 0, "total": 0, "datasets": 0}

    datasets_info = []

    for dataset in datasets:
        try:
            stats = generate_meshes_with_skimage(
                dataset,
                dust_threshold=args.dust_threshold,
                verbose=args.verbose,
                num_workers=args.workers,
                filter_noise=args.filter_noise,  # Now opt-in instead of opt-out
                merge_segments=args.merge_segments,
            )

            total_stats["generated"] += stats["generated"]
            total_stats["skipped"] += stats["skipped"]
            total_stats["failed"] += stats["failed"]
            total_stats["total"] += stats["total"]
            total_stats["datasets"] += 1

            datasets_info.append(
                {
                    "path": dataset,
                    "segments_with_meshes": stats.get("segments_with_meshes", []),
                }
            )

        except Exception as e:
            print(f"\nERROR processing {dataset}: {e}")
            if args.verbose:
                import traceback

                traceback.print_exc()
            continue

    print(f"\n" + "=" * 60)
    print(f"COMPLETE!  Mesh Generation Summary:")
    print(f"=" * 60)
    print(f"  Datasets processed: {total_stats['datasets']}")
    print(f"  Total segments:     {total_stats['total']}")
    print(f"  ✓ Meshes generated: {total_stats['generated']}")
    print(f"  ⊘ Segments skipped: {total_stats['skipped']}")
    print(f"  ✗ Segments failed:  {total_stats['failed']}")

    # Generate Neuroglancer state
    output_state_path = args.output_state or os.path.join(
        input_path, "neuroglancer_state.json"
    )
    if datasets_info:
        generate_neuroglancer_state(
            datasets_info, base_url=args.base_url, output_path=output_state_path
        )

    print(f"\nNext steps:")
    print(f"  1. Start HTTP server: cd ~ && npx http-server . -p 8080 --cors")
    print(f"  2. Load in Neuroglancer:")
    print(f"     - Click the {{}} button")
    if datasets_info:
        print(f"     - Paste contents from: {output_state_path}")
    print(f"  3. Segments will now auto-populate in the UI!")
    print(f"  4. Click on any segment ID to select/view it")


if __name__ == "__main__":
    main()
