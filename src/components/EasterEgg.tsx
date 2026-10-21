import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { CELEBRATE_EVENT } from "@/lib/site";

const COLORS = ["#86A397", "#E1B07E", "#E5BE9E", "#361D2E", "#CBC0AD"];
const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
const WORD = "cash";

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  color: string;
};

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
}

// Hidden delight: the Konami code, typing "cash" anywhere on the page, or the
// "Celebrate" command fires a burst of confetti in the brand palette.
export function EasterEgg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runningRef = useRef(false);

  useEffect(() => {
    const burst = () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      toast("You found the easter egg 🎉", {
        description: "Thanks for poking around. Say hi: me@cashjohnson.net",
      });
      const canvas = canvasRef.current;
      if (reduce || !canvas || runningRef.current) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);

      const pieces: Piece[] = Array.from({ length: 180 }, (_, i) => {
        const fromLeft = i % 2 === 0;
        const angle = (fromLeft ? -60 : -120) * (Math.PI / 180) + (Math.random() - 0.5) * 0.9;
        const speed = 9 + Math.random() * 9;
        return {
          x: fromLeft ? 0 : window.innerWidth,
          y: window.innerHeight * 0.85,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.3,
          w: 6 + Math.random() * 6,
          h: 8 + Math.random() * 8,
          color: COLORS[i % COLORS.length],
        };
      });

      runningRef.current = true;
      const start = performance.now();
      const frame = (now: number) => {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        const t = now - start;
        for (const p of pieces) {
          p.vy += 0.25;
          p.vx *= 0.99;
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vr;
          ctx.save();
          ctx.globalAlpha = Math.max(0, 1 - t / 3500);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot * 2)));
          ctx.restore();
        }
        if (t < 3500) {
          requestAnimationFrame(frame);
        } else {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          runningRef.current = false;
        }
      };
      requestAnimationFrame(frame);
    };

    let konami = 0;
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target) || e.metaKey || e.ctrlKey) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

      // An extra "up" right after the opening pair still counts as that pair.
      konami = key === KONAMI[konami] ? konami + 1 : key === KONAMI[0] ? (konami === 2 ? 2 : 1) : 0;
      if (konami === KONAMI.length) {
        konami = 0;
        burst();
      }

      typed = (typed + (e.key.length === 1 ? key : " ")).slice(-WORD.length);
      if (typed === WORD) {
        typed = "";
        burst();
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener(CELEBRATE_EVENT, burst);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(CELEBRATE_EVENT, burst);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 z-[70] pointer-events-none"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
