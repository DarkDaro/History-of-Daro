/* Проверка NAV v2: кнопка «Галерея», dropdown «Ещё», мобильные группы,
   перекрёстные блоки «куда дальше». out/ с basePath. */
const { chromium } = require("playwright");

const BASE = "http://localhost:8901/History-of-Daro";

(async () => {
  const browser = await chromium.launch();
  const errors = [];

  /* --- 1. Десктоп 1280: кнопка «Галерея» --- */
  const d = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  d.on("pageerror", (e) => errors.push(String(e)));
  d.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await d.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const gal = d.locator('nav a[href*="/gallery"]').first();
  const galBox = await gal.boundingBox();
  const galStyle = await gal.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { color: cs.color, border: cs.borderColor, text: el.textContent.trim() };
  });
  console.log("GALLERY_BTN:", JSON.stringify(galStyle), "box:", !!galBox);
  // горизонтальный переполнение шапки?
  const overflow = await d.evaluate(
    () => document.querySelector("nav").scrollWidth - document.querySelector("nav").clientWidth
  );
  console.log("NAV_OVERFLOW_1280:", overflow, "px");
  // dropdown «Ещё»
  await d.locator('nav button:has-text("Ещё")').click();
  await d.waitForTimeout(300);
  const extra = await d.evaluate(() =>
    [...document.querySelectorAll('[data-slot="dropdown-menu-content"] a')].map((a) =>
      a.getAttribute("href")
    )
  );
  console.log("DROPDOWN_ITEMS:", JSON.stringify(extra));
  await d.screenshot({ path: "/tmp/render/nav-home-desktop.png" });
  // активное состояние на /gallery
  await d.goto(`${BASE}/gallery/`, { waitUntil: "networkidle" });
  const galActive = await d
    .locator('nav a[href*="/gallery"]')
    .first()
    .evaluate((el) => el.getAttribute("data-active"));
  console.log("GALLERY_ACTIVE_ON_GALLERY:", galActive);

  /* --- 2. lg 1024: Импланты/Вооружение скрыты в строке, «Ещё» есть --- */
  const lg = await browser.newPage({ viewport: { width: 1024, height: 800 } });
  await lg.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const lgState = await lg.evaluate(() => {
    const links = [...document.querySelectorAll("nav ul a")].map((a) => ({
      t: a.textContent.trim(),
      hidden: a.closest("li").offsetParent === null,
    }));
    const overflow = document.querySelector("nav").scrollWidth - document.querySelector("nav").clientWidth;
    return { links, overflow };
  });
  console.log("LG_HIDDEN:", JSON.stringify(lgState.links.filter((l) => l.hidden)));
  console.log("NAV_OVERFLOW_1024:", lgState.overflow, "px");
  await lg.screenshot({ path: "/tmp/render/nav-home-lg.png" });

  /* --- 2b. xl 1280 и 2xl 1536: переполнение строки --- */
  for (const w of [1280, 1536]) {
    const p2 = await browser.newPage({ viewport: { width: w, height: 900 } });
    await p2.goto(`${BASE}/`, { waitUntil: "networkidle" });
    const ov = await p2.evaluate(
      () => document.querySelector("nav").scrollWidth - document.querySelector("nav").clientWidth
    );
    const visible = await p2.evaluate(() =>
      [...document.querySelectorAll("nav ul a")].filter(
        (a) => a.closest("li").offsetParent !== null
      ).length
    );
    console.log(`NAV_OVERFLOW_${w}:`, ov, "px, ссылок в строке:", visible);
    await p2.close();
  }

  /* --- 3. Мобайл 390: группы + галерея первой --- */
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await m.locator('button[aria-label="Открыть меню"]').click();
  await m.waitForTimeout(400);
  const mobile = await m.evaluate(() => {
    const first = document.querySelector('div[aria-hidden] , header div')
      ? [...document.querySelectorAll('header a')].map((a) => a.textContent.trim()).find((t) => t.includes("Галерея"))
      : null;
    const groups = [...document.querySelectorAll('header p')].map((p) => p.textContent.trim());
    const items = [...document.querySelectorAll("header li a")].length;
    return { galleryFirst: first, groups, items };
  });
  console.log("MOBILE_GALLERY:", JSON.stringify(mobile.galleryFirst));
  console.log("MOBILE_GROUPS:", JSON.stringify(mobile.groups));
  console.log("MOBILE_ITEMS:", mobile.items);
  await m.screenshot({ path: "/tmp/render/nav-mobile-menu.png" });

  /* --- 4. Блоки «куда дальше» на страницах --- */
  const pages = ["story","map","timeline","implants","chronicles","glossary","excerpts","books","author","support","characters","gallery"];
  for (const p of pages) {
    await d.goto(`${BASE}/${p}/`, { waitUntil: "load" });
    const n = await d.evaluate(
      () => document.querySelectorAll('section[aria-label="Перекрёстные ссылки: куда дальше"]').length
    );
    const links = await d.evaluate(() => {
      const s = document.querySelector('section[aria-label="Перекрёстные ссылки: куда дальше"]');
      return s ? [...s.querySelectorAll("a")].map((a) => a.getAttribute("href")) : [];
    });
    console.log(`CROSS[${p}]:`, n, JSON.stringify(links));
  }

  console.log("CONSOLE_ERRORS:", errors.length ? errors.slice(0, 4) : "none");
  await browser.close();
})();
