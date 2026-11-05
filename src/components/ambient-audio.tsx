"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SlidersHorizontal, Volume2, VolumeX, X } from "lucide-react";
import {
  busInput,
  ensureAudioContext,
  getVolume,
  setVolume,
  VOL_DEFAULTS,
  type VolumeKey,
} from "@/lib/audio-engine";
import { createMusicLayer, themeForPathname } from "@/lib/audio-themes";
import { etherEnabled, setEtherEnabled } from "@/lib/sfx";

/* ============================================================
   CyberAmbient — генеративный дарк-эмбиент на Web Audio API.
   Слои: дождь (розовый шум + капли + желоба, A3), низкий дрон,
   медленный пэд-аккорд, суб-пульс и случайные раскаты грома;
   плюс музыкальная тема страницы (A4, audio-themes.ts) на шине
   «music» с кроссфейдом при переходах.
   Без внешних файлов. Вывод — в шины аудио-ядра (A1).
   Состояние запоминается: при следующем визите эмбиент
   оживёт сам, на первом жесте пользователя (требование
   браузеров к автозапуску звука). Туда же привязаны SFX.
   ============================================================ */

const AUDIO_OK = typeof window !== "undefined" && "AudioContext" in window;

function createEngine(ctx: AudioContext, initialPath: string) {
  // С A1: внутренний «master» — это фейд-гейнер слоя эмбиента,
  // он подключается к шине «ambience» общего ядра (микшер).
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.85, ctx.currentTime + 2.2);
  master.connect(busInput("ambience", ctx));

  const stops: Array<() => void> = [];
  const timers: Array<ReturnType<typeof setTimeout>> = [];
  let dead = false; // флаг остановки для планировщиков (капли не живут после cleanup)

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

  /* Розовый шум (фильтр Пола Келлета): энергия падает с частотой —
     база дождя звучит «водой», а не шипением белого шума (A3).
     Стерео-каналы генерируются независимо — широкая база. */
  const pinkNoiseBuffer = (seconds = 4) => {
    const len = Math.ceil(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    }
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

  /* ---------- Слой 1: дождь (A3: розовый шум + капли + желоба) ---------- */
  const rainFilter = ctx.createBiquadFilter();
  rainFilter.type = "lowpass";
  rainFilter.frequency.value = 1000;
  rainFilter.Q.value = 0.4;
  const rainGain = ctx.createGain();
  rainGain.gain.value = 0.17;
  rainFilter.connect(rainGain).connect(master);
  noiseSource(pinkNoiseBuffer(4.3)).connect(rainFilter);
  lfo(0.05, 0.12, 0.21, rainGain.gain);

  const hiss = ctx.createBiquadFilter();
  hiss.type = "bandpass";
  hiss.frequency.value = 4200;
  hiss.Q.value = 0.9;
  const hissGain = ctx.createGain();
  hissGain.gain.value = 0.015;
  hiss.connect(hissGain).connect(master);
  noiseSource(noiseBuffer(1.7)).connect(hiss);
  lfo(0.11, 0.007, 0.024, hissGain.gain);

  /* Капли по металлу и брезенту: короткие всплески через bandpass,
     случайная плотность 7–18 в секунду, случайный стерео-разлёт. */
  const panner = () => {
    if (!ctx.createStereoPanner) return null;
    const p = ctx.createStereoPanner();
    p.pan.value = Math.random() * 1.5 - 0.75;
    p.connect(master);
    stops.push(() => {
      try {
        p.disconnect();
      } catch {
        /* already disconnected */
      }
    });
    return p;
  };

  const droplet = () => {
    if (dead) return;
    const t = ctx.currentTime;
    const dur = 0.02 + Math.random() * 0.04;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(Math.max(0.06, dur + 0.02));
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 1200 + Math.random() * 3000;
    f.Q.value = 2 + Math.random() * 5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.008 + Math.random() * 0.028, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const p = panner();
    src.connect(f).connect(g).connect(p ?? master);
    src.start(t);
    src.stop(t + dur + 0.05);
    const next = setTimeout(droplet, 55 + Math.random() * 85);
    timers.push(next);
  };
  timers.push(setTimeout(droplet, 900 + Math.random() * 800));

  /* Желоб: редкая одиночная капля с нисходящим пингом (раз в 9–20 с). */
  const gutterDrop = () => {
    if (dead) return;
    const t = ctx.currentTime;
    const dur = 0.22 + Math.random() * 0.18;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(dur + 0.1);
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    const f0 = 620 + Math.random() * 320;
    f.frequency.setValueAtTime(f0, t);
    f.frequency.exponentialRampToValueAtTime(f0 * 0.55, t + dur);
    f.Q.value = 8 + Math.random() * 3;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.05, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const p = panner();
    src.connect(f).connect(g).connect(p ?? master);
    src.start(t);
    src.stop(t + dur + 0.1);
    const next = setTimeout(gutterDrop, 9000 + Math.random() * 11000);
    timers.push(next);
  };
  timers.push(setTimeout(gutterDrop, 5000 + Math.random() * 6000));

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

  /* ---------- Слой тем страниц (A4): шина «music» ---------- */
  const music = createMusicLayer(ctx);
  music.setTheme(themeForPathname(initialPath));

  return {
    master,
    music,
    cleanup() {
      dead = true;
      timers.forEach(clearTimeout);
      stops.forEach((s) => s());
      music.cleanup();
    },
  };
}

export function CyberAmbientButton() {
  const [playing, setPlaying] = useState(false);
  const [armed, setArmed] = useState(false); // pref «on», ждём первый жест
  const [supported, setSupported] = useState(true);
  const pathname = usePathname();
  const engineRef = useRef<{
    ctx: AudioContext;
    master: GainNode;
    music: { setTheme: (id: ReturnType<typeof themeForPathname>) => void };
    cleanup: () => void;
  } | null>(null);

  // A4: смена страницы — переключение музыкальной темы (кроссфейд).
  useEffect(() => {
    engineRef.current?.music.setTheme(themeForPathname(pathname));
  }, [pathname]);

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
      const ac = ensureAudioContext();
      if (!ac) return;
      const engine = createEngine(ac, window.location.pathname);
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
      // С A1 контекст общий (ядро) — НЕ закрываем его при размонтировании,
      // только останавливаем источники эмбиента.
      engineRef.current?.cleanup();
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
    // С A1 контекст общий — не закрываем: он обслуживает шины и SFX.
    setTimeout(cleanup, 800);
  }, []);

  const toggle = useCallback(() => {
    if (engineRef.current) {
      stop();
      setPlaying(false);
      setEtherEnabled(false);
      return;
    }
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const engine = createEngine(ctx, window.location.pathname);
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

  // --- Микшер громкости (A2): ползунки шин ядра ---
  const [mixerOpen, setMixerOpen] = useState(false);
  const [vols, setVols] = useState<Record<VolumeKey, number>>(VOL_DEFAULTS);
  const mixerRef = useRef<HTMLDivElement | null>(null);

  const openMixer = () => {
    // Чтение localStorage — только по клику (после гидратации), SSR не страдает.
    setVols({
      master: getVolume("master"),
      ambience: getVolume("ambience"),
      music: getVolume("music"),
      ui: getVolume("ui"),
    });
    setMixerOpen(true);
  };

  useEffect(() => {
    if (!mixerOpen) return;
    const onDown = (e: PointerEvent) => {
      if (mixerRef.current && !mixerRef.current.contains(e.target as Node)) {
        setMixerOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMixerOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [mixerOpen]);

  const changeVol = (key: VolumeKey, raw: string) => {
    const v = Number(raw) / 100;
    setVolume(key, v);
    setVols((prev) => ({ ...prev, [key]: v }));
  };

  return (
    <div className="relative" ref={mixerRef}>
      <div className="inline-flex items-stretch">
        <button
          type="button"
          onClick={toggle}
          disabled={!supported}
          data-playing={playing}
          aria-pressed={playing}
          aria-label={
            playing
              ? "Эфир — выключить атмосферный звук"
              : armed
                ? "Эфир… — звук оживёт при первом клике на странице"
                : "Эфир OFF — включить атмосферный звук"
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
              <span className="eq-bars hidden xl:inline-flex" aria-hidden>
                <i /><i /><i /><i />
              </span>
              {/* подпись — только на xl+: на lg экономим место шапки */}
              <span className="hidden xl:inline">{label}</span>
            </>
          ) : (
            <>
              <VolumeX className="h-4 w-4" aria-hidden />
              <span className="hidden xl:inline">Эфир OFF</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => (mixerOpen ? setMixerOpen(false) : openMixer())}
          disabled={!supported}
          aria-expanded={mixerOpen}
          aria-label="Открыть микшер громкости «Эфира»"
          title="Микшер: общая громкость и баланс слоёв"
          className={`inline-flex h-9 w-9 items-center justify-center border border-l-0 font-mono-cyber transition-colors ${
            mixerOpen
              ? "neon-border-cyan border-l-0 text-[var(--neon-cyan)]"
              : "border-white/15 text-white/50 hover:text-white/80"
          } disabled:opacity-40`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>

      {mixerOpen && (
        <div
          role="group"
          aria-label="Микшер громкости"
          className="absolute right-0 top-full z-50 mt-2 w-64 border border-[rgba(0,240,255,0.35)] bg-black/95 p-4 shadow-[0_0_30px_rgba(0,240,255,0.15)] backdrop-blur-sm"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="neon-cyan font-mono-cyber text-[10px] uppercase tracking-[0.25em]">
              Микшер эфира
            </span>
            <button
              type="button"
              onClick={() => setMixerOpen(false)}
              aria-label="Закрыть микшер"
              className="text-white/40 transition-colors hover:text-white/80"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
          {(
            [
              ["master", "Общая"],
              ["ambience", "Дождь и город"],
              ["music", "Темы страниц"],
              ["ui", "Интерфейс"],
            ] as Array<[VolumeKey, string]>
          ).map(([key, rowLabel]) => (
            <label key={key} className="mb-3 block last:mb-0">
              <span className="font-mono-cyber flex items-baseline justify-between text-[10px] uppercase tracking-[0.2em] text-white/60">
                {rowLabel}
                <span className="neon-cyan">{Math.round(vols[key] * 100)}%</span>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={Math.round(vols[key] * 100)}
                onChange={(e) => changeVol(key, e.target.value)}
                aria-label={`Громкость: ${rowLabel}`}
                className="daro-slider mt-1"
              />
            </label>
          ))}
          <p className="font-mono-cyber mt-3 text-[9px] uppercase tracking-[0.2em] text-white/30">
            Настройки запоминаются в браузере
          </p>
        </div>
      )}
    </div>
  );
}
