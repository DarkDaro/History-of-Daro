"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Counter, Reveal } from "@/components/cyber";
import { ACCENT_NEON, ACCENT_TEXT, Chip, TerminalQuote } from "@/components/blocks";
import { type Accent, type HomepageBlock, TIMELINE, WEAPON_SPECS, WORLD_STATS } from "@/lib/content";

/* ============================================================
   ИСТОРИЯ ДАРО — рендер блоков-из-контента главной (C2 ROADMAP).
   Источник секций — HOMEPAGE_BLOCKS в src/content/home.ts:
   порядок массива = порядок секций на странице. Новый вид блока
   добавляется здесь, включается правкой конфига — без кода.
   ============================================================ */

function BlockHead({
  kicker,
  title,
  accent,
  href,
  linkLabel,
}: {
  kicker: string;
  title: string;
  accent: Accent;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <Reveal className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className={`font-mono-cyber text-xs uppercase tracking-[0.4em] ${ACCENT_NEON[accent]}`}>
          {kicker}
        </p>
        <h2 className="font-display mt-3 text-3xl uppercase tracking-wide text-white sm:text-4xl">
          {title}
        </h2>
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="font-mono-cyber inline-flex items-center py-3 -my-3 text-xs uppercase tracking-[0.25em] text-white/50 transition-colors hover:text-[var(--neon-cyan)]"
        >
          {linkLabel} <span aria-hidden>→</span>
        </Link>
      )}
    </Reveal>
  );
}

function StatsBlock({ block }: { block: Extract<HomepageBlock, { kind: "stats" }> }) {
  const limit = block.limit ?? 4;
  return (
    <>
      <BlockHead
        kicker={block.kicker}
        title={block.title}
        accent={block.accent}
        href={block.href}
        linkLabel={block.linkLabel}
      />
      <Reveal>
        <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 lg:grid-cols-4">
          {WORLD_STATS.slice(0, limit).map((s) => (
            <div key={s.label} className="bg-[#0a0a16] p-6 text-center sm:p-8">
              <p className={`neon-breathe font-display text-3xl sm:text-4xl ${ACCENT_NEON[block.accent]}`}>
                <Counter to={s.to} suffix={s.suffix} group={s.group} />
              </p>
              <p className="font-mono-cyber mt-2 text-[9px] uppercase tracking-[0.25em] text-white/45 sm:text-[10px]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </>
  );
}

function TimelineBlock({ block }: { block: Extract<HomepageBlock, { kind: "timeline" }> }) {
  const events = TIMELINE.filter((e) => !e.classified).slice(0, block.limit ?? 3);
  return (
    <>
      <BlockHead
        kicker={block.kicker}
        title={block.title}
        accent={block.accent}
        href={block.href}
        linkLabel={block.linkLabel}
      />
      <div className="space-y-4">
        {events.map((e, i) => (
          <Reveal key={e.id} delay={i * 0.08}>
            <article className="group relative border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-colors hover:border-white/25 sm:p-6">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className={`font-mono-cyber text-[10px] uppercase tracking-[0.3em] ${ACCENT_TEXT[block.accent]}`}>
                  {e.when}
                </span>
                <h3 className="font-display text-lg uppercase tracking-wide text-white">{e.title}</h3>
              </div>
              <p className="font-cyber mt-3 text-sm leading-relaxed text-white/65">{e.text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </>
  );
}

function ArsenalBlock({ block }: { block: Extract<HomepageBlock, { kind: "arsenal" }> }) {
  const items = WEAPON_SPECS.filter((w) => (block.group ? w.group === block.group : true)).slice(
    0,
    block.limit ?? 3,
  );
  return (
    <>
      <BlockHead
        kicker={block.kicker}
        title={block.title}
        accent={block.accent}
        href={block.href}
        linkLabel={block.linkLabel}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((w, i) => (
          <Reveal key={w.name} delay={i * 0.08}>
            <article className="flex h-full flex-col border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-colors hover:border-white/25">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg uppercase tracking-wide text-white">{w.name}</h3>
                <Chip accent={w.accent}>{w.owner}</Chip>
              </div>
              <p className="font-mono-cyber mt-2 text-[10px] uppercase tracking-[0.25em] text-white/45">
                {w.group} · {w.kind}
              </p>
              <dl className="mt-4 space-y-1.5">
                {w.specs.slice(0, 2).map((s) => (
                  <div key={s.label} className="flex justify-between gap-4 text-sm">
                    <dt className="font-cyber text-white/50">{s.label}</dt>
                    <dd className="font-cyber text-right text-white/80">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          </Reveal>
        ))}
      </div>
    </>
  );
}

function LinksBlock({ block }: { block: Extract<HomepageBlock, { kind: "links" }> }) {
  return (
    <>
      <BlockHead
        kicker={block.kicker}
        title={block.title}
        accent={block.accent}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {block.items.map((it, i) => (
          <Reveal key={`${it.href}-${it.title}`} delay={i * 0.08}>
            <Link
              href={it.href}
              className="group block h-full border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:border-white/25"
            >
              <h3 className="font-display text-xl uppercase tracking-wide text-white">{it.title}</h3>
              <p className="font-cyber mt-3 text-sm leading-relaxed text-white/65">{it.text}</p>
              <span
                className={`font-mono-cyber mt-5 inline-block text-[10px] uppercase tracking-[0.3em] ${ACCENT_TEXT[it.accent]}`}
              >
                Перейти <ArrowRight className="ml-1 inline h-3 w-3 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </>
  );
}

function renderBlock(block: HomepageBlock) {
  switch (block.kind) {
    case "stats":
      return <StatsBlock block={block} />;
    case "timeline":
      return <TimelineBlock block={block} />;
    case "arsenal":
      return <ArsenalBlock block={block} />;
    case "quote":
      return <TerminalQuote text={block.text} source={block.source} accent={block.accent} />;
    case "links":
      return <LinksBlock block={block} />;
  }
}

export function HomeBlocks({ blocks }: { blocks: HomepageBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <section
          key={`${block.kind}-${i}`}
          className="relative border-t border-white/10 py-20 sm:py-24"
          aria-label={`Блок главной: ${block.kind}`}
        >
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{renderBlock(block)}</div>
        </section>
      ))}
    </>
  );
}
