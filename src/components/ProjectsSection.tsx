import { motion } from "framer-motion";
import { SectionLabel } from "./SectionLabel";
import vntg from "@/assets/projects/vntg-os-cover-2.png";
import sammys from "@/assets/projects/sammys-source-cover-2.png";
import markowitz from "@/assets/projects/markowitz-cover-2.png";
import linkedup from "@/assets/projects/linkedup-cover-2.png";
import stanley from "@/assets/projects/stanley-cover-2.png";
import linkedinLearning from "@/assets/projects/linkedin-learning-cover-2.png";
import adobe from "@/assets/projects/adobe-ralph-lauren-cover-2.png";

const projects = [
  {
    title: "VNTG OS",
    tag: "Inventory · E-commerce · AI",
    year: "2026",
    accent: "#86A397",
    description:
      "Two-sided retail platform for Black & Brown vintage consignment with an AI-powered resale pricing engine. Replaced 100% of pen-and-paper operations.",
    href: "https://bnb.cashjohnson.net",
    image: vntg,
  },
  {
    title: "Sammy's Source",
    tag: "AI · Product · Social Impact",
    year: "2026",
    accent: "#E1B07E",
    description:
      "AI-powered financial navigation for first-gen SJSU students. Led system-prompt architecture, urgency ranking, and multilingual fallback with peer-advisor oversight.",
    href: "/projects#sammys-source",
    image: sammys,
  },
  {
    title: "Markowitz Investment",
    tag: "Quant · Portfolio Optimization",
    year: "2026",
    accent: "#361D2E",
    description:
      "Mean-variance optimized portfolio across a 6-asset universe using GRG Nonlinear Solver. Delivered a 1.23 Sharpe Ratio at 46.5% expected return.",
    href: "/projects#markowitz",
    image: markowitz,
  },
  {
    title: "LinkedUp",
    tag: "Product · Competition Winner",
    year: "2026",
    accent: "#86A397",
    description:
      "Award-winning LinkedIn feature concept for the SJSU PM Club. Opt-in proximity-based contextual connections, privacy-first by default.",
    href: "/projects#linkedup",
    image: linkedup,
  },
  {
    title: "Stanley 1913",
    tag: "Brand Strategy · Research",
    year: "2025",
    accent: "#E1B07E",
    description:
      "Marketing performance evaluation and brand case study layering consumer trends, regulatory pressure, and competitive dynamics into a growth thesis.",
    href: "/projects#stanley-1913",
    image: stanley,
  },
  {
    title: "LinkedIn Learning",
    tag: "Market Analysis · Campus GTM",
    year: "2025",
    accent: "#361D2E",
    description:
      "Segmented campus targeting model for SJSU LinkedIn Campus Ambassadors. Drove a 67% lift in workshop participation and 2.6x ambassador-led engagement.",
    href: "/projects#linkedin-learning",
    image: linkedinLearning,
  },
  {
    title: "Adobe Cloud for Ralph Lauren",
    tag: "Experience Strategy",
    year: "2024",
    accent: "#86A397",
    description:
      "Adobe Experience Cloud strategy spanning analytics, personalization, and omnichannel engagement. Projected 28% campaign efficiency lift and 2.1x targeting precision.",
    href: "/projects#adobe-ralph-lauren",
    image: adobe,
  },
];

export function ProjectsSection() {
  return (
    <section id="work" className="relative px-6 md:px-10 py-24">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>Featured Work</SectionLabel>
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((p, i) => {
            const isOrphan =
              i === projects.length - 1 && projects.length % 2 === 1;
            return (
              <motion.a
                key={p.title}
                href={p.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative block overflow-hidden rounded-2xl bg-black ${
                  isOrphan ? "sm:col-span-2 sm:mx-auto sm:w-1/2" : ""
                }`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={p.image}
                    alt={`${p.title} project cover - ${p.tag}`}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-40"
                  />
                </div>

                {/* Base gradient - always subtle so title/badge are legible */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-500 group-hover:opacity-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)",
                  }}
                />

                {/* Hover overlay - deeper wash so the description reads cleanly */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.78) 45%, rgba(0,0,0,0.55) 100%)",
                  }}
                />

                <div className="absolute top-4 right-4">
                  <span className="text-[11px] tabular-nums text-white/80">
                    {p.year}
                  </span>
                </div>

                {/* Default state - title + badge only, anchored bottom-left */}
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-2">
                  <span
                    className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium mb-2"
                    style={{
                      background: p.accent,
                      color: p.accent === "#361D2E" ? "#fff" : "#0a0a0a",
                    }}
                  >
                    {p.tag}
                  </span>
                  <h3 className="text-lg md:text-xl font-semibold text-white tracking-tight">
                    {p.title}
                  </h3>
                </div>

                {/* Hover state - full context, centered vertically */}
                <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-8 opacity-0 translate-y-3 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  <span
                    className="inline-block self-start rounded-full px-2.5 py-0.5 text-[10px] font-medium mb-3"
                    style={{
                      background: p.accent,
                      color: p.accent === "#361D2E" ? "#fff" : "#0a0a0a",
                    }}
                  >
                    {p.tag}
                  </span>
                  <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/90 max-w-md">
                    {p.description}
                  </p>
                  <span className="mt-4 text-[12px] uppercase tracking-[0.15em] text-white/70">
                    View project →
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
