import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AuroraBackground } from "@/components/AuroraBackground";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";

import { ProjectsSection } from "@/components/ProjectsSection";
import { CVSection } from "@/components/CVSection";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Cash Johnson - AI Solutions Architect" },
      {
        name: "description",
        content:
          "Cash Johnson is an AI Solutions Architect based in Silicon Valley, specializing in sales development and data analytics across operations, partnerships, and go-to-market.",
      },
      { property: "og:title", content: "Cash Johnson - AI Solutions Architect" },
      {
        property: "og:description",
        content:
          "Cash Johnson is an AI Solutions Architect based in Silicon Valley, building AI agents and automation across operations, partnerships, and go-to-market.",
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
              "Cash Johnson is an AI Solutions Architect based in Silicon Valley, specializing in sales development and data analytics at the intersection of enterprise operations, partnerships, and go-to-market strategy.",
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
              "Sales Development",
              "Data Analytics",
              "Operations Management",
              "Project Management",
              "Go-to-Market Strategy",
              "Partnerships",
              "Event Operations",
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
      <Navbar />
      <main className="relative z-10 pt-14">
        <HeroSection />
        <ProjectsSection />
        <CVSection />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
