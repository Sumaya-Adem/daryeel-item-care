import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { DaryeelLogo } from "@/components/daryeel-logo";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function StatusPage({
  code,
  title,
  text,
  children,
}: {
  code?: string;
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-gutter">
      <div className="w-full max-w-sm text-center">
        <DaryeelLogo className="text-primary" markClassName="h-9 w-9" />
        {code ? <p className="mt-8 type-overline text-muted-foreground">Error {code}</p> : null}
        <h1 className={code ? "mt-2 type-title" : "mt-8 type-title"}>{title}</h1>
        <p className="mt-2 type-body text-muted-foreground">{text}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">{children}</div>
      </div>
    </div>
  );
}

function NotFoundComponent() {
  return (
    <StatusPage
      code="404"
      title="Page not found"
      text="The page you're looking for doesn't exist or has been moved."
    >
      <Link to="/" className={buttonVariants()}>
        Go home
      </Link>
    </StatusPage>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <StatusPage
      title="This page didn't load"
      text="Something went wrong on our end. You can try again or head back home."
    >
      <button
        type="button"
        onClick={() => {
          router.invalidate();
          reset();
        }}
        className={buttonVariants()}
      >
        Try again
      </button>
      <a href="/" className={buttonVariants({ variant: "outline" })}>
        Go home
      </a>
    </StatusPage>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Daryeel — Personal Belongings Care" },
      {
        name: "description",
        content: "Keep your belongings organized, protected, and connected with Daryeel.",
      },
      { name: "author", content: "Daryeel" },
      { property: "og:title", content: "Daryeel — Personal Belongings Care" },
      { property: "og:description", content: "Your belongings, always connected." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
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
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster position="bottom-center" />
    </QueryClientProvider>
  );
}
