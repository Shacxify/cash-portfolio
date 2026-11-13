import { useEffect } from "react";
import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

import { NotFoundPage } from "@/components/not-found/NotFoundPage";
import appCss from "../styles.css?url";

function VisitTracker() {
  useEffect(() => {
    try {
      const payload = JSON.stringify({
        path: window.location.pathname,
        referrer: document.referrer,
      });
      const blob = new Blob([payload], { type: "application/json" });
      if (!navigator.sendBeacon?.("/api/visit", blob)) {
        fetch("/api/visit", { method: "POST", body: payload, keepalive: true }).catch(() => {});
      }
    } catch {
      // tracking must never break the page
    }
  }, []);
  return null;
}

function NotFoundComponent() {
  return <NotFoundPage />;
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "google-site-verification", content: "8kY1dDhckXkX44SrsN6tTnzMbF9URlzT4V04zvsLdag" },
      { name: "author", content: "Cash Johnson" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Cash Johnson" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": "https://cashjohnson.net/#website",
          name: "Cash Johnson - AI Solutions Architect",
          url: "https://cashjohnson.net/",
          description:
            "Personal portfolio of Cash Johnson, an AI Solutions Architect based in Silicon Valley - professional experience, featured projects, and contact information.",
          about: { "@id": "https://cashjohnson.net/#person" },
          publisher: { "@id": "https://cashjohnson.net/#person" },
        }),
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <VisitTracker />
        <SpeedInsights />
        <Analytics />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  // Turn on smooth scrolling only after the first frame, so the router's scroll
  // restoration on load jumps straight to its position instead of animating.
  useEffect(() => {
    const id = requestAnimationFrame(() => document.documentElement.classList.add("smooth-scroll"));
    return () => cancelAnimationFrame(id);
  }, []);
  return <Outlet />;
}
