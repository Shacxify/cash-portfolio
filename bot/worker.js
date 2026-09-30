/**
 * BikeX board bot - a scheduled Cloudflare Worker that reads the live board
 * and posts reminders and announcements to Discord through channel webhooks.
 *
 * Secrets / vars (set with `npx wrangler secret put -c bot/wrangler.jsonc <NAME>`):
 *   WEBHOOK_URL       required. Discord webhook for the reminders channel.
 *   WEBHOOK_STANDUP   optional. Webhook for the team channel. The Monday and
 *                     Friday posts go here. Falls back to WEBHOOK_URL.
 *   WEBHOOK_ANNOUNCE  optional. Webhook for #announcements. Milestone posts go
 *                     here with @everyone. Falls back to WEBHOOK_URL, without
 *                     the @everyone.
 *   CHANNELS          optional. JSON of phase -> webhook URL, so each task's
 *                     reminders go to its workstream's channel. Keys are the
 *                     WBS phase number or the phase name, e.g.
 *                     {"3":"https://discord.com/api/webhooks/...",
 *                      "In-Kind Intake":"https://discord.com/api/webhooks/..."}
 *                     Phases without an entry stay in the standup post.
 *   MENTIONS          optional. JSON of owner name -> Discord user id, e.g.
 *                     {"Cash Johnson":"123","Brandon Le":"456"}. Named people
 *                     get pinged on their own overdue/due items.
 *   RUN_KEY           optional. Enables manual runs: POST /run?key=...&dry=1
 *
 * Schedule: 10am Pacific, every weekday, all year. The cron fires at both
 * 17:00 and 18:00 UTC and the worker only acts on the one that lands on 10am
 * in Los Angeles, so daylight saving never shifts it.
 *   Monday   weekly kickoff: board update, wins since Friday, Stuck flags,
 *            overdue, everything due this week, stalled work.
 *   Friday   weekly wrap: weekly wins, the morale scoreboard, and critical
 *            reminders (overdue, due today, due before Monday, still Stuck).
 *   Any day  milestone announcements two days out and day-of.
 * Posts only when there is something to say - a quiet board means a quiet
 * channel.
 *
 * Tone: both posts open with wins and credit anyone who flagged a task
 * Stuck, before any reminders. Flagging Stuck early is treated as a win.
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
    hour: "2-digit", hourCycle: "h23",
  });
  const parts = {};
  for (const p of fmt.formatToParts(date)) parts[p.type] = p.value;
  return { iso: `${parts.year}-${parts.month}-${parts.day}`, weekday: parts.weekday, hour: Number(parts.hour) };
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

function winsSections(data, since, mentions, title = "Wins since last check") {
  const out = [];
  const wins = statusChanges(data, "Done", since);
  if (wins.length) {
    const lines = wins.map(c => `- **${c.wbs} ${c.row.task}** - ${tag(doneCredit(c), mentions)}`);
    out.push(`__**${title}**__ :tada:\n${lines.join("\n")}`);
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

// Phase channel routing: CHANNELS maps a WBS phase number ("3") or phase
// name ("Acknowledgements", any case) to that workstream's webhook.
function channelFor(r, channels) {
  const num = String(r.wbs || "").split(".")[0];
  return channels[num] || channels[String(r.phase || "").toLowerCase()] || null;
}

// The reminder sections for a set of open tasks. Monday looks ahead at the
// whole week; Friday keeps to what is critical: late, due today, due before
// Monday's post, or still Stuck. `skip` holds tasks already shown as newly
// Stuck higher up, so they are not listed twice.
function reminderSections(open, todayIso, kind, line, skip = new Set()) {
  const sections = [];
  const byDue = (a, b) => String(a.due).localeCompare(String(b.due));
  const overdue = open.filter(r => r.due && r.due < todayIso).sort(byDue)
    .map(r => line(r, ` - **${daysBetween(r.due, todayIso)}d late**`));
  if (overdue.length) sections.push(`__**Overdue**__\n${overdue.join("\n")}`);
  if (kind === "monday") {
    const weekEnd = isoAddDays(todayIso, 6);
    const week = open.filter(r => r.due && r.due >= todayIso && r.due <= weekEnd).sort(byDue)
      .map(r => line(r, ` - ${r.due === todayIso ? "today" : pretty(r.due)}`));
    if (week.length) sections.push(`__**Due this week**__\n${week.join("\n")}`);
    const stale = open.filter(r => {
      if (r.status !== "Working on it") return false;
      const age = stampAgeDays(r.upd, todayIso);
      return age != null && age > 7;
    }).map(r => line(r, " - no update in over a week"));
    if (stale.length) sections.push(`__**Stalled**__\n${stale.join("\n")}`);
  } else {
    const dueToday = open.filter(r => r.due === todayIso).map(r => line(r));
    if (dueToday.length) sections.push(`__**Due today**__\n${dueToday.join("\n")}`);
    const mondayIso = isoAddDays(todayIso, 3);
    const soon = open.filter(r => r.due && r.due > todayIso && r.due <= mondayIso).sort(byDue)
      .map(r => line(r, ` - ${pretty(r.due)}`));
    if (soon.length) sections.push(`__**Due before Monday's check-in**__\n${soon.join("\n")}`);
  }
  const stuck = open.filter(r => r.status === "Stuck" && !skip.has(r.wbs)).map(r => line(r));
  if (stuck.length) sections.push(`__**Still Stuck, who can help?**__\n${stuck.join("\n")}`);
  return sections;
}

// Friday's morale scoreboard: the week's finished tasks and Stuck flags per
// person, plus overall progress. Stuck flags count as points on purpose.
function scoreboardSection(data, weekSince, mentions) {
  const wins = statusChanges(data, "Done", weekSince);
  const flags = statusChanges(data, "Stuck", weekSince);
  const total = data.rows.length;
  const doneAll = data.rows.filter(r => r.status === "Done").length;
  const pct = total ? Math.round((100 * doneAll) / total) : 0;
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const head = `__**Morale scoreboard**__ :trophy:\n${plural(wins.length, "task", "tasks")} finished this week. Board: ${doneAll}/${total} done (${pct}%).`;
  if (!wins.length && !flags.length) return `${head}\nNo scores yet this week. One Done or one honest Stuck flag gets you on the board.`;
  const people = {};
  const bump = (name, k) => { (people[name] ||= { done: 0, flags: 0 })[k]++; };
  wins.forEach(c => bump(doneCredit(c), "done"));
  flags.forEach(c => bump(c.who || c.row.owner, "flags"));
  const lines = Object.entries(people)
    .sort((a, b) => (b[1].done + b[1].flags) - (a[1].done + a[1].flags) || a[0].localeCompare(b[0]))
    .map(([name, p]) => {
      const bits = [];
      if (p.done) bits.push(`${p.done} done`);
      if (p.flags) bits.push(plural(p.flags, "Stuck flag", "Stuck flags"));
      return `- ${tag(name, mentions)} - ${bits.join(", ")}`;
    });
  const foot = flags.length ? "\nStuck flags score here too. Raising a blocker early is a win." : "";
  return `${head}\n${lines.join("\n")}${foot}`;
}

// kind is "monday", "friday", or null (announcements only).
function buildMessages(data, todayIso, kind, mentions, nowMs, channels = {}) {
  const open = data.rows.filter(r => r.status !== "Done");
  const line = (r, extra) => `- **${r.wbs} ${r.task}** - ${tag(r.owner, mentions)}${extra || ""}`;
  // Monday looks back to Friday's post; Friday looks back to Monday morning
  const dow = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(laParts(new Date(nowMs)).weekday);
  const weekSince = Date.parse(isoAddDays(todayIso, -Math.max(dow, 0)) + "T07:00:00Z");
  const since = kind === "monday" ? nowMs - 3 * 864e5 : weekSince;

  // Milestone announcements: 2 days out and day-of, any weekday
  const announcements = [];
  for (const ms of MILESTONES) {
    const dd = daysBetween(todayIso, ms.d);
    if (dd === 2) announcements.push({ content: `@everyone **In 2 days (${pretty(ms.d)}):** ${ms.n}\n<${BOARD}>`, everyone: true });
    if (dd === 0) announcements.push({ content: `@everyone **Today:** ${ms.n}\n<${BOARD}>`, everyone: true });
  }
  if (!kind) return { reminder: null, announcements, channelPosts: [] };

  // Tasks whose phase has its own channel get their reminders there; the
  // team post keeps everything else. Wins and the scoreboard stay together.
  const newlyStuck = statusChanges(data, "Stuck", since);
  const shown = new Set(newlyStuck.map(c => c.wbs));
  const byUrl = new Map();
  const unrouted = [];
  for (const r of open) {
    const url = channelFor(r, channels);
    if (!url) { unrouted.push(r); continue; }
    if (!byUrl.has(url)) byUrl.set(url, { phases: new Set(), rows: [] });
    byUrl.get(url).phases.add(r.phase);
    byUrl.get(url).rows.push(r);
  }
  const channelPosts = [];
  for (const [url, g] of byUrl) {
    const secs = reminderSections(g.rows, todayIso, kind, line, shown);
    const stuck = newlyStuck.filter(c => channelFor(c.row, channels) === url)
      .map(c => `- **${c.wbs} ${c.row.task}** - flagged by ${tag(c.who || c.row.owner, mentions)}`);
    if (stuck.length) secs.unshift(`__**Flagged Stuck, who can help?**__ :raised_hand:\n${stuck.join("\n")}`);
    if (!secs.length) continue;
    const phases = [...g.phases].join(" + ");
    const label = kind === "monday" ? "this week" : "Friday check";
    channelPosts.push({ url, phases, content: `**${phases}: ${label}** - <${BOARD}>\n\n${secs.join("\n\n")}` });
  }

  const sections = [];
  if (kind === "monday") {
    const total = data.rows.length, done = total - open.length;
    const dueWeek = open.filter(r => r.due && r.due >= todayIso && r.due <= isoAddDays(todayIso, 6)).length;
    const late = open.filter(r => r.due && r.due < todayIso).length;
    sections.push(`Board: ${done}/${total} done (${total ? Math.round(100 * done / total) : 0}%). ${dueWeek} due this week, ${late} overdue.`);
    const call = MILESTONES.find(ms => ms.call && daysBetween(todayIso, ms.d) >= 0 && daysBetween(todayIso, ms.d) <= 6);
    if (call) sections.push(`${call.n.split(":")[0]} is ${pretty(call.d)} at 4:00 PM. Update your rows on the board before then.`);
    sections.push(...winsSections(data, since, mentions, "Wins since Friday"));
  } else {
    const callToday = MILESTONES.find(ms => ms.call && ms.d === todayIso);
    if (callToday) sections.push(`Sponsor call today at 4:00 PM. Update your rows on the board before the call.`);
    sections.push(...winsSections(data, since, mentions, "Weekly wins"));
    sections.push(scoreboardSection(data, weekSince, mentions));
  }
  sections.push(...reminderSections(unrouted, todayIso, kind, line, shown));
  if (channelPosts.length)
    sections.push(`Reminders for ${channelPosts.map(c => c.phases).join(", ")} went to ${channelPosts.length === 1 ? "its own channel" : "their own channels"}.`);

  const title = kind === "monday" ? "BikeX weekly kickoff" : "BikeX weekly wrap";
  const reminder = { content: `**${title}** - <${BOARD}>\n\n${sections.join("\n\n")}` };
  return { reminder, announcements, channelPosts };
}

// ---- posting ----------------------------------------------------------------
// Discord caps a message at 2000 characters. Split at section breaks, and
// break an oversized section line by line so no task is dropped.
function chunks(text, max = 1900) {
  const out = [];
  let cur = "";
  const add = (piece, sep) => {
    const next = cur ? cur + sep + piece : piece;
    if (next.length <= max) { cur = next; return; }
    if (cur) out.push(cur);
    cur = piece.slice(0, max);
  };
  for (const part of text.split("\n\n")) {
    if (part.length <= max) { add(part, "\n\n"); continue; }
    part.split("\n").forEach((ln, i) => add(ln, i ? "\n" : "\n\n"));
  }
  if (cur) out.push(cur);
  return out;
}

async function post(url, msg, allowEveryone) {
  for (const content of chunks(msg.content)) await postOne(url, content, allowEveryone);
}

async function postOne(url, content, allowEveryone) {
  const res = await fetch(url + (url.includes("?") ? "&" : "?") + "wait=true", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "BikeX Board",
      avatar_url: "https://cashjohnson.net/favicon.ico",
      content,
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
  let channels = {};
  try {
    for (const [k, v] of Object.entries(JSON.parse(env.CHANNELS || "{}")))
      if (v) channels[String(k).trim().toLowerCase()] = v;
  } catch (e) {}
  return { data, mentions, channels };
}

// Scheduled runs only act at 10am Los Angeles time. Manual runs (/run) act
// whenever they are called, and `as` forces "monday" or "friday" for previews.
async function run(env, dry, nowMs, as, manual) {
  const { data, mentions, channels } = await loadBoard(env);
  const { iso: todayIso, weekday, hour } = laParts(new Date(nowMs));
  if (!manual && hour !== 10) return { todayIso, weekday, hour, posted: [], skipped: "not 10am in Los Angeles" };
  const kind = as || (weekday === "Mon" ? "monday" : weekday === "Fri" ? "friday" : null);
  const { reminder, announcements, channelPosts } = buildMessages(data, todayIso, kind, mentions, nowMs, channels);

  const out = { todayIso, weekday, kind, posted: [], skipped: !reminder && !announcements.length && !channelPosts.length };
  // Dry runs show which phases post where, never the webhook URLs themselves
  if (dry) return { ...out, reminder, announcements, channels: channelPosts.map(({ phases, content }) => ({ phases, content })) };

  const standupUrl = env.WEBHOOK_STANDUP || env.WEBHOOK_URL;
  if (reminder && standupUrl) { await post(standupUrl, reminder, false); out.posted.push(kind); }
  if (reminder && !standupUrl) out.error = "no team webhook set, post skipped";
  for (const c of channelPosts) {
    try { await post(c.url, c, false); out.posted.push("channel: " + c.phases); }
    catch (e) { out.error = (out.error ? out.error + "; " : "") + c.phases + ": " + e.message; }
  }
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
    ctx.waitUntil(run(env, false, event.scheduledTime || Date.now()));
  },
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/run") {
      if (!env.RUN_KEY || url.searchParams.get("key") !== env.RUN_KEY)
        return new Response("forbidden", { status: 403 });
      try {
        const dry = url.searchParams.get("dry") === "1";
        const as = ["monday", "friday"].includes(url.searchParams.get("as")) ? url.searchParams.get("as") : undefined;
        return Response.json(await run(env, dry, Date.now(), as, true));
      } catch (e) {
        return new Response("error: " + e.message, { status: 500 });
      }
    }
    return new Response("bikex-bot ok");
  },
};
