import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Check, Database, Server, Cloud, Zap, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/backend")({
  head: () => ({
    meta: [
      { title: "Choose Your Backend Stack — Crystal" },
      { name: "description", content: "Pick the backend that powers your app: Crystal Cloud, Supabase, FastAPI, MongoDB, Firebase and more." },
      { property: "og:title", content: "Choose Your Backend Stack — Crystal" },
      { property: "og:description", content: "Pick the backend that powers your app: Crystal Cloud, Supabase, FastAPI, MongoDB, Firebase and more." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BackendStack,
});

type Stack = {
  id: string;
  name: string;
  mark: string;
  tagline: string;
  bullets: string[];
  badge?: string;
};

const groups: { group: string; icon: typeof Database; hint: string; items: Stack[] }[] = [
  {
    group: "Managed by Crystal",
    icon: Cloud,
    hint: "Zero setup — we provision, host and scale it for you.",
    items: [
      {
        id: "crystal-cloud",
        name: "Crystal Cloud",
        mark: "◇",
        tagline: "Postgres, auth, storage and functions on our infrastructure.",
        bullets: ["No external account", "Instant provisioning", "Row-level security by default"],
        badge: "Recommended",
      },
      {
        id: "crystal-edge",
        name: "Crystal Edge",
        mark: "⚡",
        tagline: "Globally distributed KV + edge functions for low-latency apps.",
        bullets: ["Sub-50ms reads", "Edge functions", "Great for realtime UI"],
      },
    ],
  },
  {
    group: "Backend as a service",
    icon: Zap,
    hint: "Bring your own BaaS account — we wire up the SDK and schema.",
    items: [
      {
        id: "supabase",
        name: "Supabase",
        mark: "SB",
        tagline: "Postgres with auth, storage, realtime and edge functions.",
        bullets: ["SQL migrations", "RLS policies", "Realtime channels"],
      },
      {
        id: "firebase",
        name: "Firebase",
        mark: "FB",
        tagline: "Firestore, auth and cloud functions from Google.",
        bullets: ["Document store", "Google/Apple auth", "Push notifications"],
      },
      {
        id: "appwrite",
        name: "Appwrite",
        mark: "AW",
        tagline: "Open-source BaaS you can self-host later.",
        bullets: ["Self-hostable", "Teams & permissions", "File storage"],
      },
      {
        id: "pocketbase",
        name: "PocketBase",
        mark: "PB",
        tagline: "Single-binary SQLite backend for small, fast apps.",
        bullets: ["One file deploy", "Built-in admin UI", "Cheap to run"],
      },
    ],
  },
  {
    group: "Custom server",
    icon: Server,
    hint: "We scaffold a real codebase you own and can deploy anywhere.",
    items: [
      {
        id: "fastapi",
        name: "FastAPI",
        mark: "PY",
        tagline: "Python API with Pydantic models and OpenAPI docs.",
        bullets: ["Typed routes", "Auto Swagger", "Great for AI/ML work"],
      },
      {
        id: "node-express",
        name: "Node + Express",
        mark: "JS",
        tagline: "Familiar JavaScript REST API with Prisma ORM.",
        bullets: ["Prisma schema", "JWT auth", "Same language as UI"],
      },
      {
        id: "go-fiber",
        name: "Go + Fiber",
        mark: "GO",
        tagline: "Compiled, high-throughput API for heavy workloads.",
        bullets: ["Tiny containers", "Very fast", "Strong concurrency"],
      },
      {
        id: "django",
        name: "Django",
        mark: "DJ",
        tagline: "Batteries-included Python with admin and ORM.",
        bullets: ["Built-in admin", "Mature ecosystem", "Great for CRUD"],
      },
    ],
  },
  {
    group: "Database",
    icon: Database,
    hint: "Pick where your data lives. Some backends preselect this.",
    items: [
      { id: "postgres", name: "PostgreSQL", mark: "PG", tagline: "Relational, reliable, the safe default.", bullets: ["Joins & constraints", "Great tooling", "Scales far"] },
      { id: "mongodb", name: "MongoDB", mark: "MD", tagline: "Flexible documents for evolving schemas.", bullets: ["Schema-light", "Atlas hosting", "Nested docs"] },
      { id: "mysql", name: "MySQL", mark: "MY", tagline: "Widely supported relational database.", bullets: ["Easy hosting", "Familiar SQL", "Good read perf"] },
      { id: "sqlite", name: "SQLite / Turso", mark: "SQ", tagline: "Embedded or edge-replicated SQL.", bullets: ["Zero ops", "Edge replicas", "Ideal for MVPs"] },
    ],
  },
];

const addons = [
  { id: "auth", label: "Authentication", desc: "Email + Google, Apple, GitHub OAuth" },
  { id: "payments", label: "Payments", desc: "Stripe checkout and subscriptions" },
  { id: "storage", label: "File storage", desc: "Uploads, images and signed URLs" },
  { id: "email", label: "Transactional email", desc: "Resend templates and triggers" },
  { id: "realtime", label: "Realtime", desc: "Live cursors, presence and streams" },
  { id: "ai", label: "AI endpoints", desc: "LLM chat, embeddings and vector search" },
];

function BackendStack() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>("crystal-cloud");
  const [extras, setExtras] = useState<string[]>(["auth"]);

  useEffect(() => {
    const saved = localStorage.getItem("crystal:backend");
    if (saved) setSelected(saved);
    const savedExtras = localStorage.getItem("crystal:backend-addons");
    if (savedExtras) {
      try {
        setExtras(JSON.parse(savedExtras));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const chosen = groups.flatMap((g) => g.items).find((i) => i.id === selected);

  const persistAndGo = () => {
    localStorage.setItem("crystal:backend", selected);
    localStorage.setItem("crystal:backend-addons", JSON.stringify(extras));
    navigate({ to: "/builder" });
  };

  return (
    <div className="mx-auto mt-8 max-w-6xl px-4 pb-32">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Step 2 of 3</div>
        <h1 className="mt-1 font-display text-3xl md:text-4xl">Choose your backend stack</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Crystal generates the schema, API layer and environment wiring for whichever stack you pick. You can switch later —
          your UI stays the same.
        </p>
      </div>

      <div className="space-y-8">
        {groups.map((g) => {
          const Icon = g.icon;
          return (
            <section key={g.group}>
              <div className="mb-3 flex items-center gap-2">
                <Icon className="h-4 w-4 text-rose-500" />
                <h2 className="font-display text-lg">{g.group}</h2>
                <span className="hidden text-xs text-muted-foreground sm:inline">— {g.hint}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((s) => {
                  const on = selected === s.id;
                  return (
                    <motion.button
                      key={s.id}
                      whileHover={{ y: -3 }}
                      onClick={() => setSelected(s.id)}
                      className={`surface relative flex flex-col rounded-xl p-4 text-left transition-shadow ${
                        on ? "ring-2 ring-rose-300" : ""
                      }`}
                    >
                      {s.badge && (
                        <span className="absolute right-3 top-3 rounded-full bg-[var(--gradient-brand)] px-2 py-0.5 text-[10px] font-medium text-white">
                          {s.badge}
                        </span>
                      )}
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary font-mono text-xs font-medium">
                          {s.mark}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{s.name}</span>
                            {on && <Check className="h-3.5 w-3.5 text-rose-500" />}
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">{s.tagline}</p>
                        </div>
                      </div>
                      <ul className="mt-3 space-y-1">
                        {s.bullets.map((b) => (
                          <li key={b} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <span className="h-1 w-1 rounded-full bg-rose-400" /> {b}
                          </li>
                        ))}
                      </ul>
                    </motion.button>
                  );
                })}
              </div>
            </section>
          );
        })}

        <section>
          <div className="mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-rose-500" />
            <h2 className="font-display text-lg">Add capabilities</h2>
            <span className="hidden text-xs text-muted-foreground sm:inline">— generated on top of your stack</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {addons.map((a) => {
              const on = extras.includes(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => setExtras((s) => (on ? s.filter((x) => x !== a.id) : [...s, a.id]))}
                  className={`surface flex items-center justify-between gap-3 rounded-xl p-4 text-left ${
                    on ? "ring-2 ring-rose-300" : ""
                  }`}
                >
                  <div>
                    <div className="text-sm font-medium">{a.label}</div>
                    <div className="text-xs text-muted-foreground">{a.desc}</div>
                  </div>
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      on ? "border-transparent bg-[var(--gradient-brand)] text-white" : "border-border"
                    }`}
                  >
                    {on && <Check className="h-3 w-3" />}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="text-sm">
            <span className="text-muted-foreground">Selected: </span>
            <span className="font-medium">{chosen?.name ?? "—"}</span>
            {extras.length > 0 && (
              <span className="text-muted-foreground"> · {extras.length} add-on{extras.length > 1 ? "s" : ""}</span>
            )}
          </div>
          <Button onClick={persistAndGo} className="btn-brand h-9 rounded-md px-4">
            Continue to builder <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
