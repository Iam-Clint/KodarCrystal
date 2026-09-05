import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Wrench, Rocket, CreditCard, Plug, Palette } from "lucide-react";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "Changelog — Crystal.dev" },
      { name: "description", content: "What's new in Crystal.dev — releases, improvements and fixes." },
      { property: "og:title", content: "Changelog — Crystal.dev" },
      { property: "og:description", content: "What's new in Crystal.dev — releases, improvements and fixes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChangelogPage,
});

const entries = [
  {
    date: "September 4, 2026",
    tag: "New",
    icon: Rocket,
    items: [
      "Preview panel upgrades: open your generated app in a new tab, fullscreen preview mode, and device-size toggles at every screen width.",
      "Workspace is now fully usable on phones and tablets with a Chat / Preview switcher.",
    ],
  },
  {
    date: "August 28, 2026",
    tag: "New",
    icon: CreditCard,
    items: [
      "Usage & Access settings: platform vs cloud credit split, weekly usage chart, default effort level, and spend guardrails.",
      "Build / Plan toggle — discuss a lightweight plan before spending build credits.",
      "Effort selector (Low / Medium / High / Max) with transparent relative credit costs.",
    ],
  },
  {
    date: "August 15, 2026",
    tag: "New",
    icon: Plug,
    items: [
      "MCP connections: GitHub, Vercel, Netlify, Supabase, Firebase, n8n, Notion, Linear, Stripe, Figma and Sentry with per-connector permission scopes.",
      "MCP activity timeline with filters, plus a connector details drawer (resync, edit scopes, revoke).",
    ],
  },
  {
    date: "July 30, 2026",
    tag: "Improved",
    icon: Palette,
    items: [
      "System-aware theming with a persisted manual Light / Dark / System override.",
      "New brand: Crystal.dev — Prompt to App Builder.",
      "Performance pass: smoother scrolling and lighter animations across the app.",
    ],
  },
  {
    date: "July 12, 2026",
    tag: "New",
    icon: Sparkles,
    items: [
      "Inline prompt suggestions with full keyboard navigation on the landing composer.",
      "Sign up and login with Google, Apple, GitHub or email, plus a forgot-password flow.",
    ],
  },
  {
    date: "June 25, 2026",
    tag: "Fixed",
    icon: Wrench,
    items: [
      "Dashboard search now actually filters projects as you type.",
      "Fixed date label, navigation active states, and a handful of responsive layout bugs.",
    ],
  },
];

function ChangelogPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">Crystal.dev</div>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">
        What's <em className="italic gradient-text">new</em>
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Releases, improvements and fixes — newest first.
      </p>

      <ol className="mt-12 space-y-10">
        {entries.map((e) => {
          const Icon = e.icon;
          return (
            <li key={e.date} className="relative border-l border-border pl-6">
              <div className="absolute -left-[13px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background">
                <Icon className="h-3 w-3 text-rose-500" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <time className="text-xs text-muted-foreground">{e.date}</time>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {e.tag}
                </span>
              </div>
              <ul className="mt-3 space-y-2">
                {e.items.map((item) => (
                  <li key={item} className="surface rounded-lg px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
