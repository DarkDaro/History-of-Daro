#!/usr/bin/env python3
# ============================================================
# ИСТОРИЯ ДАРО — стена «Артефакты» (BACKLOG п.16/п.24):
# обои из готовых картинок /gallery. Без обращения к внешним
# API: только локальная обработка существующих файлов public/.
#   сцены 1344x768  -> рабочий стол 1920x1080 (кроп 16:9)
#   портреты 864x1152, обложки 768x1344 -> телефон 1080x1920
#     (кроп 9:16 по центру, полная высота сохраняется)
# Апскейл Lanczos + лёгкая доводка резкости; webp q=85.
# Запуск: python3 scripts/make-wallpapers.py  (из корня репо)
# ============================================================

from pathlib import Path
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
OUT = PUBLIC / "wallpapers"

# (исходник, базовое имя, вариант)
JOBS = [
    # — рабочий стол: сцены —
    ("covers/hero-city.png",      "wp-desktop-city",     "desktop"),
    ("img/scenes/world.webp",     "wp-desktop-world",    "desktop"),
    ("img/scenes/implants.webp",  "wp-desktop-implants", "desktop"),
    ("img/scenes/armory.webp",    "wp-desktop-armory",   "desktop"),
    ("img/scenes/story.webp",     "wp-desktop-story",    "desktop"),
    ("img/scenes/pobeg.webp",     "wp-desktop-pobeg",    "desktop"),
    # — рабочий стол: сцены, батч 4 —
    ("img/scenes/scene-kotel.webp",        "wp-desktop-kotel",        "desktop"),
    ("img/scenes/scene-cleaners.webp",     "wp-desktop-cleaners",     "desktop"),
    ("img/scenes/scene-hunter.webp",       "wp-desktop-hunter",       "desktop"),
    ("img/scenes/scene-perimeter.webp",    "wp-desktop-perimeter",    "desktop"),
    ("img/scenes/scene-technodominus.webp","wp-desktop-technodominus","desktop"),
    ("img/scenes/scene-dominator.webp",    "wp-desktop-dominator",    "desktop"),
    ("img/scenes/scene-lab.webp",          "wp-desktop-lab",          "desktop"),
    ("img/scenes/scene-conveyor.webp",     "wp-desktop-conveyor",     "desktop"),
    ("img/scenes/scene-skybridge.webp",    "wp-desktop-skybridge",    "desktop"),
    # — телефон: портреты —
    ("img/chars/daro.webp",       "wp-phone-daro",       "phone"),
    ("img/chars/ohotnik.webp",    "wp-phone-ohotnik",    "phone"),
    ("img/chars/lina.webp",       "wp-phone-lina",       "phone"),
    ("img/chars/aya.webp",        "wp-phone-aya",        "phone"),
    ("img/chars/nemezida.webp",   "wp-phone-nemezida",   "phone"),
    ("img/chars/jack.webp",       "wp-phone-jack",       "phone"),
    ("img/chars/raiz.webp",       "wp-phone-raiz",       "phone"),
    ("img/chars/skorpion.webp",   "wp-phone-skorpion",   "phone"),
    ("img/chars/berginator.webp", "wp-phone-berginator", "phone"),
    ("img/chars/darkdarus.webp",  "wp-phone-darkdarus",  "phone"),
    # — телефон: обложки томов —
    ("covers/book1.png",          "wp-phone-tom1",       "phone"),
    ("covers/book2.png",          "wp-phone-tom2",       "phone"),
    ("covers/book3.png",          "wp-phone-tom3",       "phone"),
]

DESKTOP = (1920, 1080)
PHONE = (1080, 1920)


def center_crop_to_ratio(im: Image.Image, ratio: float) -> Image.Image:
    """Кроп по центру до заданного отношения сторон (w/h), высота полная."""
    w, h = im.size
    target_w = round(h * ratio)
    if target_w <= w:
        x0 = (w - target_w) // 2
        return im.crop((x0, 0, x0 + target_w, h))
    # исходник уже ýже целевого (не бывает в наших наборах) — режем по высоте
    target_h = round(w / ratio)
    y0 = (h - target_h) // 2
    return im.crop((0, y0, w, y0 + target_h))


def make_wallpaper(src: Path, dst: Path, variant: str) -> tuple:
    im = Image.open(src).convert("RGB")
    ratio = DESKTOP[0] / DESKTOP[1] if variant == "desktop" else PHONE[0] / PHONE[1]
    im = center_crop_to_ratio(im, ratio)
    im = im.resize(DESKTOP if variant == "desktop" else PHONE, Image.LANCZOS)
    # лёгкая доводка резкости после апскейла — чтобы не мылило
    im = im.filter(ImageFilter.UnsharpMask(radius=1.6, percent=60, threshold=2))
    im.save(dst, "WEBP", quality=85, method=6)
    return im.size


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    total = 0
    for src_rel, name, variant in JOBS:
        src = PUBLIC / src_rel
        if not src.exists():
            raise SystemExit(f"НЕТ ФАЙЛА: {src}")
        dst = OUT / f"{name}.webp"
        size = make_wallpaper(src, dst, variant)
        kb = dst.stat().st_size // 1024
        total += kb
        print(f"{name}.webp  {size[0]}x{size[1]}  {kb} КБ")
    print(f"---\nитого: {len(JOBS)} файлов, {total // 1024} МБ")


if __name__ == "__main__":
    main()
