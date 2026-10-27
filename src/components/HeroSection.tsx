import { motion, useTransform, type MotionValue } from "framer-motion";
import { Layers, Linkedin, Sparkles, User, Youtube } from "lucide-react";
import { useCursorParallax } from "@/hooks/use-cursor-parallax";
import { LINKEDIN_URL, OPEN_ASK_EVENT, YOUTUBE_URL } from "@/lib/site";
import { NowBuilding } from "./NowBuilding";

const ease = [0.16, 1, 0.3, 1] as const;

// Wraps one aurora blob so it drifts toward the cursor. The blob keeps its own
// CSS keyframe animation; the parallax lives on this wrapper so the two
// transforms never fight. Larger |depth| = closer to the viewer = moves
// further; a negative depth makes the layer counter-move for real parallax.
// On top of the drift the layer swirls and breathes a little as the cursor
// sweeps across, so the whole field feels alive rather than merely shifting.
function ParallaxLayer({
  x,
  y,
  depth,
  swirl = 0,
  children,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  depth: number;
  swirl?: number;
  children: React.ReactNode;
}) {
  const tx = useTransform(x, (v) => v * depth);
  const ty = useTransform(y, (v) => v * depth);
  const rotate = useTransform(x, (v) => v * swirl);
  // Grow slightly the further the cursor is from the center, in either axis.
  const scale = useTransform([x, y] as const, ([vx, vy]: number[]) => {
    const reach = Math.min(1, Math.hypot(vx, vy) * 2);
    return 1 + reach * 0.06;
  });
  return (
    <motion.div className="absolute inset-0" style={{ x: tx, y: ty, rotate, scale }}>
      {children}
    </motion.div>
  );
}

export function HeroSection() {
  const { x, y } = useCursorParallax();

  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-end overflow-hidden px-6 md:px-10 pb-32 md:pb-48"
    >
      {/* Inline aurora blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <ParallaxLayer x={x} y={y} depth={190} swirl={8}>
          <div
            className="absolute aurora-blob-1"
            style={{
              top: 0,
              right: 0,
              width: "700px",
              height: "700px",
              background: "radial-gradient(circle, #E1B07E 0%, #E5BE9E 60%, transparent 70%)",
              filter: "blur(64px)",
              opacity: 0.4,
              transform: "translate(20%, -25%)",
            }}
          />
        </ParallaxLayer>
        <ParallaxLayer x={x} y={y} depth={-150} swirl={-10}>
          <div
            className="absolute aurora-blob-2"
            style={{
              top: 0,
              left: 0,
              width: "550px",
              height: "550px",
              background: "radial-gradient(circle, #86A397 0%, #CBC0AD 60%, transparent 70%)",
              filter: "blur(74px)",
              opacity: 0.32,
              transform: "translate(-20%, -20%)",
            }}
          />
        </ParallaxLayer>
        <ParallaxLayer x={x} y={y} depth={110} swirl={6}>
          <div
            className="absolute aurora-blob-3"
            style={{
              bottom: 0,
              right: 0,
              width: "500px",
              height: "500px",
              background: "radial-gradient(circle, #361D2E 0%, #86A397 60%, transparent 70%)",
              filter: "blur(92px)",
              opacity: 0.2,
              transform: "translate(15%, 20%)",
            }}
          />
        </ParallaxLayer>
      </div>

      <div className="relative z-10 max-w-6xl w-full text-left">
        <NowBuilding />
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="font-bold tracking-tight text-foreground text-balance"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          Hi, I'm Cash Johnson.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
          className="mt-3 text-foreground/80 text-balance"
          style={{
            fontSize: "clamp(2.25rem, 5.4vw, 5.25rem)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          I'm an <span style={{ color: "#86A397" }}>AI Solutions Architect</span> based in Silicon
          Valley.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease }}
          className="mt-10 md:mt-12 flex flex-wrap gap-3 max-w-[540px]"
        >
          <a
            href="#work"
            className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[15px] font-medium text-foreground transition-all duration-200 hover:scale-105 hover:bg-white/85 active:scale-95"
            style={{
              border: "1px solid rgba(0,0,0,0.15)",
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Layers size={18} strokeWidth={1.5} />
            Featured Work
          </a>
          <a
            href="#cv"
            className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[15px] font-medium text-foreground transition-all duration-200 hover:scale-105 hover:bg-white/85 active:scale-95"
            style={{
              border: "1px solid rgba(0,0,0,0.15)",
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(12px)",
            }}
          >
            <User size={18} strokeWidth={1.5} />
            More About Me
          </a>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_ASK_EVENT))}
            className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[15px] font-medium text-white transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              border: "1px solid rgba(0,0,0,0.15)",
              background: "#361D2E",
            }}
          >
            <Sparkles size={18} strokeWidth={1.5} />
            Ask My AI About Me
          </button>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="inline-flex shrink-0 items-center justify-center h-12 w-12 rounded-full text-foreground transition-all duration-200 hover:scale-110 hover:bg-white/85 active:scale-95"
            style={{
              border: "1px solid rgba(0,0,0,0.15)",
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Linkedin size={20} strokeWidth={1.5} />
          </a>

          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            className="inline-flex shrink-0 items-center justify-center h-12 w-12 rounded-full text-foreground transition-all duration-200 hover:scale-110 hover:bg-white/85 active:scale-95"
            style={{
              border: "1px solid rgba(0,0,0,0.15)",
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Youtube size={20} strokeWidth={1.5} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
