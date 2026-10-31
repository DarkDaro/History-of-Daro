import type { Metadata } from "next";
import { PageHero, SectionHeading } from "@/components/blocks";
import { CodexCard } from "@/components/codex-card";
import { Reveal } from "@/components/cyber";
import { CHARACTERS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Персонажи",
  description:
    "Герои цикла «История Даро»: Николас и Даро с расщеплённой личностью, хакер Лина, Немезида (Кира Найтс), Айя, соратники «Периметра Зеро» и антагонисты — Сандерс Райз, Лорд Скорпион, Бергинатор.",
  alternates: { canonical: "/characters" },
};

export default function CharactersPage() {
  const hero = CHARACTERS[0];

  return (
    <main className="min-h-screen bg-[#05050a] text-white">
      <PageHero
        kicker="Личные дела · файлы сопротивления"
        title="Персонажи"
        glitch
        lead="В центре — человек с расколотой личностью, который боится потерять себя. Вокруг — женщина, ставшая лидером, потому что некому больше; девушка, не верящая, что её можно любить; оружие, ищущее, кем оно было. И те, кто ломает их мир."
        breadcrumb={[{ href: "/characters", label: "Персонажи" }]}
      />

      {/* главный герой — отдельной карточкой */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="grid gap-8 border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-10 lg:grid-cols-[1fr_320px]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono-cyber text-[10px] tracking-[0.3em] text-white/40">{hero.id}</span>
                  <ChipInline accent="cyan" text={hero.tag} />
                </div>
                <h2 className="font-display mt-4 text-3xl uppercase tracking-wide sm:text-4xl">
                  Николас <span className="neon-magenta">{"//"}</span>{" "}
                  <span className="glitch neon-cyan" data-text="Даро">
                    Даро
                  </span>
                </h2>
                <p className="font-mono-cyber mt-2 text-[10px] uppercase tracking-[0.25em] neon-cyan">
                  {hero.role}
                </p>
                <p className="font-cyber mt-5 text-base leading-relaxed text-white/80">{hero.text}</p>
                <p className="font-cyber mt-4 text-sm leading-relaxed text-white/60">
                  Николас — человеческая половина: память, совесть, страх. Даро — мятежное альтер-эго,
                  выросшее на силе Даркдаруса: телекинез, катана, призрачный клинок. Для мира это один
                  человек с двумя голосами; для войны — единственный, кто может стоять за куполом щитов
                  один против армии машин. Цена — сама личность.
                </p>
                <p className="font-mono-cyber mt-6 border-t border-white/10 pt-4 text-[11px] italic leading-relaxed text-white/45">
                  «{hero.quote}»
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <MiniStat label="Угроза" value={10} />
                <MiniStat label="Воля" value={7} />
                <MiniStat label="Целостность личности" value={4} />
                <div className="beam-border-static p-4">
                  <p className="font-mono-cyber text-[9px] uppercase tracking-[0.3em] text-white/40">
                    Статус в реестрах консорциума
                  </p>
                  <p className="font-mono-cyber mt-2 text-sm neon-magenta">
                    ЛИЧНОСТЬ НЕ СИНХРОНИЗИРОВАНА
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* остальные */}
      <section className="relative border-t border-white/10 py-20 sm:py-24">
        <div className="cyber-grid absolute inset-0 opacity-[0.05]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading kicker="Файлы-codeкс" title="Соперники и соратники" num="01" accent="magenta" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CHARACTERS.slice(1).map((r, i) => (
              <Reveal key={r.id} delay={(i % 3) * 0.08}>
                <CodexCard r={r} accent={r.accent} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ChipInline({ accent, text }: { accent: "cyan" | "magenta" | "amber"; text: string }) {
  const cls =
    accent === "cyan"
      ? "border-[var(--neon-cyan)]/50 text-[var(--neon-cyan)]"
      : accent === "magenta"
        ? "border-[var(--neon-magenta)]/50 text-[var(--neon-magenta)]"
        : "border-[var(--neon-amber)]/50 text-[var(--neon-amber)]";
  return (
    <span className={`inline-flex items-center gap-1.5 border bg-black/50 px-2.5 py-1 font-mono-cyber text-[9px] uppercase tracking-[0.25em] ${cls}`}>
      <span className="pulse-dot h-1 w-1 rounded-full bg-current" aria-hidden />
      {text}
    </span>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between font-mono-cyber text-[9px] uppercase tracking-[0.25em] text-white/40">
        <span>{label}</span>
        <span className="neon-cyan">{value}/10</span>
      </div>
      <div className="mt-1.5 h-1 w-full overflow-hidden bg-white/10">
        <div className="h-full bg-[var(--neon-cyan)] shadow-[0_0_8px_currentColor]" style={{ width: `${value * 10}%` }} />
      </div>
    </div>
  );
}
