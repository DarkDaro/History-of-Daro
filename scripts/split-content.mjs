#!/usr/bin/env node
/* ============================================================
   B3 ROADMAP — одноразовое разделение src/lib/content.ts на
   модули src/content/*.ts. content.ts становится точкой входа
   (ре-экспорт), импорты по сайту (`@/lib/content`) не меняются.

   Как работает:
   1. Читает content.ts, находит все top-level декларации
      (export/const/interface/type/function на нулевом отступе)
      вместе с предшествующими комментариями.
   2. Сверяет найденную последовательность имён с эталонной
      картой ниже — при любом расхождении СТОП, ничего не пишет.
   3. Раскладывает декларации по модулям, сам генерирует
      импорты между модулями (типы — через `import { type X }`),
      пишет src/content/*.ts и перезаписывает content.ts барелом.
   4. Самопроверка: множество экспортов после разделения
      обязано совпасть с исходным.

   Запуск: node scripts/split-content.mjs
   ============================================================ */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(root, "src/lib/content.ts");
const OUT_DIR = join(root, "src/content");

/* ---------- Эталонная карта: модуль -> имена деклараций (по порядку файла) ---------- */

const MODULES = [
  { file: "shared", title: "Общий клей канона: акценты, basePath-ассеты, кадры-сцены", names: ["Accent", "BASE_PATH", "asset", "VISUALS"] },
  { file: "books", title: "Книги: томы трилогии и их акты", names: ["BookAct", "Book", "BOOKS"] },
  { file: "characters", title: "Персонажи: карточки кодекса", names: ["CodexEntry", "CHARACTER_SIDES", "CHARACTERS"] },
  { file: "corporations", title: "Корпорации и фракции", names: ["Faction", "CORPORATIONS", "FACTIONS", "RESISTANCE_GROUPS"] },
  { file: "dossier", title: "Досье: служебные файлы Хи-Мигаты", names: ["DossierFile", "corpFile", "DOSSIER_FILES"] },
  { file: "world", title: "Мир: счёт, устройство, техника, аномалии, быт", names: ["WORLD_STATS", "WorldSection", "WORLD_OVERVIEW", "TechEntry", "TECH", "ANOMALIES", "DAILY_LIFE"] },
  { file: "implants", title: "Импланты: карточки кодекса", names: ["IMPLANTS"] },
  { file: "weapons", title: "Оружие: карточки войны", names: ["Weapon", "WEAPONS"] },
  { file: "weapon-specs", title: "Оружие · канон-каталог: параметры и владельцы", names: ["WeaponSpec", "WEAPON_SPEC_GROUPS", "WEAPON_SPECS"] },
  { file: "chronicles", title: "Хроники: сцены и логи", names: ["ChronicleLogLine", "ChronicleScene", "Chronicle", "CHRONICLES"] },
  { file: "timeline", title: "Таймлайн: эры и события (акты Том II берутся из BOOKS)", names: ["TimelineEra", "TimelineEvent", "TIMELINE_ERAS", "t2Acts", "TIMELINE"] },
  { file: "story", title: "Суть истории: человечьи истории и влияния", names: ["HUMAN_STORIES", "INFLUENCES"] },
  { file: "synopsis", title: "Синопсис «Проект Восход»: логлайн, полный и краткий текст, темы, принципы, маркиза главной", names: ["SYNOPSIS_FULL", "SYNOPSIS_SHORT", "LOGLINE", "THEMES", "PRINCIPLES", "MARQUEE_ITEMS"] },
  { file: "excerpts", title: "Фрагменты: читалка (разделы, терминальные цитаты)", names: ["ExcerptSection", "Excerpt", "EXCERPTS"] },
  { file: "gallery", title: "Галерея: арты и кадры", names: ["GalleryItem", "GALLERY"] },
];

/* ---------- 1. Разбор исходника ---------- */

const src = readFileSync(SRC, "utf8");
const lines = src.split("\n");

const declRe = /^(?:export )?(?:const|interface|type|function)\s+(\w+)/;
const isComment = (l) => /^\s*(\/\*|\*|\/\/)/.test(l);
const isBlank = (l) => l.trim() === "";

const decls = []; // { name, exported, isType, start (0-based, с учётом комментариев), text }
for (let i = 0; i < lines.length; i++) {
  const m = declRe.exec(lines[i]);
  if (!m) continue;
  // Поднимаемся за комментариями (до пустой строки); шапку файла (/* === */) не забираем.
  let start = i;
  while (start > 0 && isComment(lines[start - 1])) start--;
  decls.push({ name: m[1], exported: /^export/.test(lines[i]), isType: /^(?:export )?(?:interface|type)\b/.test(lines[i]), start });
}
for (let i = 0; i < decls.length; i++) {
  const end = i + 1 < decls.length ? decls[i + 1].start : lines.length;
  let text = lines.slice(decls[i].start, end).join("\n").replace(/\n+$/, "");
  // Шапку файла (/* ==== ... */) не переносим — у барела будет своя.
  if (text.startsWith("/* =")) {
    text = text.slice(text.indexOf("*/") + 2).replace(/^\s+/, "");
  }
  decls[i].text = text;
}

/* ---------- 2. Сверка с эталоном ---------- */

const expected = MODULES.flatMap((mod) => mod.names);
const found = decls.map((d) => d.name);
if (JSON.stringify(expected) !== JSON.stringify(found)) {
  console.error("СТОП: карта модулей разошлась с файлом.");
  console.error("Ожидалось:", expected.join(", "));
  console.error("Найдено:  ", found.join(", "));
  process.exit(1);
}
console.log(`Деклараций найдено: ${found.length} — совпадает с картой.`);

/* ---------- 3. Раскладка по модулям ---------- */

const byName = new Map(decls.map((d) => [d.name, d]));
const nameToModule = new Map();
MODULES.forEach((mod) => mod.names.forEach((n) => nameToModule.set(n, mod.file)));

const isTypeName = (n) => byName.get(n).isType;

function importsFor(modFile, body) {
  const need = new Map(); // from -> Set<name>
  for (const [name, mod] of nameToModule) {
    if (mod === modFile) continue;
    if (!new RegExp(`\\b${name}\\b`).test(body)) continue;
    if (!need.has(mod)) need.set(mod, []);
    need.get(mod).push(isTypeName(name) ? `type ${name}` : name);
  }
  return [...need.entries()].map(([mod, names]) => `import { ${names.join(", ")} } from "./${mod}";`);
}

mkdirSync(OUT_DIR, { recursive: true });
for (const mod of MODULES) {
  const body = mod.names.map((n) => byName.get(n).text).join("\n\n");
  const imports = importsFor(mod.file, body);
  const head = `/* ============================================================\n   ИСТОРИЯ ДАРО — ${mod.title}.\n   Часть канона (B3): правь здесь, content.ts — только ре-экспорт.\n   ============================================================ */\n`;
  const fileText = `${head}\n${imports.length ? imports.join("\n") + "\n\n" : ""}${body}\n`;
  writeFileSync(join(OUT_DIR, `${mod.file}.ts`), fileText);
  console.log(`  src/content/${mod.file}.ts — ${mod.names.length} декл., ${fileText.split("\n").length} строк`);
}

/* ---------- 4. Барел src/lib/content.ts ---------- */

const barrel = `/* ============================================================
   ИСТОРИЯ ДАРО — канон вселенной: точка входа.
   Город — ХИ-МИГАТА. Даро — человек, которого нет в реестрах,
   но который числится на балансе. 2147 год · семь корпораций ·
   сопротивление «Периметр Зеро».
   Стиль текстов: деталь вместо объяснения, цена вместо лозунга.

   С 2026-11-02 (B3 ROADMAP) канон разбит на модули src/content/*.ts —
   этот файл остался ре-экспортом, чтобы все импорты по сайту
   (\`@/lib/content\`) работали как раньше. Правь контент в модулях —
   карта модулей в AUTHOR-GUIDE.md.
   ============================================================ */

${MODULES.map((m) => `export * from "@/content/${m.file}";`).join("\n")}
`;
writeFileSync(SRC, barrel);
console.log(`src/lib/content.ts — барел, ${MODULES.length} ре-экспортов`);

/* ---------- 5. Самопроверка полноты ---------- */

const origExports = new Set(decls.filter((d) => d.exported).map((d) => d.name));
const newExports = new Set();
for (const mod of MODULES) {
  const text = readFileSync(join(OUT_DIR, `${mod.file}.ts`), "utf8");
  const re = /^export (?:const|interface|type|function)\s+(\w+)/gm;
  let m;
  while ((m = re.exec(text)) !== null) newExports.add(m[1]);
}
const lost = [...origExports].filter((n) => !newExports.has(n));
const extra = [...newExports].filter((n) => !origExports.has(n));
if (lost.length || extra.length) {
  console.error("СТОП: расхождение экспортов!");
  if (lost.length) console.error("Потеряны:", lost.join(", "));
  if (extra.length) console.error("Лишние:", extra.join(", "));
  process.exit(1);
}
console.log(`Самопроверка: экспортов было ${origExports.size}, стало ${newExports.size} — полное совпадение.`);
