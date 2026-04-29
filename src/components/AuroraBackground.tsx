export function AuroraBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        className="absolute aurora-blob-1"
        style={{
          top: "-10%",
          right: "-10%",
          width: "650px",
          height: "650px",
          background: "radial-gradient(circle, #E1B07E 0%, #E5BE9E 60%, transparent 70%)",
          filter: "blur(90px)",
          opacity: 0.28,
        }}
      />
      <div
        className="absolute aurora-blob-2"
        style={{
          top: "30%",
          left: "-15%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, #86A397 0%, #CBC0AD 60%, transparent 70%)",
          filter: "blur(100px)",
          opacity: 0.25,
        }}
      />
      <div
        className="absolute aurora-blob-3"
        style={{
          bottom: "-15%",
          right: "-5%",
          width: "550px",
          height: "550px",
          background: "radial-gradient(circle, #361D2E 0%, #86A397 60%, transparent 70%)",
          filter: "blur(95px)",
          opacity: 0.18,
        }}
      />
      <div
        className="absolute aurora-blob-1"
        style={{
          top: "40%",
          left: "35%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, #E5BE9E 0%, #86A397 50%, transparent 70%)",
          filter: "blur(80px)",
          opacity: 0.15,
        }}
      />
    </div>
  );
}
