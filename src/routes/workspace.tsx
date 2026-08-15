import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  ArrowUp, Paperclip, Sparkles, RotateCcw, Share2, Globe, Code2, Eye,
  Terminal as TerminalIcon, Folder, FileCode, ChevronRight, ChevronDown,
  Monitor, Tablet, Smartphone, RefreshCw, ExternalLink, GitBranch,
  MoreHorizontal, Loader2, Check, MousePointerSquareDashed, X, Copy,
  AlertTriangle, Wand2, Coins, GitCompare, Undo2, ShieldCheck,
} from "lucide-react";
import { CrystalLogo } from "@/components/Navbar";

export const Route = createFileRoute("/workspace")({
  head: () => ({
    meta: [
      { title: "Workspace — Build, Review & Ship | Crystal" },
      { name: "description", content: "Chat with Crystal AI, review every diff before it lands, restore any version, and publish your app in one click." },
      { property: "og:title", content: "Workspace — Build, Review & Ship | Crystal" },
      { property: "og:description", content: "Chat with Crystal AI, review every diff before it lands, restore any version, and publish your app in one click." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Workspace,
});

type FileDiff = { file: string; added: number; removed: number; lines: { t: "+" | "-" | " "; s: string }[] };
type Usage = { model: string; inTok: number; outTok: number; credits: number; seconds: number };
type Msg = {
  role: "user" | "ai";
  text: string;
  files?: string[];
  diff?: FileDiff[];
  usage?: Usage;
  status?: "pending" | "applied" | "reverted";
};

const sampleDiff: FileDiff[] = [
  {
    file: "src/components/Hero.tsx",
    added: 4,
    removed: 2,
    lines: [
      { t: " ", s: "export function Hero() {" },
      { t: "-", s: '  return <h1 className="text-4xl">Coffee delivered.</h1>;' },
      { t: "-", s: "}" },
      { t: "+", s: "  return (" },
      { t: "+", s: '    <h1 className="text-5xl font-display">' },
      { t: "+", s: "      Coffee, <em>delivered</em>." },
      { t: "+", s: "    </h1>" },
      { t: "+", s: "  );" },
      { t: " ", s: "}" },
    ],
  },
];

const initialMessages: Msg[] = [
  { role: "user", text: "Build me a landing page for a coffee subscription service called Brewly with a hero, featured beans grid, and pricing." },
  {
    role: "ai",
    text: "I'll build that for you. Setting up the project with a warm, editorial aesthetic — cream tones, serif headlines, and a featured beans grid.",
    files: ["src/routes/index.tsx", "src/components/Hero.tsx", "src/components/BeansGrid.tsx", "src/components/Pricing.tsx", "src/styles.css"],
    usage: { model: "crystal-large", inTok: 1840, outTok: 3120, credits: 2.4, seconds: 21 },
    status: "applied",
  },
  { role: "user", text: "Make the hero copy more playful and add a 'subscribe' CTA." },
  {
    role: "ai",
    text: "Here's the change — friendlier headline and a primary CTA. Review the diff before I apply it.",
    diff: sampleDiff,
    usage: { model: "crystal-fast", inTok: 620, outTok: 410, credits: 0.3, seconds: 6 },
    status: "pending",
  },
];

const restorePoints = [
  { id: "v7", label: "Playful hero copy", when: "just now", current: true },
  { id: "v6", label: "Added pricing section", when: "8 min ago" },
  { id: "v5", label: "Beans grid + imagery", when: "22 min ago" },
  { id: "v4", label: "Initial Brewly scaffold", when: "34 min ago" },
];

function Workspace() {
  const [tab, setTab] = useState<"preview" | "code" | "console">("preview");
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [credits, setCredits] = useState(37.6);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, generating]);

  const send = (override?: string) => {
    const text = (override ?? input).trim();
    if (!text || generating) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setGenerating(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: "Here's the proposed change. Nothing is applied until you approve the diff.",
          diff: sampleDiff,
          usage: { model: "crystal-fast", inTok: 540, outTok: 380, credits: 0.3, seconds: 5 },
          status: "pending",
        },
      ]);
      setCredits((c) => Math.max(0, +(c - 0.3).toFixed(1)));
      setGenerating(false);
    }, 1500);
  };

  const setStatus = (i: number, status: Msg["status"]) =>
    setMessages((m) => m.map((msg, idx) => (idx === i ? { ...msg, status } : msg)));

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
          <span
            title="Credits remaining this month"
            className="hidden items-center gap-1 rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground md:flex"
          >
            <Coins className="h-3 w-3 text-rose-500" /> {credits} credits
          </span>
          <button
            onClick={() => setShowHistory(true)}
            className="flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground hover:bg-accent"
          >
            <RotateCcw className="h-3.5 w-3.5" /> History
          </button>
          <button className="hidden h-7 items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground hover:bg-accent sm:flex">
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
          <button
            onClick={() => setShowPublish(true)}
            className="flex h-7 items-center gap-1.5 rounded-md bg-foreground px-3 text-xs text-background hover:opacity-90"
          >
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

                      {m.diff && <DiffCard diff={m.diff} status={m.status} onApply={() => setStatus(i, "applied")} onReject={() => setStatus(i, "reverted")} />}
                      {m.usage && <UsageBar usage={m.usage} />}
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
            {selectMode && (
              <div className="mb-2 flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11px] text-rose-700">
                <MousePointerSquareDashed className="h-3.5 w-3.5" /> Select mode on — click any element in the preview to target it.
              </div>
            )}
            <div className="surface group rounded-xl p-2 focus-within:shadow-[0_8px_24px_-12px_oklch(0.7_0.2_0/0.3)]">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Ask Crystal to make a change…"
                className="min-h-[60px] w-full resize-none bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground"
              />
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1">
                  <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
                    <Paperclip className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setSelectMode((v) => !v)}
                    aria-pressed={selectMode}
                    title="Select an element to edit"
                    className={`flex h-7 w-7 items-center justify-center rounded-md ${selectMode ? "bg-secondary text-rose-600" : "text-muted-foreground hover:bg-accent"}`}
                  >
                    <MousePointerSquareDashed className="h-3.5 w-3.5" />
                  </button>
                  <span className="ml-1 hidden items-center gap-1 text-[10px] text-muted-foreground sm:flex">
                    <ShieldCheck className="h-3 w-3 text-emerald-500" /> Review before apply
                  </span>
                </div>
                <button
                  onClick={() => send()}
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

          <div className="min-h-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {tab === "preview" && (
                <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-auto p-6">
                  <PreviewFrame
                    device={device}
                    selectMode={selectMode}
                    onPick={(el) => setInput((v) => (v ? `${v} ` : "") + `Edit the ${el}: `)}
                  />
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
                  <Console onAutoFix={(msg) => { setTab("preview"); send(msg); }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {showHistory && <HistoryDrawer onClose={() => setShowHistory(false)} />}
        {showPublish && <PublishDialog onClose={() => setShowPublish(false)} />}
      </AnimatePresence>
    </div>
  );
}

function UsageBar({ usage }: { usage: Usage }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-border/70 bg-secondary/50 px-2.5 py-1.5 text-[10px] text-muted-foreground">
      <span className="flex items-center gap-1 font-medium text-foreground">
        <Coins className="h-3 w-3 text-rose-500" /> {usage.credits} credits
      </span>
      <span>{usage.model}</span>
      <span>{usage.inTok.toLocaleString()} in / {usage.outTok.toLocaleString()} out</span>
      <span>{usage.seconds}s</span>
    </div>
  );
}

function DiffCard({
  diff, status, onApply, onReject,
}: { diff: FileDiff[]; status?: Msg["status"]; onApply: () => void; onReject: () => void }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mt-2 overflow-hidden rounded-lg border border-border bg-background">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center gap-2 bg-secondary/60 px-2.5 py-1.5 text-[11px]">
        <GitCompare className="h-3 w-3 text-muted-foreground" />
        <span className="truncate font-mono">{diff[0]?.file}</span>
        <span className="text-emerald-600">+{diff.reduce((a, d) => a + d.added, 0)}</span>
        <span className="text-rose-600">−{diff.reduce((a, d) => a + d.removed, 0)}</span>
        <span className="ml-auto text-muted-foreground">{open ? "hide" : "show"}</span>
      </button>
      {open && (
        <pre className="max-h-52 overflow-auto p-2 font-mono text-[10.5px] leading-relaxed">
          {diff.flatMap((d) => d.lines).map((l, i) => (
            <div
              key={i}
              className={
                l.t === "+" ? "bg-emerald-50 text-emerald-800" : l.t === "-" ? "bg-rose-50 text-rose-800" : "text-muted-foreground"
              }
            >
              <span className="select-none opacity-60">{l.t}</span> {l.s}
            </div>
          ))}
        </pre>
      )}
      <div className="flex items-center gap-2 border-t border-border/70 px-2.5 py-1.5">
        {status === "pending" ? (
          <>
            <button onClick={onApply} className="rounded-md bg-foreground px-2.5 py-1 text-[11px] text-background hover:opacity-90">
              Apply change
            </button>
            <button onClick={onReject} className="rounded-md border border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground">
              Discard
            </button>
            <span className="ml-auto text-[10px] text-muted-foreground">Not applied yet</span>
          </>
        ) : status === "reverted" ? (
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><Undo2 className="h-3 w-3" /> Discarded</span>
        ) : (
          <span className="flex items-center gap-1 text-[11px] text-emerald-600"><Check className="h-3 w-3" /> Applied to your project</span>
        )}
      </div>
    </div>
  );
}

function HistoryDrawer({ onClose }: { onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end bg-foreground/20 backdrop-blur-sm" onClick={onClose}>
      <motion.aside
        initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 40, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full max-w-sm border-l border-border bg-background p-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">Version history</h2>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-accent"><X className="h-4 w-4" /></button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Every message creates a restore point. Roll back instantly — nothing is ever lost.</p>
        <div className="mt-4 space-y-2">
          {restorePoints.map((r) => (
            <div key={r.id} className={`surface flex items-center justify-between rounded-lg p-3 ${r.current ? "ring-2 ring-rose-300" : ""}`}>
              <div>
                <div className="text-sm font-medium">{r.label}</div>
                <div className="text-[11px] text-muted-foreground">{r.id} · {r.when}</div>
              </div>
              {r.current ? (
                <span className="text-[10px] text-muted-foreground">Current</span>
              ) : (
                <button className="rounded-md border border-border px-2.5 py-1 text-[11px] hover:bg-accent">Restore</button>
              )}
            </div>
          ))}
        </div>
      </motion.aside>
    </motion.div>
  );
}

function PublishDialog({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<"idle" | "publishing" | "live">("idle");
  const url = "https://brewly.crystal.app";
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="surface w-full max-w-md rounded-2xl p-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">Publish Brewly</h2>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-accent"><X className="h-4 w-4" /></button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Ships the current version to a live URL. Visitors always see the last published build.</p>

        <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-secondary p-3">
          <Globe className="h-4 w-4 text-rose-500" />
          <code className="flex-1 truncate font-mono text-sm">{url}</code>
          <button onClick={() => navigator.clipboard?.writeText(url)} className="rounded p-1.5 hover:bg-background"><Copy className="h-3.5 w-3.5" /></button>
        </div>

        <ul className="mt-3 space-y-1 text-[11px] text-muted-foreground">
          <li>· 12 files changed since your last deploy</li>
          <li>· Custom domain available on Pro</li>
          <li>· Rollback to any restore point after publishing</li>
        </ul>

        <button
          onClick={() => { setState("publishing"); setTimeout(() => setState("live"), 1400); }}
          disabled={state !== "idle"}
          className="btn-brand mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-md text-sm text-white disabled:opacity-70"
        >
          {state === "idle" && <>Publish now</>}
          {state === "publishing" && <><Loader2 className="h-4 w-4 animate-spin" /> Deploying…</>}
          {state === "live" && <><Check className="h-4 w-4" /> Live</>}
        </button>
      </motion.div>
    </motion.div>
  );
}

function PreviewFrame({
  device, selectMode, onPick,
}: { device: "desktop" | "tablet" | "mobile"; selectMode: boolean; onPick: (el: string) => void }) {
  const widths = { desktop: "100%", tablet: "768px", mobile: "390px" };
  return (
    <div className="mx-auto h-full" style={{ maxWidth: widths[device] }}>
      <div className="surface h-full overflow-hidden rounded-xl">
        <div className="flex h-7 items-center gap-1.5 border-b border-border/60 bg-secondary/50 px-3">
          <div className="h-2 w-2 rounded-full bg-red-400" />
          <div className="h-2 w-2 rounded-full bg-yellow-400" />
          <div className="h-2 w-2 rounded-full bg-green-400" />
          <div className="ml-3 text-[10px] text-muted-foreground">brewly.crystal.app</div>
          {selectMode && <span className="ml-auto text-[10px] text-rose-600">select mode</span>}
        </div>
        <div className="h-[calc(100%-1.75rem)] overflow-auto">
          <FakeBrewlyApp selectMode={selectMode} onPick={onPick} />
        </div>
      </div>
    </div>
  );
}

function FakeBrewlyApp({ selectMode, onPick }: { selectMode: boolean; onPick: (el: string) => void }) {
  const sel = (name: string) =>
    selectMode
      ? {
          onClick: (e: React.MouseEvent) => { e.stopPropagation(); onPick(name); },
          className: "cursor-crosshair outline outline-1 outline-dashed outline-rose-400/70 hover:outline-2 hover:outline-rose-500",
        }
      : {};
  return (
    <div className="bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 p-8 text-stone-900">
      <header className="flex items-center justify-between" {...sel("header")}>
        <div className="font-display text-2xl">Brewly</div>
        <nav className="hidden gap-5 text-xs md:flex">
          <span>Beans</span><span>Subscription</span><span>About</span>
        </nav>
        <button className="rounded-full bg-stone-900 px-3 py-1 text-xs text-white">Subscribe</button>
      </header>
      <section className="py-12 text-center" {...sel("hero section")}>
        <h1 className="font-display text-4xl leading-tight md:text-6xl">Coffee, <em className="italic text-rose-700">delivered</em>.</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-stone-700">Hand-roasted beans from small farms, shipped fresh every other Tuesday.</p>
        <button className="mt-5 rounded-full bg-stone-900 px-5 py-2 text-xs text-white">Start your subscription</button>
      </section>
      <section className="grid grid-cols-3 gap-3 pt-4" {...sel("beans grid")}>
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
            <span>{line}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

const logLines: { level: "info" | "warn" | "error"; text: string; fix?: string }[] = [
  { level: "info", text: "vite v7.0.0  ready in 412 ms" },
  { level: "info", text: "hmr update /src/components/Hero.tsx" },
  { level: "warn", text: "Image 'beans-3.jpg' is 2.4 MB — consider compressing." },
  {
    level: "error",
    text: "TypeError: Cannot read properties of undefined (reading 'price') at Pricing.tsx:24",
    fix: "Fix the TypeError in Pricing.tsx:24 — 'price' is undefined.",
  },
];

function Console({ onAutoFix }: { onAutoFix: (msg: string) => void }) {
  return (
    <div className="space-y-1.5">
      {logLines.map((l, i) => (
        <div
          key={i}
          className={`flex items-start gap-2 rounded px-2 py-1 ${
            l.level === "error" ? "bg-rose-50 text-rose-700" : l.level === "warn" ? "bg-amber-50 text-amber-700" : "text-muted-foreground"
          }`}
        >
          {l.level === "error" && <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />}
          <span className="flex-1 break-all">{l.text}</span>
          {l.fix && (
            <button
              onClick={() => onAutoFix(l.fix!)}
              className="flex shrink-0 items-center gap-1 rounded-md bg-foreground px-2 py-0.5 text-[10px] text-background hover:opacity-90"
            >
              <Wand2 className="h-3 w-3" /> Auto-fix
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
