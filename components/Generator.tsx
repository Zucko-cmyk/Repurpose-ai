"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, AlertCircle, LogIn } from "lucide-react";
import { TwitterCard, LinkedInCard, TikTokCard } from "./OutputCard";
import PricingButton from "./PricingButton";
import { createClient } from "@/lib/supabase";
import type { RepurposeResult } from "@/types";

export default function Generator() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<RepurposeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsCredits, setNeedsCredits] = useState(false);
  const [needsLogin, setNeedsLogin] = useState(false);

  const supabase = createClient();

  async function handleGenerate() {
    if (text.trim().length < 20) {
      setError("Wprowadź co najmniej 20 znaków tekstu.");
      return;
    }

    setLoading(true);
    setError(null);
    setNeedsCredits(false);
    setNeedsLogin(false);
    setResult(null);

    try {
      const res = await fetch("/api/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (res.status === 401) {
        setNeedsLogin(true);
        return;
      }

      if (res.status === 402) {
        setNeedsCredits(true);
        return;
      }

      if (!res.ok) {
        setError(data.error ?? "Wystąpił nieznany błąd.");
        return;
      }

      setResult(data.result);
    } catch {
      setError("Błąd sieci. Sprawdź połączenie i spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  }

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  }

  return (
    <div className="space-y-6">
      {/* Input area */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900 p-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Wklej tutaj swój artykuł, notkę, przemyślenie lub link do treści (min. 50 znaków)…"
          rows={8}
          className="w-full resize-none rounded-xl bg-transparent px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none"
        />
        <div className="flex items-center justify-between px-4 pb-3">
          <span className="text-xs text-zinc-400">{text.length} znaków</span>
          <button
            onClick={handleGenerate}
            disabled={loading || text.trim().length < 20}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generuję…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Repurpose
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error state */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </motion.div>
        )}

        {needsLogin && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-6 text-center"
          >
            <p className="mb-3 text-zinc-200">
              Zaloguj się, aby korzystać z generatora (3 generowania za darmo).
            </p>
            <button
              onClick={signIn}
              className="flex items-center gap-2 mx-auto rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Zaloguj przez Google
            </button>
          </motion.div>
        )}

        {needsCredits && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6 text-center"
          >
            <p className="mb-1 font-semibold text-amber-300">Brak kredytów</p>
            <p className="mb-4 text-sm text-zinc-400">
              Skończyły się Twoje darmowe generowania. Kup pakiet, żeby kontynuować.
            </p>
            <div className="flex justify-center">
              <PricingButton />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
              Wyniki
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <TwitterCard tweets={result.twitterThread} />
          <LinkedInCard post={result.linkedinPost} />
          <TikTokCard scenes={result.tiktokScript} />
        </div>
      )}
    </div>
  );
}
