import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { User, CreditCard, Bell, Key, Building2, Palette, Copy, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Crystal" },
      { name: "description", content: "Manage your profile, billing, notifications, API keys and workspace." },
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
    <div className="mx-auto mt-8 max-w-5xl px-4 pb-16">
      <div className="mb-7">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Settings</div>
        <h1 className="mt-1 font-display text-3xl md:text-4xl">Account & preferences</h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-[200px_1fr]">
        <aside className="surface h-fit rounded-xl p-1.5">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </aside>

        <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {active === "profile" && (
            <>
              <div className="surface flex items-center gap-4 rounded-xl p-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--gradient-brand)] font-display text-xl text-white">AX</div>
                <div className="flex-1">
                  <div className="font-display text-xl">Alex Reyes</div>
                  <div className="text-sm text-muted-foreground">alex@crystal.dev · Pro plan</div>
                </div>
                <Button variant="outline" size="sm">Change avatar</Button>
              </div>
              <div className="surface rounded-xl p-5">
                <h3 className="font-display text-lg">Account details</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Full name", val: "Alex Reyes" },
                    { label: "Email", val: "alex@crystal.dev" },
                    { label: "Username", val: "alexr" },
                    { label: "Timezone", val: "GMT+1 — Berlin" },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="text-xs text-muted-foreground">{f.label}</label>
                      <input defaultValue={f.val} className="mt-1 w-full rounded-md border border-border bg-input px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-rose-200" />
                    </div>
                  ))}
                </div>
                <Button className="mt-5 btn-brand">Save changes</Button>
              </div>
            </>
          )}

          {active === "appearance" && (
            <div className="surface rounded-xl p-5">
              <h3 className="font-display text-lg">Theme</h3>
              <p className="mt-1 text-sm text-muted-foreground">Toggle between light and dark from the navbar.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {["Light", "Dark", "System"].map((t, i) => (
                  <div key={t} className={`surface cursor-pointer rounded-lg p-3 ${i === 0 ? "ring-2 ring-rose-300" : ""}`}>
                    <div className={`h-16 rounded-md ${i === 0 ? "bg-gradient-to-br from-amber-50 to-rose-100" : i === 1 ? "bg-gradient-to-br from-stone-900 to-stone-700" : "bg-gradient-to-br from-amber-100 to-stone-700"}`} />
                    <div className="mt-2 text-sm font-medium">{t}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === "notifications" && (
            <div className="surface rounded-xl p-5">
              <h3 className="font-display text-lg">Notifications</h3>
              <div className="mt-4 space-y-3">
                {[
                  ["Product updates", "New features and announcements"],
                  ["Generation complete", "Notify me when a project finishes generating"],
                  ["Team activity", "Comments, mentions and shared edits"],
                  ["Billing alerts", "Payment success, failures and renewals"],
                ].map(([t, d], i) => (
                  <label key={t} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-secondary p-3">
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
            <div className="space-y-4">
              <div className="surface rounded-xl p-5 ring-2 ring-rose-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Current plan</div>
                    <div className="mt-1 font-display text-2xl gradient-text">Pro</div>
                    <div className="mt-1 text-sm text-muted-foreground">$24/month — renews May 17</div>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </div>
              <div className="surface rounded-xl p-5">
                <h3 className="font-display text-lg">Payment method</h3>
                <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-secondary p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-10 rounded bg-[var(--gradient-brand)]" />
                    <div>
                      <div className="text-sm font-medium">Visa •••• 4242</div>
                      <div className="text-xs text-muted-foreground">Expires 09/28</div>
                    </div>
                  </div>
                  <button className="text-xs text-muted-foreground hover:text-foreground">Update</button>
                </div>
              </div>
              <div className="surface rounded-xl p-5">
                <h3 className="font-display text-lg">Invoices</h3>
                <div className="mt-2 divide-y divide-border">
                  {["Apr 2026", "Mar 2026", "Feb 2026"].map((m) => (
                    <div key={m} className="flex items-center justify-between py-2.5 text-sm">
                      <span>{m}</span>
                      <span className="text-muted-foreground">$24.00</span>
                      <button className="text-xs text-rose-600 hover:underline">Download</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {active === "api" && (
            <div className="surface rounded-xl p-5">
              <h3 className="font-display text-lg">API keys</h3>
              <p className="mt-1 text-sm text-muted-foreground">Use these keys to call the Crystal API.</p>
              <div className="mt-4 rounded-lg border border-border bg-secondary p-3">
                <div className="text-xs text-muted-foreground">Production key</div>
                <div className="mt-1.5 flex items-center gap-2">
                  <code className="flex-1 truncate font-mono text-sm">{showKey ? "pk_live_8a2f9d3e1c4b7a5f6e8d9c2b" : "pk_live_••••••••••••••••••••"}</code>
                  <button onClick={() => setShowKey((v) => !v)} className="rounded p-1.5 hover:bg-background">
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button className="rounded p-1.5 hover:bg-background"><Copy className="h-4 w-4" /></button>
                </div>
              </div>
              <Button className="mt-4 btn-brand">Generate new key</Button>
            </div>
          )}

          {active === "workspace" && (
            <div className="surface rounded-xl p-5">
              <h3 className="font-display text-lg">Workspace</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-muted-foreground">Workspace name</label>
                  <input defaultValue="Reyes Studio" className="mt-1 w-full rounded-md border border-border bg-input px-3 py-1.5 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Default export</label>
                  <select className="mt-1 w-full rounded-md border border-border bg-input px-3 py-1.5 text-sm outline-none">
                    <option>React</option><option>Flutter</option><option>HTML</option>
                  </select>
                </div>
              </div>
              <h3 className="mt-6 font-display text-lg">Members</h3>
              <div className="mt-2 space-y-1.5">
                {[["Alex Reyes", "Owner"], ["Maya Chen", "Editor"], ["Diego Alvarez", "Viewer"]].map(([n, r]) => (
                  <div key={n} className="flex items-center justify-between rounded-md border border-border bg-secondary p-2.5 text-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-[var(--gradient-brand)]" />
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
      className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-foreground" : "bg-border"}`}
    >
      <motion.div animate={{ x: on ? 18 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="absolute top-0.5 h-4 w-4 rounded-full bg-background shadow" />
    </button>
  );
}
