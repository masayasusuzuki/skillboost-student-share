#!/usr/bin/env python3
"""
スライド一覧画像（overview）を生成するスクリプト。
全スライドPNGをグリッド状に並べて1枚の16:9画像にまとめる。

Usage:
    python3 scripts/generate-overview.py output/{moduleName}
"""

import sys
import os
import math
from PIL import Image


def find_best_grid(n: int) -> tuple[int, int]:
    """16:9に近くなるグリッド（cols x rows）を選ぶ。スライドが16:9なので横長優先。"""
    best = (n, 1)
    best_ratio_diff = float("inf")
    target = 16 / 9

    for rows in range(1, n + 1):
        cols = math.ceil(n / rows)
        # Each cell is 16:9, so overall ratio = cols * 16 / (rows * 9)
        ratio = (cols * 16) / (rows * 9)
        diff = abs(ratio - target)
        if diff < best_ratio_diff:
            best_ratio_diff = diff
            best = (cols, rows)
    return best


def generate_overview(module_dir: str) -> str:
    # Collect slide PNGs
    pngs = sorted(
        f for f in os.listdir(module_dir)
        if f.startswith("slide_") and f.endswith(".png")
    )
    if not pngs:
        print("Error: No slide PNGs found in", module_dir)
        sys.exit(1)

    n = len(pngs)
    cols, rows = find_best_grid(n)
    total_slots = cols * rows

    print(f"Slides: {n}, Grid: {cols}x{rows} ({total_slots} slots)")

    # Load images
    images = [Image.open(os.path.join(module_dir, f)) for f in pngs]
    sw, sh = images[0].size

    # Build canvas (16:9)
    gap = 10
    grid_w = cols * sw + (cols - 1) * gap
    grid_h = rows * sh + (rows - 1) * gap

    target_ratio = 16 / 9
    current_ratio = grid_w / grid_h

    if current_ratio > target_ratio:
        final_w = grid_w
        final_h = int(grid_w / target_ratio)
    else:
        final_h = grid_h
        final_w = int(grid_h * target_ratio)

    canvas = Image.new("RGB", (final_w, final_h), (255, 255, 255))

    offset_x = (final_w - grid_w) // 2
    offset_y = (final_h - grid_h) // 2

    for i in range(total_slots):
        row = i // cols
        col = i % cols
        x = offset_x + col * (sw + gap)
        y = offset_y + row * (sh + gap)
        if i < n:
            canvas.paste(images[i], (x, y))

    # Derive module name from directory
    module_name = os.path.basename(module_dir.rstrip("/"))
    output_path = os.path.join(module_dir, f"{module_name}_overview.png")
    canvas.save(output_path, quality=95)
    print(f"Saved: {output_path}")
    return output_path


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/generate-overview.py output/{moduleName}")
        sys.exit(1)
    generate_overview(sys.argv[1])
