import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, ScrollText } from "lucide-react";
import { PageHero, TerminalQuote } from "@/components/blocks";
import { CopyLinkButton } from "@/components/copy-link-button";
import { Corners, Reveal, Typewriter } from "@/components/cyber";
import type { Book, Excerpt } from "@/lib/content";

/* ============================================================
   Детальная страница фрагмента (читалка): файл эпизода,
   текст с системными перехватами, навигация по фрагментам.
   ============================================================ */

const ACCENT_TEXT = {
  cyan: "neon-cyan",
  magenta: "neon-magenta",
  amber: "text-[var(--neon-amber)]",
} as const;

const ACCENT_BORDER = {
  cyan: "border-[var(--neon-cyan)]/40 text-[var(--neon-cyan)]",
  magenta: "border-[var(--neon-magenta)]/40 text-[var(--neon-magenta)]",
  amber: "border-[var(--neon-amber)]/40 text-[var(--neon-amber)]",
} as const;

const ACCENT_DOT = {
  cyan: "bg-[var(--neon-cyan)]",
  magenta: "bg-[var(--neon-magenta)]",
  amber: "bg-[var(--neon-amber)]",
} as const;

export function ExcerptReader({
  excerpt,
  book,
  prev,
  next,
}: {
  excerpt: Excerpt;
  book: Book;
  prev?: { href: string; title: string };
  next?: { href: string; title: string };
}) {
  const e = excerpt;
  const b = book;

  return (
    <main className="min-h-screen bg-[#05050a] text-white">
      <PageHero
        kicker={`${b.code} · «${b.title}» · ${e.label}`}
        title={e.title}
        glitch
        lead={e.lead}
        accent={e.accent}
        breadcrumb={[
          { href: "/excerpts", label: "Фрагменты" },
          { href: `/excerpts/${e.slug}`, label: e.title },
        ]}
        rainGlass
      />

      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
            {/* карточка файла */}
            <Reveal className="space-y-6">
              <div className="relative">
                <Corners color={e.accent} />
                <div className="beam-border-static p-5">
                  <p className="font-mono-cyber text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Файл эпизода
                  </p>
                  <dl className="mt-4 space-y-3">
                    <div className="border-b border-white/5 pb-2">
                      <dt className="font-mono-cyber text-[10px] uppercase tracking-[0.2em] text-white/45">Том</dt>
                      <dd className={`font-display mt-1 text-lg ${ACCENT_TEXT[e.accent]}`}>
                        {b.volume} · «{b.title}»
                      </dd>
                    </div>
                    <div className="border-b border-white/5 pb-2">
                      <dt className="font-mono-cyber text-[10px] uppercase tracking-[0.2em] text-white/45">Место</dt>
                      <dd className="font-cyber mt-1 text-sm text-white/85">{e.place}</dd>
                    </div>
                    <div className="border-b border-white/5 pb-2">
                      <dt className="font-mono-cyber text-[10px] uppercase tracking-[0.2em] text-white/45">Время</dt>
                      <dd className="font-mono-cyber mt-1 text-xs tracking-[0.15em] text-white/75">{e.time}</dd>
                    </div>
                    <div>
                      <dt className="font-mono-cyber text-[10px] uppercase tracking-[0.2em] text-white/45">Статус</dt>
                      <dd className={`font-mono-cyber mt-1 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] ${ACCENT_TEXT[e.accent]}`}>
                        <span className={`pulse-dot h-1.5 w-1.5 rounded-full ${ACCENT_DOT[e.accent]}`} aria-hidden />
                        {e.status}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* копировать ссылку на файл */}
              <CopyLinkButton label="Копировать ссылку на файл" />

              {/* связанные файлы */}
              <div className="border border-white/10 bg-white/[0.03] p-5">
                <p className="font-mono-cyber text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Связанные файлы
                </p>
                <ul className="mt-4 space-y-3">
                  <li>
                    <Link
                      href={`/books/${b.slug}`}
                      className="group block border border-white/10 bg-black/40 p-3 transition-colors hover:border-white/30"
                    >
                      <span className="font-cyber flex items-center justify-between gap-2 text-sm text-white/85 transition-colors group-hover:text-[var(--neon-cyan)]">
                        О томе «{b.title}»
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-[var(--neon-cyan)]" aria-hidden />
                      </span>
                      <span className="font-mono-cyber mt-1 block text-[9px] uppercase tracking-[0.2em] text-white/35">
                        карточка тома · синопсис · факты
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/excerpts"
                      className="group block border border-white/10 bg-black/40 p-3 transition-colors hover:border-white/30"
                    >
                      <span className="font-cyber flex items-center justify-between gap-2 text-sm text-white/85 transition-colors group-hover:text-[var(--neon-cyan)]">
                        Архив фрагментов
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-[var(--neon-cyan)]" aria-hidden />
                      </span>
                      <span className="font-mono-cyber mt-1 block text-[9px] uppercase tracking-[0.2em] text-white/35">
                        все эпизоды цикла
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </Reveal>

            {/* текст фрагмента */}
            <div>
              <Reveal>
                <p className={`font-mono-cyber border border-white/10 bg-black/60 px-4 py-3 text-xs tracking-[0.1em] ${ACCENT_TEXT[e.accent]}`}>
                  <Typewriter text={`> daro://fragments/${e.slug} · расшифровка завершена · чтение разрешено`} />
                </p>
              </Reveal>

              {e.sections.map((section, si) => (
                <Reveal key={si} className="mt-12">
                  {section.title && (
                    <div className="flex items-center gap-4">
                      <span className={`font-display text-3xl ${ACCENT_TEXT[e.accent]} opacity-50`}>
                        {String(si + 1).padStart(2, "0")}
                      </span>
                      <h2 className="font-display text-2xl uppercase tracking-wide text-white sm:text-3xl">
                        {section.title}
                      </h2>
                      <span className="h-px flex-1 bg-white/10" aria-hidden />
                    </div>
                  )}
                  {!section.title && (
                    <div className="flex items-center gap-4">
                      <span className={`font-display text-3xl ${ACCENT_TEXT[e.accent]} opacity-50`}>
                        {String(si + 1).padStart(2, "0")}
                      </span>
                      <span className="h-px flex-1 bg-white/10" aria-hidden />
                    </div>
                  )}

                  <div className="mt-6 space-y-5">
                    {section.paragraphs.map((p, pi) => (
                      <p
                        key={pi}
                        className={`font-cyber leading-relaxed ${
                          p.length <= 40
                            ? "text-base font-bold text-white/90 sm:text-lg"
                            : "text-sm text-white/75 sm:text-base"
                        }`}
                      >
                        {p}
                      </p>
                    ))}
                  </div>

                  {section.log && (
                    <div className="mt-6 space-y-3">
                      {section.log.map((line) => (
                        <div
                          key={line.speaker + line.text}
                          className={`border bg-black/60 px-4 py-3 ${ACCENT_BORDER[e.accent]}`}
                        >
                          <p className="font-mono-cyber flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] opacity-80">
                            <ScrollText className="h-3 w-3" aria-hidden />
                            {line.speaker}
                          </p>
                          <p className="font-mono-cyber mt-1.5 text-xs leading-relaxed tracking-[0.08em] text-white/85">
                            «{line.text}»
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </Reveal>
              ))}

              {e.note && (
                <Reveal className="mt-12">
                  <p className="font-cyber border-l-2 border-white/15 pl-4 text-sm italic leading-relaxed text-white/55 sm:text-base">
                    {e.note}
                  </p>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* цитата */}
      <section className="relative border-t border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <TerminalQuote text={e.terminalQuote.text} source={e.terminalQuote.source} accent={e.accent} />
        </div>
      </section>

      {/* навигация по фрагментам */}
      <section className="relative border-t border-white/10 py-10">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 sm:px-6">
          {prev ? (
            <Link
              href={prev.href}
              className="group flex items-center gap-3 border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/25"
            >
              <ArrowLeft className="h-4 w-4 text-white/40 transition-transform group-hover:-translate-x-1" aria-hidden />
              <span>
                <span className="font-mono-cyber block text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Предыдущий фрагмент
                </span>
                <span className="font-cyber text-sm text-white/80">{prev.title}</span>
              </span>
            </Link>
          ) : (
            <Link
              href={`/books/${b.slug}`}
              className="group flex items-center gap-3 border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/25"
            >
              <BookOpen className="h-4 w-4 text-white/40 transition-transform group-hover:-translate-x-1" aria-hidden />
              <span>
                <span className="font-mono-cyber block text-[10px] uppercase tracking-[0.3em] text-white/40">
                  К книге
                </span>
                <span className="font-cyber text-sm text-white/80">«{b.title}»</span>
              </span>
            </Link>
          )}
          {next ? (
            <Link
              href={next.href}
              className="group flex items-center justify-end gap-3 border border-white/10 bg-white/[0.03] p-5 text-right transition-colors hover:border-white/25"
            >
              <span>
                <span className="font-mono-cyber block text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Следующий фрагмент
                </span>
                <span className="font-cyber text-sm text-white/80">{next.title}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-white/40 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          ) : (
            <span aria-hidden className="hidden sm:block" />
          )}
        </div>
      </section>
    </main>
  );
}

export function excerptMeta(e: Excerpt) {
  // OG-картинка эпизода: public/covers/og-excerpts/<slug>.png
  // (генератор — scripts/make-og.py, блок excerpts_main).
  const og = `/covers/og-excerpts/${e.slug}.png`;
  const ogAlt = `${e.title} — фрагмент «Истории Даро»`;
  return {
    title: `${e.title} — фрагмент «Истории Даро»`,
    description: e.lead,
    alternates: { canonical: `/excerpts/${e.slug}` },
    openGraph: {
      title: `${e.title} — фрагмент «Истории Даро»`,
      description: e.lead,
      images: [{ url: og, width: 1200, height: 630, alt: ogAlt }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: e.title,
      description: e.lead,
      images: [og],
    },
  };
}
