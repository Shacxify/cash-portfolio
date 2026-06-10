import { createFileRoute, Link } from "@tanstack/react-router";

const TITLE = "What Does an Operations Project Manager Do?";
const DESCRIPTION =
  "A guide to the Operations Project Manager role — responsibilities, skills required, and how it differs from traditional PM and operations roles.";
const URL = "https://cashjohnson.net/blog/operations-project-manager-role";

export const Route = createFileRoute("/blog/operations-project-manager-role")({
  head: () => ({
    meta: [
      { title: `${TITLE} | Cash Johnson` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { property: "og:image", content: "https://cashjohnson.net/blog/operations-project-manager.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: "https://cashjohnson.net/blog/operations-project-manager.jpg" },
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
          image: "https://cashjohnson.net/blog/operations-project-manager.jpg",
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
          <p
            className="uppercase tracking-[0.18em] text-[11px] mb-4"
            style={{ color: "rgba(0,0,0,0.65)" }}
          >
            Guide · Career
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            What Does an Operations Project Manager Do?
          </h1>
          <p className="mt-5 text-[17px] md:text-[18px] leading-relaxed" style={{ color: "rgba(0,0,0,0.7)" }}>
            An Operations Project Manager sits at the intersection of two disciplines: the
            day-to-day systems that keep a business running, and the bounded initiatives that
            move it forward. Here's what the role actually involves, the skills it requires,
            and how it differs from related titles.
          </p>
        </header>

        <section className="prose-content space-y-6 text-[17px] leading-relaxed" style={{ color: "rgba(0,0,0,0.78)" }}>
          <h2 className="text-2xl font-semibold text-foreground mt-10">The short answer</h2>
          <p>
            An Operations Project Manager plans, executes, and improves cross-functional
            projects that strengthen how a company runs internally. Unlike a traditional
            project manager — who is often assigned to a single product or client deliverable
            — an OPM focuses on the operational backbone: workflows, tooling, vendor
            relationships, reporting, and the handoffs between teams.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-10">Core responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Scoping operational projects.</strong> Translating a fuzzy goal ("reduce
              onboarding time," "consolidate three CRMs into one") into a concrete plan with
              owners, milestones, and a budget.
            </li>
            <li>
              <strong>Owning cross-functional execution.</strong> Coordinating across
              finance, people ops, sales ops, IT, and external vendors so a change actually
              lands — not just gets announced.
            </li>
            <li>
              <strong>Standardizing process.</strong> Documenting SOPs, building playbooks,
              and turning one-off fixes into repeatable workflows.
            </li>
            <li>
              <strong>Tooling and systems.</strong> Selecting, configuring, and rolling out
              internal tools (project management, CRM, ticketing, automation), then training
              the teams that use them.
            </li>
            <li>
              <strong>Reporting and KPIs.</strong> Defining the metrics that show whether an
              operational change worked, and instrumenting dashboards that leadership can
              read at a glance.
            </li>
            <li>
              <strong>Risk and change management.</strong> Anticipating where a change will
              break, communicating the impact, and sequencing rollouts so the business keeps
              moving.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-10">
            Operations Project Manager vs. Project Manager vs. Operations Manager
          </h2>
          <p>
            The titles overlap, but the centers of gravity are different:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Project Manager (PM):</strong> Owns delivery of a specific project, on
              scope, on time, on budget. Usually scoped to one product, client, or
              department.
            </li>
            <li>
              <strong>Operations Manager:</strong> Owns the steady-state — the recurring
              work, headcount, and outputs of an operational function. Less project-bounded,
              more "the lights have to stay on."
            </li>
            <li>
              <strong>Operations Project Manager:</strong> Owns the projects that change how
              operations run. The deliverable is a better system, not a shipped product.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-10">Skills that matter most</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Process mapping and workflow design (BPMN, swim lanes, RACI).</li>
            <li>Familiarity with PM methodologies — Agile for iterative rollouts, Lean and Six Sigma for process improvement, traditional waterfall for tightly sequenced changes.</li>
            <li>Comfort with project tooling: Asana, Jira, Monday, Linear, ClickUp, Smartsheet.</li>
            <li>Data fluency — pulling reports, building dashboards, and translating numbers into decisions.</li>
            <li>Strong written communication; most operational change lives or dies on the clarity of the rollout doc.</li>
            <li>Stakeholder management across non-technical and technical teams.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-10">Typical day-to-day</h2>
          <p>
            On any given day an Operations Project Manager might run a standup on a tooling
            migration, write the requirements doc for a new vendor evaluation, review a
            process map with finance, ship an updated onboarding playbook, and pull a
            mid-quarter report on how a recent change is performing. The role is broad on
            purpose — operational improvements rarely sit inside one team's swim lane.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-10">
            Where the role fits in a growing company
          </h2>
          <p>
            Small companies usually distribute operations work across founders, a chief of
            staff, and a generalist ops hire. As headcount grows past roughly 50–100 people,
            the cost of uncoordinated systems shows up: duplicate tools, manual handoffs,
            inconsistent reporting. That's when a dedicated Operations Project Manager pays
            for itself — the role exists to compound those small fixes into a backbone that
            scales.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-10">Common adjacent titles</h2>
          <p>
            If you're researching this role, you'll see closely related titles: Business
            Operations Manager, Revenue Operations Project Manager, Strategic Operations
            Lead, Program Manager (Operations), and Chief of Staff. The job description
            matters more than the title — look for ownership of cross-functional projects
            and a mandate to improve internal systems.
          </p>
        </section>

        <footer className="mt-16 pt-8" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <p className="text-sm" style={{ color: "rgba(0,0,0,0.65)" }}>
            Written by Cash Johnson — Strategic Growth Architect working across sales,
            events, and operations.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-1.5 text-[15px] transition-colors hover:[color:#86A397]"
            style={{ color: "rgba(0,0,0,0.7)" }}
          >
            ← Back to home
          </Link>
        </footer>
      </article>
    </main>
  );
}
