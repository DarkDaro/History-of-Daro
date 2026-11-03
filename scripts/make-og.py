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
CONTENT = ROOT / "src" / "content" / "books.ts"  # B3: BOOKS переехал из content.ts в модуль книг

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


# ============================================================
# OG-картинки разделов (п.12.2 №7): public/covers/og-<slug>.png
# Дизайн в духе сайта: градиент фона, углы-«Corners», киккер
# «ИСТОРИЯ ДАРО // ХИ-МИГАТА 2147», крупный заголовок раздела,
# неоновая линия и адрес страницы. Запуск: python3 scripts/make-og.py
# ============================================================

SECTIONS = [
    ("books", "Книги цикла", "cyan"),
    ("world", "Мир: Хи-Мигата", "cyan"),
    ("characters", "Персонажи", "magenta"),
    ("corporations", "Корпорации", "cyan"),
    ("timeline", "Таймлайн 2147", "amber"),
    ("gallery", "Галерея", "magenta"),
    ("implants", "Импланты", "cyan"),
    ("armory", "Вооружение", "amber"),
    ("chronicles", "Хроники", "magenta"),
    ("excerpts", "Фрагменты", "cyan"),
    ("story", "Суть истории", "amber"),
    ("glossary", "Глоссарий мира", "cyan"),
    ("map", "Карта Хи-Мигаты", "cyan"),
    ("author", "Автор", "magenta"),
]
AMBER = (255, 176, 32)
ACCENT = {"cyan": CYAN, "magenta": MAGENTA, "amber": AMBER}


def corners(d, size=56, width=4, inset=28):
    """Углы-скобки в стиле компонента Corners."""
    a = inset
    x2, y2 = W - inset, H - inset
    for (x, y, dx, dy) in [
        (a, a, 1, 1), (x2, a, -1, 1), (x2, y2, -1, -1), (a, y2, 1, -1),
    ]:
        d.line([(x, y), (x + dx * size, y)], fill=CYAN + (200,), width=width)
        d.line([(x, y), (x, y + dy * size)], fill=CYAN + (200,), width=width)


def section_og(slug, title, accent):
    img = Image.new("RGBA", (W, H), BG_TOP + (255,))
    # вертикальный градиент фона
    for y in range(H):
        t = y / H
        img.paste(
            tuple(int(BG_TOP[i] + (BG_BOTTOM[i] - BG_TOP[i]) * t) for i in range(3)) + (255,),
            (0, y, W, y + 1),
        )
    d = ImageDraw.Draw(img)
    col = ACCENT[accent]

    # углы и неоновые полосы сверху/снизу
    corners(d)
    d.line([(0, 6), (W, 6)], fill=col + (110,), width=2)
    d.line([(0, H - 7), (W, H - 7)], fill=col + (110,), width=2)

    # киккер
    f_kick = ImageFont.truetype(FONT, 26)
    kick = "ИСТОРИЯ ДАРО // ХИ-МИГАТА · 2147"
    d.text(((W - d.textlength(kick, font=f_kick)) / 2, 92), kick,
           font=f_kick, fill=GREY + (220,))

    # заголовок раздела (по центру, с глоу)
    f_title = ImageFont.truetype(FONT_BOLD, 96)
    lines = wrap(d, title.upper(), f_title, W - 220)
    y = H / 2 - len(lines) * 60
    for line in lines:
        lw = d.textlength(line, font=f_title)
        glow_text(img, ((W - lw) / 2, y), line, f_title, WHITE, 10, 140)
        y += 118

    # неоновая линия + адрес
    d.line([(W / 2 - 120, H - 150), (W / 2 + 120, H - 150)], fill=col + (220,), width=3)
    f_addr = ImageFont.truetype(FONT, 22)
    addr = "daro://" + (slug if slug != "books" else "books")
    d.text(((W - d.textlength(addr, font=f_addr)) / 2, H - 118), addr,
           font=f_addr, fill=col + (170,))

    img.convert("RGB").save(COVERS / f"og-{slug}.png", "PNG")
    print("og-" + slug + ".png — ок")


def sections_main():
    for slug, title, accent in SECTIONS:
        section_og(slug, title, accent)


if __name__ == "__main__":
    sections_main()


# ============================================================
# OG-картинки отдельных фрагментов (BACKLOG 2026-11-03 №4):
# public/covers/og-excerpts/<slug>.png — тот же стиль, что у
# разделов, плюс строка тома и эпизода. Данные парсятся из
# src/content/excerpts.ts и books.ts — контент не дублируется.
# Запуск: python3 scripts/make-og.py
# ============================================================

EXCERPTS_SRC = ROOT / "src" / "content" / "excerpts.ts"
BOOKS_SRC = ROOT / "src" / "content" / "books.ts"


def _field(body, name):
    m = re.search(rf'\b{name}:\s*"([^"]+)"', body)
    return m.group(1) if m else ""


def _entries(src):
    """Режет модуль на записи по маркерам slug: "..." (порядок полей
    внутри записи значения не имеет — берём первую позицию slug)."""
    marks = [m for m in re.finditer(r'slug:\s*"([^"]+)"', src)]
    out = []
    for i, m in enumerate(marks):
        body = src[m.start(): marks[i + 1].start() if i + 1 < len(marks) else len(src)]
        out.append({"slug": m.group(1), "body": body})
    return out


def excerpts_main():
    books = {}
    for b in _entries(BOOKS_SRC.read_text(encoding="utf-8")):
        books[b["slug"]] = (_field(b["body"], "volume"), _field(b["body"], "title"))

    out_dir = COVERS / "og-excerpts"
    out_dir.mkdir(exist_ok=True)

    for e in _entries(EXCERPTS_SRC.read_text(encoding="utf-8")):
        slug = e["slug"]
        body = e["body"]
        title = _field(body, "title")
        label = _field(body, "label")
        accent = _field(body, "accent") or "cyan"
        if accent not in ACCENT:
            accent = "cyan"
        volume, _book_title = books.get(_field(body, "bookSlug"), ("ЦИКЛ", ""))

        img = Image.new("RGBA", (W, H), BG_TOP + (255,))
        for y in range(H):
            t = y / H
            img.paste(
                tuple(int(BG_TOP[i] + (BG_BOTTOM[i] - BG_TOP[i]) * t) for i in range(3)) + (255,),
                (0, y, W, y + 1),
            )
        d = ImageDraw.Draw(img)
        col = ACCENT[accent]
        corners(d)
        d.line([(0, 6), (W, 6)], fill=col + (110,), width=2)
        d.line([(0, H - 7), (W, H - 7)], fill=col + (110,), width=2)

        # киккер
        f_kick = ImageFont.truetype(FONT, 24)
        kick = "ИСТОРИЯ ДАРО // ХИ-МИГАТА · 2147"
        d.text(((W - d.textlength(kick, font=f_kick)) / 2, 88), kick,
               font=f_kick, fill=GREY + (220,))

        # строка тома и эпизода
        f_meta = ImageFont.truetype(FONT, 26)
        meta = f"{volume} · ФРАГМЕНТ · {label.upper()}" if label else f"{volume} · ФРАГМЕНТ"
        meta = meta.replace("· ФРАГМЕНТ · ", " · ФРАГМЕНТ · ")
        d.text(((W - d.textlength(meta, font=f_meta)) / 2, 168), meta,
               font=f_meta, fill=col + (200,))

        # заголовок фрагмента
        f_title = ImageFont.truetype(FONT_BOLD, 84)
        lines = wrap(d, title.upper(), f_title, W - 200, max_lines=3)
        y = H / 2 - 40 - len(lines) * 56
        for line in lines:
            lw = d.textlength(line, font=f_title)
            glow_text(img, ((W - lw) / 2, y), line, f_title, WHITE, 10, 140)
            y += 104

        # неоновая линия + адрес
        d.line([(W / 2 - 120, H - 150), (W / 2 + 120, H - 150)], fill=col + (220,), width=3)
        f_addr = ImageFont.truetype(FONT, 22)
        addr = "daro://excerpts/" + slug
        d.text(((W - d.textlength(addr, font=f_addr)) / 2, H - 118), addr,
               font=f_addr, fill=col + (170,))

        img.convert("RGB").save(out_dir / f"{slug}.png", "PNG")
        print("og-excerpts/" + slug + ".png — ок")


if __name__ == "__main__":
    excerpts_main()
