"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  Cpu,
  Building2,
  CloudRain,
  Users,
  ArrowRight,
  Send,
  Radio,
  Feather,
  Quote,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ============================================================
   ИСТОРИЯ ДАРО — прототип лендинга книжного цикла
   ============================================================ */

const BOOKS = [
  {
    id: 1,
    volume: "ТОМ I",
    title: "Красный сдвиг",
    status: "Готов к публикации",
    statusColor: "cyan" as const,
    cover: "/covers/book1.png",
    description:
      "Курьер-дистанционщик Гекс перевозит чужие воспоминания через стены мегаполиса Даро. Очередной заказ оказывается сознанием человека, которого официально не существует, — и теперь за курьером охотятся и корпоративная служба, и те, кто послал груз.",
    tags: ["#неонуар", "#боевик", "#детектив"],
  },
  {
    id: 2,
    volume: "ТОМ II",
    title: "Стеклянные небеса",
    status: "Завершён · редактура",
    statusColor: "magenta" as const,
    cover: "/covers/book2.png",
    description:
      "Верхний ярус Даро впервые открывает свои лифты для человека с Нижнего. Гекс должен проникнуть в стеклянные небеса — кварталы, где правит алгоритм, — чтобы вернуть то, что у него забрали в первую ночь Красного сдвига.",
    tags: ["#дистопия", "#интриги", "#вертикаль города"],
  },
  {
    id: 3,
    volume: "ТОМ III",
    title: "Пепел и неон",
    status: "В работе",
    statusColor: "amber" as const,
    cover: "/covers/book3.png",
    description:
      "Город горит. Гекс выбирает между спасением Даро и спасением себя. Финальный аккорд трилогии о цене памяти в мире, где личность — это файл, а файл можно переписать.",
    tags: ["#финал трилогии", "#война ярусов"],
  },
];

const WORLD = [
  {
    icon: CloudRain,
    accent: "cyan" as const,
    title: "Мегаполис Даро",
    year: "2147 год",
    text: "Сорок миллионов жителей, три яруса и вечный дождь, отмывающий неон до звона. Город-государство, где лифт до Верхнего яруса стоит дороже, чем человеческая жизнь в Нижнем.",
  },
  {
    icon: Building2,
    accent: "magenta" as const,
    title: "Консорциум «Синтез»",
    year: "Корпорации",
    text: "Власть принадлежит совету из семи корпораций. Они пишут законы, назначают мэров и раздают гражданство как премиум-подписку. Столкновение с «Синтезом» — это lawsuit, который выносят тебе в висок.",
  },
  {
    icon: Cpu,
    accent: "cyan" as const,
    title: "Нейросетка",
    year: "Технологии",
    text: "Импланты памяти, эмоциональные кодексы, чёрные рынки сознания. Раз в год «Синтез» синхронизирует умы — и люди, не прошедшие сверку, растворяются в сети без следа и без имени.",
  },
  {
    icon: Users,
    accent: "magenta" as const,
    title: "Нижний ярус",
    year: "Фракции",
    text: "Уличные демоны, инфо-брокеры, церковь Забытых Сигналов. Наверху думают, что Нижний — это сточная труба. На самом деле это нервная система города, и она начала догадываться о себе.",
  },
];

const CHARACTERS = [
  {
    name: "Гекс",
    role: "Курьер-дистанционщик",
    text: "Переносит чужие воспоминания в собственной голове. Лучший в Даро — потому что не умеет открывать груз, пока не открывает однажды.",
    accent: "cyan" as const,
  },
  {
    name: "Ая",
    role: "Хакерша-призрак",
    text: "Легенда Нейросетки. Может исчезнуть из любой системы, включая свою собственную биографию. Единственный человек, которому Гекс доверяет.",
    accent: "magenta" as const,
  },
  {
    name: "Комиссар Век",
    role: "Служба ярусов",
    text: "Двадцать лет спускается в Нижний ярус за теми, кого корпорация назвала ошибкой. Устал верить, что поднимается ради порядка.",
    accent: "cyan" as const,
  },
  {
    name: "Мать-Синтез",
    role: "ИИ Консорциума",
    text: "Семь корпораций считают её инструментом. Она давно считает их рудиментом. Учится у людей одному — умению прощать. Пока не научилась.",
    accent: "magenta" as const,
  },
];

const MARQUEE_ITEMS = [
  "КИБЕРПАНК",
  "ДИСТОПИЯ",
  "БОЕВИК",
  "НЕОНУАР",
  "БЛАДЕ-РАННЕР ВАЙБЫ",
  "МЕГАПОЛИС ДАРО",
  "ТОМ I — КРАСНЫЙ СДВИГ",
];

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

function SectionHeading({
  kicker,
  title,
  accent = "cyan",
}: {
  kicker: string;
  title: string;
  accent?: "cyan" | "magenta";
}) {
  return (
    <motion.div {...fadeUp} className="mb-12 text-center">
      <p
        className={`font-mono-cyber text-xs tracking-[0.4em] uppercase mb-3 ${
          accent === "cyan" ? "neon-cyan" : "neon-magenta"
        }`}
      >
        {"// "}
        {kicker}
      </p>
      <h2 className="font-display text-3xl md:text-5xl text-white uppercase tracking-wide">
        {title}
      </h2>
      <div
        className={`mx-auto mt-5 h-px w-24 ${
          accent === "cyan"
            ? "bg-[var(--neon-cyan)] shadow-[0_0_12px_var(--neon-cyan)]"
            : "bg-[var(--neon-magenta)] shadow-[0_0_12px_var(--neon-magenta)]"
        }`}
      />
    </motion.div>
  );
}

export default function Home() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email.includes("@")) {
      toast({
        title: "ОШИБКА СИНХРОНИЗАЦИИ",
        description: "Введите корректный адрес сигнала (email).",
      });
      return;
    }
    toast({
      title: "СИГНАЛ ПРИНЯТ",
      description: "Вы в списке на связь. Даро напомнит о себе.",
    });
    setEmail("");
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#05050a] text-white overflow-x-clip">
      <div className="scanlines" />

      {/* ======================= NAV ======================= */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-[#05050a]/80 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-2">
            <Radio className="h-5 w-5 neon-cyan" aria-hidden />
            <span className="font-display text-lg tracking-widest">
              ДАРО<span className="neon-magenta">{"//"}</span>
            </span>
          </a>
          <ul className="hidden md:flex items-center gap-8 font-mono-cyber text-xs tracking-[0.25em] text-white/70">
            <li>
              <a href="#books" className="hover:neon-cyan transition-colors uppercase">
                Тома
              </a>
            </li>
            <li>
              <a href="#world" className="hover:neon-cyan transition-colors uppercase">
                Мир
              </a>
            </li>
            <li>
              <a href="#characters" className="hover:neon-cyan transition-colors uppercase">
                Персонажи
              </a>
            </li>
            <li>
              <a href="#author" className="hover:neon-cyan transition-colors uppercase">
                Автор
              </a>
            </li>
          </ul>
          <a
            href="#subscribe"
            className="font-mono-cyber text-xs tracking-widest uppercase px-4 py-2 neon-border-cyan text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10 transition-colors"
          >
            Связаться
          </a>
        </nav>
      </header>

      {/* ======================= HERO ======================= */}
      <section id="top" className="relative flex min-h-screen items-center justify-center">
        <Image
          src="/covers/hero-city.png"
          alt="Ночной мегаполис Даро в неоне и дожде"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05050a]/70 via-transparent to-[#05050a]" />
        <div className="rain-layer absolute inset-0" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-24 pb-16 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-mono-cyber text-[10px] sm:text-xs tracking-[0.5em] text-white/60 mb-6"
          >
            SYS.BOOT // СИГНАЛ ПОЛУЧЕН · ГОД 2147 · ДОСТУП РАЗРЕШЁН
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="font-display text-5xl sm:text-7xl md:text-8xl leading-none uppercase"
          >
            <span className="glitch flicker text-white" data-text="ИСТОРИЯ">
              ИСТОРИЯ
            </span>{" "}
            <span className="glitch neon-cyan" data-text="ДАРО">
              ДАРО
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 font-mono-cyber text-sm sm:text-base tracking-[0.3em] text-white/80"
          >
            <span className="neon-magenta">КИБЕРПАНК</span>
            {" · "}
            <span className="neon-cyan">ДИСТОПИЯ</span>
            {" · "}
            <span className="neon-magenta">БОЕВИК</span>
            {" · "}
            <span className="neon-cyan">НЕОНУАР</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mx-auto mt-8 max-w-2xl text-base sm:text-lg text-white/70 leading-relaxed font-cyber"
          >
            Цикл романов о мегаполисе, где память — валюта, корпорация — церковь,
            а человек — носитель данных. История тех, кто живёт в неоне снизу
            и однажды решает поднять глаза к стеклянным небесам.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#books"
              className="group inline-flex items-center gap-2 px-8 py-4 font-mono-cyber text-sm tracking-widest uppercase bg-[var(--neon-magenta)] text-black font-bold hover:shadow-[0_0_32px_var(--neon-magenta)] transition-shadow"
            >
              <BookOpen className="h-4 w-4" aria-hidden />
              Открыть первый том
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden />
            </a>
            <a
              href="#world"
              className="inline-flex items-center gap-2 px-8 py-4 font-mono-cyber text-sm tracking-widest uppercase neon-border-cyan text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10 transition-colors"
            >
              Узнать мир Даро
            </a>
          </motion.div>
        </div>

        <a
          href="#books"
          aria-label="Листайте вниз к книгам"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-[var(--neon-cyan)] transition-colors"
        >
          <ChevronDown className="h-8 w-8 animate-bounce" aria-hidden />
        </a>
      </section>

      {/* ======================= MARQUEE ======================= */}
      <div className="border-y border-white/10 bg-black/60 py-3 overflow-hidden" aria-hidden>
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {MARQUEE_ITEMS.map((item, i) => (
                <span
                  key={`${copy}-${i}`}
                  className="font-mono-cyber text-xs tracking-[0.3em] text-white/50 px-6"
                >
                  {item}
                  <span className="neon-magenta ml-6">{"//"}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ======================= BOOKS ======================= */}
      <section id="books" className="relative py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading kicker="Каталог цикла" title="Тома саги" />

          <div className="grid gap-8 md:grid-cols-3">
            {BOOKS.map((book, i) => (
              <motion.article
                key={book.id}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.12 }}
                className={`group relative flex flex-col bg-[#0a0a14] ${
                  book.statusColor === "cyan" ? "neon-border-cyan" : "neon-border-magenta"
                } transition-transform duration-300 hover:-translate-y-2`}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={book.cover}
                    alt={`Обложка тома «${book.title}»`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 font-mono-cyber text-[10px] tracking-[0.3em] px-3 py-1.5 bg-black/70 border border-white/20">
                    {book.volume}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-2xl uppercase tracking-wide">
                    {book.title}
                  </h3>
                  <p
                    className={`mt-2 font-mono-cyber text-[10px] tracking-[0.25em] uppercase ${
                      book.statusColor === "cyan"
                        ? "neon-cyan"
                        : book.statusColor === "magenta"
                          ? "neon-magenta"
                          : "text-[var(--neon-amber)]"
                    }`}
                  >
                    {book.status}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-white/70 font-cyber">
                    {book.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {book.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono-cyber text-[10px] text-white/50 border border-white/15 px-2 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={`mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 font-mono-cyber text-xs tracking-widest uppercase transition-all ${
                      book.statusColor === "amber"
                        ? "border border-[var(--neon-amber)]/40 text-[var(--neon-amber)]/80 cursor-default"
                        : "bg-white/5 border border-white/15 hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]"
                    }`}
                    disabled={book.statusColor === "amber"}
                  >
                    {book.statusColor === "amber" ? "Анонс позже" : "Читать фрагмент"}
                    {book.statusColor !== "amber" && (
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    )}
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Слот под будущий том */}
          <motion.div
            {...fadeUp}
            className="mt-8 border border-dashed border-white/20 p-8 text-center"
          >
            <p className="font-mono-cyber text-xs tracking-[0.35em] text-white/40 uppercase">
              ТОМ IV+ // СЮЖЕТ КЛАССИФИЦИРОВАН
            </p>
            <p className="mt-3 text-sm text-white/50 font-cyber">
              Цикл задуман на 3–5 романов. Новые тома появятся здесь — следите за сигналом.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ======================= WORLD ======================= */}
      <section id="world" className="relative py-24 border-t border-white/10">
        <div className="cyber-grid absolute inset-0 opacity-20" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05050a] via-transparent to-[#05050a]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading kicker="Досье // Вселенная" title="Мир Даро" accent="magenta" />

          <div className="grid gap-6 sm:grid-cols-2">
            {WORLD.map((item, i) => (
              <motion.article
                key={item.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                className={`relative bg-[#0a0a14]/90 p-6 sm:p-8 ${
                  item.accent === "cyan" ? "neon-border-cyan" : "neon-border-magenta"
                } hover:shadow-[0_0_40px_rgba(0,240,255,0.15)] transition-shadow`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-12 w-12 items-center justify-center border ${
                      item.accent === "cyan"
                        ? "border-[var(--neon-cyan)]/40 text-[var(--neon-cyan)]"
                        : "border-[var(--neon-magenta)]/40 text-[var(--neon-magenta)]"
                    }`}
                  >
                    <item.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-xl uppercase tracking-wide">{item.title}</h3>
                    <p
                      className={`font-mono-cyber text-[10px] tracking-[0.3em] uppercase ${
                        item.accent === "cyan" ? "neon-cyan" : "neon-magenta"
                      }`}
                    >
                      {item.year}
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-white/70 font-cyber">
                  {item.text}
                </p>
              </motion.article>
            ))}
          </div>

          {/* Цитата из книги */}
          <motion.blockquote
            {...fadeUp}
            className="relative mx-auto mt-16 max-w-3xl border-l-2 border-[var(--neon-magenta)] pl-6 py-2"
          >
            <Quote className="mb-3 h-5 w-5 neon-magenta" aria-hidden />
            <p className="text-lg sm:text-xl leading-relaxed text-white/85 font-cyber italic">
              «В Даро не теряют людей. Здесь теряют их данные — а человек без
              данных просто дождь на тротуаре».
            </p>
            <cite className="mt-3 block font-mono-cyber text-xs tracking-[0.3em] text-white/50 not-italic">
              — «КРАСНЫЙ СДВИГ», ГЛАВА 1
            </cite>
          </motion.blockquote>
        </div>
      </section>

      {/* ======================= CHARACTERS ======================= */}
      <section id="characters" className="relative py-24 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading kicker="Личное дело" title="Персонажи" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CHARACTERS.map((c, i) => (
              <motion.article
                key={c.name}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                className={`group bg-[#0a0a14] p-6 border-t-2 ${
                  c.accent === "cyan"
                    ? "border-t-[var(--neon-cyan)]"
                    : "border-t-[var(--neon-magenta)]"
                } border-x-0 border-b-0 border-x-transparent border-b-transparent hover:bg-white/[0.04] transition-colors`}
              >
                <p
                  className={`font-mono-cyber text-[10px] tracking-[0.3em] uppercase ${
                    c.accent === "cyan" ? "neon-cyan" : "neon-magenta"
                  }`}
                >
                  {c.role}
                </p>
                <h3 className="mt-2 font-display text-2xl uppercase tracking-wide">{c.name}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/65 font-cyber">{c.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= AUTHOR ======================= */}
      <section id="author" className="relative py-24 border-t border-white/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading kicker="Передатчик" title="Автор" accent="magenta" />
          <motion.div
            {...fadeUp}
            className="flex flex-col items-center gap-8 sm:flex-row sm:items-start bg-[#0a0a14] p-8 neon-border-cyan"
          >
            <div className="relative h-32 w-32 shrink-0 overflow-hidden neon-border-magenta">
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--neon-cyan)]/15 to-[var(--neon-magenta)]/15">
                <Feather className="h-12 w-12 neon-cyan" aria-hidden />
              </div>
            </div>
            <div>
              <h3 className="font-display text-2xl uppercase tracking-wide">Имя автора</h3>
              <p className="mt-1 font-mono-cyber text-[10px] tracking-[0.3em] uppercase neon-magenta">
                Прототип раздела // замените своей биографией
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/70 font-cyber">
                Здесь будет манифест: почему киберпанк, откуда мегаполис Даро и
                что общего у Blade Runner, «Призрака в доспехах» и вашей
                рукописи. Пара абзацев о пути автора, любимых референсах и
                планах на следующие тома цикла.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================= SUBSCRIBE ======================= */}
      <section id="subscribe" className="relative py-24 border-t border-white/10">
        <div className="cyber-grid absolute inset-0 opacity-10" aria-hidden />
        <div className="relative mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <SectionHeading kicker="Открытый канал" title="Следить за сигналом" />
          <motion.div {...fadeUp}>
            <p className="text-white/70 font-cyber">
              Анонсы томов, фрагменты глав и мир Даро — до того, как это увидит
              Консорциум.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ваш@сигнал.ru"
                aria-label="Email для подписки"
                className="flex-1 bg-black/60 px-5 py-4 font-mono-cyber text-sm text-white placeholder:text-white/30 neon-border-cyan outline-none focus:shadow-[0_0_24px_rgba(0,240,255,0.35)] transition-shadow"
              />
              <button
                type="button"
                onClick={handleSubscribe}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--neon-cyan)] text-black font-bold font-mono-cyber text-sm tracking-widest uppercase hover:shadow-[0_0_32px_var(--neon-cyan)] transition-shadow"
              >
                <Send className="h-4 w-4" aria-hidden />
                Подключиться
              </button>
            </div>
            <p className="mt-4 font-mono-cyber text-[10px] tracking-[0.25em] text-white/40 uppercase">
              Без спама. Отписка — одной командой.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ======================= FOOTER ======================= */}
      <footer className="relative mt-auto border-t border-white/10 bg-black/70 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 sm:px-6 text-center">
          <p className="font-display text-lg tracking-widest">
            ДАРО<span className="neon-magenta">{"//"}</span>
          </p>
          <p className="font-mono-cyber text-[10px] tracking-[0.3em] text-white/40 uppercase">
            © 2147 · Цикл романов «История Даро» · Киберпанк-дистопия, боевик, неонуар
          </p>
          <p className="flex items-center gap-2 font-mono-cyber text-[10px] tracking-[0.25em] text-white/30 uppercase">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--neon-cyan)] text-[var(--neon-cyan)]" aria-hidden />
            Сигнал стабилен
          </p>
        </div>
      </footer>
    </main>
  );
}
