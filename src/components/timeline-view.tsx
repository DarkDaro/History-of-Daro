"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Corners, Typewriter } from "@/components/cyber";
import {
  TIMELINE_ERAS,
  type Accent,
  type TimelineEra,
  type TimelineEvent,
} from "@/lib/content";

/* ============================================================
   Таймлайн 2147: вертикальная хронология с фильтром по эпохам.
   Узел = событие; засекреченные файлы размыты до наведения.
   ============================================================ */

const ACCENT_TEXT: Record<Accent, string> = {
  cyan: "neon-cyan",
  magenta: "neon-magenta",
  amber: "text-[var(--neon-amber)]",
};

const ACCENT_DOT: Record<Accent, string> = {
  cyan: "bg-[var(--neon-cyan)]",
  magenta: "bg-[var(--neon-magenta)]",
  amber: "bg-[var(--neon-amber)]",
};

const ACCENT_BORDER: Record<Accent, string> = {
  cyan: "border-[var(--neon-cyan)]/40",
  magenta: "border-[var(--neon-magenta)]/40",
  amber: "border-[var(--neon-amber)]/40",
};

type Filter = TimelineEra | "all";

export function TimelineView({ events }: { events: TimelineEvent[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? events : events.filter((e) => e.era === filter);

  return (
    <div>
      {/* адрес файла */}
      <p className="font-mono-cyber neon-cyan mb-8 text-[10px] tracking-[0.12em] sm:text-xs">
        <Typewriter text="> daro://timeline/2147 · хронология собрана из реестров, сводок и перехватов" />
      </p>

      {/* фильтр эпох */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Фильтр по эпохам">
        <button
          onClick={() => setFilter("all")}
          aria-pressed={filter === "all"}
          className={`font-mono-cyber border px-4 py-2 text-[10px] uppercase tracking-[0.25em] transition-colors ${
            filter === "all"
              ? "border-white/30 bg-white/[0.06] text-white"
              : "border-white/10 bg-white/[0.02] text-white/50 hover:border-white/25 hover:text-white/80"
          }`}
        >
          Все события
        </button>
        {TIMELINE_ERAS.map((e) => {
          const isActive = filter === e.id;
          return (
            <button
              key={e.id}
              onClick={() => setFilter(e.id)}
              aria-pressed={isActive}
              className={`font-mono-cyber border px-4 py-2 text-[10px] uppercase tracking-[0.25em] transition-colors ${
                isActive
                  ? "border-white/30 bg-white/[0.06] text-white"
                  : "border-white/10 bg-white/[0.02] text-white/50 hover:border-white/25 hover:text-white/80"
              }`}
            >
              {e.label}
            </button>
          );
        })}
      </div>

      {/* линия времени */}
      <div className="relative mt-10" aria-live="polite">
        <span
          className="absolute top-2 bottom-2 left-[7px] w-px bg-gradient-to-b from-white/25 via-white/10 to-transparent sm:left-[9px]"
          aria-hidden
        />
        <div className="space-y-8">
          <AnimatePresence initial={false}>
            {visible.map((ev, i) => (
              <motion.article
                key={ev.id}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: i * 0.04 }}
                className="relative pl-8 sm:pl-12"
              >
                <span
                  className={`absolute top-2.5 left-0 h-[15px] w-[15px] rounded-full border-2 bg-[#05050a] sm:left-0.5 ${ACCENT_BORDER[ev.accent]}`}
                  aria-hidden
                >
                  <span className={`absolute inset-[3px] rounded-full ${ACCENT_DOT[ev.accent]}`} />
                </span>

                <div className="relative border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-7">
                  <Corners color={ev.accent} />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span
                      className={`font-mono-cyber text-[10px] uppercase tracking-[0.3em] ${ACCENT_TEXT[ev.accent]}`}
                    >
                      {ev.when}
                    </span>
                    <span className="font-mono-cyber flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-white/55">
                      {ev.era === "t3" && <Lock className="h-3 w-3" aria-hidden />}
                      {ev.id}
                    </span>
                  </div>
                  <h3 className="font-display mt-3 text-xl uppercase tracking-wide text-white sm:text-2xl">
                    {ev.title}
                  </h3>
                  <p
                    className={`font-cyber mt-3 text-sm leading-relaxed text-white/70 sm:text-base ${
                      ev.classified ? "blur-[3px] transition-all duration-500 hover:blur-none" : ""
                    }`}
                  >
                    {ev.text}
                  </p>
                  {ev.classified && (
                    <p className="font-mono-cyber mt-3 text-[9px] uppercase tracking-[0.3em] text-white/30">
                      Файл засекречен · наведите, чтобы прочитать перехват
                    </p>
                  )}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
