# VFB Image File Conversion to Neuroglancer Precomputed Format

## Overview

This folder converts Virtual Fly Brain (VFB) image files into [Neuroglancer precomputed format](https://github.com/google/neuroglancer/tree/master/src/datasource/precomputed) for the Neuroglancer/Neuroglass viewer.

VFB image data lives at `https://www.virtualflybrain.org/data/VFB/i/{first4}/{last4}/{template_id}/` and contains several file types per image:

| File | Format | Description |
|------|--------|-------------|
| `volume.nrrd` | NRRD | 3D volumetric voxel data (uint8, X Y Z, microns) |
| `volume_man.obj` | OBJ mesh | Manually curated or generated mesh (vertices + faces, X Y Z, microns) |
| `volume.obj` | OBJ point cloud | Auto-generated point cloud (vertices only, no faces) |
| `volume.swc` | SWC | Neuron skeleton/morphology tracing (microns) |
| `volume.wlz` | Woolz | Format for the IIP3D slice viewer |

## The production pipeline: `vfb_pipeline.py`

`vfb_pipeline.py` is what runs against the image store. For each image folder it writes **one file**, `precomputed.zip`, next to the source files: a precomputed dataset (`info`, `0/` chunks, `mesh/`) zipped as a single archive that Neuroglancer reads through its zip kvstore with HTTP Range requests:

```
https://www.virtualflybrain.org/data/VFB/i/0010/1567/VFB_00101567/precomputed.zip|zip:|neuroglancer-precomputed:
```

What is written depends on what the image **is** (its VFB category, from the KB), because every VFB NRRD is uint8 and the dtype cannot tell a template from a neuron:

| category | KB rule | layer | chunks (`0/`) | mesh |
|---|---|---|---|---|
| template | `:Template` individual | `image` | intensities | none |
| expression | typed by a `VFBexp_*` (GAL4 / split pattern) or `VFBext_*` (fragment) class | `image` | intensities | none |
| object | everything else: `FBbt_*`-typed neurons, clones, painted domains | `segmentation` | `{0,1}`, segment 1 | `volume_man.obj` if it has faces, else generated from `volume.swc`, else marching cubes on the NRRD |

Without a KB category (filesystem scan, `--ids`) the same decision is made from the data: a `volume_man.obj` with faces or a `volume.swc` means an object; a single-valued mask is an object; intensities are an image.

Axes and units: everything stays X, Y, Z as pynrrd returns it — no transposes, no swaps (OBJ and SWC vertices were checked against the NRRD voxel extents of templates, domains, FlyWire/hemibrain neurons and LM neurons). Source files are in microns; `resolution`, `voxel_offset` (voxel units) and mesh vertices are written in **nanometres**, the unit the precomputed spec defines, so VFB datasets compose with other precomputed sources.

The zip also carries `provenance.json` (pipeline version, category, mesh source, size+mtime of the source files). A re-run skips a folder whose zip was made by the current `PIPELINE_VERSION` from unchanged sources, so the job is idempotent and resumable; bump `PIPELINE_VERSION` to regenerate everything.

Each dataset is built in `--work-dir` (local scratch; a template-sized volume is ~120 MB of raw chunks) and only the finished zip is copied into the image folder, as `precomputed.zip.tmp-<pid>` then renamed — a reader never sees a partial file.

```bash
# What would be done for everything on JRC2018U, live images only (KB)
python vfb_pipeline.py --image-root /data --use-kb --template VFB_00101567 --dry-run

# A few folders, building on local scratch
python vfb_pipeline.py --image-root /data --ids VFB_00101567 VFB_00102107 VFB_jrchk0ew --work-dir /scratch

# A batch file (one id per line), e.g. one Argo task
python vfb_pipeline.py --image-root /data --ids-file batch.txt --work-dir /scratch
```

For a planned run (one plan pod, many workers): `--use-kb --list-targets targets.tsv` writes the discovered targets with their category (40 s for the 680k JRC2018U images); split that into batches and give each worker `--targets-file batch.tsv --results results.jsonl` — no KB access in the workers, one JSON line per image for the report.

`--layer-type image|segmentation` overrides the per-image decision; `--mask/--mesh-percentile/--decimate-fraction/--mesh-format` only affect the marching-cubes path (objects with no mesh); `--no-compress` leaves an uncompressed `precomputed/` folder for debugging. Discovery needs only HTTP access to `kb.virtualflybrain.org` (read-only, published credentials).

Measured on JRC2018U samples (one core): template 29 MB in 5 s; neurons and painted domains 0.3–0.9 MB in ~2 s; a dense GAL4 line 16 MB in 5 s; an MCFO fragment 6 MB in 3.5 s.

## VFB Image Categories & Conversion Strategies

There are four distinct categories of VFB images, each requiring a different conversion approach:

---

(The standalone scripts below predate `vfb_pipeline.py` and are kept for experiments; the production pipeline does not call `convert_templates.py` or `convert_all.py`.)

### Category A: Templates with Painted Domains (Index Regions)

**What they are:** Reference brain templates (e.g., JRC2018Unisex `VFB_00101567`) that contain a segmentation label field — an integer-indexed NRRD volume where each voxel value maps to a specific anatomical region (neuropil).

**Example data structure:**
- Template `VFB_00101567` has 46 painted domains
- Voxel value `0` = background/template, `3` = medulla (ME), `7` = calyx (CA), `16` = fan-shaped body (FB), etc.
- Each domain has its own VFB ID (e.g., `VFB_00102107` for medulla)
- Domain metadata includes: label, FBbt ontology ID, index value, type

**Conversion approach:**
1. Download the template NRRD (this is the full label field with all domains)
2. Convert NRRD → precomputed segmentation format (each voxel value = segment ID)
3. Generate meshes for each segment using marching cubes
4. Map segment IDs to VFB domain labels/ontology terms

**Script:** `convert_templates.py`

```bash
python convert_templates.py \
  --template-id VFB_00101567 \
  --output-dir output/templates/ \
  --verbose
```

---

### Category B: Neurons with Existing Full Meshes (OBJ)

**What they are:** Neurons (especially from FlyWire, FAFB, and newer datasets) that already have proper triangulated OBJ meshes (`volume_man.obj`) generated by trimesh. These have vertices AND faces.

**How to identify:** The `volume_man.obj` file contains both `v` (vertex) and `f` (face) lines, and was typically generated by trimesh or similar tools.

**Example:**
- FlyWire neuron `VFB_fw121683` — `volume_man.obj` has ~61K lines with full triangle mesh
- FlyEM-HB neuron `VFB_jrchjx4q` on JRC2018U — `volume_man.obj` has ~22K lines with full mesh

**Conversion approach:**
1. Download the OBJ mesh file
2. Parse vertices and faces
3. Convert directly to precomputed mesh format (Neuroglancer legacy mesh or multi-resolution mesh)
4. No marching cubes needed — this is the fastest conversion path

**Script:** `convert_obj_meshes.py`

```bash
python convert_obj_meshes.py \
  --input-obj volume_man.obj \
  --output-dir output/meshes/ \
  --vfb-id VFB_fw121683 \
  --template-id VFB_00101567 \
  --verbose
```

---

### Category C: SWC Skeletons Without Full Meshes → Generate Mesh from SWC

**What they are:** Neurons that have SWC skeleton tracings but either:
- Only have a point-cloud OBJ (`volume.obj` with vertices only, no faces), or
- Have no mesh at all

**How to identify:** The `volume.obj` is a point cloud (auto-generated by VFB) — it has `v` lines with 4 values (x, y, z, weight) but zero `f` (face) lines. The SWC file provides the skeleton with node positions and radii.

**SWC format recap:**
```
# PointNo Label X Y Z Radius Parent
1 0 227.18 70.34 59.46 0.07 -1
2 0 227.29 70.41 59.51 0.12 1
```
Each node has a 3D position and radius. Parent relationships define the tree structure.

**Conversion approach:**
1. Parse the SWC file to get the skeleton tree (nodes, positions, radii, connectivity)
2. Generate a mesh by "inflating" the skeleton:
   - For each edge (parent→child), create a truncated cone (frustum) connecting the two nodes
   - Use the node radii to set the cone diameters at each end
   - At branch points, create sphere caps to smooth the junctions
3. Merge all tube segments into a single watertight mesh
4. Convert to precomputed mesh format

**Libraries that can do this:**
- **`navis`** — `navis.conversion.tree2meshneuron()` converts SWC skeletons to meshes using CGAL or convex hulls
- **`trimesh`** — Can create and merge tube/cylinder primitives
- **Custom implementation** — Generate tube segments directly as triangle meshes

**Script:** `convert_swc_to_mesh.py`

```bash
python convert_swc_to_mesh.py \
  --input-swc volume.swc \
  --output-dir output/meshes/ \
  --vfb-id VFB_jrchjx4q \
  --tube-sides 8 \
  --verbose
```

---

### Category D: Everything Else — Generate Mesh from NRRD Volume

**What they are:** Images that don't have usable meshes and aren't skeletons — primarily:
- Expression patterns (confocal images)
- Individual painted domain NRRDs
- Any neuron that only has volumetric data

**Conversion approach:**
1. Download the NRRD volume
2. Threshold/binarize if needed (for confocal data)
3. Convert NRRD → precomputed segmentation format
4. Run marching cubes to generate a mesh from the volume
5. Optionally remove dust (small disconnected components)

This is essentially the approach from [MetaCell/virtual-fly-brain PR #207](https://github.com/MetaCell/virtual-fly-brain/pull/207).

**Script:** `convert_nrrd.py`

```bash
python convert_nrrd.py \
  --input-nrrd volume.nrrd \
  --output-dir output/volumes/ \
  --dust-threshold 100 \
  --verbose
```

---

## Decision Flow

```
For each VFB image:
  │
  ├─ Is it a Template with painted domains?
  │   └─ YES → Category A: convert_templates.py
  │       (NRRD label field → precomputed segmentation + meshes per region)
  │
  ├─ Does it have a volume_man.obj with faces?
  │   └─ YES → Category B: convert_obj_meshes.py
  │       (OBJ → precomputed mesh directly)
  │
  ├─ Does it have a volume.swc AND no full mesh?
  │   └─ YES → Category C: convert_swc_to_mesh.py
  │       (SWC skeleton → inflated tube mesh → precomputed mesh)
  │
  └─ Otherwise (only has NRRD volume)
      └─ Category D: convert_nrrd.py
          (NRRD → marching cubes → precomputed mesh)
```

## Output: Neuroglancer Precomputed Format

`vfb_pipeline.py` writes `precomputed.zip` (see above) whose entries are:

```
info                  # JSON metadata (type image|segmentation, uint8, one scale, resolution in nm)
provenance.json       # pipeline version, category, mesh source, source-file stamps
0/                    # scale-0 chunks, 64^3, raw (absent for a mesh-only object with no NRRD)
mesh/info             # {"@type": "neuroglancer_legacy_mesh"}      (segmentation only)
mesh/1:0              # fragment manifest for segment 1
mesh/1:0:1            # the mesh
```

No `segment_properties/`: a VFB image is one object, so there is nothing to label.

## Requirements

```bash
pip install -r requirements.txt
```

## Templates Available

| Template | VFB ID | Voxel Size | Dimensions |
|----------|--------|------------|------------|
| JRC2018Unisex | VFB_00101567 | 0.519 × 0.519 × 1.0 µm | 1211 × 567 × 175 |
| JFRC2 | VFB_00017894 | 0.622 µm isotropic | 1024 × 512 × 218 |
| JRC FlyEM Hemibrain | VFB_00101384 | varies | varies |
| Court2018 VNS | VFB_00100000 | 0.461 × 0.461 × 0.7 µm | varies |
| L3 CNS Wood2018 | VFB_00049000 | 0.29 × 0.29 × 0.5 µm | varies |
| Ito2014 | VFB_00030786 | varies | varies |
