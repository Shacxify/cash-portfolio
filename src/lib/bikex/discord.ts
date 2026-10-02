// Thin Discord REST client plus interaction-signature verification. Small
// enough to run on the edge with no dependencies: the bot only needs to open
// DM channels, post messages, and answer slash commands.

const API = "https://discord.com/api/v10";

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  fields?: DiscordEmbedField[];
  footer?: { text: string };
  timestamp?: string;
}

export interface MessagePayload {
  content?: string;
  embeds?: DiscordEmbed[];
  allowed_mentions?: { parse: Array<"users" | "roles" | "everyone">; users?: string[] };
}

export class DiscordError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(
  token: string,
  path: string,
  init: RequestInit & { body?: string } = {},
): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bot ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "BikeXBoardBot (https://cashjohnson.net/bikex, 1.0)",
      ...(init.headers as Record<string, string> | undefined),
    },
  });

  // One retry on a rate limit, since a sweep fans out to the whole roster at
  // once and Discord's per-route buckets are small.
  if (res.status === 429) {
    const body = (await res.json().catch(() => ({}))) as { retry_after?: number };
    const wait = Math.min(5, Number(body.retry_after) || 1);
    await new Promise((r) => setTimeout(r, wait * 1000));
    return request<T>(token, path, init);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new DiscordError(
      `${init.method || "GET"} ${path} failed: ${res.status} ${text}`,
      res.status,
    );
  }
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

export async function openDmChannel(token: string, userId: string): Promise<string> {
  const channel = await request<{ id: string }>(token, "/users/@me/channels", {
    method: "POST",
    body: JSON.stringify({ recipient_id: userId }),
  });
  return channel.id;
}

export async function sendChannelMessage(
  token: string,
  channelId: string,
  payload: MessagePayload,
): Promise<{ id: string }> {
  return request<{ id: string }>(token, `/channels/${channelId}/messages`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * DM a user. Opening the DM channel is a separate call, and it is the one that
 * fails when the recipient has DMs from server members switched off — that
 * surfaces as a 403 the caller can report instead of swallowing.
 */
export async function sendDirectMessage(
  token: string,
  userId: string,
  payload: MessagePayload,
): Promise<{ id: string }> {
  const channelId = await openDmChannel(token, userId);
  return sendChannelMessage(token, channelId, payload);
}

// ---- interaction signature verification ------------------------------------

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.trim();
  if (clean.length % 2 !== 0 || /[^0-9a-fA-F]/.test(clean)) {
    throw new Error("not a hex string");
  }
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return out;
}

/**
 * Discord signs every interaction with Ed25519 over `timestamp + rawBody`.
 * An unverified endpoint fails Discord's own registration check, so this is
 * the gate on the whole command surface. Workers expose Ed25519 through
 * WebCrypto; older runtimes only know it as NODE-ED25519.
 */
export async function verifyInteraction(
  publicKey: string,
  signature: string | null,
  timestamp: string | null,
  rawBody: string,
): Promise<boolean> {
  if (!publicKey || !signature || !timestamp) return false;
  let sig: Uint8Array;
  let key: Uint8Array;
  try {
    sig = hexToBytes(signature);
    key = hexToBytes(publicKey);
  } catch {
    return false;
  }
  const message = new TextEncoder().encode(timestamp + rawBody);

  for (const algorithm of [
    { name: "Ed25519" },
    { name: "NODE-ED25519", namedCurve: "NODE-ED25519" },
  ]) {
    try {
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        key as BufferSource,
        algorithm as AlgorithmIdentifier,
        false,
        ["verify"],
      );
      return await crypto.subtle.verify(
        algorithm as AlgorithmIdentifier,
        cryptoKey,
        sig as BufferSource,
        message as BufferSource,
      );
    } catch {
      // try the next algorithm spelling
    }
  }
  return false;
}

// ---- interaction payloads --------------------------------------------------

export const InteractionType = { PING: 1, APPLICATION_COMMAND: 2 } as const;
export const InteractionResponseType = { PONG: 1, CHANNEL_MESSAGE_WITH_SOURCE: 4 } as const;
export const EPHEMERAL = 64;

export interface InteractionOption {
  name: string;
  type: number;
  value?: string | number | boolean;
}

export interface Interaction {
  type: number;
  data?: { name: string; options?: InteractionOption[] };
  member?: { user?: { id: string; username?: string } };
  user?: { id: string; username?: string };
}

export function interactionUserId(i: Interaction): string {
  return i.member?.user?.id || i.user?.id || "";
}

export function optionValue(i: Interaction, name: string): string | undefined {
  const opt = i.data?.options?.find((o) => o.name === name);
  return opt?.value === undefined ? undefined : String(opt.value);
}

export function optionFlag(i: Interaction, name: string): boolean {
  return i.data?.options?.find((o) => o.name === name)?.value === true;
}

export function ephemeral(content: string): Response {
  return Response.json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: { content, flags: EPHEMERAL },
  });
}
