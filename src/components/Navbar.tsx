import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, X } from "lucide-react";
import { OPEN_PALETTE_EVENT } from "@/lib/site";

const links = [
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "CV", href: "#cv" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "#contact" },
];

// Sections tracked for the active-link highlight. Contact sits inside the CV
// section, so it is left out to keep "CV" lit while reading the timeline.
const SPY_IDS = ["work", "skills", "cv"];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 80);
      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const id of SPY_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openPalette = () => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -10 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6 md:px-10 pointer-events-none"
      style={{
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      <div
        className={`flex items-center justify-between w-full max-w-6xl mx-auto ${
          visible ? "pointer-events-auto" : ""
        }`}
      >
        <a href="#top" className="text-[14px] font-semibold tracking-tight text-foreground">
          Cash Johnson
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const isActive = l.href === `#${active}`;
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isActive ? "location" : undefined}
                className="relative text-[14px] transition-colors hover:text-foreground"
                style={{ color: isActive ? "#0a0a0a" : "rgba(0,0,0,0.7)" }}
              >
                {l.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute -bottom-1.5 left-0 right-0 h-[2px] rounded-full"
                    style={{ background: "#86A397" }}
                  />
                )}
              </a>
            );
          })}
          <button
            type="button"
            onClick={openPalette}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] transition-colors hover:bg-white"
            style={{ border: "1px solid rgba(0,0,0,0.12)", color: "rgba(0,0,0,0.6)" }}
            aria-label="Open quick search"
          >
            <Search size={13} />
            <kbd className="font-sans">{isMac ? "⌘K" : "Ctrl K"}</kbd>
          </button>
        </div>
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 pointer-events-auto"
            style={{ background: "rgba(250,250,249,0.97)", backdropFilter: "blur(20px)" }}
          >
            <button
              className="absolute top-4 right-6 text-foreground"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-3xl font-light text-foreground"
              >
                {l.label}
              </a>
            ))}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openPalette();
                }}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[15px]"
                style={{ border: "1px solid rgba(0,0,0,0.15)" }}
              >
                <Search size={16} /> Search
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
