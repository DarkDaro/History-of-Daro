import type { MetadataRoute } from "next";

// Для статического экспорта (GitHub Pages) роут должен быть статическим.
export const dynamic = "force-static";

/** PWA-манифест: https://<домен>/manifest.webmanifest */
export default function manifest(): MetadataRoute.Manifest {
  // basePath для GitHub Pages (подставляется CI в deploy.yml при статике)
  const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");
  return {
    name: "История Даро — цикл романов",
    short_name: "История Даро",
    description:
      "Город Хи-Мигата, 2147 год: воздух и память продаются, а человек по имени Даро числится на балансе семи корпораций — и вышел из него.",
    start_url: "/",
    display: "standalone",
    background_color: "#05050a",
    theme_color: "#05050a",
    lang: "ru",
    icons: [
      {
        src: `${base}/icon.svg`,
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: `${base}/icons/icon-192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${base}/icons/icon-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
