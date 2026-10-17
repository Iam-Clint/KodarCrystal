import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Gears } from "@/components/Gears";

export const Route = createFileRoute("/error")({
  head: () => ({
    meta: [
      { title: "Something went wrong — Crystal.dev" },
      { name: "description", content: "We hit an unexpected error. Try again or head back home." },
      { property: "og:title", content: "Something went wrong — Crystal.dev" },
      { property: "og:description", content: "We hit an unexpected error. Try again or head back home." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ErrorPage,
});

function ErrorPage() {
  return (
    <main className="not-found-scene relative flex min-h-[calc(100dvh-56px)] items-center justify-center overflow-hidden px-4 py-10">
      <div className="relative flex max-w-xl flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <Gears />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }} className="mt-2 font-display text-4xl md:text-5xl">
          500 — <em className="italic gradient-text">Something went wrong</em>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }} className="mt-3 max-w-md text-sm text-muted-foreground">
          We hit an unexpected error. Our team has been notified. Try again or go back.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }} className="mt-6 flex flex-wrap justify-center gap-3">
          <Button className="min-h-11" onClick={() => window.location.reload()}>Try again</Button>
          <Button asChild variant="outline" className="min-h-11"><Link to="/">Go home</Link></Button>
        </motion.div>
      </div>
    </main>
  );
}
