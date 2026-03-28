"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, AtSign, Building2, Video, ExternalLink, MessageCircle } from "lucide-react";
import type { TwitterTweet, TikTokScene } from "@/types";

interface TwitterCardProps {
  tweets: TwitterTweet[];
}

interface LinkedInCardProps {
  post: string;
}

interface TikTokCardProps {
  scenes: TikTokScene[];
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
    >
      {copied ? (
        <><Check className="h-3.5 w-3.5 text-emerald-400" /><span className="text-emerald-400">Skopiowano!</span></>
      ) : (
        <><Copy className="h-3.5 w-3.5" /><span>Kopiuj</span></>
      )}
    </button>
  );
}

export function TwitterCard({ tweets }: TwitterCardProps) {
  const fullThread = tweets.map((t) => t.content).join("\n\n---\n\n");
  const firstTweet = tweets[0]?.content ?? "";

  function handlePublishX() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(firstTweet)}`;
    window.open(url, "_blank");
  }

  function handleWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(fullThread)}`;
    window.open(url, "_blank");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
            <AtSign className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">Wątek na X (Twitter)</p>
            <p className="text-xs text-zinc-500">{tweets.length} tweetów</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={fullThread} />
          <button
            onClick={handlePublishX}
            className="flex items-center gap-1.5 rounded-lg bg-black border border-white/20 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Opublikuj na X</span>
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1ebe5d] transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {tweets.map((tweet) => (
          <div key={tweet.order} className="flex gap-3 px-5 py-4">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-400">
              {tweet.order}
            </div>
            <div className="flex-1">
              <p className="text-sm leading-relaxed text-zinc-200">{tweet.content}</p>
              <p className="mt-1.5 text-xs text-zinc-600">{tweet.content.length}/280</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function LinkedInCard({ post }: LinkedInCardProps) {
  const [copied, setCopied] = useState(false);

  async function handlePublishLinkedIn() {
    await navigator.clipboard.writeText(post);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    window.open("https://www.linkedin.com/feed/", "_blank");
  }

  function handleWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(post)}`;
    window.open(url, "_blank");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0077b5]">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">Post na LinkedIn</p>
            <p className="text-xs text-zinc-500">{post.length} znaków</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={post} />
          <button
            onClick={handlePublishLinkedIn}
            className="flex items-center gap-1.5 rounded-lg bg-[#0077b5] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#006097] transition-colors"
          >
            {copied ? (
              <><Check className="h-3.5 w-3.5" /><span>Skopiowano — wklej!</span></>
            ) : (
              <><ExternalLink className="h-3.5 w-3.5" /><span>LinkedIn</span></>
            )}
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1ebe5d] transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">{post}</p>
      </div>
    </motion.div>
  );
}

export function TikTokCard({ scenes }: TikTokCardProps) {
  const fullScript = scenes
    .map((s) => `[Scena ${s.scene} – ${s.duration}]\nLektor: ${s.voiceover}\nWizualia: ${s.visual}`)
    .join("\n\n");

  const [copied, setCopied] = useState(false);

  async function handlePublishTikTok() {
    await navigator.clipboard.writeText(fullScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    window.open("https://www.tiktok.com/creator-center/upload", "_blank");
  }

  function handleWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(fullScript)}`;
    window.open(url, "_blank");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-cyan-400">
            <Video className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">Skrypt TikTok / Reels</p>
            <p className="text-xs text-zinc-500">{scenes.length} scen</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={fullScript} />
          <button
            onClick={handlePublishTikTok}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-cyan-400 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
          >
            {copied ? (
              <><Check className="h-3.5 w-3.5" /><span>Skopiowano!</span></>
            ) : (
              <><ExternalLink className="h-3.5 w-3.5" /><span>Otwórz TikTok</span></>
            )}
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1ebe5d] transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {scenes.map((scene) => (
          <div key={scene.scene} className="px-5 py-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-pink-500/20 px-2 py-0.5 text-xs font-bold text-pink-400">
                Scena {scene.scene}
              </span>
              <span className="text-xs text-zinc-500">{scene.duration}</span>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Lektor</p>
                <p className="mt-0.5 text-sm leading-relaxed text-zinc-200">{scene.voiceover}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Wizualia</p>
                <p className="mt-0.5 text-sm italic leading-relaxed text-zinc-400">{scene.visual}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
