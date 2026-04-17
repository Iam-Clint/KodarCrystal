import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  ArrowUp, Paperclip, Sparkles, RotateCcw, Share2, Globe, Code2, Eye,
  Terminal as TerminalIcon, Folder, FileCode, ChevronRight, ChevronDown,
  Monitor, Tablet, Smartphone, RefreshCw, ExternalLink, GitBranch,
  MoreHorizontal, Loader2, Check,
} from "lucide-react";
import { CrystalLogo } from "@/components/Navbar";

export const Route = createFileRoute("/workspace")({
  head: () => ({
    meta: [
      { title: "Workspace — Crystal" },
      { name: "description", content: "Chat with Crystal AI to build, edit, and ship your app in real time." },
    ],
  }),
  component: Workspace,
});

type Msg = { role: "user" | "ai"; text: string; files?: string[] };

const initialMessages: Msg[] = [
  { role: "user", text: "Build me a landing page for a coffee subscription service called Brewly with a hero, featured beans grid, and pricing." },
  {
    role: "ai",
    text: "I'll build that for you. Setting up the project with a warm, editorial aesthetic — cream tones, serif headlines, and a featured beans grid.",
    files: ["src/routes/index.tsx", "src/components/Hero.tsx", "src/components/BeansGrid.tsx", "src/components/Pricing.tsx", "src/styles.css"],
  },
  { role: "user", text: "Make the hero copy more playful and add a 'subscribe' CTA." },
  {
    role: "ai",
    text: "Updated the hero — friendlier headline, added a primary CTA, and tightened the spacing.",
    files: ["src/components/Hero.tsx"],
  },
];

function Workspace() {
  const [tab, setTab] = useState<"preview" | "code" | "console">("preview");
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, generating]);

  const send = () => {
    if (!input.trim() || generating) return;
    const text = input;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setGenerating(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: "Done. Updated the page with your changes — preview is refreshed on the right.",
          files: ["src/routes/index.tsx", "src/components/Hero.tsx"],
        },
      ]);
      setGenerating(false);
    }, 1600);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full flex-col">
      {/* Project bar */}
      <div className="flex h-11 items-center justify-between gap-2 border-b border-border/60 bg-background/60 px-3 backdrop-blur">
        <div className="flex min-w-0 items-center gap-2">
          <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <CrystalLogo className="h-4 w-4" /> Projects
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          <div className="truncate text-sm font-medium">Brewly Coffee</div>
          <span className="ml-2 hidden items-center gap-1 rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground sm:flex">
            <GitBranch className="h-3 w-3" /> main
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button className="flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground hover:bg-accent">
            <RotateCcw className="h-3.5 w-3.5" /> History
          </button>
          <button className="flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground hover:bg-accent">
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
          <button className="flex h-7 items-center gap-1.5 rounded-md bg-foreground px-3 text-xs text-background hover:opacity-90">
            <Globe className="h-3.5 w-3.5" /> Publish
          </button>
        </div>
      </div>

      {/* Main split */}
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[380px_1fr]">
        {/* CHAT */}
        <aside className="flex min-h-0 flex-col border-r border-border/60 bg-background/40">
          <div ref={chatRef} className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              >
                {m.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-foreground px-3.5 py-2 text-sm text-background">
                      {m.text}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--gradient-brand)]">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-medium text-muted-foreground">Crystal</div>
                      <div className="mt-1 text-sm leading-relaxed">{m.text}</div>
                      {m.files && (
                        <div className="mt-2 space-y-1">
                          {m.files.map((f) => (
                            <div key={f} className="surface flex items-center gap-2 rounded-md px-2.5 py-1.5 font-mono text-[11px]">
                              <Check className="h-3 w-3 text-emerald-500" />
                              <FileCode className="h-3 w-3 text-muted-foreground" />
                              <span className="truncate">{f}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
            {generating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--gradient-brand)]">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating…
                </div>
              </motion.div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-border/60 bg-background/60 p-3">
            <div className="surface group rounded-xl p-2 focus-within:shadow-[0_8px_24px_-12px_oklch(0.7_0.2_0/0.3)]">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Ask Crystal to make a change…"
                className="min-h-[60px] w-full resize-none bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground"
              />
              <div className="flex items-center justify-between pt-1">
                <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
                  <Paperclip className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={send}
                  disabled={!input.trim() || generating}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background hover:opacity-90 disabled:opacity-40"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* PREVIEW */}
        <section className="flex min-h-0 flex-col bg-secondary/30">
          {/* Tabs bar */}
          <div className="flex h-11 items-center justify-between gap-2 border-b border-border/60 bg-background/60 px-3 backdrop-blur">
            <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary p-0.5">
              {[
                { id: "preview", label: "Preview", icon: Eye },
                { id: "code", label: "Code", icon: Code2 },
                { id: "console", label: "Console", icon: TerminalIcon },
              ].map((t) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id as typeof tab)}
                    className={`relative flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {active && <motion.div layoutId="ws-tab" className="absolute inset-0 rounded-md bg-background shadow-sm" />}
                    <span className="relative flex items-center gap-1.5"><Icon className="h-3.5 w-3.5" /> {t.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1">
              {tab === "preview" && (
                <>
                  <div className="hidden items-center gap-0.5 rounded-lg border border-border bg-secondary p-0.5 sm:flex">
                    {[
                      { id: "desktop", icon: Monitor },
                      { id: "tablet", icon: Tablet },
                      { id: "mobile", icon: Smartphone },
                    ].map((d) => {
                      const Icon = d.icon;
                      const active = device === d.id;
                      return (
                        <button
                          key={d.id}
                          onClick={() => setDevice(d.id as typeof device)}
                          className={`flex h-6 w-6 items-center justify-center rounded ${active ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                        >
                          <Icon className="h-3 w-3" />
                        </button>
                      );
                    })}
                  </div>
                  <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                  <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
              <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Tab content */}
          <div className="min-h-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {tab === "preview" && (
                <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-auto p-6">
                  <PreviewFrame device={device} />
                </motion.div>
              )}
              {tab === "code" && (
                <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid h-full grid-cols-[200px_1fr]">
                  <FileTree />
                  <CodeView />
                </motion.div>
              )}
              {tab === "console" && (
                <motion.div key="console" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-auto bg-background p-4 font-mono text-xs">
                  <Console />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}

function PreviewFrame({ device }: { device: "desktop" | "tablet" | "mobile" }) {
  const widths = { desktop: "100%", tablet: "768px", mobile: "390px" };
  return (
    <div className="mx-auto h-full" style={{ maxWidth: widths[device] }}>
      <div className="surface h-full overflow-hidden rounded-xl">
        <div className="flex h-7 items-center gap-1.5 border-b border-border/60 bg-secondary/50 px-3">
          <div className="h-2 w-2 rounded-full bg-red-400" />
          <div className="h-2 w-2 rounded-full bg-yellow-400" />
          <div className="h-2 w-2 rounded-full bg-green-400" />
          <div className="ml-3 text-[10px] text-muted-foreground">brewly.crystal.app</div>
        </div>
        <div className="h-[calc(100%-1.75rem)] overflow-auto">
          <FakeBrewlyApp />
        </div>
      </div>
    </div>
  );
}

function FakeBrewlyApp() {
  return (
    <div className="bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 p-8 text-stone-900">
      <header className="flex items-center justify-between">
        <div className="font-display text-2xl">Brewly</div>
        <nav className="hidden gap-5 text-xs md:flex">
          <span>Beans</span><span>Subscription</span><span>About</span>
        </nav>
        <button className="rounded-full bg-stone-900 px-3 py-1 text-xs text-white">Subscribe</button>
      </header>
      <section className="py-12 text-center">
        <h1 className="font-display text-4xl leading-tight md:text-6xl">Coffee, <em className="italic text-rose-700">delivered</em>.</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-stone-700">Hand-roasted beans from small farms, shipped fresh every other Tuesday.</p>
        <button className="mt-5 rounded-full bg-stone-900 px-5 py-2 text-xs text-white">Start your subscription</button>
      </section>
      <section className="grid grid-cols-3 gap-3 pt-4">
        {["Ethiopia Yirgacheffe", "Colombia Huila", "Sumatra Mandheling"].map((b, i) => (
          <div key={b} className="rounded-xl bg-white/70 p-3 backdrop-blur">
            <div className={`aspect-square rounded-lg bg-gradient-to-br ${["from-amber-300 to-orange-400", "from-rose-300 to-amber-400", "from-stone-400 to-stone-700"][i]}`} />
            <div className="mt-2 text-[11px] font-medium">{b}</div>
            <div className="text-[10px] text-stone-600">$18 / 12oz</div>
          </div>
        ))}
      </section>
    </div>
  );
}

function FileTree() {
  const [open, setOpen] = useState({ src: true, components: true, routes: true });
  return (
    <div className="scrollbar-thin overflow-y-auto border-r border-border/60 bg-background/40 p-2 text-xs">
      <button onClick={() => setOpen((o) => ({ ...o, src: !o.src }))} className="flex w-full items-center gap-1 rounded px-1.5 py-1 hover:bg-accent">
        {open.src ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        <Folder className="h-3 w-3 text-amber-500" /> src
      </button>
      {open.src && (
        <div className="ml-3 space-y-0.5 border-l border-border pl-2">
          <button onClick={() => setOpen((o) => ({ ...o, components: !o.components }))} className="flex w-full items-center gap-1 rounded px-1.5 py-1 hover:bg-accent">
            {open.components ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            <Folder className="h-3 w-3 text-amber-500" /> components
          </button>
          {open.components && (
            <div className="ml-3 space-y-0.5">
              {["Hero.tsx", "BeansGrid.tsx", "Pricing.tsx"].map((f) => (
                <div key={f} className="flex items-center gap-1.5 rounded px-1.5 py-1 hover:bg-accent"><FileCode className="h-3 w-3 text-blue-500" /> {f}</div>
              ))}
            </div>
          )}
          <button onClick={() => setOpen((o) => ({ ...o, routes: !o.routes }))} className="flex w-full items-center gap-1 rounded px-1.5 py-1 hover:bg-accent">
            {open.routes ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            <Folder className="h-3 w-3 text-amber-500" /> routes
          </button>
          {open.routes && (
            <div className="ml-3 space-y-0.5">
              <div className="flex items-center gap-1.5 rounded bg-accent px-1.5 py-1"><FileCode className="h-3 w-3 text-blue-500" /> index.tsx</div>
            </div>
          )}
          <div className="flex items-center gap-1.5 rounded px-1.5 py-1 hover:bg-accent"><FileCode className="h-3 w-3 text-pink-500" /> styles.css</div>
        </div>
      )}
    </div>
  );
}

function CodeView() {
  const code = `import { Hero } from "@/components/Hero";
import { BeansGrid } from "@/components/BeansGrid";
import { Pricing } from "@/components/Pricing";

export default function Index() {
  return (
    <main className="min-h-screen bg-cream">
      <Hero />
      <BeansGrid />
      <Pricing />
    </main>
  );
}`;
  return (
    <div className="scrollbar-thin h-full overflow-auto bg-background">
      <div className="border-b border-border/60 bg-secondary/40 px-3 py-1.5 font-mono text-[11px] text-muted-foreground">src/routes/index.tsx</div>
      <pre className="p-4 font-mono text-xs leading-relaxed">
        {code.split("\n").map((line, i) => (
          <div key={i} className="flex gap-4">
            <span className="w-6 select-none text-right text-muted-foreground">{i + 1}</span>
            <span><Highlight line={line} /></span>
          </div>
        ))}
      </pre>
    </div>
  );
}

function Highlight({ line }: { line: string }) {
  // tiny syntax highlighter
  const parts = line.split(/(import|from|return|export|default|function|const|"[^"]*"|\{|\}|<[^>]+>)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (/^(import|from|return|export|default|function|const)$/.test(p)) return <span key={i} className="text-rose-500">{p}</span>;
        if (/^"/.test(p)) return <span key={i} className="text-emerald-600">{p}</span>;
        if (/^</.test(p)) return <span key={i} className="text-blue-500">{p}</span>;
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

function Console() {
  const lines = [
    { t: "info", msg: "[vite] connecting…" },
    { t: "info", msg: "[vite] connected." },
    { t: "log", msg: "✓ Compiled src/routes/index.tsx" },
    { t: "log", msg: "✓ Compiled src/components/Hero.tsx" },
    { t: "warn", msg: "Warning: <img> missing alt attribute (Hero.tsx:24)" },
    { t: "log", msg: "[HMR] update applied in 124ms" },
    { t: "info", msg: "Crystal AI: regenerated 2 files" },
    { t: "log", msg: "✓ Build successful" },
  ];
  const colors: Record<string, string> = { info: "text-blue-500", log: "text-foreground", warn: "text-amber-500", error: "text-rose-500" };
  return (
    <div className="space-y-1">
      {lines.map((l, i) => (
        <div key={i} className="flex gap-3">
          <span className="text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
          <span className={`uppercase text-[10px] ${colors[l.t]}`}>{l.t}</span>
          <span className="text-foreground/90">{l.msg}</span>
        </div>
      ))}
    </div>
  );
}
