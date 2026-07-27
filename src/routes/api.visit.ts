import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// Set in the deployment environment (Vercel project settings). The key is a
// Supabase publishable key; RLS on site_visits is insert-only, so it can log
// visits but never read them back. Without these vars, logging silently no-ops.
const SUPABASE_URL = process.env.VISIT_LOG_SUPABASE_URL ?? "";
const SUPABASE_PUBLISHABLE_KEY = process.env.VISIT_LOG_SUPABASE_KEY ?? "";

const BOT_RE =
  /bot|crawl|spider|slurp|preview|lighthouse|headless|python|curl|wget|monitor|scan|fetch|http/i;

interface IpInfo {
  city?: string | null;
  region?: string | null;
  country?: string | null;
  asn?: string | null;
  org?: string | null;
  isp?: string | null;
}

async function fetchJson(url: string, timeoutMs: number): Promise<Record<string, unknown> | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Two providers, tried in order — either may rate-limit or block
// datacenter callers, and enrichment stays best-effort throughout.
async function lookupIp(ip: string): Promise<IpInfo> {
  const who = (await fetchJson(`https://ipwho.is/${encodeURIComponent(ip)}`, 3000)) as {
    success?: boolean;
    city?: string;
    region?: string;
    country_code?: string;
    connection?: { asn?: number; org?: string; isp?: string };
  } | null;
  if (who?.success && who.connection?.org) {
    return {
      city: who.city ?? null,
      region: who.region ?? null,
      country: who.country_code ?? null,
      asn: who.connection.asn != null ? String(who.connection.asn) : null,
      org: who.connection.org ?? null,
      isp: who.connection.isp ?? null,
    };
  }
  const api = (await fetchJson(
    `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,city,region,countryCode,as,org,isp`,
    3000,
  )) as {
    status?: string;
    city?: string;
    region?: string;
    countryCode?: string;
    as?: string;
    org?: string;
    isp?: string;
  } | null;
  if (api?.status === "success") {
    return {
      city: api.city ?? null,
      region: api.region ?? null,
      country: api.countryCode ?? null,
      asn: api.as ?? null,
      org: api.org || api.isp || null,
      isp: api.isp ?? null,
    };
  }
  return {};
}

export const Route = createFileRoute("/api/visit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
          return new Response(null, { status: 204 });
        }
        try {
          const body: { path?: unknown; referrer?: unknown } = await request
            .json()
            .catch(() => ({}));
          const ip =
            (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
            request.headers.get("x-real-ip") ||
            "";
          const userAgent = request.headers.get("user-agent") ?? "";
          const isBot = BOT_RE.test(userAgent);

          let geo: IpInfo = {};
          if (ip && !isBot) {
            geo = await lookupIp(ip);
          }

          await fetch(`${SUPABASE_URL}/rest/v1/site_visits`, {
            method: "POST",
            headers: {
              apikey: SUPABASE_PUBLISHABLE_KEY,
              Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify({
              ip,
              org: geo.org ?? null,
              isp: geo.isp ?? null,
              asn: geo.asn ?? null,
              city: geo.city ?? request.headers.get("x-vercel-ip-city"),
              region: geo.region ?? null,
              country: geo.country ?? request.headers.get("x-vercel-ip-country"),
              path: typeof body.path === "string" ? body.path.slice(0, 500) : null,
              referrer: typeof body.referrer === "string" ? body.referrer.slice(0, 500) : null,
              user_agent: userAgent.slice(0, 500),
              is_bot: isBot,
            }),
          });
        } catch {
          // logging must never break the site
        }
        return new Response(null, { status: 204 });
      },
    },
  },
});
