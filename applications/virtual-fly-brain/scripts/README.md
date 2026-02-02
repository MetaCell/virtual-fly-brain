# NRRD to Neuroglancer Precomputed Workflow

## Overview
This guide shows how to convert NRRD segmentation files to Neuroglancer precomputed format with meshes.

## Fixed Issues

### Issue #1: Meshes not showing in Neuroglancer
**Root cause**: Mesh vertices were in physical coordinates (microns) instead of voxel coordinates.
**Fix**: Removed `spacing` parameter from `marching_cubes()` call. Neuroglancer applies resolution scaling separately.

### Issue #2: Segmentation fragmentation
**Clarification**: The NRRD files contain multiple anatomical structures as separate segments (this is correct).
If you see unexpected fragmentation, use `merge_segments.py` to consolidate connected components.

## Workflow

### Step 1: Inspect your data (optional but recommended)
```bash
cd /home/ddelpiano/git/neuroglass/dataScripts/nrrd_to_precomputed
python inspect_nrrd.py files/VFB_00101567.nrrd
```

### Step 2: (Optional) Merge fragmented segments
Only use this if you want to merge disconnected pieces into single segments:
```bash
python merge_segments.py \
  files/VFB_00101567.nrrd \
  files/VFB_00101567_merged.nrrd \
  --min-size 100 \
  --verbose
```

### Step 3: Convert NRRD to precomputed format
```bash
python converter.py \
  --input-dir files \
  --output-path output \
  --verbose
```

This will:
- Find all `.nrrd` files in `files/` directory
- Convert each to precomputed format in `output/` directory
- Create a mapping file: `output/sources_to_dataset.json`

### Step 4: Generate meshes
```bash
python meshes_generator.py \
  --input-path output \
  --dust-threshold 100 \
  --verbose
```

This will:
- Find all precomputed datasets in `output/` directory
- Generate meshes for each segment (skipping segments < 100 voxels)
- Create segment properties (labels and metadata)
- Generate `output/neuroglancer_state.json` for easy loading

### Step 5: Serve the data
```bash
cd output
npx http-server . -p 8080 --cors
```

### Step 6: View in Neuroglancer
1. Go to https://neuroglancer-demo.appspot.com/
2. Click the `{}` (JSON) button in the top-right
3. Copy the contents of `output/neuroglancer_state.json`
4. Paste into the JSON editor
5. Click outside the editor to load

## Troubleshooting

### Meshes still not showing?
1. **Check the browser console** for errors
2. **Verify mesh files exist**:
   ```bash
   ls -lh output/*/mesh/
   ```
3. **Check segment IDs match**:
   ```bash
   python inspect_nrrd.py files/VFB_00101567.nrrd | grep "Segment IDs"
   ```
4. **Try loading a single segment manually** in Neuroglancer UI

### Segmentation looks wrong?
- Use `inspect_nrrd.py` to see segment IDs and sizes
- The NRRD files contain pre-labeled anatomical structures
- If you see unexpected fragmentation, verify with the original data source

### Performance issues?
- Reduce `--dust-threshold` to skip more small segments
- Generate meshes for fewer segments initially
- Check your mesh file sizes
