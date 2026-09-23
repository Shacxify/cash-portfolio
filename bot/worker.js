/**
 * BikeX board bot - a scheduled Cloudflare Worker that reads the live board
 * and posts reminders and announcements to Discord through channel webhooks.
 *
 * Secrets / vars (set with `npx wrangler secret put -c bot/wrangler.jsonc <NAME>`):
 *   WEBHOOK_URL       required. Discord webhook for the reminders channel.
 *   WEBHOOK_STANDUP   optional. Webhook for the standup channel. The standup
 *                     digest and Friday scoreboard go here. Falls back to
 *                     WEBHOOK_URL.
 *   WEBHOOK_ANNOUNCE  optional. Webhook for #announcements. Milestone posts go
 *                     here with @everyone. Falls back to WEBHOOK_URL, without
 *                     the @everyone.
 *   MENTIONS          optional. JSON of owner name -> Discord user id, e.g.
 *                     {"Cash Johnson":"123","Brandon Le":"456"}. Named people
 *                     get pinged on their own overdue/due items.
 *   RUN_KEY           optional. Enables manual runs: POST /run?key=...&dry=1
 *
 * Schedule: weekdays 16:00 UTC (9am PDT / 8am PST). Milestone announcements
 * can post any weekday; the standup digest posts Mon/Wed/Fri. Plus
 * Saturdays 01:00 UTC (Friday 6pm PDT / 5pm PST, after the sponsor call) for
 * the weekly scoreboard. Posts only when there is something to say - a quiet
 * board means a quiet channel.
 *
 * Tone: the digest opens with wins (tasks marked Done since the last standup) and
 * credits anyone who flagged a task Stuck, before any reminders. Flagging
 * Stuck early is treated as a win, not a failure.
 */

const API = "https://script.google.com/macros/s/AKfycbwp2Q3l9s4674OZLx5shd_JheTgZgyAyogctRXCFfLA8ehcGeZWAt8J_q-ooinoZs6PUw/exec";
const BOARD = "https://cashjohnson.net/bikex";
const SCOREBOARD_CRON = "0 1 * * 6";

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
function laIso(t) { return laParts(new Date(t)).iso; }
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

// Status changes from the board's change log, filtered to ones that still
// hold: a task flipped to Done and then reopened is not a win. Keeps the
// latest matching entry per task. Only web edits are logged; edits made
// directly in the Google Sheet do not show up here.
function statusChanges(data, to, since) {
  const byWbs = {};
  for (const r of data.rows) byWbs[r.wbs] = r;
  const latest = {};
  for (const e of data.log || []) {
    if (e.field !== "status" || e.to !== to) continue;
    if (Date.parse(e.t) < since) continue;
    const row = byWbs[e.wbs];
    if (!row || row.status !== to) continue;
    latest[e.wbs] = { ...e, row };
  }
  return Object.values(latest).sort((a, b) => String(a.wbs).localeCompare(String(b.wbs), undefined, { numeric: true }));
}
// Credit for a finished task goes to its owner. A "Whole team" task credits
// whoever marked it Done, so a name still gets attached.
function doneCredit(c) { return c.row.owner === "Whole team" ? c.who || "Whole team" : c.row.owner; }

function winsSections(data, since, mentions) {
  const out = [];
  const wins = statusChanges(data, "Done", since);
  if (wins.length) {
    const lines = wins.map(c => `- **${c.wbs} ${c.row.task}** - ${tag(doneCredit(c), mentions)}`);
    out.push(`__**Wins since last standup**__ :tada:\n${lines.join("\n")}`);
  }
  const flags = statusChanges(data, "Stuck", since);
  if (flags.length) {
    const firstEver = !(data.log || []).some(e => e.field === "status" && e.to === "Stuck" && Date.parse(e.t) < since);
    const lines = flags.map(c => `- **${c.wbs} ${c.row.task}** - flagged by ${tag(c.who || c.row.owner, mentions)}`);
    const head = firstEver
      ? `__**First Stuck flag on the board**__ :raised_hand:\nThis is exactly what the Stuck column is for. Saying so early is what saves the team on Friday. Thank you. Who can help?`
      : `__**Raised a hand**__ :raised_hand:\nFlagged Stuck early, which is the right call. Who can help?`;
    out.push(`${head}\n${lines.join("\n")}`);
  }
  return out;
}

function buildMessages(data, todayIso, weekday, mentions, since) {
  const open = data.rows.filter(r => r.status !== "Done");
  const line = (r, extra) => `- **${r.wbs} ${r.task}** - ${tag(r.owner, mentions)}${extra || ""}`;
  const wins = winsSections(data, since, mentions);

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

  // Wins and Stuck flags open the message, ahead of any reminders
  sections.unshift(...wins);

  const standupDay = weekday === "Mon" || weekday === "Wed" || weekday === "Fri";
  const reminder = standupDay && sections.length
    ? { content: `**BikeX standup** - <${BOARD}>\n\n${sections.join("\n\n")}` }
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

// Friday evening scoreboard: the week's finished tasks and Stuck flags per
// person, plus overall progress. Stuck flags count as points on purpose.
function buildScoreboard(data, todayIso, weekday, mentions) {
  const dow = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(weekday);
  const mondayIso = isoAddDays(todayIso, -(dow < 0 ? 0 : dow));
  const since = Date.parse(mondayIso + "T00:00:00Z") - 864e5; // widen, then filter by LA date
  const inWeek = c => laIso(c.t) >= mondayIso;
  const wins = statusChanges(data, "Done", since).filter(inWeek);
  const flags = statusChanges(data, "Stuck", since).filter(inWeek);
  if (!wins.length && !flags.length) return null;

  const people = {};
  const bump = (name, k) => { (people[name] ||= { done: 0, flags: 0 })[k]++; };
  wins.forEach(c => bump(doneCredit(c), "done"));
  flags.forEach(c => bump(c.who || c.row.owner, "flags"));
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const lines = Object.entries(people)
    .sort((a, b) => (b[1].done + b[1].flags) - (a[1].done + a[1].flags) || a[0].localeCompare(b[0]))
    .map(([name, p]) => {
      const bits = [];
      if (p.done) bits.push(plural(p.done, "done", "done"));
      if (p.flags) bits.push(plural(p.flags, "Stuck flag", "Stuck flags"));
      return `- ${tag(name, mentions)} - ${bits.join(", ")}`;
    });

  const total = data.rows.length;
  const doneAll = data.rows.filter(r => r.status === "Done").length;
  const pct = total ? Math.round((100 * doneAll) / total) : 0;
  const foot = flags.length ? "\nStuck flags score here too. Raising a blocker early is a win." : "";
  return {
    content: `**Week of ${pretty(mondayIso)} scoreboard** - <${BOARD}>\n` +
      `${plural(wins.length, "task", "tasks")} finished this week. Board: ${doneAll}/${total} done (${pct}%).\n\n` +
      `${lines.join("\n")}${foot}`,
  };
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

async function loadBoard(env) {
  const res = await fetch(API + "?t=" + Date.now(), { redirect: "follow" });
  const data = await res.json();
  if (!data.ok) throw new Error("board API: " + (data.err || "bad response"));
  let mentions = {};
  try { mentions = JSON.parse(env.MENTIONS || "{}"); } catch (e) {}
  return { data, mentions };
}

async function runScoreboard(env, dry, nowMs) {
  const { data, mentions } = await loadBoard(env);
  const { iso: todayIso, weekday } = laParts(new Date(nowMs));
  const scoreboard = buildScoreboard(data, todayIso, weekday, mentions);
  const out = { todayIso, weekday, posted: [], skipped: !scoreboard };
  if (dry) return { ...out, scoreboard };
  const standupUrl = env.WEBHOOK_STANDUP || env.WEBHOOK_URL;
  if (scoreboard && standupUrl) { await post(standupUrl, scoreboard, false); out.posted.push("scoreboard"); }
  if (scoreboard && !standupUrl) out.error = "no standup webhook set, scoreboard skipped";
  return out;
}

async function run(env, dry, nowMs) {
  const { data, mentions } = await loadBoard(env);
  const { iso: todayIso, weekday } = laParts(new Date(nowMs));
  // Since the last standup: standups are Mon/Wed/Fri, so Monday looks back to Friday
  const since = nowMs - (weekday === "Mon" ? 3 : 2) * 864e5;
  const { reminder, announcements } = buildMessages(data, todayIso, weekday, mentions, since);

  const out = { todayIso, weekday, posted: [], skipped: !reminder && !announcements.length };
  if (dry) return { ...out, reminder, announcements };

  const standupUrl = env.WEBHOOK_STANDUP || env.WEBHOOK_URL;
  if (reminder && standupUrl) { await post(standupUrl, reminder, false); out.posted.push("standup"); }
  if (reminder && !standupUrl) out.error = "no standup webhook set, digest skipped";
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
    const now = event.scheduledTime || Date.now();
    ctx.waitUntil(event.cron === SCOREBOARD_CRON ? runScoreboard(env, false, now) : run(env, false, now));
  },
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/run") {
      if (!env.RUN_KEY || url.searchParams.get("key") !== env.RUN_KEY)
        return new Response("forbidden", { status: 403 });
      try {
        const dry = url.searchParams.get("dry") === "1";
        const result = url.searchParams.get("mode") === "scoreboard"
          ? await runScoreboard(env, dry, Date.now())
          : await run(env, dry, Date.now());
        return Response.json(result);
      } catch (e) {
        return new Response("error: " + e.message, { status: 500 });
      }
    }
    return new Response("bikex-bot ok");
  },
};
