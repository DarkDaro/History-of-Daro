"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { etherEnabled, setEtherEnabled } from "@/lib/sfx";

/* ============================================================
   CyberAmbient — генеративный дарк-эмбиент на Web Audio API.
   Слои: шум дождя, низкий дрон, медленный пэд-аккорд,
   суб-пульс и случайные раскаты грома. Без внешних файлов.
   Состояние запоминается: при следующем визите эмбиент
   оживёт сам, на первом жесте пользователя (требование
   браузеров к автозапуску звука). Туда же привязаны SFX.
   ============================================================ */

const AUDIO_OK = typeof window !== "undefined" && "AudioContext" in window;

function createEngine(ctx: AudioContext) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.85, ctx.currentTime + 2.2);
  master.connect(ctx.destination);

  const stops: Array<() => void> = [];
  const timers: Array<ReturnType<typeof setTimeout>> = [];

  const osc = (
    type: OscillatorType,
    freq: number,
    dest: AudioNode,
    detune = 0
  ) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    o.detune.value = detune;
    o.connect(dest);
    o.start();
    stops.push(() => {
      try {
        o.stop();
      } catch {
        /* already stopped */
      }
    });
    return o;
  };

  const noiseBuffer = (seconds = 2) => {
    const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  };

  const lfo = (freq: number, min: number, max: number, param: AudioParam) => {
    const o = ctx.createOscillator();
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.value = (max - min) / 2;
    o.connect(g);
    g.connect(param);
    param.value = (max + min) / 2;
    o.start();
    stops.push(() => {
      try {
        o.stop();
      } catch {
        /* already stopped */
      }
    });
  };

  const noiseSource = (buf: AudioBuffer) => {
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.start();
    stops.push(() => {
      try {
        src.stop();
      } catch {
        /* already stopped */
      }
    });
    return src;
  };

  /* ---------- Слой 1: дождь ---------- */
  const rainFilter = ctx.createBiquadFilter();
  rainFilter.type = "lowpass";
  rainFilter.frequency.value = 1500;
  rainFilter.Q.value = 0.6;
  const rainGain = ctx.createGain();
  rainGain.gain.value = 0.13;
  rainFilter.connect(rainGain).connect(master);
  noiseSource(noiseBuffer(2.1)).connect(rainFilter);
  lfo(0.06, 0.1, 0.17, rainGain.gain);

  const hiss = ctx.createBiquadFilter();
  hiss.type = "bandpass";
  hiss.frequency.value = 4200;
  hiss.Q.value = 0.9;
  const hissGain = ctx.createGain();
  hissGain.gain.value = 0.018;
  hiss.connect(hissGain).connect(master);
  noiseSource(noiseBuffer(1.7)).connect(hiss);
  lfo(0.11, 0.008, 0.028, hissGain.gain);

  /* ---------- Слой 2: дрон ---------- */
  const droneFilter = ctx.createBiquadFilter();
  droneFilter.type = "lowpass";
  droneFilter.frequency.value = 240;
  droneFilter.Q.value = 1.1;
  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.11;
  droneFilter.connect(droneGain).connect(master);
  osc("sine", 55, droneFilter);
  osc("sine", 55, droneFilter, 9);
  osc("sawtooth", 110, droneFilter, -6);
  lfo(0.03, 150, 330, droneFilter.frequency);

  /* ---------- Слой 3: медленный пэд-аккорд (A2 · E3 · A3 · C4) ---------- */
  const padFilter = ctx.createBiquadFilter();
  padFilter.type = "lowpass";
  padFilter.frequency.value = 750;
  const padGain = ctx.createGain();
  padGain.gain.value = 0.05;
  padFilter.connect(padGain).connect(master);
  [110, 164.81, 220, 261.63].forEach((f, i) => {
    const g = ctx.createGain();
    g.gain.value = 0.35;
    g.connect(padFilter);
    osc("triangle", f, g, i * 4 - 6);
    lfo(0.017 + i * 0.009, 0.12, 0.55, g.gain);
  });

  /* ---------- Слой 4: суб-пульс (сердцебиение города) ---------- */
  const subGain = ctx.createGain();
  subGain.gain.value = 0.05;
  subGain.connect(master);
  osc("sine", 27.5, subGain);
  lfo(0.24, 0.012, 0.06, subGain.gain);

  /* ---------- Слой 5: гром ---------- */
  const thunder = () => {
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(3.5);
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(700, t);
    f.frequency.exponentialRampToValueAtTime(70, t + 2.6);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.2, t + 0.25);
    g.gain.exponentialRampToValueAtTime(0.015, t + 2.2);
    g.gain.linearRampToValueAtTime(0, t + 3.2);
    src.connect(f).connect(g).connect(master);
    src.start(t);
    src.stop(t + 3.4);
    const next = setTimeout(thunder, 16000 + Math.random() * 22000);
    timers.push(next);
  };
  timers.push(setTimeout(thunder, 7000 + Math.random() * 9000));

  return {
    master,
    cleanup() {
      timers.forEach(clearTimeout);
      stops.forEach((s) => s());
    },
  };
}

export function CyberAmbientButton() {
  const [playing, setPlaying] = useState(false);
  const [armed, setArmed] = useState(false); // pref «on», ждём первый жест
  const [supported, setSupported] = useState(true);
  const engineRef = useRef<{
    ctx: AudioContext;
    master: GainNode;
    cleanup: () => void;
  } | null>(null);

  // Предпочтение «Эфира» живёт в localStorage и известно только браузеру,
  // поэтому читаем его строго ПОСЛЕ гидратации. Чтение во время первого
  // рендера рвёт SSR-совпадение (сервер рисует VolumeX, клиент с «on» —
  // Volume2) и даёт hydration-ошибку. RAF-обёртка — устоявшийся в этом
  // файле приём: откладывает setState за пределы синхронного эффекта.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (etherEnabled()) setArmed(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setSupported(AUDIO_OK));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Восстановление включённого «Эфира» с прошлого визита: браузеры
  // запрещают автозапуск звука, поэтому стартуем на первом жесте.
  useEffect(() => {
    if (!armed) return;
    const startOnGesture = () => {
      if (engineRef.current) return;
      const ac = new AudioContext();
      const engine = createEngine(ac);
      engineRef.current = { ctx: ac, ...engine };
      void ac.resume();
      setPlaying(true);
      setArmed(false);
    };
    window.addEventListener("pointerdown", startOnGesture, { once: true });
    window.addEventListener("keydown", startOnGesture, { once: true });
    return () => {
      window.removeEventListener("pointerdown", startOnGesture);
      window.removeEventListener("keydown", startOnGesture);
    };
  }, [armed]);

  useEffect(
    () => () => {
      engineRef.current?.ctx.close().catch(() => undefined);
      engineRef.current = null;
    },
    []
  );

  const stop = useCallback(() => {
    const e = engineRef.current;
    if (!e) return;
    engineRef.current = null;
    const { ctx, master, cleanup } = e;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.7);
    setTimeout(() => {
      cleanup();
      ctx.close().catch(() => undefined);
    }, 800);
  }, []);

  const toggle = useCallback(() => {
    if (engineRef.current) {
      stop();
      setPlaying(false);
      setEtherEnabled(false);
      return;
    }
    const ctx = new AudioContext();
    const engine = createEngine(ctx);
    engineRef.current = { ctx, ...engine };
    ctx.resume().catch(() => undefined);
    setPlaying(true);
    setArmed(false);
    setEtherEnabled(true);
  }, [stop]);

  const label = playing
    ? "Эфир"
    : armed
      ? "Эфир…"
      : "Эфир OFF";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!supported}
      data-playing={playing}
      aria-pressed={playing}
      aria-label={
        playing
          ? "Выключить атмосферный звук"
          : "Включить атмосферный звук Даро"
      }
      title={
        playing
          ? "Атмосферный звук: ВКЛ (дождь · дрон · гром · звуки интерфейса)"
          : armed
            ? "«Эфир» включён — оживёт при первом клике на странице"
            : "Атмосферный звук: ВЫКЛ — включить дарк-эмбиент и звуки интерфейса"
      }
      className={`group inline-flex h-9 items-center gap-2 px-3 font-mono-cyber text-[10px] uppercase tracking-[0.2em] transition-colors ${
        playing
          ? "neon-border-cyan text-[var(--neon-cyan)]"
          : "border border-white/15 text-white/50 hover:text-white/80"
      } disabled:opacity-40`}
    >
      {playing || armed ? (
        <>
          <Volume2 className="h-4 w-4" aria-hidden />
          <span className="eq-bars hidden sm:inline-flex" aria-hidden>
            <i /><i /><i /><i />
          </span>
          <span className="hidden sm:inline">{label}</span>
        </>
      ) : (
        <>
          <VolumeX className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Эфир OFF</span>
        </>
      )}
    </button>
  );
}
