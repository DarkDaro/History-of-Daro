import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Для статического экспорта (GitHub Pages) роут должен быть статическим.
export const dynamic = "force-static";

/**
 * Карта сайта: https://<домен>/sitemap.xml
 * У сайта одна страница-лендинг; разделы — это якоря на ней,
 * поэтому в sitemap входит только корневой URL.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
