"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { sfx } from "@/lib/sfx";

/* ============================================================
   Кнопка «Наверх»: появляется, когда страница прокручена
   дальше первого экрана, и плавно возвращает к началу.
   Видна на всех страницах сайта.
   ============================================================ */

const THRESHOLD = 520;

export function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => setVisible(window.scrollY > THRESHOLD);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        sfx("whoosh");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      aria-label="Вернуться наверх страницы"
      title="Наверх"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`font-mono-cyber fixed bottom-[max(1.25rem,calc(env(safe-area-inset-bottom)+0.9rem))] right-4 z-40 flex h-11 w-11 items-center justify-center border border-[var(--neon-cyan)]/50 bg-black/70 text-[var(--neon-cyan)] backdrop-blur-md transition-all duration-300 hover:bg-[var(--neon-cyan)]/10 hover:shadow-[0_0_20px_rgba(0,240,255,0.35)] focus-visible:shadow-[0_0_20px_rgba(0,240,255,0.35)] sm:right-6 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="h-5 w-5" aria-hidden />
      <span
        aria-hidden
        className="absolute -left-px -top-px h-2 w-2 border-l border-t border-[var(--neon-cyan)]"
      />
      <span
        aria-hidden
        className="absolute -bottom-px -right-px h-2 w-2 border-b border-r border-[var(--neon-cyan)]"
      />
    </button>
  );
}
