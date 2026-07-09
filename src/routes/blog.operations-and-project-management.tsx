import { createFileRoute, Link } from "@tanstack/react-router";

const TITLE = "Operations and Project Management: Bridging the Gap";
const DESCRIPTION =
  "How operations and project management work together - integrating steady-state operations with project-based change to ship reliably and improve continuously.";
const URL = "https://cashjohnson.net/blog/operations-and-project-management";

export const Route = createFileRoute("/blog/operations-and-project-management")({
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
          datePublished: "2026-07-09",
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
            Guide · Integration
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Operations and Project Management: Bridging the Gap
          </h1>
          <p className="mt-5 text-[17px] md:text-[18px] leading-relaxed" style={{ color: "rgba(0,0,0,0.7)" }}>
            Operations keep the business running. Projects change how the
            business runs. Most companies treat them as separate worlds, but
            the teams that ship reliably and improve continuously are the ones
            that integrate the two. Here's how they fit together and how to
            bridge the gap.
          </p>
        </header>

        <section className="space-y-6 text-[17px] leading-relaxed" style={{ color: "rgba(0,0,0,0.78)" }}>
          <h2 className="text-2xl font-semibold text-foreground mt-10">Two disciplines, one value stream</h2>
          <p>
            <strong>Operations</strong> owns steady-state work: the recurring
            processes that produce products, serve customers, and generate
            revenue. Success is measured in throughput, quality, cost per unit,
            and uptime. <strong>Project management</strong> owns change: the
            temporary, cross-functional initiatives that introduce a new
            capability, migrate a system, or launch a product. Success is
            measured in scope, schedule, and budget.
          </p>
          <p>
            The gap opens when projects hand off deliverables that operations
            can't absorb - new software with no runbook, a launched product
            with no support tier, a process change that breaks a KPI. Bridging
            the gap means treating operations as a stakeholder from day one,
            not the room a project throws its output into on the last day.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-10">Where they intersect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Project intake:</strong> operations proposes most of the projects worth doing, because it's closest to the friction.</li>
            <li><strong>Requirements:</strong> ops owns the "must not break" list - SLAs, compliance, throughput floors.</li>
            <li><strong>Rollout:</strong> ops runs the pilot, the training, and the change management.</li>
            <li><strong>Handoff:</strong> the project is not done until the runbook, on-call rotation, and KPIs are live.</li>
            <li><strong>Post-launch:</strong> ops measures whether the project actually moved the needle it was supposed to.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-10">Practical integration patterns</h2>
          <p>
            <strong>Embed an operator on every project team.</strong> Not as a
            reviewer at the end - as a full member from kickoff. They carry
            the operational constraints into the design and carry the design
            back into the ops org.
          </p>
          <p>
            <strong>Define "done" as adopted, not shipped.</strong> A project
            that ships on time but never gets used didn't succeed. Add
            adoption and KPI-movement gates to the close-out checklist.
          </p>
          <p>
            <strong>Run a portfolio, not a pile.</strong> Score projects
            against operational impact and capacity, not just executive
            enthusiasm. Ops leaders should own a seat at the prioritization
            table.
          </p>
          <p>
            <strong>Instrument before you launch.</strong> If ops can't see
            the new process in a dashboard on day one, the project is not
            ready to close.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-10">The hybrid skill set</h2>
          <p>
            The people who move fastest at this intersection can plan a
            delivery and run a process. They know Gantt charts and control
            charts, sprint reviews and shift huddles, launch plans and
            standard work. If you're early in your career and want to build
            this range, take a rotation in an operations team and lead a
            cross-functional project - the combination compounds.
          </p>
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
