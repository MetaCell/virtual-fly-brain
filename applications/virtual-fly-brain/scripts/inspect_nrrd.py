#!/usr/bin/env python3
"""Inspect NRRD file contents to understand segmentation issues"""
import sys
import nrrd
import numpy as np

if len(sys.argv) < 2:
    print("Usage: python inspect_nrrd.py <nrrd_file>")
    sys.exit(1)

nrrd_file = sys.argv[1]
print(f"Inspecting: {nrrd_file}\n")

data, header = nrrd.read(nrrd_file)

print("=== Shape and Type ===")
print(f"Shape (Z,Y,X): {data.shape}")
print(f"Dtype: {data.dtype}")

print("\n=== Header ===")
for key, value in sorted(header.items()):
    print(f"{key}: {value}")

print("\n=== Unique Segment IDs ===")
unique_ids = np.unique(data)
print(f"Total unique values: {len(unique_ids)}")
print(f"Min value: {unique_ids[0]}")
print(f"Max value: {unique_ids[-1]}")

# Show distribution
print(f"\nFirst 20 segment IDs: {unique_ids[:20].tolist()}")
if len(unique_ids) > 20:
    print(f"Last 20 segment IDs: {unique_ids[-20:].tolist()}")

# Count voxels per segment
print("\n=== Segment Sizes (top 20) ===")
segment_counts = {}
for seg_id in unique_ids:
    if seg_id == 0:
        continue  # Skip background
    count = np.sum(data == seg_id)
    segment_counts[seg_id] = count

# Sort by size
sorted_segments = sorted(segment_counts.items(), key=lambda x: x[1], reverse=True)
for seg_id, count in sorted_segments[:20]:
    print(f"Segment {seg_id}: {count:,} voxels")

print(f"\n=== Potential Issues ===")
# Check if segments are consecutive
non_zero_ids = unique_ids[unique_ids > 0]
if len(non_zero_ids) > 0:
    expected_consecutive = np.arange(1, len(non_zero_ids) + 1)
    if not np.array_equal(non_zero_ids, expected_consecutive):
        print(
            "⚠ WARNING: Segment IDs are NOT consecutive (gaps or non-standard numbering)"
        )
        print(f"  This can cause issues with mesh generation")
    else:
        print("✓ Segment IDs are consecutive (1, 2, 3, ...)")

# Check for very small segments
small_segments = [sid for sid, cnt in segment_counts.items() if cnt < 100]
if small_segments:
    print(f"⚠ WARNING: {len(small_segments)} segments have < 100 voxels (dust)")
    print(f"  These may represent fragmentation of larger objects")
