#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Генератор Obsidian-vault «История Даро — База канона».
Источник данных: scripts/.vault-data.json (дамп src/content/*.ts).
Правила (согласованы с автором): весь канон, заметка на каждую позицию
каталогов, тексты дословно, анкеты с YAML-frontmatter (Dataview), полная
связка [[вики-ссылками]] + MOC-индексы, ключевые арты в attachments.
Результат: vault/История Даро — База канона/ → download/…zip
"""
import json, os, re, shutil, sys
from collections import OrderedDict

ROOT = "/home/z/my-project"
DATA = json.load(open(f"{ROOT}/scripts/.vault-data.json", encoding="utf-8"))
VAULT = f"{ROOT}/vault/История Даро — База канона"
ATTACH = "attachments"

# ---------------------------------------------------------------- утилиты
def fname(name: str) -> str:
    """Имя файла заметки без запрещённых в Obsidian символов."""
    s = name.strip().replace("/", " и ").replace(":", " -")
    s = re.sub(r'[\\*?"<>|#^]', "", s)
    return re.sub(r"\s+", " ", s).strip().strip(".")

def yaml(v) -> str:
    s = str(v)
    if s == "" or re.search(r'[:#\[\]{}&*!|>%@`,"\'\n]', s) or s != s.strip():
        return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'
    return s

def yaml_list(items) -> str:
    return "[" + ", ".join(yaml(i) for i in items) + "]"

def fm(fields: OrderedDict) -> str:
    out = ["---"]
    for k, v in fields.items():
        if v is None or v == "" or v == []:
            continue
        out.append(f"{k}: {yaml_list(v) if isinstance(v, list) else yaml(v)}")
    out.append("---")
    return "\n".join(out)

def bar(v: int) -> str:
    v = max(0, min(10, int(v)))
    return "▰" * v + "▱" * (10 - v) + f" {v}/10"

def stats_table(stats) -> str:
    if not stats:
        return ""
    rows = "\n".join(f"| {s['label']} | {bar(s['value'])} |" for s in stats)
    return "| Показатель | Значение |\n|---|---|\n" + rows

def kv_table(pairs) -> str:
    rows = "\n".join(f"| {k} | {v} |" for k, v in pairs if v not in (None, ""))
    return "| Поле | Данные |\n|---|---|\n" + rows

def quote_callout(text: str, source: str | None = None, title: str = "Цитата") -> str:
    out = [f"> [!quote] {title}"] + [f"> {ln}" for ln in text.split("\n")]
    if source:
        out.append(f"> — *{source}*")
    return "\n".join(out)

def log_callout(lines, title="Перехват канала") -> str:
    out = [f"> [!audioline] {title}"]
    for l in lines:
        out.append(f"> **{l['speaker']}:** {l['text']}")
    return "\n".join(out)

# ---------------------------------------------------------------- реестр
class Note:
    def __init__(self, name, rel_path, front, body):
        self.name, self.rel_path, self.front, self.body = name, rel_path, front, body

class Registry:
    def __init__(self):
        self.order, self.by_name = [], {}

    def add(self, name, rel_path, front, body, merge_section=None):
        """Новая заметка; если имя занято — тело дописывается секцией
        (склейка дублей канона: оружие+спецификация, персонаж+аномалия…)."""
        note = self.by_name.get(name)
        if note:
            if merge_section:
                note.body += f"\n\n## {merge_section}\n\n" + body
            return note
        note = Note(name, rel_path, front, body)
        self.by_name[name] = note
        self.order.append(note)
        return note

REG = Registry()

# ---------------------------------------------------------------- автосвязывание
LINK_RULES = []          # (pattern, target_note)
_COMBINED = None         # лениво: строится после регистрации всех имён

VOW = "аеёиоуыэюя"
ENDINGS = "(?:а|я|ы|и|у|ю|е|о|ом|ем|ой|ей|ою|ею|ам|ям|ах|ях|ами|ями|ов|ев|ии|ия|ию)?"

def word_re(w: str) -> str:
    if len(w) >= 4 and w[-1] in VOW:
        return re.escape(w[:-1]) + ENDINGS
    return re.escape(w) + ENDINGS if len(w) >= 5 else re.escape(w)

def name_re(name: str) -> str:
    parts = [p for p in re.split(r"\s+", name.strip()) if p]
    return r"[\s]+".join(word_re(p) for p in parts)

BOUND_L = r"(?<![0-9A-Za-zА-Яа-яЁё\-])"
BOUND_R = r"(?![0-9A-Za-zА-Яа-яЁё\-])"

def add_link_alias(surface: str, target: str):
    surface = (surface or "").strip()
    if len(surface) < 2 or not REG.by_name.get(target):
        return
    pat = BOUND_L + name_re(surface) + BOUND_R
    for p, t in LINK_RULES:
        if t == target and p == pat:
            return
    LINK_RULES.append((pat, target))

def _build_combined():
    global _COMBINED
    if _COMBINED is None:
        LINK_RULES.sort(key=lambda x: -len(x[0]))
        targets, alts = [], []
        for pat, t in LINK_RULES:
            alts.append(f"({pat})")
            targets.append(t)
        _COMBINED = (re.compile("|".join(alts)), targets)
    return _COMBINED

def LK(target: str, label: str | None = None) -> str:
    """Токен прекомпонованной вики-ссылки — превращается в [[…]] ПОСЛЕ L(),
    чтобы автолинковщик не трогал цель и ярлык."""
    return "@@LK:" + target + ("|" + label if label else "") + "@@"

def RAW(text: str) -> str:
    """Токен проходного текста (заголовки): L() возвращает его без изменений."""
    return "@@RAW:" + text + "@@"

def L(text: str, self_name: str | None = None) -> str:
    """Автосвязывание: имена/термины → [[заметка|поверхность]].
    Токены @@LK:…@@ (готовые ссылки) маскируются до прогона правил."""
    if not text:
        return text
    toks: list[str] = []
    def _keep(m):
        toks.append(m.group(0))
        return chr(1) + str(len(toks) - 1) + chr(1)
    text = re.sub(r"@@(?:LK|RAW):[^@]*@@", _keep, text)
    combined, targets = _build_combined()
    def _repl(m):
        surface = m.group(0)
        gi = next(i for i in range(1, combined.groups + 1) if m.group(i) is not None)
        target = targets[gi - 1]
        if self_name and target == self_name:
            return surface
        if surface == target:
            return f"[[{target}]]"
        return f"[[{target}|{surface}]]"
    out = combined.sub(_repl, text)
    out = re.sub(chr(1) + r"(\d+)" + chr(1), lambda m: toks[int(m.group(1))], out)
    def _tok(m):
        kind, rest = m.group(1), m.group(2)
        if kind == "RAW":
            return rest
        t, _, lab = rest.partition("|")
        return f"[[{t}]]" if not lab else f"[[{t}|{lab}]]"
    return re.sub(r"@@(LK|RAW):([^@]*)@@", _tok, out)

# ---------------------------------------------------------------- маршруты сайта
ROUTE = {}

def link_for_route(rt, label=None):
    rt = (rt or "").rstrip("/").split("#")[0]
    note = ROUTE.get(rt)
    if not note:
        for known, n in ROUTE.items():
            if rt.startswith(known + "/"):
                note = n
                break
    return note or None

# ---------------------------------------------------------------- картинки
GALLERY_BY_SRC = {g["src"]: g for g in DATA["gallery"]["GALLERY"]}

def embed(img_path, caption=True):
    base = os.path.basename(img_path)
    out = f"![[{base}]]"
    if caption:
        g = GALLERY_BY_SRC.get(img_path)
        if g and g.get("caption"):
            out += f"\n*{g['caption']}*"
    return out

def copy_images():
    n = 0
    jobs = [("public/img/chars", None), ("public/img/scenes", None),
            ("public/covers", ("book1.png", "book2.png", "book3.png", "hero-city.png"))]
    for src_rel, only in jobs:
        src = os.path.join(ROOT, src_rel)
        if not os.path.isdir(src):
            continue
        os.makedirs(os.path.join(VAULT, ATTACH), exist_ok=True)
        for f in sorted(os.listdir(src)):
            if only and f not in only:
                continue
            fp = os.path.join(src, f)
            if not os.path.isfile(fp):
                continue
            shutil.copy2(fp, os.path.join(VAULT, ATTACH, f))
            n += 1
    return n

# ================================================================ ГЛАВНОЕ
def main():
    chars = DATA["characters"]
    weapons = DATA["weapons"]["WEAPONS"]
    specs = DATA["weapon-specs"]["WEAPON_SPECS"]
    implants = DATA["implants"]["IMPLANTS"]
    corps = DATA["corporations"]["CORPORATIONS"]
    factions = DATA["corporations"]["RESISTANCE_GROUPS"]
    dossier = {d["name"]: d for d in DATA["dossier"]["DOSSIER_FILES"]}
    world = DATA["world"]
    glossary = DATA["glossary"]["GLOSSARY"]
    chronicles = DATA["chronicles"]["CHRONICLES"]
    timeline = DATA["timeline"]
    mapd = DATA["map"]
    books = DATA["books"]["BOOKS"]
    excerpts = DATA["excerpts"]["EXCERPTS"]
    story = DATA["story"]
    synopsis = DATA["synopsis"]
    calendar = DATA["calendar"]

    os.makedirs(VAULT, exist_ok=True)

    # -------- маршруты заранее (цели — имена заметок) --------
    tom_alias = {"tom-1": "Том I", "tom-2": "Том II", "tom-3": "Том III"}
    def vol(b):
        return "Том " + b["volume"].split()[-1]
    book_names = {b["slug"]: fname(f"{vol(b)} — {b['title']}") for b in books}
    ROUTE.update({
        "/": "Главная", "/story": "Суть истории", "/world": "Хи-Мигата",
        "/map": "Карта города", "/timeline": "Таймлайн 2147", "/calendar": "Календарь событий",
        "/characters": "Индекс — Персонажи", "/corporations": "Индекс — Мир",
        "/implants": "Индекс — Кодекс", "/armory": "Индекс — Кодекс",
        "/chronicles": "Индекс — Хроники", "/books": "Индекс — Книги",
        "/excerpts": "Индекс — Книги", "/glossary": "Индекс — Глоссарий",
        "/gallery": "Индекс — Мир",
    })
    for b in books:
        ROUTE[f"/books/{b['slug']}"] = book_names[b["slug"]]
    for e in excerpts:
        ROUTE[f"/excerpts/{e['slug']}"] = fname(f"{e['label']} — {e['title']}")
    for ch in chronicles:
        ROUTE[f"/chronicles/{ch['slug']}"] = fname(f"{ch['code']} — {ch['title']}")

    # ------------------------------------------------ 1. ПЕРСОНАЖИ
    P01 = "01 Персонажи"
    group_label = {g["id"]: g["label"] for g in chars["CHARACTER_GROUPS"]}
    for c in chars["CHARACTERS"]:
        name = fname(c["name"])
        body = []
        if c.get("portrait"):
            body.append(embed(c["portrait"], caption=c.get("quote") != GALLERY_BY_SRC.get(c["portrait"], {}).get("caption")))
            if c["id"] == "RH-087":
                body.append("![[hugo.webp]]\n*Визуальная запись под именем «Хьюго» — вне реестров.*")
        if c.get("quote"):
            body.append(quote_callout(c["quote"], title="Цитата дела"))
        passport = [("Код записи", f"`{c['id']}`"), ("Классификация", c["tag"]), ("Роль", c["role"])]
        if c.get("alterEgo"):
            alt = c["alterEgo"]["name"] + (f" — {c['alterEgo']['note']}" if c["alterEgo"].get("note") else "")
            passport.append(("Альтер-эго", alt))
        passport.append(("Группа реестра", group_label.get(c.get("group", ""), "—")))
        body.append("## Паспорт файла\n" + kv_table(passport))
        body.append("## Досье\n" + c["text"])
        st = stats_table(c.get("stats"))
        if st:
            body.append("## Показатели\n" + st)
        aliases = [c["alterEgo"]["name"]] if c.get("alterEgo") else []
        if "/" in c["name"]:
            aliases += [p.strip() for p in c["name"].split("/") if p.strip() and p.strip() != c["name"]]
        front = OrderedDict([
            ("type", "character"), ("id", c["id"]), ("name", c["name"]),
            ("role", c["role"]), ("status", c["tag"]),
            ("group", group_label.get(c.get("group", ""), "")),
            ("threat", next((s["value"] for s in c.get("stats", []) if s["label"] == "Угроза"), None)),
            ("aliases", aliases), ("source", "/characters"),
            ("tags", ["персонажи", c.get("group", "прочее")]),
        ])
        REG.add(name, f"{P01}/{name}.md", front, "\n\n".join(body))
        add_link_alias(c["name"], name)
        for a in aliases:
            add_link_alias(a, name)

    # ------------------------------------------------ 2. КОРПОРАЦИИ + ФРАКЦИИ
    P02 = "02 Мир"
    for f in corps:
        name = fname(f["name"])
        d = dossier.get(f["name"])
        body = []
        if f.get("log"):
            body.append(log_callout([f["log"]], "Перехват канала"))
        passport = [("Код", f"`{f['id']}`"), ("Профиль", f["tag"]), ("Роль", f["role"])]
        if d:
            passport += [("Статус досье", d["status"]),
                         ("Угроза", f"{bar(d['threat'])} — {d['threatLabel']}")]
        body.append("## Карточка\n" + kv_table(passport))
        body.append("## Профиль\n" + f["text"])
        if d and d.get("assets"):
            body.append("## Активы\n" + "\n".join(f"- {a}" for a in d["assets"]))
        if d and d.get("log") and d["log"] != f.get("log"):
            body.append(log_callout([d["log"]], "Перехват досье"))
        front = OrderedDict([("type", "corporation"), ("id", f["id"]), ("name", f["name"]),
                             ("role", f["role"]), ("profile", f["tag"]),
                             ("threat", d["threat"] if d else None),
                             ("source", "/corporations"), ("tags", ["корпорации"])])
        REG.add(name, f"{P02}/Корпорации/{name}.md", front, "\n\n".join(body),
                merge_section="Досье корпорации" if name == fname("Бергинатор") else None)
        add_link_alias(f["name"], name)
    for f in factions:
        name = fname(f["name"])
        body = []
        if f.get("log"):
            body.append(log_callout([f["log"]], "Перехват канала"))
        body.append("## Карточка\n" + kv_table([("Код", f"`{f['id']}`"), ("Профиль", f["tag"]), ("Роль", f["role"])]))
        body.append("## Профиль\n" + f["text"])
        front = OrderedDict([("type", "faction"), ("id", f["id"]), ("name", f["name"]),
                             ("role", f["role"]), ("source", "/corporations"), ("tags", ["фракции"])])
        REG.add(name, f"{P02}/Фракции/{name}.md", front, "\n\n".join(body))
        add_link_alias(f["name"], name)

    # ------------------------------------------------ 3. АРСЕНАЛ (карточки + спецификации)
    P03 = "03 Кодекс"
    def spec_key(n):
        k = re.sub(r"[«»\"']", "", n).lower().strip()
        return re.sub(r"\s+даро$", "", k)
    spec_by_key = {spec_key(s["name"]): s for s in specs}
    seen_spec = set()
    for w in weapons:
        name = fname(w["name"])
        s = spec_by_key.get(spec_key(w["name"]))
        if s:
            seen_spec.add(s["name"])
        body = []
        if w.get("quote"):
            body.append(quote_callout(w["quote"], title="Из полевых записей"))
        passport = [("Код", f"`{w['id']}`"), ("Класс", w["tag"]), ("Тип", w["role"]),
                    ("Владелец", s["owner"] if s else None),
                    ("Сторона", "Сопротивление" if w["side"] == "resistance" else "Корпорации")]
        body.append("## Карточка\n" + kv_table(passport))
        body.append("## Описание\n" + w["text"])
        if s:
            spec_rows = [f"| {sp['label']} | {sp['value']} |" for sp in s["specs"]]
            for lbl, k in (("Свечение", "glow"), ("Звук", "sound")):
                if s.get(k):
                    spec_rows.append(f"| {lbl} | {s[k]} |")
            if s.get("modes"):
                spec_rows.append(f"| Режимы | {', '.join(s['modes'])} |")
            t = "## Параметры\n| Параметр | Значение |\n|---|---|\n" + chr(10).join(spec_rows)
            if s.get("note"):
                t += f"\n\n*{s['note']}*"
            body.append(t)
        st = stats_table(w.get("stats"))
        if st:
            body.append("## Показатели\n" + st)
        front = OrderedDict([("type", "weapon"), ("id", w["id"]), ("name", w["name"]),
                             ("class", w["tag"]), ("kind", w["role"]),
                             ("side", "Сопротивление" if w["side"] == "resistance" else "Корпорации"),
                             ("owner", s["owner"] if s else None),
                             ("source", "/armory"), ("tags", ["арсенал"])])
        REG.add(name, f"{P03}/Арсенал/{name}.md", front, "\n\n".join(body),
                merge_section="Технологический аспект" if name in ("Фрагмент Искина", "Призрачный клинок") else None)
        add_link_alias(w["name"], name)
    for s in specs:  # спецификации без карточки «войны» — свои заметки
        if s["name"] in seen_spec:
            continue
        name = fname(s["name"])
        spec_rows = [f"| {sp['label']} | {sp['value']} |" for sp in s["specs"]]
        for lbl, k in (("Свечение", "glow"), ("Звук", "sound")):
            if s.get(k):
                spec_rows.append(f"| {lbl} | {s[k]} |")
        if s.get("modes"):
            spec_rows.append(f"| Режимы | {', '.join(s['modes'])} |")
        t = "| Параметр | Значение |\n|---|---|\n" + chr(10).join(spec_rows)
        if s.get("note"):
            t += f"\n\n*{s['note']}*"
        body = ["## Карточка\n" + kv_table([("Владелец", s["owner"]), ("Группа", s["group"]), ("Тип", s["kind"])]), t]
        front = OrderedDict([("type", "weapon"), ("name", s["name"]), ("owner", s["owner"]),
                             ("class", s["group"]), ("kind", s["kind"]),
                             ("source", "/armory"), ("tags", ["арсенал"])])
        REG.add(name, f"{P03}/Арсенал/{name}.md", front, "\n\n".join(body))
        add_link_alias(s["name"], name)

    # ------------------------------------------------ 4. ИМПЛАНТЫ
    for i in implants:
        name = fname(i["name"])
        body = []
        if i.get("quote"):
            body.append(quote_callout(i["quote"], title="Из реестра"))
        body.append("## Карточка\n" + kv_table([("Код", f"`{i['id']}`"), ("Класс", i["tag"]), ("Тип", i["role"])]))
        body.append("## Описание\n" + i["text"])
        st = stats_table(i.get("stats"))
        if st:
            body.append("## Показатели\n" + st)
        front = OrderedDict([("type", "implant"), ("id", i["id"]), ("name", i["name"]),
                             ("class", i["tag"]), ("kind", i["role"]),
                             ("source", "/implants"), ("tags", ["импланты"])])
        REG.add(name, f"{P03}/Импланты/{name}.md", front, "\n\n".join(body))
        add_link_alias(i["name"], name)

    # ------------------------------------------------ 5. ТЕХНОЛОГИИ И АНОМАЛИИ
    merge_titles = {"Фрагмент Искина": "Технологический аспект",
                    "Призрачный клинок": "Аномальный аспект",
                    "Даркдарус": "Аномалия: древняя сила"}
    for key in ("TECH", "ANOMALIES"):
        for t in world[key]:
            name = fname(t["name"])
            body = ["## Карточка\n" + kv_table([("Код", f"`{t['id']}`"), ("Класс", t["tag"]), ("Тип", t["role"])]),
                    "## Описание\n" + t["text"]]
            front = OrderedDict([("type", "technology"), ("id", t["id"]), ("name", t["name"]),
                                 ("class", t["tag"]), ("kind", t["role"]),
                                 ("source", "/world"), ("tags", ["мир", "технологии"])])
            REG.add(name, f"{P02}/Технологии/{name}.md", front, "\n\n".join(body),
                    merge_section=merge_titles.get(t["name"], "Технология"))
            add_link_alias(t["name"], name)

    # ------------------------------------------------ 6. КНИГИ
    P05 = "05 Книги"
    for b in books:
        name = book_names[b["slug"]]
        body = [embed(b["cover"]),
                quote_callout(b["logline"], title="Логлайн"),
                kv_table([("Код", f"`{b['code']}`"), ("Статус", b["status"]), ("Объём", b["pages"]),
                          ("Теги", " ".join(b["tags"]))]),
                "## Синопсис\n" + "\n\n".join(b["synopsis"])]
        if b.get("acts"):
            body.append("## Структура · акты\n" + "\n\n".join(RAW(f"### {a['title']}") + "\n" + a["text"] for a in b["acts"]))
        body.append("## Факты\n" + kv_table([(x["label"], x["value"]) for x in b["facts"]]))
        body.append(quote_callout(b["terminalQuote"]["text"], b["terminalQuote"]["source"], "Терминал"))
        front = OrderedDict([("type", "book"), ("code", b["code"]),
                             ("name", f"{vol(b)} — {b['title']}"),
                             ("volume", b["volume"].title()), ("status", b["status"]),
                             ("aliases", [tom_alias[b["slug"]], b["title"]]),
                             ("source", f"/books/{b['slug']}"), ("tags", ["книги"])])
        REG.add(name, f"{P05}/{name}.md", front, "\n\n".join(body))
        add_link_alias(f"{vol(b)} — {b['title']}", name)
        add_link_alias(tom_alias[b["slug"]], name)
        add_link_alias(b["title"], name)

    # ------------------------------------------------ 7. ФРАГМЕНТЫ
    for e in excerpts:
        name = ROUTE[f"/excerpts/{e['slug']}"]
        body = [kv_table([("Место", e["place"]), ("Время", e["time"]), ("Статус", e["status"]),
                          ("Том", tom_alias.get(e["bookSlug"], e["bookSlug"]))]),
                f"**{e['lead']}**"]
        for sec in e["sections"]:
            head = RAW(f"### {sec['title']}") + "\n" if sec.get("title") else ""
            block = head + "\n\n".join(sec["paragraphs"])
            if sec.get("log"):
                block += "\n\n" + log_callout(sec["log"])
            body.append(block)
        body.append(quote_callout(e["terminalQuote"]["text"], e["terminalQuote"]["source"], "Терминал"))
        if e.get("note"):
            body.append(f"*{e['note']}*")
        front = OrderedDict([("type", "excerpt"), ("slug", e["slug"]),
                             ("name", f"{e['label']} — {e['title']}"),
                             ("book", tom_alias.get(e["bookSlug"], e["bookSlug"])),
                             ("place", e["place"]), ("time", e["time"]), ("status", e["status"]),
                             ("aliases", [e["title"]]),
                             ("source", f"/excerpts/{e['slug']}"), ("tags", ["фрагменты"])])
        REG.add(name, f"{P05}/Фрагменты/{name}.md", front, "\n\n".join(body))
        add_link_alias(e["title"], name)

    # ------------------------------------------------ 8. ХРОНИКИ
    P04 = "04 Хроники"
    for ch in chronicles:
        name = ROUTE[f"/chronicles/{ch['slug']}"]
        body = []
        if ch.get("cover"):
            body.append(embed(ch["cover"]))
        body.append(kv_table([("Код", f"`{ch['code']}`"), ("Статус", ch["status"]),
                              ("Источник", ch["sourceLabel"]), ("Теги", ", ".join(ch["tags"]))]))
        body.append(f"**{ch['lead']}**")
        body.append("## Вступление\n" + "\n\n".join(ch["intro"]))
        for i, sc in enumerate(ch["scenes"], 1):
            block = RAW(f"## Сцена {i} · {sc['title']}") + "\n" + "\n\n".join(sc["paragraphs"])
            if sc.get("log"):
                block += "\n\n" + log_callout(sc["log"])
            body.append(block)
        body.append("## Исход\n" + ch["outro"])
        body.append(quote_callout(ch["terminalQuote"]["text"], ch["terminalQuote"]["source"], "Терминал"))
        rel = "\n".join(f"- {r['note']} → {LK(link_for_route(r['href']) or r['label'], r['label'])}"
                        for r in ch["related"])
        body.append("## Связанные материалы\n" + rel)
        front = OrderedDict([("type", "chronicle"), ("code", ch["code"]), ("name", ch["title"]),
                             ("status", ch["status"]), ("aliases", [ch["title"]]),
                             ("source", f"/chronicles/{ch['slug']}"), ("tags", ["хроники"])])
        REG.add(name, f"{P04}/{name}.md", front, "\n\n".join(body))
        add_link_alias(ch["title"], name)

    # ------------------------------------------------ 9. МИР: город + карта
    city_d = dossier.get("Хи-Мигата")
    body = [embed(DATA["shared"]["VISUALS"]["city"]),
            "## Город в числах\n" + kv_table([(s["label"], f"**{s['to']}**{s.get('suffix', '')}")
                                              for s in world["WORLD_STATS"]]),
            "## Обзор\n" + "\n\n".join(RAW(f"### {s['title']} · {s['year']}") + "\n" + s["text"]
                                       for s in world["WORLD_OVERVIEW"]),
            "## Повседневность\n" + "\n\n".join(RAW(f"### {d['title']}") + "\n" + d["text"]
                                                for d in world["DAILY_LIFE"])]
    if city_d:
        body.append("## Досье города\n" + kv_table([
            ("Статус", city_d["status"]),
            ("Угроза", f"{bar(city_d['threat'])} — {city_d['threatLabel']}")]))
        body.append("\n".join(f"- {a}" for a in city_d["assets"]))
        if city_d.get("log"):
            body.append(log_callout([city_d["log"]], "Перехват досье"))
    front = OrderedDict([("type", "world"), ("name", "Хи-Мигата"),
                         ("aliases", ["Хи-Мигату", "город"]),
                         ("source", "/world"), ("tags", ["мир"])])
    REG.add("Хи-Мигата", f"{P02}/Хи-Мигата.md", front, "\n\n".join(body))
    add_link_alias("Хи-Мигата", "Хи-Мигата")

    cat_label = {c["id"]: c["label"] for c in mapd["MAP_CATEGORIES"]}
    body = [f"> [!info] Реестр сопротивления\n> {mapd['MAP_NOTE']}"]
    by_cat = OrderedDict()
    for p in mapd["MAP_POINTS"]:
        by_cat.setdefault(p["category"], []).append(p)
    for cat, pts in by_cat.items():
        sec = [RAW("## " + cat_label.get(cat, cat))]
        for p in pts:
            # заголовок — без ссылок (чистый outline), текст линкуется на шаге 16
            block = RAW(f"### {p['id']} · {p['name']}") + "\n" + p["text"]
            refs = []
            if p.get("hrefLabel") and link_for_route(p["href"]):
                refs.append(LK(link_for_route(p["href"]), p["hrefLabel"]))
            if p.get("glossary"):
                gterm = next((t["term"] for lvl in glossary for t in lvl["entries"] if t["id"] == p["glossary"]), None)
                if gterm and fname(gterm) in REG.by_name:
                    refs.append(LK(fname(gterm)))
            if refs:
                block += "\n\n*→ " + " · ".join(refs) + "*"
            sec.append(block)
        body.append("\n\n".join(sec))
    front = OrderedDict([("type", "map"), ("name", "Карта города"),
                         ("points", len(mapd["MAP_POINTS"])),
                         ("source", "/map"), ("tags", ["мир", "карта"])])
    REG.add("Карта города", f"{P02}/Карта города.md", front, "\n\n".join(body))

    # ------------------------------------------------ 10. СУТЬ ИСТОРИИ
    body = [quote_callout(synopsis["LOGLINE"], title="Логлайн"),
            "## Коротко\n" + "\n\n".join(synopsis["SYNOPSIS_SHORT"]),
            "## Полный синопсис\n" + "\n\n".join(synopsis["SYNOPSIS_FULL"]),
            "## Темы\n" + "\n\n".join(RAW(f"### {t['title']}") + "\n" + t["text"] for t in synopsis["THEMES"]),
            "## Принципы\n" + "\n\n".join(RAW(f"### {p['title']}") + "\n" + p["text"] for p in synopsis["PRINCIPLES"]),
            "## Человеческие истории\n" + "\n\n".join(RAW(f"### {s['title']}") + "\n" + s["text"]
                                                      for s in story["HUMAN_STORIES"]),
            "## Влияния\n" + kv_table([(i["source"], i["taken"]) for i in story["INFLUENCES"]])]
    front = OrderedDict([("type", "story"), ("name", "Суть истории"),
                         ("source", "/story"), ("tags", ["ядро"])])
    REG.add("Суть истории", "00 Индекс/Суть истории.md", front, "\n\n".join(body))

    # ------------------------------------------------ 11. ТАЙМЛАЙН
    body = []
    for era in timeline["TIMELINE_ERAS"]:
        evs = [e for e in timeline["TIMELINE"] if e["era"] == era["id"]]
        if not evs:
            continue
        sec = [f"## {era['label']}"]
        for e in evs:
            mark = " `ЗАСЕКРЕЧЕНО`" if e.get("classified") else ""
            sec.append(RAW(f"### {e['when']} · {e['title']}{mark}") + "\n" + e["text"])
        body.append("\n\n".join(sec))
    front = OrderedDict([("type", "timeline"), ("name", "Таймлайн 2147"),
                         ("events", len(timeline["TIMELINE"])),
                         ("source", "/timeline"), ("tags", ["хронология"])])
    REG.add("Таймлайн 2147", "00 Индекс/Таймлайн 2147.md", front, "\n\n".join(body))

    # ------------------------------------------------ 12. КАЛЕНДАРЬ
    months = OrderedDict()
    for ev in calendar["CALENDAR_EVENTS"]:
        months.setdefault(ev["when"][:7], []).append(ev)
    body = [f"> [!info] Примечание реестра\n> {calendar['CALENDAR_NOTE']}"]
    for m, evs in months.items():
        body.append("\n\n".join(
            [f"## {m}"] + [RAW(f"### {ev['dateLabel']} · {ev['title']}") + "\n"
                           f"*Место: {ev['place']}*\n\n{ev['text']}"
                            for ev in evs]))
    front = OrderedDict([("type", "calendar"), ("name", "Календарь событий"),
                         ("events", len(calendar["CALENDAR_EVENTS"])),
                         ("source", "/calendar"), ("tags", ["хронология"])])
    REG.add("Календарь событий", "00 Индекс/Календарь событий.md", front, "\n\n".join(body))

    # ------------------------------------------------ 13. ГЛОССАРИЙ
    P06 = "06 Глоссарий"
    for lvl in glossary:
        for t in lvl["entries"]:
            name = fname(t["term"])
            body = []
            if t.get("kind"):
                body.append(f"*{t['kind']}*")
            body.append(t["text"])
            refs = []
            if t.get("href") and link_for_route(t["href"]):
                refs.append("→ " + LK(link_for_route(t["href"])))
            if t.get("also") and link_for_route(t["also"]["href"]):
                refs.append("→ " + LK(link_for_route(t["also"]["href"]), t["also"]["label"]))
            if refs:
                body.append("\n".join(refs))
            front = OrderedDict([("type", "term"), ("term", t["term"]),
                                 ("kind", t.get("kind")), ("level", lvl["num"]),
                                 ("aliases", t.get("aliases", [])),
                                 ("source", f"/glossary#{t['id']}"), ("tags", ["глоссарий"])])
            REG.add(name, f"{P06}/{name}.md", front, "\n\n".join(body),
                    merge_section=f"Глоссарий · {lvl['title']}" if name in REG.by_name else None)
            add_link_alias(t["term"], name)
            for a in t.get("aliases", []):
                add_link_alias(a, name)

    # ------------------------------------------------ 14. ИНДЕКСЫ
    def index_note(name, path, intro, groups, dv=None):
        parts = [intro]
        for title, items in groups:
            items = [i for i in items if i in REG.by_name]
            if not items:
                continue
            parts.append(f"## {title}\n" + "\n".join(f"- [[{i}]]" for i in items))
        if dv:
            parts.append("## Dataview\n" + dv)
        REG.add(name, path, OrderedDict([("type", "index"), ("name", name), ("tags", ["MOC"])]),
                "\n\n".join(parts))

    char_names = [fname(c["name"]) for c in chars["CHARACTERS"]]
    index_note("Индекс — Персонажи", f"{P01}/Индекс — Персонажи.md",
               "Личные дела из реестров сопротивления: команда, сопротивление, антагонисты, "
               "вне реестров и закрытые файлы. Каждый файл — отдельная заметка.",
               [("Все дела", char_names)],
               "```dataview\nTABLE role AS \"Роль\", group AS \"Группа\", threat AS \"Угроза\"\n"
               "FROM \"01 Персонажи\"\nWHERE type = \"character\"\nSORT file.name ASC\n```")

    def names_with(frag):
        return sorted(n for n, note in REG.by_name.items() if note.rel_path and frag in note.rel_path)

    index_note("Индекс — Мир", f"{P02}/Индекс — Мир.md",
               "Досье мира: город, корпорации, фракции, технологии и карта Хи-Мигаты.",
               [("Город", ["Хи-Мигата", "Карта города"]),
                ("Корпорации", [fname(f["name"]) for f in corps]),
                ("Фракции", [fname(f["name"]) for f in factions]),
                ("Технологии и аномалии", [fname(t["name"]) for t in world["TECH"] + world["ANOMALIES"]])])

    index_note("Индекс — Кодекс", f"{P03}/Индекс — Кодекс.md",
               "Кодекс мира: импланты и арсенал. Каждый объект — отдельная заметка.",
               [("Импланты", [fname(i["name"]) for i in implants]),
                ("Арсенал", names_with("Арсенал"))],
               "```dataview\nTABLE owner AS \"Владелец\", class AS \"Класс\"\n"
               "FROM \"03 Кодекс\"\nWHERE type = \"weapon\" OR type = \"implant\"\nSORT file.name ASC\n```")

    index_note("Индекс — Хроники", f"{P04}/Индекс — Хроники.md",
               "Реконструкции событий из перехваченных каналов.",
               [("Хроники", [fname(f"{c['code']} — {c['title']}") for c in chronicles])])

    index_note("Индекс — Книги", f"{P05}/Индекс — Книги.md",
               "Трилогия «Истории Даро» и опубликованные фрагменты.",
               [("Тома", [book_names[b["slug"]] for b in books]),
                ("Фрагменты", [fname(f"{e['label']} — {e['title']}") for e in excerpts])])

    index_note("Индекс — Глоссарий", f"{P06}/Индекс — Глоссарий.md",
               "Словарь автора v1.0: четыре уровня терминов + планируемые записи.",
               [(lvl["title"], [fname(t["term"]) for t in lvl["entries"]]) for lvl in glossary],
               "```dataview\nTABLE kind AS \"Тип\", level AS \"Уровень\"\n"
               "FROM \"06 Глоссарий\"\nWHERE type = \"term\"\nSORT file.name ASC\n```")

    # ------------------------------------------------ 15. ГЛАВНАЯ (MOC)
    weapon_count = sum(1 for n in REG.by_name if REG.by_name[n].front.get("type") == "weapon")
    term_notes = sum(1 for n in REG.by_name if REG.by_name[n].front.get("type") == "term")
    counts = OrderedDict([
        ("персонажей", len(chars["CHARACTERS"])), ("единиц арсенала", weapon_count),
        ("имплантов", len(implants)),
        ("корпораций и фракций", len(corps) + len(factions)),
        ("технологий и аномалий", len(world["TECH"]) + len(world["ANOMALIES"])),
        ("терминов глоссария", term_notes), ("книг", len(books)),
        ("фрагментов", len(excerpts)), ("хроник", len(chronicles)),
        ("событий таймлайна", len(timeline["TIMELINE"])),
        ("точек карты", len(mapd["MAP_POINTS"])),
    ])
    counts_md = "\n".join(f"> **{k}:** {v}" for k, v in counts.items())
    home = "\n\n".join([
        f"> [!abstract] База канона «Истории Даро»\n"
        f"> Лорные заметки, собранные из официального сайта. Тексты канона перенесены дословно; "
        f"связи — вики-ссылками; у карточек YAML-шапка для плагина Dataview.\n\n"
        f"### Объём базы\n{counts_md}",
        "## Разделы\n"
        "- [[Суть истории]] — логлайн, синопсис, темы, влияния\n"
        "- [[Индекс — Персонажи]] — личные дела\n"
        "- [[Индекс — Мир]] — город, корпорации, фракции, технологии, карта\n"
        "- [[Индекс — Кодекс]] — импланты и арсенал\n"
        "- [[Индекс — Хроники]] — реконструкции событий\n"
        "- [[Индекс — Книги]] — тома и фрагменты\n"
        "- [[Индекс — Глоссарий]] — словарь мира\n"
        "- [[Таймлайн 2147]] · [[Календарь событий]]",
        "## Как пользоваться\n"
        "- Распакуйте архив в отдельную папку и откройте её в Obsidian: «Open folder as vault».\n"
        "- Вики-ссылки и вложения работают сразу; блоки ```dataview``` оживают после включения "
        "сторонних плагинов (Dataview) — без них индексы остаются обычными списками.\n"
        "- Арты лежат в `attachments/`; подписи под кадрами — из реестра галереи сайта.",
    ])
    REG.add("Главная", "00 Индекс/Главная.md",
            OrderedDict([("type", "home"), ("name", "Главная"), ("tags", ["MOC"])]), home)

    # ------------------------------------------------ 16. АВТОСВЯЗЫВАНИЕ + СВЯЗИ
    backlinks = {"character": "Индекс — Персонажи", "corporation": "Индекс — Мир",
                 "faction": "Индекс — Мир", "technology": "Индекс — Мир",
                 "weapon": "Индекс — Кодекс", "implant": "Индекс — Кодекс",
                 "book": "Индекс — Книги", "excerpt": "Индекс — Книги",
                 "chronicle": "Индекс — Хроники", "term": "Индекс — Глоссарий",
                 "world": "Индекс — Мир", "map": "Индекс — Мир",
                 "story": "Главная", "timeline": "Главная", "calendar": "Главная"}
    for note in REG.order:
        if note.front.get("type") in ("index", "home"):
            continue
        note.body = L(note.body, self_name=note.name)
        body_clean = re.sub(r"!?\[\[[^\]\n]*\]\]", "", note.body)
        body_clean = re.sub(r"@@LK:[^@]*@@", "", body_clean)
        found = sorted({t for t in re.findall(r"\[\[([^\]|#]+)", body_clean) if t != note.name})
        parts = []
        if found:
            parts.append("## Связи\n" + "\n".join(f"- [[{f}]]" for f in found))
        parts.append(f"← [[{backlinks.get(note.front.get('type'), 'Главная')}]]")
        note.body += "\n\n" + "\n\n".join(parts)

    # ------------------------------------------------ 17. ЗАПИСЬ
    for note in REG.order:
        if not note.rel_path:
            continue
        p = os.path.join(VAULT, note.rel_path)
        os.makedirs(os.path.dirname(p), exist_ok=True)
        open(p, "w", encoding="utf-8").write(fm(note.front) + "\n\n" + note.body.strip() + "\n")

    # ------------------------------------------------ 18. КАРТИНКИ + конфиг
    n_img = copy_images()
    os.makedirs(f"{VAULT}/.obsidian", exist_ok=True)
    json.dump({"attachmentFolderPath": ATTACH, "alwaysUpdateLinks": True,
               "newLinkFormat": "shortest", "useMarkdownLinks": False},
              open(f"{VAULT}/.obsidian/app.json", "w"), ensure_ascii=False, indent=1)

    # ------------------------------------------------ 19. ОТЧЁТ
    unresolved, missing_img = [], []
    all_files = [os.path.join(dp, f) for dp, _, fs in os.walk(VAULT) for f in fs]
    for note in REG.order:
        body_clean = re.sub(r"!?\[\[[^\]\n]*\]\]", "", note.body)
        for t in set(re.findall(r"\[\[([^\]|#]+)", body_clean)):
            if t not in REG.by_name:
                unresolved.append((note.name, t))
        for img in set(re.findall(r"!\[\[([^\]\n]+)\]\]", note.body)):
            if not any(f.endswith(img) for f in all_files):
                missing_img.append((note.name, img))
    n_notes = sum(1 for n in REG.order if n.rel_path)
    print(f"Заметок: {n_notes}; картинок скопировано: {n_img}")
    print(f"Неразрешённых ссылок: {len(unresolved)}; отсутствующих вложений: {len(missing_img)}")
    for a, b in unresolved[:20]:
        print(f"  ! link: {a} -> {b}")
    for a, b in missing_img[:10]:
        print(f"  ! img: {a} -> {b}")
    return 0 if not unresolved and not missing_img else 1

if __name__ == "__main__":
    sys.exit(main())
