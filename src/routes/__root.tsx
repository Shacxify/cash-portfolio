import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "google-site-verification", content: "8kY1dDhckXkX44SrsN6tTnzMbF9URlzT4V04zvsLdag" },
      { title: "Cash Johnson | Sales & Events Growth Architect" },
      { name: "description", content: "A personal portfolio website showcasing professional experience, featured projects, and contact information." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Cash Johnson | Sales & Events Growth Architect" },
      { property: "og:description", content: "A personal portfolio website showcasing professional experience, featured projects, and contact information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Cash Johnson | Sales & Events Growth Architect" },
      { name: "twitter:description", content: "A personal portfolio website showcasing professional experience, featured projects, and contact information." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/dbfd4f1a-73f9-4346-9f5a-c356aa2c31c6/id-preview-4794d84c--b9492b17-8638-4118-beb1-c328edd3545a.lovable.app-1781056821064.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/dbfd4f1a-73f9-4346-9f5a-c356aa2c31c6/id-preview-4794d84c--b9492b17-8638-4118-beb1-c328edd3545a.lovable.app-1781056821064.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Cash Johnson | Sales & Events Growth Architect",
          url: "https://cashjohnson.net",
          description:
            "A personal portfolio website showcasing professional experience, featured projects, and contact information.",
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
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
