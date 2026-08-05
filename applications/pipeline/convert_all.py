#!/usr/bin/env python3
"""
Main batch conversion script for VFB image files.

Given a list of VFB IDs (or a template ID to process all aligned images),
this script determines the appropriate conversion strategy for each image
and dispatches to the correct converter:

  A. Templates with painted domains → convert_templates
  B. Neurons with full OBJ meshes  → convert_obj_meshes
  C. SWC skeletons without meshes  → convert_swc_to_mesh
  D. NRRD volumes (fallback)       → convert_nrrd

Usage:
  # Convert a specific template with all its painted domains
  python convert_all.py --template VFB_00101567 --output-dir output/ --verbose

  # Convert a list of VFB IDs
  python convert_all.py --ids VFB_jrchjx4q VFB_fw121683 --output-dir output/ --verbose

  # Convert from a file listing VFB IDs (one per line)
  python convert_all.py --ids-file vfb_ids.txt --output-dir output/ --verbose
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import tempfile

import requests


def vfb_image_url(vfb_id: str, template_id: str, filename: str) -> str:
    prefix = vfb_id.replace("VFB_", "")
    first4, last4 = prefix[:4], prefix[4:]
    return f"https://www.virtualflybrain.org/data/VFB/i/{first4}/{last4}/{template_id}/{filename}"


def check_url_exists(url: str, timeout: int = 10) -> bool:
    """Check if a URL returns a successful status (HEAD request)."""
    try:
        resp = requests.head(url, timeout=timeout, allow_redirects=True)
        return resp.status_code == 200
    except requests.RequestException:
        return False


def check_obj_has_faces(url: str, timeout: int = 30) -> bool:
    """Download enough of an OBJ to determine if it has face definitions."""
    try:
        resp = requests.get(url, stream=True, timeout=timeout)
        resp.raise_for_status()
        # Read first 64KB — enough to tell if there are faces
        content = b""
        for chunk in resp.iter_content(1024):
            content += chunk
            if len(content) > 65536:
                break
        text = content.decode("utf-8", errors="ignore")
        for line in text.split("\n"):
            if line.startswith("f "):
                return True
        return False
    except requests.RequestException:
        return False


def classify_image(vfb_id: str, template_id: str, image_info: dict | None = None,
                   verbose: bool = False) -> str:
    """Determine the conversion category for a VFB image.

    Returns one of: "template", "obj_mesh", "swc_to_mesh", "nrrd"
    """
    # Check for SWC
    swc_url = vfb_image_url(vfb_id, template_id, "volume.swc")
    has_swc = check_url_exists(swc_url)

    # Check for volume_man.obj (manual/proper mesh)
    obj_man_url = vfb_image_url(vfb_id, template_id, "volume_man.obj")
    has_man_obj = check_url_exists(obj_man_url)

    obj_has_real_faces = False
    if has_man_obj:
        obj_has_real_faces = check_obj_has_faces(obj_man_url)

    if verbose:
        print(f"  [{vfb_id}] SWC={has_swc}, OBJ_man={has_man_obj}, OBJ_faces={obj_has_real_faces}")

    # If we have a proper mesh (with faces), use OBJ conversion (fastest)
    if has_man_obj and obj_has_real_faces:
        return "obj_mesh"

    # If we have SWC but no proper mesh, generate mesh from skeleton
    if has_swc:
        return "swc_to_mesh"

    # Fallback: generate mesh from NRRD volume
    return "nrrd"


def process_image(vfb_id: str, template_id: str, category: str,
                  output_dir: str, resolution: list[float],
                  verbose: bool = True):
    """Process a single VFB image using the appropriate converter."""

    if category == "obj_mesh":
        from convert_obj_meshes import convert_obj_to_precomputed, download_file
        url = vfb_image_url(vfb_id, template_id, "volume_man.obj")
        with tempfile.NamedTemporaryFile(suffix=".obj", delete=False) as tmp:
            tmp_path = tmp.name
        try:
            download_file(url, tmp_path)
            convert_obj_to_precomputed(
                tmp_path, output_dir, vfb_id,
                resolution=resolution, verbose=verbose,
            )
        finally:
            os.unlink(tmp_path)

    elif category == "swc_to_mesh":
        from convert_swc_to_mesh import (
            download_file,
            swc_to_obj,
        )
        from convert_obj_meshes import convert_obj_to_precomputed

        # Step 1: Download SWC and generate OBJ (durable artifact)
        url = vfb_image_url(vfb_id, template_id, "volume.swc")
        with tempfile.NamedTemporaryFile(suffix=".swc", delete=False) as tmp:
            tmp_path = tmp.name
        obj_path = os.path.join(output_dir, vfb_id + "_volume_man.obj")
        try:
            download_file(url, tmp_path)
            swc_to_obj(tmp_path, obj_path, verbose=verbose)
        finally:
            os.unlink(tmp_path)

        # Step 2: Convert the OBJ to precomputed
        convert_obj_to_precomputed(
            obj_path, output_dir, vfb_id,
            resolution=resolution, verbose=verbose,
        )

    elif category == "nrrd":
        from convert_nrrd import convert_nrrd, download_file
        url = vfb_image_url(vfb_id, template_id, "volume.nrrd")
        with tempfile.NamedTemporaryFile(suffix=".nrrd", delete=False) as tmp:
            tmp_path = tmp.name
        try:
            download_file(url, tmp_path)
            convert_nrrd(
                tmp_path, output_dir, vfb_id,
                merge_segments=True, verbose=verbose,
            )
        finally:
            os.unlink(tmp_path)

    else:
        raise ValueError(f"Unknown category: {category}")


def main():
    parser = argparse.ArgumentParser(
        description="Batch convert VFB image files to Neuroglancer precomputed format"
    )

    input_group = parser.add_mutually_exclusive_group(required=True)
    input_group.add_argument("--ids", nargs="+",
                             help="VFB image IDs to convert")
    input_group.add_argument("--ids-file",
                             help="File containing VFB IDs (one per line)")
    input_group.add_argument("--template",
                             help="Template ID — converts the template itself with painted domains")

    parser.add_argument("--template-id", default="VFB_00101567",
                        help="Template ID for aligned images (default: JRC2018Unisex)")
    parser.add_argument("--output-dir", required=True,
                        help="Output directory for precomputed datasets")
    parser.add_argument("--resolution", type=float, nargs=3,
                        default=[518.9161, 518.9161, 1000.0],
                        help="Voxel resolution in nm [x y z] (default: JRC2018U)")
    parser.add_argument("--verbose", action="store_true")
    parser.add_argument("--dry-run", action="store_true",
                        help="Classify images but don't convert")
    args = parser.parse_args()

    output_dir = os.path.abspath(os.path.expanduser(args.output_dir))
    os.makedirs(output_dir, exist_ok=True)

    # Handle template conversion
    if args.template:
        from convert_templates import convert_template
        if args.verbose:
            print(f"Converting template: {args.template}")
        convert_template(
            template_id=args.template,
            domains={},  # Will use numeric IDs; provide --domains-json to convert_templates.py for labels
            output_dir=output_dir,
            verbose=args.verbose,
        )
        print(f"Done. Template output at: {output_dir}/{args.template}")
        return

    # Collect VFB IDs
    if args.ids:
        vfb_ids = args.ids
    else:
        with open(args.ids_file) as f:
            vfb_ids = [line.strip() for line in f if line.strip() and not line.startswith("#")]

    if args.verbose:
        print(f"Processing {len(vfb_ids)} images against template {args.template_id}")

    # Classify and process
    results = {"obj_mesh": 0, "swc_to_mesh": 0, "nrrd": 0, "failed": 0}

    for i, vfb_id in enumerate(vfb_ids, 1):
        print(f"\n[{i}/{len(vfb_ids)}] {vfb_id}")

        try:
            category = classify_image(vfb_id, args.template_id, verbose=args.verbose)
            print(f"  Category: {category}")

            if args.dry_run:
                results[category] = results.get(category, 0) + 1
                continue

            process_image(
                vfb_id, args.template_id, category,
                output_dir, args.resolution, verbose=args.verbose,
            )
            results[category] += 1

        except Exception as e:
            print(f"  ERROR: {e}")
            results["failed"] += 1
            if args.verbose:
                import traceback
                traceback.print_exc()

    # Summary
    print(f"\n{'=' * 60}")
    print(f"Conversion Summary:")
    print(f"{'=' * 60}")
    print(f"  OBJ mesh (direct):     {results['obj_mesh']}")
    print(f"  SWC → mesh:            {results['swc_to_mesh']}")
    print(f"  NRRD → mesh:           {results['nrrd']}")
    print(f"  Failed:                {results['failed']}")
    print(f"  Total:                 {sum(results.values())}")


if __name__ == "__main__":
    main()
