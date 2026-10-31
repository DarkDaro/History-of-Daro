"use client";

/* ============================================================
   SFX-движок «Истории Даро»: короткие синтезированные звуки
   интерфейса на Web Audio API. Без внешних файлов.
   Работает только когда включён «Эфир» (та же кнопка, что и
   дарк-эмбиент) — предпочтение хранится в localStorage.
   ============================================================ */

export const ETHER_KEY = "daro-ether";

export type SfxKind = "hover" | "click" | "confirm" | "deny" | "boot" | "whoosh";

let ctx: AudioContext | null = null;
let lastHover = 0;

/** Безопасное чтение предпочтения (SSR и приватные режимы не падают). */
export function etherEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(ETHER_KEY) === "on";
  } catch {
    return false;
  }
}

export function setEtherEnabled(on: boolean): void {
  try {
    window.localStorage.setItem(ETHER_KEY, on ? "on" : "off");
  } catch {
    /* приватный режим — просто не запоминаем */
  }
}

function audio(): AudioContext | null {
  if (typeof window === "undefined" || !("AudioContext" in window)) return null;
  if (!etherEnabled()) return null;
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Один синтезированный тон с огибающей. */
function tone(
  ac: AudioContext,
  {
    freq,
    to,
    dur,
    gain,
    type = "sine",
    delay = 0,
  }: {
    freq: number;
    to?: number;
    dur: number;
    gain: number;
    type?: OscillatorType;
    delay?: number;
  }
) {
  const t0 = ac.currentTime + delay;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(ac.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

/** Короткий шумовой всплеск через фильтр (для «вжух» и «бут»). */
function noise(
  ac: AudioContext,
  {
    from,
    to,
    dur,
    gain,
    q = 1,
    delay = 0,
  }: { from: number; to: number; dur: number; gain: number; q?: number; delay?: number }
) {
  const t0 = ac.currentTime + delay;
  const seconds = Math.max(0.25, dur + 0.1);
  const buf = ac.createBuffer(1, Math.ceil(ac.sampleRate * seconds), ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buf;
  const f = ac.createBiquadFilter();
  f.type = "bandpass";
  f.Q.value = q;
  f.frequency.setValueAtTime(from, t0);
  f.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  const g = ac.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + dur * 0.25);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f).connect(g).connect(ac.destination);
  src.start(t0);
  src.stop(t0 + seconds);
}

/**
 * Проиграть звук интерфейса. Тихий, ненавязчивый, с защитой
 * от спама (ховер — не чаще раза в 90 мс).
 */
export function sfx(kind: SfxKind): void {
  const ac = audio();
  if (!ac) return;

  switch (kind) {
    case "hover": {
      const now = performance.now();
      if (now - lastHover < 90) return;
      lastHover = now;
      tone(ac, { freq: 1250, to: 1650, dur: 0.07, gain: 0.028, type: "sine" });
      break;
    }
    case "click":
      tone(ac, { freq: 740, to: 1180, dur: 0.09, gain: 0.09, type: "triangle" });
      tone(ac, { freq: 2960, dur: 0.03, gain: 0.03, type: "sine", delay: 0.01 });
      break;
    case "confirm":
      tone(ac, { freq: 660, dur: 0.12, gain: 0.08, type: "triangle" });
      tone(ac, { freq: 880, dur: 0.12, gain: 0.08, type: "triangle", delay: 0.09 });
      tone(ac, { freq: 1320, dur: 0.2, gain: 0.08, type: "triangle", delay: 0.18 });
      break;
    case "deny":
      tone(ac, { freq: 420, to: 220, dur: 0.22, gain: 0.09, type: "sawtooth" });
      break;
    case "boot":
      tone(ac, { freq: 70, to: 330, dur: 0.6, gain: 0.11, type: "sawtooth" });
      noise(ac, { from: 300, to: 3200, dur: 0.55, gain: 0.05, q: 2 });
      tone(ac, { freq: 1320, dur: 0.14, gain: 0.05, type: "sine", delay: 0.62 });
      break;
    case "whoosh":
      noise(ac, { from: 500, to: 2600, dur: 0.32, gain: 0.06, q: 1.4 });
      break;
  }
}
