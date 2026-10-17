import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthGate } from "@/components/AuthGate";
import { motion, AnimatePresence } from "framer-motion";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, Wand2, Save, ChevronRight, Loader2, ArrowRight, CornerDownLeft, Hammer, NotebookPen, Gauge, Feather } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories, promptSuggestions, generatedPages, generatedPalette, generatedFeatures } from "@/lib/mock-data";

export const Route = createFileRoute("/builder")({
  head: () => ({
    meta: [
      { title: "Builder — Crystal.dev" },
      { name: "description", content: "Describe your idea and watch Crystal design the app, pages, branding and features." },
      { property: "og:title", content: "Builder — Crystal.dev" },
      { property: "og:description", content: "Describe your idea and watch Crystal design the app, pages, branding and features." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AuthGate>
      <Builder />
    </AuthGate>
  ),
});

const templates = [
  { name: "SaaS Dashboard", color: "from-rose-300 to-amber-300" },
  { name: "Marketplace", color: "from-pink-300 to-rose-300" },
  { name: "AI Chatbot", color: "from-violet-300 to-indigo-300" },
  { name: "Portfolio", color: "from-amber-300 to-orange-300" },
  { name: "Fitness App", color: "from-emerald-300 to-teal-300" },
];

export const effortLevels = [
  { id: "low", label: "Low", desc: "Fast, minimal reasoning — small tweaks", cost: "~1x" },
  { id: "medium", label: "Medium", desc: "Balanced — most tasks", cost: "~2x" },
  { id: "high", label: "High", desc: "Deeper reasoning — complex features", cost: "~4x" },
  { id: "max", label: "Max", desc: "Maximum reasoning — hardest problems, uses the most credits", cost: "~8x" },
] as const;

function Builder() {
  const [prompt, setPrompt] = useState("");
  const [activeCat, setActiveCat] = useState("SaaS");
  const [generating, setGenerating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [mode, setMode] = useState<"build" | "plan">("build");
  const [effort, setEffort] = useState<(typeof effortLevels)[number]["id"]>("medium");
  const [hoverEffort, setHoverEffort] = useState<string | null>(null);
  const [planning, setPlanning] = useState(false);
  const [plan, setPlan] = useState<string[] | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const shownEffort = effortLevels.find((e) => e.id === (hoverEffort ?? effort))!;
  const effortIdx = effortLevels.findIndex((e) => e.id === effort);

  // Prefill from a prompt typed on the landing page.
  useEffect(() => {
    try {
      const seed = typeof window !== "undefined" ? window.localStorage.getItem("crystal:prompt") : null;
      if (seed) setPrompt(seed);
    } catch { /* ignore */ }
  }, []);


  const generate = () => {
    if (mode === "plan") {
      setPlanning(true);
      setPlan(null);
      setTimeout(() => {
        setPlanning(false);
        const idea = prompt.trim() || "your idea";
        setPlan([
          `Scope: a focused first version of ${idea}.`,
          "Pages: Landing, Auth (login / signup), Dashboard, Detail view, Settings.",
          "Data model: users, projects, items, activity_log — with per-user ownership.",
          "Key flows: sign up → create first project → invite a teammate → publish.",
          "Open questions: who pays (individual or team?), do you need offline support, which regions/currencies?",
          "Suggested next step: switch to Build mode with Medium effort and generate the Dashboard first.",
        ]);
      }, 1200);
      return;
    }
    setGenerating(true);
    setTimeout(() => setGenerating(false), 1600);
  };


  const filtered = useMemo(() => {
    const q = prompt.trim().toLowerCase();
    if (!q) return promptSuggestions.slice(0, 6);
    return promptSuggestions.filter((s) => s.toLowerCase().includes(q)).slice(0, 6);
  }, [prompt]);

  useEffect(() => {
    if (activeIdx >= filtered.length) setActiveIdx(0);
  }, [filtered.length, activeIdx]);

  const insertSuggestion = (s: string) => {
    setPrompt(s);
    setShowSuggestions(false);
    setActiveIdx(0);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions && filtered.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => (i + 1) % filtered.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => (i - 1 + filtered.length) % filtered.length);
        return;
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        insertSuggestion(filtered[activeIdx]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setShowSuggestions(false);
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        insertSuggestion(filtered[activeIdx]);
        return;
      }
    }
  };

  return (
    <div className="mx-auto mt-8 max-w-7xl px-4 pb-16">
      <Link to="/dashboard" className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">← Dashboard</Link>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Builder</div>
        <h1 className="mt-1 font-display text-3xl md:text-4xl">Describe what you want to build</h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <div className="relative">
            {/* Inline suggestions dropdown — anchored above the prompt box */}
            <AnimatePresence>
              {showSuggestions && filtered.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="surface absolute bottom-full left-0 right-0 z-20 mb-2 overflow-hidden rounded-xl p-1 shadow-lg"
                  role="listbox"
                  aria-label="Prompt suggestions"
                >
                  <div className="flex items-center justify-between px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Sparkles className="h-3 w-3 text-rose-500" /> Suggestions</span>
                    <span className="hidden sm:flex items-center gap-1">
                      <kbd className="rounded border border-border bg-secondary px-1 py-0.5 text-[9px]">↑</kbd>
                      <kbd className="rounded border border-border bg-secondary px-1 py-0.5 text-[9px]">↓</kbd>
                      to navigate ·
                      <kbd className="rounded border border-border bg-secondary px-1 py-0.5 text-[9px]">↵</kbd>
                      to insert
                    </span>
                  </div>
                  <ul>
                    {filtered.map((s, i) => (
                      <li key={s}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={i === activeIdx}
                          onMouseEnter={() => setActiveIdx(i)}
                          onMouseDown={(e) => { e.preventDefault(); insertSuggestion(s); }}
                          className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                            i === activeIdx ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60"
                          }`}
                        >
                          <span className="truncate">{s}</span>
                          {i === activeIdx && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-rose-500" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="surface rounded-2xl p-5">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <div className="flex gap-1 rounded-lg border border-border bg-secondary p-0.5">
                  {([
                    { id: "build", label: "Build", Icon: Hammer },
                    { id: "plan", label: "Plan", Icon: NotebookPen },
                  ] as const).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors ${
                        mode === m.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {mode === m.id && <motion.div layoutId="builder-mode" className="absolute inset-0 rounded-md bg-background shadow-sm" />}
                      <span className="relative flex items-center gap-1.5"><m.Icon className="h-3.5 w-3.5" /> {m.label}</span>
                    </button>
                  ))}
                </div>
                {mode === "plan" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                    <Feather className="h-3 w-3" /> Lightweight · No credits used
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[10px] text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-rose-500" /> Generates code · uses credits
                  </span>
                )}
                <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-rose-500" /> AI prompt
                </div>
              </div>

              {/* Effort selector */}
              <div className="mb-3 rounded-xl border border-border bg-secondary/60 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <Gauge className="h-3.5 w-3.5" /> Effort
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Est. cost <span className="font-mono text-foreground">{effortLevels[effortIdx].cost}</span>
                  </div>
                </div>
                <div className="relative mt-2 flex gap-1 rounded-lg border border-border bg-background p-1" role="group" aria-label="Effort level">
                  {effortLevels.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setEffort(l.id)}
                      onMouseEnter={() => setHoverEffort(l.id)}
                      onMouseLeave={() => setHoverEffort(null)}
                      aria-pressed={effort === l.id}
                      className={`relative flex-1 rounded-md px-2 py-2 text-xs transition-colors ${
                        effort === l.id ? "text-background" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {effort === l.id && <motion.div layoutId="builder-effort" className="absolute inset-0 rounded-md bg-foreground" />}
                      <span className="relative flex flex-col items-center gap-0.5">
                        <span className="font-medium">{l.label}</span>
                        <span className={`font-mono text-[9px] ${effort === l.id ? "opacity-70" : "opacity-60"}`}>{l.cost}</span>
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">{shownEffort.desc}</p>
              </div>

              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => { setPrompt(e.target.value); setShowSuggestions(true); setActiveIdx(0); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
                onKeyDown={onKeyDown}
                placeholder={mode === "plan" ? "Talk through the idea — no code will be generated…" : "Describe the app you want to build…"}
                aria-autocomplete="list"
                aria-expanded={showSuggestions && filtered.length > 0}
                className="h-32 w-full resize-none bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
              <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
                <Button onClick={generate} disabled={generating || planning} className="btn-brand">
                  {mode === "plan" ? (
                    planning ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Thinking</> : <><NotebookPen className="mr-2 h-4 w-4" /> Discuss plan</>
                  ) : generating ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Generate</>
                  )}
                </Button>
                <Button variant="outline">
                  <Wand2 className="mr-2 h-4 w-4" /> Improve
                </Button>
                <Button variant="outline">
                  <Save className="mr-2 h-4 w-4" /> Save draft
                </Button>
                <div className="ml-auto text-xs text-muted-foreground">{prompt.length} / 1000</div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {mode === "plan" && (planning || plan) && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="surface rounded-2xl p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="flex items-center gap-2 font-display text-lg"><NotebookPen className="h-4 w-4 text-rose-500" /> Plan</h3>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">No credits used</span>
                </div>
                {planning ? (
                  <div className="mt-3 space-y-2">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="h-3 animate-pulse rounded bg-secondary" style={{ width: `${90 - i * 12}%` }} />
                    ))}
                  </div>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {plan?.map((line) => (
                      <li key={line} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-rose-500" /> {line}
                      </li>
                    ))}
                  </ul>
                )}
                {!planning && (
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="btn-brand" onClick={() => setMode("build")}>
                      Switch to Build <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => setPlan(null)}>Clear</Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>


          <SuggestionList onPick={setPrompt} />



          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</div>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCat(c)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    activeCat === c
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <TemplateStrip />

        </div>

        <PreviewPanel generating={generating} />

      </div>
    </div>
  );
}

/** Memoized so typing in the prompt textarea doesn't re-render these subtrees. */
const SuggestionList = memo(function SuggestionList({ onPick }: { onPick: (s: string) => void }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suggestions</div>
      <div className="space-y-1.5">
        {promptSuggestions.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="surface group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm hover:bg-secondary"
          >
            <span>{s}</span>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </button>
        ))}
      </div>
    </div>
  );
});

const TemplateStrip = memo(function TemplateStrip() {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Templates</div>
      <div className="scrollbar-thin flex gap-3 overflow-x-auto pb-2">
        {templates.map((t) => (
          <motion.div whileHover={{ y: -3 }} key={t.name} className="surface shrink-0 cursor-pointer rounded-xl p-2">
            <div className={`h-20 w-36 rounded-lg bg-gradient-to-br ${t.color}`} />
            <div className="mt-2 px-1 text-xs font-medium">{t.name}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

const PreviewPanel = memo(function PreviewPanel({ generating }: { generating: boolean }) {
  return (
    <aside className="surface sticky top-20 h-fit rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg">Live preview</h3>
        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-medium text-rose-700">AI</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={generating ? "loading" : "ready"}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          className="space-y-4"
        >
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pages</div>
            <div className="grid grid-cols-2 gap-1.5">
              {generatedPages.map((p) => (
                <div key={p} className="rounded-md border border-border bg-secondary px-2 py-1.5 text-xs">{p}</div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Palette</div>
            <div className="flex gap-1.5">
              {generatedPalette.map((c) => (
                <div key={c} className="flex-1">
                  <div className="h-10 rounded-md border border-border" style={{ backgroundColor: c }} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Features</div>
            <ul className="space-y-1">
              {generatedFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-1 w-1 rounded-full bg-rose-500" /> {f}
                </li>
              ))}
            </ul>
          </div>

          <Button asChild className="btn-brand w-full">
            <Link to="/workspace">Open in workspace <ArrowRight className="ml-1 h-3 w-3" /></Link>
          </Button>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
});
