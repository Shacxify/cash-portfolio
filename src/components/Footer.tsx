export function Footer() {
  return (
    <footer
      className="relative px-6 md:px-10 py-10"
      style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="font-bold text-foreground">Cash Johnson</div>

        <div className="grid grid-cols-2 gap-8 text-[13px]">
          <div>
            <div
              className="uppercase mb-2"
              style={{ fontSize: "10px", letterSpacing: "0.18em", color: "rgba(0,0,0,0.72)" }}
            >
              Social
            </div>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              className="block transition-colors hover:[color:#86A397]"
              style={{ color: "rgba(0,0,0,0.78)" }}
            >
              LinkedIn
            </a>
          </div>
          <div>
            <div
              className="uppercase mb-2"
              style={{ fontSize: "10px", letterSpacing: "0.18em", color: "rgba(0,0,0,0.72)" }}
            >
              Contact
            </div>
            <a
              href="mailto:cash@example.com"
              className="block transition-colors hover:[color:#86A397]"
              style={{ color: "rgba(0,0,0,0.78)" }}
            >
              Email
            </a>
            <a
              href="tel:+1"
              className="block transition-colors hover:[color:#86A397]"
              style={{ color: "rgba(0,0,0,0.78)" }}
            >
              Phone
            </a>
          </div>
        </div>

        <div
          className="md:text-right"
          style={{ fontSize: "11px", color: "rgba(0,0,0,0.72)" }}
        >
          2026 Cash Johnson ©
        </div>
      </div>
    </footer>
  );
}
