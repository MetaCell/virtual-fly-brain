#!/usr/bin/env python3
"""
Complete mesh generation and setup for precomputed segmentation volumes. 
Automatically creates segment properties for Neuroglancer to discover segments.
"""
import os
import sys
import json
from cloudvolume import CloudVolume
from cloudvolume.mesh import Mesh
from cloudvolume. lib import Bbox
import numpy as np

try:
    from skimage import measure
except ImportError: 
    print("ERROR: scikit-image not installed. Install with: pip install scikit-image")
    sys. exit(1)


def create_segment_properties(local_path, segment_ids, verbose=True):
    """Create segment_properties directory with info file listing all segments."""
    
    segment_props_dir = os.path.join(local_path, 'segment_properties')
    os.makedirs(segment_props_dir, exist_ok=True)
    
    # Create the info file
    info_path = os.path.join(segment_props_dir, 'info')
    info = {
        "@type": "neuroglancer_segment_properties",
        "inline": {
            "ids": [str(seg_id) for seg_id in segment_ids],
            "properties": [
                {
                    "id":  "label",
                    "type": "label",
                    "values": [f"Segment {seg_id}" for seg_id in segment_ids]
                },
                {
                    "id": "description",
                    "type": "description",
                    "values": [f"Segment ID {seg_id}" for seg_id in segment_ids]
                }
            ]
        }
    }
    
    with open(info_path, 'w') as f:
        json.dump(info, f, indent=2)
    
    if verbose:
        print(f"  ✓ Created segment properties for {len(segment_ids)} segments")


def setup_mesh_metadata(dataset_path, local_path, verbose=True):
    """Ensure mesh metadata is properly configured."""
    vol = CloudVolume(dataset_path, mip=0, use_https=False)
    
    # Update main info with mesh and segment_properties
    needs_update = False
    if 'mesh' not in vol. info or vol.info['mesh'] is None:
        vol.info['mesh'] = 'mesh'
        needs_update = True
    
    if 'segment_properties' not in vol.info or vol.info['segment_properties'] is None:
        vol.info['segment_properties'] = 'segment_properties'
        needs_update = True
    
    if needs_update:
        vol. commit_info()
        if verbose:
            print(f"  ✓ Updated main info (mesh + segment_properties)")
    
    # Create mesh directory
    mesh_dir = os.path. join(local_path, 'mesh')
    os.makedirs(mesh_dir, exist_ok=True)
    
    # Create mesh info
    mesh_info_path = os.path.join(mesh_dir, 'info')
    mesh_info = {
        "@type": "neuroglancer_legacy_mesh",
        "mip": 0,
        "vertex_quantization_bits": 10,
        "lod_scale_multiplier": 1.0
    }
    
    with open(mesh_info_path, 'w') as f:
        json.dump(mesh_info, f, indent=2)
    
    if verbose: 
        print(f"  ✓ Mesh metadata configured")


def generate_meshes_with_skimage(dataset_path, dust_threshold=100, verbose=True):
    """Generate meshes using scikit-image marching cubes."""
    
    if verbose:
        print(f"\nProcessing: {dataset_path}")
        print("=" * 60)
    
    if dataset_path.startswith('file://'):
        local_path = dataset_path.replace('file://', '')
        local_path = os.path.expanduser(local_path)
        dataset_path = 'file://' + local_path
    else:
        local_path = dataset_path
    
    setup_mesh_metadata(dataset_path, local_path, verbose)
    
    vol = CloudVolume(dataset_path, mip=0, use_https=False)
    bbox = Bbox([0, 0, 0], vol.info['scales'][0]['size'])
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
    
    # Create segment properties for ALL segments
    create_segment_properties(local_path, all_segments. tolist(), verbose)
    
    resolution = vol.info['scales'][0]['resolution']
    spacing = tuple(resolution)
    
    if verbose:
        print(f"\n  Generating meshes (dust threshold: {dust_threshold} voxels)...")
    
    meshes_generated = 0
    meshes_skipped = 0
    meshes_failed = 0
    segments_with_meshes = []
    
    for idx, seg_id in enumerate(all_segments):
        try:
            if verbose: 
                print(f"    [{idx+1}/{len(all_segments)}] Segment {seg_id}.. .", end='', flush=True)
            
            mask = (data == seg_id)
            voxel_count = np.sum(mask)
            
            if voxel_count < dust_threshold:
                if verbose: 
                    print(f" skipped ({voxel_count} voxels)")
                meshes_skipped += 1
                continue
            
            try:
                vertices, faces, normals, values = measure.marching_cubes(
                    mask,
                    level=0.5,
                    spacing=spacing,
                    allow_degenerate=False
                )
            except (ValueError, RuntimeError) as e:
                if verbose:
                    print(f" no surface")
                meshes_failed += 1
                continue
            
            if len(vertices) == 0 or len(faces) == 0:
                if verbose:
                    print(f" empty mesh")
                meshes_failed += 1
                continue
            
            vertices = vertices.astype(np. float32)
            faces = faces.astype(np.uint32)
            
            mesh_obj = Mesh(vertices, faces, segid=int(seg_id))
            vol.mesh.put(mesh_obj, compress=True)
            
            segments_with_meshes.append(int(seg_id))
            meshes_generated += 1
            if verbose:
                print(f" ✓ ({len(vertices)} verts, {len(faces)} faces)")
        
        except Exception as e:
            if verbose:
                print(f" ERROR: {str(e)[:50]}")
            meshes_failed += 1
            continue
    
    if verbose:
        print(f"\n  Summary:")
        print(f"    ✓ Generated: {meshes_generated} meshes")
        print(f"    ⊘ Skipped:   {meshes_skipped} segments")
        print(f"    ✗ Failed:    {meshes_failed} segments")
        print(f"    📋 Total segments in properties: {len(all_segments)}")
    
    return {
        'generated': meshes_generated,
        'skipped': meshes_skipped,
        'failed': meshes_failed,
        'total': len(all_segments),
        'segments_with_meshes': segments_with_meshes
    }


def generate_neuroglancer_state(datasets_info, base_url="http://localhost:8080/precomputed", output_path=None):
    """Generate a Neuroglancer JSON state with all segments pre-selected."""
    
    layers = []
    for dataset_info in datasets_info:
        dataset_path = dataset_info['path']
        dataset_name = os.path. basename(dataset_path. rstrip('/'))
        segments = dataset_info. get('segments_with_meshes', [])
        
        # Select first 10 segments by default (for performance)
        selected_segments = [str(s) for s in segments[:10]]
        
        layer = {
            "type": "segmentation",
            "source": {
                "url": f"precomputed://{base_url}/{dataset_name}",
                "subsources":  {
                    "default": True,
                    "mesh": True,
                    "properties": True
                },
                "enableDefaultSubsources": False
            },
            "tab": "segments",
            "segments": selected_segments,
            "hideSegmentZero": True,
            "selectedAlpha": 1.0,
            "notSelectedAlpha":  0.15,
            "objectAlpha": 0.8,
            "meshRenderScale": 1,
            "meshSilhouetteRendering":  3,
            "name":  dataset_name,
            "visible": True
        }
        layers.append(layer)
    
    state = {
        "dimensions": {
            "x": [1e-9, "m"],
            "y": [5.189161e-10, "m"],
            "z": [5.189161e-10, "m"]
        },
        "position": [87, 283, 605],
        "crossSectionScale": 5,
        "projectionScale": 2048,
        "layers": layers,
        "layout": "4panel"
    }
    
    if output_path:
        with open(output_path, 'w') as f:
            json.dump(state, f, indent=2)
        print(f"\n✓ Saved Neuroglancer state to: {output_path}")
    
    return state


def main():
    import argparse
    
    # Default dataset paths - can be overridden with --input-path
    DEFAULT_DATASETS = [
        "file://~/precomputed/VFB_00101567_1567",
        "file://~/precomputed/VFB_00101567_12vj",
        "file://~/precomputed/VFB_00101567_101b",
    ]
    
    # Default base URL for HTTP server
    DEFAULT_BASE_URL = "http://localhost:8080/precomputed"
    
    parser = argparse.ArgumentParser(
        description="Generate meshes and segment properties for precomputed segmentation volumes"
    )
    parser.add_argument(
        '--input-path',
        action='append',
        help='Path to precomputed dataset (can be specified multiple times). '
             f'Default: {", ".join(DEFAULT_DATASETS)}'
    )
    parser.add_argument(
        '--dust-threshold',
        type=int,
        default=100,
        help='Minimum voxel count for mesh generation (default: 100)'
    )
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Print detailed progress'
    )
    parser.add_argument(
        '--output-state',
        help='Output path for Neuroglancer JSON state file (default: ~/precomputed/neuroglancer_state.json)'
    )
    parser.add_argument(
        '--base-url',
        default=DEFAULT_BASE_URL,
        help=f'Base URL for HTTP server in generated state (default: {DEFAULT_BASE_URL})'
    )
    
    args = parser.parse_args()
    
    # Use provided paths or defaults
    datasets = args.input_path if args.input_path else DEFAULT_DATASETS
    
    total_stats = {
        'generated': 0,
        'skipped': 0,
        'failed': 0,
        'total': 0,
        'datasets': 0
    }
    
    datasets_info = []
    
    for dataset in datasets:
        try: 
            stats = generate_meshes_with_skimage(
                dataset, 
                dust_threshold=args.dust_threshold,
                verbose=args.verbose
            )
            
            total_stats['generated'] += stats['generated']
            total_stats['skipped'] += stats['skipped']
            total_stats['failed'] += stats['failed']
            total_stats['total'] += stats['total']
            total_stats['datasets'] += 1
            
            datasets_info.append({
                'path': dataset,
                'segments_with_meshes': stats. get('segments_with_meshes', [])
            })
            
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
    if datasets_info:
        output_state_path = args.output_state or os.path.expanduser("~/precomputed/neuroglancer_state.json")
        generate_neuroglancer_state(datasets_info, base_url=args.base_url, output_path=output_state_path)
    
    print(f"\nNext steps:")
    print(f"  1. Start HTTP server: cd ~ && npx http-server . -p 8080 --cors")
    print(f"  2. Load in Neuroglancer:")
    print(f"     - Click the {{}} button")
    print(f"     - Paste contents from: {output_state_path}")
    print(f"  3. Segments will now auto-populate in the UI!")
    print(f"  4. Click on any segment ID to select/view it")


if __name__ == "__main__":
    main()