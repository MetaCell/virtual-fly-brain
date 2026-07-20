"""
mesh_compression — mesh-size-reduction techniques for Neuroglancer precomputed output.
See README.md next to this file for what each function does and when to use it.
"""
from .cleanup import (
    MAX_LOD_DEFAULT,
    MAX_SIMPLIFICATION_ERROR_DEFAULT,
    MIN_COMPONENT_VOXELS_DEFAULT,
    decimate_mesh,
    generate_draco_mesh,
    intensity_band_mask,
    otsu_mask,
    percentile_intensity,
)

__all__ = [
    "otsu_mask",
    "intensity_band_mask",
    "percentile_intensity",
    "decimate_mesh",
    "generate_draco_mesh",
    "MIN_COMPONENT_VOXELS_DEFAULT",
    "MAX_LOD_DEFAULT",
    "MAX_SIMPLIFICATION_ERROR_DEFAULT",
]
