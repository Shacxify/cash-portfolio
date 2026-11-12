import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left pointer-events-none"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #86A397, #E1B07E)",
      }}
    />
  );
}
