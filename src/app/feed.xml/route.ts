import { BOOKS, CHRONICLES, EXCERPTS } from "@/lib/content";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

// Для статического экспорта (GitHub Pages) роут должен быть статическим:
// при npm run build:static файл feed.xml появится в out/.
export const dynamic = "force-static";

/** Экранирование спецсимволов XML. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * RSS-лента: https://<домен>/feed.xml
 * Только фактология — выходы фрагментов (анонсы: том, название,
 * статус, подводка — без художественного текста), статусы томов
 * и расшифрованные хроники.
 */
export function GET(): Response {
  const built = new Date().toUTCString();

  const bookItems = BOOKS.map(
    (b) => `    <item>
      <title>${esc(`${b.volume}: «${b.title}» — ${b.status}`)}</title>
      <link>${SITE_URL}/books/${b.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/books/${b.slug}</guid>
      <description>${esc(b.logline)}</description>
    </item>`
  );

  const excerptItems = EXCERPTS.map((e) => {
    const b = BOOKS.find((x) => x.slug === e.bookSlug);
    const title = `Фрагмент · ${b ? b.volume : "цикл"}: «${e.title}» — ${e.status}`;
    return `    <item>
      <title>${esc(title)}</title>
      <link>${SITE_URL}/excerpts/${e.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/excerpts/${e.slug}</guid>
      <description>${esc(e.lead)}</description>
    </item>`;
  });

  const chronicleItems = CHRONICLES.map(
    (c) => `    <item>
      <title>${esc(`Хроника: «${c.title}» — ${c.status}`)}</title>
      <link>${SITE_URL}/chronicles/${c.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/chronicles/${c.slug}</guid>
      <description>${esc(c.lead)}</description>
    </item>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE_NAME)} — цикл романов</title>
    <link>${SITE_URL}</link>
    <description>${esc(SITE_DESCRIPTION)}</description>
    <language>ru</language>
    <lastBuildDate>${built}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${[...excerptItems, ...bookItems, ...chronicleItems].join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
