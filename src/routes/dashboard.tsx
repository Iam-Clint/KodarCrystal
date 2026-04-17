import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles, FolderKanban, Activity, Zap, Search, Bell, Plus, ArrowUpRight, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { stats, recentProjects, activity } from "@/lib/mock-data";

const iconMap = { Sparkles, FolderKanban, Activity, Zap };

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Prompt to App" },
      { name: "description", content: "Your generated apps, projects, AI usage and team activity at a glance." },
    ],
  }),
  component: Dashboard,
});

const sidebar = [
  { label: "Overview", icon: "Home" },
  { label: "Projects", icon: "Folder" },
  { label: "Templates", icon: "Layout" },
  { label: "Team", icon: "Users" },
  { label: "Billing", icon: "Card" },
];

function Dashboard() {
  return (
    <div className="mx-auto mt-6 flex max-w-7xl gap-6 px-4 pb-16">
      {/* Sidebar */}
      <aside className="glass-strong sticky top-24 hidden h-[calc(100vh-7rem)] w-56 shrink-0 rounded-2xl p-4 lg:block">
        <div className="mb-4 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Workspace</div>
        <nav className="space-y-1">
          {sidebar.map((item, i) => (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                i === 0 ? "bg-gradient-to-r from-[var(--glow-purple)]/20 to-transparent text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-current opacity-60" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-6 rounded-xl border border-white/10 bg-gradient-to-br from-[var(--glow-purple)]/20 to-[var(--glow-blue)]/10 p-4">
          <div className="text-xs font-semibold">Upgrade to Pro</div>
          <p className="mt-1 text-[11px] text-muted-foreground">Unlock unlimited apps & exports.</p>
          <Button asChild size="sm" className="mt-3 w-full bg-white text-black hover:bg-white/90">
            <Link to="/pricing">Upgrade</Link>
          </Button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        {/* Top bar */}
        <div className="glass mb-6 flex items-center gap-3 rounded-2xl px-4 py-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search apps, templates, prompts..."
              className="w-full bg-transparent pl-9 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 hover:bg-white/10">
            <Bell className="h-4 w-4 text-muted-foreground" />
          </button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[var(--glow-purple)] to-[var(--glow-blue)] ring-2 ring-white/10" />
        </div>

        {/* Welcome */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs text-muted-foreground">Tuesday, April 17</div>
            <h1 className="mt-1 font-display text-3xl font-bold">Welcome back, <span className="gradient-text">Alex</span></h1>
          </div>
          <Button asChild className="bg-gradient-to-r from-[var(--glow-purple)] to-[var(--glow-blue)] text-white">
            <Link to="/builder"><Plus className="mr-1 h-4 w-4" /> New App</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((s, i) => {
            const Icon = iconMap[s.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className="glass gradient-border rounded-2xl p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--glow-purple)]/30 to-[var(--glow-blue)]/30">
                    <Icon className="h-4 w-4 text-[var(--glow-cyan)]" />
                  </div>
                  <span className="text-[11px] text-[var(--glow-cyan)]">{s.change}</span>
                </div>
                <div className="mt-4 font-display text-3xl font-bold">{s.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Projects + Activity */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Recent projects</h2>
              <button className="text-xs text-muted-foreground hover:text-foreground">View all →</button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {recentProjects.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="glass gradient-border group cursor-pointer rounded-2xl p-4"
                >
                  <div className={`relative h-24 overflow-hidden rounded-xl bg-gradient-to-br ${p.color}`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_50%)]" />
                    <div className="absolute bottom-2 right-2 rounded-md bg-black/30 p-1.5 backdrop-blur opacity-0 transition-opacity group-hover:opacity-100">
                      <ArrowUpRight className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.type}</div>
                    </div>
                    <div className="text-[11px] text-muted-foreground">{p.updated}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="mb-4 font-display text-lg font-semibold">Activity</h2>
              <div className="glass rounded-2xl p-5">
                <ul className="space-y-4">
                  {activity.map((a, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <div className="relative">
                        <div className="h-2 w-2 rounded-full bg-[var(--glow-purple)] ring-4 ring-[var(--glow-purple)]/20" />
                        {i < activity.length - 1 && <div className="absolute left-1/2 top-3 h-8 w-px -translate-x-1/2 bg-white/10" />}
                      </div>
                      <div className="pb-2">
                        <div><span className="font-medium">{a.who}</span> <span className="text-muted-foreground">{a.what}</span> <span className="font-medium gradient-text">{a.target}</span></div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">{a.when}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="glass-strong gradient-border rounded-2xl p-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[var(--glow-cyan)]" />
                <h3 className="font-display font-semibold">AI Suggestions</h3>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Try generating a "Habit tracker with social streaks" — trending in your niche this week.</p>
              <Button asChild size="sm" className="mt-4 w-full bg-white/10 hover:bg-white/15">
                <Link to="/builder">Try it</Link>
              </Button>
            </div>

            <div>
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
                <TrendingUp className="h-4 w-4 text-[var(--glow-cyan)]" /> Trending templates
              </h2>
              <div className="space-y-2">
                {["AI SaaS Starter", "Indie Maker Blog", "Crypto Tracker", "Fitness Coach"].map((t) => (
                  <div key={t} className="glass flex items-center justify-between rounded-xl px-4 py-2.5 text-sm hover:bg-white/10">
                    {t}
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
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
