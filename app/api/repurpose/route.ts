import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { repurposeContent } from "@/lib/anthropic";
import { createAdminClient } from "@/lib/supabase-server";
import { deductCredit, ensureUserCreditsRow, getUserCredits } from "@/lib/credits";

export async function POST(req: NextRequest) {
  try {
    const { text, language } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length < 50) {
      return NextResponse.json(
        { error: "Tekst musi mieć co najmniej 50 znaków." },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    // Get current user from session cookie
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Musisz być zalogowany, aby korzystać z generatora." },
        { status: 401 }
      );
    }

    // Ensure credits row exists (new user gets 3 free)
    await ensureUserCreditsRow(supabase, user.id);

    // Check credits before calling AI
    const credits = await getUserCredits(supabase, user.id);
    if (credits <= 0) {
      return NextResponse.json(
        { error: "Brak kredytów. Kup pakiet, aby kontynuować." },
        { status: 402 }
      );
    }

    // Generate content first — deduct only on success
    const result = await repurposeContent(text.trim(), language ?? "pl");

    // Deduct 1 credit after successful generation
    await deductCredit(supabase, user.id);

    // Save generation to DB
    await supabase.from("generations").insert({
      user_id: user.id,
      source_text: text.trim().slice(0, 5000),
      twitter_thread: result.twitterThread,
      linkedin_post: result.linkedinPost,
      tiktok_script: result.tiktokScript,
      whatsapp_message: result.whatsappMessage,
    });

    return NextResponse.json({ result });
  } catch (err) {
    console.error("Repurpose error:", err);
    return NextResponse.json(
      { error: "Błąd podczas generowania treści. Spróbuj ponownie." },
      { status: 500 }
    );
  }
}
