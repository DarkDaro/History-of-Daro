"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Corners, Reveal } from "@/components/cyber";
import { sfx } from "@/lib/sfx";
import type { Accent, GalleryItem } from "@/lib/content";

/* ============================================================
   Галерея на /gallery: сетка артов с фильтром по типу записи
   и лайтбоксом. Данные — GALLERY (content.ts): автор добавляет
   арт одним блоком (src через asset()), страница сама его
   нарисует — в сетке, фильтре и счётчиках.
   ============================================================ */

const ACCENT_TEXT: Record<Accent, string> = {
  cyan: "neon-cyan",
  magenta: "neon-magenta",
  amber: "text-[var(--neon-amber)]",
};

/* Литеральные hover-классы: Tailwind не видит шаблонные строки. */
const ACCENT_HOVER: Record<string, string> = {
  cyan: "hover:border-[var(--neon-cyan)]/40 lift-cyan",
  magenta: "hover:border-[var(--neon-magenta)]/40 lift-magenta",
  amber: "hover:border-[var(--neon-amber)]/40 lift-amber",
};

/* Пропорции рамки зависят от типа записи — литералами. */
const KIND_ASPECT: Record<GalleryItem["kind"], string> = {
  СЦЕНА: "aspect-[16/10]",
  ПОРТРЕТ: "aspect-[3/4]",
  ОБЛОЖКА: "aspect-[2/3]",
};

type KindFilter = "ВСЕ" | GalleryItem["kind"];

const FILTERS: { id: KindFilter; label: string }[] = [
  { id: "ВСЕ", label: "Все" },
  { id: "СЦЕНА", label: "Сцены" },
  { id: "ПОРТРЕТ", label: "Портреты" },
  { id: "ОБЛОЖКА", label: "Обложки" },
];

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [kind, setKind] = useState<KindFilter>("ВСЕ");
  const [active, setActive] = useState<GalleryItem | null>(null);

  const filtered = useMemo(
    () => (kind === "ВСЕ" ? items : items.filter((i) => i.kind === kind)),
    [items, kind],
  );

  /* Esc закрывает лайтбокс и блокирует прокрутку под ним. */
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active]);

  return (
    <div>
      {/* фильтр по типу записи */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-3" role="group" aria-label="Фильтр галереи">
        {FILTERS.map((f) => {
          const count = f.id === "ВСЕ" ? items.length : items.filter((i) => i.kind === f.id).length;
          const isActive = kind === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setKind(f.id);
                sfx("open");
              }}
              aria-pressed={isActive}
              className={`font-mono-cyber border px-3.5 py-2 text-[10px] uppercase tracking-[0.25em] transition-colors ${
                isActive
                  ? "border-[var(--neon-cyan)]/60 bg-[var(--neon-cyan)]/5 text-[var(--neon-cyan)]"
                  : "border-white/10 text-white/45 hover:border-white/25 hover:text-white/75"
              }`}
            >
              {f.label}
              <span className="ml-2 text-white/35">{count}</span>
            </button>
          );
        })}
      </div>

      {/* сетка: CSS-колонки дают кладку под разновысокие записи */}
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {filtered.map((item, i) => (
          <Reveal key={item.id} delay={Math.min(i, 5) * 0.05} className="mb-5 break-inside-avoid">
            <button
              type="button"
              onClick={() => {
                setActive(item);
                sfx("open");
              }}
              onMouseEnter={() => sfx("hover")}
              className="group block w-full text-left"
              aria-label={`Открыть запись: ${item.title}`}
            >
              <article
                className={`lift-card relative border border-white/10 bg-white/[0.03] p-2.5 backdrop-blur-sm transition-colors ${ACCENT_HOVER[item.accent]}`}
              >
                <Corners color={item.accent} />
                <div className={`relative w-full overflow-hidden ${KIND_ASPECT[item.kind]}`}>
                  <Image
                    src={item.src}
                    alt={`${item.title} — арт из галереи «История Даро»`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 pt-10">
                    <p className="font-mono-cyber text-[9px] uppercase tracking-[0.3em] text-white/55">
                      {item.kind}
                    </p>
                    <p className="font-display mt-1 text-base uppercase tracking-wide">{item.title}</p>
                  </div>
                </div>
              </article>
            </button>
          </Reveal>
        ))}
      </div>

      {/* лайтбокс */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              aria-label="Закрыть просмотр"
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              onClick={() => {
                setActive(null);
                sfx("close");
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.figure
              role="dialog"
              aria-modal="true"
              aria-label={`Запись галереи: ${active.title}`}
              className="relative z-10 w-full max-w-3xl border border-white/15 bg-[#05050a] shadow-[0_0_60px_rgba(0,0,0,0.7)]"
              initial={{ opacity: 0, scale: 0.96, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <Corners color={active.accent} />
              <div className={`relative w-full overflow-hidden ${KIND_ASPECT[active.kind]}`}>
                <Image
                  src={active.src}
                  alt={`${active.title} — арт из галереи «История Даро»`}
                  fill
                  sizes="90vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="border-t border-white/10 p-5 sm:p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-display text-lg uppercase tracking-wide">{active.title}</p>
                  <span
                    className={`font-mono-cyber shrink-0 text-[9px] uppercase tracking-[0.3em] ${ACCENT_TEXT[active.accent]}`}
                  >
                    {active.kind} · архив
                  </span>
                </div>
                <p className="font-cyber mt-2 text-sm leading-relaxed text-white/70">{active.caption}</p>
              </figcaption>
              <button
                type="button"
                onClick={() => {
                  setActive(null);
                  sfx("close");
                }}
                aria-label="Закрыть"
                className="font-mono-cyber absolute right-2.5 top-2.5 z-10 border border-white/20 bg-black/70 p-1.5 text-white/70 transition-colors hover:border-white/50 hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
