import { useEffect } from "react";
import { useMotionValue, useReducedMotion, useSpring, type MotionValue } from "framer-motion";

// Pointer position across the viewport, normalized to -0.5..0.5 and smoothed
// with a soft spring. Stays at 0 on touch devices and for reduced-motion users.
export function useCursorParallax(): { x: MotionValue<number>; y: MotionValue<number> } {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 40, damping: 18, mass: 1 });
  const y = useSpring(rawY, { stiffness: 40, damping: 18, mass: 1 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, rawX, rawY]);

  return { x, y };
}
