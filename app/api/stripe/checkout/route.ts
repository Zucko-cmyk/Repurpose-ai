import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { stripe, CREDITS_PRICE_PLN, CREDITS_PER_PURCHASE } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "blik", "p24"],
      line_items: [
        {
          price_data: {
            currency: "pln",
            unit_amount: CREDITS_PRICE_PLN,
            product_data: {
              name: `${CREDITS_PER_PURCHASE} kredytów RepurposeAI`,
              description: "Pakiet ${CREDITS_PER_PURCHASE} generowań treści",
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/?payment=success`,
      cancel_url: `${appUrl}/?payment=cancelled`,
      metadata: {
        user_id: user.id,
        credits: String(CREDITS_PER_PURCHASE),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Nie udało się utworzyć sesji płatności." },
      { status: 500 }
    );
  }
}
