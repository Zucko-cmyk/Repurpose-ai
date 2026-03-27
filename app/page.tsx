import Generator from "@/components/Generator";
import PricingButton from "@/components/PricingButton";
import { Sparkles, AtSign, Building2, Video, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-20 text-center">
        <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
          <div className="h-[500px] w-[800px] -translate-y-1/3 rounded-full bg-violet-600/20 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by Claude AI
          </div>

          <h1 className="mb-4 text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
            Jeden tekst,{" "}
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              trzy platformy
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-lg text-zinc-400">
            Wklej artykuł lub przemyślenie. AI generuje wątek na X, post LinkedIn
            i skrypt TikTok – zachowując Twój styl i kluczowe insights.
          </p>

          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {[
              { icon: AtSign, label: "Wątek X (Twitter)", color: "text-sky-400" },
              { icon: Building2, label: "Post LinkedIn", color: "text-blue-400" },
              { icon: Video, label: "Skrypt TikTok/Reels", color: "text-pink-400" },
            ].map(({ icon: Icon, label, color }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm"
              >
                <Icon className={`h-4 w-4 ${color}`} />
                <span className="text-zinc-300">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Generator */}
      <section className="mx-auto max-w-3xl px-4 pb-16">
        <Generator />
      </section>

      {/* Pricing */}
      <section className="border-t border-white/10 bg-zinc-900/50 px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-2 text-2xl font-bold text-white">Prosto i tanio</h2>
          <p className="mb-8 text-zinc-400">
            Zacznij za darmo. Bez subskrypcji, bez zobowiązań.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6 text-left">
              <div className="mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-zinc-400" />
                <span className="font-semibold text-white">Darmowy start</span>
              </div>
              <p className="text-3xl font-bold text-white">0 zł</p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                <li>✓ 3 darmowe generowania</li>
                <li>✓ Wszystkie 3 formaty naraz</li>
                <li>✓ Historia w dashboardzie</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-violet-500/40 bg-gradient-to-br from-violet-950/60 to-purple-950/60 p-6 text-left">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-400" />
                <span className="font-semibold text-white">Pakiet kredytów</span>
              </div>
              <p className="text-3xl font-bold text-white">
                5 zł
                <span className="text-base font-normal text-zinc-400"> / 50 generowań</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                <li>✓ 50 kredytów (generowań)</li>
                <li>✓ Jednorazowa płatność</li>
                <li>✓ BLIK, karta, Przelewy24</li>
              </ul>
              <div className="mt-5">
                <PricingButton />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
