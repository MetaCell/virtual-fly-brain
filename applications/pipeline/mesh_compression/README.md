# Mesh Compression Toolkit

A lightweight Python toolkit for reducing the size of precomputed mesh and volume
output used by Neuroglancer. It provides four independent techniques that can be
combined to significantly reduce storage and transfer size without a full rewrite of
your conversion pipeline.

Fully self-contained — no external repositories to clone. All dependencies are
standard, publicly available Python packages.

## Overview

| Technique | Purpose | Recommended for |
|---|---|---|
| Otsu masking | Automatically separates signal from background noise before meshing | Sparse volumes (e.g. individual expression patterns, traced structures) |
| Intensity-band masking | Restricts meshing to an explicit intensity range, either a fixed band or a per-sample percentile | Sparse volumes where a manual or per-sample threshold is preferred over automatic detection |
| Mesh decimation | Simplifies mesh geometry after generation (quadric edge-collapse) | Any volume, sparse or dense — safe to apply broadly |
| Multi-resolution Draco mesh | Alternative mesh format with built-in compression and multiple levels of detail | Any volume where a smaller, level-of-detail-aware mesh is preferred over decimation |

**Note on dense volumes** (e.g. whole-brain templates, where most voxels are non-zero
signal): masking techniques (Otsu, intensity-band) are not recommended for this kind of
data — because there is little true background to remove, applying a mask can increase
output size rather than reduce it. Mesh decimation and the Draco format do not have
this limitation and are safe to use on any volume.

## Requirements

- Python 3.10+
- `numpy`, `scipy`
- `scikit-image` — required for Otsu masking
- `pyfqmr` — required for mesh decimation
- `igneous`, `zmesh`, `DracoPy` — required only for the multi-resolution Draco mesh format

Install what you need with:
```bash
pip install numpy scipy scikit-image pyfqmr
pip install igneous-pipeline zmesh DracoPy   # only if using the Draco mesh format
```

## Quick Start

```python
import mesh_compression as mc

# Sparse volume: mask out background noise, then simplify the resulting mesh
mask = mc.otsu_mask(volume_array)
vertices, faces = marching_cubes(mask)          # your own mesh-generation call
vertices, faces = mc.decimate_mesh(vertices, faces, target_reduction=0.7)

# Dense volume (e.g. a whole-brain template): skip masking, simplify only
vertices, faces = marching_cubes(volume_array > 0)
vertices, faces = mc.decimate_mesh(vertices, faces, target_reduction=0.7)

# Explicit intensity band instead of automatic (Otsu) masking
floor = mc.percentile_intensity(volume_array, percentile=60)
mask = mc.intensity_band_mask(volume_array, min_intensity=floor)

# Multi-resolution Draco mesh instead of decimation
# (the segmentation volume must already be written to disk in precomputed format)
mc.generate_draco_mesh("path/to/precomputed_result", max_simplification_error=5)
```

## API Reference

### `otsu_mask(arr, min_component_voxels=50)`
Builds a binary mask using an automatically computed intensity threshold (Otsu's
method) plus a connected-component filter that discards small, isolated blobs
regardless of brightness. Recommended for sparse volumes only.

### `intensity_band_mask(arr, min_intensity=None, max_intensity=None)`
Builds a binary mask from an explicit intensity range. Either bound may be omitted
(open-ended). Use on its own with fixed values, or combine with `percentile_intensity()`
for a per-sample threshold.

### `percentile_intensity(arr, percentile)`
Returns an intensity value at the given percentile of the volume's non-zero voxels —
useful for deriving a per-sample threshold that adapts to each volume's own brightness
range, rather than using one fixed value across all samples.

### `decimate_mesh(vertices, faces, target_reduction)`
Simplifies an existing mesh using quadric edge-collapse (via `pyfqmr`).
`target_reduction` is the fraction of triangles to remove — for example, `0.7` removes
approximately 70% of triangles, keeping about 30%. Safe to use on any volume.

### `generate_draco_mesh(precomputed_segmentation_path, mesh_directory="mesh_multires", max_lod=2, max_simplification_error=10, mesh_shape=None)`
Generates a multi-resolution Draco-compressed mesh for an existing precomputed
segmentation volume. `max_simplification_error` controls the simplification level —
lower values preserve more detail, higher values produce smaller output. For best
results, apply a mask (e.g. `otsu_mask()`) to the volume before generating the
segmentation this function reads from, rather than using the volume unmasked.

This function does not write segment properties metadata — that should be handled by
the calling pipeline.

## Choosing Between Decimation and Draco

Both mesh decimation and the multi-resolution Draco format reduce mesh size and are
safe to use on any volume. Decimation has no additional dependencies and produces a
single, fixed level of detail. The Draco format requires additional packages
(`igneous`, `zmesh`, `DracoPy`) but produces a mesh with multiple levels of detail,
which can improve viewing performance at different zoom levels. Choose based on your
project's dependency constraints and whether level-of-detail rendering is valuable for
your use case.

## Usage Notes

This toolkit does not automatically determine whether a given volume is sparse or
dense — that determination, and the choice of which technique to apply, is the
responsibility of the calling application.

## License and Attribution

This toolkit is self-contained. The multi-resolution Draco mesh functionality
(`generate_draco_mesh`) internally uses two small utility functions originally from the
[cryoet-data-portal-neuroglancer](https://github.com/chanzuckerberg/cryoet-data-portal-neuroglancer)
project (Chan Zuckerberg Initiative), included under the MIT License. Full attribution
and license text are included in `_draco_vendored.py`. No external repository needs to
be installed or cloned separately to use this functionality.
