#!/usr/bin/env python3
"""
Minimal converter: NRRD -> Neuroglancer precomputed (volumetric only). 
Fixed to use correct scale keys with optional compression.
"""
from __future__ import annotations
import argparse
import os
import tempfile
import requests
import nrrd
import numpy as np
import json
import hashlib
from cloudvolume import CloudVolume
from urllib.parse import urlparse
from pathlib import Path

def download_to_temp(url: str) -> str:
    if url.startswith('file://'):
        return url. replace('file://', '')
    if os.path.exists(url):
        return url
    r = requests.get(url, stream=True)
    r.raise_for_status()
    fd, tmp = tempfile.mkstemp(suffix='.nrrd')
    os.close(fd)
    with open(tmp, 'wb') as f:
        for chunk in r.iter_content(1024*1024):
            f.write(chunk)
    return tmp

def sanitize_name(name: str) -> str:
    for c in [' ', '/', '\\', ':', '?', '&', '=', '%']:
        name = name.replace(c, '_')
    return name

def dataset_name_from_source(src: str, local_path: str) -> str:
    try:
        if src.startswith(('http://','https://','s3://','gs://')):
            parsed = urlparse(src)
            parts = [p for p in parsed.path.rstrip('/'). split('/') if p]
            if len(parts) >= 3:
                return sanitize_name(f"{parts[-2]}_{parts[-3]}")
            if len(parts) >= 2:
                return sanitize_name(parts[-2])
        parent = os.path.basename(os. path.dirname(local_path))
        grand = os.path. basename(os.path.dirname(os. path.dirname(local_path)))
        if parent and grand:
            return sanitize_name(f"{parent}_{grand}")
        if parent:
            return sanitize_name(parent)
    except Exception:
        pass
    fname = os.path.splitext(os.path.basename(local_path))[0]
    short = hashlib.md5(src.encode('utf-8')). hexdigest()[:6]
    return sanitize_name(f"{fname}_{short}")

def detect_spacing(header: dict):
    if 'space directions' in header and header['space directions'] is not None:
        try:
            dirs = header['space directions']
            spacings = [float(np.linalg.norm(d)) if d is not None else 1.0 for d in dirs]
            return spacings[::-1]
        except Exception:
            pass
    if 'spacings' in header:
        try:
            sp = header['spacings']
            return list(map(float, sp))[::-1]
        except Exception:
            pass
    return [1.0, 1.0, 1.0]

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--input-url", action='append', required=True, help="NRRD URL or local path (repeatable)")
    p.add_argument("--output-path", default=None, help="precomputed root: file:///full/path or gs:// / s3:// ; default file://~/precomputed")
    p.add_argument("--verbose", action='store_true')
    p. add_argument("--no-compress", action='store_true', help="Disable gzip compression (store raw uncompressed chunks)")
    args = p.parse_args()

    compress = not args.no_compress

    if args.output_path is None:
        home = str(Path.home())
        args. output_path = f"file://{home}/precomputed"

    if args.output_path. startswith('file://'):
        pth = args.output_path.replace('file://','')
        pth = os.path. expanduser(pth)
        args.output_path = 'file://' + pth

    out_root_local = None
    if args.output_path. startswith('file://'):
        out_root_local = args. output_path. replace('file://','')

    os.makedirs(out_root_local, exist_ok=True) if out_root_local else None

    mapping = {}

    for src in args.input_url:
        if args.verbose:
            print("Processing:", src)
        local_path = download_to_temp(src)
        data, header = nrrd. read(local_path)
        if data. ndim != 3:
            raise RuntimeError(f"Only 3D volumes supported (got ndim={data.ndim}) for {src}")
        
        # Transpose from ZYX (NRRD) to XYZ (Neuroglancer)
        arr_xyz = np.transpose(data, (2,1,0)). copy()
        dtype_str = str(np.dtype(arr_xyz.dtype).name)
        voxel_size = detect_spacing(header)
        ds_name = dataset_name_from_source(src, local_path)
        dest = args.output_path.rstrip('/') + '/' + ds_name
        
        if args.verbose:
            print("Writing dataset:", dest, "shape(XYZ):", arr_xyz.shape, "dtype:", dtype_str, "voxel_size:", voxel_size)
        
        # Determine layer type
        is_segmentation = np.issubdtype(arr_xyz.dtype, np. integer)
        layer_type = 'image'
        
        # For uint8/uint16, use raw encoding
        encoding = 'raw'
        compressed_segmentation_block_size = None
        
        # Create info with explicit scale key = "0"
        info = {
            "data_type": dtype_str,
            "num_channels": 1,
            "scales": [{
                "chunk_sizes": [[64, 64, 64]],
                "encoding": encoding,
                "key": "0",  # Important: must be "0" not the resolution
                "resolution": voxel_size,
                "size": list(arr_xyz.shape),
                "voxel_offset": [0, 0, 0]
            }],
            "type": layer_type
        }
        
        if compressed_segmentation_block_size:
            info["compressed_segmentation_block_size"] = compressed_segmentation_block_size
        
        # Create CloudVolume with the info
        vol = CloudVolume(dest, mip=0, info=info, compress=compress)
        vol.commit_info()
        
        # Write the data
        vol[:, :, :] = arr_xyz
        
        if args.verbose:
            print(f"Successfully wrote {ds_name}")
            print(f"  Encoding: {encoding}")
            print(f"  Compression: {'gzip (. gz files)' if compress else 'none (raw files)'}")
            print(f"  Scale key: 0")
        
        mapping[src] = ds_name
        
        # Clean up temp file
        if src.startswith('http'):
            try:
                os.remove(local_path)
            except Exception:
                pass

    if out_root_local:
        mapping_path = os.path.join(out_root_local, 'sources_to_dataset.json')
        with open(mapping_path, 'w') as f:
            json.dump(mapping, f, indent=2)
        if args.verbose:
            print("Wrote mapping:", mapping_path)

    print("Done.  Datasets written to:", args.output_path)
    print("Mapping (source -> dataset):")
    for k,v in mapping. items():
        print("  ", k, "->", v)

if __name__ == "__main__":
    main()