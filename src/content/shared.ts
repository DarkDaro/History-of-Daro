/* ============================================================
   ИСТОРИЯ ДАРО — Общий клей канона: акценты, basePath-ассеты, кадры-сцены.
   Часть канона (B3): правь здесь, content.ts — только ре-экспорт.
   ============================================================ */

export type Accent = "cyan" | "magenta" | "amber";

/* ------------------------------------------------------------
   Пути к ассетам с учётом basePath.
   GitHub Pages project-сайт живёт в подпапке (/<repo>), а
   next/image с images.unoptimized НЕ добавляет basePath к src
   автоматически — поэтому префикс делаем сами на уровне данных.
   В обычной сборке и dev-режиме переменная пустая и ничего не меняет.
   ------------------------------------------------------------ */

const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}

/* Широкие кадры-сцены для страниц разделов. */
export const VISUALS = {
  city: asset("/covers/hero-city.png"),
  world: asset("/img/scenes/world.webp"),
  implants: asset("/img/scenes/implants.webp"),
  armory: asset("/img/scenes/armory.webp"),
  story: asset("/img/scenes/story.webp"),
} as const;

/* ------------------------- КНИГИ ------------------------- */
