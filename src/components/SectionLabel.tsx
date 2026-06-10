export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="uppercase mb-8"
      style={{
        fontSize: "10px",
        letterSpacing: "0.18em",
        color: "rgba(0,0,0,0.65)",
        fontWeight: 500,
      }}
    >
      {children}
    </h2>
  );
}
