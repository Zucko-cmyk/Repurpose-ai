import { GoogleGenerativeAI } from "@google/generative-ai";
import type { RepurposeResult } from "@/types";

function getClient() {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
}

const TONE_INSTRUCTIONS: Record<string, string> = {
  standard:     "Use a clear, informative, and balanced tone. Present the content naturally.",
  kontrowersja: "Take a bold, provocative stance. Challenge common beliefs, use strong opinions, create healthy controversy that sparks debate. Start with a statement that will shock or surprise.",
  ranking:      "Structure ALL content as rankings, top lists, or countdowns (e.g. Top 5, #1 reason, ranked from worst to best). Use numbers prominently.",
  drama:        "Tell it as a gripping story with tension, conflict, and resolution. Use narrative arcs, cliffhangers, and emotional hooks. Make the reader feel the drama.",
  dyskusja:     "Present multiple sides of the argument. Ask provocative questions. Invite the audience to share their opinion. Structure as a debate with pros and cons.",
  inspiracja:   "Be uplifting, motivational, and empowering. Use powerful quotes style, actionable insights, and end with a strong call to believe and act.",
  edukacja:     "Be the expert teacher. Use step-by-step breakdowns, explain the 'why', use analogies, bullet points for clarity. Make complex things simple.",
  humor:        "Be witty, funny, and use irony or satire. Use unexpected twists, playful language, and self-deprecating humor where appropriate. Make people smile while delivering value.",
};

const LANGUAGE_NAMES: Record<string, string> = {
  pl: "Polish",
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
  it: "Italian",
  uk: "Ukrainian",
};

export async function repurposeContent(sourceText: string, language: string = "pl", tone: string = "standard"): Promise<RepurposeResult> {
  const languageName = LANGUAGE_NAMES[language] ?? "Polish";
  const toneInstruction = TONE_INSTRUCTIONS[tone] ?? TONE_INSTRUCTIONS.standard;

  const prompt = `You are an expert content repurposing specialist. Your job is to transform source content into multiple social media formats.

SOURCE CONTENT:
${sourceText}

CONTENT STYLE / TONE: ${toneInstruction}

IMPORTANT: Generate ALL output exclusively in ${languageName}. Regardless of the language of the source content, every word of the output must be in ${languageName}.
Apply the chosen content style consistently across ALL formats.

Generate the following 5 formats. Return ONLY valid JSON, no markdown, no extra text.

{
  "twitterThread": [
    {
      "order": 1,
      "content": "Hook tweet (max 280 chars) — grabs attention, teases the thread. No hashtags yet."
    },
    {
      "order": 2,
      "content": "Core idea #1 from the source (max 280 chars)"
    },
    {
      "order": 3,
      "content": "Core idea #2 from the source (max 280 chars)"
    },
    {
      "order": 4,
      "content": "Core idea #3 from the source (max 280 chars)"
    },
    {
      "order": 5,
      "content": "Call to action or takeaway + 2-3 relevant hashtags (max 280 chars)"
    }
  ],
  "linkedinPost": "Professional LinkedIn post (300-600 words). Start with a bold hook line, use short paragraphs, include bullet points for key takeaways, end with a question to drive comments. No generic fluff.",
  "tiktokScript": [
    {
      "scene": 1,
      "duration": "0-5s",
      "voiceover": "Hook — say something controversial or surprising to stop the scroll",
      "visual": "Description of what appears on screen"
    },
    {
      "scene": 2,
      "duration": "5-15s",
      "voiceover": "Set up the main problem or context",
      "visual": "Description of what appears on screen"
    },
    {
      "scene": 3,
      "duration": "15-30s",
      "voiceover": "Main value / insight #1",
      "visual": "Description of what appears on screen"
    },
    {
      "scene": 4,
      "duration": "30-45s",
      "voiceover": "Main value / insight #2",
      "visual": "Description of what appears on screen"
    },
    {
      "scene": 5,
      "duration": "45-60s",
      "voiceover": "Payoff + CTA — tell them what to do next",
      "visual": "Description of what appears on screen"
    }
  ],
  "whatsappMessage": "WhatsApp channel/group message (150-300 words). Casual but informative tone. Use emojis sparingly to highlight key points. Short paragraphs. End with a clear call to action or question. Formatted for easy reading on mobile.",
  "facebookPost": "Facebook post (150-400 words). Friendly and engaging tone. Mix of storytelling and value. Use 1-3 emojis naturally. End with a question or call to action to drive comments and shares."
}

Rules:
- Preserve the author's voice and specific examples from the source
- Twitter: each tweet must stand alone but connect to the thread
- LinkedIn: professional tone, no emojis overload, value-dense
- TikTok: conversational, energetic, direct address ("you")
- WhatsApp: casual, friendly, mobile-first, easy to read in a chat
- Facebook: engaging, mix of story and value, drives interaction
- Output language: ${languageName} (always, regardless of source language)`;

  const model = getClient().getGenerativeModel({ model: "gemini-2.5-flash" });
  const response = await model.generateContent(prompt);
  const text = response.response.text().trim();
  const jsonText = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

  return JSON.parse(jsonText) as RepurposeResult;
}
