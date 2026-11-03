"use client";

import { useEffect, useState } from "react";

/* ============================================================
   Прогресс чтения: тонкая неоновая полоса под самой верхней
   кромкой страницы. Ширина — доля прокрутки документа.
   Пассивные слушатели, обновляется один div — дёшево.
   ============================================================ */

export function ReadingProgress({
  accent = "cyan",
}: {
  accent?: "cyan" | "magenta" | "amber";
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const color =
    accent === "magenta"
      ? "bg-[var(--neon-magenta)]"
      : accent === "amber"
        ? "bg-[var(--neon-amber)]"
        : "bg-[var(--neon-cyan)]";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] bg-white/5"
    >
      <div
        className={`h-full ${color} shadow-[0_0_10px_currentColor]`}
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
