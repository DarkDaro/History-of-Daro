"use client";

import Link from "next/link";
import type { Accent, Faction } from "@/lib/content";
import { Corners, Reveal } from "@/components/cyber";
import { Chip } from "@/components/blocks";
import { sfx } from "@/lib/sfx";

/* ============================================================
   Блок «Сопротивление и независимые» на /corporations.
   Данные — RESISTANCE_GROUPS (content.ts): фракция попадает
   сюда автоматически, если у неё outside: true.

   Карточки статичные: полные файлы групп лежат в досье мира
   (/world), здесь — сводка реестра «Периметра Зеро».
   ============================================================ */

const ACCENT_TEXT: Record<Accent, string> = {
  cyan: "neon-cyan",
  magenta: "neon-magenta",
  amber: "text-[var(--neon-amber)]",
};

/* Все hover-классы — литералами: Tailwind не видит шаблонные строки. */
const ACCENT_HOVER: Record<Accent, string> = {
  cyan: "hover:border-[var(--neon-cyan)]/40",
  magenta: "hover:border-[var(--neon-magenta)]/40",
  amber: "hover:border-[var(--neon-amber)]/40",
};

/** Смежные файлы на карточке: ключ — id фракции в FACTIONS.
 *  Добавил группу в content.ts — строка здесь даёт ей ссылки.
 *  Без строки карточка просто без ссылок. */
const RESISTANCE_LINKS: Record<string, { href: string; label: string }[]> = {
  PZ: [
    { href: "/characters", label: "Личные дела: Лина и соратники" },
    { href: "/chronicles", label: "Хроники: перехваты" },
  ],
  SC: [
    { href: "/armory", label: "Арсенал: машины Скорпиона" },
    { href: "/timeline", label: "Таймлайн 2147" },
  ],
  DK: [
    { href: "/implants", label: "Импланты чёрного рынка" },
    { href: "/world", label: "Досье мира" },
  ],
};

export function ResistanceGrid({ items }: { items: Faction[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f, i) => {
        const links = RESISTANCE_LINKS[f.id];
        return (
        <Reveal key={f.id} delay={(i % 3) * 0.08}>
          <article
            onMouseEnter={() => sfx("hover")}
            className={`relative h-full border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors sm:p-7 ${ACCENT_HOVER[f.accent]}`}
          >
            <Corners color={f.accent} />
            <div className="flex items-center justify-between gap-3">
              <Chip accent={f.accent}>{f.tag}</Chip>
              <span className="font-mono-cyber shrink-0 text-[10px] uppercase tracking-[0.25em] text-white/35">
                вне реестра
              </span>
            </div>
            <h3 className="font-display mt-5 text-2xl uppercase tracking-wide">{f.name}</h3>
            <p
              className={`font-mono-cyber mt-1.5 text-[10px] uppercase tracking-[0.2em] ${ACCENT_TEXT[f.accent]}`}
            >
              {f.role}
            </p>
            <p className="font-cyber mt-4 text-sm leading-relaxed text-white/70">{f.text}</p>
            {f.log && (
              <div className="mt-5 border-l-2 border-white/15 bg-black/30 py-3 pl-4 pr-3">
                <p className="font-mono-cyber text-[9px] uppercase tracking-[0.3em] text-white/40">
                  ▸ перехват · {f.log.speaker}
                </p>
                <p className="font-mono-cyber mt-1.5 text-xs leading-relaxed text-white/65">
                  «{f.log.text}»
                </p>
              </div>
            )}
            {links && (
              <div className="mt-5 border-t border-white/5 pt-4">
                <p className="font-mono-cyber text-[9px] uppercase tracking-[0.3em] text-white/35">
                  Смежные файлы
                </p>
                <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
                  {links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="font-mono-cyber text-[10px] uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-[var(--neon-cyan)]"
                    >
                      → {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        </Reveal>
        );
      })}
    </div>
  );
}
