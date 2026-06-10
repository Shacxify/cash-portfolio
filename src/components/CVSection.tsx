import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type Entry = {
  date: string;
  title: string;
  subtitle?: string;
  location?: string;
};

const education: Entry[] = [
  {
    date: "Aug 2022 — Dec 2026",
    title: "San José State University",
    subtitle: "B.S. Business Administration, MIS · GPA 3.52",
    location: "San José, California",
  },
];

const professional: Entry[] = [
  {
    date: "May 2025 — Present",
    title: "Operations PM Intern @ Centene",
    subtitle: "Remote · Enterprise Operations",
    location: "Remote",
  },
  {
    date: "Jan 2025 — Present",
    title: "Events Director @ LinkedIn",
    subtitle: "Campus Ambassador Program",
    location: "Sunnyvale, California",
  },
  {
    date: "Jun 2025 — Jan 2026",
    title: "Director of Event Ops @ The Intern Ship",
    subtitle: "Partnerships & National Programming",
    location: "Remote",
  },
];

const organizational: Entry[] = [
  {
    date: "Jul 2024 — Dec 2025",
    title: "President @ SJSU Marketing Association",
    subtitle: "Lucas College of Business",
    location: "San José, California",
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

function Column({ heading, entries }: { heading: string; entries: Entry[] }) {
  return (
    <div>
      <h3 className="text-[15px] font-semibold text-foreground mb-8">{heading}</h3>
      <div className="space-y-8">
        {entries.map((e, i) => (
          <motion.div
            key={e.title + i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="text-[13px] mb-1.5"
              style={{ color: "rgba(0,0,0,0.65)" }}
            >
              {e.date}
            </div>
            <div className="text-[15px] font-semibold text-foreground leading-snug">
              {e.title}
            </div>
            {e.subtitle && (
              <div
                className="text-[14px] mt-1"
                style={{ color: "rgba(0,0,0,0.65)" }}
              >
                {e.subtitle}
              </div>
            )}
            {e.location && (
              <div
                className="text-[13px] mt-1.5 inline-flex items-center gap-1"
                style={{ color: "rgba(0,0,0,0.65)" }}
              >
                <span aria-hidden>📍</span>
                {e.location}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
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
        {/* Profile + Contact row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid md:grid-cols-3 gap-10 md:gap-12 pb-16"
        >
          <div className="md:col-span-2">
            <h3 className="text-[15px] font-semibold text-foreground mb-6">Profile</h3>
            <p
              className="text-[17px] md:text-[18px] leading-relaxed max-w-xl"
              style={{ color: "rgba(0,0,0,0.7)" }}
            >
              Cash Johnson is a Silicon Valley–based growth operator working at
              the intersection of operations, partnerships, and go-to-market.
              He's currently building at Centene and leading campus events for
              LinkedIn while studying Business MIS at San José State.
            </p>
          </div>
          <div id="contact">
            <h3 className="text-[15px] font-semibold text-foreground mb-6">Contact</h3>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:cash@example.com"
                className="inline-flex items-center gap-1.5 text-[17px] md:text-[18px] transition-colors hover:[color:#86A397]"
                style={{ color: "rgba(0,0,0,0.7)" }}
              >
                Email me <ArrowUpRight size={18} className="opacity-60" />
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[17px] md:text-[18px] transition-colors hover:[color:#86A397]"
                style={{ color: "rgba(0,0,0,0.7)" }}
              >
                LinkedIn <ArrowUpRight size={18} className="opacity-60" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Three-column CV grid */}
        <div
          className="grid md:grid-cols-3 gap-10 md:gap-12 pt-12"
          style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
        >
          <Column heading="Education" entries={education} />
          <Column heading="Professional Experience" entries={professional} />
          <Column heading="Organizational Experience" entries={organizational} />
        </div>
      </div>
    </section>
  );
}
