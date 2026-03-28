import { SupabaseClient } from "@supabase/supabase-js";

export async function getUserCredits(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const { data, error } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", userId)
    .single();

  if (error || !data) return 0;
  return data.credits;
}

export async function ensureUserCreditsRow(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  const { data } = await supabase
    .from("user_credits")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!data) {
    await supabase.from("user_credits").insert({
      user_id: userId,
      credits: 3,
    });
  }
}

export async function deductCredit(
  supabase: SupabaseClient,
  userId: string,
  amount: number = 1
): Promise<boolean> {
  const credits = await getUserCredits(supabase, userId);
  if (credits < amount) return false;

  const { error } = await supabase
    .from("user_credits")
    .update({
      credits: credits - amount,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  return !error;
}

export async function addCredits(
  supabase: SupabaseClient,
  userId: string,
  amount: number
): Promise<void> {
  const credits = await getUserCredits(supabase, userId);

  await supabase
    .from("user_credits")
    .upsert({
      user_id: userId,
      credits: credits + amount,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);
}
