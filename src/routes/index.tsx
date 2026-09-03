import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUp, Paperclip, Globe, Sparkles, Heart, Eye, GitFork, Wand2,
  ShoppingBag, BarChart3, Briefcase, GraduationCap, Smartphone, Users,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Crystal.dev — Prompt to App Builder" },
      { name: "description", content: "Create apps and websites by chatting with AI. From idea to deployed product in minutes." },
      { property: "og:title", content: "Crystal.dev — Prompt to App Builder" },
      { property: "og:description", content: "Create apps and websites by chatting with AI." },
    ],
  }),
  component: Landing,
});

const templates = [
  { label: "SaaS landing", icon: Briefcase },
  { label: "E-commerce", icon: ShoppingBag },
  { label: "Dashboard", icon: BarChart3 },
  { label: "Portfolio", icon: Smartphone },
  { label: "Education", icon: GraduationCap },
  { label: "Social app", icon: Users },
];

const rotatingPlaceholders = [
  "a landing page for a coffee shop with online ordering…",
  "a habit tracker with social streaks and friend leaderboards…",
  "an AI resume builder with real-time preview…",
  "a minimalist project management tool for indie makers…",
  "a marketplace for handmade ceramics with Stripe checkout…",
];

const trendingSuggestions = [
  { title: "AI SaaS starter with pricing page", tag: "Popular" },
  { title: "Notion-style docs app with dark mode", tag: "Trending" },
  { title: "Fitness coach with workout tracker", tag: "New" },
  { title: "Crypto portfolio dashboard", tag: "Popular" },
];

function getContextualSuggestions(prompt: string) {
  const p = prompt.toLowerCase();
  const suggestions: { title: string; add: string }[] = [];
  if (!p) return [];
  if (!p.includes("dark")) suggestions.push({ title: "Add dark mode toggle", add: " with a dark mode toggle" });
  if (!p.includes("auth") && !p.includes("login")) suggestions.push({ title: "Add user authentication", add: " with email + Google login" });
  if (!p.includes("payment") && !p.includes("stripe")) suggestions.push({ title: "Add Stripe payments", add: " and Stripe checkout" });
  if (!p.includes("mobile") && !p.includes("responsive")) suggestions.push({ title: "Make it mobile responsive", add: ", fully mobile responsive" });
  if (!p.includes("dashboard")) suggestions.push({ title: "Include an admin dashboard", add: " with an admin dashboard" });
  return suggestions.slice(0, 3);
}

const community = [
  { title: "Lumen Finance", author: "maya", remixes: 1248, views: "18.2k", grad: "from-rose-300 via-orange-200 to-amber-200" },
  { title: "Orbit Notes", author: "diego", remixes: 932, views: "12.4k", grad: "from-violet-300 via-fuchsia-200 to-rose-200" },
  { title: "Pulse Health", author: "priya", remixes: 814, views: "9.7k", grad: "from-emerald-200 via-teal-200 to-cyan-200" },
  { title: "Forge LMS", author: "sam", remixes: 712, views: "8.1k", grad: "from-amber-200 via-rose-200 to-pink-300" },
  { title: "Echo Social", author: "kai", remixes: 689, views: "7.8k", grad: "from-sky-200 via-indigo-200 to-violet-300" },
  { title: "Atlas Store", author: "rin", remixes: 542, views: "6.2k", grad: "from-pink-300 via-rose-200 to-orange-200" },
];

function Landing() {
  const [prompt, setPrompt] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setPlaceholderIdx((i) => (i + 1) % rotatingPlaceholders.length), 3200);
    return () => clearInterval(t);
  }, []);

  const contextual = useMemo(() => getContextualSuggestions(prompt), [prompt]);
  const pickTemplate = useCallback((label: string) => setPrompt(`Build a ${label.toLowerCase()} for…`), []);

  const showTrending = prompt.trim().length === 0;

  const submit = () => {
    if (!prompt.trim()) return;
    try { window.localStorage.setItem("crystal:prompt", prompt.trim()); } catch { /* ignore */ }
    navigate({ to: "/signup" });
  };


  return (
    <main className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-bg" />
        <div className="mx-auto max-w-3xl px-4 pt-24 pb-20 text-center sm:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
          >
            <Sparkles className="h-3 w-3 text-rose-500" />
            Used by builders across Nigeria
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-6 font-display text-5xl font-normal leading-[1.05] tracking-tight md:text-7xl"
          >
            Build something <em className="italic gradient-text">beautiful</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            Crystal.dev is a prompt to app builder — describe your idea, watch it become a real product.
          </motion.p>

          {/* Prompt composer */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-10 w-full max-w-2xl"
          >
            {/* Interactive suggestions — sit right above the prompt box */}
            <div className="mb-3 min-h-[92px]">
              <AnimatePresence mode="wait">
                {showTrending ? (
                  <motion.div
                    key="trending"
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
                      <Sparkles className="h-3 w-3 text-rose-500" /> Try one of these
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {trendingSuggestions.map((s) => (
                        <button
                          key={s.title}
                          onClick={() => setPrompt(s.title)}
                          className="surface group flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <span className="truncate">{s.title}</span>
                          <span className="ml-2 shrink-0 rounded-full bg-secondary px-1.5 py-0.5 text-[10px] text-foreground/70">{s.tag}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : contextual.length > 0 ? (
                  <motion.div
                    key="contextual"
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
                      <Wand2 className="h-3 w-3 text-rose-500" /> Enhance your prompt
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {contextual.map((s) => (
                        <button
                          key={s.title}
                          onClick={() => setPrompt((p) => p.trimEnd() + s.add)}
                          className="surface flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <span className="text-rose-500">+</span> {s.title}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <div className="surface group relative rounded-2xl p-3 transition-shadow focus-within:shadow-[0_20px_50px_-20px_oklch(0.7_0.2_0/0.3)]">
              <div className="absolute -inset-px -z-10 rounded-2xl bg-[var(--gradient-brand)] opacity-0 blur-xl transition-opacity group-focus-within:opacity-30" />
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
                placeholder={`Ask Crystal.dev to build ${rotatingPlaceholders[placeholderIdx]}`}
                className="min-h-20 w-full resize-none bg-transparent px-3 py-2 text-base outline-none placeholder:text-muted-foreground"
              />
              <div className="flex items-center justify-between gap-2 px-1 pt-1">
                <div className="flex items-center gap-1">
                  <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-accent">
                    <Globe className="h-3.5 w-3.5" /> Public
                  </button>
                </div>
                <button
                  onClick={submit}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background transition-opacity hover:opacity-90 disabled:opacity-40"
                  disabled={!prompt.trim()}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>


            {/* template chips */}
            <TemplateChips onSelect={pickTemplate} />

          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="mt-12 text-xs text-muted-foreground"
          >
            Popular with developers in Lagos, Abuja and beyond · No credit card required
          </motion.div>
        </div>
      </section>

      {/* FROM THE COMMUNITY */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">From the community</div>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">Popular this week</h2>
          </div>
          <Link to="/community" className="text-sm text-muted-foreground hover:text-foreground">View all →</Link>
        </div>

        <CommunityGrid />

      </section>

      {/* HOW IT WORKS — minimal */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="grid gap-12 md:grid-cols-3">
          {[
            { n: "01", t: "Describe", d: "Type what you want to build in plain English." },
            { n: "02", t: "Generate", d: "Crystal.dev writes the code, designs the UI, and wires it up." },
            { n: "03", t: "Ship", d: "Preview live, iterate by chatting, deploy in one click." },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="text-xs font-mono text-muted-foreground">{s.n}</div>
              <h3 className="mt-2 font-display text-2xl">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-4 pb-24 text-center">
        <h2 className="font-display text-4xl md:text-5xl">Start building <em className="italic gradient-text">today</em></h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">Join creators across Nigeria turning ideas into shipped products with Crystal.dev.</p>
        <Link to="/workspace" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm text-background hover:opacity-90">
          <Heart className="h-4 w-4 fill-current" /> Start for free
        </Link>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-xs text-muted-foreground">
          <div>© 2026 Crystal.dev</div>
          <div className="flex gap-6">
            <Link to="/pricing">Pricing</Link>
            <Link to="/community">Community</Link>
            <a href="#">Docs</a>
            <a href="#">Privacy</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

/** Static below-the-fold grid — memoized so typing in the composer never re-renders it. */
const CommunityGrid = memo(function CommunityGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {community.map((p, i) => (
        <motion.button
          key={p.title}
          initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          whileHover={{ y: -4 }}
          className="group surface overflow-hidden rounded-2xl text-left"
        >
          <div className={`relative aspect-[16/10] bg-gradient-to-br ${p.grad}`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.5),transparent_60%)]" />
            <div className="absolute inset-x-0 bottom-0 flex h-12 items-center gap-1 bg-white/60 px-3">
              <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
              <div className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
              <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
              <div className="ml-2 truncate text-[10px] text-foreground/70">{p.title.toLowerCase().replace(/\s+/g, "")}.crystal.app</div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-xs text-muted-foreground">by @{p.author}</div>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {p.views}</span>
              <span className="flex items-center gap-1"><GitFork className="h-3 w-3" /> {p.remixes}</span>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
});

const TemplateChips = memo(function TemplateChips({ onSelect }: { onSelect: (label: string) => void }) {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
      {templates.map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.label}
            onClick={() => onSelect(t.label)}
            className="surface group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        );
      })}
    </div>
  );
});
