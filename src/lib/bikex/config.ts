// Runtime configuration for the BikeX Discord bot. Everything sensitive is an
// environment variable: `wrangler secret put` in production, .dev.vars locally
// (see .dev.vars.example). Reads are lazy so a missing secret degrades to a
// clear 503 instead of breaking the worker at module load.

import { PM_NAME } from "./plan";

/** Public Apps Script deployment the /bikex board already reads from. */
const DEFAULT_BOARD_API =
  "https://script.google.com/macros/s/AKfycbwp2Q3l9s4674OZLx5shd_JheTgZgyAyogctRXCFfLA8ehcGeZWAt8J_q-ooinoZs6PUw/exec";

export interface BikexConfig {
  botToken: string;
  publicKey: string;
  channelId: string;
  boardApi: string;
  reminderSecret: string;
  /** Board owner name -> Discord user id. */
  roster: Record<string, string>;
  /** Discord user ids allowed to run the write commands. */
  admins: string[];
  /** Optional role pinged on announcements and on the daily digest. */
  mentionRoleId: string;
}

function env(name: string): string {
  const value = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env?.[name];
  return typeof value === "string" ? value.trim() : "";
}

/**
 * BIKEX_DISCORD_ROSTER is a JSON object keyed by the exact owner names the
 * Sheet uses, e.g. {"Cash Johnson":"2453...","Jaden Dang":"9917..."}. A name
 * the Sheet has but the roster does not simply never gets DMed.
 */
function parseRoster(raw: string): Record<string, string> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: Record<string, string> = {};
    for (const [name, id] of Object.entries(parsed)) {
      if (typeof id === "string" && id.trim()) out[name.trim()] = id.trim();
    }
    return out;
  } catch {
    return {};
  }
}

export function readConfig(): BikexConfig {
  const roster = parseRoster(env("BIKEX_DISCORD_ROSTER"));
  const admins = env("BIKEX_DISCORD_ADMINS")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    botToken: env("BIKEX_DISCORD_BOT_TOKEN"),
    publicKey: env("BIKEX_DISCORD_PUBLIC_KEY"),
    channelId: env("BIKEX_DISCORD_CHANNEL_ID"),
    boardApi: env("BIKEX_BOARD_API") || DEFAULT_BOARD_API,
    reminderSecret: env("BIKEX_REMINDER_SECRET"),
    roster,
    // With no explicit admin list, the PM is the only one who can broadcast.
    admins: admins.length ? admins : [roster[PM_NAME]].filter(Boolean),
    mentionRoleId: env("BIKEX_DISCORD_MENTION_ROLE_ID"),
  };
}

export function missingFor(cfg: BikexConfig, needs: Array<keyof BikexConfig>): string[] {
  const names: Partial<Record<keyof BikexConfig, string>> = {
    botToken: "BIKEX_DISCORD_BOT_TOKEN",
    publicKey: "BIKEX_DISCORD_PUBLIC_KEY",
    channelId: "BIKEX_DISCORD_CHANNEL_ID",
    reminderSecret: "BIKEX_REMINDER_SECRET",
    roster: "BIKEX_DISCORD_ROSTER",
  };
  return needs
    .filter((key) => {
      const value = cfg[key];
      return typeof value === "string" ? !value : !Object.keys(value ?? {}).length;
    })
    .map((key) => names[key] ?? String(key));
}

export function isAdmin(cfg: BikexConfig, userId: string): boolean {
  return !!userId && cfg.admins.includes(userId);
}

/** Board owner name for a Discord user id, if that user is on the roster. */
export function ownerForDiscordId(cfg: BikexConfig, userId: string): string | null {
  for (const [name, id] of Object.entries(cfg.roster)) {
    if (id === userId) return name;
  }
  return null;
}

/**
 * Constant-time-ish comparison for the cron shared secret. Length leaks, the
 * contents do not.
 */
export function secretMatches(expected: string, given: string | null): boolean {
  if (!expected || !given || expected.length !== given.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ given.charCodeAt(i);
  return diff === 0;
}
