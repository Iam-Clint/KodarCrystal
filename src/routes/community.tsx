import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Eye, GitFork, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — Crystal.dev" },
      { name: "description", content: "Browse, remix and learn from apps built by the Crystal community." },
    ],
  }),
  component: Community,
});

const tags = ["All", "SaaS", "E-commerce", "Dashboard", "Portfolio", "AI", "Social", "Finance"];
const projects = Array.from({ length: 12 }).map((_, i) => {
  const grads = [
    "from-rose-300 via-orange-200 to-amber-200",
    "from-violet-300 via-fuchsia-200 to-rose-200",
    "from-emerald-200 via-teal-200 to-cyan-200",
    "from-amber-200 via-rose-200 to-pink-300",
    "from-sky-200 via-indigo-200 to-violet-300",
    "from-pink-300 via-rose-200 to-orange-200",
  ];
  const names = ["Lumen", "Orbit", "Pulse", "Forge", "Echo", "Atlas", "Drift", "Nimbus", "Quartz", "Halo", "Ember", "Vela"];
  return {
    title: `${names[i % names.length]} ${["App", "Studio", "Labs", "Cloud"][i % 4]}`,
    author: ["maya", "diego", "priya", "sam", "kai", "rin"][i % 6],
    remixes: 200 + i * 73,
    views: `${(2 + i * 0.7).toFixed(1)}k`,
    grad: grads[i % grads.length],
  };
});

function Community() {
  const [active, setActive] = useState("All");
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="text-center">
        <h1 className="font-display text-4xl md:text-6xl">From the <em className="italic gradient-text">community</em></h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">Discover what others are building. Remix any project to make it your own.</p>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4">
        <div className="surface flex w-full max-w-md items-center gap-2 rounded-full px-4 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Search projects…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${active === t ? "border-foreground bg-foreground text-background" : "border-border bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ y: -4 }}
            className="surface overflow-hidden rounded-2xl"
          >
            <Link to="/workspace" className={`block aspect-[16/10] bg-gradient-to-br ${p.grad}`}>
              <div className="h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.5),transparent_60%)]" />
            </Link>
            <div className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-muted-foreground">by @{p.author}</div>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {p.views}</span>
                <span className="flex items-center gap-1"><GitFork className="h-3 w-3" /> {p.remixes}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
