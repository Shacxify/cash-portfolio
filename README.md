# cash-portfolio

### cashjohnson.net · TanStack Start on Cloudflare Workers

> Personal site, project index, CV, and operations blog. Server-rendered, edge-deployed, and built to be readable by recruiters and crawlers alike.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)
![TanStack](https://img.shields.io/badge/TanStack-Start_+_Router-EF4444?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=flat-square&logo=cloudflare)

**Live:** [cashjohnson.net](https://cashjohnson.net)

---

## What This Is

A portfolio that does three jobs at once:

1. **Convert.** Hero, featured work, project index, and CV timeline arranged so a hiring manager finds the relevant proof in under thirty seconds.
2. **Rank.** Sitemap route, `robots.txt`, Open Graph imagery, and a hand-written `llms.txt` so both search engines and language models can describe the site accurately.
3. **Publish.** A small operations and project management blog, each post its own file-based route.

---

## Routes

| Route | Content |
|---|---|
| `/` | Hero, featured work, projects, CV, contact |
| `/projects` | Full project index |
| `/blog/operations-and-project-management` | Long-form post |
| `/blog/operations-project-manager-role` | Long-form post |
| `/blog/pm-vs-operations` | Long-form post |
| `/blog/how-to-document-sops` | Long-form post |
| `/sitemap.xml` | Generated server route |

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | TanStack Start, TanStack Router 1.x | File-based routing with full type safety and SSR at the edge |
| UI | React 19, Tailwind CSS v4, Radix primitives, shadcn-style components | Modern rendering, zero-config styling pipeline |
| Motion | Framer Motion 12 | Aurora background and section transitions |
| Server | Nitro on Cloudflare Workers via `@cloudflare/vite-plugin` and Wrangler | Global edge delivery, no cold-start penalty |
| Analytics | Vercel Analytics, Speed Insights | Real-user performance and traffic data |
| Tooling | Vite 7, ESLint 9, Prettier, TypeScript 5.8 | Fast builds, enforced formatting |

---

## Components

| Component | Role |
|---|---|
| `HeroSection` | Above-the-fold positioning statement |
| `AuroraBackground` | Animated gradient backdrop |
| `ProjectsSection` | Card grid backed by `src/assets/projects` |
| `CVSection` | Experience and education timeline |
| `Navbar`, `Footer`, `SectionLabel` | Layout and wayfinding |

---

## Getting Started

```sh
git clone https://github.com/Shacxify/cash-portfolio.git
cd cash-portfolio
bun install     # or: npm install
bun run dev
```

| Script | Purpose |
|---|---|
| `dev` | Vite dev server |
| `build` | Production build |
| `build:dev` | Development-mode build |
| `preview` | Serve the production build locally |
| `lint` | ESLint 9 flat config |
| `format` | Prettier write across the repo |

**Deploy**

```sh
bun run build
wrangler deploy
```

Worker configuration lives in `wrangler.jsonc` with `nodejs_compat` enabled and `@tanstack/react-start/server-entry` as the entry point.

---

## SEO Notes

- `public/llms.txt` gives language models a structured summary of the site instead of leaving them to guess.
- `public/robots.txt` and the generated `/sitemap.xml` route keep crawl paths explicit.
- `public/og-home.jpg` and per-post imagery in `public/blog` control link previews across social and messaging platforms.

---

## Author

[Cash Johnson](https://cashjohnson.net) · [LinkedIn](https://www.linkedin.com/in/cash-johnson/) · me@cashjohnson.net
