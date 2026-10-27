import { useEffect } from "react";
import { useMotionValue, useReducedMotion, useSpring, type MotionValue } from "framer-motion";

// Pointer position across the viewport, normalized to -0.5..0.5 and smoothed
// with a soft spring. Stays at 0 on touch devices and for reduced-motion users.
export function useCursorParallax(): { x: MotionValue<number>; y: MotionValue<number> } {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  // Soft, smoothed spring so the aurora *drifts* toward the cursor with an
  // organic lag rather than snapping to it — snapping reads as a shadow glued
  // under the pointer. The liveliness comes from the ambient keyframe drift
  // plus the per-layer depth below, not from tracking the cursor quickly.
  const x = useSpring(rawX, { stiffness: 55, damping: 20, mass: 1 });
  const y = useSpring(rawY, { stiffness: 55, damping: 20, mass: 1 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };
    // Ease back to center when the pointer leaves, so there's no stuck idle pose.
    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, rawX, rawY]);

  return { x, y };
}
