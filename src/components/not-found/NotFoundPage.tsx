import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Fish as FishIcon } from "lucide-react";
import { Toaster } from "sonner";
import { AuroraBackground } from "@/components/AuroraBackground";
import { EasterEgg } from "@/components/EasterEgg";
import { CELEBRATE_EVENT } from "@/lib/site";
import { FishingGame } from "./FishingGame";
import { LINK_FISH, TIERS, type FishKind } from "./fish";

const ROUND_MS = 60_000;
const BEST_KEY = "cj:404-best";
const CATCH_KEY = "cj:404-catch";

// idle: nothing cast yet. playing: timed round. over: results card.
// free: fishing between rounds, which unlocks links but doesn't score.
type Phase = "idle" | "playing" | "over" | "free";

function readStorage(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked or full: the game still works, it just won't remember.
  }
}

function celebrate(title: string, description: string) {
  window.dispatchEvent(new CustomEvent(CELEBRATE_EVENT, { detail: { title, description } }));
}

const glass = {
  border: "1px solid rgba(0,0,0,0.12)",
  background: "rgba(255,255,255,0.6)",
  backdropFilter: "blur(12px)",
} as const;

const pillClass =
  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-foreground transition-all duration-200 hover:scale-105 hover:bg-white/85 active:scale-95";

function formatTime(ms: number) {
  const s = Math.ceil(Math.max(0, ms) / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function CatchLink({ fish }: { fish: FishKind }) {
  const dest = fish.dest;
  if (!dest) return null;
  const dot = (
    <span
      aria-hidden
      className="h-2 w-2 rounded-full"
      style={{ background: TIERS[fish.tier].color }}
    />
  );
  if (dest.kind === "route") {
    return (
      <Link to={dest.to} hash={dest.hash} className={pillClass} style={glass}>
        {dot}
        {fish.title}
      </Link>
    );
  }
  return (
    <a
      href={dest.href}
      target={dest.external ? "_blank" : undefined}
      rel={dest.external ? "noreferrer" : undefined}
      className={pillClass}
      style={glass}
    >
      {dot}
      {fish.title}
      {dest.external && <ArrowUpRight size={14} strokeWidth={1.75} />}
    </a>
  );
}

export function NotFoundPage() {
  const [phase, setPhaseState] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_MS);
  const [combo, setCombo] = useState(0);
  const [caught, setCaught] = useState<string[]>([]);
  const [newBest, setNewBest] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  // The canvas loop calls back outside React's render cycle, so the values it
  // needs synchronously live in refs alongside the rendered state.
  const phaseRef = useRef<Phase>("idle");
  const scoreRef = useRef(0);
  const bestRef = useRef(0);
  const comboRef = useRef(0);
  const caughtRef = useRef<string[]>([]);

  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  }, []);

  useEffect(() => {
    document.title = "Page not found | Cash Johnson";
    const storedBest = readStorage(BEST_KEY);
    if (typeof storedBest === "number" && storedBest > 0) {
      bestRef.current = storedBest;
      setBest(storedBest);
    }
    const storedCatch = readStorage(CATCH_KEY);
    if (Array.isArray(storedCatch)) {
      const valid = storedCatch.filter((id) => LINK_FISH.some((f) => f.id === id));
      caughtRef.current = valid;
      setCaught(valid);
    }
  }, []);

  const startRound = useCallback(() => {
    scoreRef.current = 0;
    comboRef.current = 0;
    setScore(0);
    setCombo(0);
    setTimeLeft(ROUND_MS);
    setNewBest(false);
    setPhase("playing");
  }, [setPhase]);

  const endRound = useCallback(() => {
    setPhase("over");
    const final = scoreRef.current;
    if (final > bestRef.current) {
      bestRef.current = final;
      setBest(final);
      setNewBest(true);
      writeStorage(BEST_KEY, final);
      celebrate("New high score! 🎣", `${final} points. The one that got away is jealous.`);
    }
  }, [setPhase]);

  // Round timer. Only counts down while the tab is visible, matching the
  // canvas loop, which pauses when hidden.
  useEffect(() => {
    if (phase !== "playing") return;
    let remaining = ROUND_MS;
    let last = performance.now();
    const id = window.setInterval(() => {
      const t = performance.now();
      if (!document.hidden) remaining -= t - last;
      last = t;
      setTimeLeft(remaining);
      if (remaining <= 0) {
        window.clearInterval(id);
        endRound();
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [phase, endRound]);

  const onCast = useCallback(() => {
    if (phaseRef.current === "idle") startRound();
  }, [startRound]);

  const onMiss = useCallback(() => {
    comboRef.current = 0;
    setCombo(0);
  }, []);

  const onCatch = useCallback((kind: FishKind) => {
    const playing = phaseRef.current === "playing";
    let text: string;
    let points = 0;
    if (kind.tier === "junk") {
      comboRef.current = 0;
      points = playing ? TIERS.junk.points : 0;
      text = playing ? `${points} ${kind.title}` : kind.title;
    } else {
      comboRef.current += 1;
      const mult = Math.min(3, comboRef.current);
      points = playing ? TIERS[kind.tier].points * mult : 0;
      text = playing ? `+${points} ${kind.label}${mult > 1 ? ` ×${mult}` : ""}` : kind.label;
    }
    setCombo(comboRef.current);
    if (playing) {
      scoreRef.current = Math.max(0, scoreRef.current + points);
      setScore(scoreRef.current);
    }

    if (kind.dest && !caughtRef.current.includes(kind.id)) {
      const next = [...caughtRef.current, kind.id];
      caughtRef.current = next;
      setCaught(next);
      writeStorage(CATCH_KEY, next);
      text += " · unlocked!";
    }
    if (kind.tier === "legendary") {
      celebrate(
        "You hooked the Konami Koi 🎣",
        "One in a hundred casts. Say hi: me@cashjohnson.net",
      );
    }
    setAnnouncement(`Caught ${kind.title}. ${text}`);
    return text;
  }, []);

  const caughtFish = LINK_FISH.filter((f) => caught.includes(f.id));
  const multiplier = Math.min(3, combo);

  return (
    <div
      className="relative min-h-svh overflow-hidden text-foreground"
      style={{ background: "#FAFAF9" }}
    >
      <AuroraBackground />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 md:px-10 md:py-14">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p
              className="hero-rise font-bold tracking-tight"
              style={{
                fontSize: "clamp(3.5rem, 9vw, 7rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
                color: "#86A397",
              }}
            >
              404
            </p>
            <h1
              className="hero-rise mt-2 font-bold tracking-tight text-balance"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                animationDelay: "0.1s",
              }}
            >
              This page got away.
            </h1>
            <p
              className="hero-rise mt-3 max-w-xl text-foreground/70 text-balance"
              style={{ animationDelay: "0.2s" }}
            >
              The link you followed doesn't lead anywhere, but the pond is stocked. Every fish is a
              real page on this site. Hook one to unlock it.
            </p>
          </div>

          <div
            className="hero-rise flex flex-wrap items-center gap-2 md:justify-end"
            style={{ animationDelay: "0.3s" }}
          >
            <span className={`${pillClass} hover:scale-100`} style={glass}>
              Score <strong className="tabular-nums">{score}</strong>
            </span>
            <span className={`${pillClass} hover:scale-100`} style={glass}>
              Best <strong className="tabular-nums">{best}</strong>
            </span>
            {phase === "free" ? (
              <button type="button" onClick={startRound} className={pillClass} style={glass}>
                Start a round
              </button>
            ) : (
              <span className={`${pillClass} hover:scale-100 tabular-nums`} style={glass}>
                {formatTime(phase === "playing" ? timeLeft : phase === "over" ? 0 : ROUND_MS)}
              </span>
            )}
            {multiplier > 1 && (
              <span
                className="inline-flex items-center rounded-full px-3 py-2 text-sm font-semibold"
                style={{ background: "#E1B07E", color: "#361D2E" }}
              >
                ×{multiplier} combo
              </span>
            )}
          </div>
        </header>

        <div
          className="hero-rise relative h-[min(58svh,520px)] min-h-[340px] overflow-hidden rounded-3xl focus-within:ring-2 focus-within:ring-[#86A397]"
          style={{ ...glass, background: "rgba(255,255,255,0.35)", animationDelay: "0.35s" }}
        >
          <FishingGame onCast={onCast} onCatch={onCatch} onMiss={onMiss} />

          {phase === "idle" && (
            <p className="pointer-events-none absolute inset-x-0 top-4 px-4 text-center text-sm text-foreground/60">
              Aim with your cursor. When the bobber dips and{" "}
              <strong className="text-foreground">!</strong> pops up, click to set the hook. 60
              seconds a round.
            </p>
          )}

          {phase === "over" && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#FAFAF9]/40 p-4 backdrop-blur-sm">
              <div className="w-full max-w-sm rounded-3xl p-6 text-center shadow-lg" style={glass}>
                <p className="text-sm font-medium text-foreground/60">Time's up</p>
                <p className="mt-1 text-6xl font-bold tracking-tight tabular-nums">{score}</p>
                <p className="mt-1 text-sm text-foreground/70">
                  {newBest ? (
                    <span className="font-semibold" style={{ color: "#86A397" }}>
                      New high score!
                    </span>
                  ) : (
                    <>Best: {best}</>
                  )}
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={startRound}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{ background: "#361D2E", color: "#FAFAF9" }}
                  >
                    <FishIcon size={16} strokeWidth={1.75} />
                    Cast again
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhase("free")}
                    className={pillClass}
                    style={glass}
                  >
                    Just fish
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <section aria-labelledby="catch-heading" className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="catch-heading" className="text-sm font-medium text-foreground/70">
              Your catch{" "}
              <span className="tabular-nums text-foreground/50">
                {caughtFish.length}/{LINK_FISH.length}
              </span>
            </h2>
            <Link to="/" className={pillClass} style={glass}>
              <ArrowLeft size={16} strokeWidth={1.75} />
              Back home
            </Link>
          </div>
          {caughtFish.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {caughtFish.map((f) => (
                <li key={f.id}>
                  <CatchLink fish={f} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-foreground/50">
              Nothing in the bucket yet. Links you reel in land here.
            </p>
          )}
        </section>

        {/* Screen-reader users get every link directly; the pond is a bonus, not a gate. */}
        <nav aria-label="Site pages" className="sr-only">
          <ul>
            {LINK_FISH.map((f) => (
              <li key={f.id}>
                <CatchLink fish={f} />
              </li>
            ))}
          </ul>
        </nav>
        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>
      </main>

      <EasterEgg />
      <Toaster position="bottom-right" />
    </div>
  );
}
