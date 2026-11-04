#!/usr/bin/env python3
"""Конвертация сгенерированных сцен /tmp/scenes/*.png в webp для галереи.

Единый рецепт с остальными ассетами: без апскейла (1344x768 как есть),
Lanczos не нужен, webp q=80 method=6. Результат — public/img/scenes/.
Запуск из корня репозитория: python3 scripts/optimize-scenes.py
"""
from pathlib import Path
from PIL import Image

SRC = Path("/tmp/scenes")
DST = Path("public/img/scenes")
NAMES = ["alley", "domes", "wasteland", "tunnel", "terminal"]

DST.mkdir(parents=True, exist_ok=True)
for name in NAMES:
    src = SRC / f"{name}.png"
    dst = DST / f"scene-{name}.webp"
    img = Image.open(src).convert("RGB")
    img.save(dst, "WEBP", quality=80, method=6)
    print(f"{dst}  {dst.stat().st_size // 1024} КБ  {img.size[0]}x{img.size[1]}")
