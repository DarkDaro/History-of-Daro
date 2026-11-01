import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/blocks";
import { Corners, Reveal } from "@/components/cyber";
import { BOOKS, EXCERPTS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Фрагменты",
  description:
    "Читалка вселенной «Истории Даро»: эпизоды из трёх томов — пролог «Красного сдвига», сделка на «Авангарде» из «Стеклянных небес» и тизер финального «Пепла и неона». Тексты в сопровождении перехваченных логов Хи-Мигаты.",
  alternates: { canonical: "/excerpts" },
};

const ACCENT_TEXT = {
  cyan: "neon-cyan",
  magenta: "neon-magenta",
  amber: "text-[var(--neon-amber)]",
} as const;

export default function ExcerptsPage() {
  return (
    <main className="min-h-screen bg-[#05050a] text-white">
      <PageHero
        kicker="Эпизоды из томов · читалка"
        title="Фрагменты"
        glitch
        lead="Выдержки из трёх томов — сцены, которые сопротивлению удалось вытащить до издания. Каждый фрагмент читается как перехваченный файл: текст, время, место и логи, которые город записал про себя сам. Начните с любого — тома не спойлерят друг друга."
        accent="cyan"
        breadcrumb={[{ href: "/excerpts", label: "Фрагменты" }]}
        rainGlass
      />

      {/* список фрагментов */}
      <section className="relative py-20 sm:py-24">
        <div className="cyber-grid absolute inset-0 opacity-[0.05]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            kicker="Дешифрованные эпизоды"
            title="Архив чтения"
            num="01"
            accent="cyan"
          />

          <div className="grid gap-8">
            {EXCERPTS.map((e, i) => {
              const book = BOOKS.find((b) => b.slug === e.bookSlug)!;
              return (
                <Reveal key={e.slug} delay={i * 0.08}>
                  <Link
                    href={`/excerpts/${e.slug}`}
                    className="group relative grid gap-6 border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/25 sm:p-9 lg:grid-cols-[1fr_260px]"
                  >
                    <Corners color={e.accent} />
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`font-display text-2xl ${ACCENT_TEXT[e.accent]}`}>{book.code}</span>
                        <span className="font-mono-cyber border border-white/15 bg-black/50 px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] text-white/60">
                          {e.label}
                        </span>
                        <span className="font-mono-cyber text-[9px] uppercase tracking-[0.25em] text-white/35">
                          {e.time}
                        </span>
                      </div>
                      <h3 className="font-display mt-4 text-2xl uppercase leading-snug tracking-wide text-white sm:text-3xl">
                        {e.title}
                      </h3>
                      <p className={`font-mono-cyber mt-2 text-[10px] uppercase tracking-[0.25em] ${ACCENT_TEXT[e.accent]}`}>
                        {book.volume} · «{book.title}»
                      </p>
                      <p className="font-cyber mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
                        {e.lead}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {e.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono-cyber border border-white/15 px-2 py-1 text-[10px] text-white/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col justify-between gap-5 border-t border-white/10 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                      <div className="relative aspect-[2/3] max-h-56 w-full max-w-40 overflow-hidden border border-white/10">
                        <Image
                          src={book.cover}
                          alt={`Обложка тома «${book.title}»`}
                          fill
                          sizes="(max-width: 1024px) 160px, 260px"
                          className="cover-tone object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a16] via-transparent to-transparent" />
                        <p className="font-mono-cyber absolute bottom-2 left-2 text-[8px] uppercase tracking-[0.25em] text-white/60">
                          обложка тома
                        </p>
                      </div>
                      <div>
                        <p className="font-mono-cyber text-[9px] uppercase tracking-[0.3em] text-white/40">Место действия</p>
                        <p className="font-cyber mt-2 text-sm leading-relaxed text-white/70">{e.place}</p>
                      </div>
                      <span
                        className={`font-mono-cyber inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] ${ACCENT_TEXT[e.accent]}`}
                      >
                        Читать фрагмент
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          {/* подпись архива */}
          <Reveal className="mt-12">
            <div className="beam-border-static flex flex-col items-start gap-4 p-7 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
              <Radio className="neon-cyan h-8 w-8 shrink-0" aria-hidden />
              <div>
                <p className="font-mono-cyber text-[10px] uppercase tracking-[0.35em] neon-cyan">
                  Следующие эпизоды — вместе с томами
                </p>
                <p className="font-cyber mt-3 text-sm leading-relaxed text-white/65">
                  Фрагменты публикуются по мере готовности текста: сначала архив, потом книга.
                  «Периметр Зеро» передаёт сигнал — новые эпизоды появляются здесь первыми.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
