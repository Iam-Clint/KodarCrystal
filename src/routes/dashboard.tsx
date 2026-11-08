import { createFileRoute, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { AuthGate } from "@/components/AuthGate";
import { motion } from "framer-motion";
import { useMemo, useState, useCallback } from "react";
import {
  Sparkles, FolderKanban, Activity, Zap, Search, Bell, Plus, ArrowUpRight, TrendingUp,
  LayoutGrid, FolderKanban as Folder, Layers, Users, CreditCard, Plug, LogOut, Menu, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ProjectIntakeDialog } from "@/components/ProjectIntakeDialog";
import { ProjectCard, type Project } from "@/components/ProjectCard";
import { MCPConnections } from "@/components/MCPConnections";
import { stats, recentProjects, activity } from "@/lib/mock-data";
import { signOut } from "@/lib/auth";
import { useLocalProjects, updateLocalProjects, createLocalProject } from "@/lib/projects";

const iconMap = { Sparkles, FolderKanban, Activity, Zap };

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — KodarCrystal" },
      { name: "description", content: "Your projects, AI usage and team activity at a glance." },
      { property: "og:title", content: "Dashboard — KodarCrystal" },
      { property: "og:description", content: "Your projects, AI usage and team activity at a glance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Workspace</div>
      <nav className="space-y-0.5">
        {sidebar.map((item) => {
          const Icon = item.icon;
          if (!item.to) {
            return (
              <div
                key={item.label}
                aria-disabled="true"
                className="flex w-full cursor-not-allowed items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground opacity-40 lg:py-1.5"
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
              onClick={onNavigate}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm transition-colors lg:py-1.5 ${
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
        <Button asChild size="sm" className="mt-2 h-9 w-full text-xs btn-brand lg:h-7">
          <Link to="/pricing" onClick={onNavigate}>Upgrade</Link>
        </Button>
      </div>

      <button
        onClick={() => {
          onNavigate?.();
          signOut();
          navigate({ to: "/", replace: true });
        }}
        className="mt-3 flex min-h-11 w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:min-h-0"
      >
        <LogOut className="h-4 w-4" /> Log out
      </button>
    </>
  );
}

function Dashboard() {
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const projectsList = useLocalProjects();
  const updateProject = useCallback((id: string, patch: Partial<Project>) => updateLocalProjects(list => list.map(p => p.id === id ? {...p,...patch,id:p.id,updated:"Just now"} : p)), []);
  const duplicateProject = useCallback((p: Project) => { createLocalProject({...p,name:`${p.name} (copy)`}); }, []);
  const deleteProject = useCallback((id: string) => updateLocalProjects(list => list.filter(p => p.id !== id)), []);

  const today = useMemo(
    () => new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
    [],
  );

  const projects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projectsList;
    return projectsList.filter(
      (p) => p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q),
    );
  }, [query, projectsList]);

  return (
    <div className="mx-auto mt-6 flex max-w-7xl gap-6 px-4 pb-16">
      <aside className="surface sticky top-20 hidden h-[calc(100vh-6rem)] w-52 shrink-0 rounded-xl p-3 lg:block">
        <SidebarNav />
      </aside>

      <ProjectIntakeDialog key={intakeOpen ? "new" : "closed"} open={intakeOpen} onOpenChange={setIntakeOpen} />
      <main className="min-w-0 flex-1">
        <div className="surface mb-5 flex items-center gap-2 rounded-xl px-2 py-2 sm:px-3">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open navigation menu"
                className="flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[17rem] overflow-y-auto p-3 pt-12">
              <SheetTitle className="sr-only">Workspace navigation</SheetTitle>
              <SidebarNav onNavigate={() => setMenuOpen(false)} />
            </SheetContent>
          </Sheet>

          <Search className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search projects"
            placeholder="Search projects, templates…"
            className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button aria-label="Notifications" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary">
            <Bell className="h-4 w-4" />
          </button>
          <Link to="/settings" aria-label="Open settings" className="hidden shrink-0 sm:block"><div className="h-7 w-7 rounded-full bg-[var(--gradient-brand)]" /></Link>
        </div>

        <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 sm:flex sm:justify-between">
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">{today}</div>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl">Welcome back, <em className="italic gradient-text">there</em></h1>
          </div>
          <Button className="btn-brand min-h-11" onClick={() => setIntakeOpen(true)}><Plus className="mr-1 h-4 w-4" /> New project</Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
                    <Icon className="h-4 w-4 text-brand" />
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
            <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <h2 className="min-w-0 truncate font-display text-xl">
                {query ? `Results for “${query}”` : "Recent projects"}
              </h2>
              <Link to="/community" className="shrink-0 text-xs text-muted-foreground hover:text-foreground">View all →</Link>
            </div>
            {projects.length === 0 ? (
              <div className="surface rounded-xl p-6 text-sm text-muted-foreground">
                No projects match “{query}”.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {projects.map((p, i) => (
                  <ProjectCard
                    key={p.id}
                    p={p}
                    i={i}
                    onUpdate={updateProject}
                    onDuplicate={duplicateProject}
                    onDelete={deleteProject}
                  />
                ))}
              </div>
            )}
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
                        <div className="h-1.5 w-1.5 rounded-full bg-brand ring-4 ring-border" />
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
                <Sparkles className="h-4 w-4 text-brand" />
                <h3 className="font-display text-lg">AI Suggestion</h3>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Try generating a "Habit tracker with social streaks" — trending in your niche.</p>
              <Button asChild size="sm" className="mt-3 h-7 w-full text-xs" variant="outline">
                <Link to="/builder">Try it</Link>
              </Button>
            </div>

            <div>
              <h2 className="mb-3 flex items-center gap-2 font-display text-xl">
                <TrendingUp className="h-4 w-4 text-brand" /> Trending
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
