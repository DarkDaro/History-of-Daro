import Link from "next/link";
import { ArrowLeft, ArrowRight, FileWarning } from "lucide-react";
import { PageHero, SceneBanner, TerminalQuote } from "@/components/blocks";
import { Corners, Reveal } from "@/components/cyber";
import type { Chronicle } from "@/lib/content";

/* ============================================================
   Детальная страница хроники: файл фрагмента, сцены,
   системные логи, связанные файлы, навигация по разделу.
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

export function ChronicleDetail({
  chronicle,
  prev,
  next,
}: {
  chronicle: Chronicle;
  prev?: { href: string; title: string };
  next?: { href: string; title: string };
}) {
  const c = chronicle;

  return (
    <main className="min-h-screen bg-[#05050a] text-white">
      <PageHero
        kicker={`${c.code} · ${c.subtitle}`}
        title={c.title}
        glitch
        lead={c.lead}
        accent={c.accent}
        breadcrumb={[
          { href: "/chronicles", label: "Хроники" },
          { href: `/chronicles/${c.slug}`, label: c.code },
        ]}
      />

      {/* реконструкция сцены */}
      {c.cover && (
        <section className="relative pb-6 pt-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SceneBanner
              src={c.cover}
              alt={`Реконструкция сцены хроники ${c.code}: ${c.title}`}
              caption={`${c.code} · РЕКОНСТРУКЦИЯ ПО ЗАПИСИ ОБЪЕКТА · ТОЧНОСТЬ 87%`}
              accent={c.accent}
              priority
            />
          </div>
        </section>
      )}

      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
            {/* файл фрагмента */}
            <Reveal className="space-y-6">
              <div className="relative">
                <Corners color={c.accent} />
                <div className="beam-border-static p-5">
                  <p className="font-mono-cyber text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Файл фрагмента
                  </p>
                  <dl className="mt-4 space-y-3">
                    <div className="border-b border-white/5 pb-2">
                      <dt className="font-mono-cyber text-[10px] uppercase tracking-[0.2em] text-white/45">Код</dt>
                      <dd className={`font-display mt-1 text-lg ${ACCENT_TEXT[c.accent]}`}>{c.code}</dd>
                    </div>
                    <div className="border-b border-white/5 pb-2">
                      <dt className="font-mono-cyber text-[10px] uppercase tracking-[0.2em] text-white/45">Источник</dt>
                      <dd className="font-cyber mt-1 text-sm text-white/85">{c.sourceLabel}</dd>
                    </div>
                    <div className="border-b border-white/5 pb-2">
                      <dt className="font-mono-cyber text-[10px] uppercase tracking-[0.2em] text-white/45">Статус</dt>
                      <dd className={`font-mono-cyber mt-1 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] ${ACCENT_TEXT[c.accent]}`}>
                        <span className={`pulse-dot h-1.5 w-1.5 rounded-full ${ACCENT_DOT[c.accent]}`} aria-hidden />
                        {c.status}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* связанные файлы */}
              <div className="border border-white/10 bg-white/[0.03] p-5">
                <p className="font-mono-cyber text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Связанные файлы
                </p>
                <ul className="mt-4 space-y-3">
                  {c.related.map((r) => (
                    <li key={r.href + r.label}>
                      <Link
                        href={r.href}
                        className="group block border border-white/10 bg-black/40 p-3 transition-colors hover:border-white/30"
                      >
                        <span className="font-cyber flex items-center justify-between gap-2 text-sm text-white/85 transition-colors group-hover:text-[var(--neon-cyan)]">
                          {r.label}
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-[var(--neon-cyan)]" aria-hidden />
                        </span>
                        <span className="font-mono-cyber mt-1 block text-[9px] uppercase tracking-[0.2em] text-white/35">
                          {r.note}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* текст фрагмента */}
            <div>
              <Reveal>
                <p className={`font-mono-cyber text-xs uppercase tracking-[0.4em] ${ACCENT_TEXT[c.accent]}`}>
                  Расшифрованная запись
                </p>
                <div className="mt-6 space-y-5">
                  {c.intro.map((para, i) => (
                    <p
                      key={i}
                      className="font-cyber border-l-2 border-white/15 pl-4 text-sm italic leading-relaxed text-white/55 sm:text-base"
                    >
                      {para}
                    </p>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {c.tags.map((tag) => (
                    <span key={tag} className="font-mono-cyber border border-white/15 px-2 py-1 text-[10px] text-white/50">
                      {tag}
                    </span>
                  ))}
                </div>
              </Reveal>

              {/* сцены */}
              {c.scenes.map((scene, si) => (
                <Reveal key={scene.title} className="mt-14">
                  <div className="flex items-center gap-4">
                    <span className={`font-display text-3xl ${ACCENT_TEXT[c.accent]} opacity-50`}>
                      {String(si + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-display text-2xl uppercase tracking-wide text-white sm:text-3xl">
                      {scene.title}
                    </h2>
                    <span className="h-px flex-1 bg-white/10" aria-hidden />
                  </div>

                  <div className="mt-6 space-y-5">
                    {scene.paragraphs.map((p, pi) => (
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

                  {scene.log && (
                    <div className="mt-6 space-y-3">
                      {scene.log.map((line) => (
                        <div
                          key={line.speaker + line.text}
                          className={`border bg-black/60 px-4 py-3 ${ACCENT_BORDER[c.accent]}`}
                        >
                          <p className="font-mono-cyber flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] opacity-80">
                            <FileWarning className="h-3 w-3" aria-hidden />
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

              {/* финальная строка */}
              <Reveal className="mt-14">
                <p className="font-cyber border-t border-white/10 pt-6 text-base italic leading-relaxed text-white/80 sm:text-lg">
                  {c.outro}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* цитата */}
      <section className="relative border-t border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <TerminalQuote text={c.terminalQuote.text} source={c.terminalQuote.source} accent={c.accent} />
        </div>
      </section>

      {/* навигация по хроникам */}
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
                  Предыдущий файл
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
                  Следующий файл
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

export function chronicleMeta(c: Chronicle) {
  return {
    title: `${c.code} — «${c.title}»`,
    description: c.lead,
    alternates: { canonical: `/chronicles/${c.slug}` },
  };
}
