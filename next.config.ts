import type { NextConfig } from "next";
import { execSync } from "node:child_process";

/**
 * Два режима сборки:
 *
 * 1) По умолчанию (npm run build) — полноценная версия с бэкендом
 *    (standalone-сервер, API-роут). Для VPS/Vercel.
 *
 * 2) Статический экспорт для GitHub Pages (npm run build:static):
 *    чистый HTML/CSS/JS в папке out/ без серверной части.
 *    Включается через STATIC_EXPORT=1 (скрипт scripts/build-static.mjs).
 *
 * NEXT_PUBLIC_BASE_PATH — префикс пути для GitHub Pages project-сайтов
 * (например /istoriya-daro). Для домена пользователя должен быть пустым.
 */

const isStaticExport =
  process.env.STATIC_EXPORT === "1" ||
  process.env.npm_lifecycle_event === "build:static";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

/** Версия сборки для футера: sha коммита + дата (инжектится при сборке). */
function buildInfo() {
  try {
    const sha = execSync("git rev-parse --short HEAD").toString().trim();
    return { sha, date: new Date().toISOString().slice(0, 10) };
  } catch {
    // вне git-репозитория (например, распакованный zip) — без sha
    return { sha: "dev", date: new Date().toISOString().slice(0, 10) };
  }
}

const { sha: buildSha, date: buildDate } = buildInfo();

const shared: NextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_BUILD_SHA: buildSha,
    NEXT_PUBLIC_BUILD_DATE: buildDate,
  },
};

const nextConfig: NextConfig = isStaticExport
  ? {
      ...shared,
      output: "export",
      trailingSlash: true,
      images: { unoptimized: true },
      ...(basePath ? { basePath, assetPrefix: basePath } : {}),
    }
  : {
      ...shared,
      output: "standalone",
    };

export default nextConfig;
