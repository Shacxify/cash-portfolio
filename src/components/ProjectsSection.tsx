import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "./SectionLabel";

const projects = [
  {
    title: "VNTG OS",
    tag: "Inventory · E-commerce · AI",
    year: "2026",
    description:
      "Production-grade two-sided retail platform built from zero for Black & Brown vintage consignment - customer storefront plus staff portal with an AI-powered resale pricing engine. Replaced 100% of pen-and-paper operations.",
    href: "https://bnb.cashjohnson.net",
  },
  {
    title: "Sammy's Source",
    tag: "AI · Product · Social Impact",
    year: "2026",
    description:
      "AI-powered financial navigation for first-gen SJSU students. I led system-prompt architecture, urgency ranking, and language detection - turning a Spanish-language failure case into a multilingual fix with peer-advisor oversight.",
    href: "https://github.com/Shacxify/SJSU-SammysSource",
  },
  {
    title: "Markowitz Investment",
    tag: "Quant · Portfolio Optimization",
    year: "2026",
    description:
      "Mean-variance optimized portfolio across a 6-asset universe using GRG Nonlinear Solver and the Efficient Frontier. Delivered a 1.23 Sharpe Ratio at 46.5% expected return, validated against a 4% risk-free benchmark.",
    href: "#",
  },
  {
    title: "LinkedUp",
    tag: "Product · Competition Winner",
    year: "2026",
    description:
      "Award-winning LinkedIn feature concept for the SJSU PM Club Build-A-Feature competition. Opt-in proximity-based contextual connections, privacy-first by default. Judged as feeling like a feature LinkedIn should have already shipped.",
    href: "#",
  },
  {
    title: "Stanley 1913",
    tag: "Brand Strategy · Research",
    year: "2025",
    description:
      "Marketing performance evaluation and brand case study layering consumer trends, regulatory pressure, and competitive dynamics into a decision-ready growth thesis for Stanley 1913.",
    href: "#",
  },
  {
    title: "LinkedIn Learning",
    tag: "Market Analysis · Campus GTM",
    year: "2025",
    description:
      "Segmented campus targeting model for the SJSU LinkedIn Campus Ambassadors. Drove a 67% lift in workshop participation and a 2.6x increase in ambassador-led engagement.",
    href: "#",
  },
  {
    title: "Adobe Cloud for Ralph Lauren",
    tag: "Experience Strategy",
    year: "2024",
    description:
      "Adobe Experience Cloud strategy for Polo Ralph Lauren spanning analytics, personalization, and omnichannel engagement. Projected 28% campaign efficiency lift and 2.1x audience-targeting precision.",
    href: "#",
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="relative px-6 md:px-10 py-24">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>Projects</SectionLabel>
        <div
          className="grid sm:grid-cols-2 gap-px"
          style={{ background: "rgba(0,0,0,0.06)" }}
        >
          {projects.map((p, i) => (
            <motion.a
              key={p.title}
              href={p.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col justify-between p-7 md:p-9 min-h-[260px] transition-colors"
              style={{ background: "#FAFAF9" }}
            >
              <div className="flex items-start justify-between gap-6">
                <span
                  className="text-[11px] uppercase tracking-[0.14em]"
                  style={{ color: "rgba(0,0,0,0.72)" }}
                >
                  {p.tag}
                </span>
                <span
                  className="text-[11px] tabular-nums"
                  style={{ color: "rgba(0,0,0,0.72)" }}
                >
                  {p.year}
                </span>
              </div>

              <div className="mt-10">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-2xl md:text-[28px] font-semibold tracking-tight text-foreground">
                    {p.title}
                  </h3>
                  <ArrowUpRight
                    size={22}
                    className="shrink-0 opacity-40 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>
                <p
                  className="mt-3 text-[15px] leading-relaxed max-w-md"
                  style={{ color: "rgba(0,0,0,0.72)" }}
                >
                  {p.description}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
