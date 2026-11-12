import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "./SectionLabel";
import { education, organizational, professional, type Entry } from "@/data/cv";

const ACCENT = "#86A397";
const ease = [0.16, 1, 0.3, 1] as const;

type Skill = { name: string; entries: Entry[] };

function useSkills(): Skill[] {
  return useMemo(() => {
    const map = new Map<string, Entry[]>();
    for (const entry of [...professional, ...organizational, ...education]) {
      for (const tool of entry.tools ?? []) {
        map.set(tool, [...(map.get(tool) ?? []), entry]);
      }
    }
    return [...map.entries()]
      .map(([name, entries]) => ({ name, entries }))
      .sort((a, b) => b.entries.length - a.entries.length || a.name.localeCompare(b.name));
  }, []);
}

const sizeFor = (uses: number) =>
  uses >= 3
    ? "text-[17px] px-4 py-2"
    : uses === 2
      ? "text-[15px] px-3.5 py-1.5"
      : "text-[13px] px-3 py-1.5";

export function SkillsSection() {
  const skills = useSkills();
  const [selected, setSelected] = useState(skills[0]?.name ?? "");
  const current = skills.find((s) => s.name === selected);

  return (
    <section
      id="skills"
      className="relative px-6 md:px-10 py-24"
      style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionLabel>Toolkit</SectionLabel>
        <div className="grid md:grid-cols-5 gap-10 md:gap-12">
          <div className="md:col-span-3">
            <p className="text-[15px] mb-6" style={{ color: "rgba(0,0,0,0.65)" }}>
              Pick a tool to see where I have actually used it.
            </p>
            <div className="flex flex-wrap gap-2.5" role="listbox" aria-label="Tools">
              {skills.map((s) => {
                const isOn = s.name === selected;
                return (
                  <button
                    key={s.name}
                    type="button"
                    role="option"
                    aria-selected={isOn}
                    onClick={() => setSelected(s.name)}
                    className={`relative rounded-full font-medium transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${sizeFor(
                      s.entries.length,
                    )}`}
                    style={{
                      border: `1px solid ${isOn ? ACCENT : "rgba(0,0,0,0.12)"}`,
                      background: isOn ? ACCENT : "rgba(255,255,255,0.6)",
                      color: isOn ? "#0a0a0a" : "rgba(0,0,0,0.75)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {s.name}
                    {s.entries.length > 1 && (
                      <span
                        className="ml-1.5 text-[11px] tabular-nums"
                        style={{ opacity: isOn ? 0.75 : 0.5 }}
                      >
                        ×{s.entries.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-2" aria-live="polite">
            <AnimatePresence mode="wait">
              {current && (
                <motion.div
                  key={current.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease }}
                  className="rounded-2xl p-6"
                  style={{
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className="text-[12px] uppercase mb-4"
                    style={{ letterSpacing: "0.12em", color: "rgba(0,0,0,0.5)" }}
                  >
                    {current.name} in practice
                  </div>
                  <ul className="space-y-5">
                    {current.entries.map((e) => (
                      <li key={e.title}>
                        <div className="flex items-start gap-1.5">
                          {e.href ? (
                            <a
                              href={e.href}
                              target="_blank"
                              rel="noreferrer"
                              className="group inline-flex items-start gap-1 text-[15px] font-semibold text-foreground leading-snug hover:[color:#86A397]"
                            >
                              {e.title}
                              <ArrowUpRight
                                size={14}
                                className="mt-1 shrink-0 opacity-50 group-hover:opacity-100"
                              />
                            </a>
                          ) : (
                            <span className="text-[15px] font-semibold text-foreground leading-snug">
                              {e.title}
                            </span>
                          )}
                        </div>
                        {e.date && (
                          <div className="text-[12px] mt-0.5" style={{ color: "rgba(0,0,0,0.5)" }}>
                            {e.date}
                          </div>
                        )}
                        {e.bullets?.[0] && (
                          <p
                            className="text-[14px] leading-relaxed mt-1.5"
                            style={{ color: "rgba(0,0,0,0.72)" }}
                          >
                            {e.bullets[0]}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
