import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileLock2, Radio } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/blocks";
import { Corners, Reveal } from "@/components/cyber";
import { CHRONICLES } from "@/lib/content";

export const metadata: Metadata = {
  openGraph: {
    title: "Хроники",
    images: [{ url: "/covers/og-chronicles.png", width: 1200, height: 630, alt: "Хроники — История Даро" }],
  },
  title: "Хроники",
  description:
    "Хроники вселенной «Истории Даро»: восстановленные фрагменты, флешбеки и расшифрованные записи мира Хи-Мигаты. Первый файл — флешбек Резонансного Охотника: побег из лабораторий консорциума.",
  alternates: { canonical: "/chronicles" },
};

const ACCENT_TEXT = {
  cyan: "neon-cyan",
  magenta: "neon-magenta",
  amber: "text-[var(--neon-amber)]",
} as const;

export default function ChroniclesPage() {
  return (
    <main className="min-h-screen bg-[#05050a] text-white">
      <PageHero
        kicker="Восстановленные записи · архив сопротивления"
        title="Хроники"
        glitch
        lead="Флешбеки, перехваченные журналы и расшифрованные файлы — тексты, которые не вошли в тома, но случились в этом мире. Каждая хроника — осколок чужой войны, который сопротивлению удалось вытащить из реестров консорциума."
        accent="amber"
        breadcrumb={[{ href: "/chronicles", label: "Хроники" }]}
        rainGlass
      />

      {/* список хроник */}
      <section className="relative py-20 sm:py-24">
        <div className="cyber-grid absolute inset-0 opacity-[0.05]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            kicker="Расшифрованные файлы"
            title="Архив фрагментов"
            num="01"
            accent="amber"
          />

          <div className="grid gap-8">
            {CHRONICLES.map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.08}>
                <Link
                  href={`/chronicles/${c.slug}`}
                  className="group relative grid gap-6 border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/25 sm:p-9 lg:grid-cols-[1fr_280px]"
                >
                  <Corners color={c.accent} />
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`font-display text-2xl ${ACCENT_TEXT[c.accent]}`}>{c.code}</span>
                      <span className="font-mono-cyber border border-white/15 bg-black/50 px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] text-white/60">
                        {c.status}
                      </span>
                    </div>
                    <h3 className="font-display mt-4 text-2xl uppercase leading-snug tracking-wide text-white sm:text-3xl">
                      {c.title}
                    </h3>
                    <p className={`font-mono-cyber mt-2 text-[10px] uppercase tracking-[0.25em] ${ACCENT_TEXT[c.accent]}`}>
                      {c.subtitle}
                    </p>
                    <p className="font-cyber mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
                      {c.lead}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {c.tags.map((tag) => (
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
                    {c.cover && (
                      <div className="relative aspect-[2/1] overflow-hidden border border-white/10">
                        <Image
                          src={c.cover}
                          alt={`Реконструкция сцены: ${c.title}`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 280px"
                          className="cover-tone object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a16] via-transparent to-transparent" />
                        <p className="font-mono-cyber absolute bottom-2 left-2 text-[8px] uppercase tracking-[0.25em] text-white/60">
                          реконструкция сцены
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="font-mono-cyber text-[9px] uppercase tracking-[0.3em] text-white/40">Источник</p>
                      <p className="font-cyber mt-2 text-sm leading-relaxed text-white/70">{c.sourceLabel}</p>
                    </div>
                    <span
                      className={`font-mono-cyber inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] ${ACCENT_TEXT[c.accent]}`}
                    >
                      Читать фрагмент
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* архив на расшифровке */}
          <Reveal className="mt-12">
            <div className="beam-border-static flex flex-col items-start gap-4 p-7 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
              <FileLock2 className="neon-cyan h-8 w-8 shrink-0" aria-hidden />
              <div>
                <p className="font-mono-cyber text-[10px] uppercase tracking-[0.35em] neon-cyan">
                  Следующие файлы — на расшифровке
                </p>
                <p className="font-cyber mt-3 text-sm leading-relaxed text-white/65">
                  Уровни доступа выше чёрного. Хроники появляются здесь по мере того,
                  как Айе удаётся обходить реестры консорциума — и по мере того, как
                  мир сам оставляет следы. Следите за сигналом.
                </p>
              </div>
              <Radio className="ml-auto hidden h-5 w-5 shrink-0 animate-pulse text-[var(--neon-cyan)]/60 sm:block" aria-hidden />
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
