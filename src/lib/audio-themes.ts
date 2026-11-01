"use client";

/* ============================================================
   Музыкальные темы страниц (A4 ROADMAP).

   Каждый раздел сайта получает свою генеративную тему на шине
   «music» аудио-ядра. Общая структура темы:
     - пэд-аккорд (медленные осцилляторы с LFO-дыханием);
     - редкая мелодическая фигура из лада раздела
       (режим «random» — случайный выбор нот, «seq» — секвенсор).

   Общая тональная база — ля-минор и родственные лады: темы
   различаются, но живут в одном мире. Смена темы — кроссфейд
   ~1.2 с при переходе между страницами.

   Всё синтезируется, внешних файлов нет. Громкость шины —
   ползунок «Темы страниц» в микшере «Эфира».
   ============================================================ */

import { busInput } from "./audio-engine";

export type ThemeId =
  | "home"
  | "books"
  | "world"
  | "characters"
  | "excerpts"
  | "timeline"
  | "tech"
  | "chronicles"
  | "neutral";

interface ThemeSpec {
  /** Пэд-аккорд: частоты, Гц. */
  pad: number[];
  padType: OscillatorType;
  padGain: number;
  padFilter: number;
  /** Мелодическая фигура: ноты, Гц. */
  melodic: number[];
  melodicType: OscillatorType;
  /** Пауза между нотами, мс [мин, макс]. */
  melodicEvery: [number, number];
  melodicDur: number;
  melodicGain: number;
  /** random — случайная нота; seq — по кругу (секвенсор). */
  melodicMode: "random" | "seq";
}

/* Частоты подобраны в ладах:
   A-минор (дом), D-минор (книги), кластер Bb (мир корпораций),
   D-блюз с низкой 3-й (персонажи/нуар), высокие обертоны (читалка),
   Am-пентатоника (таймлайн), квинты (техника), Ab (архив),
   C-мажор (нейтральные). */
export const THEMES: Record<ThemeId, ThemeSpec> = {
  home: {
    pad: [220, 261.63, 329.63],
    padType: "triangle",
    padGain: 0.05,
    padFilter: 700,
    melodic: [880, 1046.5, 1318.5],
    melodicType: "sine",
    melodicEvery: [9000, 16000],
    melodicDur: 2.2,
    melodicGain: 0.035,
    melodicMode: "random",
  },
  books: {
    pad: [146.83, 174.61, 220, 261.63],
    padType: "triangle",
    padGain: 0.055,
    padFilter: 620,
    melodic: [587.33, 698.46, 880],
    melodicType: "sine",
    melodicEvery: [11000, 18000],
    melodicDur: 2.6,
    melodicGain: 0.03,
    melodicMode: "random",
  },
  world: {
    pad: [110, 116.54, 220],
    padType: "sawtooth",
    padGain: 0.035,
    padFilter: 420,
    melodic: [233.08, 440, 466.16],
    melodicType: "square",
    melodicEvery: [13000, 21000],
    melodicDur: 0.5,
    melodicGain: 0.028,
    melodicMode: "random",
  },
  characters: {
    pad: [146.83, 174.61, 207.65, 220],
    padType: "triangle",
    padGain: 0.05,
    padFilter: 560,
    melodic: [293.66, 349.23, 415.3, 440],
    melodicType: "sine",
    melodicEvery: [8000, 15000],
    melodicDur: 1.8,
    melodicGain: 0.032,
    melodicMode: "random",
  },
  excerpts: {
    pad: [220, 329.63],
    padType: "sine",
    padGain: 0.03,
    padFilter: 900,
    melodic: [1760, 2093, 2637],
    melodicType: "sine",
    melodicEvery: [15000, 26000],
    melodicDur: 0.5,
    melodicGain: 0.02,
    melodicMode: "random",
  },
  timeline: {
    pad: [110, 220],
    padType: "triangle",
    padGain: 0.04,
    padFilter: 800,
    melodic: [220, 261.63, 293.66, 329.63, 392, 440],
    melodicType: "triangle",
    melodicEvery: [2200, 2200],
    melodicDur: 0.35,
    melodicGain: 0.03,
    melodicMode: "seq",
  },
  tech: {
    pad: [110, 164.81],
    padType: "sawtooth",
    padGain: 0.04,
    padFilter: 480,
    melodic: [880, 1318.5],
    melodicType: "triangle",
    melodicEvery: [7000, 12000],
    melodicDur: 0.4,
    melodicGain: 0.035,
    melodicMode: "random",
  },
  chronicles: {
    pad: [103.83, 155.56],
    padType: "sawtooth",
    padGain: 0.03,
    padFilter: 380,
    melodic: [415.3, 466.16],
    melodicType: "sine",
    melodicEvery: [16000, 26000],
    melodicDur: 1.4,
    melodicGain: 0.025,
    melodicMode: "random",
  },
  neutral: {
    pad: [130.81, 196, 329.63],
    padType: "triangle",
    padGain: 0.045,
    padFilter: 680,
    melodic: [523.25, 659.25, 783.99],
    melodicType: "sine",
    melodicEvery: [12000, 20000],
    melodicDur: 2,
    melodicGain: 0.03,
    melodicMode: "random",
  },
};

/** Тема по адресу страницы. */
export function themeForPathname(path: string): ThemeId {
  if (path === "/" || path === "") return "home";
  if (path.startsWith("/books")) return "books";
  if (path.startsWith("/world")) return "world";
  if (path.startsWith("/characters")) return "characters";
  if (path.startsWith("/excerpts")) return "excerpts";
  if (path.startsWith("/timeline")) return "timeline";
  if (path.startsWith("/armory") || path.startsWith("/implants")) return "tech";
  if (path.startsWith("/chronicles")) return "chronicles";
  return "neutral";
}

export interface MusicLayer {
  setTheme: (id: ThemeId) => void;
  cleanup: () => void;
}

/**
 * Слой тем: подключается к шине «music». Смена темы — старые узлы
 * плавно гаснут и уничтожаются, новые нарастают (кроссфейд).
 */
export function createMusicLayer(ctx: AudioContext): MusicLayer {
  const out = ctx.createGain();
  out.gain.value = 1;
  out.connect(busInput("music", ctx));

  let dead = false;
  let activeId: ThemeId | null = null;
  let active: { gain: GainNode; cleanup: () => void } | null = null;

  const buildTheme = (spec: ThemeSpec) => {
    const localStops: Array<() => void> = [];
    const localTimers: Array<ReturnType<typeof setTimeout>> = [];

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(out);

    /* Пэд-аккорд: осцилляторы с детюном и медленным дыханием. */
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = "lowpass";
    padFilter.frequency.value = spec.padFilter;
    padFilter.connect(gain);
    spec.pad.forEach((f, i) => {
      const noteGain = ctx.createGain();
      noteGain.gain.value = 0.3;
      noteGain.connect(padFilter);
      const o = ctx.createOscillator();
      o.type = spec.padType;
      o.frequency.value = f;
      o.detune.value = i * 4 - 6;
      o.connect(noteGain);
      o.start();
      localStops.push(() => {
        try {
          o.stop();
        } catch {
          /* already stopped */
        }
      });
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.015 + i * 0.008;
      const lg = ctx.createGain();
      lg.gain.value = 0.12;
      lfo.connect(lg);
      lg.connect(noteGain.gain);
      lfo.start();
      localStops.push(() => {
        try {
          lfo.stop();
        } catch {
          /* already stopped */
        }
      });
    });

    /* Мелодическая фигура: редкие ноты из лада раздела. */
    let step = 0;
    const note = () => {
      if (dead) return;
      const idx =
        spec.melodicMode === "seq"
          ? step % spec.melodic.length
          : Math.floor(Math.random() * spec.melodic.length);
      step += 1;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      o.type = spec.melodicType;
      o.frequency.value = spec.melodic[idx];
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(spec.melodicGain, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + spec.melodicDur);
      o.connect(g).connect(gain);
      o.start(t);
      o.stop(t + spec.melodicDur + 0.1);
      const every =
        spec.melodicEvery[0] +
        Math.random() * (spec.melodicEvery[1] - spec.melodicEvery[0]);
      localTimers.push(setTimeout(note, every));
    };
    localTimers.push(setTimeout(note, 1500 + Math.random() * 2500));

    return {
      gain,
      cleanup() {
        localTimers.forEach(clearTimeout);
        localStops.forEach((s) => s());
        try {
          gain.disconnect();
        } catch {
          /* already disconnected */
        }
      },
    };
  };

  return {
    setTheme(id: ThemeId) {
      if (dead || id === activeId) return;
      const old = active;
      activeId = id;
      const fresh = buildTheme(THEMES[id]);
      active = fresh;
      fresh.gain.gain.setTargetAtTime(1, ctx.currentTime, 0.5);
      if (old) {
        old.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.45);
        setTimeout(() => old.cleanup(), 1800);
      }
    },
    cleanup() {
      dead = true;
      active?.cleanup();
      active = null;
      try {
        out.disconnect();
      } catch {
        /* already disconnected */
      }
    },
  };
}
