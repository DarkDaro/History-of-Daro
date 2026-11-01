"use client";

/* ============================================================
   Аудио-ядро «Истории Даро» (A1 ROADMAP).

   Один AudioContext на весь сайт + шина-микшер:

     [ambience] ─┐
     [music]    ─┼→ [master] → destination
     [ui]       ─┘

   - ambience — дождь, дрон, гром, пэд (ambient-audio.tsx);
   - music    — темы страниц (A4, audio-themes.ts);
   - ui       — звуки интерфейса (sfx.ts).

   Громкости каждой шины живут в localStorage (daro-vol-*),
   меняются плавно (setTargetAtTime — без щелчков) и применяются
   к живому звуку мгновенно. Флаг «Эфир» (daro-ether, sfx.ts)
   остаётся главным выключателем: если он off — источники просто
   не запускаются и звуки не воспроизводятся.

   Контекст создаётся лениво; по требованию браузеров реальный
   запуск возможен только из пользовательского жеста — вызывающий
   код (кнопка «Эфир», armed-поток) это уже учитывает.
   ============================================================ */

export type BusName = "ambience" | "music" | "ui";
export type VolumeKey = "master" | BusName;

const VOL_PREFIX = "daro-vol-";

/** Дефолты микшера (0..1). */
export const VOL_DEFAULTS: Record<VolumeKey, number> = {
  master: 0.8,
  ambience: 1,
  music: 0.8,
  ui: 1,
};

/** Безопасное чтение громкости (SSR и приватные режимы не падают). */
export function getVolume(key: VolumeKey): number {
  if (typeof window === "undefined") return VOL_DEFAULTS[key];
  try {
    const raw = window.localStorage.getItem(VOL_PREFIX + key);
    const n = raw === null ? NaN : Number(raw);
    if (!Number.isFinite(n)) return VOL_DEFAULTS[key];
    return Math.min(1, Math.max(0, n));
  } catch {
    return VOL_DEFAULTS[key];
  }
}

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
const buses: Record<BusName, GainNode | null> = {
  ambience: null,
  music: null,
  ui: null,
};

function buildBuses(ac: AudioContext) {
  master = ac.createGain();
  master.gain.value = getVolume("master");
  master.connect(ac.destination);
  (Object.keys(buses) as BusName[]).forEach((name) => {
    const g = ac.createGain();
    g.gain.value = getVolume(name);
    g.connect(master as GainNode);
    buses[name] = g;
  });
}

/**
 * Вернуть общий контекст, создав при необходимости.
 * Вне браузера — null. Вызов из обработчика жеста гарантирует
 * resume; из прочих событий контекст может остаться suspended —
 * это допустимо (звук просто подождёт первого жеста).
 */
export function ensureAudioContext(): AudioContext | null {
  if (typeof window === "undefined" || !("AudioContext" in window)) return null;
  if (!ctx) {
    ctx = new AudioContext();
    buildBuses(ctx);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/**
 * Вход указанной шины для подключения источников. Не создаёт
 * контекст (в отличие от ensureAudioContext) — вызывать после того,
 * как контекст гарантированно получен. Фолбэк — выход напрямую.
 */
export function busInput(name: BusName, ac: AudioContext): AudioNode {
  return buses[name] ?? ac.destination;
}

/** Применить сохранённую громкость к живой шине (плавно, без щелчков). */
function applyToLive(key: VolumeKey, value: number) {
  const node = key === "master" ? master : buses[key as BusName];
  if (!node || !ctx) return;
  node.gain.setTargetAtTime(value, ctx.currentTime, 0.05);
}

/** Сохранить громкость и сразу применить к живому звуку. */
export function setVolume(key: VolumeKey, value: number): void {
  const v = Math.min(1, Math.max(0, value));
  try {
    window.localStorage.setItem(VOL_PREFIX + key, String(v));
  } catch {
    /* приватный режим — просто не запоминаем */
  }
  applyToLive(key, v);
}
