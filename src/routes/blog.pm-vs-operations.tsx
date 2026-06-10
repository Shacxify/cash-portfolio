import { createFileRoute, Link } from "@tanstack/react-router";

const TITLE = "Project Management vs. Operations Management";
const DESCRIPTION =
  "How project management and operations management differ - scope, goals, skills, and which career path fits you best.";
const URL = "https://cashjohnson.net/blog/pm-vs-operations";

export const Route = createFileRoute("/blog/pm-vs-operations")({
  head: () => ({
    meta: [
      { title: `${TITLE} | Cash Johnson` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          datePublished: "2026-06-10",
          author: { "@type": "Person", name: "Cash Johnson" },
          mainEntityOfPage: URL,
        }),
      },
    ],
  }),
  component: ArticlePage,
});

function ArticlePage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <article className="mx-auto max-w-3xl px-6 md:px-10 py-16 md:py-24">
        <nav className="mb-8 text-sm">
          <Link to="/" className="text-foreground/70 transition-colors hover:[color:#86A397]">
            ← Back to home
          </Link>
        </nav>

        <header className="mb-10">
          <p className="uppercase tracking-[0.18em] text-[11px] mb-4" style={{ color: "rgba(0,0,0,0.65)" }}>
            Guide · Career
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Project Management vs. Operations Management: Which Career Path is Right for You?
          </h1>
          <p className="mt-5 text-[17px] md:text-[18px] leading-relaxed" style={{ color: "rgba(0,0,0,0.7)" }}>
            Project management and operations management are often confused - both move work
            through a company, both rely on planning and coordination, and many roles draw on
            both skill sets. But the two disciplines have different goals, time horizons, and
            success metrics. Here's how they compare and how to decide which path fits you.
          </p>
        </header>

        <section className="space-y-6 text-[17px] leading-relaxed" style={{ color: "rgba(0,0,0,0.78)" }}>
          <h2 className="text-2xl font-semibold text-foreground mt-10">The core difference</h2>
          <p>
            <strong>Project management</strong> is the discipline of delivering a temporary,
            unique initiative - something with a defined start, end, scope, and deliverable.
            A new product launch, a system migration, an event, a building. When the project
            ships, the project ends.
          </p>
          <p>
            <strong>Operations management</strong> is the discipline of running the ongoing,
            repeatable work that keeps a business going - fulfilling orders, supporting
            customers, processing payroll, manufacturing the same product week after week.
            Operations don't end; they get more efficient.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-10">Are they the same thing?</h2>
          <p>
            No - but they overlap. Operations teams run projects all the time (a warehouse
            automation rollout, a new ERP) and project teams rely on operational systems to
            execute. The simplest test: if the work has a defined end date and a unique
            deliverable, it's a project. If it repeats indefinitely and the goal is
            throughput or quality, it's an operation.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-10">Side-by-side comparison</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Time horizon:</strong> PM is temporary (weeks to years). Ops is ongoing.</li>
            <li><strong>Output:</strong> PM produces a unique deliverable. Ops produces a repeatable result.</li>
            <li><strong>Success metric:</strong> PM is measured on scope, schedule, and budget. Ops is measured on throughput, quality, cost-per-unit, and uptime.</li>
            <li><strong>Team structure:</strong> PMs lead cross-functional teams that disband. Ops managers lead standing teams.</li>
            <li><strong>Risk profile:</strong> PMs manage delivery risk on a one-time bet. Ops managers manage steady-state risk and continuous improvement.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-10">Which career path fits you?</h2>
          <p>
            Choose <strong>project management</strong> if you like variety, defined finish
            lines, and the satisfaction of shipping something new. You'll move between
            initiatives, work with rotating stakeholders, and live by Gantt charts, sprint
            boards, and launch plans.
          </p>
          <p>
            Choose <strong>operations management</strong> if you like building durable
            systems, leading a standing team, and improving the same process over many
            cycles. You'll own KPIs, headcount, and the day-to-day rhythm of a function.
          </p>
          <p>
            Many people end up doing both - operations roles increasingly include a steady
            stream of projects, and senior PMs often transition into ops leadership. If
            you're early in your career, try both: take a rotation in an ops team and lead a
            cross-functional project. The hybrid skill set is rare and valuable.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-10">Credentials and tools</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>PM:</strong> PMP, PRINCE2, CSM, PMI-ACP. Tools: Jira, Asana, MS Project, Smartsheet.</li>
            <li><strong>Ops:</strong> Lean Six Sigma (Green/Black Belt), APICS CPIM/CSCP. Tools: ERP systems, BI dashboards, process-mapping software.</li>
          </ul>
        </section>

        <footer className="mt-16 pt-8" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <Link to="/" className="text-[15px] transition-colors hover:[color:#86A397]" style={{ color: "rgba(0,0,0,0.7)" }}>
            ← Back to home
          </Link>
        </footer>
      </article>
    </main>
  );
}
