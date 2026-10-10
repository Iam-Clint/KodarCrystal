import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Plug, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MCPDetailsDrawer } from "@/components/MCPDetailsDrawer";
import { BrandIcon } from "@/components/BrandIcon";

export type MCPServer = {
  id: string;
  name: string;
  mark: string;
  desc: string;
  category: "Deploy" | "Code" | "Data" | "Automation" | "Docs";
  tools: number;
  connected?: boolean;
  scope: string;
};

export const mcpServers: MCPServer[] = [
  { id: "github", name: "GitHub", mark: "GH", desc: "Read repos, open PRs and sync branches.", category: "Code", tools: 14, connected: true, scope: "repo, workflow" },
  { id: "vercel", name: "Vercel", mark: "▲", desc: "Trigger deploys and read build logs.", category: "Deploy", tools: 9, connected: true, scope: "deployments:rw" },
  { id: "netlify", name: "Netlify", mark: "N", desc: "Deploy sites and manage edge functions.", category: "Deploy", tools: 7, scope: "sites:rw" },
  { id: "supabase", name: "Supabase", mark: "SB", desc: "Query tables, run migrations, inspect RLS.", category: "Data", tools: 18, connected: true, scope: "db:rw, auth:read" },
  { id: "firebase", name: "Firebase", mark: "FB", desc: "Firestore documents, auth users and rules.", category: "Data", tools: 11, scope: "firestore:rw" },
  { id: "n8n", name: "n8n", mark: "n8", desc: "Run and author automation workflows.", category: "Automation", tools: 12, scope: "workflows:rw" },
  { id: "notion", name: "Notion", mark: "No", desc: "Pull specs and write docs back to pages.", category: "Docs", tools: 8, scope: "pages:rw" },
  { id: "linear", name: "Linear", mark: "L", desc: "Turn issues into build tasks automatically.", category: "Automation", tools: 10, scope: "issues:rw" },
  { id: "stripe", name: "Stripe", mark: "S", desc: "Inspect products, prices and test payments.", category: "Data", tools: 13, scope: "read_only" },
  { id: "figma", name: "Figma", mark: "F", desc: "Read frames, tokens and export assets.", category: "Docs", tools: 6, scope: "files:read" },
  { id: "sentry", name: "Sentry", mark: "Se", desc: "Pull runtime errors straight into chat.", category: "Automation", tools: 5, scope: "issues:read" },
  { id: "custom", name: "Custom server", mark: "+", desc: "Point Crystal at any MCP endpoint you host.", category: "Code", tools: 0, scope: "you define" },
];

const categories = ["All", "Deploy", "Code", "Data", "Automation", "Docs"] as const;

export default function MCPConnectionsPanel({ compact = false }: { compact?: boolean }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const [state, setState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(mcpServers.map((s) => [s.id, !!s.connected])),
  );
  const [selected, setSelected] = useState<MCPServer | null>(null);


  const list = mcpServers
    .filter((s) => (cat === "All" ? true : s.category === cat))
    .filter((s) => s.name.toLowerCase().includes(q.toLowerCase()) || s.desc.toLowerCase().includes(q.toLowerCase()))
    .slice(0, compact ? 6 : undefined);

  const activeCount = Object.values(state).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="grid min-w-0 gap-3 sm:flex sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-display text-xl">
            <Plug className="h-4 w-4 text-rose-500" /> MCP connections
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Give Crystal live tools from the apps you already use — {activeCount} connected.
          </p>
        </div>
        {!compact && (
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <div className="surface flex items-center gap-2 rounded-lg px-2.5 py-1.5">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search servers…"
                className="min-h-11 w-40 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex max-w-full flex-wrap gap-1 rounded-lg border border-border bg-secondary p-0.5">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`relative min-h-11 rounded-md px-2.5 py-1 text-[11px] transition-colors ${cat === c ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {cat === c && <motion.div layoutId="mcp-cat" className="absolute inset-0 rounded-md bg-background shadow-sm" />}
                  <span className="relative">{c}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((s) => {
          const on = state[s.id];
          return (
            <motion.div
              key={s.id}
              whileHover={{ y: -3 }}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(s)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(s);
                }
              }}
              className="surface flex cursor-pointer flex-col rounded-xl p-4 outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary"><BrandIcon id={s.id} className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{s.name}</span>
                    {on && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
                        <Check className="h-3 w-3 text-emerald-500" /> Live
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.desc}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
                    <span>{s.tools} tools</span>
                    <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> {s.scope}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant={on ? "outline" : "default"}
                  className={on ? "min-h-11" : "min-h-11 btn-brand"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setState((v) => ({ ...v, [s.id]: !v[s.id] }));
                  }}
                >
                  {on ? "Disconnect" : "Connect"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(s);
                  }}
                >
                  Details
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <MCPDetailsDrawer
        server={selected}
        connected={selected ? !!state[selected.id] : false}
        onOpenChange={(open) => !open && setSelected(null)}
        onToggle={(id) => setState((v) => ({ ...v, [id]: !v[id] }))}
      />
    </div>
  );
}
