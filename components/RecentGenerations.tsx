"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase";
import type { Generation } from "@/types";
import type { User } from "@supabase/supabase-js";

export default function RecentGenerations() {
  const [user, setUser] = useState<User | null>(null);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    // Check current session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        fetchGenerations(data.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchGenerations(currentUser.id);
      } else {
        setGenerations([]);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchGenerations(userId: string) {
    setLoading(true);
    const { data } = await supabase
      .from("generations")
      .select("id, user_id, source_text, created_at, twitter_thread, linkedin_post, tiktok_script, whatsapp_message, facebook_post")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(3);

    setGenerations((data as Generation[]) ?? []);
    setLoading(false);
  }

  if (!user || loading) return null;
  if (generations.length === 0) return null;

  return (
    <section className="mx-auto max-w-3xl px-4 pb-10">
      <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-300">Ostatnie generowania</h3>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            Zobacz całą historię
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="space-y-2">
          {generations.map((gen) => (
            <Link
              key={gen.id}
              href="/dashboard"
              className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-zinc-800/50 px-4 py-3 hover:bg-white/5 transition-colors"
            >
              <p className="line-clamp-1 text-sm text-zinc-300 flex-1">
                {gen.source_text}
              </p>
              <div className="flex flex-shrink-0 items-center gap-1 text-xs text-zinc-600">
                <Clock className="h-3 w-3" />
                {new Date(gen.created_at).toLocaleDateString("pl-PL", {
                  day: "numeric",
                  month: "short",
                })}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
