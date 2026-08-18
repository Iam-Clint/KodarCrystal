import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  ArrowUp, Paperclip, Sparkles, Eye, Monitor, Tablet, Smartphone,
  RefreshCw, ChevronRight, Loader2, Check, FileCode,
} from "lucide-react";
import { CrystalLogo } from "@/components/Navbar";

export const Route = createFileRoute("/workspace")({
  head: () => ({
    meta: [
      { title: "Workspace — Watch your app get built | Crystal.dev" },
      { name: "description", content: "Chat with Crystal.dev and watch a live preview of your app come together, prompt by prompt." },
      { property: "og:title", content: "Workspace — Watch your app get built | Crystal.dev" },
      { property: "og:description", content: "Chat with Crystal.dev and watch a live preview of your app come together." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Workspace,
});

type Msg = { role: "user" | "ai"; text: string; files?: string[] };

const defaultMessages: Msg[] = [
  { role: "user", text: "Build me a landing page for a coffee subscription service called Brewly with a hero, featured beans grid, and pricing." },
  {
    role: "ai",
    text: "On it — setting up a warm, editorial landing page with cream tones, serif headlines and a featured beans grid.",
    files: ["src/routes/index.tsx", "src/components/Hero.tsx", "src/components/BeansGrid.tsx", "src/components/Pricing.tsx"],
  },
];

const replyFiles = ["src/routes/index.tsx", "src/components/Hero.tsx", "src/styles.css"];

function Workspace() {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [messages, setMessages] = useState<Msg[]>(defaultMessages);
  const [input, setInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Pick up the prompt the user typed on the landing page.
  useEffect(() => {
    try {
      const seed = window.localStorage.getItem("crystal:prompt");
      if (seed && seed.trim()) {
        window.localStorage.removeItem("crystal:prompt");
        setMessages([{ role: "user", text: seed }]);
        setGenerating(true);
        setTimeout(() => {
          setMessages((m) => [
            ...m,
            { role: "ai", text: "Great idea — I'm generating the pages, components and styling for that now.", files: replyFiles },
          ]);
          setGenerating(false);
        }, 1600);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, generating]);

  const send = () => {
    const text = input.trim();
    if (!text || generating) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setGenerating(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: "Done — I've updated the preview with that change.", files: replyFiles }]);
      setGenerating(false);
    }, 1500);
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
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-rose-500" /> Building live
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[380px_1fr]">
        {/* CHAT */}
        <aside className="flex min-h-0 flex-col border-r border-border/60 bg-background/40">
          <div ref={chatRef} className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                {m.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-foreground px-3.5 py-2 text-sm text-background">{m.text}</div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--gradient-brand)]">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-medium text-muted-foreground">Crystal.dev</div>
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
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Building…
                </div>
              </motion.div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-border/60 bg-background/60 p-3">
            <div className="surface rounded-xl p-2 focus-within:shadow-[0_8px_24px_-12px_oklch(0.7_0.2_0/0.3)]">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Ask Crystal.dev to make a change…"
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
                  aria-label="Send message"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* PREVIEW */}
        <section className="flex min-h-0 flex-col bg-secondary/30">
          <div className="flex h-11 items-center justify-between gap-2 border-b border-border/60 bg-background/60 px-3 backdrop-blur">
            <div className="flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-xs text-foreground">
              <Eye className="h-3.5 w-3.5" /> Live preview
            </div>
            <div className="flex items-center gap-1">
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
                      aria-label={d.id}
                      className={`flex h-6 w-6 items-center justify-center rounded ${active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <Icon className="h-3 w-3" />
                    </button>
                  );
                })}
              </div>
              <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent" aria-label="Refresh preview">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto p-6">
            <PreviewFrame device={device} building={generating} />
          </div>
        </section>
      </div>
    </div>
  );
}

function PreviewFrame({ device, building }: { device: "desktop" | "tablet" | "mobile"; building: boolean }) {
  const width = device === "desktop" ? "max-w-4xl" : device === "tablet" ? "max-w-xl" : "max-w-[320px]";
  return (
    <div className={`mx-auto w-full ${width} transition-all`}>
      <div className="surface overflow-hidden rounded-xl">
        <div className="flex items-center gap-1.5 border-b border-border bg-secondary/50 px-3 py-2">
          <div className="h-2 w-2 rounded-full bg-red-400" />
          <div className="h-2 w-2 rounded-full bg-yellow-400" />
          <div className="h-2 w-2 rounded-full bg-green-400" />
          <div className="ml-3 text-[10px] text-muted-foreground">brewly.crystal.dev</div>
          {building && <Loader2 className="ml-auto h-3 w-3 animate-spin text-muted-foreground" />}
        </div>
        <div className="bg-gradient-to-br from-rose-50 to-amber-50 p-6 dark:from-zinc-900 dark:to-zinc-800">
          <div className="flex items-center justify-between">
            <div className="font-display text-lg text-foreground">Brewly</div>
            <div className="flex gap-3 text-[10px] text-muted-foreground">
              <span>Beans</span><span>Plans</span><span>Story</span>
            </div>
          </div>
          <div className="mt-8 text-center">
            <div className="font-display text-3xl text-foreground">Coffee, <em className="italic">delivered</em>.</div>
            <p className="mx-auto mt-2 max-w-sm text-xs text-muted-foreground">Freshly roasted beans at your door every week.</p>
            <div className="mt-4 inline-flex rounded-md bg-foreground px-3 py-1.5 text-[10px] text-background">Subscribe</div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {["Ethiopia", "Colombia", "Sumatra"].map((b) => (
              <div key={b} className="rounded-lg bg-background/70 p-3">
                <div className="aspect-square rounded-md bg-gradient-to-br from-rose-200 to-amber-200" />
                <div className="mt-2 text-[10px] text-foreground">{b}</div>
                <div className="text-[9px] text-muted-foreground">Medium roast</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
