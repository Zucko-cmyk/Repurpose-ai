"use client";

import { useState } from "react";
import { AtSign, Building2, Video, Clock, ChevronDown, ChevronUp, MessageCircle, Share2, Trash2 } from "lucide-react";
import { TwitterCard, LinkedInCard, TikTokCard, WhatsAppCard, FacebookCard } from "./OutputCard";
import type { Generation } from "@/types";

export default function GenerationCard({ gen }: { gen: Generation }) {
  const [open, setOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    const confirmed = window.confirm("Czy na pewno chcesz usunąć to generowanie? Tej operacji nie można cofnąć.");
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/generations/${gen.id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleted(true);
      } else {
        alert("Nie udało się usunąć generowania. Spróbuj ponownie.");
      }
    } catch {
      alert("Błąd sieci. Spróbuj ponownie.");
    } finally {
      setDeleting(false);
    }
  }

  if (deleted) return null;

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
            <button
              onClick={handleDelete}
              disabled={deleting}
              title="Usuń generowanie"
              className="ml-1 rounded-lg p-1 text-red-500/60 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            {open ? (
              <ChevronUp className="h-4 w-4 text-zinc-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-zinc-500" />
            )}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
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
          {gen.facebook_post && (
            <span className="flex items-center gap-1 rounded-full bg-blue-600/10 px-2.5 py-1 text-xs text-blue-400">
              <Share2 className="h-3 w-3" />
              Facebook
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
          {gen.facebook_post && <FacebookCard post={gen.facebook_post} />}
        </div>
      )}
    </div>
  );
}
