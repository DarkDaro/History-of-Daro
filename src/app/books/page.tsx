import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero, Chip, TerminalQuote } from "@/components/blocks";
import { Reveal } from "@/components/cyber";
import { BOOKS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Книги цикла",
  description:
    "Три тома цикла «История Даро»: «Красный сдвиг» (готов к публикации), «Стеклянные небеса» (редактура), «Пепел и неон» (в работе). Антиутопия, боевик, неонуар.",
  alternates: { canonical: "/books" },
};

export default function BooksPage() {
  return (
    <main className="min-h-screen bg-[#05050a] text-white">
      <PageHero
        kicker="Каталог цикла · 3 тома"
        title="Книги"
        lead="Замысел — от трёх до пяти романов. Первый готов к публикации, второй завершён и проходит редактуру, третий в работе. Каждый том можно открыть отдельно: аннотация, узлы сюжета и место в общей войне."
        breadcrumb={[{ href: "/books", label: "Книги" }]}
      />

      <section className="relative py-20 sm:py-24">
        <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6">
          {BOOKS.map((book, i) => (
            <Reveal key={book.slug} delay={i * 0.05}>
              <article className="group relative grid gap-8 border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:border-white/25 sm:p-8 lg:grid-cols-[280px_1fr]">
                {/* обложка */}
                <Link
                  href={`/books/${book.slug}`}
                  className="relative block aspect-[3/4] w-full max-w-[280px] overflow-hidden border border-white/10"
                >
                  <Image
                    src={book.cover}
                    alt={`Обложка тома «${book.title}»`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 280px"
                    className="cover-tone object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="font-mono-cyber absolute left-3 top-3 border border-white/20 bg-black/70 px-3 py-1.5 text-[10px] tracking-[0.3em]">
                    {book.volume}
                  </span>
                  <span
                    aria-hidden
                    className="ghost-num font-display absolute -bottom-3 right-3 z-20 text-6xl"
                  >
                    {book.code}
                  </span>
                </Link>

                {/* текст */}
                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-3xl uppercase tracking-wide">{book.title}</h2>
                    <Chip accent={book.accent}>{book.status}</Chip>
                  </div>
                  <p className="font-mono-cyber mt-2 text-[10px] uppercase tracking-[0.25em] text-white/40">
                    {book.pages} · {book.tags.join(" ")}
                  </p>
                  <p className="font-cyber mt-5 text-base leading-relaxed text-white/80">
                    {book.logline}
                  </p>
                  <p className="font-cyber mt-4 text-sm leading-relaxed text-white/55">
                    {book.synopsis[0]}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <Link
                      href={`/books/${book.slug}`}
                      className="btn-beam inline-flex items-center gap-2 border border-white/15 bg-white/5 px-6 py-3 font-mono-cyber text-xs uppercase tracking-widest text-white/80 transition-colors hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]"
                    >
                      Открыть том
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}

          <Reveal>
            <div className="beam-border-static p-8 text-center">
              <p className="font-mono-cyber text-xs uppercase tracking-[0.35em] text-white/40">
                ТОМ IV+ {"//"} СЮЖЕТ КЛАССИФИЦИРОВАН
              </p>
              <p className="font-cyber mt-2 text-sm text-white/55">
                Цикл задуман на 3–5 романов. Новые тома появятся здесь — следите за сигналом.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative border-t border-white/10 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <TerminalQuote
            text="Война не окончена. Она просто сменила владельца."
            source="ПЕПЕЛ И НЕОН · ТИЗЕР"
          />
        </div>
      </section>
    </main>
  );
}
