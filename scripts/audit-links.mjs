#!/usr/bin/env node
/* Краулер статики out/: проверяет все внутренние href на всех
   маршрутах (по sitemap.xml + главная) и существование якорей.
   Использование: node scripts/audit-links.mjs            */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";

const ROOT = resolve("out");
const BASE = "/History-of-Daro"; // basePath Pages

/* строгий Pages-режим: REQUIRE_BASE=1 — каждый абсолютный href обязан
   нести префикс BASE (ловит непрефиксованные ссылки Next-метаданных) */
const REQUIRE_BASE = process.env.REQUIRE_BASE === "1";
const noBase = (raw) =>
  REQUIRE_BASE && raw.startsWith("/") && !raw.startsWith(BASE)
    ? `БЕЗ БАЗЫ (${BASE})`
    : null;

const sitemap = readFileSync(join(ROOT, "sitemap.xml"), "utf8");
const routes = [...sitemap.matchAll(/<loc>[^<]*<\/loc>/g)]
  .map((m) => m[0].replace(/<\/?loc>/g, ""))
  .map((u) => {
    try { return new URL(u).pathname.replace(new RegExp(`^${BASE}(?=/|$)`), "") || "/"; }
    catch { return u; }
  });
const pages = [...new Set([...routes, "/"])];

const htmlOf = (route) => {
  const p = join(ROOT, route.replace(/^\//, ""), "index.html");
  if (!existsSync(p)) return null;
  return readFileSync(p, "utf8");
};

/* внутренние ссылки: href="/..." и href="#..." (в статике Next пишет /History-of-Daro/...) */
const broken = [];
const anchorsBroken = [];
let linksTotal = 0;

for (const route of pages) {
  const html = htmlOf(route);
  if (html == null) {
    broken.push([route, "(САМА СТРАНИЦА НЕ НАЙДЕНА)"]);
    continue;
  }
  /* только DOM-ссылки (<a href="...">) — RSC-payload в <script> не трогаем */
  const hrefs = [...html.matchAll(/<a\s[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  for (const raw of hrefs) {
    if (raw.startsWith("mailto:") || raw.startsWith("tel:")) continue;
    if (/^https?:\/\//.test(raw)) continue; // внешние не проверяем здесь
    if (raw.startsWith("data:")) continue;
    linksTotal++;
    if (raw.startsWith("#")) {
      // якорь на той же странице
      const id = raw.slice(1);
      if (!new RegExp(`id="${id}"`).test(html)) anchorsBroken.push([route, raw]);
      continue;
    }
    // внутренний путь, возможно с якорем
    const [path, hash] = raw.split("#");
    const nb = noBase(path);
    if (nb) {
      broken.push([route, `${raw} — ${nb}`]);
      continue;
    }
    const rel = path.startsWith(BASE) ? path.slice(BASE.length) || "/" : path;
    const targetFile =
      rel === "/" ? join(ROOT, "index.html") : join(ROOT, rel.replace(/^\//, ""));
    const fileExists =
      existsSync(targetFile) ||
      existsSync(targetFile + ".html") ||
      existsSync(join(targetFile, "index.html"));
    if (!fileExists) {
      broken.push([route, raw]);
      continue;
    }
    if (hash) {
      const html2 = existsSync(join(targetFile, "index.html"))
        ? readFileSync(join(targetFile, "index.html"), "utf8")
        : readFileSync(existsSync(targetFile) ? targetFile : targetFile + ".html", "utf8");
      if (!new RegExp(`id="${hash}"`).test(html2)) anchorsBroken.push([route, raw]);
    }
  }
}

/* также проверим маршруты, существующие в out/, но отсутствующие в sitemap */
const knownDirs = new Set(pages.map((r) => r.replace(/^\//, "").replace(/\/$/, "")));
const extraRoutes = [];
for (const entry of readdirSync(ROOT)) {
  const st = statSync(join(ROOT, entry));
  if (st.isDirectory() && !["__next", "_next", "api", "assets", "covers", "icons", "img", "wallpapers", "releases"].includes(entry) && !knownDirs.has(entry)) {
    if (existsSync(join(ROOT, entry, "index.html"))) extraRoutes.push("/" + entry);
  }
}

console.log(`страниц пройдено: ${pages.length}, внутренних ссылок: ${linksTotal}`);
console.log(`битых ссылок: ${broken.length}`);
for (const [from, to] of broken) console.log(`  БИТ ${from} -> ${to}`);
console.log(`битых якорей: ${anchorsBroken.length}`);
for (const [from, to] of anchorsBroken) console.log(`  ЯКОРЬ ${from} -> ${to}`);
/* также проверяем <link rel="icon|apple-touch-icon|manifest"> —
   их Next не всегда префиксует basePath'ом (баг 2026-11-04) */
let linkTagsBroken = 0;
for (const route of pages) {
  const html = htmlOf(route);
  if (html == null) continue;
  const tags = [...html.matchAll(/<link[^>]*rel="(icon|apple-touch-icon|manifest)"[^>]*>/g)].map((m) => m[0]);
  for (const tag of tags) {
    const href = (tag.match(/href="([^"]+)"/) || [])[1];
    if (!href || /^https?:/.test(href) || href.startsWith("data:")) continue;
    if (href.startsWith("#")) continue;
    const [path] = href.split("#");
    const nb = noBase(path);
    if (nb) {
      linkTagsBroken++;
      console.log(`  LINK ${route} -> ${href} (${nb})`);
      continue;
    }
    const rel = path.startsWith(BASE) ? path.slice(BASE.length) : path;
    const f =
      rel === "/" ? join(ROOT, "index.html") : join(ROOT, rel.replace(/^\//, "").split("?")[0]);
    if (!existsSync(f)) {
      linkTagsBroken++;
      console.log(`  LINK ${route} -> ${href} (файла нет)`);
    }
  }
}

console.log(`маршрутов вне sitemap: ${extraRoutes.length}`);
for (const r of extraRoutes) console.log(`  ВНЕ SITEMAP: ${r}`);
console.log(`битых <link>-иконок/манифестов: ${linkTagsBroken}`);

/* код возврата: битые ссылки/якоря/иконки — провал (CI остановится);
   «вне sitemap» — только предупреждение (линтер контента подскажет) */
const failedTotal = broken.length + anchorsBroken.length + linkTagsBroken;
if (failedTotal > 0) {
  console.log(`\nAUDIT FAIL — проблем: ${failedTotal}`);
  process.exit(1);
}
console.log(`\nAUDIT OK — ${linksTotal} внутренних ссылок, ${pages.length} страниц`);
