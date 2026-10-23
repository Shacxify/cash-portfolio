// Read side of the BikeX work board. The Apps Script deployment behind
// /bikex is the single source of truth: it serves the team Google Sheet as
// JSON and the board page renders it. The Discord bot reads the same feed so
// reminders can never disagree with what the team sees on the board.

import { CRITICAL_PATH, MILESTONES, TERM, TIME_ZONE, type Milestone } from "./plan";

export interface BoardRow {
  row: number;
  wbs: string;
  task: string;
  phase: string;
  owner: string;
  status: string;
  due: string;
  start?: string;
  note?: string;
  /** Last-touched stamp the Sheet writes, e.g. "Sep 21 Cash (web)". */
  upd?: string;
}

export interface Board {
  rows: BoardRow[];
  owners: string[];
  status: string[];
  /** ISO timestamp of the read, straight from the Apps Script response. */
  at: string;
}

const DAY_MS = 86_400_000;

export class BoardError extends Error {}

export async function fetchBoard(apiUrl: string, timeoutMs = 8000): Promise<Board> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${apiUrl}?t=${Date.now()}`, { signal: ctrl.signal });
    if (!res.ok) throw new BoardError(`board API returned ${res.status}`);
    const body = (await res.json()) as Partial<Board> & { ok?: boolean; err?: string };
    if (!body.ok) throw new BoardError(body.err || "board API returned ok:false");
    return {
      rows: Array.isArray(body.rows) ? body.rows : [],
      owners: Array.isArray(body.owners) ? body.owners : [],
      status: Array.isArray(body.status) ? body.status : [],
      at: body.at || new Date().toISOString(),
    };
  } catch (err) {
    if (err instanceof BoardError) throw err;
    const reason = err instanceof Error ? err.message : String(err);
    throw new BoardError(
      ctrl.signal.aborted ? `board API did not answer in ${timeoutMs}ms` : reason,
    );
  } finally {
    clearTimeout(timer);
  }
}

// ---- dates -----------------------------------------------------------------
// Everything is a YYYY-MM-DD string, compared as a string or as a UTC
// midnight. Workers run in UTC, so "today" has to be asked for in the team's
// timezone or a 9am Pacific reminder reads the wrong day.

export function todayIso(timeZone = TIME_ZONE): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function isoToUtc(iso: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ""));
  return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : null;
}

/** Whole days from `from` to `to`; negative means `to` is in the past. */
export function daysBetween(from: string, to: string): number | null {
  const a = isoToUtc(from);
  const b = isoToUtc(to);
  return a === null || b === null ? null : Math.round((b - a) / DAY_MS);
}

export function addDays(iso: string, days: number): string {
  const base = isoToUtc(iso);
  if (base === null) return iso;
  return new Date(base + days * DAY_MS).toISOString().slice(0, 10);
}

export function formatDay(iso: string): string {
  const utc = isoToUtc(iso);
  if (utc === null) return "TBD";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
  }).format(new Date(utc));
}

export function formatLongDay(iso: string): string {
  const utc = isoToUtc(iso);
  if (utc === null) return "TBD";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(utc));
}

/** 1-based term week, clamped to the term length. */
export function termWeek(today: string): number {
  const elapsed = daysBetween(TERM.start, today);
  if (elapsed === null) return 1;
  return Math.min(TERM.weeks, Math.max(1, Math.floor(elapsed / 7) + 1));
}

// ---- selectors -------------------------------------------------------------

export const isDone = (r: BoardRow) => r.status === "Done";
export const isHeld = (r: BoardRow) => r.status === "Waiting" || r.status === "Stuck";
export const isCritical = (r: BoardRow) => CRITICAL_PATH.has(String(r.wbs || "").trim());

export function isOverdue(r: BoardRow, today: string): boolean {
  if (isDone(r)) return false;
  const due = isoToUtc(r.due);
  const now = isoToUtc(today);
  return due !== null && now !== null && due < now;
}

export function isDueWithin(r: BoardRow, today: string, days: number): boolean {
  if (isDone(r)) return false;
  const due = isoToUtc(r.due);
  const now = isoToUtc(today);
  if (due === null || now === null) return false;
  return due >= now && due <= now + days * DAY_MS;
}

export function daysLate(r: BoardRow, today: string): number {
  return Math.abs(daysBetween(r.due, today) ?? 0);
}

/**
 * Rows belonging to one person. "Whole team" rows are everyone's, so they ride
 * along on every roster member's reminder.
 */
export function rowsForOwner(rows: BoardRow[], owner: string): BoardRow[] {
  return rows.filter((r) => r.owner === owner || r.owner === "Whole team");
}

export function sortByDue(rows: BoardRow[]): BoardRow[] {
  return [...rows].sort((a, b) => String(a.due || "9").localeCompare(String(b.due || "9")));
}

export interface BoardStats {
  total: number;
  done: number;
  pct: number;
  overdue: number;
  dueSoon: number;
  held: number;
  week: number;
}

export function boardStats(rows: BoardRow[], today: string): BoardStats {
  const done = rows.filter(isDone).length;
  return {
    total: rows.length,
    done,
    pct: rows.length ? Math.round((100 * done) / rows.length) : 0,
    overdue: rows.filter((r) => isOverdue(r, today)).length,
    dueSoon: rows.filter((r) => isDueWithin(r, today, 7)).length,
    held: rows.filter(isHeld).length,
    week: termWeek(today),
  };
}

export function upcomingMilestones(today: string, days: number): Milestone[] {
  const now = isoToUtc(today);
  if (now === null) return [];
  const until = now + days * DAY_MS;
  return MILESTONES.filter((m) => {
    const d = isoToUtc(m.date);
    return d !== null && d >= now && d <= until;
  });
}

/** "`3.2` Draft acknowledgement templates — due Oct 2 (5 days late)" */
export function describeRow(r: BoardRow, today: string): string {
  const late = isOverdue(r, today);
  const n = late ? daysLate(r, today) : (daysBetween(today, r.due) ?? 0);
  const when = late
    ? `${n} day${n === 1 ? "" : "s"} late`
    : n === 0
      ? "due today"
      : `in ${n} day${n === 1 ? "" : "s"}`;
  const flag = isCritical(r) ? " ⚠️ critical path" : "";
  return `\`${r.wbs || "—"}\` ${r.task} — ${formatDay(r.due)} (${when})${flag}`;
}
