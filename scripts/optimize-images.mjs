/**
 * Оптимизация сгенерированных ассетов «Истории Даро»:
 * PNG из /tmp/daro-assets → webp в public/img/ (chars + scenes).
 * Запуск: node scripts/optimize-images.mjs
 */
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const RAW = "/tmp/daro-assets";
const CHARS = join(process.cwd(), "public", "img", "chars");
const SCENES = join(process.cwd(), "public", "img", "scenes");

mkdirSync(CHARS, { recursive: true });
mkdirSync(SCENES, { recursive: true });

if (!existsSync(RAW)) {
  console.error("✖ Нет папки с сырыми ассетами:", RAW);
  process.exit(1);
}

// Портреты -> public/img/chars/<name>.webp; остальное (широкие кадры) -> scenes
const PORTRAITS = new Set([
  "daro", "ohotnik", "lina", "aya", "nemezida",
  "skorpion", "raiz", "hugo", "darkdarus",
]);

const files = readdirSync(RAW).filter((f) => f.endsWith(".png"));
if (files.length === 0) {
  console.error("✖ В", RAW, "нет PNG — сначала scripts/gen_assets.sh");
  process.exit(1);
}

let totalIn = 0;
let totalOut = 0;

for (const file of files) {
  const name = file.replace(/\.png$/, "");
  const src = join(RAW, file);
  const destDir = PORTRAITS.has(name) ? CHARS : SCENES;
  const dest = join(destDir, `${name}.webp`);

  const meta = await sharp(src).metadata();
  const info = await sharp(src).webp({ quality: 84, effort: 4 }).toFile(dest);

  const inSize = statSync(src).size;
  totalIn += inSize;
  totalOut += info.size;
  console.log(
    `✔ ${name}.webp  ${meta.width}x${meta.height}  ${(inSize / 1024).toFixed(0)}KB → ${(info.size / 1024).toFixed(0)}KB`
  );
}

console.log(`\nИтого: ${files.length} файлов, ${(totalIn / 1024 / 1024).toFixed(2)}MB → ${(totalOut / 1024 / 1024).toFixed(2)}MB`);
console.log("DONE");
