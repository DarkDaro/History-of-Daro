import { Chip } from "@/components/blocks";
import { Corners, StatBar } from "@/components/cyber";
import type { Accent, CodexEntry } from "@/lib/content";

/* ============================================================
   Карточка «кодекса» — персонажи и импланты.
   Серверный компонент (StatBar — клиентский внутри).
   ============================================================ */

export function CodexCard({ r, accent }: { r: CodexEntry; accent: Accent }) {
  const accentText =
    accent === "cyan" ? "neon-cyan" : accent === "magenta" ? "neon-magenta" : "text-[var(--neon-amber)]";

  return (
    <article className="group relative flex h-full flex-col border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors duration-300 hover:border-white/25">
      <Corners color={accent} />
      <div className="flex items-center justify-between">
        <span className="font-mono-cyber text-[10px] tracking-[0.3em] text-white/40">{r.id}</span>
        <Chip accent={accent}>{r.tag}</Chip>
      </div>
      <h3 className="font-display mt-4 text-2xl uppercase tracking-wide">{r.name}</h3>
      <p className={`font-mono-cyber mt-1.5 text-[10px] uppercase tracking-[0.2em] ${accentText}`}>
        {r.role}
      </p>
      <p className="font-cyber mt-4 flex-1 text-sm leading-relaxed text-white/70">{r.text}</p>

      {r.stats && (
        <div className="mt-5 space-y-3">
          {r.stats.map((s) => (
            <StatBar key={s.label} label={s.label} value={s.value} color={accent} />
          ))}
        </div>
      )}

      {r.quote && (
        <p className="font-mono-cyber mt-5 border-t border-white/10 pt-4 text-[11px] italic leading-relaxed text-white/45">
          «{r.quote}»
        </p>
      )}
    </article>
  );
}
