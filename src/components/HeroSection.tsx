import { motion } from "framer-motion";
import { ArrowUpRight, Layers, Linkedin, User } from "lucide-react";


const ease = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-start overflow-hidden px-6 md:px-10 pt-32"
    >
      {/* Inline aurora blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute aurora-blob-1"
          style={{
            top: 0,
            right: 0,
            width: "700px",
            height: "700px",
            background: "radial-gradient(circle, #E1B07E 0%, #E5BE9E 60%, transparent 70%)",
            filter: "blur(60px)",
            opacity: 0.35,
            transform: "translate(20%, -25%)",
          }}
        />
        <div
          className="absolute aurora-blob-2"
          style={{
            top: 0,
            left: 0,
            width: "550px",
            height: "550px",
            background: "radial-gradient(circle, #86A397 0%, #CBC0AD 60%, transparent 70%)",
            filter: "blur(70px)",
            opacity: 0.3,
            transform: "translate(-20%, -20%)",
          }}
        />
        <div
          className="absolute aurora-blob-3"
          style={{
            bottom: 0,
            right: 0,
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, #361D2E 0%, #86A397 60%, transparent 70%)",
            filter: "blur(80px)",
            opacity: 0.25,
            transform: "translate(15%, 20%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full text-left">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="font-bold tracking-tight text-foreground text-balance"
          style={{
            fontSize: "clamp(2.25rem, 5.4vw, 5rem)",
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
          }}
        >
          Hi, I'm Cash Johnson. I'm a{" "}
          <span style={{ color: "#86A397" }}>Strategic Growth Architect</span>{" "}
          based in Silicon Valley.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <a
            href="#work"
            className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[15px] font-medium text-foreground transition-all hover:bg-white/80"
            style={{
              border: "1px solid rgba(0,0,0,0.15)",
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Layers size={18} strokeWidth={1.5} />
            Featured Work
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[15px] font-medium text-foreground transition-all hover:bg-white/80"
            style={{
              border: "1px solid rgba(0,0,0,0.15)",
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Linkedin size={18} strokeWidth={1.5} />
            LinkedIn <ArrowUpRight size={16} />
          </a>
          <a
            href="#cv"
            className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[15px] font-medium text-foreground transition-all hover:bg-white/80"
            style={{
              border: "1px solid rgba(0,0,0,0.15)",
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(12px)",
            }}
          >
            <User size={18} strokeWidth={1.5} />
            More About Me <ArrowUpRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
