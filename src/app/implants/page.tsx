import type { Metadata } from "next";
import { PageHero, SectionHeading, SceneBanner } from "@/components/blocks";
import { CodexCard } from "@/components/codex-card";
import { Reveal } from "@/components/cyber";
import { IMPLANTS, VISUALS } from "@/lib/content";

export const metadata: Metadata = {
  openGraph: {
    title: "Импланты",
    images: [{ url: "/covers/og-implants.png", width: 1200, height: 630, alt: "Импланты — История Даро" }],
  },
  title: "Импланты",
  description:
    "Каталог имплантов вселенной «Истории Даро»: мнемокассета «МК-9», эмоциональный кодекс «Слепок», нейроинтерфейс «Проводник», каркас «Немезида-7» и мифический «Пустой слот».",
  alternates: { canonical: "/implants" },
};

export default function ImplantsPage() {
  return (
    <main className="min-h-screen bg-[#05050a] text-white">
      <PageHero
        kicker="Справочник · каталог «Синтеза» и доков"
        title="Импланты"
        glitch
        lead="В Хи-Мигате тело — имущество с рассрочкой. Импланты дают память, эмоции и рефлексы напрокат: корпорации продают человеку его же возможности — а на чёрном рынке доков всё это можно купить дешевле и без вопросов."
        accent="magenta"
        breadcrumb={[{ href: "/implants", label: "Импланты" }]}
      />

      {/* реконструкция: позвоночный интерфейс */}
      <section className="relative pb-6 pt-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SceneBanner
            src={VISUALS.implants}
            alt="Крупный план кибернетического импланта позвоночника со светящимися нейропортами"
            caption="ЛАБОРАТОРИЯ «СИНТЕЗА» · ХИРУРГИЧЕСКИЙ ЖУРНАЛ · КАДР 07"
            accent="magenta"
            priority
          />
        </div>
      </section>

      <section className="relative py-20 sm:py-24">
        <div className="cyber-grid absolute inset-0 opacity-[0.05]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading kicker="Каталог технологий" title="Записи о вживлении" num="01" accent="magenta" />

          <Reveal className="-mt-6 mb-12 text-center">
            <p className="font-mono-cyber mx-auto max-w-2xl text-sm leading-relaxed text-white/60">
              Записей в каталоге: {IMPLANTS.length}. Источники: реестры «Синтеза»
              (украденные), прайс доков, показания выживших. «Спектр» считает
              этот раздел дезинформацией. «Технодоминус» считает его уликой.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {IMPLANTS.map((r, i) => (
              <Reveal key={r.id} delay={(i % 3) * 0.08}>
                <CodexCard r={r} accent={r.accent} />
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16">
            <div className="beam-border-static p-8 text-center">
              <p className="font-mono-cyber text-xs uppercase tracking-[0.35em] text-white/40">
                ПРЕДУПРЕЖДЕНИЕ ДОКОВ {"//"} ТЕХНИКА БЕЗОПАСНОСТИ
              </p>
              <p className="font-cyber mt-3 text-sm leading-relaxed text-white/60">
                Любой имплант можно отзеркалить: то, что усиливает вас, усиливает
                и того, кто получит к нему доступ. «Слепок» отнимает чувства,
                каркас «Немезида-7» — имя, «Пустой слот» — всё сразу.
                Гарантия не распространяется на личность.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
