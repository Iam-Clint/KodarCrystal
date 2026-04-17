import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { User, CreditCard, Bell, Key, Building2, Palette, Copy, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Prompt to App" },
      { name: "description", content: "Manage your profile, billing, notifications, API keys and workspace preferences." },
    ],
  }),
  component: Settings,
});

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "api", label: "API Keys", icon: Key },
  { id: "workspace", label: "Workspace", icon: Building2 },
] as const;

function Settings() {
  const [active, setActive] = useState<typeof tabs[number]["id"]>("profile");
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="mx-auto mt-8 max-w-6xl px-4 pb-16">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-[var(--glow-cyan)]">Settings</div>
        <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Account & preferences</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="glass h-fit rounded-2xl p-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                  isActive ? "bg-gradient-to-r from-[var(--glow-purple)]/25 to-transparent text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </aside>

        <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {active === "profile" && (
            <>
              <div className="glass gradient-border flex items-center gap-5 rounded-2xl p-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--glow-purple)] to-[var(--glow-blue)] font-display text-2xl font-bold text-white shadow-[0_0_30px_-5px_var(--glow-purple)]">
                  AX
                </div>
                <div className="flex-1">
                  <div className="font-display text-xl font-semibold">Alex Reyes</div>
                  <div className="text-sm text-muted-foreground">alex@promptapp.io · Pro plan</div>
                </div>
                <Button variant="outline" className="border-white/10 bg-white/5">Change avatar</Button>
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="font-display text-lg font-semibold">Account details</h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "Full name", val: "Alex Reyes" },
                    { label: "Email", val: "alex@promptapp.io" },
                    { label: "Username", val: "alexr" },
                    { label: "Timezone", val: "GMT+1 — Berlin" },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="text-xs text-muted-foreground">{f.label}</label>
                      <input defaultValue={f.val} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[var(--glow-purple)]/50" />
                    </div>
                  ))}
                </div>
                <Button className="mt-6 bg-gradient-to-r from-[var(--glow-purple)] to-[var(--glow-blue)] text-white">Save changes</Button>
              </div>
            </>
          )}

          {active === "appearance" && (
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-lg font-semibold">Theme</h3>
              <p className="mt-1 text-sm text-muted-foreground">Use the toggle in the navbar to switch between dark and light mode.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {["Dark", "Light", "System"].map((t, i) => (
                  <div key={t} className={`glass cursor-pointer rounded-xl p-4 ${i === 0 ? "gradient-border" : ""}`}>
                    <div className={`h-20 rounded-lg ${i === 0 ? "bg-gradient-to-br from-slate-900 to-slate-700" : i === 1 ? "bg-gradient-to-br from-white to-slate-200" : "bg-gradient-to-br from-slate-900 to-white"}`} />
                    <div className="mt-3 text-sm font-medium">{t}</div>
                  </div>
                ))}
              </div>
              <h3 className="mt-8 font-display text-lg font-semibold">Accent color</h3>
              <div className="mt-3 flex gap-2">
                {["#7C3AED", "#3B82F6", "#22D3EE", "#10B981", "#F59E0B", "#EF4444"].map((c, i) => (
                  <button key={c} className={`h-10 w-10 rounded-full ring-2 ring-offset-2 ring-offset-background ${i === 0 ? "ring-white" : "ring-transparent"}`} style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          )}

          {active === "notifications" && (
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-lg font-semibold">Notification preferences</h3>
              <div className="mt-5 space-y-4">
                {[
                  ["Product updates", "New features and announcements"],
                  ["AI generation complete", "Notify me when an app finishes generating"],
                  ["Team activity", "Comments, mentions and shared edits"],
                  ["Billing alerts", "Payment success, failures and renewals"],
                ].map(([t, d], i) => (
                  <label key={t} className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/5 p-4">
                    <div>
                      <div className="text-sm font-medium">{t}</div>
                      <div className="text-xs text-muted-foreground">{d}</div>
                    </div>
                    <Toggle defaultOn={i !== 3} />
                  </label>
                ))}
              </div>
            </div>
          )}

          {active === "billing" && (
            <div className="space-y-6">
              <div className="glass gradient-border rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Current plan</div>
                    <div className="mt-1 font-display text-2xl font-bold gradient-text">Pro</div>
                    <div className="mt-1 text-sm text-muted-foreground">$24/month — renews May 17, 2026</div>
                  </div>
                  <Button variant="outline" className="border-white/10 bg-white/5">Manage plan</Button>
                </div>
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="font-display text-lg font-semibold">Payment method</h3>
                <div className="mt-4 flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-12 rounded bg-gradient-to-br from-[var(--glow-purple)] to-[var(--glow-blue)]" />
                    <div>
                      <div className="text-sm font-medium">Visa ending in 4242</div>
                      <div className="text-xs text-muted-foreground">Expires 09/28</div>
                    </div>
                  </div>
                  <button className="text-xs text-muted-foreground hover:text-foreground">Update</button>
                </div>
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="font-display text-lg font-semibold">Invoices</h3>
                <div className="mt-3 divide-y divide-white/5">
                  {["Apr 2026", "Mar 2026", "Feb 2026"].map((m) => (
                    <div key={m} className="flex items-center justify-between py-3 text-sm">
                      <span>{m}</span>
                      <span className="text-muted-foreground">$24.00</span>
                      <button className="text-xs text-[var(--glow-cyan)] hover:underline">Download</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {active === "api" && (
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-lg font-semibold">API keys</h3>
              <p className="mt-1 text-sm text-muted-foreground">Use these keys to call the Prompt to App API from your apps.</p>
              <div className="mt-5 rounded-xl border border-white/5 bg-white/5 p-4">
                <div className="text-xs text-muted-foreground">Production key</div>
                <div className="mt-2 flex items-center gap-2">
                  <code className="flex-1 truncate font-mono text-sm">{showKey ? "pk_live_8a2f9d3e1c4b7a5f6e8d9c2b1a3f5e7d" : "pk_live_••••••••••••••••••••••••••••"}</code>
                  <button onClick={() => setShowKey((v) => !v)} className="rounded-md p-1.5 hover:bg-white/10">
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button className="rounded-md p-1.5 hover:bg-white/10"><Copy className="h-4 w-4" /></button>
                </div>
              </div>
              <Button className="mt-5 bg-gradient-to-r from-[var(--glow-purple)] to-[var(--glow-blue)] text-white">Generate new key</Button>
            </div>
          )}

          {active === "workspace" && (
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-lg font-semibold">Workspace preferences</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-muted-foreground">Workspace name</label>
                  <input defaultValue="Reyes Studio" className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Default export format</label>
                  <select className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none">
                    <option>React</option><option>Flutter</option><option>HTML</option>
                  </select>
                </div>
              </div>
              <h3 className="mt-8 font-display text-lg font-semibold">Members</h3>
              <div className="mt-3 space-y-2">
                {[["Alex Reyes", "Owner"], ["Maya Chen", "Editor"], ["Diego Alvarez", "Viewer"]].map(([n, r]) => (
                  <div key={n} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[var(--glow-purple)] to-[var(--glow-blue)]" />
                      <span>{n}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function Toggle({ defaultOn = true }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-gradient-to-r from-[var(--glow-purple)] to-[var(--glow-blue)]" : "bg-white/10"}`}
    >
      <motion.div animate={{ x: on ? 22 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow" />
    </button>
  );
}
