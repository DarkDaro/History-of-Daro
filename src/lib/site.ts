/**
 * Центральная конфигурация сайта (SEO).
 * Перед деплоем задай NEXT_PUBLIC_SITE_URL в .env — например:
 *   NEXT_PUBLIC_SITE_URL=https://istoriya-daro.ru
 * Все канонические URL, OG-теги, robots.txt и sitemap.xml берутся отсюда.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

export const SITE_NAME = "История Даро";

export const SITE_DESCRIPTION =
  "Официальный сайт литературного цикла «История Даро»: романы в жанре киберпанк-дистопии, боевика и неонуара. Атмосфера Blade Runner и Ghost in the Shell — мегаполис, корпорации, неон и те, кто выживает между ними.";
