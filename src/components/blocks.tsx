import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Accent } from "@/lib/content";
import { Corners, Reveal } from "@/components/cyber";

/* ============================================================
   Серверные UI-блоки, общие для всех страниц.
   ============================================================ */

const ACCENT_TEXT: Record<Accent, string> = {
  cyan: "text-[var(--neon-cyan)]",
  magenta: "text-[var(--neon-magenta)]",
  amber: "text-[var(--neon-amber)]",
};

const ACCENT_NEON: Record<Accent, string> = {
  cyan: "neon-cyan",
  magenta: "neon-magenta",
  amber: "text-[var(--neon-amber)]",
};

const ACCENT_BORDER: Record<Accent, string> = {
  cyan: "border-[var(--neon-cyan)]/50 text-[var(--neon-cyan)]",
  magenta: "border-[var(--neon-magenta)]/50 text-[var(--neon-magenta)]",
  amber: "border-[var(--neon-amber)]/50 text-[var(--neon-amber)]",
};

const ACCENT_DOT: Record<Accent, string> = {
  cyan: "bg-[var(--neon-cyan)]",
  magenta: "bg-[var(--neon-magenta)]",
  amber: "bg-[var(--neon-amber)]",
};

const ACCENT_LINE: Record<Accent, string> = {
  cyan: "bg-[var(--neon-cyan)] shadow-[0_0_12px_var(--neon-cyan)]",
  magenta: "bg-[var(--neon-magenta)] shadow-[0_0_12px_var(--neon-magenta)]",
  amber: "bg-[var(--neon-amber)] shadow-[0_0_12px_var(--neon-amber)]",
};

export { ACCENT_TEXT, ACCENT_NEON, ACCENT_BORDER, ACCENT_DOT };

export function Chip({ children, accent }: { children: string; accent: Accent }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border bg-black/50 px-2.5 py-1 font-mono-cyber text-[9px] uppercase tracking-[0.25em] ${ACCENT_BORDER[accent]}`}
    >
      <span className={`pulse-dot h-1 w-1 rounded-full ${ACCENT_DOT[accent]}`} aria-hidden />
      {children}
    </span>
  );
}

export function SectionHeading({
  kicker,
  title,
  num,
  accent = "cyan",
}: {
  kicker: string;
  title: string;
  num: string;
  accent?: Accent;
}) {
  return (
    <Reveal className="relative mb-14 text-center">
      <span
        aria-hidden
        className="ghost-num font-display pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[110px] sm:text-[150px]"
      >
        {num}
      </span>
      <p
        className={`font-mono-cyber relative text-xs uppercase tracking-[0.4em] ${ACCENT_NEON[accent]}`}
      >
        {num} / {kicker}
      </p>
      <h2 className="font-display relative mt-3 text-3xl uppercase tracking-wide text-white sm:text-5xl">
        {title}
      </h2>
      <div className={`relative mx-auto mt-5 h-px w-24 ${ACCENT_LINE[accent]}`} />
    </Reveal>
  );
}

/** Шапка внутренней страницы: путь-«хлебная крошка», glitch-заголовок, лид */
export function PageHero({
  kicker,
  title,
  glitch = false,
  lead,
  accent = "cyan",
  breadcrumb,
}: {
  kicker: string;
  title: string;
  glitch?: boolean;
  lead?: string;
  accent?: Accent;
  breadcrumb?: { href: string; label: string }[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 pb-16 pt-32 sm:pb-20 sm:pt-36">
      <div className="cyber-grid absolute inset-0 opacity-[0.06]" aria-hidden />
      <div className="aurora-blob cyan left-[6%] top-[8%] h-64 w-64 opacity-60" aria-hidden />
      <div className="aurora-blob magenta bottom-[-10%] right-[4%] h-72 w-72 opacity-50" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        {breadcrumb && (
          <nav aria-label="Навигация по разделу" className="font-mono-cyber mb-6 text-[10px] uppercase tracking-[0.3em] text-white/40">
            <Link href="/" className="transition-colors hover:text-[var(--neon-cyan)]">
              Главная
            </Link>
            {breadcrumb.map((b) => (
              <span key={b.href}>
                {" "}
                <span className="text-white/25">{"//"}</span>{" "}
                <Link href={b.href} className="transition-colors hover:text-[var(--neon-cyan)]">
                  {b.label}
                </Link>
              </span>
            ))}
          </nav>
        )}
        <Reveal>
          <p className={`font-mono-cyber text-xs uppercase tracking-[0.4em] ${ACCENT_NEON[accent]}`}>
            {kicker}
          </p>
          <h1
            className="font-display mt-4 text-4xl uppercase leading-tight text-white sm:text-6xl"
            {...(glitch ? { "data-text": title } : {})}
          >
            {glitch ? <span className="glitch" data-text={title}>{title}</span> : title}
          </h1>
          {lead && (
            <p className="font-cyber mt-6 max-w-3xl text-base leading-relaxed text-white/70 sm:text-lg">
              {lead}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/** «Окно терминала» с цитатой */
export function TerminalQuote({
  text,
  source,
  accent = "magenta",
}: {
  text: string;
  source: string;
  accent?: Accent;
}) {
  return (
    <Reveal className="relative mx-auto max-w-3xl">
      <Corners color={accent} />
      <div className="beam-border-static">
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--neon-magenta)]/70" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--neon-amber)]/70" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--neon-cyan)]/70" aria-hidden />
          <span className="font-mono-cyber ml-3 text-[10px] uppercase tracking-[0.3em] text-white/40">
            {source}
          </span>
        </div>
        <div className="p-6 sm:p-8">
          <p className="font-cyber text-lg italic leading-relaxed text-white/85 sm:text-xl">
            «{text}»
          </p>
          <cite className="font-mono-cyber mt-4 block text-xs uppercase not-italic tracking-[0.3em] text-white/50">
            — {source}
          </cite>
        </div>
      </div>
    </Reveal>
  );
}

/** Кнопка-ссылка «Читать далее» */
export function MoreLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="btn-beam group inline-flex items-center gap-2 border border-white/15 bg-white/5 px-5 py-3 font-mono-cyber text-xs uppercase tracking-widest text-white/80 transition-colors hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]"
    >
      {children}
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}

/** Широкий кадр-«реконструкция сцены» для страницы раздела. */
export function SceneBanner({
  src,
  alt,
  caption,
  accent = "cyan",
  priority = false,
}: {
  src: string;
  alt: string;
  caption: string;
  accent?: Accent;
  priority?: boolean;
}) {
  return (
    <Reveal className="relative">
      <Corners color={accent} />
      <div className="relative aspect-[21/9] overflow-hidden border border-white/10 sm:aspect-[2/1]">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="cover-tone object-cover"
        />
        <div className="scanlines-box pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05050a] via-transparent to-[#05050a]/40" />
        <p className="font-mono-cyber absolute bottom-3 left-3 border border-white/15 bg-black/70 px-3 py-1.5 text-[9px] uppercase tracking-[0.3em] text-white/60">
          {caption}
        </p>
      </div>
    </Reveal>
  );
}
