import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SIZE = 520;

// A soft aurora-colored glow that trails the cursor across the page. It only
// moves when the visitor moves, so it stays on even with reduced motion; it is
// skipped entirely on touch screens where there is no cursor to follow.
export function CursorGlow() {
  const rawX = useMotionValue(-SIZE);
  const rawY = useMotionValue(-SIZE);
  const opacity = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 120, damping: 22, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 120, damping: 22, mass: 0.6 });
  const fade = useSpring(opacity, { stiffness: 80, damping: 20 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      rawX.set(e.clientX - SIZE / 2);
      rawY.set(e.clientY - SIZE / 2);
      opacity.set(1);
    };
    const onLeave = () => opacity.set(0);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [rawX, rawY, opacity]);

  return (
    <motion.div
      aria-hidden
      className="absolute left-0 top-0 rounded-full"
      style={{
        x,
        y,
        opacity: fade,
        width: SIZE,
        height: SIZE,
        background:
          "radial-gradient(circle, rgba(134,163,151,0.55) 0%, rgba(225,176,126,0.35) 45%, transparent 70%)",
        filter: "blur(50px)",
      }}
    />
  );
}
