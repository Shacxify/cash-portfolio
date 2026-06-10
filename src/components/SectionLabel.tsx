import { motion } from "framer-motion";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="uppercase mb-8 inline-flex items-center gap-3"
      style={{
        fontSize: "12px",
        letterSpacing: "0.2em",
        color: "rgba(0,0,0,0.72)",
        fontWeight: 600,
      }}
    >
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="block h-px origin-left"
        style={{ width: "28px", background: "#86A397" }}
      />
      {children}
    </motion.h2>
  );
}
