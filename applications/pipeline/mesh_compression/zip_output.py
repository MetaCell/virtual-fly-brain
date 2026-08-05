"""Zip a Neuroglancer precomputed output folder into a single artifact.

Replaces per-chunk gzip/brotli compression (which required a Content-Encoding
hack to serve correctly from a plain file server/bucket -- see server/view.py's
former CORSRequestHandler._resolve/_content_encoding). Instead, the whole
neuroglancer/ folder is zipped as one real ZIP archive -- per-entry DEFLATE
compression plus a central directory -- so Neuroglancer's client-side zip
kvstore adapter can byte-range its way to individual entries and decompress
them in the browser, with the file server doing nothing but serving Range
requests against one file (already supported everywhere we've checked).

A monolithic gzip/tar.gz stream would NOT work here: it has no per-entry
central directory, so decompressing entry N requires reading the whole stream
from byte 0. ZIP's independent per-entry compressed extents are what make
range-based access to a single file inside the archive possible.

IMPORTANT -- sharded mesh formats (multires_draco's *.shard files, and
uint64_sharded volumes) need real per-entry byte-range reads: Neuroglancer
fetches a specific fragment from an arbitrary, non-zero-start offset inside
one shard file rather than downloading the whole thing. Per Neuroglancer's own
zip-kvstore docs (src/kvstore/zip/index.rst), general byte ranges are ONLY
supported for STORED (uncompressed) entries -- DEFLATED entries only support
prefix (byte-offset-0) reads. Our small local test shards (shard_bits=0, one
shard) never exercise a genuine non-prefix read, so this would be invisible in
local testing but could silently break on real, larger production shard
files. Shard files are therefore always stored uncompressed (ZIP_STORED)
regardless of the `compression` argument, which only applies to everything
else (plain chunk/mesh-fragment files, where Neuroglancer always wants the
whole entry anyway, so prefix-only access is fine).
"""
from __future__ import annotations

import os
import zipfile

# Sharded-format data files needing true random (non-prefix) byte-range reads
# within a single entry -- see the module docstring. Matched by suffix so this
# also covers any *.shard-named file regardless of shard index.
_UNCOMPRESSED_SUFFIXES = (".shard",)


def zip_neuroglancer_dir(neuroglancer_dir: str, zip_path: str | None = None,
                          verbose: bool = False,
                          compression: int = zipfile.ZIP_DEFLATED) -> str:
    """Zip the entire contents of `neuroglancer_dir` (info, 0/, mesh/ or
    mesh_multires/) into a single ZIP archive at `zip_path` (default:
    `neuroglancer_dir + ".zip"`, a sibling of the folder, not nested inside it).

    Archive member names are paths relative to `neuroglancer_dir` itself
    (e.g. "info", "0/0-64_0-64_0-64", "mesh/info", "mesh/1:0") -- not prefixed
    with the folder's own name -- so the zip's internal layout matches what
    Neuroglancer expects at the root once pointed at it via the zip kvstore
    adapter.

    `compression` defaults to ZIP_DEFLATED -- confirmed the ONLY compression
    method Neuroglancer's zip-kvstore reader supports (it wraps the browser's
    native DecompressionStream API, which only implements gzip/deflate/
    deflate-raw). ZIP_LZMA is exposed here only because it was tried and
    rejected outright by Neuroglancer ("Unsupported compression method: 14") --
    do not use it as the pipeline default, it will not work. `*.shard` files
    are always written ZIP_STORED regardless of this argument -- see module
    docstring for why.
    """
    neuroglancer_dir = os.path.abspath(neuroglancer_dir)
    if zip_path is None:
        zip_path = neuroglancer_dir + ".zip"

    if verbose:
        print(f"  Zipping {neuroglancer_dir} -> {zip_path}")

    with zipfile.ZipFile(zip_path, "w", compression=compression) as zf:
        for root, dirs, files in os.walk(neuroglancer_dir):
            dirs.sort()
            for fn in sorted(files):
                file_path = os.path.join(root, fn)
                arcname = os.path.relpath(file_path, neuroglancer_dir)
                if fn.endswith(_UNCOMPRESSED_SUFFIXES):
                    zf.write(file_path, arcname, compress_type=zipfile.ZIP_STORED)
                else:
                    zf.write(file_path, arcname)

    if verbose:
        print(f"  Wrote {zip_path}")

    return zip_path
