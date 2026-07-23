import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

const SITE_TITLE = "第二屆亞太禁羈研討會 (A.S.K. II)";
const SITE_DESC =
  "A.S.K. II: The Second Asia-Pacific Symposium on KINK 2026年7-8月（臺北）";
const OG_IMAGE = "https://bdsmask.org/assets/om_image.png";
const FAVICON = "https://bdsmask.org/assets/partner/禁羈學術委員會.png";

export const meta: Route.MetaFunction = () => [
  { title: SITE_TITLE },
  { name: "description", content: SITE_DESC },
  { property: "og:type", content: "website" },
  { property: "og:locale", content: "zh_TW" },
  { property: "og:title", content: SITE_TITLE },
  { property: "og:description", content: SITE_DESC },
  { property: "og:image", content: OG_IMAGE },
  { property: "og:url", content: "https://bdsmask.org/" },
  { property: "og:site_name", content: SITE_TITLE },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: SITE_TITLE },
  { name: "twitter:description", content: SITE_DESC },
  { name: "twitter:image", content: OG_IMAGE },
  { name: "twitter:site", content: "@ask2026" },
];

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&display=swap",
  },
  { rel: "icon", type: "image/png", href: FAVICON },
  { rel: "apple-touch-icon", href: FAVICON },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `if (window.location.pathname === "/index.html") {
              window.history.replaceState(null, "", "/" + window.location.search + window.location.hash);
            }`,
          }}
        />
        <Meta />
        <Links />
      </head>
      <body className="leading-relaxed">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      <div className="h-1 bg-gradient-to-r from-emerald-500 to-orange-500"></div>
      <Footer />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-32 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
