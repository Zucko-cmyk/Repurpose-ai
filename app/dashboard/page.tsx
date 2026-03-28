import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase-server";
import { AtSign, Building2, Video, Clock } from "lucide-react";
import type { Generation } from "@/types";

export default async function DashboardPage() {
  const supabase = await createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: generations } = await supabase
    .from("generations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: creditsRow } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Historia generowań</h1>
          <p className="text-sm text-zinc-500">{user.email}</p>
        </div>
        <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-center">
          <p className="text-2xl font-bold text-violet-300">
            {creditsRow?.credits ?? 0}
          </p>
          <p className="text-xs text-zinc-500">kredytów</p>
        </div>
      </div>

      {!generations || generations.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-12 text-center">
          <p className="text-zinc-500">Brak historii. Wróć na stronę główną i wygeneruj pierwsze treści!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(generations as Generation[]).map((gen) => (
            <div
              key={gen.id}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-5"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <p className="line-clamp-2 text-sm text-zinc-300">
                  {gen.source_text}
                </p>
                <div className="flex flex-shrink-0 items-center gap-1 text-xs text-zinc-600">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(gen.created_at).toLocaleDateString("pl-PL", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
