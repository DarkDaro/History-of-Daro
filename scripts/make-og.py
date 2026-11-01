#!/usr/bin/env python3
# ============================================================
# Генератор OG-картинок страниц томов (B2 ROADMAP).
# Из обложек public/covers/book{1,2,3}.png собирает
# public/covers/og-tom-{1,2,3}.png (1200x630) — неоновый коллаж
# «обложка + название тома». Шрифт: DejaVu Sans (кириллица).
# Запуск: python3 scripts/make-og.py
# ============================================================

import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
COVERS = ROOT / "public" / "covers"
CONTENT = ROOT / "src" / "lib" / "content.ts"

W, H = 1200, 630
BG_TOP = (7, 7, 15)
BG_BOTTOM = (12, 12, 30)
CYAN = (0, 240, 255)
MAGENTA = (255, 42, 109)
WHITE = (240, 244, 255)
GREY = (150, 158, 180)

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

ROMAN = {"tom-1": "ТОМ I", "tom-2": "ТОМ II", "tom-3": "ТОМ III"}
SOURCE = {"tom-1": "book1.png", "tom-2": "book2.png", "tom-3": "book3.png"}


def loglines_from_content():
    """Достаёт logline каждого тома из content.ts (slug -> текст)."""
    src = CONTENT.read_text(encoding="utf-8")
    out = {}
    for slug in ROMAN:
        m = re.search(
            rf'slug:\s*"{slug}".*?logline:\s*"([^"]+)"', src, re.S
        )
        out[slug] = m.group(1) if m else ""
    return out


def wrap(draw, text, font, max_width, max_lines=4):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if draw.textlength(test, font=font) <= max_width:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    if len(lines) > max_lines:
        lines = lines[:max_lines]
        lines[-1] = lines[-1].rstrip(" ,.;:") + "…"
    return lines


def glow_text(base, pos, text, font, fill, radius=8, alpha=160):
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.text(pos, text, font=font, fill=fill + (alpha,))
    layer = layer.filter(ImageFilter.GaussianBlur(radius))
    base.alpha_composite(layer)
    ImageDraw.Draw(base).text(pos, text, font=font, fill=fill + (255,))


def make(slug, logline):
    img = Image.new("RGBA", (W, H))
    # вертикальный градиент фона
    for y in range(H):
        t = y / H
        r = int(BG_TOP[0] + (BG_BOTTOM[0] - BG_TOP[0]) * t)
        g = int(BG_TOP[1] + (BG_BOTTOM[1] - BG_TOP[1]) * t)
        b = int(BG_TOP[2] + (BG_BOTTOM[2] - BG_TOP[2]) * t)
        ImageDraw.Draw(img).line([(0, y), (W, y)], fill=(r, g, b, 255))
    # сканлайны
    for y in range(0, H, 4):
        ImageDraw.Draw(img).line(
            [(0, y), (W, y)], fill=(0, 0, 0, 26)
        )

    # обложка слева
    cover = Image.open(COVERS / SOURCE[slug]).convert("RGBA")
    ch = 540
    cw = int(cover.width * ch / cover.height)
    cover = cover.resize((cw, ch), Image.LANCZOS)
    img.alpha_composite(cover, (48, (H - ch) // 2))

    f_label = ImageFont.truetype(FONT, 22)
    f_volume = ImageFont.truetype(FONT_BOLD, 64)
    f_title = ImageFont.truetype(FONT_BOLD, 58)
    f_small = ImageFont.truetype(FONT, 24)

    x = 48 + cw + 56
    maxw = W - x - 48

    glow_text(img, (x, 64), "ИСТОРИЯ ДАРО · ЦИКЛ РОМАНОВ", f_label, CYAN, 6, 120)
    glow_text(img, (x, 108), ROMAN[slug], f_volume, MAGENTA, 10, 140)

    # название в кавычках — с переносом
    d = ImageDraw.Draw(img)
    y = 200
    # «Название» берём из logline-блока ниже; заголовок рисуем позже
    # (передаётся параметром), здесь — неоновая линия.
    ImageDraw.Draw(img).line(
        [(x, y - 16), (x + maxw, y - 16)], fill=CYAN + (90,), width=2
    )
    return img, x, maxw, f_title, f_small, d


def finish(img, slug, title, logline, x, maxw, f_title, f_small):
    d = ImageDraw.Draw(img)
    y = 220
    for line in wrap(d, f"«{title}»", f_title, maxw):
        glow_text(img, (x, y), line, f_title, WHITE, 8, 130)
        y += 70
    y += 18
    for line in wrap(d, logline, f_small, maxw):
        d.text((x, y), line, font=f_small, fill=GREY + (255,))
        y += 34
    # нижняя подпись
    d = ImageDraw.Draw(img)
    d.text((x, H - 64), "daro://books/" + slug, font=ImageFont.truetype(FONT, 20), fill=CYAN + (150,))
    img.convert("RGB").save(COVERS / f"og-{slug}.png", "PNG")
    print("og-" + slug + ".png — ок")


def main():
    loglines = loglines_from_content()
    # Названия томов тоже берём из content.ts: title: "..."
    src = CONTENT.read_text(encoding="utf-8")
    titles = {}
    for slug in ROMAN:
        m = re.search(rf'slug:\s*"{slug}".*?\btitle:\s*"([^"]+)"', src, re.S)
        titles[slug] = m.group(1) if m else slug
    for slug in ROMAN:
        img, x, maxw, f_title, f_small, d = make(slug, loglines[slug])
        finish(img, slug, titles[slug], loglines[slug], x, maxw, f_title, f_small)


if __name__ == "__main__":
    main()
