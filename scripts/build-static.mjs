import { spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";

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

if ((result.status ?? 1) !== 0) {
  process.exit(result.status ?? 1);
}

/**
 * Служебные артефакты сборки не для публичного сайта (решение автора
 * 2026-11-23): архивы релизов и страница загрузки остаются в репо
 * (public/releases/, public/download.html — не тронуты, в .gitignore
 * не добавляются), но из деплой-выхода исключаются. Вернуть — убрать
 * этот блок.
 */
for (const name of ["releases", "download.html"]) {
  const target = `out/${name}`;
  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true });
    console.log(`build-static: out/${name} исключён из деплоя (исходники в public/ не тронуты)`);
  }
}

process.exit(0);
