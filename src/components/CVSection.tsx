import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "./SectionLabel";

type Row = { date: string; role: string; org: string; location?: string };

const education: Row[] = [
  {
    date: "Aug 2022 – Dec 2026",
    role: "B.S. Business Administration, MIS",
    org: "San José State University · GPA 3.52",
    location: "San José, CA",
  },
];

const professional: Row[] = [
  {
    date: "May 2025 – Present",
    role: "Operations Project Management Intern",
    org: "Centene Corporation",
    location: "Remote",
  },
  {
    date: "Jan 2025 – Present",
    role: "Events Director",
    org: "LinkedIn Campus Ambassador Program",
    location: "Sunnyvale, CA",
  },
  {
    date: "Jun 2025 – Jan 2026",
    role: "Director of Event Operations",
    org: "The Intern Ship",
    location: "Remote",
  },
];

const organizational: Row[] = [
  {
    date: "Jul 2024 – Dec 2025",
    role: "President",
    org: "SJSU Marketing Association",
    location: "San José, CA",
  },
  {
    date: "2024 – Present",
    role: "Event Consultant",
    org: "Fashion Club SJSU",
    location: "San José, CA",
  },
  {
    date: "2023 – 2024",
    role: "Student Affiliate",
    org: "Entrepreneurship Club WVC",
    location: "Saratoga, CA",
  },
  {
    date: "2023 – 2024",
    role: "Merit Scholar",
    org: "Alpha Gamma Sigma",
    location: "Saratoga, CA",
  },
];

function CVGroup({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <div className="mb-12">
      <h3 className="text-[13px] font-semibold uppercase tracking-wider mb-4 text-foreground">
        {title}
      </h3>
      <div>
        {rows.map((r, i) => (
          <motion.div
            key={r.role + i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-start py-5"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
          >
            <div
              className="md:w-48 shrink-0 mb-1 md:mb-0"
              style={{ fontSize: "12px", color: "rgba(0,0,0,0.4)" }}
            >
              {r.date}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-foreground">{r.role}</div>
              <div style={{ color: "rgba(0,0,0,0.6)" }} className="text-[15px]">
                {r.org}
              </div>
              {r.location && (
                <div style={{ fontSize: "12px", color: "rgba(0,0,0,0.4)" }} className="mt-0.5">
                  {r.location}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function CVSection() {
  return (
    <section id="cv" className="relative px-6 md:px-10 py-24">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>Profile</SectionLabel>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 max-w-4xl"
          style={{
            fontSize: "clamp(1.5rem, 3vw, 1.875rem)",
            fontWeight: 300,
            lineHeight: 1.4,
            letterSpacing: "-0.01em",
          }}
        >
          <p>
            I architect growth at the intersection of operations, partnerships, and go-to-market
            strategy — turning ambitious ideas into measurable outcomes.
          </p>
          <p>
            Currently building at Centene and leading campus events for LinkedIn, while studying
            Business MIS at San José State.
          </p>
        </motion.div>

        <div id="contact" className="mt-16">
          <SectionLabel>Contact</SectionLabel>
          <div
            className="flex flex-wrap gap-x-10 gap-y-4"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 1.875rem)",
              fontWeight: 300,
              lineHeight: 1.4,
            }}
          >
            <a
              href="mailto:cash@example.com"
              className="inline-flex items-center gap-2 transition-colors hover:[color:#86A397]"
            >
              Email me <ArrowUpRight className="opacity-60" size={20} />
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:[color:#86A397]"
            >
              LinkedIn <ArrowUpRight className="opacity-60" size={20} />
            </a>
          </div>
        </div>

        <div className="mt-20">
          <SectionLabel>Curriculum Vitae</SectionLabel>
          <CVGroup title="Education" rows={education} />
          <CVGroup title="Professional Experience" rows={professional} />
          <CVGroup title="Organizational Experience" rows={organizational} />
        </div>
      </div>
    </section>
  );
}
