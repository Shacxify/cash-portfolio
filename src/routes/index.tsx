import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AuroraBackground } from "@/components/AuroraBackground";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { StatsStrip } from "@/components/StatsStrip";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SkillsSection } from "@/components/SkillsSection";
import { CVSection } from "@/components/CVSection";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { CommandPalette } from "@/components/CommandPalette";
import { EasterEgg } from "@/components/EasterEgg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Cash Johnson - AI Solutions Architect" },
      {
        name: "description",
        content:
          "Cash Johnson is a Silicon Valley builder who puts AI to work inside real operations, across product, strategy and operations, and AI deployment.",
      },
      { property: "og:title", content: "Cash Johnson - AI Solutions Architect" },
      {
        property: "og:description",
        content:
          "Portfolio of Cash Johnson: AI products and automations, plus operations work across Centene, LinkedIn, and The Intern Ship.",
      },
      { property: "og:url", content: "https://cashjohnson.net/" },
      { property: "og:image", content: "https://cashjohnson.net/og-home.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://cashjohnson.net/og-home.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://cashjohnson.net/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "@id": "https://cashjohnson.net/#profilepage",
          url: "https://cashjohnson.net/",
          name: "Cash Johnson - AI Solutions Architect",
          mainEntity: {
            "@type": "Person",
            "@id": "https://cashjohnson.net/#person",
            name: "Cash Johnson",
            jobTitle: "AI Solutions Architect",
            url: "https://cashjohnson.net/",
            image: "https://cashjohnson.net/og-home.jpg",
            email: "mailto:me@cashjohnson.net",
            description:
              "Cash Johnson is a Silicon Valley builder who designs AI products and automations that fix real operational workflows, working where product, operations, and go-to-market meet.",
            address: {
              "@type": "PostalAddress",
              addressLocality: "San José",
              addressRegion: "CA",
              addressCountry: "US",
            },
            worksFor: [
              { "@type": "Organization", name: "Centene", url: "https://www.centene.com/" },
              { "@type": "Organization", name: "LinkedIn", url: "https://www.linkedin.com/" },
            ],
            alumniOf: [
              {
                "@type": "CollegeOrUniversity",
                name: "San José State University",
                url: "https://www.sjsu.edu/",
              },
              { "@type": "CollegeOrUniversity", name: "West Valley College" },
            ],
            knowsAbout: [
              "AI Deployment",
              "AI Agents & Automation",
              "Product Operations",
              "Product Management",
              "Strategy & Operations",
              "Go-to-Market Strategy",
              "Project Management",
              "Data Analytics",
              "Management Information Systems",
            ],
            sameAs: [
              "https://www.linkedin.com/in/cash-johnson/",
              "https://www.youtube.com/@Cash-Johnson",
              "https://www.instagram.com/shacxify/",
              "https://github.com/Shacxify",
            ],
          },
        }),
      },
    ],
  }),
});

function Home() {
  return (
    <div className="relative min-h-screen text-foreground" style={{ background: "#FAFAF9" }}>
      <AuroraBackground />
      <ScrollProgress />
      <Navbar />
      <main className="relative z-10 pt-14">
        <HeroSection />
        <StatsStrip />
        <ProjectsSection />
        <SkillsSection />
        <CVSection />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      <CommandPalette />
      <EasterEgg />
      <Toaster position="bottom-right" />
    </div>
  );
}
