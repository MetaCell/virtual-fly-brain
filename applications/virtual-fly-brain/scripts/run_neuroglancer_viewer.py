#!/usr/bin/env python3
"""
Run a fully local Neuroglancer viewer instance (UI + client bundle served
locally, no dependency on neuroglancer-demo.appspot.com).

This script does NOT load or serve any volume/mesh data itself. Point the
viewer at data you serve separately (e.g. `python -m http.server` over a
precomputed directory) by adding a layer through the UI or CLI flag below.

Requires: pip install neuroglancer

Usage:
    python run_neuroglancer_viewer.py [--bind-address 127.0.0.1] [--port 9016]
    python run_neuroglancer_viewer.py --source precomputed://http://localhost:9015
"""
from __future__ import annotations

import argparse
import webbrowser

import neuroglancer


def main():
    parser = argparse.ArgumentParser(description="Run a local Neuroglancer viewer")
    parser.add_argument("--bind-address", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=9016)
    parser.add_argument(
        "--source",
        default=None,
        help="Optional data source URL to add as a layer, "
        "e.g. precomputed://http://localhost:9015",
    )
    parser.add_argument("--no-open", action="store_true", help="Don't auto-open browser")
    args = parser.parse_args()

    neuroglancer.set_server_bind_address(args.bind_address, bind_port=args.port)
    viewer = neuroglancer.Viewer()

    if args.source:
        with viewer.txn() as s:
            s.layers["volume"] = neuroglancer.ImageLayer(source=args.source)

    print(f"Neuroglancer viewer running at: {viewer}")
    print("Press Ctrl+C to stop.\n")

    if not args.no_open:
        webbrowser.open(str(viewer))

    try:
        while True:
            input()
    except (KeyboardInterrupt, EOFError):
        print("\nShutting down.")


if __name__ == "__main__":
    main()
