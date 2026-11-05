/* Дампер канона «Истории Даро»: компилирует src/content/*.ts в JSON
   для генератора Obsidian-vault (scripts/build-vault.py).
   Запуск: node scripts/dump-vault.mjs  →  scripts/.vault-data.json     */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const outDir = "/tmp/vault-cjs";

// basePath пустой: asset() должен вернуть чистые пути /img/...
process.env.NEXT_PUBLIC_BASE_PATH = "";

fs.rmSync(outDir, { recursive: true, force: true });
execSync(
  `npx tsc src/content/*.ts --outDir ${outDir} --module commonjs --target es2020 ` +
    `--moduleResolution node --skipLibCheck --esModuleInterop`,
  { cwd: root, stdio: "inherit" },
);

const require = createRequire(import.meta.url);
const modules = [
  "characters", "weapons", "weapon-specs", "implants", "corporations",
  "world", "glossary", "chronicles", "timeline", "map", "books",
  "excerpts", "story", "synopsis", "gallery", "dossier", "calendar",
  "shared",
];

const data = {};
for (const m of modules) {
  const mod = require(path.join(outDir, `${m}.js`));
  data[m] = {};
  for (const [k, v] of Object.entries(mod)) {
    if (typeof v === "function") continue; // asset() и хелперы не нужны
    data[m][k] = v;
  }
}

const outFile = path.join(root, "scripts", ".vault-data.json");
fs.writeFileSync(outFile, JSON.stringify(data, null, 1));
const summary = Object.entries(data)
  .map(([m, kv]) => `${m}: ${Object.entries(kv).map(([k, v]) => `${k}${Array.isArray(v) ? `(${v.length})` : ""}`).join(", ")}`)
  .join("\n");
console.log(summary);
console.log(`\nOK → ${outFile} (${(fs.statSync(outFile).size / 1024).toFixed(0)} КБ)`);
