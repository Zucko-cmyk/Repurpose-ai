"use client";

import { useState } from "react";
import { AtSign, Building2, Video, Clock, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { TwitterCard, LinkedInCard, TikTokCard, WhatsAppCard } from "./OutputCard";
import type { Generation } from "@/types";

export default function GenerationCard({ gen }: { gen: Generation }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full p-5 text-left hover:bg-white/5 transition-colors"
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <p className="line-clamp-2 text-sm text-zinc-300">{gen.source_text}</p>
          <div className="flex flex-shrink-0 items-center gap-2 text-xs text-zinc-600">
            <Clock className="h-3.5 w-3.5" />
            {new Date(gen.created_at).toLocaleDateString("pl-PL", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
            {open ? (
              <ChevronUp className="h-4 w-4 text-zinc-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-zinc-500" />
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {gen.twitter_thread && (
            <span className="flex items-center gap-1 rounded-full bg-sky-500/10 px-2.5 py-1 text-xs text-sky-400">
              <AtSign className="h-3 w-3" />
              {gen.twitter_thread.length} tweetów
            </span>
          )}
          {gen.linkedin_post && (
            <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs text-blue-400">
              <Building2 className="h-3 w-3" />
              LinkedIn
            </span>
          )}
          {gen.tiktok_script && (
            <span className="flex items-center gap-1 rounded-full bg-pink-500/10 px-2.5 py-1 text-xs text-pink-400">
              <Video className="h-3 w-3" />
              {gen.tiktok_script.length} scen
            </span>
          )}
          {gen.whatsapp_message && (
            <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-xs text-green-400">
              <MessageCircle className="h-3 w-3" />
              WhatsApp
            </span>
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-white/10 p-5 space-y-4">
          {gen.twitter_thread && <TwitterCard tweets={gen.twitter_thread} />}
          {gen.linkedin_post && <LinkedInCard post={gen.linkedin_post} />}
          {gen.tiktok_script && <TikTokCard scenes={gen.tiktok_script} />}
          {gen.whatsapp_message && <WhatsAppCard message={gen.whatsapp_message} />}
        </div>
      )}
    </div>
  );
}
