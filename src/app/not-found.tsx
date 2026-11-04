import Link from "next/link";
import { Home, ScrollText } from "lucide-react";
import { Corners } from "@/components/cyber";

/* ============================================================
   404: сигнал потерян. Стиль терминала сопротивления.
   ============================================================ */

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05050a] px-4 py-32 text-white">
      <div className="cyber-grid absolute inset-0 opacity-[0.05]" aria-hidden />
      <div className="aurora-blob magenta left-[10%] top-[15%] h-72 w-72 opacity-50" aria-hidden />
      <div className="aurora-blob cyan bottom-[10%] right-[8%] h-80 w-80 opacity-40" aria-hidden />

      <div className="relative w-full max-w-xl">
        <Corners color="magenta" />
        <div className="beam-border-static text-center">
          <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--neon-magenta)]/70" aria-hidden />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--neon-amber)]/70" aria-hidden />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--neon-cyan)]/70" aria-hidden />
            <span className="font-mono-cyber ml-3 text-[10px] uppercase tracking-[0.3em] text-white/55">
              система навигации · сбой маршрута
            </span>
          </div>
          <div className="p-8 sm:p-12">
            <p className="font-display glitch neon-magenta text-7xl sm:text-8xl" data-text="404">
              404
            </p>
            <h1 className="font-display mt-6 text-xl uppercase tracking-wide sm:text-2xl">
              Сигнал потерян
            </h1>
            <p className="font-cyber mt-4 text-sm leading-relaxed text-white/65">
              Этот адрес не значится ни в реестрах консорциума, ни в картах
              Айи. Возможно, файл зачищен «Спектром» — или его никогда не
              было. Айя рекомендует вернуться на базу.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="btn-beam inline-flex items-center gap-2 bg-[var(--neon-cyan)] px-6 py-3 font-mono-cyber text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_24px_rgba(0,240,255,0.4)] transition-shadow hover:shadow-[0_0_40px_var(--neon-cyan)]"
              >
                <Home className="h-4 w-4" aria-hidden />
                На базу
              </Link>
              <Link
                href="/chronicles"
                className="inline-flex items-center gap-2 border border-white/15 px-6 py-3 font-mono-cyber text-xs uppercase tracking-widest text-white/70 transition-colors hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]"
              >
                <ScrollText className="h-3.5 w-3.5" aria-hidden />
                Архив хроник
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
