import Image from "next/image";
import { ImageOff } from "lucide-react";
import { Chip } from "@/components/blocks";
import { Corners, StatBar } from "@/components/cyber";
import type { Accent, CodexEntry } from "@/lib/content";

/* ============================================================
   Карточка «кодекса» — персонажи и импланты.
   Вверху — визуальная запись из досье: портрет или
   фирменный плейсхолдер «запись отсутствует».
   Серверный компонент (StatBar — клиентский внутри).
   ============================================================ */

const ACCENT_CLASSES: Record<Accent, { text: string; border: string; dot: string }> = {
  cyan: {
    text: "neon-cyan",
    border: "border-[var(--neon-cyan)]/40 text-[var(--neon-cyan)]/60",
    dot: "bg-[var(--neon-cyan)]",
  },
  magenta: {
    text: "neon-magenta",
    border: "border-[var(--neon-magenta)]/40 text-[var(--neon-magenta)]/60",
    dot: "bg-[var(--neon-magenta)]",
  },
  amber: {
    text: "text-[var(--neon-amber)]",
    border: "border-[var(--neon-amber)]/40 text-[var(--neon-amber)]/60",
    dot: "bg-[var(--neon-amber)]",
  },
};

export function CodexCard({ r, accent }: { r: CodexEntry; accent: Accent }) {
  const a = ACCENT_CLASSES[accent];
  const accentText =
    accent === "cyan" ? "neon-cyan" : accent === "magenta" ? "neon-magenta" : "text-[var(--neon-amber)]";

  return (
    <article className="group relative flex h-full flex-col border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-colors duration-300 hover:border-white/25">
      <Corners color={accent} />

      {/* визуальная запись из досье */}
      <div className="relative aspect-[3/4] overflow-hidden border-b border-white/10">
        {r.portrait ? (
          <Image
            src={r.portrait}
            alt={`Визуальная запись досье: ${r.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="cover-tone object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="scanlines-box absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60">
            <ImageOff className={`h-7 w-7 ${a.text}`} aria-hidden />
            <p className="font-mono-cyber px-4 text-center text-[9px] uppercase leading-relaxed tracking-[0.3em] text-white/35">
              Визуальная запись
              <br />
              отсутствует
            </p>
            <span className={`pulse-dot h-1 w-1 rounded-full ${a.dot}`} aria-hidden />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a16] via-transparent to-transparent" />
        <span className="font-mono-cyber absolute left-3 top-3 border border-white/20 bg-black/70 px-2.5 py-1 text-[9px] tracking-[0.3em] text-white/70">
          {r.id}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between">
          <Chip accent={accent}>{r.tag}</Chip>
        </div>
        <h3 className="font-display mt-4 text-2xl uppercase tracking-wide">{r.name}</h3>
        <p className={`font-mono-cyber mt-1.5 text-[10px] uppercase tracking-[0.2em] ${accentText}`}>
          {r.role}
        </p>
        {r.alterEgo && (
          <p className="font-mono-cyber mt-2 text-[10px] uppercase leading-relaxed tracking-[0.2em] text-white/50">
            <span className={accentText}>альтер-эго //</span> {r.alterEgo.name}
            {r.alterEgo.note ? ` · ${r.alterEgo.note}` : ""}
          </p>
        )}
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
      </div>
    </article>
  );
}
