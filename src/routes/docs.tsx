import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen, Rocket, MessageSquare, Gauge, Plug, Download, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Documentation — KodarCrystal" },
      { name: "description", content: "Learn how to prompt, plan, build, connect MCP servers and export apps with KodarCrystal." },
      { property: "og:title", content: "Documentation — KodarCrystal" },
      { property: "og:description", content: "Guides for prompting, effort levels, credits, MCP connections and exports." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Docs,
});

const sections = [
  {
    id: "getting-started",
    icon: Rocket,
    title: "Getting started",
    body: "Describe the app you want in the prompt box on the home page — one or two sentences is enough. KodarCrystal turns it into pages, a data model, branding and a working preview. Sign up to keep the prompt you started with: it travels with you and loads straight into your workspace.",
    bullets: [
      "Type an idea, e.g. “A booking app for a Lagos barbershop”.",
      "Pick a suggestion pill to sharpen the prompt before generating.",
      "Watch the build stream into the live preview panel.",
    ],
  },
  {
    id: "prompting",
    icon: MessageSquare,
    title: "Prompting well",
    body: "Good prompts name the audience, the core action and the data involved. Vague prompts get vague apps. Use Plan mode in the Builder to talk an idea through before spending credits on generation.",
    bullets: [
      "Say who it is for and what they do first.",
      "List the 3–5 screens that matter, not 20.",
      "Iterate in small follow-up messages instead of one giant rewrite.",
    ],
  },
  {
    id: "effort-credits",
    icon: Gauge,
    title: "Effort levels & credits",
    body: "Every prompt runs at an effort level. Low is fast and cheap for small tweaks, Max reasons the longest for the hardest problems. The relative cost is shown before you generate, and Settings → Usage & Access breaks down where credits went.",
    bullets: [
      "Low ~1x · Medium ~2x · High ~4x · Max ~8x",
      "Plan mode is lightweight and uses no credits.",
      "Platform credits and cloud/hosting credits are tracked separately.",
    ],
  },
  {
    id: "mcp",
    icon: Plug,
    title: "MCP connections",
    body: "Connect the tools you already use — GitHub, Vercel, Supabase, Notion, n8n and more — so KodarCrystal can act with live context. Every server shows its tool count and permission scopes before you connect, and you can revoke access at any time.",
    bullets: [
      "Manage servers from Settings → MCP or the dashboard panel.",
      "Scopes are shown up front; nothing is granted silently.",
      "Point KodarCrystal at any custom MCP endpoint you host.",
    ],
  },
  {
    id: "exports",
    icon: Download,
    title: "Exports",
    body: "Take your app anywhere. From the results page you can export to React (Vite + Tailwind + shadcn), Flutter, an editable Figma file or plain HTML/CSS.",
    bullets: ["No lock-in — the code is yours.", "Set a default export format in Settings → Workspace."],
  },
  {
    id: "trust",
    icon: ShieldCheck,
    title: "Trust & transparency",
    body: "KodarCrystal shows the model, tokens, credits and time behind each response so you always know what a build cost. This preview is a frontend prototype: data is mocked and no real accounts, payments or deployments are created.",
    bullets: ["Per-message usage on every reply.", "Cost warnings before high-effort actions."],
  },
];

function Docs() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 [scroll-behavior:smooth]">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5" /> Documentation
        </div>
        <h1 className="mt-4 font-display text-4xl md:text-5xl">
          Build with <em className="italic gradient-text">KodarCrystal</em>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Everything you need to go from a sentence to a shipped app — prompting, effort levels, credits,
          connections and exports.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[200px_1fr]">
        <nav aria-label="Documentation sections" className="surface sticky top-20 hidden h-fit rounded-xl p-2 lg:block">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <s.icon className="h-4 w-4" /> {s.title}
            </a>
          ))}
        </nav>

        <div className="space-y-5">
          {sections.map((s, i) => (
            <motion.section
              key={s.id}
              id={s.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.04, 0.2) }}
              className="surface scroll-mt-20 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
                  <s.icon className="h-4 w-4 text-brand" />
                </span>
                <h2 className="font-display text-2xl">{s.title}</h2>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{s.body}</p>
              <ul className="mt-3 space-y-1.5">
                {s.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.section>
          ))}

          <div className="surface flex flex-wrap items-center justify-between gap-3 rounded-2xl p-6">
            <div>
              <div className="font-display text-xl">Ready to try it?</div>
              <p className="mt-1 text-sm text-muted-foreground">Start from a prompt — no setup required.</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/signup" className="btn-brand inline-flex h-10 items-center rounded-md px-4 text-sm font-medium">
                Get started
              </Link>
              <Link to="/changelog" className="text-sm text-muted-foreground hover:text-foreground">
                Read the changelog →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
