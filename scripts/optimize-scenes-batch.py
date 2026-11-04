#!/usr/bin/env python3
"""Конвертация батча сцен /tmp/scenes2/<name>.png в webp для галереи и баннеров.

Тот же рецепт, что optimize-scenes.py: без апскейла (1344x768 как есть),
webp q=80 method=6. Результат — public/img/scenes/scene-<name>.webp.

Запуск из корня репозитория:
  python3 scripts/optimize-scenes-batch.py dossier council grid
"""
import sys
from pathlib import Path

from PIL import Image

SRC = Path("/tmp/scenes2")
DST = Path("public/img/scenes")

if len(sys.argv) < 2:
    sys.exit("Использование: optimize-scenes-batch.py <name> [<name>...]")

DST.mkdir(parents=True, exist_ok=True)
failed = 0
for name in sys.argv[1:]:
    src = SRC / f"{name}.png"
    dst = DST / f"scene-{name}.webp"
    if not src.is_file():
        print(f"НЕТ ФАЙЛА: {src}")
        failed += 1
        continue
    img = Image.open(src).convert("RGB")
    img.save(dst, "WEBP", quality=80, method=6)
    print(f"{dst}  {dst.stat().st_size // 1024} КБ  {img.size[0]}x{img.size[1]}")

if failed:
    sys.exit(f"Пропущено файлов: {failed}")
