import { createFileRoute, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { AuthGate } from "@/components/AuthGate";
import { motion } from "framer-motion";
import {
  Sparkles, FolderKanban, Activity, Zap, Search, Bell, Plus, ArrowUpRight, TrendingUp,
  LayoutGrid, FolderKanban as Folder, Layers, Users, CreditCard, Plug, LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MCPConnections } from "@/components/MCPConnections";
import { stats, recentProjects, activity } from "@/lib/mock-data";
import { signOut } from "@/lib/auth";

const iconMap = { Sparkles, FolderKanban, Activity, Zap };

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Crystal.dev" },
      { name: "description", content: "Your projects, AI usage and team activity at a glance." },
    ],
  }),
  component: () => (
    <AuthGate>
      <Dashboard />
    </AuthGate>
  ),
});

const sidebar = [
  { label: "Overview", icon: LayoutGrid, to: "/dashboard" as const },
  { label: "Projects", icon: Folder },
  { label: "Templates", icon: Layers },
  { label: "Team", icon: Users },
  { label: "MCP connections", icon: Plug, to: "/mcp" as const },
  { label: "Billing", icon: CreditCard },
];

function Dashboard() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  return (
    <div className="mx-auto mt-6 flex max-w-7xl gap-6 px-4 pb-16">
      <aside className="surface sticky top-20 hidden h-[calc(100vh-6rem)] w-52 shrink-0 rounded-xl p-3 lg:block">
        <div className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Workspace</div>
        <nav className="space-y-0.5">
          {sidebar.map((item) => {
            const Icon = item.icon;
            if (!item.to) {
              return (
                <div
                  key={item.label}
                  aria-disabled="true"
                  className="flex w-full cursor-not-allowed items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground opacity-40"
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <span className="text-[9px] uppercase tracking-wider">Soon</span>
                </div>
              );
            }
            const active = pathname === item.to;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-5 rounded-lg border border-border bg-secondary p-3">
          <div className="text-xs font-medium">Upgrade to Pro</div>
          <p className="mt-1 text-[11px] text-muted-foreground">Unlimited apps & exports.</p>
          <Button asChild size="sm" className="mt-2 h-7 w-full text-xs btn-brand">
            <Link to="/pricing">Upgrade</Link>
          </Button>
        </div>

        <button
          onClick={() => {
            signOut();
            navigate({ to: "/", replace: true });
          }}
          className="mt-3 flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </aside>


      <main className="min-w-0 flex-1">
        <div className="surface mb-5 flex items-center gap-2 rounded-xl px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Search projects, templates…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary">
            <Bell className="h-4 w-4" />
          </button>
          <div className="h-7 w-7 rounded-full bg-[var(--gradient-brand)]" />
        </div>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Tuesday, April 17</div>
            <h1 className="mt-1 font-display text-3xl">Welcome back, <em className="italic gradient-text">Alex</em></h1>
          </div>
          <Button asChild className="btn-brand">
            <Link to="/workspace"><Plus className="mr-1 h-4 w-4" /> New project</Link>
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((s, i) => {
            const Icon = iconMap[s.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="surface rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary">
                    <Icon className="h-4 w-4 text-rose-500" />
                  </div>
                  <span className="text-[11px] text-muted-foreground">{s.change}</span>
                </div>
                <div className="mt-3 font-display text-3xl">{s.value}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-[2fr_1fr]">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl">Recent projects</h2>
              <button className="text-xs text-muted-foreground hover:text-foreground">View all →</button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {recentProjects.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -3 }}
                  className="surface group cursor-pointer overflow-hidden rounded-xl"
                >
                  <div className={`relative aspect-[16/9] bg-gradient-to-br ${p.color}`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4),transparent_60%)]" />
                  </div>
                  <div className="flex items-center justify-between p-3">
                    <div>
                      <div className="text-sm font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.type}</div>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      {p.updated}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <MCPConnections compact />

            <div>
              <h2 className="mb-3 font-display text-xl">Activity</h2>
              <div className="surface rounded-xl p-4">
                <ul className="space-y-3">
                  {activity.map((a, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <div className="relative">
                        <div className="h-1.5 w-1.5 rounded-full bg-rose-400 ring-4 ring-rose-100" />
                        {i < activity.length - 1 && <div className="absolute left-1/2 top-3 h-7 w-px -translate-x-1/2 bg-border" />}
                      </div>
                      <div className="pb-1">
                        <div><span className="font-medium">{a.who}</span> <span className="text-muted-foreground">{a.what}</span> <span className="font-medium">{a.target}</span></div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">{a.when}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="surface rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-rose-500" />
                <h3 className="font-display text-lg">AI Suggestion</h3>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Try generating a "Habit tracker with social streaks" — trending in your niche.</p>
              <Button asChild size="sm" className="mt-3 h-7 w-full text-xs" variant="outline">
                <Link to="/workspace">Try it</Link>
              </Button>
            </div>

            <div>
              <h2 className="mb-3 flex items-center gap-2 font-display text-xl">
                <TrendingUp className="h-4 w-4 text-rose-500" /> Trending
              </h2>
              <div className="space-y-1.5">
                {["AI SaaS Starter", "Indie Maker Blog", "Crypto Tracker", "Fitness Coach"].map((t) => (
                  <div key={t} className="surface flex items-center justify-between rounded-md px-3 py-2 text-sm">
                    {t}
                    <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
