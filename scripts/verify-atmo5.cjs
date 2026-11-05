/* Проверка ATMO v5 (восстановленный чанк): typewriter в hero,
   hero-fog и title-breathe на /story, glitch-title на галерее,
   поведение при prefers-reduced-motion. */
const { chromium } = require("playwright");

const BASE = "http://localhost:8901/History-of-Daro";

(async () => {
  const browser = await chromium.launch();

  /* --- 1. Главная: печатная машинка --- */
  const p1 = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  p1.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  p1.on("pageerror", (e) => errs.push(String(e)));
  await p1.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  const tw = p1.locator(".typewriter").first();
  await tw.waitFor({ state: "visible", timeout: 10000 });
  const early = await tw.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { anim: cs.animationName, width: el.getBoundingClientRect().width };
  });
  await p1.waitForTimeout(4600); // 1.1s delay + 2.8s typing + запас
  const late = await tw.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      anim: cs.animationName,
      w: el.getBoundingClientRect().width,
      clipped: el.scrollWidth > el.clientWidth + 1,
      text: el.textContent,
    };
  });
  console.log("TYPEWRITER_EARLY:", JSON.stringify(early));
  console.log("TYPEWRITER_LATE:", JSON.stringify({ ...late, text: (late.text ?? "").slice(0, 60) }));
  await p1.screenshot({ path: "/tmp/render/atmo-home.png" });

  /* --- 2. /story: туман + дыхание заголовков --- */
  await p1.goto(`${BASE}/story/`, { waitUntil: "networkidle" });
  const fog = await p1.locator(".hero-fog").first().evaluate((el) => ({
    anim: getComputedStyle(el).animationName,
    dur: getComputedStyle(el).animationDuration,
    pe: getComputedStyle(el).pointerEvents,
  }));
  const breathe = await p1.locator(".title-breathe").first().evaluate((el) => ({
    anim: getComputedStyle(el).animationName,
    count: document.querySelectorAll(".title-breathe").length,
  }));
  console.log("HERO_FOG:", JSON.stringify(fog));
  console.log("TITLE_BREATHE:", JSON.stringify(breathe));

  /* --- 3. /gallery: глитч-наведение --- */
  await p1.goto(`${BASE}/gallery/`, { waitUntil: "networkidle" });
  const tile = p1.locator("article.lift-card").first();
  await tile.scrollIntoViewIfNeeded();
  await p1.waitForTimeout(800);
  const before = await tile.locator(".glitch-title").evaluate((el) => getComputedStyle(el).textShadow);
  await tile.hover();
  await p1.waitForTimeout(80); // внутри одноразового флика 0.32s
  const during = await tile.locator(".glitch-title").evaluate((el) => ({
    shadow: getComputedStyle(el).textShadow,
    transform: getComputedStyle(el).transform,
  }));
  console.log("GLITCH_BEFORE:", before === "none" ? "none" : before);
  console.log("GLITCH_DURING:", JSON.stringify(during));
  await p1.screenshot({ path: "/tmp/render/atmo-gallery-hover.png" });

  /* --- 4. reduced motion: строка целиком, без курсора --- */
  const p2 = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
  });
  await p2.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const rm = await p2.locator(".typewriter").first().evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      anim: cs.animationName,
      border: cs.borderRightColor,
      visible: el.scrollWidth <= el.clientWidth + 1,
      w: el.getBoundingClientRect().width,
    };
  });
  console.log("REDUCED_MOTION:", JSON.stringify(rm));
  const rmFog = await p2.goto(`${BASE}/story/`, { waitUntil: "networkidle" }).then(() =>
    p2.locator(".hero-fog").first().evaluate((el) => getComputedStyle(el).animationName)
  );
  console.log("RM_FOG_ANIM:", rmFog);

  console.log("CONSOLE_ERRORS:", errs.length ? errs.slice(0, 4) : "none");
  await browser.close();
})();
