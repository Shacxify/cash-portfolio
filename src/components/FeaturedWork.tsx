import { motion } from "framer-motion";
import { SectionLabel } from "./SectionLabel";

const projects = [
  {
    title: "Centene Ops Tracker",
    tag: "Operations · Project Management",
    accent: "#86A397",
    description:
      "Built an internal operations dashboard streamlining cross-functional workflows for a Fortune 25 healthcare leader.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80&auto=format&fit=crop",
  },
  {
    title: "LinkedIn Campus Events",
    tag: "Events · GTM Strategy",
    accent: "#E1B07E",
    description:
      "Led campus-wide activations driving thousands of student touchpoints across Bay Area universities.",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80&auto=format&fit=crop",
  },
  {
    title: "The Intern Ship",
    tag: "Partnerships · Event Operations",
    accent: "#361D2E",
    description:
      "Directed national event operations and partnerships connecting students to top-tier opportunities.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=80&auto=format&fit=crop",
  },
];

export function FeaturedWork() {
  return (
    <section id="work" className="relative px-6 md:px-10 py-24">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>Featured Work</SectionLabel>
        <div className="grid gap-4">
          {projects.map((p, i) => (
            <motion.a
              key={p.title}
              href="#"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative block overflow-hidden rounded-2xl bg-black"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)",
                }}
              />
              <div className="absolute bottom-0 left-0 p-6 md:p-8 max-w-2xl">
                <span
                  className="inline-block rounded-full px-3 py-1 text-[11px] font-medium mb-3"
                  style={{
                    background: p.accent,
                    color: p.accent === "#361D2E" ? "#fff" : "#0a0a0a",
                  }}
                >
                  {p.tag}
                </span>
                <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm md:text-base text-white/75 max-w-xl">
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
