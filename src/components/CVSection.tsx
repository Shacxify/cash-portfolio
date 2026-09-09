import { motion } from "framer-motion";
import { ArrowUpRight, GraduationCap, Briefcase, Award, Wrench, Sparkles, type LucideIcon } from "lucide-react";
import { SectionLabel } from "./SectionLabel";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

type Entry = {
  date: string;
  title: string;
  subtitle?: string;
  location?: string;
  href?: string;
  bullets?: string[];
  tools?: string[];
  learned?: string[];
};

const ease = [0.16, 1, 0.3, 1] as const;
const ACCENT = "#86A397";

const education: Entry[] = [
  {
    date: "",
    title: "San José State University",
    subtitle: "B.S. Business Administration, MIS · GPA 3.5",
    location: "San José, California",
    href: "https://www.sjsu.edu/",
    bullets: [
      "Lucas College of Business, Management Information Systems concentration.",
      "Coursework across systems analysis, data management, and enterprise operations.",
    ],
    tools: ["SQL", "Tableau", "Power BI", "Excel"],
    learned: ["Systems analysis & design", "Data-driven decision making"],
  },
  {
    date: "",
    title: "West Valley College",
    subtitle: "5 Associate Degrees: AS MIS, AST Economics, AA Liberal Arts (3 emphases)",
    location: "Saratoga, California",
    href: "https://www.westvalley.edu/",
    bullets: [
      "Completed five associate degrees in parallel across business, economics, and the liberal arts.",
      "Merit Scholar, Alpha Gamma Sigma Honors Society (2023–2024).",
    ],
    learned: ["Cross-disciplinary study", "Academic project management"],
  },
];

const professional: Entry[] = [
  {
    date: "May 2025 - Aug 2026",
    title: "Operations PM Intern @ Centene",
    subtitle: "St. Louis, MO · Hybrid · Enterprise Operations",
    location: "Hybrid",
    href: "https://www.centene.com/",
    bullets: [
      "Cut PM troubleshooting time by up to 50% by deploying real-time dashboards and standardized reporting.",
      "Selected as a core PM for Centene's Duals initiative, orchestrating healthcare plan operations across 9 states.",
      "Designed a Smartsheet Lessons Learned tracker adopted as the legacy operations model, slated for company-wide rollout.",
      "Aligned Compliance, IT, and Operations stakeholders to unblock execution and streamline workflows.",
    ],
    tools: ["Smartsheet", "Power BI", "Jira", "Confluence", "SharePoint"],
    learned: ["Enterprise PMO governance", "Cross-functional stakeholder alignment", "RAID & risk registers"],
  },
  {
    date: "Jun 2025 - Jan 2026",
    title: "Director of Operations @ The Intern Ship",
    subtitle: "Partnerships & National Programming",
    location: "San José, California",
    href: "https://internship.beehiiv.com/",
    bullets: [
      "Converted ~85% of a 20+ monthly partner pipeline into active sponsorships, driving GTM across 10+ event formats.",
      "Led flagship events (Tech Intern Bus Mixer, Intern Ship Games) drawing 300+ attendees at 90%+ venue capacity.",
      "Automated Power BI lead scoring; A/B tested email, Luma, and LinkedIn campaigns to lift partner conversion.",
    ],
    tools: ["Power BI", "Luma", "Salesforce", "Power Automate", "Excel"],
    learned: ["GTM pipeline management", "A/B testing & lead scoring", "Sponsorship negotiation"],
  },
  {
    date: "Jan 2025 - Aug 2026",
    title: "Director of Events @ LinkedIn Campus Ambassador Program",
    subtitle: "Promoted from LinkedIn Ambassador · SJSU",
    location: "San José, California",
    href: "https://sjsulinkedin.com/",
    bullets: [
      "Directed 6+ large-scale career events drawing 25,000+ collective attendees with 100% on-time delivery.",
      "Selected from 2,000+ applicants to help lead LinkedIn's student ambassador program at SJSU.",
      "Partnered directly with LinkedIn corporate stakeholders to align campus events with brand priorities.",
      "Improved event satisfaction scores by 25% through structured post-event feedback loops.",
    ],
    tools: ["LinkedIn Events", "Luma", "Notion", "Asana"],
    learned: ["Brand-partner alignment", "Event operations at scale", "Feedback-driven iteration"],
  },
  {
    date: "Aug 2020 - Jun 2024",
    title: "Project Manager @ San José Spotlight",
    subtitle: "Remote · Award-winning nonprofit newsroom",
    location: "San José, California (Remote)",
    href: "https://sanjosespotlight.com/",
    bullets: [
      "Managed content production for 4+ years, delivering every issue on deadline.",
      "Drove 24-hour editorial turnarounds across 4+ monthly stories with zero missed deadlines over a 4-year run.",
    ],
    tools: ["Asana", "Google Workspace", "Slack"],
    learned: ["Editorial project management", "Long-horizon reliability"],
  },
  {
    date: "Jan 2016 - Jun 2019",
    title: "Founder @ CodeMoney",
    subtitle: "Indie game studio · Shipped to App Store & Google Play",
    location: "San Francisco Bay Area, California",
    bullets: [
      "Built beCAREFUL, an endless hold-and-survive arcade game that generated $20K+ in 3 months post launch.",
      "Developed in C# on the Unity SDK, integrated social network and ad space APIs, shipped to App Store and Google Play.",
    ],
    tools: ["C#", "Unity", "App Store Connect", "Google Play Console"],
    learned: ["End-to-end product ownership", "Consumer app monetization"],
  },
];

const organizational: Entry[] = [
  {
    date: "Jul 2024 - Jan 2026",
    title: "President @ SJSU Marketing Association",
    subtitle: "Lucas College of Business · 250+ members, 45+ year legacy",
    location: "San José, California",
    href: "https://www.linkedin.com/company/sjsumarketingassociation/",
    bullets: [
      "Secured consulting engagements with Tesla, LinkedIn, and YC startups, generating 200+ client data points.",
      "Led SJSU's largest business organization, directing a 72-person officer team via OKRs.",
      "Coached 20 consultants on client communication and data storytelling, boosting offer-ready pipelines by 78%.",
    ],
    tools: ["OKRs", "Notion", "Slack", "Figma"],
    learned: ["Executive team leadership", "Consulting delivery", "Coaching & mentorship"],
  },
  {
    date: "2026",
    title: "Winner: LinkedUp | PMc Build-A-Feature Competition",
    subtitle: "End-to-end product feature for LinkedIn",
    bullets: [
      "Scoped, designed, and pitched a LinkedIn product feature end-to-end: product strategy, UX, and roadmap.",
    ],
    tools: ["Figma", "Miro"],
    learned: ["Product discovery", "Feature scoping & pitching"],
  },
  {
    date: "2018",
    title: "Innovation Award, San José Unified School District",
    subtitle: "Pioneer High School video news production",
    bullets: [
      "Created and anchored Pioneer High School's largest-scale video news production, reaching 1,500+ students.",
    ],
    learned: ["Production leadership", "On-camera communication"],
  },
  {
    date: "2023 - 2024",
    title: "Merit Scholar @ Alpha Gamma Sigma",
    subtitle: "Honors Society, West Valley College",
    location: "Saratoga, California",
  },
];

function DetailPanel({ entry }: { entry: Entry }) {
  return (
    <div className="w-full max-h-[min(640px,calc(100vh-2rem))] overflow-y-auto overflow-x-hidden p-5">
      <div className="text-[12px] uppercase tracking-wider mb-1.5" style={{ color: ACCENT, letterSpacing: "0.1em" }}>
        {entry.date}
      </div>
      <div className="break-words text-[17px] font-semibold text-foreground leading-snug mb-1.5">{entry.title}</div>
      {entry.subtitle && (
        <div className="break-words text-[14px] mb-4" style={{ color: "rgba(0,0,0,0.6)" }}>
          {entry.subtitle}
        </div>
      )}

      {entry.bullets && entry.bullets.length > 0 && (
        <ul className="space-y-2 mb-4">
          {entry.bullets.map((b, i) => (
            <li key={i} className="text-[14px] leading-relaxed flex min-w-0 gap-2.5" style={{ color: "rgba(0,0,0,0.78)" }}>
              <span className="mt-2 shrink-0 h-1.5 w-1.5 rounded-full" style={{ background: ACCENT }} />
              <span className="min-w-0 break-words">{b}</span>
            </li>
          ))}
        </ul>
      )}

      {entry.tools && entry.tools.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-1.5 text-[12px] uppercase tracking-wider mb-2" style={{ color: "rgba(0,0,0,0.5)", letterSpacing: "0.08em" }}>
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
          <div className="flex items-center gap-1.5 text-[12px] uppercase tracking-wider mb-2" style={{ color: "rgba(0,0,0,0.5)", letterSpacing: "0.08em" }}>
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
      <div className="flex items-center gap-2.5 mb-8 pb-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
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
                I’m Cash Johnson, a Silicon Valley operations and project manager who enjoys working
                where enterprise operations, partnerships, and go-to-market strategy meet. Give me an
                ambiguous, cross-functional problem, and I’ll turn it into a clear plan that can
                actually ship.
              </p>
              <p>
                Most of my focus right now is on AI operations and building agents that solve real
                operational problems. That usually starts with mapping a messy manual process,
                figuring out where an agent actually belongs, and then shipping automated workflows
                people will genuinely use. As a Project Management Intern at Centene, I applied that
                same thinking inside a highly regulated healthcare environment where accuracy and
                documentation matter as much as speed. I hold a B.S. in Business Administration with
                a concentration in Management Information Systems from San José State University.
              </p>
              <p>
                I bring a business mindset, technical instincts, and a practical approach to getting
                things done. Outside of work and school, I’m usually fishing, rock climbing, surfing,
                playing guitar, or making a mess with my watercolor set.
              </p>
              <p>Go ahead and message me, let's go grab coffee! (-:</p>
            </div>
          </div>
          <div id="contact">
            <h2 className="text-[15px] font-semibold text-foreground mb-6">Contact</h2>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:me@cashjohnson.net"
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
                href="https://linkedin.com/in/cash-johnson/"
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
