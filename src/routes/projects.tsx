import { createFileRoute, Link } from "@tanstack/react-router";

const TITLE = "Projects";
const DESCRIPTION =
  "In-depth case studies from Cash Johnson: VNTG OS, Sammy's Source, Markowitz Investment, LinkedUp, Stanley 1913, and Adobe Cloud for Ralph Lauren.";
const URL = "https://cashjohnson.net/projects";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: `${TITLE} | Cash Johnson` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: ProjectsPage,
});

type Project = {
  slug: string;
  title: string;
  emoji?: string;
  role: string;
  timeline: string;
  meta?: string;
  blurb: string;
  sections: { heading: string; body: (string | string[])[] }[];
  stack?: string;
  links?: { label: string; href: string; external?: boolean }[];
};

const projects: Project[] = [
  {
    slug: "vntg-os",
    title: "VNTG OS — Custom Inventory + Resale System",
    role: "Sole designer, researcher, and developer",
    timeline: "Apr 2026 – Jun 2026 · San Jose State University",
    meta: "Client: Black & Brown, a vintage consignment store (751 W. San Carlos St, San Jose)",
    blurb:
      "A production-grade, two-sided retail platform built from zero for a real San Jose vintage consignment store, featuring an AI-powered resale pricing engine.",
    sections: [
      {
        heading: "The problem",
        body: [
          "Black & Brown ran a real retail operation on pen and paper. Inventory lived in someone's head and a notebook, pricing was guesswork, and there was no way for customers to see what was in stock without walking through the door. The business needed to move from a fragmented manual workflow to a modern retail platform without an engineering team, a template, or an existing codebase to start from.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "VNTG OS is a production-grade, two-sided web application designed, researched, and developed from zero. The customer side is a curated storefront where shoppers browse real-time inventory, check out with promo-code support, and confirm delivery or in-store pickup. The staff side is a dedicated employee portal (live behind an Employee Login) where the team manages listings, runs AI-assisted pricing, and publishes inventory to the live site. The two sides share a single centralized, real-time inventory system, so what staff list is exactly what customers see.",
          "The standout feature is an AI-powered resale pricing engine. Instead of pricing by gut feel, staff get on-demand price estimates generated from real-time market trends and comparable sales data, surfaced to customers through a Get a Price Estimate flow for items they want to sell in.",
        ],
      },
      {
        heading: "How it was built",
        body: [
          "I built the front end in React and Tailwind CSS using Lovable, across 19 high-fidelity Figma screens, 5 complete end-to-end task flows, and a full brand style guide built to a 390px mobile-first spec. Beyond the build, I treated this as a full product engagement: I produced a formal planning report, Gane-Sarson context diagrams, a complete interactive Figma prototype, a live pitch deck, and a deployed production codebase, all delivered within a single academic semester.",
        ],
      },
      {
        heading: "Results",
        body: [
          [
            "Replaced 100% of manual, pen-and-paper inventory operations with a centralized real-time system serving both customer-facing commerce and staff-side management.",
            "Shipped a live, AI-assisted inventory and e-commerce platform for a real San Jose business.",
            "A weighted scoring model rated the system 405/500 across 6 cost categories, a 65% margin over the next-best alternative evaluated.",
            "Backed the recommendation with a full qualitative and quantitative cost-benefit analysis, including a five-year financial feasibility study validated under two independent discount-rate scenarios.",
          ],
        ],
      },
    ],
    stack:
      "React, Tailwind CSS, Lovable, Figma · planning report, Gane-Sarson diagrams, interactive prototype, pitch deck, deployed production codebase",
    links: [
      { label: "Live demo — bnb.cashjohnson.net", href: "https://bnb.cashjohnson.net", external: true },
    ],
  },
  {
    slug: "sammys-source",
    title: "Sammy's Source — AI-Powered Financial Navigation for First-Gen Students",
    role: "Lead developer — system prompt architecture, ranking logic, language detection",
    timeline: "Feb 2026 – May 2026 · San Jose State University (BUS4-110A, Lucas College of Business)",
    meta: "Team 5 — Cash Johnson, Fatima Zehra Shaikh, James Doan, Wilson Lin, Jackie Li",
    blurb:
      "A multilingual AI assistant that turns a plain-language description of a student's situation into a ranked, actionable plan across 7 SJSU financial-aid programs.",
    sections: [
      {
        heading: "The problem",
        body: [
          "SJSU has the resources. Students in crisis can't find them fast enough. Picture a first-gen student who gets a financial hold two weeks before fall registration closes, working 20 hours a week, family income under $40k, FAFSA not yet disbursed. The answer exists, but it's buried across six departments and written for administrators, not students. With roughly 40% of the student population navigating aid systems that weren't designed for them, the gap between the answer exists and I know what to do right now costs students their semester.",
        ],
      },
      {
        heading: "What we built",
        body: [
          "Sammy's Source takes a plain-language description of a student's situation and returns a specific, ranked action plan: 1 to 3 recommendations, under 200 words, in the student's own language, at zero cost. No forms, no fields, no categories: a student in crisis doesn't write like a database. The system reads their situation against a system prompt encoding 7 prioritized SJSU resources (Spartan Food Pantry, Basic Needs Center, Emergency Financial Assistance Fund, and more), ranks by urgency, and returns concrete next steps with locations and contacts, closing with a direct acknowledgment of the student's situation.",
        ],
      },
      {
        heading: "My contribution",
        body: [
          "I designed and developed the core end-to-end: the system prompt architecture, the urgency-ranking logic, automatic language detection, and a peer-advisor flagging system for sensitive outputs. The system prompt is where the real product decisions live: a single missing instruction can quietly lock out entire language communities, so prompt design was treated as the core engineering problem, not an afterthought. Fatima Zehra Shaikh led product requirements and operational design, including the human-review workflow that keeps inaccurate guidance from reaching students under deadline pressure.",
        ],
      },
      {
        heading: "The hard part: the failure case",
        body: [
          "We deliberately stress-tested the system to find where it breaks. A Spanish-language input (Hola, necesito ayuda. No tengo dinero…) exposed a critical failure: the system answered in English, which the student couldn't act on, meaning the very student the tool was built to reach would be the first one it failed. We fixed it by adding a language-detection instruction so the system now matches the student's language and asks one clarifying question when an input is too vague to route, rather than guessing. The before-and-after on the same input is documented in the notebook.",
        ],
      },
      {
        heading: "Oversight and tradeoff",
        body: [
          "Every response flagged as non-English or too vague gets held for peer-advisor review at the Basic Needs Center before reaching the student. That introduces a real tradeoff: flagged inputs queue 4 to 24 hours depending on staffing, but we prioritized accuracy over immediacy, because a confident wrong answer delivered in seconds does more damage than the right answer delivered the next morning, and the students most likely to write in Spanish or send a vague message are the least likely to have a backup plan.",
        ],
      },
      {
        heading: "Results",
        body: [
          [
            "Prototyped and stress-tested against 4 real student scenarios plus a Spanish-language edge case that exposed (and then validated the fix for) a critical system-prompt failure.",
            "Delivers a ranked action plan across 7 SJSU financial programs in seconds, versus the 3 to 5 days it takes to email a counselor.",
            "Aligned to UN Sustainable Development Goals 1 (No Poverty) and 4 (Quality Education).",
          ],
        ],
      },
    ],
    stack: "Google Gemini API (gemini-2.0-flash), Python, Jupyter/Colab",
    links: [
      {
        label: "Source code — github.com/Shacxify/SJSU-SammysSource",
        href: "https://github.com/Shacxify/SJSU-SammysSource",
        external: true,
      },
    ],
  },
  {
    slug: "markowitz",
    title: "Markowitz Investment — Portfolio Optimization Analysis",
    role: "Quantitative analyst / project lead",
    timeline: "Jan 2026 – Apr 2026 · San Jose State University",
    blurb:
      "A mean-variance optimized portfolio across a 6-asset universe delivering a 1.23 Sharpe Ratio at 46.5% expected return.",
    sections: [
      {
        heading: "Overview",
        body: [
          "An undergraduate project grounded in the same mean-variance optimization theory used by quantitative analysts at firms like BlackRock and Vanguard and by leading robo-advisory platforms. The goal: engineer a mathematically optimized investment portfolio using the Markowitz framework, the foundation underlying modern robo-advisors and institutional asset management.",
        ],
      },
      {
        heading: "What I did",
        body: [
          "I constructed a full 6x6 variance-covariance matrix across a diversified asset universe (SPY, QQQ, NVDA, BABA, CAR, XOM), executed a GRG Nonlinear Solver optimization, and mapped the Efficient Frontier to identify precise risk-return tradeoffs. The analytical outputs were then translated into structured, client-ready investment recommendations aligned to a defined risk profile and a 7 to 10 year wealth-accumulation horizon.",
        ],
      },
      {
        heading: "Results",
        body: [
          [
            "Delivered a portfolio achieving a 1.23 Sharpe Ratio at 46.5% expected return, quantitatively validated against a 4% risk-free benchmark.",
            "Produced a complete, defensible recommendation translating raw optimization output into a usable investment strategy.",
          ],
        ],
      },
    ],
    stack: "Excel Solver (GRG Nonlinear), mean-variance optimization, Efficient Frontier modeling",
  },
  {
    slug: "linkedup",
    title: "LinkedUp — PMc Build-A-Feature Competition Winner 🏆",
    role: "Product lead",
    timeline: "Jan 2026 – Feb 2026 · SJSU LinkedIn Campus Ambassadors / PM Club",
    blurb:
      "An award-winning LinkedIn feature concept using opt-in proximity detection to surface contextual professional connections, privacy-first by default.",
    sections: [
      {
        heading: "Overview",
        body: [
          "LinkedUp is an award-winning LinkedIn feature concept built for the Product Management Club's Build-A-Feature competition at SJSU, and it won.",
        ],
      },
      {
        heading: "The concept",
        body: [
          "Professionals constantly cross paths with relevant connections and have no system to act on it. LinkedUp surfaces those moments natively inside LinkedIn, using opt-in proximity detection within a 20-foot radius to create contextual connection opportunities with professional relevance already attached. It's privacy-first by default, with a clean toggle the user controls entirely: the privacy model was treated as a trust decision, not a feature decision.",
        ],
      },
      {
        heading: "What I learned",
        body: [
          "The strongest feedback we received was that LinkedUp felt less like a student pitch and more like a feature LinkedIn should have already shipped. That came from spending more time on user logic than visual design, and more time on the failure cases than the happy path. Product depth isn't about adding complexity. Winning validated the concept; the process validated the thinking behind it.",
        ],
      },
    ],
    stack: "Conception document and go-to-market (GTM) plan · iOS Development, Mobile Design, +8 more",
  },
  {
    slug: "stanley-1913",
    title: "Stanley 1913 — Marketing Performance Evaluation",
    role: "Research and strategy lead",
    timeline: "Aug 2025 – Dec 2025 · SJSU (BUS2 130: Introduction to Marketing, Prof. Marko Spremo)",
    blurb:
      "A brand strategy case study layering consumer trends, regulatory pressure, and competitive dynamics into a decision-ready growth thesis.",
    sections: [
      {
        heading: "Overview",
        body: [
          "A brand strategy case study for Stanley 1913 that built the research foundation for a full marketing recommendation framework. I turned consumer trends, regulatory pressure, competitive dynamics, and product risk into a polished, decision-ready strategy.",
        ],
      },
      {
        heading: "What I did",
        body: [
          "I applied layered analysis across market signals, customer behavior, and competitor positioning to keep the work rigorous, defensible, and strategically aligned. The result was a sharper brand narrative, a more credible growth thesis, and a more sophisticated view of how Stanley could protect customer loyalty while expanding market relevance.",
        ],
      },
    ],
    stack: "Stanley 1913: A Marketing Case Study · Market Research, Competitive Analysis, +10 more",
  },
  {
    slug: "linkedin-learning",
    title: "LinkedIn Learning — Campus Market Analysis",
    role: "Analyst / strategy",
    timeline: "Jan 2025 – Feb 2025 · SJSU LinkedIn Campus Ambassadors",
    blurb:
      "A segmented targeting model that drove a 67% lift in workshop participation and 2.6x ambassador-led engagement.",
    sections: [
      {
        heading: "Overview",
        body: [
          "A market analysis that turned broad student-engagement challenges into a segmented, actionable campus strategy.",
        ],
      },
      {
        heading: "What I did",
        body: [
          "Instead of relying on generic campus outreach, I built a segmented targeting model that let the team focus messaging, programming, and ambassador presence around the specific barriers driving low adoption across different student groups. That made outreach more targeted, raised the strategic value of workshops and events, and gave the program a stronger foundation for scaling engagement.",
        ],
      },
      {
        heading: "Results",
        body: [
          [
            "Directly drove the inception of a campus activation engine that produced a 67% increase in workshop participation.",
            "Lifted ambassador-led engagement 2.6x.",
            "Significantly improved how resources were deployed across student segments.",
          ],
        ],
      },
    ],
    stack: "LinkedIn Learning analysis deck · Marketing Strategy, Market Research, +7 more",
  },
  {
    slug: "adobe-ralph-lauren",
    title: "Adobe Cloud Enterprise for Ralph Lauren",
    role: "Strategy",
    timeline: "Sep 2024 – Dec 2024",
    blurb:
      "An Adobe Experience Cloud strategy reimagining the luxury customer journey from audience intelligence through campaign execution.",
    sections: [
      {
        heading: "Overview",
        body: [
          "A high-impact Adobe Experience Cloud strategy for Polo Ralph Lauren that reimagined the customer journey from audience intelligence through campaign execution.",
        ],
      },
      {
        heading: "What I did",
        body: [
          "By aligning analytics, personalization, workflow automation, and omnichannel engagement, the strategy positioned the brand to unlock measurable gains across the luxury customer journey.",
        ],
      },
      {
        heading: "Projected results",
        body: [
          [
            "28% lift in campaign efficiency.",
            "19% increase in retention-driving engagement.",
            "2.1x improvement in audience-targeting precision across luxury customer segments.",
          ],
        ],
      },
    ],
    stack: "The Adobe Experience for Ralph Lauren · Data-Driven Decision Making, Data Analysis, +14 more",
  },
];

function ProjectsPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 md:px-10 py-16 md:py-24">
        <nav className="mb-8 text-sm">
          <Link to="/" className="text-foreground/70 transition-colors hover:[color:#86A397]">
            ← Back to home
          </Link>
        </nav>

        <header className="mb-14">
          <p
            className="uppercase tracking-[0.18em] text-[11px] mb-4"
            style={{ color: "rgba(0,0,0,0.65)" }}
          >
            Case Studies
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Projects</h1>
          <p
            className="mt-5 text-[17px] md:text-[18px] leading-relaxed"
            style={{ color: "rgba(0,0,0,0.7)" }}
          >
            In-depth write-ups of selected projects, ordered most recent first. Each entry is written
            as a standalone case study.
          </p>
        </header>

        <ul className="mb-16 grid gap-2 text-[15px]">
          {projects.map((p) => (
            <li key={p.slug}>
              <a
                href={`#${p.slug}`}
                className="text-foreground/80 transition-colors hover:[color:#86A397]"
              >
                {p.title}
              </a>
            </li>
          ))}
        </ul>

        <div className="space-y-20">
          {projects.map((p) => (
            <article key={p.slug} id={p.slug} className="scroll-mt-24">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{p.title}</h2>
              <div
                className="mt-3 text-[13px] leading-relaxed"
                style={{ color: "rgba(0,0,0,0.6)" }}
              >
                <div>
                  <span className="font-medium" style={{ color: "rgba(0,0,0,0.75)" }}>
                    Role:
                  </span>{" "}
                  {p.role}
                </div>
                <div>
                  <span className="font-medium" style={{ color: "rgba(0,0,0,0.75)" }}>
                    Timeline:
                  </span>{" "}
                  {p.timeline}
                </div>
                {p.meta && <div className="mt-1">{p.meta}</div>}
              </div>

              <p
                className="mt-5 text-[16px] leading-relaxed"
                style={{ color: "rgba(0,0,0,0.78)" }}
              >
                {p.blurb}
              </p>

              <div className="mt-6 space-y-5">
                {p.sections.map((s) => (
                  <section key={s.heading}>
                    <h3 className="text-[15px] font-semibold tracking-tight">{s.heading}</h3>
                    <div
                      className="mt-2 space-y-3 text-[15px] leading-relaxed"
                      style={{ color: "rgba(0,0,0,0.75)" }}
                    >
                      {s.body.map((b, i) =>
                        Array.isArray(b) ? (
                          <ul key={i} className="list-disc pl-5 space-y-1.5">
                            {b.map((item, j) => (
                              <li key={j}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p key={i}>{b}</p>
                        ),
                      )}
                    </div>
                  </section>
                ))}
              </div>

              {p.stack && (
                <p
                  className="mt-6 text-[13px] leading-relaxed"
                  style={{ color: "rgba(0,0,0,0.6)" }}
                >
                  <span className="font-medium" style={{ color: "rgba(0,0,0,0.75)" }}>
                    Stack & deliverables:
                  </span>{" "}
                  {p.stack}
                </p>
              )}

              {p.links && p.links.length > 0 && (
                <ul className="mt-4 space-y-1.5 text-[14px]">
                  {p.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target={l.external ? "_blank" : undefined}
                        rel={l.external ? "noopener noreferrer" : undefined}
                        className="underline underline-offset-4 transition-colors hover:[color:#86A397]"
                      >
                        {l.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
