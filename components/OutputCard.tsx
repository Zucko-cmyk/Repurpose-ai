"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, AtSign, Building2, Video, ExternalLink, MessageCircle, ChevronDown, ChevronUp, Share2, Pencil, X } from "lucide-react";
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

interface WhatsAppCardProps {
  message: string;
}

interface FacebookCardProps {
  post: string;
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
      onClick={(e) => { e.stopPropagation(); handleCopy(); }}
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
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedTweets, setEditedTweets] = useState<TwitterTweet[]>(tweets);
  const [draftText, setDraftText] = useState("");

  const fullThread = editedTweets.map((t) => t.content).join("\n\n---\n\n");
  const firstTweet = editedTweets[0]?.content ?? "";

  function handlePublishX(e: React.MouseEvent) {
    e.stopPropagation();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(firstTweet)}`;
    window.open(url, "_blank");
  }

  function startEdit(e: React.MouseEvent, index: number) {
    e.stopPropagation();
    setEditingIndex(index);
    setDraftText(editedTweets[index].content);
  }

  function saveEdit(e: React.MouseEvent, index: number) {
    e.stopPropagation();
    const updated = editedTweets.map((t, i) =>
      i === index ? { ...t, content: draftText } : t
    );
    setEditedTweets(updated);
    setEditingIndex(null);
  }

  function cancelEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setEditingIndex(null);
    setDraftText("");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
            <AtSign className="h-4 w-4 text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-white text-sm">Wątek na X (Twitter)</p>
            <p className="text-xs text-zinc-500">{editedTweets.length} tweetów</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {open && (
            <>
              <CopyButton text={fullThread} />
              <button
                onClick={handlePublishX}
                className="flex items-center gap-1.5 rounded-lg bg-black border border-white/20 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Opublikuj na X</span>
              </button>
            </>
          )}
          {open ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 divide-y divide-white/5">
              {editedTweets.map((tweet, index) => (
                <div key={tweet.order} className="flex gap-3 px-5 py-4">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-400">
                    {tweet.order}
                  </div>
                  <div className="flex-1">
                    {editingIndex === index ? (
                      <div onClick={(e) => e.stopPropagation()}>
                        <textarea
                          value={draftText}
                          onChange={(e) => setDraftText(e.target.value)}
                          maxLength={280}
                          rows={3}
                          className="w-full resize-none rounded-lg bg-zinc-800 border border-violet-500/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-violet-500/70"
                        />
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-zinc-600">{draftText.length}/280</span>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => cancelEdit(e)}
                              className="flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-xs text-zinc-400 hover:text-white transition-colors"
                            >
                              <X className="h-3 w-3" />
                              Anuluj
                            </button>
                            <button
                              onClick={(e) => saveEdit(e, index)}
                              className="flex items-center gap-1 rounded-lg bg-violet-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-violet-500 transition-colors"
                            >
                              <Check className="h-3 w-3" />
                              Zapisz
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm leading-relaxed text-zinc-200">{tweet.content}</p>
                        <div className="mt-1.5 flex items-center justify-between">
                          <p className="text-xs text-zinc-600">{tweet.content.length}/280</p>
                          <button
                            onClick={(e) => startEdit(e, index)}
                            className="flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs text-zinc-500 hover:bg-white/10 hover:text-zinc-300 transition-colors"
                          >
                            <Pencil className="h-3 w-3" />
                            Edytuj
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function LinkedInCard({ post }: LinkedInCardProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedPost, setEditedPost] = useState(post);
  const [draftText, setDraftText] = useState(post);

  async function handlePublishLinkedIn(e: React.MouseEvent) {
    e.stopPropagation();
    await navigator.clipboard.writeText(editedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    window.open("https://www.linkedin.com/feed/", "_blank");
  }

  function startEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setDraftText(editedPost);
    setEditing(true);
  }

  function saveEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setEditedPost(draftText);
    setEditing(false);
  }

  function cancelEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setEditing(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0077b5]">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-white text-sm">Post na LinkedIn</p>
            <p className="text-xs text-zinc-500">{editedPost.length} znaków</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {open && (
            <>
              <CopyButton text={editedPost} />
              {!editing && (
                <button
                  onClick={startEdit}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span>Edytuj</span>
                </button>
              )}
              <button
                onClick={handlePublishLinkedIn}
                className="flex items-center gap-1.5 rounded-lg bg-[#0077b5] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#006097] transition-colors"
              >
                {copied ? (
                  <><Check className="h-3.5 w-3.5" /><span>Skopiowano!</span></>
                ) : (
                  <><ExternalLink className="h-3.5 w-3.5" /><span>LinkedIn</span></>
                )}
              </button>
            </>
          )}
          {open ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 px-5 py-4">
              {editing ? (
                <div onClick={(e) => e.stopPropagation()}>
                  <textarea
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    rows={10}
                    className="w-full resize-none rounded-lg bg-zinc-800 border border-violet-500/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-violet-500/70"
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                    >
                      <X className="h-3 w-3" />
                      Anuluj
                    </button>
                    <button
                      onClick={saveEdit}
                      className="flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-500 transition-colors"
                    >
                      <Check className="h-3 w-3" />
                      Zapisz
                    </button>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">{editedPost}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function TikTokCard({ scenes }: TikTokCardProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedScenes, setEditedScenes] = useState(scenes);
  const [draftScript, setDraftScript] = useState("");

  const fullScript = editedScenes
    .map((s) => `[Scena ${s.scene} – ${s.duration}]\nLektor: ${s.voiceover}\nWizualia: ${s.visual}`)
    .join("\n\n");

  async function handlePublishTikTok(e: React.MouseEvent) {
    e.stopPropagation();
    await navigator.clipboard.writeText(fullScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    window.open("https://www.tiktok.com/creator-center/upload", "_blank");
  }

  function startEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setDraftScript(fullScript);
    setEditing(true);
  }

  function saveEdit(e: React.MouseEvent) {
    e.stopPropagation();
    // Parse the draft back into scenes (best-effort: keep raw as single scene if parsing fails)
    const lines = draftScript.split("\n\n");
    const parsed: TikTokScene[] = [];
    lines.forEach((block, i) => {
      // Extract voiceover: text after "Lektor:" until "Wizualia:" or end of line
      const lectorIdx = block.indexOf("Lektor:");
      const wizualiaIdx = block.indexOf("Wizualia:");
      const durationMatch = block.match(/\[Scena \d+\s*[\u2013-]\s*(.+?)\]/);
      let voiceover = block;
      let visual = "";
      if (lectorIdx !== -1) {
        const start = lectorIdx + "Lektor:".length;
        const end = wizualiaIdx !== -1 ? wizualiaIdx : block.length;
        voiceover = block.slice(start, end).trim();
      }
      if (wizualiaIdx !== -1) {
        visual = block.slice(wizualiaIdx + "Wizualia:".length).trim();
      }
      parsed.push({
        scene: i + 1,
        duration: durationMatch?.[1] ?? editedScenes[i]?.duration ?? "30s",
        voiceover,
        visual,
      });
    });
    setEditedScenes(parsed.length > 0 ? parsed : editedScenes);
    setEditing(false);
  }

  function cancelEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setEditing(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-cyan-400">
            <Video className="h-4 w-4 text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-white text-sm">Skrypt TikTok / Reels</p>
            <p className="text-xs text-zinc-500">{editedScenes.length} scen</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {open && (
            <>
              <CopyButton text={fullScript} />
              {!editing && (
                <button
                  onClick={startEdit}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span>Edytuj</span>
                </button>
              )}
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
            </>
          )}
          {open ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {editing ? (
              <div className="border-t border-white/10 px-5 py-4" onClick={(e) => e.stopPropagation()}>
                <textarea
                  value={draftScript}
                  onChange={(e) => setDraftScript(e.target.value)}
                  rows={14}
                  className="w-full resize-none rounded-lg bg-zinc-800 border border-violet-500/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-violet-500/70 font-mono"
                />
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="h-3 w-3" />
                    Anuluj
                  </button>
                  <button
                    onClick={saveEdit}
                    className="flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-500 transition-colors"
                  >
                    <Check className="h-3 w-3" />
                    Zapisz
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-white/10 divide-y divide-white/5">
                {editedScenes.map((scene) => (
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
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function WhatsAppCard({ message }: WhatsAppCardProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);
  const [draftText, setDraftText] = useState(message);

  function handleShare(e: React.MouseEvent) {
    e.stopPropagation();
    const url = `https://wa.me/?text=${encodeURIComponent(editedMessage)}`;
    window.open(url, "_blank");
  }

  function startEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setDraftText(editedMessage);
    setEditing(true);
  }

  function saveEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setEditedMessage(draftText);
    setEditing(false);
  }

  function cancelEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setEditing(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366]">
            <MessageCircle className="h-4 w-4 text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-white text-sm">Wiadomość WhatsApp</p>
            <p className="text-xs text-zinc-500">{editedMessage.length} znaków</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {open && (
            <>
              <CopyButton text={editedMessage} />
              {!editing && (
                <button
                  onClick={startEdit}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span>Edytuj</span>
                </button>
              )}
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1ebe5d] transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Wyślij na WhatsApp</span>
              </button>
            </>
          )}
          {open ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 px-5 py-4">
              {editing ? (
                <div onClick={(e) => e.stopPropagation()}>
                  <textarea
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    rows={8}
                    className="w-full resize-none rounded-lg bg-zinc-800 border border-violet-500/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-violet-500/70"
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                    >
                      <X className="h-3 w-3" />
                      Anuluj
                    </button>
                    <button
                      onClick={saveEdit}
                      className="flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-500 transition-colors"
                    >
                      <Check className="h-3 w-3" />
                      Zapisz
                    </button>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">{editedMessage}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FacebookCard({ post }: FacebookCardProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedPost, setEditedPost] = useState(post);
  const [draftText, setDraftText] = useState(post);

  async function handlePublish(e: React.MouseEvent) {
    e.stopPropagation();
    await navigator.clipboard.writeText(editedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    window.open("https://www.facebook.com/", "_blank");
  }

  function startEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setDraftText(editedPost);
    setEditing(true);
  }

  function saveEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setEditedPost(draftText);
    setEditing(false);
  }

  function cancelEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setEditing(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1877F2]">
            <Share2 className="h-4 w-4 text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-white text-sm">Post na Facebooku</p>
            <p className="text-xs text-zinc-500">{editedPost.length} znaków</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {open && (
            <>
              <CopyButton text={editedPost} />
              {!editing && (
                <button
                  onClick={startEdit}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span>Edytuj</span>
                </button>
              )}
              <button
                onClick={handlePublish}
                className="flex items-center gap-1.5 rounded-lg bg-[#1877F2] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1464d8] transition-colors"
              >
                {copied ? (
                  <><Check className="h-3.5 w-3.5" /><span>Skopiowano — wklej!</span></>
                ) : (
                  <><ExternalLink className="h-3.5 w-3.5" /><span>Facebook</span></>
                )}
              </button>
            </>
          )}
          {open ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 px-5 py-4">
              {editing ? (
                <div onClick={(e) => e.stopPropagation()}>
                  <textarea
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    rows={10}
                    className="w-full resize-none rounded-lg bg-zinc-800 border border-violet-500/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-violet-500/70"
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                    >
                      <X className="h-3 w-3" />
                      Anuluj
                    </button>
                    <button
                      onClick={saveEdit}
                      className="flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-500 transition-colors"
                    >
                      <Check className="h-3 w-3" />
                      Zapisz
                    </button>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">{editedPost}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
