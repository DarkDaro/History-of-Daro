#!/usr/bin/env python3
"""Одноразовая инъекция openGraph-блоков в метаданные разделов (п.12.2 №7)."""
from pathlib import Path

SECTIONS = {
    "books": "Книги цикла",
    "world": "Мир: Хи-Мигата",
    "characters": "Персонажи",
    "corporations": "Корпорации",
    "timeline": "Таймлайн 2147",
    "gallery": "Галерея",
    "implants": "Импланты",
    "armory": "Вооружение",
    "chronicles": "Хроники",
    "excerpts": "Фрагменты",
    "story": "Суть истории",
    "author": "Автор",
}

ANCHOR = "export const metadata: Metadata = {"
ALT_ANCHOR = "export const metadata: Metadata ="

for slug, title in SECTIONS.items():
    f = Path(f"src/app/{slug}/page.tsx")
    if not f.exists():
        print(f"!! нет файла {f}")
        continue
    src = f.read_text(encoding="utf-8")
    if "openGraph" in src:
        print(f"== {slug}: openGraph уже есть, пропускаю")
        continue
    block = (
        f'  openGraph: {{\n'
        f'    title: "{title}",\n'
        f'    images: [{{ url: "/covers/og-{slug}.png", width: 1200, height: 630, alt: "{title} — История Даро" }}],\n'
        f'  }},\n'
    )
    if ANCHOR in src:
        src = src.replace(ANCHOR, ANCHOR + "\n" + block.rstrip("\n"), 1)
    elif ALT_ANCHOR in src:
        # многострочное объявление без "=" в одну строку
        idx = src.index(ALT_ANCHOR)
        brace = src.index("{", idx)
        src = src[: brace + 1] + "\n" + block.rstrip("\n") + src[brace + 1 :]
    else:
        print(f"!! {slug}: не найден якорь metadata")
        continue
    f.write_text(src, encoding="utf-8")
    print(f"ok {slug}")
