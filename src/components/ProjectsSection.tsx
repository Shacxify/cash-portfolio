import { useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { SectionLabel } from "./SectionLabel";
import { projects, type Project } from "@/data/projects";
import vntg from "@/assets/projects/vntg-os-cover-2.png";
import sammys from "@/assets/projects/sammys-source-cover-2.png";
import markowitz from "@/assets/projects/markowitz-cover-2.png";
import linkedup from "@/assets/projects/linkedup-cover-2.png";
import stanley from "@/assets/projects/stanley-cover-2.png";
import linkedinLearning from "@/assets/projects/linkedin-learning-cover-2.png";
import adobe from "@/assets/projects/adobe-ralph-lauren-cover-2.png";

const covers: Record<string, string> = {
  "VNTG OS": vntg,
  "Sammy's Source": sammys,
  "Markowitz Investment": markowitz,
  LinkedUp: linkedup,
  "Stanley 1913": stanley,
  "LinkedIn Learning": linkedinLearning,
  "Adobe Cloud for Ralph Lauren": adobe,
};

const ease = [0.16, 1, 0.3, 1] as const;
const MAX_TILT_DEG = 6;

// Classes that apply on hover (mouse) or once a card is tapped open (touch).
const SHOW = "group-hover:opacity-100 group-data-[revealed=true]:opacity-100";
const HIDE = "group-hover:opacity-0 group-data-[revealed=true]:opacity-0";

function ProjectCard({
  project: p,
  index,
  isOrphan,
  revealed,
  onReveal,
}: {
  project: Project;
  index: number;
  isOrphan: boolean;
  revealed: boolean;
  onReveal: () => void;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const rotateX = useSpring(rotX, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(rotY, { stiffness: 200, damping: 20 });

  const onPointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    // Spotlight position is a CSS variable so moving it never re-renders React.
    ref.current.style.setProperty("--spot-x", `${px * 100}%`);
    ref.current.style.setProperty("--spot-y", `${py * 100}%`);
    if (reduce) return;
    rotY.set((px - 0.5) * 2 * MAX_TILT_DEG);
    rotX.set(-(py - 0.5) * 2 * MAX_TILT_DEG);
  };

  const onPointerLeave = () => {
    rotX.set(0);
    rotY.set(0);
  };

  // On touch screens there is no hover, so the first tap reveals the details
  // and the second tap follows the link.
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!revealed && window.matchMedia("(hover: none)").matches) {
      e.preventDefault();
      onReveal();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.06, ease }}
      className={isOrphan ? "sm:col-span-2 sm:mx-auto sm:w-1/2" : ""}
      style={{ perspective: 1000 }}
    >
      <motion.a
        ref={ref}
        href={p.href}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onClick={onClick}
        data-revealed={revealed}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative block overflow-hidden rounded-2xl bg-black shadow-sm transition-shadow duration-500 hover:shadow-2xl"
      >
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={covers[p.title]}
            alt={`${p.title} project cover - ${p.tag}`}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-40 group-data-[revealed=true]:opacity-40"
          />
        </div>

        {/* Base gradient - always subtle so title/badge are legible */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${HIDE}`}
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)",
          }}
        />

        {/* Hover overlay - deeper wash so the description reads cleanly */}
        <div
          className={`absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 ${SHOW}`}
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.78) 45%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Cursor spotlight, tinted with the project's accent */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${p.accent}40, transparent 60%)`,
            mixBlendMode: "screen",
          }}
        />

        <div className="absolute top-4 right-4">
          <span className="text-[11px] tabular-nums text-white/80">{p.year}</span>
        </div>

        {/* Default state - title + badge only, anchored bottom-left */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-5 md:p-6 transition-all duration-500 group-hover:translate-y-2 ${HIDE}`}
        >
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium mb-2"
            style={{
              background: p.accent,
              color: p.accent === "#361D2E" ? "#fff" : "#0a0a0a",
            }}
          >
            {p.tag}
          </span>
          <h3 className="text-lg md:text-xl font-semibold text-white tracking-tight">{p.title}</h3>
          <span className="mt-1 block text-[11px] text-white/60 [@media(hover:hover)]:hidden">
            Tap for details
          </span>
        </div>

        {/* Hover state - full context, centered vertically */}
        <div
          className={`absolute inset-0 flex flex-col justify-center p-6 md:p-8 opacity-0 translate-y-3 transition-all duration-500 group-hover:translate-y-0 group-data-[revealed=true]:translate-y-0 ${SHOW}`}
        >
          <span
            className="inline-block self-start rounded-full px-2.5 py-0.5 text-[10px] font-medium mb-3"
            style={{
              background: p.accent,
              color: p.accent === "#361D2E" ? "#fff" : "#0a0a0a",
            }}
          >
            {p.tag}
          </span>
          <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight">{p.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/90 max-w-md">{p.description}</p>
          <span className="mt-4 text-[12px] uppercase tracking-[0.15em] text-white/70">
            <span className="[@media(hover:none)]:hidden">View project →</span>
            <span className="[@media(hover:hover)]:hidden">Tap again to open →</span>
          </span>
        </div>
      </motion.a>
    </motion.div>
  );
}

export function ProjectsSection() {
  const [revealed, setRevealed] = useState<string | null>(null);

  return (
    <section id="work" className="relative px-6 md:px-10 py-24">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>Featured Work</SectionLabel>
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((p, i) => (
            <ProjectCard
              key={p.title}
              project={p}
              index={i}
              isOrphan={i === projects.length - 1 && projects.length % 2 === 1}
              revealed={revealed === p.title}
              onReveal={() => setRevealed(p.title)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
