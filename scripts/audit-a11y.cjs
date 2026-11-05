#!/usr/bin/env node
/* A11y-аудит axe-core: обходит все маршруты из sitemap локальной статики,
   инжектит axe и собирает нарушения по уровням серьёзности.
   Использование: node scripts/audit-a11y.cjs [baseUrl]
   Требует глобально установленный axe-core (npm i -g axe-core).        */
const { chromium } = require("/home/z/.npm-global/lib/node_modules/playwright/index.js");
const fs = require("fs");
const axeSource = fs.readFileSync(
  "/home/z/.npm-global/lib/node_modules/axe-core/axe.min.js",
  "utf8",
);

const BASE = process.argv[2] || "http://localhost:8901/History-of-Daro";
/* критичные уровни: серьёзные и критические чиним; moderate/minor — отчёт */
const HARD = new Set(["critical", "serious"]);

(async () => {
  const res = await fetch(`${BASE}/sitemap.xml`);
  const sm = await res.text();
  const routes = [...sm.matchAll(/<loc>[^<]*<\/loc>/g)]
    .map((m) => m[0].replace(/<\/?loc>/g, ""))
    .map((u) => new URL(u).pathname);

  const browser = await chromium.launch({
    executablePath:
      "/home/z/.cache/ms-playwright/chromium_headless_shell-1200/chrome-headless-shell-linux64/chrome-headless-shell",
  });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  const byRule = new Map(); // id -> {impact, title, nodes:Set, routes:Set, help}
  let hardTotal = 0;

  for (const r of routes) {
    const path = r.startsWith("/History-of-Daro") ? r.slice("/History-of-Daro".length) || "/" : r;
    await page.goto(`${BASE}${path}`, { waitUntil: "load", timeout: 60000 });
    await page.waitForTimeout(1200);
    const out = await page.evaluate(async (src) => {
      (0, eval)(src);
      const axe = window.axe;
      const r2 = await axe.run(document, {
        resultTypes: ["violations"],
        rules: { region: { enabled: false } },
      });
      return r2.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        title: v.help,
        nodes: v.nodes.map((n) => (n.target || []).join(" ") || n.html?.slice(0, 80) || "?"),
      }));
    }, axeSource);

    for (const v of out) {
      if (!byRule.has(v.id)) byRule.set(v.id, { impact: v.impact, title: v.title, nodes: new Set(), routes: new Set() });
      const e = byRule.get(v.id);
      e.routes.add(path);
      for (const n of v.nodes.slice(0, 5)) e.nodes.add(n);
      if (HARD.has(v.impact)) hardTotal += 1;
    }
    process.stdout.write(`ok ${path} (${out.length})\n`);
  }

  await browser.close();

  console.log("\n=== AXE СВОДКА (24 маршрута) ===");
  const list = [...byRule.entries()].sort((a, b) => {
    const rank = { critical: 0, serious: 1, moderate: 2, minor: 3 };
    return (rank[a[1].impact] ?? 9) - (rank[b[1].impact] ?? 9);
  });
  for (const [id, e] of list) {
    console.log(`\n[${e.impact || "?".toUpperCase()}] ${id} — ${e.title}`);
    console.log(`  маршруты (${e.routes.size}): ${[...e.routes].slice(0, 6).join(", ")}${e.routes.size > 6 ? "…" : ""}`);
    for (const n of [...e.nodes].slice(0, 4)) console.log(`  · ${n.slice(0, 120)}`);
  }
  const hard = [...byRule.values()].filter((e) => HARD.has(e.impact));
  console.log(`\nВсего правил с нарушениями: ${byRule.size}; из них serious/critical: ${hard.length}`);
  process.exit(hard.length ? 1 : 0);
})().catch((e) => {
  console.error("CRASH", e);
  process.exit(2);
});
