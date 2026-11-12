// Baseline plan facts for the BikeX (SVBE Donor Acknowledgement & Records
// Automation) project. This mirrors the PLAN block inside
// public/bikex/index.html — that page keeps its own inline copy so it stays a
// single self-contained file, this module feeds the Discord bot. When the
// baseline moves, change both.

export const TIME_ZONE = "America/Los_Angeles";

export const BOARD_URL = "https://cashjohnson.net/bikex";

export const TERM = { start: "2026-09-14", end: "2026-12-11", weeks: 13 } as const;

export const PM_NAME = "Cash Johnson";

export const ROLES: Record<string, string> = {
  "Cash Johnson": "PM, sponsor comms",
  "Alexander Ching": "Lead: Acknowledgements",
  "Andrew Paran": "Lead: In-kind intake",
  "Jaden Dang": "Project Architect: process design",
  "Brandon Le": "Lead: Outgoing donations",
};

export interface Milestone {
  date: string;
  note: string;
  /** Sponsor approval gate — slipping one of these moves every phase behind it. */
  gate?: boolean;
}

export const MILESTONES: Milestone[] = [
  {
    date: "2026-09-25",
    note: "Sponsor call 1: live DonorView walkthrough; three as-is flowcharts due",
  },
  { date: "2026-09-30", note: "High-level presentation to class (10 to 12 minutes)" },
  {
    date: "2026-10-02",
    note: "Phase 2.0 exit: user requirements specs complete for all three processes",
  },
  { date: "2026-10-09", note: "Sponsor call 2: gap analysis and proposal deck", gate: true },
  { date: "2026-10-23", note: "Sponsor call 3; CPM diagram and risk register due" },
  { date: "2026-10-30", note: "Project plan v1 submitted" },
  {
    date: "2026-11-06",
    note: "Sponsor call 4: in-kind and outgoing feasibility memos",
    gate: true,
  },
  { date: "2026-11-20", note: "Sponsor call 5: pilot results and staff feedback" },
  { date: "2026-12-04", note: "Sponsor call 6: final presentation and project plan v2" },
  { date: "2026-12-11", note: "Turnover: SOPs handed in, sponsor feedback review" },
];

/** WBS numbers on the critical path — late here is late for the whole project. */
export const CRITICAL_PATH = new Set([
  "2.3",
  "2.4",
  "2.9",
  "3.1",
  "3.2",
  "3.6",
  "3.7",
  "3.8",
  "6.1",
  "6.2",
  "6.3",
  "6.4",
  "7.1",
  "7.2",
  "7.4",
]);

/** Status values the Sheet uses, and the accent color the board gives each. */
export const STATUS_COLOR: Record<string, number> = {
  "Not started": 0xa3acba,
  "Working on it": 0xe39b2d,
  Waiting: 0x7b68c8,
  Stuck: 0xd6454b,
  Done: 0x2e9e68,
};

export const COLOR = {
  accent: 0x0e7c86,
  overdue: 0xd6454b,
  soon: 0xe39b2d,
  clear: 0x2e9e68,
} as const;
