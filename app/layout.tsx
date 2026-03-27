import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RepurposeAI – Przerabiaj treści na złoto",
  description:
    "Wklej artykuł i w sekundy wygeneruj wątek na X, post LinkedIn i skrypt TikTok. Powered by Claude AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${geistSans.variable} h-full antialiased dark`}>
      <body className="min-h-full bg-zinc-950 text-zinc-100">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
