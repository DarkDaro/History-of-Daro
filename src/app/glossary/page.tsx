import type { Metadata } from "next";
import Link from "next/link";
import { CrossLinks, PageHero, SectionHeading } from "@/components/blocks";
import { Reveal } from "@/components/cyber";
import { GLOSSARY, GLOSSARY_PLANNED, type Accent } from "@/lib/content";

export const metadata: Metadata = {
  openGraph: {
    title: "Глоссарий — словарь мира",
    images: [{ url: "/covers/og-glossary.png", width: 1200, height: 630, alt: "Глоссарий мира — История Даро" }],
  },
  title: "Глоссарий",
  description:
    "Словарь мира «Истории Даро»: общий язык жанра, знакомые слова со сдвигом смысла, собственные термины Хи-Мигаты и имена проектов. Версия 1.0 — редакция автора.",
  alternates: { canonical: "/glossary" },
};

const ACCENT_LINE: Record<string, string> = {
  cyan: "bg-[var(--neon-cyan)]",
  magenta: "bg-[var(--neon-magenta)]",
  amber: "bg-[var(--neon-amber)]",
};

const ACCENT_TEXT: Record<string, string> = {
  cyan: "neon-cyan",
  magenta: "neon-magenta",
  amber: "text-[var(--neon-amber)]",
};

const ACCENT_BORDER: Record<string, string> = {
  cyan: "hover:border-[var(--neon-cyan)]/40",
  magenta: "hover:border-[var(--neon-magenta)]/40",
  amber: "hover:border-[var(--neon-amber)]/40",
};

export default function GlossaryPage() {
  return (
    <main className="min-h-screen bg-[#05050a] text-white">
      <PageHero
        kicker="Словарь мира · версия 1.0 · редакция автора"
        title="Глоссарий"
        glitch
        lead="Город говорит на трёх языках сразу: общим языком жанра, знакомыми словами со сдвинутым смыслом — и собственным лексиконом реестров. Этот словарь собирает все три уровня, чтобы читатель, зашедший с середины, не тону в «Периметре Зеро», «Резонансе» и «балансе». Часть терминов публикуется впервые."
        accent="cyan"
        breadcrumb={[{ href: "/glossary", label: "Глоссарий" }]}
      />

      {/* уровни словаря */}
      {GLOSSARY.map((level, li) => (
        <section
          key={level.id}
          className={`relative py-20 sm:py-24 ${li > 0 ? "border-t border-white/10" : ""}`}
        >
          {li % 2 === 1 && <div className="cyber-grid absolute inset-0 opacity-[0.05]" aria-hidden />}
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading kicker={level.kicker} title={level.title} num={level.num} accent={level.accent as Accent} />
            <Reveal>
              <p className="mt-6 max-w-3xl font-cyber text-sm leading-relaxed text-white/60 sm:text-base">
                {level.lead}
              </p>
            </Reveal>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {level.entries.map((e, i) => (
                <Reveal key={e.id} delay={(i % 2) * 0.07}>
                  <article
                    id={e.id}
                    className={`group relative h-full scroll-mt-28 border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors ${ACCENT_BORDER[e.accent]}`}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className={`font-display text-xl uppercase tracking-wide ${ACCENT_TEXT[e.accent]}`}>
                        {e.term}
                      </h3>
                      {e.kind && (
                        <span className="font-mono-cyber shrink-0 text-[9px] uppercase tracking-[0.25em] text-white/55">
                          {e.kind}
                        </span>
                      )}
                    </div>
                    <div className={`mt-3 h-px w-14 ${ACCENT_LINE[e.accent]}`} aria-hidden />
                    <p className="font-cyber mt-4 text-sm leading-relaxed text-white/70">{e.text}</p>
                    {(e.href || e.also) && (
                      <div className="mt-5 flex flex-col items-start gap-2.5">
                        {e.href && (
                          <Link
                            href={e.href}
                            className="font-mono-cyber inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/50 transition-colors hover:text-[var(--neon-cyan)]"
                          >
                            {"//"} {e.hrefLabel ?? "на сайте"}
                            <span aria-hidden className="transition-transform group-hover:translate-x-1">
                              →
                            </span>
                          </Link>
                        )}
                        {e.also && (
                          <Link
                            href={e.also.href}
                            className="font-mono-cyber inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/50 transition-colors hover:text-[var(--neon-magenta)]"
                          >
                            {"//"} {e.also.label}
                            <span aria-hidden className="transition-transform group-hover:translate-x-1">
                              →
                            </span>
                          </Link>
                        )}
                      </div>
                    )}
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* готовится */}
      <section className="relative border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading kicker="Заявлено автором · записи появятся после редакции тома III" title="Готовится" num="05" accent="magenta" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {GLOSSARY_PLANNED.map((p) => (
              <Reveal key={p.title}>
                <div className="h-full border border-dashed border-white/20 bg-transparent p-6">
                  <h3 className="font-display text-lg uppercase tracking-wide text-white/60">{p.title}</h3>
                  <p className="font-cyber mt-3 text-sm leading-relaxed text-white/45">{p.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* финальная цитата */}
      <section className="relative border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <p className="font-cyber text-xl italic leading-relaxed text-white/85 sm:text-2xl">
              «Система идентификации целей активирована».
            </p>
            <p className="font-mono-cyber mt-5 text-xs uppercase tracking-[0.3em] text-white/50">
              — Искин · голос, который слышат все, кто попал внутрь
            </p>
          </Reveal>
        </div>
      </section>
      {/* куда дальше */}
      <CrossLinks
        intro="За каждым термином стоит раздел: досье мира объясняет устройство города, каталог имплантов — железо, личные дела — тех, кто им живет."
        links={[
          { href: "/world", label: "Мир · досье" },
          { href: "/implants", label: "Импланты · каталог" },
          { href: "/characters", label: "Персонажи · дела" },
        ]}
      />
    </main>
  );
}
