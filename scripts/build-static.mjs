import { spawnSync } from "node:child_process";

/**
 * Кроссплатформенный статический экспорт для GitHub Pages.
 * Задаёт STATIC_EXPORT=1 и запускает next build (работает и на Windows).
 * Результат — папка out/: готовый статический сайт.
 */
const result = spawnSync("next", ["build"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: { ...process.env, STATIC_EXPORT: "1" },
});

process.exit(result.status ?? 1);
