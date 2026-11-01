#!/usr/bin/env node
/**
 * Дымовой тест статической сборки (п.12.2 №11).
 * Запуск ПОСЛЕ `npm run build:static`:
 *   npm run smoke
 *
 * Что проверяет для каждого маршрута из src/app/sitemap.ts:
 *   1) файл out/<путь>/index.html существует и не пустой;
 *   2) внутри есть шапка (лого «ДАРО») и футер («дождь не заканчивается»);
 *   3) в тексте страницы нет «undefined»/«NaN» в видимых узлах
 *      (проверяем в <body> без <script>, чтобы не ловить бандлы).
 *
 * Код возврата: 0 — всё ок, 1 — есть провалы (CI остановится).
 * Зависимостей не требует: только node >= 18.
 */

import { readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const NAV_MARKER = "ДАРО";
const FOOTER_MARKER = "дождь не заканчивается";

/** Маршруты берём из sitemap.ts — единый источник правды с сайтом. */
function routesFromSitemap() {
  const src = readFileSync("src/app/sitemap.ts", "utf8");
  const paths = [...src.matchAll(/path:\s*"([^"]*)"/g)].map((m) => m[1]);
  if (paths.length === 0) throw new Error("не удалось прочитать маршруты из src/app/sitemap.ts");
  return paths;
}

/** Убрать <script>…</script> и <style>…</style>, вернуть только текст body. */
function visibleText(html) {
  const body = html.slice(html.indexOf("<body"));
  return body
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ");
}

let failed = 0;
const rows = [];

for (const route of routesFromSitemap()) {
  const dir = route === "" ? "" : route;
  const file = join(OUT, dir, "index.html");
  const label = route === "" ? "/" : route;

  if (!existsSync(file)) {
    rows.push([label, "НЕТ ФАЙЛА", file]);
    failed += 1;
    continue;
  }
  const html = readFileSync(file, "utf8");
  if (statSync(file).size < 1000) {
    rows.push([label, "ПОЧТИ ПУСТОЙ", `${statSync(file).size} байт`]);
    failed += 1;
    continue;
  }
  const problems = [];
  if (!html.includes(NAV_MARKER)) problems.push("нет шапки");
  if (!html.includes(FOOTER_MARKER)) problems.push("нет футера");
  const text = visibleText(html);
  if (/\bundefined\b/.test(text)) problems.push("«undefined» в тексте");
  if (/\bNaN\b/.test(text)) problems.push("«NaN» в тексте");

  if (problems.length > 0) {
    rows.push([label, "ПРОВАЛ", problems.join(", ")]);
    failed += 1;
  } else {
    rows.push([label, "ok", `${Math.round(statSync(file).size / 1024)} КБ`]);
  }
}

// Проверка служебных файлов статического сайта
for (const extra of ["sitemap.xml", "robots.txt", "manifest.webmanifest"]) {
  const ok = existsSync(join(OUT, extra));
  rows.push([`/${extra}`, ok ? "ok" : "НЕТ ФАЙЛА", ""]);
  if (!ok) failed += 1;
}

const pad = Math.max(...rows.map((r) => r[0].length));
for (const [route, status, note] of rows) {
  console.log(`${route.padEnd(pad)}  ${status.padEnd(11)} ${note}`);
}

console.log(failed === 0 ? `\nSMOKE OK — ${rows.length} проверок пройдено` : `\nSMOKE FAIL — провалено: ${failed}`);
process.exit(failed === 0 ? 0 : 1);
