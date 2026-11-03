import {
  ANOMALIES,
  BOOKS,
  CHRONICLES,
  CHARACTERS,
  CORPORATIONS,
  DAILY_LIFE,
  EXCERPTS,
  FACTIONS,
  GLOSSARY,
  MAP_CATEGORIES,
  MAP_POINTS,
  HUMAN_STORIES,
  IMPLANTS,
  TECH,
  TIMELINE,
  TIMELINE_ERAS,
  WEAPONS,
  WEAPON_SPECS,
  WORLD_OVERVIEW,
  type Accent,
} from "@/lib/content";

/* ============================================================
   Индекс поиска (Ctrl+K): плоский список записей, собранный из
   content.ts на сборке. Клиент получает готовый массив —
   Fuse.js ищет по title / keywords / text.
   ============================================================ */

export interface SearchRecord {
  id: string;
  title: string;
  /** Метка раздела в результатах: «Мир», «Книги», «Персонажи»… */
  section: string;
  /** Дополнительные ключи: коды, роли, теги, имена. */
  keywords: string;
  text: string;
  href: string;
  accent: Accent;
}

function rec(
  id: string,
  title: string,
  section: string,
  keywords: string,
  text: string,
  href: string,
  accent: Accent,
): SearchRecord {
  return { id, title, section, keywords, text, href, accent };
}

export const SEARCH_INDEX: SearchRecord[] = [
  // Разделы
  rec("PG-HOME", "Главная — История Даро", "Разделы", "цикл романов трилогия начало", "Цикл о городе Хи-Мигате, семи корпорациях и активе, который научился уходить с баланса.", "/", "cyan"),
  rec("PG-BOOKS", "Книги — три тома цикла", "Разделы", "тома красный сдвиг стеклянные небеса пепел и неон анонс синопсис", "Три тома: «Красный сдвиг», «Стеклянные небеса», «Пепел и неон». Анонс цикла — текст автора.", "/books", "cyan"),
  rec("PG-EXCERPTS", "Фрагменты — читалка", "Разделы", "эпизоды выдержки читать архив", "Выдержки из трёх томов: эпизоды, перехваченные сопротивлением.", "/excerpts", "cyan"),
  rec("PG-WORLD", "Мир: Хи-Мигата", "Разделы", "город корпорации досье купола", "Интерактивное досье: город и семь корпораций — файлы, активы, перехваты.", "/world", "cyan"),
  rec("PG-CORPS", "Корпорации — реестр консорциума", "Разделы", "организации корпорации консорциум технодоминус хи-гама бергинатор синтез спектр исток купол", "Семь корпораций Хи-Мигаты: монополии, методы и следы, которые они оставили в городе.", "/corporations", "magenta"),
  rec("PG-CHARACTERS", "Персонажи — личные дела", "Разделы", "герои досье карточки рейден утилизатор винс максимус", "Личные дела: Николас и Даро, Лина, Айя, Немезида, Охотник, Райден, Утилизатор, Винс, Максимус и антагонисты.", "/characters", "magenta"),
  rec("PG-GALLERY", "Галерея — арты мира", "Разделы", "галерея арты картинки портреты сцены обложки визуальный архив", "Визуальный архив Хи-Мигаты: сцены города, портреты героев и обложки томов — с подписями из канона.", "/gallery", "cyan"),
  rec("PG-IMPLANTS", "Импланты — каталог", "Разделы", "импланты память мнемокассета кодексы", "Каталог имплантов «Синтеза» и чёрного рынка.", "/implants", "magenta"),
  rec("PG-ARMORY", "Вооружение — арсенал", "Разделы", "оружие катана эми винтовки владельцы рельсотрон рейден лук", "Арсенал обеих сторон: от катаны Даро до армад машин Скорпиона. Канон-каталог: оружие и владельцы.", "/armory", "amber"),
  rec("PG-CHRONICLES", "Хроники — архив", "Разделы", "хроники записи флешбек", "Восстановленные записи города: хроника побега и охоты за ответами.", "/chronicles", "cyan"),
  rec("PG-TIMELINE", "Таймлайн 2147", "Разделы", "хронология события время года", "Хронология событий: от Перелома до засекреченного финала.", "/timeline", "cyan"),
  rec("PG-STORY", "Суть истории", "Разделы", "синопсис проект восход логлайн темы принципы повествования человеческие истории", "Полный синопсис «Проекта Восход», логлайн и темы цикла.", "/story", "magenta"),
  rec("PG-GLOSSARY", "Глоссарий — словарь мира", "Разделы", "глоссарий словарь термины лексикон язык города определения", "Словарь мира «Истории Даро»: общий язык жанра, переосмысленные понятия, собственные термины Хи-Мигаты, проекты и протоколы.", "/glossary", "cyan"),
  rec("PG-MAP", "Карта Хи-Мигаты", "Разделы", "карта города схема ярусы купола доки объекты план", "Тактическая схема Хи-Мигаты: ярусы, штабы корпораций, доки, «Периметр Зеро» и скрытые объекты подземки — с досье каждой точки.", "/map", "cyan"),
  rec("PG-AUTHOR", "Автор", "Разделы", "автор аноним писатель", "Страница автора цикла «История Даро».", "/author", "amber"),

  // Книги
  ...BOOKS.map((b) =>
    rec(
      `BK-${b.slug}`,
      `${b.volume} · «${b.title}»`,
      "Книги",
      `${b.code} ${b.tags.join(" ")} ${b.facts.map((f) => f.value).join(" ")}`,
      b.logline,
      `/books/${b.slug}`,
      b.accent,
    ),
  ),

  // Фрагменты
  ...EXCERPTS.map((e) => {
    const b = BOOKS.find((x) => x.slug === e.bookSlug);
    return rec(
      `EX-${e.slug}`,
      e.title,
      "Фрагменты",
      `${e.label} ${e.time} ${e.place} ${e.tags.join(" ")} ${b ? b.title : ""}`,
      e.lead,
      `/excerpts/${e.slug}`,
      e.accent,
    );
  }),

  // Персонажи (якоря: /characters#<id> открывает личное дело)
  ...CHARACTERS.map((c) =>
    rec(`CH-${c.id}`, c.name, "Персонажи", `${c.id} ${c.tag} ${c.role}`, c.text, `/characters#${c.id}`, c.accent),
  ),

  // Мир: корпорации, фракции, технологии, аномалии, повседневность
  ...CORPORATIONS.map((c) => rec(`CO-${c.id}`, c.name, "Корпорации", `${c.id} ${c.tag} ${c.role} корпорация организация консорциум`, c.text, "/corporations", c.accent)),
  ...FACTIONS.map((f) => rec(`FA-${f.id}`, f.name, "Мир", `${f.id} ${f.tag} ${f.role} фракция`, f.text, "/world", f.accent)),
  ...TECH.map((t) => rec(`TE-${t.id}`, t.name, "Мир", `${t.id} ${t.tag} ${t.role} технология`, t.text, "/world", t.accent)),
  ...ANOMALIES.map((a) => rec(`AN-${a.id}`, a.name, "Мир", `${a.id} ${a.tag} ${a.role} аномалия`, a.text, "/world", a.accent)),
  ...WORLD_OVERVIEW.map((w, i) => rec(`WO-${i}`, w.title, "Мир", `${w.year} обзор`, w.text, "/world", w.accent)),
  ...DAILY_LIFE.map((d, i) => rec(`DL-${i}`, d.title, "Мир", "повседневность город быт", d.text, "/world", d.accent)),

  // Импланты и вооружение
  ...IMPLANTS.map((m) => rec(`IM-${m.id}`, m.name, "Импланты", `${m.id} ${m.tag} ${m.role}`, m.text, "/implants", m.accent)),
  ...WEAPONS.map((w) => rec(`WP-${w.id}`, w.name, "Вооружение", `${w.id} ${w.tag} ${w.role} ${w.side === "resistance" ? "сопротивление" : "корпорации"}`, w.text, "/armory", w.accent)),
  ...WEAPON_SPECS.map((w) => rec(`WS-${w.name}`, w.name, "Арсенал", `${w.owner} ${w.kind} ${w.group} параметры`, `${w.kind}. Владелец: ${w.owner}.`, "/armory", w.accent)),

  // Хроники
  ...CHRONICLES.map((c) =>
    rec(
      `CR-${c.slug}`,
      `${c.code} · ${c.title}`,
      "Хроники",
      `${c.subtitle} ${c.tags.join(" ")} ${c.sourceLabel}`,
      c.lead,
      `/chronicles/${c.slug}`,
      c.accent,
    ),
  ),

  // Таймлайн
  ...TIMELINE.map((t) => {
    const era = TIMELINE_ERAS.find((e) => e.id === t.era);
    return rec(`TL-${t.id}`, t.title, "Таймлайн", `${t.when} ${era ? era.label : ""}`, t.text, "/timeline", t.accent);
  }),

  // Суть истории
  ...HUMAN_STORIES.map((h, i) => rec(`HS-${i}`, h.title, "Суть", "человеческие истории герои", h.text, "/story", h.accent)),

  // Карта города: досье объектов схемы
  ...MAP_POINTS.map((m) =>
    rec(
      `MP-${m.id}`,
      m.name,
      "Карта",
      `${m.id} ${MAP_CATEGORIES.find((c) => c.id === m.category)?.label ?? ""} карта хи-мигата объект`,
      m.text,
      "/map",
      m.category === "city" ? "amber" : m.category === "resistance" ? "cyan" : m.category === "hidden" ? "magenta" : "cyan",
    ),
  ),

  // Глоссарий: якорь каждой карточки — /glossary#<id>
  ...GLOSSARY.flatMap((level) =>
    level.entries.map((e) =>
      rec(
        `GL-${e.id}`,
        e.term,
        "Глоссарий",
        `${e.kind ?? ""} ${(e.aliases ?? []).join(" ")} ${level.title}`,
        e.text,
        `/glossary#${e.id}`,
        e.accent,
      ),
    ),
  ),
];
