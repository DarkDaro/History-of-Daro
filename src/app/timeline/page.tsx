import type { Metadata } from "next";
import { CrossLinks, PageHero, SectionHeading } from "@/components/blocks";
import { TimelineView } from "@/components/timeline-view";
import { CalendarView } from "@/components/calendar-view";
import { TIMELINE, CALENDAR_EVENTS, CALENDAR_NOTE } from "@/lib/content";

export const metadata: Metadata = {
  openGraph: {
    title: "Таймлайн 2147",
    images: [{ url: "/covers/og-timeline.png", width: 1200, height: 630, alt: "Таймлайн 2147 — История Даро" }],
  },
  title: "Таймлайн 2147",
  description:
    "Хронология и календарь событий цикла «История Даро»: от города-завода и Перелома — через «Красный сдвиг» и «Стеклянные небеса» к засекреченному финалу «Пепла и неона». Собрано из реестров, сводок и перехватов Хи-Мигаты.",
  alternates: { canonical: "/timeline" },
};

export default function TimelinePage() {
  return (
    <main className="min-h-screen bg-[#05050a] text-white">
      <PageHero
        kicker="Хронология цикла · 2147 год"
        title="Таймлайн 2147"
        glitch
        lead="События не ждут героя: пока Даро идёт по коридору, корпорации перекраивают патрули, Немезида ищет правду о себе, а город меняет вывески. Хронология собрана из того, что сопротивлению удалось перехватить: от Перелома — до файла, который ещё засекречен."
        accent="cyan"
        breadcrumb={[{ href: "/timeline", label: "Таймлайн" }]}
        rainGlass
      />

      <section className="relative py-16 sm:py-24">
        <div className="cyber-grid absolute inset-0 opacity-[0.05]" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kicker="Линия времени"
            title="Хронология событий"
            num="01"
            accent="cyan"
          />
          <div className="mt-10">
            <TimelineView events={TIMELINE} />
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/10 py-16 sm:py-24">
        <div className="cyber-grid absolute inset-0 opacity-[0.05]" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kicker="Год без пауз"
            title="Календарь событий мира"
            num="02"
            accent="magenta"
          />
          <div className="mt-10">
            <CalendarView events={CALENDAR_EVENTS} note={CALENDAR_NOTE} />
          </div>
        </div>
      </section>

      {/* куда дальше */}
      <CrossLinks
        intro="Даты в таймлайне — следы событий: акты томов, хроника побега объекта «РХ» и досье мира, в котором всё это случилось."
        links={[
          { href: "/books", label: "Книги · акты томов" },
          { href: "/chronicles", label: "Хроники · побег «РХ»" },
          { href: "/world", label: "Мир · досье" },
        ]}
      />
    </main>
  );
}
