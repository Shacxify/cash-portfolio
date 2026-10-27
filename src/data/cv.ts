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
    date: "",
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
    date: "May 2025 — Present",
    title: "Operations PM Intern @ Centene",
    subtitle: "St. Louis, MO · Hybrid · Enterprise Operations",
    location: "Hybrid",
    href: "https://www.centene.com/",
    bullets: [
      "Cut PM troubleshooting time by up to 50% by deploying real-time dashboards and standardized reporting.",
      "Selected as a core PM for Centene's Duals initiative, orchestrating healthcare plan operations across 9 states.",
      "Designed a Smartsheet Lessons Learned tracker adopted as the legacy operations model, slated for company-wide rollout.",
      "Aligned Compliance, IT, and Operations stakeholders to unblock execution and streamline workflows.",
    ],
    tools: ["Smartsheet", "Power BI", "Jira", "Confluence", "SharePoint"],
    learned: [
      "Enterprise PMO governance",
      "Cross-functional stakeholder alignment",
      "RAID & risk registers",
    ],
  },
  {
    date: "Jan 2025 — Present",
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
      "Converted ~85% of a 20+ monthly partner pipeline into active sponsorships, driving GTM across 10+ event formats.",
      "Led flagship events (Tech Intern Bus Mixer, Intern Ship Games) drawing 300+ attendees at 90%+ venue capacity.",
      "Automated Power BI lead scoring; A/B tested email, Luma, and LinkedIn campaigns to lift partner conversion.",
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
      "Managed content production for 4+ years, delivering every issue on deadline.",
      "Drove 24-hour editorial turnarounds across 4+ monthly stories with zero missed deadlines over a 4-year run.",
    ],
    tools: ["Asana", "Google Workspace", "Slack"],
    learned: ["Editorial project management", "Long-horizon reliability"],
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
