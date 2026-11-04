import type { Metadata } from "next";
import { PageHero, SceneBanner } from "@/components/blocks";
import { CityMap } from "@/components/city-map";
import { MAP_POINTS, VISUALS } from "@/lib/content";

export const metadata: Metadata = {
  openGraph: {
    title: "Карта Хи-Мигаты",
    images: [{ url: "/covers/og-map.png", width: 1200, height: 630, alt: "Карта Хи-Мигаты — История Даро" }],
  },
  title: "Карта Хи-Мигаты",
  description:
    "Тактическая схема города из мира «Истории Даро»: купола и ярусы, штабы корпораций, доки и «Котёл», «Периметр Зеро» за периметром и скрытые объекты подземки. Слои, досье объектов, реконструкция сопротивления.",
  alternates: { canonical: "/map" },
};

export default function MapPage() {
  return (
    <main className="min-h-screen bg-[#05050a] text-white">
      <PageHero
        kicker="Реконструкция сопротивления · схема 2147"
        title="Карта Хи-Мигаты"
        glitch
        lead={`Город-завод под куполами: ярусы, штабы семи корпораций, доки без гражданского кода — и то, чего нет в сводках «Спектра». Схема собрана из опубликованных свидетельств: ${MAP_POINTS.length} объектов, ${5} слоёв, координаты приблизительные.`}
        accent="cyan"
        breadcrumb={[{ href: "/map", label: "Карта" }]}
      />

      {/* реконструкция: тактический стол сопротивления */}
      <section className="relative pb-6 pt-14">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SceneBanner
            src={VISUALS.map}
            alt="Тактический стол сопротивления: голограммная каркасная карта купольного города"
            caption="ТАКТИЧЕСКИЙ СТОЛ «ПЕРИМЕТРА ЗЕРО» · СХЕМА 2147 · ДАННЫЕ ЧАСТИЧНЫ"
            accent="cyan"
            priority
          />
        </div>
      </section>

      <section className="relative py-16 sm:py-20">
        <div className="cyber-grid absolute inset-0 opacity-[0.04]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <CityMap />
        </div>
      </section>
    </main>
  );
}
