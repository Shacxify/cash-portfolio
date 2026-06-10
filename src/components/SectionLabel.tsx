export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="uppercase mb-8"
      style={{
        fontSize: "12px",
        letterSpacing: "0.2em",
        color: "rgba(0,0,0,0.72)",
        fontWeight: 600,
      }}
    >
      {children}
    </h2>
  );
}
