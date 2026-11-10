// Single source for CV content. The CV section, skills cloud, and command palette
// all read from here so they never drift apart.

export type Entry = {
  date: string;
  title: string;
  subtitle?: string;
  location?: string;
  href?: string;
  bullets?: string[];
  tools?: string[];
  learned?: string[];
};

export const education: Entry[] = [
  {
    date: "2026",
    title: "San José State University",
    subtitle: "B.S. Business Administration, MIS · GPA 3.5",
    location: "San José, California",
    href: "https://www.sjsu.edu/",
    bullets: [
      "Lucas College of Business — Management Information Systems concentration.",
      "Coursework across systems analysis, data management, and enterprise operations.",
    ],
    tools: ["SQL", "Tableau", "Power BI", "Excel"],
    learned: ["Systems analysis & design", "Data-driven decision making"],
  },
  {
    date: "",
    title: "West Valley College",
    subtitle: "5 Associate Degrees — AS MIS, AST Economics, AA Liberal Arts (3 emphases)",
    location: "Saratoga, California",
    href: "https://www.westvalley.edu/",
    bullets: [
      "Completed five associate degrees in parallel across business, economics, and the liberal arts.",
      "Merit Scholar, Alpha Gamma Sigma Honors Society (2023–2024).",
    ],
    learned: ["Cross-disciplinary study", "Academic project management"],
  },
];

export const professional: Entry[] = [
  {
    date: "May 2025 — Aug 2026",
    title: "Operations PM Intern @ Centene",
    subtitle: "St. Louis, MO · Hybrid · Enterprise Operations",
    location: "Hybrid",
    href: "https://www.centene.com/",
    bullets: [
      "Managed healthcare plan operations delivery across 9 states as the Ops Testing team's project manager.",
      "Cut PM troubleshooting time by up to 50% with a real-time executive dashboard built on production operations data.",
      "Designed and pitched PM Pulse AI, a 4-agent PM-reporting platform projected to save 110+ hours per PM per month; presented to VP-level leadership, and the VP of Operations asked to scale it org-wide.",
      "Aligned Compliance, IT, and Operations stakeholders to unblock execution and streamline workflows.",
    ],
    tools: ["Smartsheet", "Power BI", "Power Automate", "Copilot", "SharePoint", "Python"],
    learned: [
      "Enterprise PMO governance",
      "Cross-functional stakeholder alignment",
      "Human-in-the-loop AI design",
    ],
  },
  {
    date: "Jan 2025 — Aug 2026",
    title: "Director of Events @ LinkedIn Campus Ambassador Program",
    subtitle: "Promoted from LinkedIn Ambassador · SJSU",
    location: "San José, California",
    href: "https://sjsulinkedin.com/",
    bullets: [
      "Directed 6+ large-scale career events drawing 25,000+ collective attendees with 100% on-time delivery.",
      "Selected from 2,000+ applicants to help lead LinkedIn's student ambassador program at SJSU.",
      "Partnered directly with LinkedIn corporate stakeholders to align campus events with brand priorities.",
      "Improved event satisfaction scores by 25% through structured post-event feedback loops.",
    ],
    tools: ["LinkedIn Events", "Luma", "Notion", "Asana"],
    learned: ["Brand-partner alignment", "Event operations at scale", "Feedback-driven iteration"],
  },
  {
    date: "Jun 2025 — Jan 2026",
    title: "Director of Operations @ The Intern Ship",
    subtitle: "Partnerships & National Programming",
    location: "San José, California",
    href: "https://internship.beehiiv.com/",
    bullets: [
      "Secured 5 brand and venue partnerships (Salesforce, Figma, Supercell, and others), closing $200K+ in sponsorship revenue.",
      "Lifted partner conversion by 80% with Power BI lead scoring on A/B-tested email, Luma, and LinkedIn campaigns.",
      "Led GTM operations for a 4-city tech community (SF, Seattle, Toronto, NYC).",
      "Led flagship events (Tech Intern Bus Mixer, Intern Ship Games) drawing 300+ attendees at 90%+ venue capacity.",
    ],
    tools: ["Power BI", "Luma", "Salesforce", "Power Automate", "Excel"],
    learned: ["GTM pipeline management", "A/B testing & lead scoring", "Sponsorship negotiation"],
  },
  {
    date: "Aug 2020 — Jun 2024",
    title: "Project Manager @ San José Spotlight",
    subtitle: "Remote · Award-winning nonprofit newsroom",
    location: "San José, California (Remote)",
    href: "https://sanjosespotlight.com/",
    bullets: [
      "Managed end-to-end delivery of 100+ weekly releases over 4 years across a 5-stage lifecycle with a 100% on-time rate.",
      "Led 3 cross-functional teams, driving 68% audience growth at 98% listener satisfaction.",
    ],
    tools: ["Asana", "Google Workspace", "Slack"],
    learned: ["Editorial project management", "Long-horizon reliability"],
  },
  {
    date: "Aug 2018 — Jan 2020",
    title: "Sales & Business Relationship Specialist @ Apple",
    location: "Los Gatos, California",
    href: "https://www.apple.com/",
  },
  {
    date: "Jan 2016 — Jun 2019",
    title: "Founder & Developer @ CodeMoney",
    subtitle: "beCAREFUL · Apple App Store & Google Play",
    location: "San Francisco Bay Area",
    bullets: [
      "Built, shipped, and monetized the consumer mobile game beCAREFUL end to end at 16, generating $20K+ in revenue in its first 3 months.",
    ],
    learned: ["Shipping a product end to end", "App store monetization"],
  },
];

export const organizational: Entry[] = [
  {
    date: "Jul 2024 — Jan 2026",
    title: "President @ SJSU Marketing Association",
    subtitle: "Lucas College of Business · 250+ members, 45+ year legacy",
    location: "San José, California",
    href: "https://www.linkedin.com/company/sjsumarketingassociation/",
    bullets: [
      "Secured consulting engagements with Tesla, LinkedIn, and YC startups, generating 200+ client data points.",
      "Led SJSU's largest business organization, directing a 72-person officer team via OKRs.",
      "Coached 20 consultants on client communication and data storytelling, boosting offer-ready pipelines by 78%.",
    ],
    tools: ["OKRs", "Notion", "Slack", "Figma"],
    learned: ["Executive team leadership", "Consulting delivery", "Coaching & mentorship"],
  },
  {
    date: "2026",
    title: "Winner — LinkedUp | PMc Build-A-Feature Competition",
    subtitle: "End-to-end product feature for LinkedIn",
    bullets: [
      "Scoped, designed, and pitched a LinkedIn product feature end-to-end: product strategy, UX, and roadmap.",
    ],
    tools: ["Figma", "Miro"],
    learned: ["Product discovery", "Feature scoping & pitching"],
  },
  {
    date: "2018",
    title: "Innovation Award — San José Unified School District",
    subtitle: "Pioneer High School video news production",
    bullets: [
      "Created and anchored Pioneer High School's largest-scale video news production, reaching 1,500+ students.",
    ],
    learned: ["Production leadership", "On-camera communication"],
  },
  {
    date: "2023 — 2024",
    title: "Merit Scholar @ Alpha Gamma Sigma",
    subtitle: "Honors Society, West Valley College",
    location: "Saratoga, California",
  },
];
