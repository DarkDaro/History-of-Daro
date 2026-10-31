"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sfx } from "@/lib/sfx";

/* ============================================================
   Форма подписки (toast «Сигнал принят»).
   ============================================================ */

export function SubscribeForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email.includes("@")) {
      sfx("deny");
      toast({
        variant: "destructive",
        title: "Проверьте адрес",
        description: "Похоже, в адресе опечатка.",
      });
      return;
    }
    sfx("confirm");
    toast({
      title: "Сигнал принят",
      description: "Вы в списке. «Периметр Зеро» выйдет на связь.",
    });
    setEmail("");
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 text-left">
          <span aria-hidden className="font-mono-cyber absolute left-4 top-1/2 -translate-y-1/2 neon-cyan text-sm">
            {">"}
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ваш@email.ru"
            aria-label="Email для подписки"
            className="neon-border-cyan font-mono-cyber w-full bg-black/60 py-4 pl-9 pr-5 text-sm text-white outline-none transition-shadow placeholder:text-white/30 focus:shadow-[0_0_24px_rgba(0,240,255,0.35)]"
          />
        </div>
        <button
          type="button"
          onClick={handleSubscribe}
          className="btn-beam inline-flex items-center justify-center gap-2 bg-[var(--neon-cyan)] px-8 py-4 font-mono-cyber text-sm font-bold uppercase tracking-widest text-black shadow-[0_0_28px_rgba(0,240,255,0.4)] transition-shadow hover:shadow-[0_0_44px_var(--neon-cyan)]"
        >
          <Send className="h-4 w-4" aria-hidden />
          Подписаться
        </button>
      </div>
      <p className="font-mono-cyber mt-5 text-[10px] uppercase tracking-[0.25em] text-white/40">
        Анонсы томов и фрагменты глав · раз-два в месяц · отписка в один клик
      </p>
    </div>
  );
}
