#!/usr/bin/env python3
"""
Merge disconnected components within each segment using connected component analysis.
Use this if you have segments that should be single objects but are fragmented.
"""
import sys
import nrrd
import numpy as np
from scipy import ndimage


def merge_segments_by_connectivity(input_file, output_file, min_size=100, verbose=True):
    """
    Apply connected component labeling to merge fragments.
    Each connected region gets a new unique ID.

    Args:
        input_file: Path to input NRRD
        output_file: Path to output NRRD
        min_size: Minimum voxel count for a component to be kept
        verbose: Print progress
    """
    if verbose:
        print(f"Reading: {input_file}")

    data, header = nrrd.read(input_file)

    if verbose:
        print(f"Shape: {data.shape}, dtype: {data.dtype}")
        original_segments = len(np.unique(data)) - 1  # Exclude background
        print(f"Original segments: {original_segments}")

    # Create binary mask (non-zero = foreground)
    mask = data > 0

    # Connected component labeling
    if verbose:
        print("Running connected component analysis...")

    labeled, num_features = ndimage.label(mask)

    if verbose:
        print(f"Found {num_features} connected components")

    # Filter by size and renumber
    output = np.zeros_like(data)
    new_label = 1

    for component_id in range(1, num_features + 1):
        component_mask = labeled == component_id
        size = np.sum(component_mask)

        if size >= min_size:
            output[component_mask] = new_label
            if verbose and new_label <= 20:
                print(f"  Component {new_label}: {size:,} voxels")
            new_label += 1

    if verbose:
        final_segments = new_label - 1
        print(f"\nFinal segments: {final_segments}")
        print(f"Removed: {num_features - final_segments} small components")

    # Write output
    nrrd.write(output_file, output.astype(data.dtype), header)

    if verbose:
        print(f"✓ Saved to: {output_file}")

    return output


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="Merge segmentation fragments using connected component analysis"
    )
    parser.add_argument("input_file", help="Input NRRD file")
    parser.add_argument("output_file", help="Output NRRD file")
    parser.add_argument(
        "--min-size",
        type=int,
        default=100,
        help="Minimum voxel count for a component (default: 100)",
    )
    parser.add_argument("--verbose", action="store_true", help="Print progress")

    args = parser.parse_args()

    merge_segments_by_connectivity(
        args.input_file, args.output_file, min_size=args.min_size, verbose=args.verbose
    )
