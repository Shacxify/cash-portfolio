import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "./SectionLabel";

const projects = [
  {
    title: "Growth Ops Playbook",
    tag: "Internal Tooling",
    year: "2026",
    description:
      "A reusable framework for tracking cross-functional initiatives, owners, and outcomes — adopted across multiple student-led orgs.",
    href: "#",
  },
  {
    title: "Campus Activation Kit",
    tag: "Event Strategy",
    year: "2025",
    description:
      "Modular event runbook used to scale LinkedIn campus programming across 6+ Bay Area universities.",
    href: "#",
  },
  {
    title: "Intern Pipeline Map",
    tag: "Research",
    year: "2025",
    description:
      "Data-driven map of early-career talent flows between Bay Area schools and Fortune 500 internship programs.",
    href: "#",
  },
  {
    title: "Marketing Assoc. Rebrand",
    tag: "Brand · Identity",
    year: "2024",
    description:
      "Led the visual and verbal refresh of the SJSU Marketing Association, doubling member retention year over year.",
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
                  style={{ color: "rgba(0,0,0,0.45)" }}
                >
                  {p.tag}
                </span>
                <span
                  className="text-[11px] tabular-nums"
                  style={{ color: "rgba(0,0,0,0.45)" }}
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
                  style={{ color: "rgba(0,0,0,0.6)" }}
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
