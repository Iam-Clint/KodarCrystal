import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Gears } from "@/components/Gears";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider, themeInitScript } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <main className="not-found-scene relative flex min-h-[calc(100dvh-56px)] items-center justify-center overflow-hidden px-4 py-10">
      <div className="relative flex max-w-xl flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <Gears />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }} className="glitch-text mt-2 font-display text-8xl gradient-text">404</motion.div>
        <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }} className="mt-3 text-2xl">This page doesn't exist.</motion.h1>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }} className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild className="min-h-11"><Link to="/">Go home</Link></Button>
          <Button asChild variant="outline" className="min-h-11"><Link to="/dashboard">Go to dashboard</Link></Button>
        </motion.div>
      </div>
    </main>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Crystal.dev — Prompt to App Builder" },
      { name: "description", content: "Crystal.dev turns a single prompt into a complete app — pages, features and branding." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=JetBrains+Mono:wght@400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <ThemeProvider>
      <Navbar />
      <Outlet />
      <Toaster />
    </ThemeProvider>
  );
}
