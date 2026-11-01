import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHero, Chip, TerminalQuote } from "@/components/blocks";
import { Corners, Reveal } from "@/components/cyber";
import { AUTHOR_NODE, JsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/site";
import type { Book } from "@/lib/content";

/* ============================================================
   Детальная страница тома: обложка, факты, аннотация,
   узлы сюжета, цитата, навигация по циклу.
   ============================================================ */

export function BookDetail({
  book,
  prev,
  next,
}: {
  book: Book;
  prev?: { href: string; title: string };
  next?: { href: string; title: string };
}) {
  const accentText =
    book.accent === "cyan"
      ? "neon-cyan"
      : book.accent === "magenta"
        ? "neon-magenta"
        : "text-[var(--neon-amber)]";

  return (
    <main className="min-h-screen bg-[#05050a] text-white">
      {/* Schema.org: конкретный том серии */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Book",
          name: `«${book.title}»`,
          alternateName: `${book.volume} · цикл «История Даро»`,
          url: `${SITE_URL}/books/${book.slug}`,
          abstract: book.logline,
          inLanguage: "ru",
          author: AUTHOR_NODE,
          isPartOf: {
            "@type": "BookSeries",
            name: "История Даро",
            url: `${SITE_URL}/books`,
          },
          creativeWorkStatus: book.status,
        }}
      />
      <PageHero
        kicker={`${book.volume} · ${book.status}`}
        title={book.title}
        glitch
        lead={book.logline}
        accent={book.accent}
        breadcrumb={[
          { href: "/books", label: "Книги" },
          { href: `/books/${book.slug}`, label: book.volume },
        ]}
      />

      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
            {/* обложка + факты */}
            <Reveal className="space-y-6">
              <div className="relative">
                <Corners color={book.accent} />
                <div className="relative aspect-[3/4] overflow-hidden border border-white/10">
                  <Image
                    src={book.cover}
                    alt={`Обложка тома «${book.title}»`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 300px"
                    className="cover-tone object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a16] via-transparent to-transparent" />
                </div>
              </div>
              <div className="border border-white/10 bg-white/[0.03] p-5">
                <p className="font-mono-cyber text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Дело тома
                </p>
                <dl className="mt-4 space-y-3">
                  {book.facts.map((f) => (
                    <div key={f.label} className="flex items-baseline justify-between gap-4 border-b border-white/5 pb-2 last:border-0">
                      <dt className="font-mono-cyber text-[10px] uppercase tracking-[0.2em] text-white/45">
                        {f.label}
                      </dt>
                      <dd className="font-cyber text-right text-sm text-white/85">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            {/* аннотация */}
            <div>
              <Reveal>
                <p className={`font-mono-cyber text-xs uppercase tracking-[0.4em] ${accentText}`}>
                  Официальная аннотация
                </p>
                <div className="mt-6 space-y-5">
                  {book.synopsis.map((para, i) => (
                    <p
                      key={i}
                      className={`font-cyber leading-relaxed text-white/75 ${
                        i === 0 ? "text-lg text-white/90 sm:text-xl" : "text-sm sm:text-base"
                      }`}
                    >
                      {para}
                    </p>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {book.tags.map((tag) => (
                    <span key={tag} className="font-mono-cyber border border-white/15 px-2 py-1 text-[10px] text-white/50">
                      {tag}
                    </span>
                  ))}
                </div>
              </Reveal>

              {/* узлы сюжета */}
              {book.acts && (
                <Reveal className="mt-14">
                  <p className={`font-mono-cyber text-xs uppercase tracking-[0.4em] ${accentText}`}>
                    Узлы сюжета
                  </p>
                  <div className="relative mt-8 space-y-6 border-l border-white/10 pl-6 sm:pl-8">
                    {book.acts.map((act, i) => (
                      <div key={act.title} className="relative">
                        <span
                          aria-hidden
                          className={`pulse-dot absolute -left-[31px] top-1.5 h-2 w-2 rounded-full sm:-left-[39px] ${
                            book.accent === "cyan"
                              ? "bg-[var(--neon-cyan)]"
                              : book.accent === "magenta"
                                ? "bg-[var(--neon-magenta)]"
                                : "bg-[var(--neon-amber)]"
                          }`}
                        />
                        <p className={`font-mono-cyber text-[11px] uppercase tracking-[0.3em] ${accentText}`}>
                          {act.title}
                        </p>
                        <p className="font-cyber mt-2 text-sm leading-relaxed text-white/70">
                          {act.text}
                        </p>
                        {i === book.acts!.length - 1 && (
                          <span
                            aria-hidden
                            className="absolute -left-px top-8 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-white/20 to-transparent"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}

              {/* для тома без acts — блок статуса */}
              {!book.acts && (
                <Reveal className="mt-14">
                  <div className="beam-border-static p-8 text-center">
                    <p className="font-mono-cyber text-xs uppercase tracking-[0.35em] text-white/40">
                      {book.status.toUpperCase()} {"//"} ДЕТАЛИ ЗАКРЫТЫ
                    </p>
                    <p className="font-cyber mt-3 text-sm text-white/55">
                      Материалы тома появятся на сайте ближе к публикации.
                    </p>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* цитата */}
      <section className="relative border-t border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <TerminalQuote text={book.terminalQuote.text} source={book.terminalQuote.source} accent={book.accent} />
        </div>
      </section>

      {/* навигация по циклу */}
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
                  Предыдущий том
                </span>
                <span className="font-cyber text-sm text-white/80">{prev.title}</span>
              </span>
            </Link>
          ) : (
            <span aria-hidden className="hidden sm:block" />
          )}
          {next ? (
            <Link
              href={next.href}
              className="group flex items-center justify-end gap-3 border border-white/10 bg-white/[0.03] p-5 text-right transition-colors hover:border-white/25"
            >
              <span>
                <span className="font-mono-cyber block text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Следующий том
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

export function bookMeta(book: Book) {
  return {
    title: `${book.volume} — «${book.title}»`,
    description: book.logline,
    alternates: { canonical: `/books/${book.slug}` },
  };
}
