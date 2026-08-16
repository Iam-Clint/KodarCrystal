import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, AlertTriangle, CheckCircle2, Plug, RefreshCw, XCircle } from "lucide-react";

export type MCPEventKind = "connected" | "disconnected" | "tool" | "error" | "sync";

export type MCPEvent = {
  id: string;
  server: string;
  serverId: string;
  kind: MCPEventKind;
  message: string;
  at: string;
  detail?: string;
};

export const mcpEvents: MCPEvent[] = [
  { id: "e1", server: "GitHub", serverId: "github", kind: "tool", message: "create_pull_request → crystal-app#482", at: "2m ago", detail: "opened PR “feat: diff review panel”" },
  { id: "e2", server: "Vercel", serverId: "vercel", kind: "sync", message: "Build logs synced for preview deploy", at: "6m ago", detail: "deployment dpl_8fQ2 · 41s" },
  { id: "e3", server: "Supabase", serverId: "supabase", kind: "error", message: "RLS check failed on table `projects`", at: "12m ago", detail: "permission denied for relation projects (42501)" },
  { id: "e4", server: "Supabase", serverId: "supabase", kind: "tool", message: "run_sql → 3 rows returned", at: "18m ago" },
  { id: "e5", server: "Linear", serverId: "linear", kind: "connected", message: "Connector authorised with scope issues:rw", at: "35m ago" },
  { id: "e6", server: "Sentry", serverId: "sentry", kind: "error", message: "Token expired — reauthorisation required", at: "1h ago", detail: "401 from sentry.io/api/0/issues" },
  { id: "e7", server: "Notion", serverId: "notion", kind: "tool", message: "append_block → Spec / Trust layer", at: "2h ago" },
  { id: "e8", server: "Netlify", serverId: "netlify", kind: "disconnected", message: "Disconnected by owner", at: "3h ago" },
  { id: "e9", server: "GitHub", serverId: "github", kind: "sync", message: "Branch list refreshed (14 branches)", at: "4h ago" },
  { id: "e10", server: "Vercel", serverId: "vercel", kind: "connected", message: "Connector authorised with scope deployments:rw", at: "Yesterday" },
];

const kindMeta: Record<MCPEventKind, { label: string; icon: typeof Activity; tone: string }> = {
  connected: { label: "Connected", icon: CheckCircle2, tone: "text-emerald-500" },
  disconnected: { label: "Disconnected", icon: XCircle, tone: "text-muted-foreground" },
  tool: { label: "Tool call", icon: Plug, tone: "text-rose-500" },
  error: { label: "Error", icon: AlertTriangle, tone: "text-red-500" },
  sync: { label: "Sync", icon: RefreshCw, tone: "text-amber-500" },
};

const filters = ["All", "Errors", "Tool calls", "Connections", "Syncs"] as const;

function matches(f: (typeof filters)[number], e: MCPEvent) {
  switch (f) {
    case "Errors":
      return e.kind === "error";
    case "Tool calls":
      return e.kind === "tool";
    case "Connections":
      return e.kind === "connected" || e.kind === "disconnected";
    case "Syncs":
      return e.kind === "sync";
    default:
      return true;
  }
}

export function MCPActivity({ serverId }: { serverId?: string }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const list = mcpEvents
    .filter((e) => (serverId ? e.serverId === serverId : true))
    .filter((e) => matches(filter, e));

  const errorCount = mcpEvents.filter((e) => (serverId ? e.serverId === serverId : true) && e.kind === "error").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-display text-xl">
            <Activity className="h-4 w-4 text-rose-500" /> Activity timeline
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Latest connector events and errors — {errorCount} error{errorCount === 1 ? "" : "s"} in the last 24h.
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-secondary p-0.5">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`relative rounded-md px-2.5 py-1 text-[11px] transition-colors ${filter === f ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {filter === f && <motion.div layoutId={`mcp-act-${serverId ?? "all"}`} className="absolute inset-0 rounded-md bg-background shadow-sm" />}
              <span className="relative">{f}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="surface rounded-xl p-2">
        {list.length === 0 && (
          <p className="px-3 py-6 text-center text-xs text-muted-foreground">No events match this filter.</p>
        )}
        <AnimatePresence initial={false}>
          {list.map((e) => {
            const meta = kindMeta[e.kind];
            const Icon = meta.icon;
            return (
              <motion.div
                key={e.id}
                layout
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary/60"
              >
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${meta.tone}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{e.server}</span>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{meta.label}</span>
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground">{e.at}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{e.message}</p>
                  {e.detail && <p className="mt-0.5 font-mono text-[10px] text-muted-foreground/80">{e.detail}</p>}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
