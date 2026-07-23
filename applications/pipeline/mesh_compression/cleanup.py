"""
cleanup.py — the four mesh-size-reduction techniques themselves. See
mesh_compression/README.md for what each does and when to use it.
"""
from __future__ import annotations

import numpy as np
from scipy import ndimage

try:
    from skimage.filters import threshold_otsu
except ImportError:
    threshold_otsu = None

MIN_COMPONENT_VOXELS_DEFAULT = 50
MAX_LOD_DEFAULT = 2
MAX_SIMPLIFICATION_ERROR_DEFAULT = 10  # Draco's own library default, not tuned further


def otsu_mask(arr: np.ndarray, min_component_voxels: int = MIN_COMPONENT_VOXELS_DEFAULT) -> np.ndarray:
    """Otsu threshold (computed from this volume's own nonzero-voxel histogram, not a
    fixed guess) + connected-component filter that drops blobs smaller than
    min_component_voxels regardless of brightness.

    Not recommended for dense volumes (e.g. whole-brain templates, mostly nonzero) --
    with little true background to remove, masking can increase output size instead of
    reducing it. Best suited to sparse volumes.
    """
    if threshold_otsu is None:
        raise RuntimeError("scikit-image required for otsu_mask(): pip install scikit-image")
    nonzero = arr[arr > 0]
    if nonzero.size == 0:
        return arr > 0
    mask = arr > threshold_otsu(nonzero)
    opened = ndimage.binary_opening(mask, structure=np.ones((3, 3, 3)))
    labeled, num_features = ndimage.label(opened)
    if num_features == 0:
        return opened
    sizes = ndimage.sum(opened, labeled, index=np.arange(1, num_features + 1))
    keep = np.zeros(num_features + 1, dtype=bool)
    keep[1:] = sizes >= min_component_voxels
    return keep[labeled]


def percentile_intensity(arr: np.ndarray, percentile: float) -> int:
    """Intensity floor derived from this volume's own nonzero-voxel histogram at the given
    percentile -- adapts to each sample's brightness scale, unlike a fixed band. Pass the
    result as min_intensity to intensity_band_mask()."""
    nonzero = arr[arr > 0]
    if nonzero.size == 0:
        return 0
    return int(np.percentile(nonzero, percentile))


def intensity_band_mask(arr: np.ndarray, min_intensity: int | None = None,
                         max_intensity: int | None = None) -> np.ndarray:
    """Explicit min/max intensity band mask: mask = (arr >= min) & (arr <= max). Either
    side may be None (open-ended). Use a fixed min_intensity/max_intensity for a manual
    band, or percentile_intensity() to derive min_intensity per-sample instead."""
    lo = min_intensity if min_intensity is not None else 0
    hi = max_intensity if max_intensity is not None else int(arr.max())
    return (arr >= lo) & (arr <= hi)


def decimate_mesh(vertices: np.ndarray, faces: np.ndarray, target_reduction: float):
    """Quadric edge-collapse simplification (pyfqmr), applied to an existing mesh's
    vertices/faces. target_reduction is the fraction of triangles to remove (0.7 = keep
    ~30%). Safe to use on any volume, sparse or dense."""
    import pyfqmr
    simplifier = pyfqmr.Simplify()
    simplifier.setMesh(vertices, faces)
    target_count = max(4, int(len(faces) * (1 - target_reduction)))
    simplifier.simplify_mesh(target_count=target_count, aggressiveness=7, preserve_border=True)
    new_vertices, new_faces, _ = simplifier.getMesh()
    return new_vertices.astype(np.float32), new_faces.astype(np.uint32)


def generate_draco_mesh(precomputed_segmentation_path: str, mesh_directory: str = "mesh_multires",
                         max_lod: int = MAX_LOD_DEFAULT,
                         max_simplification_error: int = MAX_SIMPLIFICATION_ERROR_DEFAULT,
                         mesh_shape=None) -> None:
    """Generates a multi-resolution Draco-compressed mesh (zmesher meshing + Draco
    compression + multiple levels of detail) for an existing precomputed segmentation
    volume. Implemented via mesh_compression._draco_vendored -- two small utility
    functions included directly (MIT-licensed, see that file's header for attribution),
    so no external repository needs to be cloned separately. igneous/zmesh/DracoPy must
    still be installed in the active environment -- see README.md.

    precomputed_segmentation_path: an existing precomputed segmentation volume on disk
        (must already be written -- this function only generates the mesh for it).
    max_simplification_error: zmesher's geometric error tolerance -- lower values
        preserve more detail, higher values produce smaller output.

    For best results, apply a mask (e.g. otsu_mask()) to the volume before writing the
    segmentation this function reads from, rather than using it unmasked.

    Does not write segment properties metadata -- that should be handled by the calling
    pipeline.
    """
    from . import _draco_vendored
    _draco_vendored.generate_multiresolution_mesh_from_segmentation(
        precomputed_segmentation_path=precomputed_segmentation_path,
        mesh_directory=mesh_directory,
        max_lod=max_lod,
        mesh_shape=mesh_shape,
        max_simplification_error=max_simplification_error,
    )
