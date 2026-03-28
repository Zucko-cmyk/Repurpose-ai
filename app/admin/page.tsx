import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase-server";

export default async function AdminPage() {
  const supabase = await createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  // Total users
  const { count: totalUsers } = await supabase
    .from("user_credits")
    .select("*", { count: "exact", head: true });

  // Total generations
  const { count: totalGenerations } = await supabase
    .from("generations")
    .select("*", { count: "exact", head: true });

  // Generations in last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count: recentGenerations } = await supabase
    .from("generations")
    .select("*", { count: "exact", head: true })
    .gte("created_at", sevenDaysAgo);

  // Last 10 generations
  const { data: lastGenerations } = await supabase
    .from("generations")
    .select("id, user_id, source_text, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Panel admina</h1>
          <p className="text-sm text-zinc-500">{user.email}</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
            <p className="text-3xl font-bold text-white">{totalUsers ?? 0}</p>
            <p className="mt-1 text-sm text-zinc-500">Użytkownicy łącznie</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
            <p className="text-3xl font-bold text-white">{totalGenerations ?? 0}</p>
            <p className="mt-1 text-sm text-zinc-500">Generowania łącznie</p>
          </div>
          <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5">
            <p className="text-3xl font-bold text-violet-300">{recentGenerations ?? 0}</p>
            <p className="mt-1 text-sm text-zinc-500">Generowania (ostatnie 7 dni)</p>
          </div>
        </div>

        {/* Last 10 generations table */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden">
          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="font-semibold text-white">Ostatnie 10 generowań</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Data
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                    User ID
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Podgląd tekstu
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {lastGenerations?.map((gen) => (
                  <tr key={gen.id} className="hover:bg-white/5 transition-colors">
                    <td className="whitespace-nowrap px-5 py-3 text-xs text-zinc-400">
                      {new Date(gen.created_at).toLocaleDateString("pl-PL", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-3 text-xs font-mono text-zinc-500 max-w-[180px] truncate">
                      {gen.user_id}
                    </td>
                    <td className="px-5 py-3 text-xs text-zinc-300 max-w-xs truncate">
                      {gen.source_text}
                    </td>
                  </tr>
                ))}
                {(!lastGenerations || lastGenerations.length === 0) && (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-sm text-zinc-600">
                      Brak generowań
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
