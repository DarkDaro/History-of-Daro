/* Проверка NAV v3: контейнеры 7xl, короткая строка (4 ссылки),
   «Галерея»-кнопка, панель «Ещё» 2×2, мобильные группы,
   отсутствие горизонтального переполнения шапки. out/ с basePath. */
const { chromium } = require("playwright");

const BASE = "http://localhost:8901/History-of-Daro";
let fails = 0;
const ok = (cond, msg) => {
  console.log(`${cond ? "PASS" : "FAIL"}: ${msg}`);
  if (!cond) fails++;
};

(async () => {
  const browser = await chromium.launch();
  const errors = [];

  /* --- 1. Шапка без переполнения на всех десктопных ширинах --- */
  for (const w of [1024, 1102, 1280, 1536, 1920]) {
    const p = await browser.newPage({ viewport: { width: w, height: 900 } });
    p.on("pageerror", (e) => errors.push(String(e)));
    p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await p.goto(`${BASE}/`, { waitUntil: "networkidle" });
    const state = await p.evaluate(() => {
      const nav = document.querySelector("nav");
      return {
        overflow: nav.scrollWidth - nav.clientWidth,
        mainLinks: [...document.querySelectorAll("nav ul a")].map((a) =>
          a.textContent.trim()
        ),
        galleryVisible:
          [...document.querySelectorAll('nav a[href*="/gallery"]')].length > 0 &&
          [...document.querySelectorAll('nav a[href*="/gallery"]')][0].offsetParent !== null,
        moreVisible: [...document.querySelectorAll("nav button")].some((b) =>
          b.textContent.includes("Ещё")
        ),
        navWidth: nav.clientWidth,
      };
    });
    console.log(
      `W=${w}: overflow=${state.overflow}px nav=${state.navWidth}px main=[${state.mainLinks}] gallery=${state.galleryVisible} more=${state.moreVisible}`
    );
    ok(state.overflow <= 0, `W=${w}: шапка без переполнения`);
    ok(
      JSON.stringify(state.mainLinks) === JSON.stringify(["Книги", "Суть", "Мир", "Персонажи"]),
      `W=${w}: основная строка — 4 ссылки`
    );
    ok(state.galleryVisible, `W=${w}: кнопка «Галерея» видна`);
    ok(state.moreVisible, `W=${w}: кнопка «Ещё» видна`);
    await p.close();
  }

  /* --- 2. Панель «Ещё»: 4 группы, 10 ссылок --- */
  const d = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  d.on("pageerror", (e) => errors.push(String(e)));
  await d.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await d.locator('nav button:has-text("Ещё")').click();
  await d.waitForTimeout(350);
  const panel = await d.evaluate(() => {
    const content = document.querySelector('[data-slot="dropdown-menu-content"]');
    const links = [...content.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    const titles = [...content.querySelectorAll("p")].map((p) => p.textContent.trim());
    return { links, titles };
  });
  console.log("MORE_TITLES:", JSON.stringify(panel.titles));
  console.log("MORE_LINKS:", JSON.stringify(panel.links));
  ok(panel.titles.length === 4, "панель «Ещё»: 4 группы");
  ok(panel.links.length === 10, "панель «Ещё»: 10 ссылок");
  await d.screenshot({ path: "/tmp/render/nav-more-panel.png" });
  await d.keyboard.press("Escape");

  /* активное состояние «Ещё» на странице из панели (импланты) */
  await d.goto(`${BASE}/implants/`, { waitUntil: "networkidle" });
  const moreActive = await d.evaluate(() => {
    const b = [...document.querySelectorAll("nav button")].find((x) =>
      x.textContent.includes("Ещё")
    );
    return b ? b.getAttribute("data-active") : null;
  });
  ok(moreActive === "true", "«Ещё» подсвечена на /implants");

  /* контейнер контента: 1280 (7xl) */
  await d.goto(`${BASE}/gallery/`, { waitUntil: "networkidle" });
  const wrap = await d.evaluate(() => {
    const el = [...document.querySelectorAll("div")].find((x) =>
      x.className.includes("max-w-7xl")
    );
    return el ? el.className.includes("lg:px-8") : false;
  });
  ok(wrap, "контейнеры контента: max-w-7xl + lg:px-8");
  await d.screenshot({ path: "/tmp/render/nav-gallery-1280.png" });

  /* --- 3. Мобайл 390: группы + галерея первой, все 15 маршрутов --- */
  const ALL_ROUTES = [
    "/books","/excerpts","/story","/chronicles","/world","/corporations",
    "/characters","/author","/gallery","/implants","/armory","/map",
    "/timeline","/glossary","/support",
  ];
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await m.locator('button[aria-label="Открыть меню"]').click();
  await m.waitForTimeout(400);
  const mobile = await m.evaluate(() => {
    const header = document.querySelector("header");
    const hrefs = [...header.querySelectorAll("a")].map((a) =>
      a
        .getAttribute("href")
        .replace(/^.*\/History-of-Daro/, "")
        .replace(/\/$/, "")
    );
    const groups = [...header.querySelectorAll("p")].map((p) => p.textContent.trim());
    return { hrefs, groups };
  });
  ok(
    ALL_ROUTES.every((r) => mobile.hrefs.includes(r)),
    `мобильное меню покрывает все 15 маршрутов (нашло ${ALL_ROUTES.filter((r) => mobile.hrefs.includes(r)).length})`
  );
  const firstLink = mobile.hrefs.find((h) => h === "/gallery");
  ok(!!firstLink, "«Галерея» есть в мобильном меню");
  console.log("MOBILE_GROUPS:", JSON.stringify(mobile.groups));
  await m.screenshot({ path: "/tmp/render/nav-mobile-menu.png" });

  /* --- 4. Блоки «куда дальше» остаются на страницах --- */
  for (const p of ["story", "characters", "gallery"]) {
    await d.goto(`${BASE}/${p}/`, { waitUntil: "load" });
    const n = await d.evaluate(
      () =>
        document.querySelectorAll('section[aria-label="Перекрёстные ссылки: куда дальше"]')
          .length
    );
    ok(n >= 1, `перекрёстные ссылки на /${p}`);
  }

  console.log("CONSOLE_ERRORS:", errors.length ? errors.slice(0, 4) : "none");
  if (errors.length) fails++;
  console.log(fails === 0 ? "ALL NAV V3 CHECKS PASSED" : `FAILED: ${fails}`);
  await browser.close();
  process.exit(fails === 0 ? 0 : 1);
})();
