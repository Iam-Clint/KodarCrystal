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
      { title: "Generated app — Crystal.dev" },
      { name: "description", content: "Your AI-generated app concept, mockups, branding and exports — ready to ship." },
    ],
  }),
  component: Results,
});

const tabs = ["Overview", "Features", "UI Screens", "Pages", "Branding", "Export"] as const;

function Results() {
  const [tab, setTab] = useState<typeof tabs[number]>("Overview");

  return (
    <div className="mx-auto mt-8 max-w-6xl px-4 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Generated app</div>
          <h1 className="mt-1 font-display text-4xl md:text-5xl">Lumen <em className="italic gradient-text">Finance</em></h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">A modern personal finance app with AI-powered insights, smart budgeting and beautiful data visualization.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
          <Button className="btn-brand"><Download className="mr-2 h-4 w-4" /> Export</Button>
        </div>
      </div>

      <div className="mt-7 flex gap-1 overflow-x-auto rounded-lg border border-border bg-secondary p-0.5">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative shrink-0 rounded-md px-3 py-1.5 text-sm transition-colors ${tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {tab === t && <motion.div layoutId="r-tab" className="absolute inset-0 rounded-md bg-background shadow-sm" />}
            <span className="relative">{t}</span>
          </button>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-xl">UI Mockups</h2>
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr]">
          <motion.div whileHover={{ y: -4 }} className="surface overflow-hidden rounded-xl">
            <div className="flex items-center gap-1.5 border-b border-border bg-secondary/50 px-3 py-2">
              <div className="h-2 w-2 rounded-full bg-red-400" />
              <div className="h-2 w-2 rounded-full bg-yellow-400" />
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <div className="ml-3 text-[10px] text-muted-foreground">lumen.app</div>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-3 p-3">
              <div className="space-y-1">
                {["Home", "Wallet", "Goals", "Insights"].map((i) => (
                  <div key={i} className="rounded bg-secondary px-2 py-1 text-[10px]">{i}</div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-lg bg-gradient-to-br from-rose-100 to-amber-100 p-2.5">
                      <div className="h-1 w-6 rounded bg-foreground/20" />
                      <div className="mt-1.5 font-display text-sm">${i * 1240}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg bg-secondary p-3">
                  <div className="flex h-16 items-end gap-1">
                    {[40, 65, 50, 80, 70, 90, 75, 60, 85, 95, 70, 80].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-rose-400 to-amber-300" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="surface mx-auto w-full max-w-[240px] rounded-2xl p-2">
            <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-rose-50 to-amber-50 p-3">
              <div className="text-[10px] text-muted-foreground">Tablet</div>
              <div className="mt-2 rounded-lg bg-gradient-to-br from-rose-200 to-amber-200 p-3">
                <div className="text-[9px] text-foreground/60">Balance</div>
                <div className="mt-1 font-display text-2xl">$24,892</div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {[1, 2, 3, 4].map((i) => <div key={i} className="aspect-square rounded-md bg-white/70" />)}
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4, rotate: 1 }} className="surface mx-auto w-full max-w-[170px] rounded-[2rem] p-2">
            <div className="aspect-[9/19] rounded-[1.5rem] bg-gradient-to-br from-rose-50 to-amber-50 p-2.5">
              <div className="mx-auto h-1 w-12 rounded-full bg-foreground/15" />
              <div className="mt-3 rounded-xl bg-gradient-to-br from-rose-300 to-amber-300 p-3">
                <div className="text-[9px] text-foreground/60">Total</div>
                <div className="font-display text-lg">$24,892</div>
              </div>
              <div className="mt-2 space-y-1.5">
                {["Coffee — $4.20", "Salary — $3,200", "Netflix — $15.99"].map((t) => (
                  <div key={t} className="rounded-md bg-white/70 px-2 py-1.5 text-[9px]">{t}</div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-3">
        <div className="surface rounded-xl p-5">
          <h3 className="font-display text-lg">Color palette</h3>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {generatedPalette.map((c) => (
              <div key={c}>
                <div className="aspect-square rounded-md border border-border" style={{ backgroundColor: c }} />
                <div className="mt-1 text-center font-mono text-[10px] text-muted-foreground">{c}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface rounded-xl p-5">
          <h3 className="font-display text-lg">Typography</h3>
          <div className="mt-3 space-y-3">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Display</div>
              <div className="font-display text-2xl">Instrument Serif</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Body</div>
              <div className="text-base">Inter — clean, neutral.</div>
            </div>
          </div>
        </div>

        <div className="surface rounded-xl p-5">
          <h3 className="font-display text-lg">User flow</h3>
          <div className="mt-3 space-y-1.5">
            {["Onboarding", "Connect bank", "Set goals", "View insights", "Automate savings"].map((s, i) => (
              <div key={s} className="flex items-center gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--gradient-brand)] text-[10px] font-medium text-white">{i + 1}</div>
                <div className="text-sm">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <div className="surface rounded-xl p-5">
          <h3 className="font-display text-lg">App structure</h3>
          <pre className="mt-3 overflow-x-auto font-mono text-xs leading-relaxed text-muted-foreground">
{`lumen-finance/
├── app/
│   ├── (auth)/
│   ├── dashboard/
│   ├── wallet/
│   └── insights/
├── components/
└── lib/`}
          </pre>
        </div>
        <div className="surface rounded-xl p-5">
          <h3 className="font-display text-lg">Feature checklist</h3>
          <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {[...generatedFeatures, "Biometric login", "AI insights"].map((f) => (
              <li key={f} className="flex items-center gap-2 rounded-md bg-secondary px-2.5 py-1.5 text-xs">
                <span className="h-1 w-1 rounded-full bg-rose-500" /> {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-xl">Export</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {exportTargets.map((e) => {
            const Icon = iconMap[e.icon as keyof typeof iconMap];
            return (
              <motion.button key={e.name} whileHover={{ y: -3 }} className="surface group rounded-xl p-4 text-left">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary transition-transform group-hover:scale-110">
                  <Icon className="h-4 w-4 text-rose-500" />
                </div>
                <div className="mt-3 font-medium">{e.name}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{e.desc}</div>
              </motion.button>
            );
          })}
        </div>
      </section>

      <div className="mt-6 text-xs text-muted-foreground">Pages: {generatedPages.join(" · ")}</div>
    </div>
  );
}
