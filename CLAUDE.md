# RepurposeAI – Instrukcje projektu

## Cel aplikacji
SaaS do repurposingu treści. Użytkownik wkleja tekst lub URL, a AI generuje:
- Wątek na X (Twitter) – min. 5 tweetów
- Post na LinkedIn – profesjonalny
- Skrypt TikTok/Reels – z podziałem na sceny

## Stos technologiczny
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Lucide React, Framer Motion
- **AI**: Anthropic SDK (`claude-opus-4-6`)
- **Auth + DB**: Supabase
- **Płatności**: Stripe (system kredytów)

## Struktura plików
```
app/
  layout.tsx          – root layout, dark mode
  page.tsx            – strona główna (hero + generator)
  dashboard/
    page.tsx          – historia generowań (wymaga auth)
  api/
    repurpose/
      route.ts        – główny endpoint AI
    stripe/
      checkout/
        route.ts      – tworzenie sesji Stripe
      webhook/
        route.ts      – obsługa zdarzeń Stripe
    auth/
      callback/
        route.ts      – Supabase OAuth callback
components/
  Header.tsx          – nawigacja z auth
  Generator.tsx       – główny formularz + wyniki
  OutputCard.tsx      – karta z wynikiem (Twitter/LinkedIn/TikTok)
  CreditsDisplay.tsx  – licznik kredytów
  PricingButton.tsx   – przycisk zakupu kredytów
lib/
  anthropic.ts        – klient Anthropic + prompt
  supabase.ts         – klient Supabase (browser)
  supabase-server.ts  – klient Supabase (server)
  stripe.ts           – klient Stripe
  credits.ts          – logika kredytów
types/
  index.ts            – typy TypeScript
```

## System kredytów
- Nowy użytkownik: 3 darmowe generowania
- Pakiet: 50 kredytów za 10 PLN (Stripe Checkout)
- 1 generowanie = 1 kredyt (generuje wszystkie 3 formaty naraz)
- Kredyty przechowywane w tabeli `user_credits` w Supabase

## Tabele Supabase
```sql
-- user_credits
create table user_credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null unique,
  credits int not null default 3,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- generations
create table generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  source_text text not null,
  twitter_thread jsonb,
  linkedin_post text,
  tiktok_script jsonb,
  created_at timestamptz default now()
);
```

## Zmienne środowiskowe (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Uruchomienie
```bash
npm run dev
```

## Deploy
Vercel (ustaw zmienne środowiskowe w panelu projektu).
Stripe webhook URL: `https://your-domain.vercel.app/api/stripe/webhook`
