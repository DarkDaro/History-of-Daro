"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, ScrollText, X } from "lucide-react";
import { Corners } from "@/components/cyber";
import { sfx } from "@/lib/sfx";
import type { Accent, Faction } from "@/lib/content";

/* ============================================================
   Реестр корпораций на /corporations: колода карточек и
   корпоративное досье, которое открывается по клику.
   Паттерн тот же, что у личных дел на /characters.

   Данные берутся из CORPORATIONS (content.ts) — автор добавляет
   корпорацию одним блоком в content.ts, страница сама её нарисует.
   ============================================================ */

const ACCENT_TEXT: Record<Accent, string> = {
  cyan: "neon-cyan",
  magenta: "neon-magenta",
  amber: "text-[var(--neon-amber)]",
};

const ACCENT_BORDER: Record<Accent, string> = {
  cyan: "border-[var(--neon-cyan)]/40",
  magenta: "border-[var(--neon-magenta)]/40",
  amber: "border-[var(--neon-amber)]/40",
};

/* Все классы — литералами: Tailwind видит их только в исходнике. */
const ACCENT_BORDER_SOFT: Record<Accent, string> = {
  cyan: "hover:border-[var(--neon-cyan)]/40",
  magenta: "hover:border-[var(--neon-magenta)]/40",
  amber: "hover:border-[var(--neon-amber)]/40",
};

/** Код корпоративного файла — так же их кодирует досье мира (corpFile). */
export function corpFileId(c: Faction): string {
  return `HMD-${c.id}`;
}

/** Перекрёстные ссылки досье: по коду корпорации + общий набор. */
const CORP_LINKS: Record<string, { href: string; label: string }[]> = {
  TD: [
    { href: "/characters", label: "Лица: Сандерс Райз" },
    { href: "/timeline", label: "Таймлайн 2147" },
  ],
  HG: [
    { href: "/world", label: "Досье мира: город" },
    { href: "/timeline", label: "Таймлайн 2147" },
  ],
  BG: [
    { href: "/armory", label: "Вооружение корпораций" },
    { href: "/characters", label: "Личные дела" },
  ],
  SY: [
    { href: "/implants", label: "Импланты «Синтеза»" },
    { href: "/characters", label: "Личные дела" },
  ],
  SP: [{ href: "/world", label: "Перехваты в досье мира" }],
  IS: [{ href: "/world", label: "Повседневность города" }],
  KP: [
    { href: "/world", label: "Досье мира: город" },
    { href: "/chronicles", label: "Хроники города" },
  ],
};

export function CorporationRegistry({ items }: { items: Faction[] }) {
  const [active, setActive] = useState<Faction | null>(null);

  // Блокируем прокрутку страницы, пока открыто досье.
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  // Esc закрывает досье.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        sfx("close");
        setActive(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <div>
      {/* сетка карточек */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.3, delay: (i % 3) * 0.07, ease: "easeOut" }}
          >
            <div
              role="button"
              tabIndex={0}
              aria-label={`Открыть корпоративный файл: ${c.name}`}
              onClick={() => {
                sfx("open");
                setActive(c);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  sfx("open");
                  setActive(c);
                }
              }}
              onMouseEnter={() => sfx("hover")}
              className={`group h-full cursor-pointer border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[var(--neon-cyan)] sm:p-7 ${ACCENT_BORDER_SOFT[c.accent]}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-cyber text-[10px] tracking-[0.3em] text-white/55">
                  {corpFileId(c)}
                </span>
                <CorpMonogram c={c} small />
              </div>
              <h3 className="font-display mt-4 text-2xl uppercase tracking-wide text-white">
                {c.name}
              </h3>
              <p className={`font-mono-cyber mt-1.5 text-[10px] uppercase tracking-[0.2em] ${ACCENT_TEXT[c.accent]}`}>
                {c.tag}
              </p>
              <p className="font-mono-cyber mt-1 text-[10px] uppercase tracking-[0.14em] text-white/45">
                {c.role}
              </p>
              <p className="font-cyber mt-4 line-clamp-4 text-sm leading-relaxed text-white/65">
                {c.text}
              </p>
              <p className={`font-mono-cyber mt-5 inline-flex items-center gap-2 border-t border-white/10 pt-3 text-[9px] uppercase tracking-[0.25em] text-white/40 transition-colors group-hover:text-white/80`}>
                <Building2 className={`h-3 w-3 ${ACCENT_TEXT[c.accent]}`} aria-hidden />
                открыть корпоративный файл
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* оверлей */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="corp-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm"
            onClick={() => {
              sfx("close");
              setActive(null);
            }}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* панель досье */}
      <AnimatePresence>
        {active && (
          <motion.aside
            key="corp-panel"
            role="dialog"
            aria-modal="true"
            aria-label={`Корпоративный файл: ${active.name}`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed inset-y-0 right-0 z-[90] w-full max-w-xl overflow-y-auto border-l bg-[#0a0a16] ${ACCENT_BORDER[active.accent]}`}
          >
            {/* шапка файла */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-[#0a0a16]/95 px-5 py-4 backdrop-blur-sm sm:px-7">
              <p className={`font-mono-cyber text-[10px] tracking-[0.12em] sm:text-xs ${ACCENT_TEXT[active.accent]}`}>
                {`> daro://corps/${corpFileId(active).toLowerCase()} · корпоративный файл`}
              </p>
              <button
                onClick={() => {
                  sfx("close");
                  setActive(null);
                }}
                aria-label="Закрыть корпоративный файл"
                className="border border-white/15 p-2 text-white/60 transition-colors hover:border-white/40 hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div className="px-5 py-7 sm:px-7">
              {/* логотип-моно грамма: визуальных записей корпораций в реестре нет */}
              <div className="relative">
                <Corners color={active.accent} />
                <div className="relative flex aspect-[16/9] flex-col items-center justify-center border border-white/10 bg-black/60">
                  <CorpMonogram c={active} />
                  <p className="font-mono-cyber mt-4 text-[10px] uppercase tracking-[0.35em] text-white/50">
                    {active.name}
                  </p>
                  <p className="font-mono-cyber absolute bottom-3 left-3 text-[9px] uppercase tracking-[0.3em] text-white/55">
                    {corpFileId(active)} · визуальная запись изъята пресс-службой
                  </p>
                  {/* сканлайн-текстура отдельным слоем поверх контента */}
                  <div className="scanlines-box absolute inset-0" aria-hidden />
                </div>
              </div>

              {/* реквизиты */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <span className={`font-mono-cyber border bg-black/50 px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] ${ACCENT_BORDER[active.accent]} ${ACCENT_TEXT[active.accent]}`}>
                  {active.tag}
                </span>
                <span className="font-mono-cyber flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-white/40">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
                  файл реестра консорциума
                </span>
              </div>
              <h2 className="font-display mt-4 text-3xl uppercase leading-none tracking-wide text-white sm:text-4xl">
                {active.name}
              </h2>
              <p className={`font-mono-cyber mt-3 text-[10px] uppercase tracking-[0.25em] ${ACCENT_TEXT[active.accent]}`}>
                {active.role}
              </p>

              {/* текст файла */}
              <p className="font-cyber mt-6 text-sm leading-relaxed text-white/75 sm:text-base">
                {active.text}
              </p>

              {/* смежные файлы */}
              <div className="mt-8 border-t border-white/10 pt-5">
                <p className="font-mono-cyber flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-white/55">
                  <ScrollText className={`h-3 w-3 ${ACCENT_TEXT[active.accent]}`} aria-hidden />
                  Смежные файлы
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(CORP_LINKS[active.id] ?? []).map((l) => (
                    <Link
                      key={l.href + l.label}
                      href={l.href}
                      className="font-mono-cyber border border-white/15 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:border-white/35 hover:text-white"
                    >
                      {l.label}
                    </Link>
                  ))}
                  <Link
                    href="/world"
                    className="font-mono-cyber border border-white/15 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:border-white/35 hover:text-white"
                  >
                    Досье мира
                  </Link>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Логотип-монограмма: первая буква имени на геральдической плашке. */
function CorpMonogram({ c, small = false }: { c: Faction; small?: boolean }) {
  const letter = c.name.slice(0, 1);
  const size = small ? "h-9 w-9 text-lg" : "h-20 w-20 text-4xl";
  return (
    <span
      className={`font-display flex shrink-0 items-center justify-center border bg-black/70 uppercase tracking-widest ${size} ${ACCENT_BORDER[c.accent]} ${ACCENT_TEXT[c.accent]}`}
      style={{ boxShadow: "0 0 18px color-mix(in srgb, currentColor 25%, transparent)" }}
      aria-hidden
    >
      {letter}
    </span>
  );
}
