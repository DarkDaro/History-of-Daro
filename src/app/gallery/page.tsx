import type { Metadata } from "next";
import Image from "next/image";
import { Download } from "lucide-react";
import { PageHero, SectionHeading, MoreLink } from "@/components/blocks";
import { Corners, Reveal } from "@/components/cyber";
import { GalleryGrid } from "@/components/gallery-grid";
import {
  asset,
  GALLERY,
  WALLPAPERS,
  WALLPAPER_SIZES,
  type GalleryItem,
} from "@/lib/content";

export const metadata: Metadata = {
  openGraph: {
    title: "Галерея",
    images: [{ url: "/covers/og-gallery.png", width: 1200, height: 630, alt: "Галерея — История Даро" }],
  },
  title: "Галерея — арты мира",
  description:
    "Визуальный архив «Истории Даро»: сцены Хи-Мигаты, портреты героев — Даро, Лины, Немезиды, Лорда Скорпиона — и обложки трёх томов. Фильтр по типам записей, подписи из канона. Каждый арт можно скачать обоями: рабочий стол 1920×1080 и телефон 1080×1920.",
  alternates: { canonical: "/gallery" },
};

/* ============================================================
   /gallery — визуальный архив трилогии.
   Источник данных — GALLERY из content.ts: автор добавляет арт
   одним блоком (существующий файл из public/ через asset()),
   сетка, фильтр и счётчики обновляются сами.
   Стена «Артефакты» (BACKLOG п.16/п.24): обои из тех же файлов
   собирает scripts/make-wallpapers.py -> public/wallpapers/;
   маппинг файл↔запись — WALLPAPERS (wallpapers.ts).
   ============================================================ */

type WallpaperCard = {
  galleryId: string;
  desktop?: string;
  phone?: string;
  item: GalleryItem;
};

function wallpaperCards(): WallpaperCard[] {
  return WALLPAPERS.flatMap((wp) => {
    const item = GALLERY.find((g) => g.id === wp.galleryId);
    return item ? [{ ...wp, item }] : [];
  });
}

/* Тайл стены «Артефакты»: превью записи + кнопка скачивания.
   Серверный — вся интерактивность это обычный <a download>. */
function WallpaperTile({
  card,
  variant,
}: {
  card: WallpaperCard;
  variant: "desktop" | "phone";
}) {
  const href = asset((variant === "desktop" ? card.desktop : card.phone) ?? "");
  const size = WALLPAPER_SIZES[variant];
  const { item } = card;
  const hoverBorder =
    item.accent === "cyan"
      ? "hover:border-[var(--neon-cyan)]/40"
      : item.accent === "magenta"
        ? "hover:border-[var(--neon-magenta)]/40"
        : "hover:border-[var(--neon-amber)]/40";
  return (
    <article
      className={`group relative flex h-full flex-col border border-white/10 bg-white/[0.03] p-2.5 transition-colors ${hoverBorder}`}
    >
      <Corners color={item.accent} />
      <div
        className={`relative w-full overflow-hidden ${
          variant === "desktop" ? "aspect-video" : "aspect-[9/16]"
        }`}
      >
        <Image
          src={item.src}
          alt={`${item.title} — обои «Истории Даро»`}
          fill
          sizes={
            variant === "desktop"
              ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          }
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col px-1.5 pb-1 pt-3">
        <p className="font-display truncate text-sm uppercase tracking-wide">
          {item.title}
        </p>
        <a
          href={href}
          download
          aria-label={`Скачать обои «${item.title}» (${size}, ${variant === "desktop" ? "рабочий стол" : "телефон"})`}
          className="font-mono-cyber mt-3 inline-flex items-center justify-center gap-2 border border-white/15 px-3 py-2.5 text-[9px] uppercase tracking-[0.25em] text-white/60 transition-colors hover:border-[var(--neon-cyan)]/60 hover:text-[var(--neon-cyan)]"
        >
          <Download className="h-3 w-3 shrink-0" aria-hidden />
          {size}
        </a>
      </div>
    </article>
  );
}

export default function GalleryPage() {
  const cards = wallpaperCards();
  const desktopCards = cards.filter((c) => c.desktop);
  const phoneCards = cards.filter((c) => c.phone);
  return (
    <main className="min-h-screen bg-[#05050a] text-white">
      <PageHero
        kicker="Визуальный архив · периметр культуры"
        title="Галерея"
        glitch
        lead="То, что «Спектр» не показывает в утреннем эфире: город под куполами, лица из личных дел и обложки томов. Каждая запись — с подписью из реестра «Периметра Зеро»."
        breadcrumb={[{ href: "/gallery", label: "Галерея" }]}
        rainGlass
      />

      {/* архив */}
      <section className="relative border-t border-white/10 py-20 sm:py-24">
        <div className="cyber-grid absolute inset-0 opacity-[0.05]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            kicker="Файлы-визуализация"
            title="Записи архива"
            num="01"
            accent="cyan"
          />
          <Reveal className="-mt-6 mb-12 text-center">
            <p className="font-cyber mx-auto max-w-2xl text-sm leading-relaxed text-white/60">
              Сцены — места и технологии мира; портреты — визуальные записи
              личных дел; обложки — лица трёх томов. Нажмите на запись, чтобы
              открыть её целиком: подпись и источник — под изображением.
            </p>
          </Reveal>
          <GalleryGrid items={GALLERY} />
        </div>
      </section>

      {/* стена «Артефакты»: обои на память (BACKLOG п.16/п.24) */}
      <section className="relative border-t border-white/10 py-20 sm:py-24">
        <div aria-hidden className="aurora-blob magenta right-[3%] top-[4%] h-72 w-72" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            kicker="Забери с собой"
            title="Артефакты · обои"
            num="02"
            accent="magenta"
          />
          <Reveal className="-mt-6 mb-14 text-center">
            <p className="font-cyber mx-auto max-w-2xl text-sm leading-relaxed text-white/60">
              Кадры архива собраны в обои: сцены — на рабочий стол,
              портреты и обложки томов — на экран телефона. Скачивание
              бесплатное, как и всё на сайте; когда архив пополняется,
              файлы обоев пересобираются скриптом.
            </p>
          </Reveal>

          {/* рабочий стол */}
          <div className="mb-14">
            <p className="font-mono-cyber mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] neon-cyan">
              <span className="shrink-0">Рабочий стол · {WALLPAPER_SIZES.desktop}</span>
              <span className="h-px flex-1 bg-white/10" aria-hidden />
              <span className="text-white/35">{desktopCards.length}</span>
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {desktopCards.map((c, i) => (
                <Reveal key={c.galleryId} delay={Math.min(i, 5) * 0.05}>
                  <WallpaperTile card={c} variant="desktop" />
                </Reveal>
              ))}
            </div>
          </div>

          {/* телефон */}
          <div>
            <p className="font-mono-cyber mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] neon-magenta">
              <span className="shrink-0">Телефон · {WALLPAPER_SIZES.phone}</span>
              <span className="h-px flex-1 bg-white/10" aria-hidden />
              <span className="text-white/35">{phoneCards.length}</span>
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {phoneCards.map((c, i) => (
                <Reveal key={c.galleryId} delay={Math.min(i, 5) * 0.05}>
                  <WallpaperTile card={c} variant="phone" />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* куда дальше */}
      <section className="relative border-t border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="font-cyber mx-auto max-w-2xl text-sm leading-relaxed text-white/60">
              За каждым изображением стоит файл: тома с логлайнами, личные
              дела героев и досье мира, из которого архив и вытащен.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <MoreLink href="/books">Тома трилогии</MoreLink>
              <MoreLink href="/characters">Личные дела</MoreLink>
              <MoreLink href="/world">Досье мира · Хи-Мигата</MoreLink>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
