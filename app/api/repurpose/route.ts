import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { repurposeContent } from "@/lib/anthropic";
import { createAdminClient } from "@/lib/supabase-server";
import { deductCredit, ensureUserCreditsRow, getUserCredits } from "@/lib/credits";

function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

async function fetchTextFromUrl(rawUrl: string): Promise<string> {
  const res = await fetch(rawUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; RepurposeAI/1.0)",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    throw new Error(`Nie udało się pobrać strony (status ${res.status}).`);
  }

  const html = await res.text();
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 5000);

  if (text.length < 50) {
    throw new Error("Strona nie zawiera wystarczającej ilości tekstu.");
  }

  return text;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { language, tone } = body;

    let sourceText: string;

    if (body.url) {
      // URL mode
      const rawUrl = String(body.url).trim();
      if (!isValidUrl(rawUrl)) {
        return NextResponse.json(
          { error: "Nieprawidłowy format URL. Podaj pełny adres (np. https://example.com/artykul)." },
          { status: 400 }
        );
      }

      try {
        sourceText = await fetchTextFromUrl(rawUrl);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Błąd pobierania URL.";
        return NextResponse.json({ error: message }, { status: 400 });
      }
    } else {
      // Text mode
      const text = body.text;
      if (!text || typeof text !== "string" || text.trim().length < 50) {
        return NextResponse.json(
          { error: "Tekst musi mieć co najmniej 50 znaków." },
          { status: 400 }
        );
      }
      sourceText = text.trim();
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
    const result = await repurposeContent(sourceText, language ?? "pl", tone ?? "standard");

    // Deduct 1 credit after successful generation
    await deductCredit(supabase, user.id);

    // Save generation to DB
    await supabase.from("generations").insert({
      user_id: user.id,
      source_text: sourceText.slice(0, 5000),
      twitter_thread: result.twitterThread,
      linkedin_post: result.linkedinPost,
      tiktok_script: result.tiktokScript,
      whatsapp_message: result.whatsappMessage,
      facebook_post: result.facebookPost,
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
