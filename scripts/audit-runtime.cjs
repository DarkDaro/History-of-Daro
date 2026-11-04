/* Проба прочности: обходит все маршруты из sitemap локальной статики,
   собирает console errors, упавшие запросы, вес страниц, время загрузки,
   проверяет мобильное переполнение (390px). Плюс интерактивные пробы.
   Использование: node scripts/audit-runtime.mjs [baseUrl]      */
const { chromium } = require("/home/z/.npm-global/lib/node_modules/playwright/index.js");

const BASE = process.argv[2] || "http://localhost:8901/History-of-Daro";

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

  const pageErrors = [];
  const failedReqs = [];
  const rows = [];

  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") pageErrors.push([page.url(), m.text().slice(0, 160)]);
  });
  page.on("pageerror", (e) => pageErrors.push([page.url(), "PAGEERROR " + String(e).slice(0, 160)]));
  page.on("requestfailed", (r) =>
    failedReqs.push([r.url().slice(-90), r.failure()?.errorText])
  );

  for (const r of routes) {
    /* sitemap отдаёт полные пути с basePath — убираем, чтобы не задвоить */
    const path = r.startsWith("/History-of-Daro")
      ? r.slice("/History-of-Daro".length) || "/"
      : r;
    const t0 = Date.now();
    const resp = await page.goto(`${BASE}${path === "/" ? "/" : path}`, { waitUntil: "networkidle", timeout: 30000 });
    const dt = Date.now() - t0;
    let weight = 0;
    page.on("response", (rp) => {
      const h = rp.headers()["content-length"];
      if (h) weight += parseInt(h, 10);
    });
    const status = resp ? resp.status() : 0;
    // мобильное переполнение на этом же маршруте — отдельный контекст-страница
    rows.push([r, status, dt, weight]);
  }

  /* мобильная проба: 390x844, переполнение по X на каждом маршруте */
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mpage = await mctx.newPage();
  const overflow = [];
  for (const r of routes) {
    const path = r.startsWith("/History-of-Daro") ? r.slice("/History-of-Daro".length) || "/" : r;
    await mpage.goto(`${BASE}${path === "/" ? "/" : path}`, { waitUntil: "load", timeout: 30000 });
    await mpage.waitForTimeout(400);
    const bad = await mpage.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    if (bad > 1) overflow.push([r, bad]);
  }

  /* интерактивные пробы */
  const inter = [];
  // 1. поиск Ctrl+K
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.keyboard.press("Control+KeyK").catch(() => {});
  await page.waitForTimeout(500);
  const searchVisible = await page.evaluate(() => !!document.querySelector("[role=dialog], input[type=search], input"));
  if (!searchVisible) {
    // возможно поиск по кнопке
    const btn = await page.$('button[aria-label*="поиск" i], button[aria-label*="Поиск" i]');
    if (btn) { await btn.click(); await page.waitForTimeout(400); }
  }
  const dialog = await page.$("[role=dialog] input, input");
  if (dialog) {
    await dialog.type("Даро");
    await page.waitForTimeout(700);
    const found = await page.$$eval("[role=dialog] a, [role=listbox] a, [cmdk-item]", (els) => els.length).catch(() => 0);
    inter.push(["поиск Ctrl+K", `результатов: ${found}`]);
    await page.keyboard.press("Escape");
  } else inter.push(["поиск Ctrl+K", "ДИАЛОГ НЕ НАЙДЕН"]);
  // 2. кнопка «Случайный фрагмент»
  await page.goto(`${BASE}/excerpts`, { waitUntil: "networkidle" });
  const rnd = await page.$('button[aria-label*="случайн" i], button[aria-label*="Случайн" i]');
  inter.push(["случайный фрагмент", rnd ? "кнопка есть" : "КНОПКИ НЕТ"]);
  // 3. фильтры персонажей
  await page.goto(`${BASE}/characters`, { waitUntil: "networkidle" });
  const chips = await page.$$eval("button[aria-pressed]", (els) => els.length);
  inter.push(["фильтры персонажей", `чипов: ${chips}`]);
  // 4. карта: маркеры
  await page.goto(`${BASE}/map`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const markers = await page.$$eval(".cm-marker, [class*=marker]", (els) => els.length);
  inter.push(["карта: маркеры", `${markers}`]);

  console.log("== страницы: маршрут | HTTP | мс загрузка ==");
  for (const [r, s, dt, w] of rows) console.log(`  ${r} | ${s} | ${dt}мс`);
  console.log(`== консольные ошибки: ${pageErrors.length}`);
  for (const [u, t] of pageErrors.slice(0, 15)) console.log(`  ${u} :: ${t}`);
  console.log(`== упавших запросов: ${failedReqs.length}`);
  for (const [u, t] of failedReqs.slice(0, 15)) console.log(`  ${u} :: ${t}`);
  console.log(`== мобильное переполнение (390px): ${overflow.length}`);
  for (const [r, px] of overflow) console.log(`  ${r} +${px}px`);
  console.log("== интерактив ==");
  for (const [k, v] of inter) console.log(`  ${k}: ${v}`);

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
