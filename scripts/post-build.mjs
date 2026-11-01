/**
 * Кроссплатформенная постобработка после `next build`.
 * Заменяет Linux-команды `cp -r` (не работают в Windows cmd):
 *   cp -r .next/static .next/standalone/.next/
 *   cp -r public .next/standalone/
 * Запускается автоматически: npm run build
 */
import { cpSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const standalone = join(root, ".next", "standalone");

if (!existsSync(standalone)) {
  console.error("✖ .next/standalone не найден — собери проект: npm run build");
  process.exit(1);
}

// 1. Статика клиентской сборки
cpSync(join(root, ".next", "static"), join(standalone, ".next", "static"), {
  recursive: true,
});
console.log("✔ .next/static → .next/standalone/.next/static");

// 2. Публичные файлы (обложки, ассеты)
if (existsSync(join(root, "public"))) {
  cpSync(join(root, "public"), join(standalone, "public"), {
    recursive: true,
  });
  console.log("✔ public → .next/standalone/public");
}

console.log("✔ Постобработка завершена. Запуск: npm run start");
