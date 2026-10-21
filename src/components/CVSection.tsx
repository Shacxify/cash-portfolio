import { motion } from "framer-motion";
import {
  ArrowUpRight,
  GraduationCap,
  Briefcase,
  Award,
  Wrench,
  Sparkles,
  Copy,
  Coffee,
  FileDown,
  type LucideIcon,
} from "lucide-react";
import { SectionLabel } from "./SectionLabel";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { education, organizational, professional, type Entry } from "@/data/cv";
import { useCopyEmail } from "@/hooks/use-copy-email";
import {
  BOOKING_URL,
  COFFEE_CHAT_MAILTO,
  EMAIL,
  LINKEDIN_URL,
  OPEN_ASK_EVENT,
  RESUME_URL,
} from "@/lib/site";

const ease = [0.16, 1, 0.3, 1] as const;
const ACCENT = "#86A397";

const kitButton =
  "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-medium transition-all duration-200 hover:-translate-y-0.5 active:scale-95";

function ContactKit() {
  const copyEmail = useCopyEmail();
  return (
    <div className="mt-6 flex flex-col gap-2.5">
      <a
        href={BOOKING_URL || COFFEE_CHAT_MAILTO}
        target={BOOKING_URL ? "_blank" : undefined}
        rel={BOOKING_URL ? "noreferrer" : undefined}
        className={`${kitButton} text-white`}
        style={{ background: "#361D2E" }}
      >
        <Coffee size={16} strokeWidth={1.75} />
        Grab a coffee chat
      </a>
      <button
        type="button"
        onClick={copyEmail}
        className={kitButton}
        style={{ border: "1px solid rgba(0,0,0,0.15)", background: "rgba(255,255,255,0.6)" }}
      >
        <Copy size={16} strokeWidth={1.75} />
        Copy email
      </button>
      {RESUME_URL && (
        <a
          href={RESUME_URL}
          download
          className={kitButton}
          style={{ border: "1px solid rgba(0,0,0,0.15)", background: "rgba(255,255,255,0.6)" }}
        >
          <FileDown size={16} strokeWidth={1.75} />
          Download résumé
        </a>
      )}
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event(OPEN_ASK_EVENT))}
        className={kitButton}
        style={{ border: `1px solid ${ACCENT}`, background: "rgba(134,163,151,0.12)" }}
      >
        <Sparkles size={16} strokeWidth={1.75} />
        Ask my AI a question
      </button>
    </div>
  );
}

function DetailPanel({ entry }: { entry: Entry }) {
  return (
    <div className="w-full max-h-[min(640px,calc(100vh-2rem))] overflow-y-auto overflow-x-hidden p-5">
      <div
        className="text-[12px] uppercase tracking-wider mb-1.5"
        style={{ color: ACCENT, letterSpacing: "0.1em" }}
      >
        {entry.date}
      </div>
      <div className="break-words text-[17px] font-semibold text-foreground leading-snug mb-1.5">
        {entry.title}
      </div>
      {entry.subtitle && (
        <div className="break-words text-[14px] mb-4" style={{ color: "rgba(0,0,0,0.6)" }}>
          {entry.subtitle}
        </div>
      )}

      {entry.bullets && entry.bullets.length > 0 && (
        <ul className="space-y-2 mb-4">
          {entry.bullets.map((b, i) => (
            <li
              key={i}
              className="text-[14px] leading-relaxed flex min-w-0 gap-2.5"
              style={{ color: "rgba(0,0,0,0.78)" }}
            >
              <span
                className="mt-2 shrink-0 h-1.5 w-1.5 rounded-full"
                style={{ background: ACCENT }}
              />
              <span className="min-w-0 break-words">{b}</span>
            </li>
          ))}
        </ul>
      )}

      {entry.tools && entry.tools.length > 0 && (
        <div className="mb-4">
          <div
            className="flex items-center gap-1.5 text-[12px] uppercase tracking-wider mb-2"
            style={{ color: "rgba(0,0,0,0.5)", letterSpacing: "0.08em" }}
          >
            <Wrench size={12} strokeWidth={2} />
            Tools
          </div>
          <div className="flex flex-wrap gap-2">
            {entry.tools.map((t) => (
              <span
                key={t}
                className="inline-block max-w-full whitespace-normal break-words text-[12px] px-2.5 py-1 rounded-full"
                style={{ background: "rgba(134,163,151,0.14)", color: "rgba(0,0,0,0.72)" }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {entry.learned && entry.learned.length > 0 && (
        <div>
          <div
            className="flex items-center gap-1.5 text-[12px] uppercase tracking-wider mb-2"
            style={{ color: "rgba(0,0,0,0.5)", letterSpacing: "0.08em" }}
          >
            <Sparkles size={12} strokeWidth={2} />
            What I took away
          </div>
          <div className="flex flex-wrap gap-2">
            {entry.learned.map((t) => (
              <span
                key={t}
                className="inline-block max-w-full whitespace-normal break-words text-[12px] px-2.5 py-1 rounded-full border"
                style={{ borderColor: "rgba(0,0,0,0.1)", color: "rgba(0,0,0,0.7)" }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EntryRow({ entry, index }: { entry: Entry; index: number }) {
  const hasDetails =
    (entry.bullets && entry.bullets.length > 0) ||
    (entry.tools && entry.tools.length > 0) ||
    (entry.learned && entry.learned.length > 0);

  const inner = (
    <div className="relative pl-5 py-1">
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
      {hasDetails && (
        <div
          className="text-[11px] mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ color: ACCENT, letterSpacing: "0.08em" }}
        >
          HOVER FOR DETAILS →
        </div>
      )}
    </div>
  );

  const triggerClass =
    "group block rounded-md -mx-3 px-3 py-2 transition-colors duration-300 hover:bg-black/[0.025] cursor-pointer";

  const trigger = entry.href ? (
    <a href={entry.href} target="_blank" rel="noreferrer" className={triggerClass}>
      {inner}
    </a>
  ) : (
    <div className={triggerClass}>{inner}</div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease }}
    >
      {hasDetails ? (
        <HoverCard openDelay={120} closeDelay={80}>
          <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
          <HoverCardContent
            side="right"
            align="start"
            sideOffset={12}
            collisionPadding={16}
            className="p-0 border border-black/10 shadow-2xl rounded-lg backdrop-blur-none overflow-hidden"
            style={{
              background: "#ffffff",
              width: "min(420px, calc(100vw - 32px))",
              maxWidth: "calc(100vw - 32px)",
            }}
          >
            <DetailPanel entry={entry} />
          </HoverCardContent>
        </HoverCard>
      ) : (
        trigger
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
      <div
        className="flex items-center gap-2.5 mb-8 pb-3"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
      >
        <span
          className="inline-flex items-center justify-center rounded-full"
          style={{ width: 28, height: 28, background: "rgba(134,163,151,0.14)", color: ACCENT }}
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="grid md:grid-cols-3 gap-10 md:gap-12 pb-16"
        >
          <div className="md:col-span-2">
            <h2 className="text-[15px] font-semibold text-foreground mb-6">Profile</h2>
            <div
              className="space-y-5 text-[17px] md:text-[18px] leading-relaxed max-w-xl"
              style={{ color: "rgba(0,0,0,0.78)" }}
            >
              <p>
                I’m <strong>Cash Johnson</strong>, a{" "}
                <strong>Silicon Valley operations and project manager</strong> who enjoys working
                where{" "}
                <strong>enterprise operations, partnerships, and go-to-market strategy</strong>{" "}
                meet. Give me an <strong>ambiguous, cross-functional problem</strong>, and I’ll turn
                it into a <strong>clear plan that can actually ship</strong>.
              </p>
              <p>
                I’m currently a <strong>Project Management Intern at Centene</strong>, where I’m
                learning how to move quickly and thoughtfully within a{" "}
                <strong>highly regulated healthcare environment</strong>. I also serve as{" "}
                <strong>Director of Events for LinkedIn’s SJSU Campus Ambassador program</strong>,
                leading events from <strong>initial idea through execution</strong>. Alongside that,
                I’m finishing my{" "}
                <strong>
                  B.S. in Business Administration with a concentration in Management Information
                  Systems at San José State University
                </strong>
                .
              </p>
              <p>
                I bring a{" "}
                <strong>business mindset, technical instincts, and a practical approach</strong> to
                getting things done. Outside of work and school, I’m usually{" "}
                <strong>
                  fishing, rock climbing, surfing, playing guitar, or making a mess with my
                  watercolor set
                </strong>
                .
              </p>
              <p>
                Go ahead and <strong>message me, let's go grab coffee</strong>! (-:
              </p>
            </div>
          </div>
          <div id="contact">
            <h2 className="text-[15px] font-semibold text-foreground mb-6">Contact</h2>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${EMAIL}`}
                className="group inline-flex items-center gap-1.5 text-[17px] md:text-[18px] transition-colors hover:[color:#86A397]"
                style={{ color: "rgba(0,0,0,0.78)" }}
              >
                Email
                <ArrowUpRight
                  size={18}
                  className="opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                />
              </a>
              <a
                href={LINKEDIN_URL}
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
            <ContactKit />
          </div>
        </motion.div>

        <div className="pt-12" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <SectionLabel>Curriculum Vitae</SectionLabel>
          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            <Column heading="Education" entries={education} Icon={GraduationCap} />
            <Column heading="Work Experience" entries={professional} Icon={Briefcase} />
            <Column heading="Projects & Honors" entries={organizational} Icon={Award} />
          </div>
        </div>
      </div>
    </section>
  );
}
