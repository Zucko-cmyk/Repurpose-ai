"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, AlertCircle, LogIn, Globe, Link as LinkIcon, FileText, Printer } from "lucide-react";
import { TwitterCard, LinkedInCard, TikTokCard, WhatsAppCard, FacebookCard } from "./OutputCard";
import PricingButton from "./PricingButton";
import { createClient } from "@/lib/supabase";
import type { RepurposeResult } from "@/types";

function buildPrintHTML(result: RepurposeResult): string {
  const tweetRows = result.twitterThread
    .map(
      (t) => `<div style="border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;margin-bottom:10px;">
        <span style="font-weight:600;color:#6d28d9;">${t.order}.</span>
        <p style="margin:6px 0 0 0;">${t.content.replace(/\n/g, "<br>")}</p>
        <small style="color:#9ca3af;">${t.content.length}/280</small>
      </div>`
    )
    .join("");

  const sceneRows = result.tiktokScript
    .map(
      (s) => `<div style="border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;margin-bottom:10px;">
        <strong>Scena ${s.scene}</strong> <span style="color:#9ca3af;">${s.duration}</span>
        <p style="margin:6px 0 0 0;"><strong>Lektor:</strong> ${s.voiceover.replace(/\n/g, "<br>")}</p>
        <p style="margin:4px 0 0 0;color:#6b7280;"><em>Wizualia: ${s.visual.replace(/\n/g, "<br>")}</em></p>
      </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <title>RepurposeAI – Eksport wyników</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 32px 24px; color: #111; }
    h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 24px; }
    h2 { font-size: 1.1rem; font-weight: 600; margin: 28px 0 12px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; }
    p { line-height: 1.6; }
    .section { margin-bottom: 32px; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <h1>RepurposeAI – Wyniki generowania</h1>

  <div class="section">
    <h2>Wątek na X (Twitter)</h2>
    ${tweetRows}
  </div>

  <div class="section">
    <h2>Post na LinkedIn</h2>
    <p>${result.linkedinPost.replace(/\n/g, "<br>")}</p>
  </div>

  <div class="section">
    <h2>Skrypt TikTok / Reels</h2>
    ${sceneRows}
  </div>

  <div class="section">
    <h2>Wiadomość WhatsApp</h2>
    <p>${result.whatsappMessage.replace(/\n/g, "<br>")}</p>
  </div>

  <div class="section">
    <h2>Post na Facebooku</h2>
    <p>${result.facebookPost.replace(/\n/g, "<br>")}</p>
  </div>
</body>
</html>`;
}

export default function Generator() {
  const [inputMode, setInputMode] = useState<"text" | "url">("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [language, setLanguage] = useState("pl");
  const [tone, setTone] = useState("standard");
  const [result, setResult] = useState<RepurposeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsCredits, setNeedsCredits] = useState(false);
  const [needsLogin, setNeedsLogin] = useState(false);

  const languages = [
    { code: "pl", label: "🇵🇱 Polski" },
    { code: "en", label: "🇬🇧 English" },
    { code: "de", label: "🇩🇪 Deutsch" },
    { code: "fr", label: "🇫🇷 Français" },
    { code: "es", label: "🇪🇸 Español" },
    { code: "it", label: "🇮🇹 Italiano" },
    { code: "uk", label: "🇺🇦 Українська" },
  ];

  const tones = [
    { code: "standard",      label: "✍️ Standardowy" },
    { code: "kontrowersja",  label: "🔥 Kontrowersja" },
    { code: "ranking",       label: "🏆 Ranking / Top lista" },
    { code: "drama",         label: "🎭 Drama / Historia" },
    { code: "dyskusja",      label: "💬 Dyskusja / Debata" },
    { code: "inspiracja",    label: "💡 Inspiracja" },
    { code: "edukacja",      label: "📚 Edukacja / Poradnik" },
    { code: "humor",         label: "😄 Humor / Satyra" },
  ];

  const supabase = createClient();

  function isValidUrl(value: string): boolean {
    try {
      const u = new URL(value);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }

  const canGenerate = inputMode === "text"
    ? text.trim().length >= 50 && text.length <= 5000
    : url.trim().length > 0 && isValidUrl(url.trim());

  async function handleGenerate() {
    if (inputMode === "text") {
      if (text.trim().length < 50) {
        setError("Wprowadź co najmniej 50 znaków tekstu.");
        return;
      }
      if (text.length > 5000) {
        setError("Tekst może mieć maksymalnie 5000 znaków.");
        return;
      }
    } else {
      if (!isValidUrl(url.trim())) {
        setError("Wprowadź poprawny adres URL (np. https://example.com/artykul).");
        return;
      }
    }

    setLoading(true);
    setError(null);
    setNeedsCredits(false);
    setNeedsLogin(false);
    setResult(null);

    try {
      const body = inputMode === "text"
        ? { text, language, tone }
        : { url: url.trim(), language, tone };

      const res = await fetch("/api/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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

  function handleExportPDF() {
    if (!result) return;
    const html = buildPrintHTML(result);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  }

  return (
    <div className="space-y-6">
      {/* Input mode toggle */}
      <div className="flex rounded-xl border border-white/10 bg-zinc-900 p-1 w-fit">
        <button
          onClick={() => setInputMode("text")}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            inputMode === "text"
              ? "bg-violet-600 text-white"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          Tekst
        </button>
        <button
          onClick={() => setInputMode("url")}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            inputMode === "url"
              ? "bg-violet-600 text-white"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <LinkIcon className="h-3.5 w-3.5" />
          URL
        </button>
      </div>

      {/* Tone selector */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-500">Styl treści</p>
        <div className="flex flex-wrap gap-2">
          {tones.map((t) => (
            <button
              key={t.code}
              onClick={() => setTone(t.code)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                tone === t.code
                  ? "border-violet-500 bg-violet-500/20 text-violet-300"
                  : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900 p-1">
        {inputMode === "text" ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Wklej tutaj swój artykuł, notkę lub przemyślenie (min. 50 znaków)…"
            rows={8}
            maxLength={5000}
            className="w-full resize-none rounded-xl bg-transparent px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none"
          />
        ) : (
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <LinkIcon className="h-4 w-4 text-zinc-500 flex-shrink-0" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/artykul"
                className="w-full bg-transparent text-sm text-zinc-200 placeholder-zinc-600 outline-none"
              />
            </div>
            <p className="text-xs text-zinc-600 mt-2">
              Podaj URL artykułu lub strony. Zawartość zostanie pobrana i przetworzona przez AI.
            </p>
          </div>
        )}
        <div className="flex items-center justify-between px-4 pb-3">
          <div className="flex items-center gap-3">
            {inputMode === "text" && (
              <span className={`text-xs ${text.length > 4800 ? "text-amber-400" : "text-zinc-400"}`}>
                {text.length}/5000 znaków
              </span>
            )}
            <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-800 px-2 py-1">
              <Globe className="h-3.5 w-3.5 text-zinc-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs text-zinc-300 outline-none cursor-pointer"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-zinc-800">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !canGenerate}
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
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              Eksportuj PDF
            </button>
          </div>

          <TwitterCard tweets={result.twitterThread} />
          <LinkedInCard post={result.linkedinPost} />
          <TikTokCard scenes={result.tiktokScript} />
          <WhatsAppCard message={result.whatsappMessage} />
          <FacebookCard post={result.facebookPost} />
        </div>
      )}
    </div>
  );
}
