import type { Accent, WeaponSpec } from "@/lib/content";
import { WEAPON_SPEC_GROUPS, WEAPON_SPECS } from "@/lib/content";
import { Corners, Reveal } from "@/components/cyber";
import { Chip } from "@/components/blocks";

/* ============================================================
   Канон-каталог «Оружие и владельцы» на /armory.
   Данные — WEAPON_SPECS (content.ts): выжимка авторского
   каталога оружия — владелец, параметры, звук/свет, режимы.
   Служебные заметки художнику (референсы, «что рисовать»)
   на сайт не переносятся.
   ============================================================ */

const ACCENT_TEXT: Record<Accent, string> = {
  cyan: "neon-cyan",
  magenta: "neon-magenta",
  amber: "text-[var(--neon-amber)]",
};

function SpecCard({ w }: { w: WeaponSpec }) {
  return (
    <article className="relative flex h-full flex-col border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors duration-300 hover:border-white/25">
      <Corners color={w.accent} />
      <h4 className="font-display text-lg uppercase leading-snug tracking-wide">{w.name}</h4>
      <p className="font-mono-cyber mt-1.5 text-[10px] uppercase tracking-[0.2em] text-white/40">
        {w.kind}
      </p>
      <p className="mt-3">
        <Chip accent={w.accent}>{w.owner}</Chip>
      </p>

      <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2.5 border-t border-white/10 pt-4 sm:grid-cols-2">
        {w.specs.map((s) => (
          <div key={s.label}>
            <dt className="font-mono-cyber text-[9px] uppercase tracking-[0.2em] text-white/55">
              {s.label}
            </dt>
            <dd className="font-cyber mt-0.5 text-sm leading-snug text-white/80">{s.value}</dd>
          </div>
        ))}
      </dl>

      {(w.glow || w.sound) && (
        <p className="font-mono-cyber mt-4 text-[10px] uppercase leading-relaxed tracking-[0.15em] text-white/45">
          {w.glow && (
            <>
              <span className={ACCENT_TEXT[w.accent]}>свет: {w.glow}</span>
              {" · "}
            </>
          )}
          звук: {w.sound}
        </p>
      )}

      {w.note && (
        <p className="font-cyber mt-4 text-sm leading-relaxed text-white/65">{w.note}</p>
      )}

      {w.modes && (
        <div className="mt-auto pt-4">
          <p className="font-mono-cyber text-[9px] uppercase tracking-[0.3em] text-white/55">
            Режимы
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {w.modes.map((m) => (
              <span
                key={m}
                className="border border-white/15 px-2 py-1 font-mono-cyber text-[9px] uppercase tracking-[0.12em] text-white/55"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

export function WeaponSpecsSection() {
  return (
    <>
      {WEAPON_SPEC_GROUPS.map((g) => {
        const items = WEAPON_SPECS.filter((w) => w.group === g);
        if (items.length === 0) return null;
        return (
          <div key={g} className="mt-12 first:mt-0">
            <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3">
              <h3 className="font-mono-cyber text-xs uppercase tracking-[0.35em] text-white/55">
                ▸ {g}
              </h3>
              <span className="font-mono-cyber shrink-0 text-[10px] uppercase tracking-[0.25em] text-white/30">
                {items.length} ед.
              </span>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((w, i) => (
                <Reveal key={w.name} delay={(i % 3) * 0.08}>
                  <SpecCard w={w} />
                </Reveal>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
