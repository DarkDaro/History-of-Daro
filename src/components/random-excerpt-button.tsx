"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Shuffle } from "lucide-react";
import { sfx } from "@/lib/sfx";

/* ============================================================
   «Случайный фрагмент» (BACKLOG п.25): кнопка-глитч на /excerpts.
   Клик — архив сам выбирает эпизод: метка рассыпается в мусорные
   символы и сходится к названию выпавшего файла, затем переход
   в читалку. Экономно: один клиентский компонент, без новой
   страницы; списки slug+title приходят пропсами с сервера —
   полные тексты фрагментов в клиентский бандл не попадают.
   ============================================================ */

export interface RandomExcerptItem {
  slug: string;
  title: string;
}

const IDLE = "Случайный фрагмент";
const POOL = "01<>/#%&@АБВГДЖЗИКЛМНОПРСТУФХЦЧШЭЮЯ";
const FRAMES = 10;
const FRAME_MS = 42;
const NAV_DELAY_MS = 240;

export function RandomExcerptButton({ items }: { items: RandomExcerptItem[] }) {
  const router = useRouter();
  const [label, setLabel] = useState(IDLE);
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState("");
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const pick = useCallback(() => {
    if (busy || items.length === 0) return;
    const item = items[Math.floor(Math.random() * items.length)];
    sfx("glitch");
    setBusy(true);
    setPicked(`Открываю фрагмент: ${item.title}`);

    /* prefers-reduced-motion: без рассыпания метки — сразу переход */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(`/excerpts/${item.slug}`);
      return;
    }

    /* метка сходится к названию выбранного файла — как дешифровка
       имени дела в консоли досье на /world */
    for (let f = 1; f <= FRAMES; f += 1) {
      timers.current.push(
        window.setTimeout(() => {
          sfx("type");
          const keep = Math.floor((item.title.length * f) / FRAMES);
          let s = item.title.slice(0, keep);
          for (let i = keep; i < item.title.length; i += 1) {
            s += item.title[i] === " " ? " " : POOL[Math.floor(Math.random() * POOL.length)];
          }
          setLabel(s);
          if (f === FRAMES) {
            timers.current.push(
              window.setTimeout(() => router.push(`/excerpts/${item.slug}`), NAV_DELAY_MS)
            );
          }
        }, f * FRAME_MS)
      );
    }
  }, [busy, items, router]);

  return (
    <>
      <button
        type="button"
        onClick={pick}
        aria-busy={busy}
        aria-label={`Открыть случайный фрагмент из архива — файлов: ${items.length}, выбор случайный`}
        className="btn-beam group relative flex items-center gap-3 border border-[var(--neon-magenta)]/45 bg-black/50 px-6 py-3.5 font-mono-cyber text-[11px] uppercase tracking-[0.3em] text-white/80 transition-colors duration-300 hover:border-[var(--neon-magenta)] hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[var(--neon-magenta)]"
      >
        <Shuffle
          className="h-4 w-4 shrink-0 text-[var(--neon-magenta)] transition-transform duration-500 group-hover:rotate-180"
          aria-hidden
        />
        <span className="glitch" data-text={label}>
          {label}
        </span>
      </button>
      {/* объявление скринридеру: какой файл выпал */}
      <span role="status" className="sr-only">
        {picked}
      </span>
    </>
  );
}
