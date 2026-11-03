"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sfx } from "@/lib/sfx";

/* ============================================================
   «Копировать ссылку»: клипборд + терминальное подтверждение
   («Сигнал скопирован»). Широкая кнопка — в читалке фрагментов,
   compact (иконка) — в шапке панели досье.
   ============================================================ */

export function CopyLinkButton({
  label = "Копировать ссылку",
  className = "",
  compact = false,
}: {
  label?: string;
  className?: string;
  compact?: boolean;
}) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      sfx("confirm");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Сигнал скопирован",
        description: "Ссылка передана в буфер обмена.",
      });
    } catch {
      sfx("deny");
      toast({
        variant: "destructive",
        title: "Передача сорвана",
        description: "Браузер не дал доступ к буферу обмена.",
      });
    }
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={copy}
        aria-label={label}
        title={label}
        className={`border border-white/15 p-2 text-white/60 transition-colors hover:border-white/40 hover:text-white ${className}`}
      >
        {copied ? (
          <Check className="h-4 w-4 text-[var(--neon-cyan)]" aria-hidden />
        ) : (
          <Link2 className="h-4 w-4" aria-hidden />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`group flex w-full items-center justify-between gap-3 border border-white/10 bg-black/40 px-4 py-3 font-mono-cyber text-[10px] uppercase tracking-[0.25em] text-white/60 transition-colors hover:border-[var(--neon-cyan)]/50 hover:text-[var(--neon-cyan)] ${className}`}
    >
      <span className="flex items-center gap-2">
        {copied ? (
          <Check className="h-3.5 w-3.5 text-[var(--neon-cyan)]" aria-hidden />
        ) : (
          <Link2 className="h-3.5 w-3.5" aria-hidden />
        )}
        {copied ? "Скопировано" : label}
      </span>
      <span className="text-white/30 transition-colors group-hover:text-[var(--neon-cyan)]/60" aria-hidden>
        {"//"}
      </span>
    </button>
  );
}
