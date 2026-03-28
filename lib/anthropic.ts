import { GoogleGenerativeAI } from "@google/generative-ai";
import type { RepurposeResult } from "@/types";

function getClient() {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
}

export async function repurposeContent(sourceText: string): Promise<RepurposeResult> {
  const prompt = `You are an expert content repurposing specialist. Your job is to transform source content into multiple social media formats while PRESERVING the original tone, key insights, and unique value of the source material.

SOURCE CONTENT:
${sourceText}

Generate the following 4 formats. Return ONLY valid JSON, no markdown, no extra text.

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
  "whatsappMessage": "WhatsApp channel/group message (150-300 words). Casual but informative tone. Use emojis sparingly to highlight key points. Short paragraphs. End with a clear call to action or question. Formatted for easy reading on mobile."
}

Rules:
- Preserve the author's voice and specific examples from the source
- Twitter: each tweet must stand alone but connect to the thread
- LinkedIn: professional tone, no emojis overload, value-dense
- TikTok: conversational, energetic, direct address ("you")
- WhatsApp: casual, friendly, mobile-first, easy to read in a chat
- If source is in Polish, output in Polish. Otherwise match source language.`;

  const model = getClient().getGenerativeModel({ model: "gemini-2.5-flash" });
  const response = await model.generateContent(prompt);
  const text = response.response.text().trim();
  const jsonText = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

  return JSON.parse(jsonText) as RepurposeResult;
}
