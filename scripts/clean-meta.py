#!/usr/bin/env python3
"""Чистка метафайлов: обращения «хозяин/заказчик» → «автор» (решение
автора 2026-11-23: называть его автором; упоминания «хозяина» из
внутренней кухни в документах и комментариях не нужны).

Работает по явной карте точных строк (файл, старое, новое) — никаких
регулярных догадок, каждое изменение видно в диффе.

НЕ трогает литературные вхождения — это канон, а не внутренняя кухня:
  src/content/excerpts.ts  «кто здесь настоящий хозяин» (текст фрагмента)
  src/content/characters.ts «оружие пережило хозяина» (Максимус)
  vault/  «данные изъяты», закрытые файлы базы канона

Запуск: python3 scripts/clean-meta.py  (из корня репозитория)
Выход: 0 — все замены применены; 1 — какая-то строка не найдена
(карта разошлась с файлами — карту надо поправить руками).
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# (файл, старое, новое)
REPLACEMENTS = [
    (
        "src/lib/db.ts",
        "По принципу хозяина проекта мусор не вычищаем",
        "По принципу автора проекта мусор не вычищаем",
    ),
    (
        "src/components/calendar-view.tsx",
        "решение хозяина, 2026-11-02",
        "решение автора, 2026-11-02",
    ),
    (
        "src/content/calendar.ts",
        "РЕШЕНИЕ ХОЗЯИНА (2026-11-02)",
        "РЕШЕНИЕ АВТОРА (2026-11-02)",
    ),
    (
        "rules-kit/workflow.md",
        "Перечитай сообщение заказчика построчно",
        "Перечитай сообщение автора построчно",
    ),
    (
        "rules-kit/workflow.md",
        "явной командой заказчика",
        "явной командой автора",
    ),
    (
        "scripts/remsg.py",
        "уточнение заказчика",
        "уточнение автора",
    ),
]


def main() -> int:
    missing = []
    for rel, old, new in REPLACEMENTS:
        path = ROOT / rel
        text = path.read_text(encoding="utf-8")
        n = text.count(old)
        if n == 0:
            missing.append(f"{rel}: не найдено «{old}»")
            continue
        path.write_text(text.replace(old, new), encoding="utf-8")
        print(f"ok: {rel} — замен {n}: «{old}» → «{new}»")
    if missing:
        print("\nкарта разошлась с файлами:")
        for m in missing:
            print(f"  {m}")
        return 1
    print("\nчистка завершена: все замены на месте")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
