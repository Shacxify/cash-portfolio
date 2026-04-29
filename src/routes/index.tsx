import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AuroraBackground } from "@/components/AuroraBackground";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedWork } from "@/components/FeaturedWork";
import { CVSection } from "@/components/CVSection";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Cash Johnson — Strategic Growth Architect" },
      {
        name: "description",
        content:
          "Cash Johnson is a Strategic Growth Architect based in Silicon Valley, working at the intersection of operations, partnerships, and go-to-market.",
      },
      { property: "og:title", content: "Cash Johnson — Strategic Growth Architect" },
      {
        property: "og:description",
        content:
          "Portfolio of Cash Johnson — operations, events, and growth across Centene, LinkedIn, and The Intern Ship.",
      },
    ],
  }),
});

function Home() {
  return (
    <div className="relative min-h-screen text-foreground" style={{ background: "#FAFAF9" }}>
      <AuroraBackground />
      <Navbar />
      <main className="relative z-10 pt-14">
        <HeroSection />
        <FeaturedWork />
        <CVSection />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
