import { createFileRoute, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { AuthGate } from "@/components/AuthGate";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  Sparkles, FolderKanban, Activity, Zap, Search, Bell, Plus, ArrowUpRight, TrendingUp,
  LayoutGrid, FolderKanban as Folder, Layers, Users, CreditCard, Plug, LogOut, Menu, X,
  MoreVertical, Pencil, Copy, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

type Project = { name: string; type: string; updated: string; color: string };

function ProjectCard({
  p, i, onRename, onDuplicate, onDelete,
}: {
  p: Project; i: number;
  onRename: (p: Project) => void;
  onDuplicate: (p: Project) => void;
  onDelete: (p: Project) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
      whileHover={{ y: -3 }}
      className="surface group relative cursor-pointer overflow-hidden rounded-xl"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label={`Options for ${p.name}`}
            className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-md bg-background/70 text-foreground backdrop-blur-sm transition-opacity hover:bg-background/90 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100 lg:group-focus-within:opacity-100"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => onRename(p)}>
            <Pencil className="h-4 w-4" /> Rename
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onDuplicate(p)}>
            <Copy className="h-4 w-4" /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={() => onDelete(p)}>
            <Trash2 className="h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className={`relative aspect-[16/9] bg-gradient-to-br ${p.color}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4),transparent_60%)]" />
      </div>
      <div className="flex items-center justify-between p-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{p.name}</div>
          <div className="truncate text-xs text-muted-foreground">{p.type}</div>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
          {p.updated}
          <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>
    </motion.div>
  );
}

function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [projectsList, setProjectsList] = useState<Project[]>(recentProjects);
  const [renameTarget, setRenameTarget] = useState<Project | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const openRename = (p: Project) => {
    setRenameTarget(p);
    setRenameValue(p.name);
  };
  const confirmRename = () => {
    const name = renameValue.trim();
    if (name && renameTarget) {
      setProjectsList((list) => list.map((x) => (x.name === renameTarget.name ? { ...x, name } : x)));
    }
    setRenameTarget(null);
  };
  const duplicateProject = (p: Project) => {
    setProjectsList((list) => {
      const idx = list.findIndex((x) => x.name === p.name);
      const copy = { ...p, name: `${p.name} (copy)`, updated: "Just now" };
      const next = [...list];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  };
  const confirmDelete = () => {
    if (deleteTarget) {
      setProjectsList((list) => list.filter((x) => x.name !== deleteTarget.name));
    }
    setDeleteTarget(null);
  };

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
  }, [query]);

  return (
    <div className="mx-auto mt-6 flex max-w-7xl gap-6 px-4 pb-16">
      <aside className="surface sticky top-20 hidden h-[calc(100vh-6rem)] w-52 shrink-0 rounded-xl p-3 lg:block">
        <SidebarNav />
      </aside>

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
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button aria-label="Notifications" className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary">
            <Bell className="h-4 w-4" />
          </button>
          <div className="hidden h-7 w-7 shrink-0 rounded-full bg-[var(--gradient-brand)] sm:block" />
        </div>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">{today}</div>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl">Welcome back, <em className="italic gradient-text">Alex</em></h1>
          </div>
          <Button asChild className="btn-brand">
            <Link to="/workspace"><Plus className="mr-1 h-4 w-4" /> New project</Link>
          </Button>
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
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-display text-xl">
                {query ? `Results for “${query}”` : "Recent projects"}
              </h2>
              <button className="shrink-0 text-xs text-muted-foreground hover:text-foreground">View all →</button>
            </div>
            {projects.length === 0 ? (
              <div className="surface rounded-xl p-6 text-sm text-muted-foreground">
                No projects match “{query}”.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {projects.map((p, i) => (
                  <ProjectCard
                    key={p.name}
                    p={p}
                    i={i}
                    onRename={openRename}
                    onDuplicate={duplicateProject}
                    onDelete={setDeleteTarget}
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

      <Dialog open={renameTarget !== null} onOpenChange={(open) => !open && setRenameTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
            <DialogDescription>Enter a new name for “{renameTarget?.name}”.</DialogDescription>
          </DialogHeader>
          <input
            autoFocus
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && confirmRename()}
            aria-label="Project name"
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameTarget(null)}>Cancel</Button>
            <Button className="btn-brand" onClick={confirmRename} disabled={!renameValue.trim()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="sm:max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {deleteTarget?.name}. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
