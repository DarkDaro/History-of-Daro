"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ImageOff, ScrollText, X } from "lucide-react";
import { CodexCard } from "@/components/codex-card";
import { Corners, StatBar, Typewriter } from "@/components/cyber";
import { sfx } from "@/lib/sfx";
import { CHARACTER_SIDES, type Accent, type CodexEntry } from "@/lib/content";

/* ============================================================
   Колода личных дел на /characters: фильтр по принадлежности
   и панель досье, которая открывается по клику на карточку.
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

type SideFilter = CodexEntry["side"] | "all";

export function CharacterDossier({ items }: { items: CodexEntry[] }) {
  const [filter, setFilter] = useState<SideFilter>("all");
  const [active, setActive] = useState<CodexEntry | null>(null);

  const visible = filter === "all" ? items : items.filter((r) => r.side === filter);

  // Глубокие ссылки: /characters#<id> открывает дело сразу, адресная
  // строка всегда отражает открытое дело (replaceState — без мусора
  // в истории браузера). Хеш снят — дело закрыто.
  const close = useCallback(() => {
    sfx("close");
    setActive(null);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  const open = (r: CodexEntry) => {
    sfx("open");
    setActive(r);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${r.id}`);
    }
  };

  useEffect(() => {
    const fromHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace(/^#/, "")).toUpperCase();
      if (!hash) {
        setActive(null);
        return;
      }
      const found = items.find((r) => r.id.toUpperCase() === hash) ?? null;
      if (found) setActive(found);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [items]);

  // Блокируем прокрутку страницы, пока открыто дело.
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  // Esc закрывает дело.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close]);

  return (
    <div>
      {/* фильтр принадлежности */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Фильтр по принадлежности">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          Все дела · {items.length}
        </FilterChip>
        {CHARACTER_SIDES.map((s) => (
          <FilterChip
            key={s.id}
            active={filter === s.id}
            onClick={() => setFilter(s.id)}
          >
            {s.label} · {items.filter((r) => r.side === s.id).length}
          </FilterChip>
        ))}
      </div>

      {/* сетка карточек */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        <AnimatePresence initial={false}>
          {visible.map((r) => (
            <motion.div
              key={r.id}
              id={r.id}
              layout
              className="scroll-mt-28"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <div
                role="button"
                tabIndex={0}
                aria-label={`Открыть личное дело: ${r.name}`}
                onClick={() => open(r)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    open(r);
                  }
                }}
                className="h-full cursor-pointer transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[var(--neon-cyan)]"
              >
                <CodexCard r={r} accent={r.accent} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* панель досье */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="dossier-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm"
            onClick={close}
            aria-hidden
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <motion.aside
            key="dossier-panel"
            role="dialog"
            aria-modal="true"
            aria-label={`Личное дело: ${active.name}`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed inset-y-0 right-0 z-[90] w-full max-w-xl overflow-y-auto border-l bg-[#0a0a16] ${ACCENT_BORDER[active.accent]}`}
          >
            {/* шапка дела */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-[#0a0a16]/95 px-5 py-4 backdrop-blur-sm sm:px-7">
              <p className={`font-mono-cyber text-[10px] tracking-[0.12em] sm:text-xs ${ACCENT_TEXT[active.accent]}`}>
                <Typewriter text={`> daro://dossier/${active.id.toLowerCase().replace("?", "x")} · личное дело`} />
              </p>
              <button
                onClick={close}
                aria-label="Закрыть дело"
                className="border border-white/15 p-2 text-white/60 transition-colors hover:border-white/40 hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div className="px-5 py-7 sm:px-7">
              {/* портрет */}
              {active.portrait ? (
                <div className="relative">
                  <Corners color={active.accent} />
                  <div className="relative aspect-[16/9] overflow-hidden border border-white/10">
                    <Image
                      src={active.portrait}
                      alt={`Визуальная запись досье: ${active.name}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 576px"
                      className="cover-tone object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a16] via-transparent to-transparent" />
                    <p className="font-mono-cyber absolute bottom-3 left-3 text-[9px] uppercase tracking-[0.3em] text-white/60">
                      {active.id} · визуальная запись восстановлена
                    </p>
                  </div>
                </div>
              ) : (
                <div className="scanlines-box relative flex aspect-[16/9] items-center justify-center border border-white/10 bg-black/60">
                  <ImageOff className={`h-7 w-7 ${ACCENT_TEXT[active.accent]}`} aria-hidden />
                  <p className="font-mono-cyber absolute bottom-3 left-3 text-[9px] uppercase tracking-[0.3em] text-white/40">
                    {active.id} · визуальная запись отсутствует
                  </p>
                </div>
              )}

              {/* реквизиты */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <span className={`font-mono-cyber border bg-black/50 px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] ${ACCENT_BORDER[active.accent]} ${ACCENT_TEXT[active.accent]}`}>
                  {active.tag}
                </span>
                <span className="font-mono-cyber flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-white/40">
                  <span className={`pulse-dot h-1.5 w-1.5 rounded-full ${ACCENT_DOT[active.accent]}`} aria-hidden />
                  файл в доступе сопротивления
                </span>
              </div>
              <h2 className="font-display mt-4 text-3xl uppercase leading-none tracking-wide text-white sm:text-4xl">
                {active.name}
              </h2>
              <p className={`font-mono-cyber mt-3 text-[10px] uppercase tracking-[0.25em] ${ACCENT_TEXT[active.accent]}`}>
                {active.role}
              </p>

              {/* альтер-эго: одно тело — две записи */}
              {active.alterEgo && (
                <div className={`mt-5 border bg-white/[0.02] p-4 ${ACCENT_BORDER[active.accent]}`}>
                  <p className="font-mono-cyber text-[9px] uppercase tracking-[0.3em] text-white/40">
                    Альтер-эго · одна личность — два имени
                  </p>
                  <p className={`font-display mt-2 text-xl uppercase tracking-wide ${ACCENT_TEXT[active.accent]}`}>
                    {active.alterEgo.name}
                  </p>
                  {active.alterEgo.note && (
                    <p className="font-cyber mt-1 text-xs leading-relaxed text-white/55">
                      {active.alterEgo.note}
                    </p>
                  )}
                </div>
              )}

              {/* текст дела */}
              <p className="font-cyber mt-6 text-sm leading-relaxed text-white/75 sm:text-base">
                {active.text}
              </p>

              {/* показатели */}
              {active.stats && (
                <div className="mt-7 space-y-3 border border-white/10 bg-white/[0.02] p-5">
                  <p className="font-mono-cyber text-[9px] uppercase tracking-[0.3em] text-white/40">
                    Показатели · оценка аналитиков
                  </p>
                  {active.stats.map((s) => (
                    <StatBar key={s.label} label={s.label} value={s.value} color={active.accent} />
                  ))}
                </div>
              )}

              {/* цитата */}
              {active.quote && (
                <p className={`font-mono-cyber mt-6 border-l-2 pl-4 text-[11px] italic leading-relaxed text-white/60 ${ACCENT_BORDER[active.accent]}`}>
                  «{active.quote}»
                </p>
              )}

              {/* смежные файлы */}
              <div className="mt-8 border-t border-white/10 pt-5">
                <p className="font-mono-cyber flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-white/40">
                  <ScrollText className={`h-3 w-3 ${ACCENT_TEXT[active.accent]}`} aria-hidden />
                  Смежные файлы
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {active.id === "RH-087" && (
                    <Link
                      href="/chronicles/pobeg-ohotnika"
                      className="font-mono-cyber border border-white/15 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:border-white/35 hover:text-white"
                    >
                      Хроника побега
                    </Link>
                  )}
                  <Link
                    href="/world"
                    className="font-mono-cyber border border-white/15 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:border-white/35 hover:text-white"
                  >
                    Досье мира
                  </Link>
                  <Link
                    href="/armory"
                    className="font-mono-cyber border border-white/15 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:border-white/35 hover:text-white"
                  >
                    Вооружение
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

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`font-mono-cyber border px-4 py-2 text-[10px] uppercase tracking-[0.25em] transition-colors ${
        active
          ? "border-white/30 bg-white/[0.06] text-white"
          : "border-white/10 bg-white/[0.02] text-white/50 hover:border-white/25 hover:text-white/80"
      }`}
    >
      {children}
    </button>
  );
}
