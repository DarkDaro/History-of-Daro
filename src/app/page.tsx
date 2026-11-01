"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Crosshair,
  Feather,
  Heart,
  Microchip,
  Quote,
  ScrollText,
  User,
  Users,
  Globe,
} from "lucide-react";
import { BootOverlay, Corners, Rain, Skyline } from "@/components/cyber";
import { FogBand } from "@/components/blocks";
import { HomeBlocks } from "@/components/home-blocks";
import { SubscribeForm } from "@/components/subscribe-form";
import { BOOKS, CHRONICLES, HOMEPAGE_BLOCKS, HUMAN_STORIES, MARQUEE_ITEMS } from "@/lib/content";

/* ============================================================
   ИСТОРИЯ ДАРО — главная страница-хаб.
   Даро — человек, которого нет в реестрах. Город — Хи-Мигата.
   ============================================================ */

const SECTIONS = [
  {
    href: "/books",
    icon: BookOpen,
    title: "Книги",
    text: "Три тома цикла: «Красный сдвиг», «Стеклянные небеса», «Пепел и неон».",
    accent: "cyan" as const,
  },
  {
    href: "/world",
    icon: Globe,
    title: "Мир",
    text: "Хи-Мигата, семь корпораций, «Периметр Зеро» и то, как живут люди.",
    accent: "magenta" as const,
  },
  {
    href: "/characters",
    icon: Users,
    title: "Персонажи",
    text: "Николас и Даро, Лина, Немезида и все, кто ведёт свою линию войны.",
    accent: "cyan" as const,
  },
  {
    href: "/implants",
    icon: Microchip,
    title: "Импланты",
    text: "Справочник технологий: от мнемокассет до каркаса «Немезида-7».",
    accent: "amber" as const,
  },
  {
    href: "/armory",
    icon: Crosshair,
    title: "Вооружение",
    text: "Катана Даро, призрачный клинок, ЭМИ «Глушь» — и машины Скорпиона.",
    accent: "magenta" as const,
  },
  {
    href: "/story",
    icon: Heart,
    title: "Суть истории",
    text: "Пять людей, у которых война забрала разное: память, имя, покой.",
    accent: "cyan" as const,
  },
];

export default function Home() {
  const { scrollY } = useScroll();
  const ySun = useTransform(scrollY, [0, 700], [0, 160]);
  const ySky = useTransform(scrollY, [0, 700], [0, 80]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0.25]);

  return (
    <main className="min-h-screen flex flex-col overflow-x-clip bg-[#05050a] text-white">
      <BootOverlay />

      {/* ======================= HERO ======================= */}
      <section id="top" className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* «Затмение» — тонкий светящийся обод над городом */}
        <motion.div style={{ y: ySun }} aria-hidden className="absolute inset-x-0 top-[6%] z-0 flex justify-center">
          <div className="eclipse h-64 w-64 sm:h-80 sm:w-80" />
        </motion.div>

        {/* город + туман */}
        <motion.div style={{ y: ySky }} aria-hidden className="absolute inset-x-0 bottom-0 z-[1]">
          <Skyline />
        </motion.div>

        {/* дрейфующий туман над крышами */}
        <FogBand className="z-[2]" />

        {/* дождь */}
        <div aria-hidden className="absolute inset-0 z-[2]">
          <Rain count={46} />
        </div>

        {/* затемнение текста */}
        <div aria-hidden className="absolute inset-0 z-[3] bg-gradient-to-b from-[#05050a]/85 via-[#05050a]/35 to-[#05050a]" />

        <motion.div
          style={{ opacity: opacityHero }}
          className="relative z-10 mx-auto max-w-5xl px-4 pb-20 pt-28 text-center sm:px-6"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="font-mono-cyber mb-7 text-[10px] uppercase tracking-[0.4em] text-white/55 sm:text-xs"
          >
            Цикл романов · Хи-Мигата · 2147 год
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, letterSpacing: "0.2em", scale: 0.97 }}
            animate={{ opacity: 1, letterSpacing: "0.02em", scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="font-display text-5xl uppercase leading-none sm:text-7xl md:text-8xl"
          >
            <span className="text-white">История</span>{" "}
            <span className="glitch text-gradient-cyan" data-text="Даро">
              Даро
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8 }}
            className="font-mono-cyber mt-7 text-xs tracking-[0.35em] text-white/55 sm:text-sm"
          >
            купола держат · дождь идёт · реестр помнит всех
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="font-cyber mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg"
          >
            Хи-Мигата принадлежит семи корпорациям. В их реестрах нет
            человека, который двигает металл усилием воли, — зато на балансе
            он числится. В сводках это неполадка, в приказах — актив, в боях
            за куполом — имя Даро.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8 }}
            className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/books"
              className="btn-beam group inline-flex items-center gap-2 bg-[var(--neon-magenta)] px-8 py-4 font-mono-cyber text-sm font-bold uppercase tracking-widest text-black shadow-[0_0_28px_rgba(255,42,109,0.45)] transition-shadow hover:shadow-[0_0_44px_var(--neon-magenta)]"
            >
              <BookOpen className="h-4 w-4" aria-hidden />
              Книги цикла
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <Link
              href="/characters"
              className="inline-flex items-center gap-2 px-8 py-4 font-mono-cyber text-sm uppercase tracking-widest neon-border-cyan text-[var(--neon-cyan)] transition-colors hover:bg-[var(--neon-cyan)]/10"
            >
              <Users className="h-4 w-4" aria-hidden />
              Персонажи
            </Link>
          </motion.div>
        </motion.div>

        <Link
          href="#essence"
          aria-label="Листайте вниз — о сути истории"
          className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-white/50 transition-colors hover:text-[var(--neon-cyan)]"
        >
          <ChevronDown className="h-8 w-8 animate-bounce" aria-hidden />
        </Link>
      </section>

      {/* ======================= MARQUEE ======================= */}
      <div className="overflow-hidden border-y border-white/10 bg-black/70 py-3" aria-hidden>
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {MARQUEE_ITEMS.map((item, i) => (
                <span key={`${copy}-${i}`} className="font-mono-cyber px-8 text-[11px] tracking-[0.25em] text-white/40">
                  {item}
                  <span className="ml-8 text-white/20">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ======================= СУТЬ (тизер) ======================= */}
      <section id="essence" className="relative py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <p className="font-mono-cyber text-xs uppercase tracking-[0.4em] neon-cyan">
                00 / О чём это на самом деле
              </p>
              <h2 className="font-display mt-3 text-3xl uppercase tracking-wide text-white sm:text-4xl">
                Убери неон — и останется
              </h2>
              <p className="font-cyber mt-6 text-base leading-relaxed text-white/70">
                Это не история о победе над корпорациями. Корпорации не
                проигрывают — они перевыставляют счёт. История про пятерых:
                город под куполами, вечный дождь и то, что остаётся у людей,
                когда у людей отняли всё остальное.
              </p>
              <div className="mt-8">
                <Link
                  href="/story"
                  className="btn-beam group inline-flex items-center gap-2 border border-white/15 bg-white/5 px-6 py-3.5 font-mono-cyber text-xs uppercase tracking-widest text-white/80 transition-colors hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]"
                >
                  Прочитать целиком
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              </div>
            </motion.div>

            <div className="space-y-3">
              {HUMAN_STORIES.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.08 }}
                  className="group relative border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition-colors hover:border-white/25 sm:p-5"
                >
                  <span
                    aria-hidden
                    className={`font-mono-cyber absolute right-4 top-4 text-[10px] tracking-[0.3em] ${
                      s.accent === "cyan"
                        ? "text-[var(--neon-cyan)]/50"
                        : s.accent === "magenta"
                          ? "text-[var(--neon-magenta)]/50"
                          : "text-[var(--neon-amber)]/50"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-cyber pr-10 text-sm font-bold leading-snug text-white/90">
                    {s.title}
                  </p>
                  <p className="font-cyber mt-2 hidden text-sm leading-relaxed text-white/55 sm:block">
                    {s.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================= КНИГИ (полоса) ======================= */}
      <section className="relative border-t border-white/10 py-24 sm:py-28">
        <div className="cyber-grid absolute inset-0 opacity-[0.05]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
          >
            <div>
              <p className="font-mono-cyber text-xs uppercase tracking-[0.4em] neon-magenta">01 / Каталог</p>
              <h2 className="font-display mt-3 text-3xl uppercase tracking-wide text-white sm:text-5xl">
                Тома цикла
              </h2>
            </div>
            <Link
              href="/books"
              className="font-mono-cyber text-xs uppercase tracking-[0.25em] text-white/50 transition-colors hover:text-[var(--neon-cyan)]"
            >
              Все тома {"//"} подробнее →
            </Link>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {BOOKS.map((book, i) => (
              <motion.div
                key={book.slug}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.12 }}
              >
                <Link
                  href={`/books/${book.slug}`}
                  className="group relative flex h-full flex-col border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-white/25"
                >
                  <div className="relative aspect-[3/4] overflow-hidden border-b border-white/10">
                    <Image
                      src={book.cover}
                      alt={`Обложка тома «${book.title}»`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="cover-tone object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a16] via-transparent to-transparent" />
                    <span className="font-mono-cyber absolute left-3 top-3 border border-white/20 bg-black/70 px-3 py-1.5 text-[10px] tracking-[0.3em]">
                      {book.volume}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-2xl uppercase tracking-wide">{book.title}</h3>
                    <p className="font-mono-cyber mt-2 text-[10px] uppercase tracking-[0.25em] text-white/45">
                      {book.status} · {book.pages}
                    </p>
                    <p className="font-cyber mt-4 flex-1 text-sm leading-relaxed text-white/70">
                      {book.logline}
                    </p>
                    <span
                      className={`font-mono-cyber mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] ${
                        book.accent === "cyan"
                          ? "neon-cyan"
                          : book.accent === "magenta"
                            ? "neon-magenta"
                            : "text-[var(--neon-amber)]"
                      }`}
                    >
                      Открыть том <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= РАЗДЕЛЫ САЙТА ======================= */}
      <section className="relative border-t border-white/10 py-24 sm:py-28">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-14 text-center"
          >
            <p className="font-mono-cyber text-xs uppercase tracking-[0.4em] neon-cyan">02 / Разделы</p>
            <h2 className="font-display mt-3 text-3xl uppercase tracking-wide text-white sm:text-5xl">
              Справочник цикла
            </h2>
            <div className="mx-auto mt-5 h-px w-24 bg-[var(--neon-cyan)] shadow-[0_0_12px_var(--neon-cyan)]" />
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((s, i) => (
              <motion.div
                key={s.href}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.08 }}
              >
                <Link
                  href={s.href}
                  className="group relative block h-full border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:border-white/25"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex h-12 w-12 items-center justify-center border ${
                        s.accent === "cyan"
                          ? "border-[var(--neon-cyan)]/40 text-[var(--neon-cyan)]"
                          : s.accent === "magenta"
                            ? "border-[var(--neon-magenta)]/40 text-[var(--neon-magenta)]"
                            : "border-[var(--neon-amber)]/40 text-[var(--neon-amber)]"
                      }`}
                    >
                      <s.icon className="h-6 w-6" aria-hidden />
                    </span>
                    <h3 className="font-display text-xl uppercase tracking-wide">{s.title}</h3>
                  </div>
                  <p className="font-cyber mt-4 text-sm leading-relaxed text-white/65">{s.text}</p>
                  <span
                    className={`font-mono-cyber mt-5 inline-block text-[10px] uppercase tracking-[0.3em] opacity-0 transition-opacity group-hover:opacity-100 ${
                      s.accent === "cyan"
                        ? "neon-cyan"
                        : s.accent === "magenta"
                          ? "neon-magenta"
                          : "text-[var(--neon-amber)]"
                    }`}
                  >
                    Перейти {"//"} →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.blockquote
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative mx-auto mt-16 max-w-3xl"
          >
            <Corners color="magenta" />
            <div className="beam-border-static">
              <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--neon-magenta)]/70" aria-hidden />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--neon-amber)]/70" aria-hidden />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--neon-cyan)]/70" aria-hidden />
                <span className="font-mono-cyber ml-3 text-[10px] uppercase tracking-[0.3em] text-white/40">
                  мировоззрение цикла
                </span>
              </div>
              <div className="p-6 sm:p-8">
                <Quote className="neon-magenta mb-4 h-5 w-5" aria-hidden />
                <p className="font-cyber text-lg italic leading-relaxed text-white/85 sm:text-xl">
                  «Мир не разрушен. Он контролируется. Это хуже. Но контроль
                  держится на реестрах, а реестры — на людях, которые их ещё
                  заполняют».
                </p>
                <cite className="font-mono-cyber mt-4 block text-xs uppercase not-italic tracking-[0.3em] text-white/50">
                  — СВОДКА ОБСТАНОВКИ · ЦЕНЗУРА «СПЕКТРА»
                </cite>
              </div>
            </div>
          </motion.blockquote>
        </div>
      </section>

      {/* ======================= ХРОНИКИ (тизер) ======================= */}
      <section className="relative border-t border-white/10 py-24 sm:py-28">
        <div className="cyber-grid absolute inset-0 opacity-[0.05]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <p className="font-mono-cyber text-xs uppercase tracking-[0.4em] text-[var(--neon-amber)]">
                Восстановленные записи
              </p>
              <h2 className="font-display mt-3 text-3xl uppercase tracking-wide text-white sm:text-4xl">
                Хроники
              </h2>
              <p className="font-cyber mt-6 text-base leading-relaxed text-white/70">
                Флешбеки и расшифрованные файлы, которые не вошли в тома, но
                случились в этом мире. Первый — запись объекта «РХ», которого
                реестры консорциума считают мёртвым: ночь, когда Резонансный
                Охотник перестал быть машиной убийства и вышел из лаборатории
                сам решать, кого убивать.
              </p>
              <div className="mt-8">
                <Link
                  href="/chronicles"
                  className="btn-beam group inline-flex items-center gap-2 border border-white/15 bg-white/5 px-6 py-3.5 font-mono-cyber text-xs uppercase tracking-widest text-white/80 transition-colors hover:border-[var(--neon-amber)] hover:text-[var(--neon-amber)]"
                >
                  <ScrollText className="h-3.5 w-3.5" aria-hidden />
                  Открыть архив хроник
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
              className="relative"
            >
              <Corners color="amber" />
              <div className="beam-border-static">
                <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--neon-magenta)]/70" aria-hidden />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--neon-amber)]/70" aria-hidden />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--neon-cyan)]/70" aria-hidden />
                  <span className="font-mono-cyber ml-3 text-[10px] uppercase tracking-[0.3em] text-white/40">
                    {CHRONICLES[0].code} · {CHRONICLES[0].sourceLabel}
                  </span>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="font-mono-cyber text-[11px] leading-relaxed tracking-[0.08em] text-[var(--neon-amber)]/90">
                    «Система идентификации целей активирована. Код 87-А:
                    Ликвидация». — ИСКИН
                  </p>
                  <p className="font-cyber mt-5 text-sm leading-relaxed text-white/75 sm:text-base">
                    Сирены заливали лабораторию кроваво-красным светом. Так много
                    лет его импланты управляли им… но теперь он мог
                    сопротивляться. Он был охотником — и на этот раз он сам решал,
                    кого убивать.
                  </p>
                  <Link
                    href={`/chronicles/${CHRONICLES[0].slug}`}
                    className="font-mono-cyber mt-6 inline-flex items-center gap-2 border border-[var(--neon-amber)]/50 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-[var(--neon-amber)] transition-colors hover:bg-[var(--neon-amber)]/10"
                  >
                    Файл {CHRONICLES[0].code} — читать
                    <ArrowRight className="h-3 w-3" aria-hidden />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================= БЛОКИ-ИЗ-КОНТЕНТА (HOMEPAGE_BLOCKS) ======================= */}
      <HomeBlocks blocks={HOMEPAGE_BLOCKS} />

      {/* ======================= ПОДПИСКА ======================= */}
      <section id="subscribe" className="relative overflow-hidden border-t border-white/10 py-24 sm:py-28">
        <div aria-hidden className="aurora-blob cyan left-[8%] top-[10%] h-72 w-72" />
        <div aria-hidden className="aurora-blob magenta bottom-[5%] right-[6%] h-80 w-80" />
        <FogBand className="opacity-60" />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="font-mono-cyber text-xs uppercase tracking-[0.4em] neon-cyan">03 / Связь</p>
            <h2 className="font-display mt-3 text-3xl uppercase tracking-wide text-white sm:text-5xl">
              Подписка
            </h2>
            <div className="mx-auto mt-5 h-px w-24 bg-[var(--neon-cyan)] shadow-[0_0_12px_var(--neon-cyan)]" />
            <p className="font-cyber mt-8 text-white/70">
              Канал связи с «Периметром Зеро»: анонсы томов, фрагменты глав и
              заметки о мире Хи-Мигаты.
            </p>
            <div className="mt-9 text-left">
              <SubscribeForm />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================= АВТОР (тизер) ======================= */}
      <section className="relative border-t border-white/10 py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <Feather className="neon-cyan h-7 w-7" aria-hidden />
          <p className="font-cyber max-w-2xl text-sm leading-relaxed text-white/60">
            Пишу о городе, которого нет, — о людях, которые в нём очень даже
            есть. «История Даро» началась с вопроса: если память можно отнять,
            а личность расщепить, то что вообще значит «быть собой»?
          </p>
          <Link
            href="/author"
            className="font-mono-cyber inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/50 transition-colors hover:text-[var(--neon-cyan)]"
          >
            <User className="h-3.5 w-3.5" aria-hidden />
            Страница автора →
          </Link>
        </div>
      </section>

      {/* нижний отступ не нужен: футер общий в layout */}
    </main>
  );
}
