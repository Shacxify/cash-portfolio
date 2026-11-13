import { GITHUB_URL, LINKEDIN_URL, YOUTUBE_URL } from "@/lib/site";

export type Tier = "common" | "uncommon" | "rare" | "legendary" | "junk";

// Routes the router knows about, so the catch tray can use typed <Link>s.
export type InternalRoute =
  | "/"
  | "/projects"
  | "/blog/how-to-document-sops"
  | "/blog/operations-and-project-management"
  | "/blog/operations-project-manager-role"
  | "/blog/pm-vs-operations";

export type Destination =
  | { kind: "route"; to: InternalRoute; hash?: string }
  // Served outside the router (external sites, Vercel rewrites).
  | { kind: "href"; href: string; external?: boolean };

export type FishKind = {
  id: string;
  /** Short name drawn on the fish's label in the pond. */
  label: string;
  /** Longer name shown in the catch tray. */
  title: string;
  tier: Tier;
  dest?: Destination;
};

export const TIERS: Record<
  Tier,
  {
    points: number;
    weight: number;
    color: string;
    belly: string;
    size: number;
    speed: [number, number];
    // Swim band as a fraction of the water's depth (0 = surface, 1 = floor).
    depth: [number, number];
  }
> = {
  common: {
    points: 10,
    weight: 45,
    color: "#86A397",
    belly: "#CBC0AD",
    size: 22,
    speed: [40, 60],
    depth: [0.12, 0.4],
  },
  uncommon: {
    points: 25,
    weight: 30,
    color: "#E1B07E",
    belly: "#E5BE9E",
    size: 26,
    speed: [55, 80],
    depth: [0.3, 0.65],
  },
  rare: {
    points: 50,
    weight: 9,
    color: "#361D2E",
    belly: "#86A397",
    size: 18,
    speed: [90, 125],
    depth: [0.6, 0.9],
  },
  legendary: {
    points: 150,
    weight: 1,
    color: "#E8B04A",
    belly: "#FFF1CF",
    size: 24,
    speed: [140, 160],
    depth: [0.4, 0.88],
  },
  junk: {
    points: -5,
    weight: 15,
    color: "#8A7F74",
    belly: "#B5ABA0",
    size: 16,
    speed: [16, 26],
    depth: [0.08, 0.9],
  },
};

export const FISH: FishKind[] = [
  { id: "home", label: "Home", title: "Home", tier: "common", dest: { kind: "route", to: "/" } },
  {
    id: "work",
    label: "Featured Work",
    title: "Featured Work",
    tier: "common",
    dest: { kind: "route", to: "/", hash: "work" },
  },
  {
    id: "cv",
    label: "About & CV",
    title: "About & CV",
    tier: "common",
    dest: { kind: "route", to: "/", hash: "cv" },
  },
  {
    id: "contact",
    label: "Contact",
    title: "Contact",
    tier: "common",
    dest: { kind: "route", to: "/", hash: "contact" },
  },
  {
    id: "projects",
    label: "All Projects",
    title: "All Projects",
    tier: "uncommon",
    dest: { kind: "route", to: "/projects" },
  },
  {
    id: "sops",
    label: "SOP Guide",
    title: "How to Document SOPs",
    tier: "uncommon",
    dest: { kind: "route", to: "/blog/how-to-document-sops" },
  },
  {
    id: "ops-pm",
    label: "Ops + PM",
    title: "Operations & Project Management",
    tier: "uncommon",
    dest: { kind: "route", to: "/blog/operations-and-project-management" },
  },
  {
    id: "ops-role",
    label: "Ops PM Role",
    title: "What an Ops PM Does",
    tier: "uncommon",
    dest: { kind: "route", to: "/blog/operations-project-manager-role" },
  },
  {
    id: "pm-vs-ops",
    label: "PM vs Ops",
    title: "PM vs. Operations",
    tier: "uncommon",
    dest: { kind: "route", to: "/blog/pm-vs-operations" },
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    title: "LinkedIn",
    tier: "rare",
    dest: { kind: "href", href: LINKEDIN_URL, external: true },
  },
  {
    id: "youtube",
    label: "YouTube",
    title: "YouTube",
    tier: "rare",
    dest: { kind: "href", href: YOUTUBE_URL, external: true },
  },
  {
    id: "github",
    label: "GitHub",
    title: "GitHub",
    tier: "rare",
    dest: { kind: "href", href: GITHUB_URL, external: true },
  },
  {
    id: "mission",
    label: "Mission Control",
    title: "Mission Control",
    tier: "rare",
    dest: { kind: "href", href: "/MissionControl" },
  },
  { id: "koi", label: "Konami Koi", title: "Konami Koi", tier: "legendary" },
  { id: "boot", label: "old boot", title: "Old boot", tier: "junk" },
  { id: "can", label: "deprecated", title: "Tin can", tier: "junk" },
  { id: "semi", label: "missing ;", title: "Missing semicolon", tier: "junk" },
];

export const LINK_FISH = FISH.filter((f) => f.dest);

const TIER_ORDER: Tier[] = ["common", "uncommon", "rare", "legendary", "junk"];
const TOTAL_WEIGHT = TIER_ORDER.reduce((sum, t) => sum + TIERS[t].weight, 0);

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function pickKind(): FishKind {
  let roll = Math.random() * TOTAL_WEIGHT;
  let tier: Tier = "common";
  for (const t of TIER_ORDER) {
    roll -= TIERS[t].weight;
    if (roll <= 0) {
      tier = t;
      break;
    }
  }
  const pool = FISH.filter((f) => f.tier === tier);
  return pool[Math.floor(Math.random() * pool.length)];
}

export type FishState = "swim" | "nibble" | "bite" | "flee" | "reeled";

export type Fish = {
  uid: number;
  kind: FishKind;
  x: number;
  y: number;
  baseY: number;
  dir: 1 | -1;
  speed: number;
  phase: number;
  size: number;
  state: FishState;
  /** ms left in the current nibble / bite / reel state. */
  timer: number;
  alpha: number;
};

let nextUid = 1;

export function spawnFish(
  width: number,
  waterTop: number,
  height: number,
  speedScale: number,
): Fish {
  const kind = pickKind();
  const tier = TIERS[kind.tier];
  const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
  const depth = height - waterTop;
  const baseY = waterTop + depth * rand(tier.depth[0], tier.depth[1]);
  return {
    uid: nextUid++,
    kind,
    x: dir === 1 ? -80 : width + 80,
    y: baseY,
    baseY,
    dir,
    speed: rand(tier.speed[0], tier.speed[1]) * speedScale,
    phase: Math.random() * Math.PI * 2,
    size: tier.size,
    state: "swim",
    timer: 0,
    alpha: 1,
  };
}

/** Where the fish bites: the front of its head. */
export function mouthOf(f: Fish) {
  return { x: f.x + f.dir * f.size * 0.95, y: f.y };
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawBody(ctx: CanvasRenderingContext2D, f: Fish, t: number) {
  const tier = TIERS[f.kind.tier];
  const L = f.size;
  const wag = Math.sin(t * 0.012 + f.phase) * (f.state === "swim" ? 0.25 : 0.5);

  // Tail
  ctx.save();
  ctx.translate(-L * 0.8, 0);
  ctx.rotate(wag);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-L * 0.65, -L * 0.45);
  ctx.quadraticCurveTo(-L * 0.45, 0, -L * 0.65, L * 0.45);
  ctx.closePath();
  ctx.fillStyle = tier.color;
  ctx.fill();
  ctx.restore();

  // Body with a lighter belly
  const grad = ctx.createLinearGradient(0, -L * 0.5, 0, L * 0.5);
  grad.addColorStop(0, tier.color);
  grad.addColorStop(0.55, tier.color);
  grad.addColorStop(1, tier.belly);
  ctx.beginPath();
  ctx.ellipse(0, 0, L, L * 0.48, 0, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  if (f.kind.tier === "rare") {
    ctx.strokeStyle = "rgba(250,250,249,0.7)";
    ctx.lineWidth = 1.25;
    ctx.stroke();
  }
  if (f.kind.tier === "legendary") {
    ctx.strokeStyle = `rgba(255,248,225,${0.5 + 0.5 * Math.sin(t * 0.008)})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Fin
  ctx.beginPath();
  ctx.moveTo(-L * 0.15, -L * 0.42);
  ctx.quadraticCurveTo(L * 0.05, -L * 0.85, L * 0.3, -L * 0.4);
  ctx.fillStyle = tier.color;
  ctx.globalAlpha *= 0.85;
  ctx.fill();
  ctx.globalAlpha /= 0.85;

  // Eye
  ctx.beginPath();
  ctx.arc(L * 0.55, -L * 0.1, Math.max(2, L * 0.11), 0, Math.PI * 2);
  ctx.fillStyle = "#FAFAF9";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(L * 0.58, -L * 0.1, Math.max(1, L * 0.055), 0, Math.PI * 2);
  ctx.fillStyle = "#1a1016";
  ctx.fill();
}

function drawJunk(ctx: CanvasRenderingContext2D, f: Fish, t: number) {
  const L = f.size;
  const tier = TIERS.junk;
  ctx.rotate(Math.sin(t * 0.002 + f.phase) * 0.2);
  ctx.fillStyle = tier.color;
  ctx.strokeStyle = "#5E554C";
  ctx.lineWidth = 1.5;
  if (f.kind.id === "boot") {
    ctx.beginPath();
    ctx.moveTo(-L * 0.6, -L);
    ctx.lineTo(L * 0.1, -L);
    ctx.lineTo(L * 0.1, L * 0.1);
    ctx.lineTo(L * 0.9, L * 0.25);
    ctx.lineTo(L * 0.9, L * 0.7);
    ctx.lineTo(-L * 0.6, L * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (f.kind.id === "can") {
    roundRect(ctx, -L * 0.55, -L * 0.8, L * 1.1, L * 1.6, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = tier.belly;
    ctx.fillRect(-L * 0.55, -L * 0.25, L * 1.1, L * 0.5);
  } else {
    ctx.font = `700 ${L * 2.2}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(";", 0, 0);
  }
}

export function drawFish(ctx: CanvasRenderingContext2D, f: Fish, t: number, showLabel: boolean) {
  ctx.save();
  ctx.globalAlpha = f.alpha;
  ctx.translate(f.x, f.y);
  if (f.state === "reeled") ctx.rotate(-f.dir * 0.9);
  ctx.scale(f.dir, 1);
  if (f.kind.tier === "junk") drawJunk(ctx, f, t);
  else drawBody(ctx, f, t);
  ctx.restore();

  if (!showLabel || f.state === "reeled") return;

  // Label pill floats above the fish, unflipped so the text always reads.
  const isJunk = f.kind.tier === "junk";
  const text =
    f.kind.dest?.kind === "href" && f.kind.dest.external ? `${f.kind.label} ↗` : f.kind.label;
  ctx.save();
  ctx.globalAlpha = f.alpha * (isJunk ? 0.75 : 1);
  ctx.font = `${isJunk ? 500 : 600} 11px Inter, sans-serif`;
  const w = ctx.measureText(text).width + 14;
  const h = 19;
  const x = f.x - w / 2;
  const y = f.y - f.size * 0.9 - h - 4;
  roundRect(ctx, x, y, w, h, h / 2);
  ctx.fillStyle = f.kind.tier === "legendary" ? "rgba(255,241,207,0.95)" : "rgba(250,250,249,0.9)";
  ctx.fill();
  ctx.strokeStyle = f.kind.tier === "legendary" ? "#E8B04A" : "rgba(54,29,46,0.12)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "#361D2E";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, f.x, y + h / 2 + 0.5);
  ctx.restore();
}
