import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Code2, Smartphone, Figma, FileCode, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generatedPages, generatedPalette, generatedFeatures, exportTargets } from "@/lib/mock-data";

const iconMap = { Code2, Smartphone, Figma, FileCode };

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Generated App — Prompt to App" },
      { name: "description", content: "Your AI-generated app concept, mockups, branding and exports — ready to ship." },
    ],
  }),
  component: Results,
});

const tabs = ["Overview", "Features", "UI Screens", "Pages", "Branding", "Export"] as const;

function Results() {
  const [tab, setTab] = useState<typeof tabs[number]>("Overview");

  return (
    <div className="mx-auto mt-8 max-w-7xl px-4 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-[var(--glow-cyan)]">Generated App</div>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Lumen Finance</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">A modern personal finance app with AI-powered insights, smart budgeting, automated savings goals and beautiful data visualization.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 bg-white/5"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
          <Button className="bg-gradient-to-r from-[var(--glow-purple)] to-[var(--glow-blue)] text-white"><Download className="mr-2 h-4 w-4" /> Export</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-1 overflow-x-auto rounded-2xl border border-white/5 bg-white/[0.03] p-1 backdrop-blur">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative shrink-0 rounded-xl px-4 py-2 text-sm transition-colors ${tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {tab === t && (
              <motion.div layoutId="tab" className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--glow-purple)]/30 to-[var(--glow-blue)]/30 ring-1 ring-white/10" />
            )}
            <span className="relative">{t}</span>
          </button>
        ))}
      </div>

      {/* Device mockups */}
      <section className="mt-10">
        <h2 className="mb-6 font-display text-xl font-semibold">UI Mockups</h2>
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr_1fr]">
          {/* Desktop */}
          <motion.div whileHover={{ y: -8, rotateY: 2 }} style={{ transformStyle: "preserve-3d" }} className="glass gradient-border rounded-2xl p-3">
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
              <div className="ml-3 text-[10px] text-muted-foreground">lumen.app</div>
            </div>
            <div className="mt-3 grid grid-cols-[120px_1fr] gap-3">
              <div className="space-y-1.5">
                {["Home", "Wallet", "Goals", "Insights", "Cards"].map((i) => (
                  <div key={i} className="rounded-md bg-white/5 px-2 py-1.5 text-[10px]">{i}</div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-lg bg-gradient-to-br from-[var(--glow-purple)]/30 to-[var(--glow-blue)]/20 p-3">
                      <div className="h-1 w-8 rounded bg-white/30" />
                      <div className="mt-2 font-display text-sm font-bold">${i * 1240}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <div className="flex h-20 items-end gap-1">
                    {[40, 65, 50, 80, 70, 90, 75, 60, 85, 95, 70, 80].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-[var(--glow-purple)] to-[var(--glow-blue)]" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tablet */}
          <motion.div whileHover={{ y: -8 }} className="glass gradient-border mx-auto w-full max-w-[260px] rounded-3xl p-3">
            <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-white/5 to-transparent p-3">
              <div className="text-[10px] text-muted-foreground">Tablet</div>
              <div className="mt-2 rounded-lg bg-gradient-to-br from-[var(--glow-purple)]/30 to-[var(--glow-blue)]/30 p-3">
                <div className="text-[10px] text-white/70">Balance</div>
                <div className="mt-1 font-display text-2xl font-bold">$24,892</div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square rounded-md bg-white/5" />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Mobile */}
          <motion.div whileHover={{ y: -8, rotate: 2 }} className="glass gradient-border mx-auto w-full max-w-[180px] rounded-[2rem] p-2">
            <div className="aspect-[9/19] rounded-[1.6rem] bg-gradient-to-br from-white/5 to-transparent p-2.5">
              <div className="mx-auto h-1 w-12 rounded-full bg-white/20" />
              <div className="mt-3 rounded-xl bg-gradient-to-br from-[var(--glow-purple)] to-[var(--glow-blue)] p-3">
                <div className="text-[9px] text-white/70">Total</div>
                <div className="font-display text-lg font-bold">$24,892</div>
              </div>
              <div className="mt-2 space-y-1.5">
                {["Coffee — $4.20", "Salary — $3,200", "Netflix — $15.99"].map((t) => (
                  <div key={t} className="rounded-md bg-white/5 px-2 py-1.5 text-[9px]">{t}</div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Three columns */}
      <section className="mt-12 grid gap-6 lg:grid-cols-3">
        <div className="glass gradient-border rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold">Color palette</h3>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {generatedPalette.map((c) => (
              <div key={c}>
                <div className="aspect-square rounded-lg ring-1 ring-white/10" style={{ backgroundColor: c }} />
                <div className="mt-1 text-center font-mono text-[10px] text-muted-foreground">{c}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass gradient-border rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold">Typography</h3>
          <div className="mt-4 space-y-3">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Display</div>
              <div className="font-display text-2xl font-bold">Space Grotesk</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Body</div>
              <div className="text-base">Inter — clean, neutral, geometric.</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Mono</div>
              <div className="font-mono text-sm">JetBrains Mono</div>
            </div>
          </div>
        </div>

        <div className="glass gradient-border rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold">User flow</h3>
          <div className="mt-4 space-y-2">
            {["Onboarding", "Connect bank", "Set goals", "View insights", "Automate savings"].map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[var(--glow-purple)] to-[var(--glow-blue)] text-[11px] font-bold text-white">{i + 1}</div>
                <div className="text-sm">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App tree + features */}
      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="glass gradient-border rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold">App structure</h3>
          <pre className="mt-4 overflow-x-auto font-mono text-xs leading-relaxed text-muted-foreground">
{`lumen-finance/
├── app/
│   ├── (auth)/
│   │   ├── login
│   │   └── signup
│   ├── dashboard/
│   ├── wallet/
│   ├── goals/
│   ├── insights/
│   └── settings/
├── components/
│   ├── ui/
│   └── charts/
└── lib/
    ├── ai/
    └── stripe/`}
          </pre>
        </div>
        <div className="glass gradient-border rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold">Feature checklist</h3>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[...generatedFeatures, "Biometric login", "AI insights", "Goal tracking", "Multi-currency"].map((f) => (
              <li key={f} className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--glow-cyan)]" /> {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Export */}
      <section className="mt-12">
        <h2 className="mb-6 font-display text-xl font-semibold">Export your app</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {exportTargets.map((e) => {
            const Icon = iconMap[e.icon as keyof typeof iconMap];
            return (
              <motion.button
                key={e.name}
                whileHover={{ y: -6 }}
                className="glass gradient-border group rounded-2xl p-5 text-left"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--glow-purple)]/30 to-[var(--glow-blue)]/30 transition-transform group-hover:scale-110">
                  <Icon className="h-5 w-5 text-[var(--glow-cyan)]" />
                </div>
                <div className="mt-4 font-display font-semibold">{e.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{e.desc}</div>
              </motion.button>
            );
          })}
        </div>
      </section>

      <div className="mt-8 text-xs text-muted-foreground">Pages generated: {generatedPages.join(" · ")}</div>
    </div>
  );
}
