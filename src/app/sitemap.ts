import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Для статического экспорта (GitHub Pages) роут должен быть статическим.
export const dynamic = "force-static";

/**
 * Карта сайта: https://<домен>/sitemap.xml
 * Сайт многостраничный: главная + разделы мира цикла.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: { path: string; priority: number; freq: "weekly" | "monthly" }[] = [
    { path: "", priority: 1, freq: "weekly" },
    { path: "/books", priority: 0.9, freq: "weekly" },
    { path: "/books/tom-1", priority: 0.9, freq: "monthly" },
    { path: "/books/tom-2", priority: 0.9, freq: "monthly" },
    { path: "/books/tom-3", priority: 0.8, freq: "monthly" },
    { path: "/excerpts", priority: 0.8, freq: "weekly" },
    { path: "/excerpts/holodnyj-start", priority: 0.7, freq: "monthly" },
    { path: "/excerpts/sdelka", priority: 0.7, freq: "monthly" },
    { path: "/excerpts/pepel-i-neon", priority: 0.7, freq: "monthly" },
    { path: "/world", priority: 0.8, freq: "monthly" },
    { path: "/characters", priority: 0.8, freq: "monthly" },
    { path: "/implants", priority: 0.7, freq: "monthly" },
    { path: "/armory", priority: 0.7, freq: "monthly" },
    { path: "/chronicles", priority: 0.8, freq: "weekly" },
    { path: "/chronicles/pobeg-ohotnika", priority: 0.7, freq: "monthly" },
    { path: "/story", priority: 0.7, freq: "monthly" },
    { path: "/author", priority: 0.6, freq: "monthly" },
  ];

  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
