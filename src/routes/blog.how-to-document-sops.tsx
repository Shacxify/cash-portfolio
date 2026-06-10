import { createFileRoute, Link } from "@tanstack/react-router";

const TITLE = "How to Document Standard Operating Procedures in a Project Management Tool";
const DESCRIPTION =
  "A step-by-step guide to documenting SOPs inside tools like Asana, Notion, or ClickUp — with templates, structure, and workflow tips.";
const URL = "https://cashjohnson.net/blog/how-to-document-sops";

export const Route = createFileRoute("/blog/how-to-document-sops")({
  head: () => ({
    meta: [
      { title: `${TITLE} | Cash Johnson` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { property: "og:image", content: "https://cashjohnson.net/blog/how-to-document-sops.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: "https://cashjohnson.net/blog/how-to-document-sops.jpg" },
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
          image: "https://cashjohnson.net/blog/how-to-document-sops.jpg",
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
            Guide · Operations
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            How to Document Standard Operating Procedures in a Project Management Tool
          </h1>
          <p className="mt-5 text-[17px] md:text-[18px] leading-relaxed" style={{ color: "rgba(0,0,0,0.7)" }}>
            SOPs live or die by where they live. When documentation is scattered across drives, wikis, and
            Slack threads, teams revert to asking the same questions. The fix: embed your SOPs directly
            inside the project management tool your team already opens every day.
          </p>
        </header>

        <section className="prose-content space-y-6 text-[17px] leading-relaxed" style={{ color: "rgba(0,0,0,0.78)" }}>
          <h2 className="text-2xl font-semibold text-foreground mt-10">Why your project tool is the right home</h2>
          <p>
            Most teams already have a single source of truth for work — Asana, Notion, ClickUp, Monday, or
            Linear. Embedding SOPs there removes friction: the procedure is one click away from the task
            it governs. It also creates accountability. When a task owner sees the SOP attached to their
            assignment, compliance becomes a natural part of workflow, not an extra step.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-10">A repeatable SOP structure</h2>
          <p>Every strong SOP follows the same skeleton. Document it once, then clone it for new processes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Purpose.</strong> One sentence explaining why this procedure exists.</li>
            <li><strong>Scope.</strong> Who does this, when it applies, and what triggers it.</li>
            <li><strong>Inputs.</strong> Data, assets, or decisions needed before starting.</li>
            <li><strong>Steps.</strong> Numbered, atomic actions with tool-specific instructions.</li>
            <li><strong>Outputs.</strong> The deliverable or confirmation that the step is complete.</li>
            <li><strong>Owner &amp; reviewer.</strong> Who maintains the SOP and how often it is audited.</li>
            <li><strong>Escalation.</strong> What to do when the SOP does not fit the situation.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-foreground mt-10">Setting up SOPs in common tools</h2>

          <h3 className="text-xl font-semibold text-foreground mt-8">Asana</h3>
          <p>
            Create a dedicated "SOPs" project with sections for each department. Store each procedure as a
            task with the SOP structure in the description. Attach the SOP task as a dependency or mention it
            in the template task for any repeatable workflow. Use custom fields to tag status (current,
            under-review, deprecated) and owner.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-8">Notion</h3>
          <p>
            Build a database with properties for purpose, owner, last-reviewed date, and tool category.
            Use a page template so every new SOP starts with the same headings. Link SOP pages directly from
            project docs or task databases using @-mentions or linked databases. Notion’s version history
            doubles as an audit trail.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-8">ClickUp</h3>
          <p>
            Use Docs inside a Space or Folder for SOPs. Create a Doc template with the structure above.
            Link Docs to tasks via the attachment field, or embed checklists inside the SOP Doc itself.
            ClickUp’s nested pages let you group related SOPs (e.g., onboarding, reporting, vendor management)
            without cluttering the task hierarchy.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-10">Templates that save time</h2>
          <p>
            Start with three high-impact templates: an onboarding SOP, a recurring report SOP, and a
            vendor-evaluation SOP. These cover the most common "where do I start?" moments. Once teams see
            the value in one domain, they are more likely to document the rest.
          </p>
          <p>
            For each template, include a starter task list, a RACI table, and a decision log. The decision log
            is the secret weapon: it records why the process was built this way, which prevents well-meaning
            teammates from quietly rewriting steps without context.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-10">Keeping SOPs alive</h2>
          <p>
            A stale SOP is worse than no SOP. Set a calendar reminder to review each procedure quarterly.
            Track two metrics: (1) how often the SOP is viewed or linked from tasks, and (2) how often
            someone still asks the question the SOP was meant to answer. If either metric drops, the SOP
            needs editing or better placement.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-10">Common mistakes to avoid</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Over-documenting.</strong> A 12-page SOP for a 5-minute task never gets read. Keep it scannable.</li>
            <li><strong>Hiding the SOP.</strong> If it lives in a folder three levels deep, it might as well not exist. Attach it to the task template.</li>
            <li><strong>No owner.</strong> If nobody owns the SOP, nobody updates it. Name a reviewer in the doc itself.</li>
            <li><strong>Ignoring edge cases.</strong> The escalation section is not optional. It prevents ad-hoc chaos when reality deviates from the happy path.</li>
          </ul>
        </section>

        <footer className="mt-16 pt-8" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <p className="text-sm" style={{ color: "rgba(0,0,0,0.65)" }}>
            Written by Cash Johnson — Strategic Growth Architect working across sales, events, and
            operations.
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
