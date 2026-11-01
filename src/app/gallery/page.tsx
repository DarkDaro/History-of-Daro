import type { Metadata } from "next";
import { PageHero, SectionHeading, MoreLink } from "@/components/blocks";
import { Reveal } from "@/components/cyber";
import { GalleryGrid } from "@/components/gallery-grid";
import { GALLERY } from "@/lib/content";

export const metadata: Metadata = {
  title: "Галерея — арты мира",
  description:
    "Визуальный архив «Истории Даро»: сцены Хи-Мигаты, портреты героев — Даро, Лины, Немезиды, Лорда Скорпиона — и обложки трёх томов. Фильтр по типам записей, подписи из канона.",
  alternates: { canonical: "/gallery" },
};

/* ============================================================
   /gallery — визуальный архив трилогии.
   Источник данных — GALLERY из content.ts: автор добавляет арт
   одним блоком (существующий файл из public/ через asset()),
   сетка, фильтр и счётчики обновляются сами.
   ============================================================ */

export default function GalleryPage() {
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
