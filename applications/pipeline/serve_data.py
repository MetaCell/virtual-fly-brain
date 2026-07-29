#!/usr/bin/env python3
"""
Serve applications/pipeline/data over HTTP with CORS and Range support, so
Neuroglancer (running elsewhere) can fetch it as a data source.

Usage:
    python serve_data.py [--data-dir data] [--port 8000]
"""
from __future__ import annotations

import argparse
import http.server
import os
import re
from functools import partial


class _LimitedReader:
    """Wraps a file object so shutil.copyfileobj stops after `length` bytes."""

    def __init__(self, f, length):
        self.f = f
        self.remaining = length

    def read(self, size=-1):
        if self.remaining <= 0:
            return b""
        if size < 0 or size > self.remaining:
            size = self.remaining
        data = self.f.read(size)
        self.remaining -= len(data)
        return data

    def close(self):
        self.f.close()


class RangeCORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Adds CORS headers and byte-Range support (needed for sharded/zip chunks)."""

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Range")
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def log_message(self, format, *args):
        pass

    def send_head(self):
        range_header = self.headers.get("Range")
        path = self.translate_path(self.path)
        if not range_header or os.path.isdir(path) or not os.path.isfile(path):
            return super().send_head()

        try:
            f = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        file_len = os.fstat(f.fileno()).st_size
        match = re.match(r"bytes=(\d*)-(\d*)", range_header)
        if not match or (match.group(1) == "" and match.group(2) == ""):
            f.close()
            self.send_error(416, "Invalid range")
            return None

        start_s, end_s = match.groups()
        if start_s == "":
            length = min(int(end_s), file_len)
            start, end = file_len - length, file_len - 1
        else:
            start = int(start_s)
            end = min(int(end_s), file_len - 1) if end_s else file_len - 1

        if start > end or start >= file_len:
            f.close()
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{file_len}")
            self.end_headers()
            return None

        length = end - start + 1
        f.seek(start)

        self.send_response(206)
        self.send_header("Content-type", self.guess_type(path))
        self.send_header("Content-Range", f"bytes {start}-{end}/{file_len}")
        self.send_header("Content-Length", str(length))
        self.end_headers()
        return _LimitedReader(f, length)


def main():
    parser = argparse.ArgumentParser(description="Serve pipeline/data for Neuroglancer")
    parser.add_argument(
        "--data-dir",
        default=os.path.join(os.path.dirname(__file__), "data"),
        help="Directory to serve (default: applications/pipeline/data)",
    )
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()

    data_dir = os.path.abspath(args.data_dir)
    if not os.path.isdir(data_dir):
        raise SystemExit(f"No such directory: {data_dir}")

    handler = partial(RangeCORSRequestHandler, directory=data_dir)
    server = http.server.ThreadingHTTPServer(("0.0.0.0", args.port), handler)

    print(f"Serving {data_dir}")
    print(f"http://localhost:{args.port}")
    print("Press Ctrl+C to stop.\n")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down.")
        server.shutdown()


if __name__ == "__main__":
    main()
