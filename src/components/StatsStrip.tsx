import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";

const stats = [
  {
    value: 25000,
    suffix: "+",
    label: "Event attendees",
    detail: "Across LinkedIn campus career events, all delivered on time",
  },
  {
    value: 50,
    suffix: "%",
    label: "Faster troubleshooting",
    detail: "From real-time dashboards rolled out to Centene PMs",
  },
  {
    value: 85,
    suffix: "%",
    label: "Pipeline converted",
    detail: "Of partner pipeline turned into active sponsorships",
  },
  {
    value: 72,
    suffix: "",
    label: "Officers led",
    detail: "Running SJSU's largest business organization on OKRs",
  },
];

const format = (n: number) => Math.round(n).toLocaleString("en-US");

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  // Server render shows the real number so crawlers and no-JS readers get it.
  const [display, setDisplay] = useState(value);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (reduce) return;
    setDisplay(0);
    setArmed(true);
  }, [reduce]);

  useEffect(() => {
    if (!armed || !inView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setDisplay,
    });
    return () => controls.stop();
  }, [armed, inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {format(display)}
      {suffix}
    </span>
  );
}

export function StatsStrip() {
  return (
    <section aria-label="Highlights" className="relative px-6 md:px-10 pb-8">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl p-5 md:p-6"
            style={{
              border: "1px solid rgba(0,0,0,0.08)",
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="font-bold tracking-tight text-foreground"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", letterSpacing: "-0.03em" }}
            >
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-1 text-[14px] font-semibold" style={{ color: "#86A397" }}>
              {s.label}
            </div>
            <p className="mt-1.5 text-[13px] leading-snug" style={{ color: "rgba(0,0,0,0.6)" }}>
              {s.detail}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
