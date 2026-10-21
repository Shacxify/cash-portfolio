import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { z } from "zod";
import { ASK_SYSTEM_PROMPT } from "@/lib/ask-context";

// Runs on the Gemini API free tier. Create a key at aistudio.google.com and set
// GEMINI_API_KEY in the deployment environment; without it the route answers
// 503 and the chat panel tells visitors to email instead. GEMINI_MODEL is
// optional and defaults to Google's rolling alias for the current Flash model.
const DEFAULT_MODEL = "gemini-flash-latest";

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(600),
      }),
    )
    .min(1)
    .max(12),
});

// Best-effort abuse guard so one visitor can't burn the free tier's daily
// quota. It is per instance, so it slows a noisy visitor but is not global.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 15;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
};

export const Route = createFileRoute("/api/ask")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return json({ error: "unavailable" }, 503);
        const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

        const ip =
          (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
          request.headers.get("cf-connecting-ip") ||
          request.headers.get("x-real-ip") ||
          "unknown";
        if (rateLimited(ip)) return json({ error: "rate_limited" }, 429);

        const parsed = bodySchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return json({ error: "bad_request" }, 400);

        // The conversation must open with a user turn and end on one.
        const messages = parsed.data.messages.slice(-10);
        while (messages.length && messages[0].role !== "user") messages.shift();
        if (!messages.length || messages[messages.length - 1].role !== "user") {
          return json({ error: "bad_request" }, 400);
        }

        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
              signal: AbortSignal.timeout(30_000),
              body: JSON.stringify({
                systemInstruction: { parts: [{ text: ASK_SYSTEM_PROMPT }] },
                contents: messages.map((m) => ({
                  role: m.role === "assistant" ? "model" : "user",
                  parts: [{ text: m.content }],
                })),
                generationConfig: { maxOutputTokens: 2048, temperature: 0.4 },
              }),
            },
          );

          // Free-tier quota exhausted, or Google is shedding load.
          if (res.status === 429 || res.status === 503) return json({ error: "busy" }, 429);
          if (!res.ok) {
            console.error("ask: Gemini API error", res.status, await res.text().catch(() => ""));
            return json({ error: "upstream" }, 502);
          }

          const data = (await res.json()) as GeminiResponse;
          const candidate = data.candidates?.[0];
          if (data.promptFeedback?.blockReason || candidate?.finishReason === "SAFETY") {
            return json({
              reply: "I can only help with questions about Cash's work and experience.",
            });
          }
          const reply = (candidate?.content?.parts ?? [])
            .map((p) => p.text ?? "")
            .join("")
            .trim();
          return json({ reply: reply || "Sorry, I lost my train of thought. Try asking again?" });
        } catch (error) {
          console.error("ask: request failed", error);
          return json({ error: "upstream" }, 502);
        }
      },
    },
  },
});
