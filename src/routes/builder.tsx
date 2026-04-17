import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Sparkles, Wand2, Save, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories, promptSuggestions, generatedPages, generatedPalette, generatedFeatures } from "@/lib/mock-data";

export const Route = createFileRoute("/builder")({
  head: () => ({
    meta: [
      { title: "Prompt Builder — Prompt to App" },
      { name: "description", content: "Describe your idea and watch AI design the app, pages, branding and features in real time." },
    ],
  }),
  component: Builder,
});

const templates = [
  { name: "SaaS Dashboard", color: "from-purple-500 to-blue-500" },
  { name: "Marketplace", color: "from-pink-500 to-purple-500" },
  { name: "AI Chatbot", color: "from-cyan-400 to-blue-500" },
  { name: "Portfolio", color: "from-amber-400 to-pink-500" },
  { name: "Fitness App", color: "from-emerald-400 to-cyan-500" },
];

function Builder() {
  const [prompt, setPrompt] = useState("");
  const [activeCat, setActiveCat] = useState("SaaS");
  const [generating, setGenerating] = useState(false);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 1800);
  };

  return (
    <div className="mx-auto mt-8 max-w-7xl px-4 pb-16">
      <div className="mb-6">
        <div className="text-xs uppercase tracking-widest text-[var(--glow-cyan)]">Prompt Builder</div>
        <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Describe what you want to build</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* LEFT — prompt */}
        <div className="space-y-6">
          <div className="glass-strong gradient-border rounded-3xl p-6">
            <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-[var(--glow-cyan)]" /> AI prompt
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the app you want to build..."
              className="h-40 w-full resize-none bg-transparent text-lg outline-none placeholder:text-muted-foreground"
            />
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/5 pt-4">
              <Button onClick={generate} disabled={generating} className="bg-gradient-to-r from-[var(--glow-purple)] to-[var(--glow-blue)] text-white">
                {generating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate App</>}
              </Button>
              <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
                <Wand2 className="mr-2 h-4 w-4" /> Improve Prompt
              </Button>
              <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
                <Save className="mr-2 h-4 w-4" /> Save Draft
              </Button>
              <div className="ml-auto text-xs text-muted-foreground">{prompt.length} / 1000</div>
            </div>
          </div>

          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prompt suggestions</div>
            <div className="space-y-2">
              {promptSuggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setPrompt(s)}
                  className="glass group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-all hover:bg-white/10"
                >
                  <span>{s}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCat(c)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                    activeCat === c
                      ? "border-transparent bg-gradient-to-r from-[var(--glow-purple)] to-[var(--glow-blue)] text-white shadow-[0_4px_15px_-3px_var(--glow-purple)]"
                      : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Templates</div>
            <div className="scrollbar-thin flex gap-3 overflow-x-auto pb-2">
              {templates.map((t) => (
                <motion.div
                  whileHover={{ y: -4 }}
                  key={t.name}
                  className="glass shrink-0 cursor-pointer rounded-2xl p-3"
                >
                  <div className={`h-24 w-40 rounded-lg bg-gradient-to-br ${t.color}`} />
                  <div className="mt-2 text-sm font-medium">{t.name}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — preview panel */}
        <aside className="glass-strong gradient-border sticky top-24 h-fit rounded-3xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Live Preview</h3>
            <span className="rounded-full bg-[var(--glow-cyan)]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--glow-cyan)]">AI</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={generating ? "loading" : "ready"}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Generated pages</div>
                <div className="grid grid-cols-2 gap-2">
                  {generatedPages.map((p) => (
                    <div key={p} className="rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-xs">{p}</div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Color palette</div>
                <div className="flex gap-2">
                  {generatedPalette.map((c) => (
                    <div key={c} className="flex-1">
                      <div className="h-12 rounded-lg ring-1 ring-white/10" style={{ backgroundColor: c }} />
                      <div className="mt-1 text-center font-mono text-[10px] text-muted-foreground">{c}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Features</div>
                <ul className="space-y-1.5">
                  {generatedFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--glow-cyan)]" /> {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Wireframes</div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-[3/4] rounded-lg bg-gradient-to-br from-white/10 to-white/5 p-1.5">
                      <div className="h-2 w-2/3 rounded bg-white/20" />
                      <div className="mt-1 h-1 w-full rounded bg-white/10" />
                      <div className="mt-1 h-1 w-3/4 rounded bg-white/10" />
                      <div className="mt-2 grid grid-cols-2 gap-0.5">
                        <div className="h-4 rounded bg-white/10" />
                        <div className="h-4 rounded bg-white/10" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button asChild className="w-full bg-gradient-to-r from-[var(--glow-purple)] to-[var(--glow-blue)] text-white">
                <Link to="/results">View Full Result</Link>
              </Button>
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}
