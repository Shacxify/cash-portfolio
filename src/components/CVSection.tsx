import { motion } from "framer-motion";
import { ArrowUpRight, GraduationCap, Briefcase, Users, type LucideIcon } from "lucide-react";
import { SectionLabel } from "./SectionLabel";

type Entry = {
  date: string;
  title: string;
  subtitle?: string;
  location?: string;
  href?: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

const education: Entry[] = [
  {
    date: "Aug 2022 — Dec 2026",
    title: "San José State University",
    subtitle: "B.S. Business Administration, MIS · GPA 3.52",
    location: "San José, California",
    href: "https://www.sjsu.edu/",
  },
];

const professional: Entry[] = [
  {
    date: "May 2025 — Present",
    title: "Operations PM Intern @ Centene",
    subtitle: "Remote · Enterprise Operations",
    location: "Remote",
    href: "https://www.centene.com/",
  },
  {
    date: "Jan 2025 — Present",
    title: "Events Director @ LinkedIn",
    subtitle: "Campus Ambassador Program",
    location: "Sunnyvale, California",
    href: "https://www.linkedin.com/",
  },
  {
    date: "Jun 2025 — Jan 2026",
    title: "Director of Event Ops @ The Intern Ship",
    subtitle: "Partnerships & National Programming",
    location: "Remote",
    href: "https://www.theintern.ship/",
  },
];

const organizational: Entry[] = [
  {
    date: "Jul 2024 — Dec 2025",
    title: "President @ SJSU Marketing Association",
    subtitle: "Lucas College of Business",
    location: "San José, California",
    href: "https://www.linkedin.com/company/sjsu-marketing-association/",
  },
  {
    date: "2024 — Present",
    title: "Event Consultant @ Fashion Club SJSU",
    location: "San José, California",
  },
  {
    date: "2023 — 2024",
    title: "Student Affiliate @ Entrepreneurship Club",
    subtitle: "West Valley College",
    location: "Saratoga, California",
  },
  {
    date: "2023 — 2024",
    title: "Merit Scholar @ Alpha Gamma Sigma",
    location: "Saratoga, California",
  },
];

const ACCENT = "#86A397";

function EntryRow({ entry, index }: { entry: Entry; index: number }) {
  const inner = (
    <div className="relative pl-5 py-1">
      {/* left accent line */}
      <span
        className="absolute left-0 top-1.5 bottom-1.5 w-px transition-all duration-300 group-hover:w-[2px]"
        style={{ background: "rgba(0,0,0,0.12)" }}
      />
      <span
        className="absolute left-0 top-1.5 w-px origin-top scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100"
        style={{ background: ACCENT, height: "calc(100% - 12px)", width: "2px" }}
      />
      <div
        className="text-[12px] uppercase tracking-wider mb-1.5 transition-colors duration-300"
        style={{ color: "rgba(0,0,0,0.55)", letterSpacing: "0.08em" }}
      >
        {entry.date}
      </div>
      <div className="flex items-start gap-1.5">
        <div className="text-[15px] font-semibold text-foreground leading-snug transition-colors duration-300 group-hover:[color:#86A397]">
          {entry.title}
        </div>
        {entry.href && (
          <ArrowUpRight
            size={15}
            strokeWidth={2}
            className="mt-1 shrink-0 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:[color:#86A397]"
          />
        )}
      </div>
      {entry.subtitle && (
        <div className="text-[14px] mt-1" style={{ color: "rgba(0,0,0,0.72)" }}>
          {entry.subtitle}
        </div>
      )}
      {entry.location && (
        <div className="text-[13px] mt-1.5" style={{ color: "rgba(0,0,0,0.55)" }}>
          {entry.location}
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease }}
    >
      {entry.href ? (
        <a
          href={entry.href}
          target="_blank"
          rel="noreferrer"
          className="group block rounded-md -mx-3 px-3 py-2 transition-colors duration-300 hover:bg-black/[0.025]"
        >
          {inner}
        </a>
      ) : (
        <div className="group block rounded-md -mx-3 px-3 py-2">{inner}</div>
      )}
    </motion.div>
  );
}

function Column({
  heading,
  entries,
  Icon,
}: {
  heading: string;
  entries: Entry[];
  Icon: LucideIcon;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease }}
    >
      <div className="flex items-center gap-2.5 mb-8 pb-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <span
          className="inline-flex items-center justify-center rounded-full"
          style={{
            width: 28,
            height: 28,
            background: "rgba(134,163,151,0.14)",
            color: ACCENT,
          }}
        >
          <Icon size={15} strokeWidth={1.75} />
        </span>
        <h2 className="text-[15px] font-semibold text-foreground">{heading}</h2>
      </div>
      <div className="space-y-6">
        {entries.map((e, i) => (
          <EntryRow key={e.title + i} entry={e} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

export function CVSection() {
  return (
    <section
      id="cv"
      className="relative px-6 md:px-10 py-24"
      style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionLabel>About</SectionLabel>
        {/* Profile + Contact row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="grid md:grid-cols-3 gap-10 md:gap-12 pb-16"
        >
          <div className="md:col-span-2">
            <h2 className="text-[15px] font-semibold text-foreground mb-6">Profile</h2>
            <p
              className="text-[17px] md:text-[18px] leading-relaxed max-w-xl"
              style={{ color: "rgba(0,0,0,0.78)" }}
            >
              Cash Johnson is a Silicon Valley–based growth operator working at
              the intersection of operations, partnerships, and go-to-market.
              He's currently building at Centene and leading campus events for
              LinkedIn while studying Business MIS at San José State.
            </p>
          </div>
          <div id="contact">
            <h2 className="text-[15px] font-semibold text-foreground mb-6">Contact</h2>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:cash@example.com"
                className="group inline-flex items-center gap-1.5 text-[17px] md:text-[18px] transition-colors hover:[color:#86A397]"
                style={{ color: "rgba(0,0,0,0.78)" }}
              >
                Email me
                <ArrowUpRight
                  size={18}
                  className="opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                />
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1.5 text-[17px] md:text-[18px] transition-colors hover:[color:#86A397]"
                style={{ color: "rgba(0,0,0,0.78)" }}
              >
                LinkedIn
                <ArrowUpRight
                  size={18}
                  className="opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Three-column CV grid */}
        <div className="pt-12" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <SectionLabel>Curriculum Vitae</SectionLabel>
          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            <Column heading="Education" entries={education} Icon={GraduationCap} />
            <Column heading="Professional Experience" entries={professional} Icon={Briefcase} />
            <Column heading="Organizational Experience" entries={organizational} Icon={Users} />
          </div>
        </div>
      </div>
    </section>
  );
}
