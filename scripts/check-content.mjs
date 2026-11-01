#!/usr/bin/env node
/* ============================================================
   Линтер контента «Истории Даро» (B1 ROADMAP).

   Что проверяет (без зависимостей, plain node):
   1. Уникальность slug внутри каждой секции канона — content.ts
      и модули src/content/*.ts (дубль = конфликт generateStaticParams
      и страниц).
   2. Все внутренние href из контента существуют как маршруты
      (статические папки src/app + динамические [slug],
      развёрнутые слагами из контента).
   3. Sitemap (src/app/sitemap.ts) покрывает те же маршруты —
      и не содержит лишних.

   Запуск: node scripts/check-content.mjs
   В CI: перед сборкой — падение ломает деплой ДО публикации.
   ============================================================ */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];

/* ---------- 1. Секции и слаги канона ---------- */

// Канон живёт в модулях src/content/*.ts (B3 ROADMAP), точка входа —
// src/lib/content.ts (ре-экспорт). Читаем всё текстом: линтер сознательно
// без зависимостей, plain node.
const canonFiles = ["src/lib/content.ts"];
try {
  canonFiles.push(
    ...readdirSync(join(root, "src/content"))
      .filter((f) => f.endsWith(".ts"))
      .sort()
      .map((f) => `src/content/${f}`)
  );
} catch {
  /* каталога src/content ещё нет — весь канон в content.ts */
}

const slugsBySection = new Map(); // name -> [{ slug, line, file }]
const hrefHits = []; // { href, line, file }

for (const relPath of canonFiles) {
  const contentSrc = readFileSync(join(root, relPath), "utf8");

  // Секции: идём по маркерам `export const NAME` и собираем slug внутри.
  const sectionRe = /export const (\w+)/g;
  const marks = [];
  let m;
  while ((m = sectionRe.exec(contentSrc)) !== null) {
    marks.push({ name: m[1], at: m.index });
  }
  for (let i = 0; i < marks.length; i++) {
    const from = marks[i].at;
    const to = i + 1 < marks.length ? marks[i + 1].at : contentSrc.length;
    const body = contentSrc.slice(from, to);
    const slugs = slugsBySection.get(marks[i].name) ?? [];
    const slugRe = /\bslug:\s*"([^"]+)"/g;
    let s;
    while ((s = slugRe.exec(body)) !== null) {
      slugs.push({
        slug: s[1],
        line: contentSrc.slice(0, from + s.index).split("\n").length,
        file: relPath,
      });
    }
    if (slugs.length) slugsBySection.set(marks[i].name, slugs);
  }

  // Внутренние href запоминаем с файлом и строкой (проверка в шаге 3).
  const hrefRe = /href:\s*"(\/[^"]*)"/g;
  let h;
  while ((h = hrefRe.exec(contentSrc)) !== null) {
    hrefHits.push({
      href: h[1],
      line: contentSrc.slice(0, h.index).split("\n").length,
      file: relPath,
    });
  }
}

for (const [name, slugs] of slugsBySection) {
  const seen = new Map();
  for (const { slug, line, file } of slugs) {
    if (seen.has(slug)) {
      errors.push(
        `${file}: дубль slug "${slug}" в секции ${name} (строки ${seen.get(slug)} и ${line})`
      );
    } else {
      seen.set(slug, line);
    }
  }
}

const allSlugs = new Set();
for (const slugs of slugsBySection.values()) {
  for (const { slug } of slugs) allSlugs.add(slug);
}

/* ---------- 2. Маршруты из src/app ---------- */

const appDir = join(root, "src/app");
const routes = new Set(["/"]);

// Динамический [slug] под папкой X разворачивается слагами секции X
// (папка excerpts → секция EXCERPTS из content.ts).
const slugsByFolder = new Map();
for (const [name, slugs] of slugsBySection) {
  slugsByFolder.set(
    name.toLowerCase(),
    slugs.map((s) => s.slug)
  );
}

const walk = (dir, prefix) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (!statSync(full).isDirectory()) continue;
    if (entry.startsWith("_") || entry.startsWith("api")) continue;
    if (entry.startsWith("[")) {
      // Динамический сегмент: разворачиваем слагами своей секции.
      if (existsSync(join(full, "page.tsx"))) {
        const parentKey = prefix.split("/").pop() ?? "";
        const slugs = slugsByFolder.get(parentKey) ?? [...allSlugs];
        for (const slug of slugs) routes.add(`${prefix}/${slug}`);
      }
      continue;
    }
    const route = `${prefix}/${entry}`;
    if (existsSync(join(full, "page.tsx"))) routes.add(route);
    walk(full, route);
  }
};
walk(appDir, "");

/* ---------- 3. Внутренние href из контента ---------- */

for (const { href, line, file } of hrefHits) {
  const target = href.split("#")[0] || "/";
  if (!routes.has(target)) {
    errors.push(
      `${file}: строка ${line} — href "${target}" не существует как маршрут (есть: ${[...routes].sort().join(", ")})`
    );
  }
}

/* ---------- 4. Sitemap ---------- */

const sitemapSrc = readFileSync(join(root, "src/app/sitemap.ts"), "utf8");
const pathRe = /path:\s*"([^"]*)"/g;
const sitemapPaths = new Set();
let p;
while ((p = pathRe.exec(sitemapSrc)) !== null) {
  sitemapPaths.add(p[1] === "" ? "/" : p[1]);
}
for (const path of sitemapPaths) {
  if (!routes.has(path)) {
    errors.push(`sitemap.ts: путь "${path}" не существует как маршрут`);
  }
}
for (const route of routes) {
  if (!sitemapPaths.has(route)) {
    warnings.push(`sitemap.ts: маршрут "${route}" не внесён в карту сайта`);
  }
}

/* ---------- Итог ---------- */

if (warnings.length) {
  for (const w of warnings) console.warn(`ПРЕДУПРЕЖДЕНИЕ: ${w}`);
}
if (errors.length) {
  for (const e of errors) console.error(`ОШИБКА: ${e}`);
  console.error(`\nЛинтер контента: ${errors.length} ошибок.`);
  process.exit(1);
}
console.log(
  `Линтер контента: OK — слагов ${allSlugs.size}, маршрутов ${routes.size}, sitemap ${sitemapPaths.size}.`
);
