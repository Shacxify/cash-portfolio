import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { ASK_SYSTEM_PROMPT } from "@/lib/ask-context";

// Set ANTHROPIC_API_KEY in the deployment environment. Without it the route
// answers 503 and the chat panel tells visitors to email instead.
const MODEL = "claude-opus-5-5";

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

// Best-effort abuse guard. It is per isolate, so it slows a single noisy
// visitor but is not a hard global cap; set a spend limit on the API key too.
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

export const Route = createFileRoute("/api/ask")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) return json({ error: "unavailable" }, 503);

        const ip =
          (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
          request.headers.get("cf-connecting-ip") ||
          request.headers.get("x-real-ip") ||
          "unknown";
        if (rateLimited(ip)) return json({ error: "rate_limited" }, 429);

        const parsed = bodySchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return json({ error: "bad_request" }, 400);

        // The API needs the conversation to open with a user turn and end on one.
        const messages = parsed.data.messages.slice(-10);
        while (messages.length && messages[0].role !== "user") messages.shift();
        if (!messages.length || messages[messages.length - 1].role !== "user") {
          return json({ error: "bad_request" }, 400);
        }

        const client = new Anthropic({ apiKey, maxRetries: 1, timeout: 30_000 });
        try {
          const response = await client.beta.messages.create({
            model: MODEL,
            // A small ceiling keeps cost predictable on a public endpoint.
            max_tokens: 2048,
            output_config: { effort: "low" },
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
            system: [
              { type: "text", text: ASK_SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
            ],
            messages,
          });

          if (response.stop_reason === "refusal") {
            return json({
              reply: "I can only help with questions about Cash's work and experience.",
            });
          }
          const reply = response.content
            .flatMap((b) => (b.type === "text" ? [b.text] : []))
            .join("")
            .trim();
          return json({ reply: reply || "Sorry, I lost my train of thought. Try asking again?" });
        } catch (error) {
          if (error instanceof Anthropic.RateLimitError) return json({ error: "busy" }, 429);
          if (error instanceof Anthropic.APIError) {
            console.error("ask: Claude API error", error.status, error.message);
          } else {
            console.error("ask: request failed", error);
          }
          return json({ error: "upstream" }, 502);
        }
      },
    },
  },
});
