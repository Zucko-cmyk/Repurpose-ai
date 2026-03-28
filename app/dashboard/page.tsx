import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase-server";
import GenerationCard from "@/components/GenerationCard";
import Link from "next/link";
import { Home } from "lucide-react";
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
          <Link
            href="/"
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
          >
            <Home className="h-4 w-4" />
            Strona główna
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-2 text-center">
            <p className="text-2xl font-bold text-zinc-200">
              {generations?.length ?? 0}
            </p>
            <p className="text-xs text-zinc-500">generowań łącznie</p>
          </div>
          <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-center">
            <p className="text-2xl font-bold text-violet-300">
              {creditsRow?.credits ?? 0}
            </p>
            <p className="text-xs text-zinc-500">kredytów</p>
          </div>
        </div>
      </div>

      {!generations || generations.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-900 p-12 text-center">
          <p className="text-zinc-500">Brak historii. Wróć na stronę główną i wygeneruj pierwsze treści!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(generations as Generation[]).map((gen) => (
            <GenerationCard key={gen.id} gen={gen} />
          ))}
        </div>
      )}
    </div>
  );
}
