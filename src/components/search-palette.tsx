"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Fuse from "fuse.js";
import { CornerDownLeft, FileSearch } from "lucide-react";
import { SEARCH_INDEX, type SearchRecord } from "@/lib/search-index";

/* ============================================================
   Палитра поиска (Ctrl+K / Cmd+K): терминальный ввод, поиск по
   индексу content.ts, стрелки — выбор, Enter — переход.
   ============================================================ */

const SECTION_ACCENT: Record<string, string> = {
  Книги: "text-[var(--neon-cyan)]",
  Фрагменты: "neon-cyan",
  Персонажи: "neon-magenta",
  Мир: "neon-cyan",
  Импланты: "neon-magenta",
  Вооружение: "text-[var(--neon-amber)]",
  Хроники: "neon-cyan",
  Таймлайн: "neon-magenta",
  Суть: "neon-magenta",
  Разделы: "text-[var(--neon-amber)]",
};

/** Быстрые цели, пока запрос пустой. */
const QUICK: Pick<SearchRecord, "id" | "title" | "section" | "href" | "accent">[] = [
  { id: "Q1", title: "Книги — три тома цикла", section: "Разделы", href: "/books", accent: "cyan" },
  { id: "Q2", title: "Мир: Хи-Мигата — досье", section: "Разделы", href: "/world", accent: "cyan" },
  { id: "Q3", title: "Персонажи — личные дела", section: "Разделы", href: "/characters", accent: "magenta" },
  { id: "Q4", title: "Таймлайн 2147", section: "Разделы", href: "/timeline", accent: "cyan" },
  { id: "Q5", title: "Хроники — архив записей", section: "Разделы", href: "/chronicles", accent: "cyan" },
];

const fuse = new Fuse(SEARCH_INDEX, {
  keys: [
    { name: "title", weight: 0.45 },
    { name: "keywords", weight: 0.35 },
    { name: "text", weight: 0.2 },
  ],
  threshold: 0.38,
  ignoreLocation: true,
  distance: 200,
});

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Сброс запроса при каждом открытии (setState во время рендера —
  // рекомендуемый React-паттерн вместо эффекта).
  const [prevOpen, setPrevOpen] = useState(open);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) {
      setQuery("");
      setCursor(0);
    }
  }

  // Фокус в поле и блокировка прокрутки страницы, пока палитра открыта.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  // Закрытие при переходе на другую страницу (onClose — через ref,
  // чтобы эффект срабатывал только на смену маршрута).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);
  useEffect(() => {
    onCloseRef.current();
  }, [pathname]);

  const results: SearchRecord[] = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return fuse
      .search(q, { limit: 9 })
      .map((r) => r.item);
  }, [query]);

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const count = query.trim() ? results.length : QUICK.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (count ? (c + 1) % count : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (count ? (c - 1 + count) % count : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = query.trim() ? results[cursor] : QUICK[cursor];
      if (target) go(target.href);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  // Скроллим активную строку в зону видимости.
  useEffect(() => {
    listRef.current
      ?.querySelectorAll("[data-row]")
      [cursor]?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const rows: SearchRecord[] = query.trim()
    ? results
    : QUICK.map((q) => ({ ...q, keywords: "", text: "" }));

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]">
          {/* затемнение */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* окно терминала */}
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Поиск по сайту"
            className="relative w-full max-w-2xl border border-[var(--neon-cyan)]/40 bg-[#0a0a16] shadow-[0_0_60px_rgba(0,0,0,0.8)]"
          >
            {/* строка ввода */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5 sm:px-5">
              <span className="font-mono-cyber neon-cyan shrink-0 text-sm" aria-hidden>
                {">"}
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCursor(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="поиск по файлам цикла…"
                aria-label="Поисковый запрос"
                className="font-mono-cyber w-full bg-transparent text-sm tracking-[0.05em] text-white placeholder:text-white/30 focus:outline-none sm:text-base"
              />
              <kbd className="font-mono-cyber hidden shrink-0 border border-white/15 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-white/40 sm:block">
                Esc
              </kbd>
            </div>

            {/* результаты */}
            <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2" aria-live="polite">
              {rows.length === 0 && (
                <p className="font-mono-cyber px-4 py-8 text-center text-xs uppercase tracking-[0.25em] text-white/40">
                  Ничего не найдено · реестры молчат
                </p>
              )}
              {rows.map((r, i) => (
                <button
                  key={`${r.id}-${i}`}
                  data-row
                  onClick={() => go(r.href)}
                  onMouseEnter={() => setCursor(i)}
                  className={`flex w-full items-center gap-3 border px-3.5 py-3 text-left transition-colors ${
                    i === cursor
                      ? "border-[var(--neon-cyan)]/40 bg-white/[0.05]"
                      : "border-transparent hover:bg-white/[0.03]"
                  }`}
                >
                  <FileSearch
                    className={`h-4 w-4 shrink-0 ${
                      SECTION_ACCENT[r.section] ?? "neon-cyan"
                    }`}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="font-cyber block truncate text-sm text-white/90">
                      {r.title}
                    </span>
                    {r.text && (
                      <span className="font-cyber mt-0.5 block truncate text-xs text-white/45">
                        {r.text}
                      </span>
                    )}
                  </span>
                  <span className="font-mono-cyber shrink-0 border border-white/10 bg-black/50 px-2 py-1 text-[8px] uppercase tracking-[0.25em] text-white/45">
                    {r.section}
                  </span>
                  {i === cursor && (
                    <CornerDownLeft className="neon-cyan h-3.5 w-3.5 shrink-0" aria-hidden />
                  )}
                </button>
              ))}
            </div>

            {/* подсказка */}
            <div className="font-mono-cyber flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-white/10 px-4 py-3 text-[9px] uppercase tracking-[0.25em] text-white/35 sm:px-5">
              <span>↑↓ — выбор</span>
              <span>Enter — переход</span>
              <span>Esc — закрыть</span>
              <span className="ml-auto hidden sm:inline">реестр «Периметра Зеро»</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
