import type { Metadata } from "next";
import { PageHero, SectionHeading, SceneBanner, MoreLink } from "@/components/blocks";
import { Corners, Reveal, StatBar } from "@/components/cyber";
import { Chip } from "@/components/blocks";
import { VISUALS, WEAPONS, type Weapon } from "@/lib/content";
import { WeaponSpecsSection } from "@/components/weapon-specs";

export const metadata: Metadata = {
  openGraph: {
    title: "Вооружение",
    images: [{ url: "/covers/og-armory.png", width: 1200, height: 630, alt: "Вооружение — История Даро" }],
  },
  title: "Вооружение",
  description:
    "Арсеналы войны из цикла «История Даро»: катана Даро на телекинетической энергии, призрачный клинок, ЭМИ-излучатель «Глушь» — и военные машины корпораций: дроны, стражи, прототипы «Карателей».",
  alternates: { canonical: "/armory" },
};

function WeaponCard({ w }: { w: Weapon }) {
  const accentText =
    w.accent === "cyan" ? "neon-cyan" : w.accent === "magenta" ? "neon-magenta" : "text-[var(--neon-amber)]";
  return (
    <article className="group relative flex h-full flex-col border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors duration-300 hover:border-white/25">
      <Corners color={w.accent} />
      <div className="flex items-center justify-between">
        <span className="font-mono-cyber text-[10px] tracking-[0.3em] text-white/40">{w.id}</span>
        <Chip accent={w.accent}>{w.tag}</Chip>
      </div>
      <h3 className="font-display mt-4 text-2xl uppercase tracking-wide">{w.name}</h3>
      <p className={`font-mono-cyber mt-1.5 text-[10px] uppercase tracking-[0.2em] ${accentText}`}>
        {w.role}
      </p>
      <p className="font-cyber mt-4 flex-1 text-sm leading-relaxed text-white/70">{w.text}</p>

      <div className="mt-5 space-y-3">
        {w.stats.map((s) => (
          <StatBar key={s.label} label={s.label} value={s.value} color={w.accent} />
        ))}
      </div>

      {w.quote && (
        <p className="font-mono-cyber mt-5 border-t border-white/10 pt-4 text-[11px] italic leading-relaxed text-white/45">
          «{w.quote}»
        </p>
      )}
    </article>
  );
}

export default function ArmoryPage() {
  const resistance = WEAPONS.filter((w) => w.side === "resistance");
  const corporate = WEAPONS.filter((w) => w.side === "corporate");

  return (
    <main className="min-h-screen bg-[#05050a] text-white">
      <PageHero
        kicker="Арсеналы · обе стороны войны"
        title="Вооружение"
        glitch
        accent="amber"
        lead="Оружие в этой войне делится не на «летающее и стреляющее», а на «украденное» и «серийное». У сопротивления — катана, которая слушается телекинеза, и ЭМИ-излучатель. У корпораций — дроны, стражи и «Каратели», которых уже нельзя выключить импульсом."
        breadcrumb={[{ href: "/armory", label: "Вооружение" }]}
      />

      {/* реконструкция: оружейная стена */}
      <section className="relative pb-6 pt-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SceneBanner
            src={VISUALS.armory}
            alt="Оружейная стена: катана, энергетический карабин и импульсные винтовки на магнитных креплениях"
            caption="АРСЕНАЛ «ПЕРИМЕТРА ЗЕРО» · СЕКТОР Д-2 · УЧЁТ СЕНЫ"
            accent="amber"
            priority
          />
        </div>
      </section>

      {/* арсенал сопротивления */}
      <section className="relative py-20 sm:py-24">
        <div className="cyber-grid absolute inset-0 opacity-[0.05]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading kicker="«Периметр Зеро»" title="Арсенал сопротивления" num="01" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resistance.map((w, i) => (
              <Reveal key={w.id} delay={(i % 3) * 0.08}>
                <WeaponCard w={w} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* военные машины корпораций */}
      <section className="relative border-t border-white/10 py-20 sm:py-24">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading kicker="«Бергинатор» · армия Скорпиона" title="Машины противника" num="02" accent="amber" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {corporate.map((w, i) => (
              <Reveal key={w.id} delay={(i % 3) * 0.08}>
                <WeaponCard w={w} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* канон-каталог: оружие и владельцы */}
      <section className="relative border-t border-white/10 py-20 sm:py-24">
        <div className="cyber-grid absolute inset-0 opacity-[0.05]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading kicker="Канон-каталог · текст автора" title="Оружие и владельцы" num="03" />
          <Reveal>
            <p className="max-w-3xl font-cyber text-sm leading-relaxed text-white/65 sm:text-base">
              Каждый клинок — характер: катана Даро — элегантность, HF-клинок Райдена —
              индустриальность, призрачный клинок — тайна. Звук и свет — часть оружия:
              по нему читается биография владельца.
            </p>
          </Reveal>
          <div className="mt-10">
            <WeaponSpecsSection />
          </div>
        </div>
      </section>

      {/* сводка */}
      <section className="relative border-t border-white/10 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="beam-border-static p-8 text-center sm:p-10">
              <p className="font-mono-cyber text-xs uppercase tracking-[0.35em] text-[var(--neon-amber)]">
                Сводка по итогам штурма «Периметра Зеро»
              </p>
              <div className="mt-6 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-3">
                <div className="bg-[#0a0a16] p-6">
                  <p className="font-display neon-cyan text-3xl">3/3</p>
                  <p className="font-mono-cyber mt-2 text-[9px] uppercase tracking-[0.25em] text-white/45">
                    «Карателей» уничтожено Даро
                  </p>
                </div>
                <div className="bg-[#0a0a16] p-6">
                  <p className="font-display neon-magenta text-3xl">1</p>
                  <p className="font-mono-cyber mt-2 text-[9px] uppercase tracking-[0.25em] text-white/45">
                    фрагмент Искина, переживший ЭМИ
                  </p>
                </div>
                <div className="bg-[#0a0a16] p-6">
                  <p className="font-display text-3xl text-[var(--neon-amber)]">0</p>
                  <p className="font-mono-cyber mt-2 text-[9px] uppercase tracking-[0.25em] text-white/45">
                    оснований считать войну оконченной
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      {/* куда дальше */}
      <section className="relative border-t border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="font-cyber mx-auto max-w-2xl text-sm leading-relaxed text-white/60">
              За каждым стволом из каталога стоит владелец — личные дела тех,
              кто это оружие носит, живут в отдельном разделе. Как оно работает
              в бою — в восстановленных записях города.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <MoreLink href="/characters">Персонажи · владельцы оружия</MoreLink>
              <MoreLink href="/chronicles">Хроники · оружие в деле</MoreLink>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
