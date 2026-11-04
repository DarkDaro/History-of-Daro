#!/usr/bin/env node
/* Firefox-прогон: обходит все маршруты из sitemap локальной статики
   на втором движке (Firefox), собирает console/pageerror/failed requests,
   проверяет горизонтальное переполнение на 390px.
   Использование: node scripts/audit-firefox.cjs [baseUrl]            */
const { firefox } = require("/home/z/.npm-global/lib/node_modules/playwright/index.js");

const BASE = process.argv[2] || "http://localhost:8901/History-of-Daro";

(async () => {
  const res = await fetch(`${BASE}/sitemap.xml`);
  const sm = await res.text();
  const routes = [...sm.matchAll(/<loc>[^<]*<\/loc>/g)]
    .map((m) => m[0].replace(/<\/?loc>/g, ""))
    .map((u) => new URL(u).pathname);

  const browser = await firefox.launch({ headless: true });
  const pageErrors = [];
  const failedReqs = [];
  const overflows = [];
  const slow = [];

  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") pageErrors.push([page.url(), m.text().slice(0, 160)]);
  });
  page.on("pageerror", (e) => pageErrors.push([page.url(), "PAGEERROR " + String(e).slice(0, 160)]));
  page.on("requestfailed", (r) => {
    /* NS_BINDING_ABORTED/ERR_ABORTED — отменённые префетчи при уходе
       со страницы; это нормальное поведение навигации, не падение. */
    const t = r.failure()?.errorText || "";
    if (t.includes("ABORTED")) return;
    failedReqs.push([r.url().slice(-90), t]);
  });

  for (const r of routes) {
    const path = r.startsWith("/History-of-Daro") ? r.slice("/History-of-Daro".length) || "/" : r;
    const t0 = Date.now();
    await page.goto(`${BASE}${path}`, { waitUntil: "load", timeout: 60000 });
    await page.waitForTimeout(400);
    const ms = Date.now() - t0;
    if (ms > 3000) slow.push([path, ms]);
    /* мобильное переполнение */
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    const ov = await page.evaluate(() => {
      const d = document.documentElement;
      return d.scrollWidth - d.clientWidth > 2 ? d.scrollWidth : 0;
    });
    if (ov) overflows.push([path, ov]);
    await page.setViewportSize({ width: 1280, height: 900 });
    console.log(`ok ${path} (${ms} мс)`);
  }

  await browser.close();

  console.log("\n=== FIREFOX СВОДКА ===");
  console.log(`маршрутов: ${routes.length}`);
  console.log(`консоль/ошибки страницы: ${pageErrors.length}`);
  for (const [u, t] of pageErrors.slice(0, 10)) console.log(`  ${u.slice(-60)} :: ${t}`);
  console.log(`упавших запросов: ${failedReqs.length}`);
  for (const [u, t] of failedReqs.slice(0, 10)) console.log(`  ${u} :: ${t}`);
  console.log(`переполнений 390px: ${overflows.length}`);
  for (const [p, w] of overflows) console.log(`  ${p}: scrollWidth=${w}`);
  console.log(`медленных (>3 c): ${slow.length}`);
  for (const [p, ms] of slow) console.log(`  ${p}: ${ms} мс`);
  const fail = pageErrors.length + failedReqs.length + overflows.length;
  console.log(fail ? `\nFIREFOX AUDIT FAIL — проблем: ${fail}` : "\nFIREFOX AUDIT OK");
  process.exit(fail ? 1 : 0);
})().catch((e) => {
  console.error("CRASH", e);
  process.exit(2);
});
