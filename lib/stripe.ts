import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export const CREDITS_PRICE_PLN = 500; // 5 PLN in grosz
export const CREDITS_PER_PURCHASE = 50;
