"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FolderOpen, ScrollText } from "lucide-react";
import { StatBar, Typewriter } from "@/components/cyber";
import { sfx } from "@/lib/sfx";
import type { Accent, DossierFile } from "@/lib/content";

/* ============================================================
   Консоль досье на /world: реестр файлов (город + семь
   корпораций) слева, панель дела справа. Переключение файла —
   дешифровка имени, перепечатка адреса, анимация панели.
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

/** Посимвольная «дешифровка»: мусорные символы сходятся к цели. */
function useScramble(target: string): string {
  const [out, setOut] = useState(target);
  useEffect(() => {
    const pool = "01<>/#%&@АБВГДЖЗИКЛМНОПРСТУФХЦЧШЭЮЯ";
    let frame = 0;
    const total = 12;
    const iv = setInterval(() => {
      sfx("type");
      frame += 1;
      const keep = Math.floor((target.length * frame) / total);
      if (keep >= target.length) {
        setOut(target);
        clearInterval(iv);
        return;
      }
      let s = target.slice(0, keep);
      for (let i = keep; i < target.length; i++) {
        const ch = target[i];
        s += ch === " " ? " " : pool[Math.floor(Math.random() * pool.length)];
      }
      setOut(s);
    }, 36);
    return () => clearInterval(iv);
  }, [target]);
  return out;
}

export function DossierConsole({ files }: { files: DossierFile[] }) {
  const [activeId, setActiveId] = useState(files[0]?.id ?? "");
  const active = files.find((f) => f.id === activeId) ?? files[0];
  const activeIndex = files.findIndex((f) => f.id === active.id);
  const decodedName = useScramble(active.name);

  return (
    <div className="grid gap-6 lg:grid-cols-[290px_1fr]">
      {/* реестр файлов */}
      <div
        role="tablist"
        aria-label="Реестр досье Хи-Мигаты"
        className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-px lg:overflow-visible lg:pb-0"
      >
        {files.map((f, i) => {
          const isActive = f.id === active.id;
          return (
            <button
              key={f.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                sfx("glitch");
                setActiveId(f.id);
              }}
              className={`shrink-0 border px-4 py-3 text-left transition-colors duration-200 lg:w-full ${
                isActive
                  ? `border-white/30 bg-white/[0.06] ${ACCENT_TEXT[f.accent]}`
                  : "border-white/10 bg-white/[0.02] text-white/55 hover:border-white/25 hover:text-white/85"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    isActive ? ACCENT_DOT[f.accent] : "bg-white/20"
                  }`}
                  aria-hidden
                />
                <span className="font-display text-base uppercase tracking-wide">{f.name}</span>
              </span>
              <span className="font-mono-cyber mt-1.5 block text-[9px] uppercase tracking-[0.25em] text-white/35">
                {f.id} · {f.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* панель дела */}
      <div
        role="tabpanel"
        aria-label={`Досье: ${active.name}`}
        className={`relative border ${ACCENT_BORDER[active.accent]} bg-black/40 p-6 backdrop-blur-sm sm:p-9`}
      >
        {/* адрес файла */}
        <p
          className={`font-mono-cyber text-[10px] tracking-[0.12em] sm:text-xs ${ACCENT_TEXT[active.accent]}`}
        >
          <Typewriter
            key={active.id}
            text={`> daro://dossier/${active.id.toLowerCase()} · дело № ${String(activeIndex).padStart(2, "0")} · доступ подтверждён`}
          />
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="mt-6"
          >
            {/* шапка дела */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-3xl uppercase leading-none tracking-wide text-white sm:text-4xl">
                  {decodedName}
                </h3>
                <p
                  className={`font-mono-cyber mt-3 text-[10px] uppercase tracking-[0.25em] ${ACCENT_TEXT[active.accent]}`}
                >
                  {active.role}
                </p>
              </div>
              <span className="font-mono-cyber flex items-center gap-2 border border-white/15 bg-black/60 px-3 py-1.5 text-[9px] uppercase tracking-[0.25em] text-white/70">
                <span
                  className={`pulse-dot h-1.5 w-1.5 rounded-full ${ACCENT_DOT[active.accent]}`}
                  aria-hidden
                />
                {active.status}
              </span>
            </div>

            {/* шкала */}
            <div className="mt-7 max-w-md">
              <StatBar
                label={active.threatLabel}
                value={active.threat}
                color={active.accent}
              />
            </div>

            {/* активы */}
            <div className="mt-7 grid gap-2 sm:grid-cols-2">
              {active.assets.map((a) => (
                <p
                  key={a}
                  className="font-cyber flex items-start gap-2.5 border border-white/10 bg-white/[0.02] px-3.5 py-2.5 text-sm leading-relaxed text-white/75"
                >
                  <FolderOpen
                    className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${ACCENT_TEXT[active.accent]} opacity-80`}
                    aria-hidden
                  />
                  {a}
                </p>
              ))}
            </div>

            {/* текст дела */}
            <p className="font-cyber mt-7 text-sm leading-relaxed text-white/75 sm:text-base">
              {active.text}
            </p>

            {/* перехват */}
            <div className={`mt-7 border ${ACCENT_BORDER[active.accent]} bg-black/60 px-4 py-3`}>
              <p className="font-mono-cyber flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-white/50">
                <ScrollText className={`h-3 w-3 ${ACCENT_TEXT[active.accent]}`} aria-hidden />
                Перехват · {active.log.speaker}
              </p>
              <p className="font-mono-cyber mt-1.5 text-xs leading-relaxed tracking-[0.08em] text-white/85">
                «{active.log.text}»
              </p>
            </div>

            <p className="font-mono-cyber mt-6 text-[9px] uppercase tracking-[0.25em] text-white/30">
              Файл собран из перехватов и полевых записей. Официальные источники данные отрицают.
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
