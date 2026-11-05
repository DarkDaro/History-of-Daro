/* Проверка батча 4: /story (канон-лид + баннер «РХ») и /gallery
   (9 новых сцен, счётчики, загрузка картинок). out/ с basePath. */
const { chromium } = require("playwright");

const BASE = "http://localhost:8901/History-of-Daro";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  /* --- /story --- */
  await page.goto(`${BASE}/story/`, { waitUntil: "networkidle" });
  const lead = await page.locator("main p").first().textContent();
  console.log("STORY_LEAD:", (lead ?? "").slice(0, 120));
  const hunterBanner = await page
    .locator('img[src*="scene-hunter"]')
    .evaluateAll((imgs) =>
      imgs.map((i) => ({ loaded: i.complete && i.naturalWidth > 0, w: i.naturalWidth }))
    );
  console.log("HUNTER_BANNER:", JSON.stringify(hunterBanner));
  await page.screenshot({ path: "/tmp/render/story-top.png" });
  const bannerBox = await page.locator('img[src*="scene-hunter"]').first().boundingBox();
  if (bannerBox) {
    await page.evaluate((y) => window.scrollTo(0, y - 160), bannerBox.y);
    await page.waitForTimeout(700);
    await page.screenshot({ path: "/tmp/render/story-hunter.png" });
  }

  /* --- /gallery --- */
  await page.goto(`${BASE}/gallery/`, { waitUntil: "networkidle" });
  const chips = await page
    .locator("button, [role=tab], a")
    .evaluateAll((els) =>
      els
        .filter((e) => /ВСЕ|СЦЕНА|ПОРТРЕТ|ОБЛОЖКА/.test(e.textContent ?? ""))
        .map((e) => e.textContent?.replace(/\s+/g, " ").trim())
    );
  console.log("GALLERY_CHIPS:", JSON.stringify([...new Set(chips)]));
  const newScenes = await page.evaluate(() => {
    const names = [
      "scene-kotel", "scene-cleaners", "scene-hunter", "scene-perimeter",
      "scene-technodominus", "scene-dominator", "scene-lab",
      "scene-conveyor", "scene-skybridge",
    ];
    const imgs = [...document.querySelectorAll("img")].map((i) => i.getAttribute("src") ?? "");
    return names.map((n) => ({
      n,
      onGallery: imgs.some((s) => s.includes(n)),
    }));
  });
  console.log("NEW_SCENES:", JSON.stringify(newScenes));
  const total = await page.evaluate(
    () => document.querySelectorAll('img[src*="img/scenes"], img[src*="img/chars"], img[src*="covers/book"]').length
  );
  console.log("GALLERY_IMG_COUNT:", total);
  await page.screenshot({ path: "/tmp/render/gallery-top.png" });
  const kotel = await page.locator('img[src*="scene-kotel"]').first().boundingBox();
  if (kotel) {
    await page.evaluate((y) => window.scrollTo(0, y - 140), kotel.y);
    await page.waitForTimeout(700);
    await page.screenshot({ path: "/tmp/render/gallery-new.png" });
  }

  /* --- обои: стена «Артефакты» содержит новые кнопки скачивания --- */
  const wpBtns = await page.evaluate(() =>
    [...document.querySelectorAll('a[download]')]
      .map((a) => a.getAttribute("href") ?? "")
      .filter((h) => /wp-desktop-(kotel|hunter|dominator|skybridge)/.test(h))
  );
  console.log("NEW_WALLPAPER_LINKS:", wpBtns.length, wpBtns.slice(0, 2));

  console.log("CONSOLE_ERRORS:", errors.length ? errors.slice(0, 5) : "none");
  await browser.close();
})();
