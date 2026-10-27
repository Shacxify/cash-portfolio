// Featured project copy. Cover images stay in ProjectsSection so this file stays
// free of image assets.

export type Project = {
  title: string;
  tag: string;
  year: string;
  accent: string;
  description: string;
  href: string;
};

export const projects: Project[] = [
  {
    title: "VNTG OS",
    tag: "Inventory · E-commerce · AI",
    year: "2026",
    accent: "#86A397",
    description:
      "Two-sided retail platform for Black & Brown vintage consignment with an AI-powered resale pricing engine. Replaced 100% of pen-and-paper operations.",
    href: "https://bnb.cashjohnson.net",
  },
  {
    title: "Sammy's Source",
    tag: "AI · Product · Social Impact",
    year: "2026",
    accent: "#E1B07E",
    description:
      "AI-powered financial navigation for first-gen SJSU students. Led system-prompt architecture, urgency ranking, and multilingual fallback with peer-advisor oversight.",
    href: "/projects#sammys-source",
  },
  {
    title: "Markowitz Investment",
    tag: "Quant · Portfolio Optimization",
    year: "2026",
    accent: "#361D2E",
    description:
      "Mean-variance optimized portfolio across a 6-asset universe using GRG Nonlinear Solver. Delivered a 1.23 Sharpe Ratio at 46.5% expected return.",
    href: "/projects#markowitz",
  },
  {
    title: "LinkedUp",
    tag: "Product · Competition Winner",
    year: "2026",
    accent: "#86A397",
    description:
      "Award-winning LinkedIn feature concept for the SJSU PM Club. Opt-in proximity-based contextual connections, privacy-first by default.",
    href: "/projects#linkedup",
  },
  {
    title: "Stanley 1913",
    tag: "Brand Strategy · Research",
    year: "2025",
    accent: "#E1B07E",
    description:
      "Marketing performance evaluation and brand case study layering consumer trends, regulatory pressure, and competitive dynamics into a growth thesis.",
    href: "/projects#stanley-1913",
  },
  {
    title: "LinkedIn Learning",
    tag: "Market Analysis · Campus GTM",
    year: "2025",
    accent: "#361D2E",
    description:
      "Segmented campus targeting model for SJSU LinkedIn Campus Ambassadors. Drove a 67% lift in workshop participation and 2.6x ambassador-led engagement.",
    href: "/projects#linkedin-learning",
  },
  {
    title: "Adobe Cloud for Ralph Lauren",
    tag: "Experience Strategy",
    year: "2024",
    accent: "#86A397",
    description:
      "Adobe Experience Cloud strategy spanning analytics, personalization, and omnichannel engagement. Projected 28% campaign efficiency lift and 2.1x targeting precision.",
    href: "/projects#adobe-ralph-lauren",
  },
];
