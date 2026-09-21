/**
 * BikeX board bot - a scheduled Cloudflare Worker that reads the live board
 * and posts reminders and announcements to Discord through channel webhooks.
 *
 * Secrets / vars (set with `npx wrangler secret put -c bot/wrangler.jsonc <NAME>`):
 *   WEBHOOK_URL       required. Discord webhook for the reminders channel.
 *   WEBHOOK_ANNOUNCE  optional. Webhook for #announcements. Milestone posts go
 *                     here with @everyone. Falls back to WEBHOOK_URL, without
 *                     the @everyone.
 *   MENTIONS          optional. JSON of owner name -> Discord user id, e.g.
 *                     {"Cash Johnson":"123","Brandon Le":"456"}. Named people
 *                     get pinged on their own overdue/due items.
 *   RUN_KEY           optional. Enables manual runs: POST /run?key=...&dry=1
 *
 * Schedule: weekdays 16:00 UTC (9am PDT / 8am PST). Posts only when there is
 * something to say - a quiet board means a quiet channel.
 */

const API = "https://script.google.com/macros/s/AKfycbwp2Q3l9s4674OZLx5shd_JheTgZgyAyogctRXCFfLA8ehcGeZWAt8J_q-ooinoZs6PUw/exec";
const BOARD = "https://cashjohnson.net/bikex";

const MILESTONES = [
  { d: "2026-09-25", n: "Sponsor call 1: live DonorView walkthrough; three as-is flowcharts due", call: true },
  { d: "2026-09-30", n: "High-level presentation to class (10 to 12 minutes)" },
  { d: "2026-10-02", n: "Phase 2.0 exit: user requirements specs complete for all three processes" },
  { d: "2026-10-09", n: "Sponsor call 2: gap analysis and proposal deck", gate: true, call: true },
  { d: "2026-10-23", n: "Sponsor call 3; CPM diagram and risk register due to Prof. Sridar", call: true },
  { d: "2026-10-30", n: "Project plan v1 submitted" },
  { d: "2026-11-06", n: "Sponsor call 4: in-kind and outgoing feasibility memos", gate: true, call: true },
  { d: "2026-11-13", n: "High-level presentation week (class schedule)" },
  { d: "2026-11-20", n: "Sponsor call 5: pilot results and staff feedback", call: true },
  { d: "2026-12-04", n: "Sponsor call 6: final presentation and project plan v2", call: true },
  { d: "2026-12-11", n: "Turnover: SOPs handed in, sponsor feedback review" },
];

// ---- date helpers (everything in America/Los_Angeles) ----------------------
function laParts(date) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit", weekday: "short",
  });
  const parts = {};
  for (const p of fmt.formatToParts(date)) parts[p.type] = p.value;
  return { iso: `${parts.year}-${parts.month}-${parts.day}`, weekday: parts.weekday };
}
function isoAddDays(iso, n) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return dt.toISOString().slice(0, 10);
}
function daysBetween(a, b) { // b - a in days, iso strings
  return Math.round((Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / 864e5);
}
function pretty(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}
// upd stamps look like "Sep 21 Cash (web)"
function stampAgeDays(upd, todayIso) {
  const m = /^([A-Z][a-z]{2}) (\d{1,2})/.exec(String(upd || ""));
  if (!m) return null;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const mo = months.indexOf(m[1]);
  if (mo < 0) return null;
  const year = Number(todayIso.slice(0, 4));
  let iso = `${year}-${String(mo + 1).padStart(2, "0")}-${String(m[2]).padStart(2, "0")}`;
  if (daysBetween(todayIso, iso) > 90) iso = `${year - 1}${iso.slice(4)}`;
  return daysBetween(iso, todayIso);
}

// ---- message building -------------------------------------------------------
function tag(owner, mentions) {
  const id = mentions[owner];
  const first = owner === "Whole team" ? "Whole team" : String(owner || "?").split(" ")[0];
  return id ? `${first} <@${id}>` : first;
}

function buildMessages(data, todayIso, weekday, mentions) {
  const open = data.rows.filter(r => r.status !== "Done");
  const line = (r, extra) => `- **${r.wbs} ${r.task}** - ${tag(r.owner, mentions)}${extra || ""}`;

  const overdue = open.filter(r => r.due && r.due < todayIso)
    .map(r => line(r, ` - **${daysBetween(r.due, todayIso)}d late**`));
  const dueToday = open.filter(r => r.due === todayIso).map(r => line(r));
  const tomorrowIso = isoAddDays(todayIso, 1);
  const dueTomorrow = open.filter(r => r.due === tomorrowIso).map(r => line(r));

  const sections = [];
  if (overdue.length) sections.push(`__**Overdue**__\n${overdue.join("\n")}`);
  if (dueToday.length) sections.push(`__**Due today**__\n${dueToday.join("\n")}`);
  if (dueTomorrow.length) sections.push(`__**Due tomorrow**__\n${dueTomorrow.join("\n")}`);

  // Monday extras: stale in-progress work and the week ahead
  if (weekday === "Mon") {
    const stale = open.filter(r => {
      if (r.status !== "Working on it") return false;
      const age = stampAgeDays(r.upd, todayIso);
      return age != null && age > 7;
    }).map(r => line(r, " - no update in over a week"));
    if (stale.length) sections.push(`__**Stalled**__\n${stale.join("\n")}`);
    const weekEnd = isoAddDays(todayIso, 6);
    const thisWeek = open.filter(r => r.due && r.due > tomorrowIso && r.due <= weekEnd)
      .map(r => line(r, ` - ${pretty(r.due)}`));
    if (thisWeek.length) sections.push(`__**Also due this week**__\n${thisWeek.join("\n")}`);
  }

  // Sponsor call day: update-your-rows nudge
  const callToday = MILESTONES.find(ms => ms.call && ms.d === todayIso);
  if (callToday) sections.unshift(`Sponsor call today at 4:00 PM. Update your rows on the board before the call.`);

  const reminder = sections.length
    ? { content: `**BikeX board check** - <${BOARD}>\n\n${sections.join("\n\n")}` }
    : null;

  // Milestone announcements: 2 days out and day-of
  const announcements = [];
  for (const ms of MILESTONES) {
    const dd = daysBetween(todayIso, ms.d);
    if (dd === 2) announcements.push({ content: `@everyone **In 2 days (${pretty(ms.d)}):** ${ms.n}\n<${BOARD}>`, everyone: true });
    if (dd === 0) announcements.push({ content: `@everyone **Today:** ${ms.n}\n<${BOARD}>`, everyone: true });
  }
  return { reminder, announcements };
}

// ---- posting ----------------------------------------------------------------
async function post(url, msg, allowEveryone) {
  const res = await fetch(url + (url.includes("?") ? "&" : "?") + "wait=true", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "BikeX Board",
      avatar_url: "https://cashjohnson.net/favicon.ico",
      content: msg.content,
      allowed_mentions: { parse: allowEveryone ? ["users", "everyone"] : ["users"] },
    }),
  });
  if (!res.ok) throw new Error(`Discord webhook ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

async function run(env, dry) {
  const res = await fetch(API + "?t=" + Date.now(), { redirect: "follow" });
  const data = await res.json();
  if (!data.ok) throw new Error("board API: " + (data.err || "bad response"));
  let mentions = {};
  try { mentions = JSON.parse(env.MENTIONS || "{}"); } catch (e) {}
  const { iso: todayIso, weekday } = laParts(new Date());
  const { reminder, announcements } = buildMessages(data, todayIso, weekday, mentions);

  const out = { todayIso, weekday, posted: [], skipped: !reminder && !announcements.length };
  if (dry) return { ...out, reminder, announcements };

  if (reminder && env.WEBHOOK_URL) { await post(env.WEBHOOK_URL, reminder, false); out.posted.push("reminder"); }
  if (reminder && !env.WEBHOOK_URL) out.error = "WEBHOOK_URL not set, reminder skipped";
  const annUrl = env.WEBHOOK_ANNOUNCE || env.WEBHOOK_URL;
  for (const a of announcements) {
    if (!annUrl) { out.error = "no webhook for announcements"; break; }
    await post(annUrl, a, !!env.WEBHOOK_ANNOUNCE);
    out.posted.push("announcement");
  }
  return out;
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(run(env, false));
  },
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/run") {
      if (!env.RUN_KEY || url.searchParams.get("key") !== env.RUN_KEY)
        return new Response("forbidden", { status: 403 });
      try {
        const result = await run(env, url.searchParams.get("dry") === "1");
        return Response.json(result);
      } catch (e) {
        return new Response("error: " + e.message, { status: 500 });
      }
    }
    return new Response("bikex-bot ok");
  },
};
