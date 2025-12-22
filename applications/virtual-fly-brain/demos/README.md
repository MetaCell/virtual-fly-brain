# NRRD to Neuroglancer Precomputed Conversion with Mesh Generation

Convert NRRD segmentation volumes to Neuroglancer precomputed format with volumetric data and 3D surface meshes for visualization in neuroglass-research.

## Quick Start

### Prerequisites

```bash
# Create new conda environment with Python 3.12
conda create -n vfb python=3.12

# Activate the environment
conda activate vfb

# Install dependencies
pip install cloud-volume pynrrd numpy requests scikit-image

# Install Node.js/npm if not already installed (for local HTTP server)
# macOS: brew install node
# Ubuntu:  sudo apt install nodejs npm
```

###  Workflow

```bash
# 1. Convert all 3 NRRD files to precomputed format
#    (Default output: ./precomputed next to convert_nrrd_to_precomputed.py)
#    (Default: no compression; add --compress to gzip chunk files)
python convert_nrrd_to_precomputed.py \
  --input-url "http://v2.virtualflybrain.org/data/VFB/i/0010/1567/VFB_00101567/volume.nrrd" \
  --input-url "http://v2.virtualflybrain.org/data/VFB/i/0010/12vj/VFB_00101567/volume.nrrd" \
  --input-url "http://v2.virtualflybrain.org/data/VFB/i/0010/101b/VFB_00101567/volume.nrrd" \
  --verbose

# 2. Generate meshes and segment properties
#    (Default input datasets: next to generate_meshes.py)
python generate_meshes.py \
  --input-path "file://./precomputed/VFB_00101567_1567" \
  --input-path "file://./precomputed/VFB_00101567_12vj" \
  --input-path "file://./precomputed/VFB_00101567_101b" \
  --verbose

# 3. Start HTTP server (serve the folder containing ./precomputed)
cd /path/to/this/repo_or_script_folder
npx http-server . -p 8080 --cors
```

This creates:
```
./precomputed/VFB_00101567_1567/
./precomputed/VFB_00101567_12vj/
./precomputed/VFB_00101567_101b/
./neuroglancer_state.json
```

## Visualization Options

### Option 1: Use neuroglass. io (Easiest)

1. Go to [https://neuroglass.io](https://neuroglass.io)
2. Create or Edit a new Study
3. Add a new layer: 
   - **Type**: `segmentation`
   - **URL**: `http://localhost:8080/precomputed/VFB_00101567_1567`
4. View segments in the **Segments** tab
5. Click segment IDs to view volume + mesh rendering

### Option 2: Run neuroglass-research Locally

Follow the development setup instructions in the [neuroglass-research README](applications/neuroglass-research/README.md):

Then add your precomputed datasource: 
- **URL**:  `http://localhost:8080/precomputed/VFB_00101567_1567`
- **Type**: `segmentation`

## Loading All 3 Datasets

### Method 1: Use Generated State File (Recommended)

The mesh generation script creates a pre-configured Neuroglancer state with all 3 layers: 

1. Open neuroglass.io or your local instance
2. Click the **`< >`** button (JSON state) in the top-right
3. Copy and paste the contents: 
   ```bash
   cat ./neuroglancer_state.json
   ```
4. Click **Apply** or close the editor

**Result:** All 3 datasets load as separate layers with segments pre-selected. Each layer can be changed to an "Image"

## Complete Example

```bash
# One-shot test with all 3 datasets
python convert_nrrd_to_precomputed.py \
  --input-url "http://v2.virtualflybrain.org/data/VFB/i/0010/1567/VFB_00101567/volume.nrrd" \
  --input-url "http://v2.virtualflybrain.org/data/VFB/i/0010/12vj/VFB_00101567/volume.nrrd" \
  --input-url "http://v2.virtualflybrain.org/data/VFB/i/0010/101b/VFB_00101567/volume.nrrd" \
  --verbose

python generate_meshes.py \
  --input-path "file://./precomputed/VFB_00101567_1567" \
  --input-path "file://./precomputed/VFB_00101567_12vj" \
  --input-path "file://./precomputed/VFB_00101567_101b" \
  --verbose

cd /path/to/this/repo_or_script_folder
npx http-server . -p 8080 --cors

# Then load the generated state: 
cat ./neuroglancer_state.json
# Copy and paste into neuroglass.io
```

## What Gets Created

```
./precomputed/
├── VFB_00101567_1567/
│   ├── info
│   ├── 0/
│   ├── mesh/
│   │   └── info
│   └── segment_properties/
│       └── info
├── VFB_00101567_12vj/
├── VFB_00101567_101b/
└── ...
./neuroglancer_state.json
```