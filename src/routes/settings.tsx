import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/AuthGate";
import { motion } from "framer-motion";
import { useState } from "react";
import { User, CreditCard, Bell, Key, Building2, Palette, Copy, Eye, EyeOff, Plug, Check, Gauge, Upload, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandIcon } from "@/components/BrandIcon";
import { useTheme } from "@/components/ThemeProvider";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Crystal.dev" },
      { name: "description", content: "Manage your profile, billing, notifications, API keys, connectors and workspace." },
    ],
  }),
  component: () => (
    <AuthGate>
      <Settings />
    </AuthGate>
  ),
});

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "usage", label: "Usage & Access", icon: Gauge },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "connectors", label: "Connectors", icon: Plug },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "api", label: "API Keys", icon: Key },
  { id: "workspace", label: "Workspace", icon: Building2 },
] as const;

const effortLevels = [
  { id: "low", label: "Low", desc: "Fast, minimal reasoning — small tweaks", cost: "~1x" },
  { id: "medium", label: "Medium", desc: "Balanced — most tasks", cost: "~2x" },
  { id: "high", label: "High", desc: "Deeper reasoning — complex features", cost: "~4x" },
  { id: "max", label: "Max", desc: "Maximum reasoning — hardest problems, uses the most credits", cost: "~8x" },
] as const;

const weeklyUsage = [
  { day: "Mon", credits: 120, project: "Lumen Finance" },
  { day: "Tue", credits: 260, project: "Brewly Coffee" },
  { day: "Wed", credits: 90, project: "Lumen Finance" },
  { day: "Thu", credits: 340, project: "Nova CRM" },
  { day: "Fri", credits: 180, project: "Brewly Coffee" },
  { day: "Sat", credits: 45, project: "Playground" },
  { day: "Sun", credits: 145, project: "Nova CRM" },
];

const connectorGroups = [
  {
    group: "Deploy & hosting",
    items: [
      { id: "github", name: "GitHub", desc: "Two-way sync your codebase to a repo.", mark: "GH", connected: true, meta: "alexr/lumen-finance" },
      { id: "vercel", name: "Vercel", desc: "Ship previews and production deploys.", mark: "▲", connected: false },
      { id: "netlify", name: "Netlify", desc: "Deploy static builds with edge functions.", mark: "N", connected: false },
      { id: "cloudflare", name: "Cloudflare", desc: "Workers, Pages and DNS management.", mark: "CF", connected: false },
    ],
  },
  {
    group: "Backend & data",
    items: [
      { id: "supabase", name: "Supabase", desc: "Postgres, auth and storage for your app.", mark: "SB", connected: true, meta: "crystal-prod" },
      { id: "stripe", name: "Stripe", desc: "Payments, subscriptions and checkout.", mark: "S", connected: false },
      { id: "resend", name: "Resend", desc: "Transactional email from your app.", mark: "R", connected: false },
    ],
  },
  {
    group: "Design & team",
    items: [
      { id: "figma", name: "Figma", desc: "Import frames and design tokens.", mark: "F", connected: false },
      { id: "slack", name: "Slack", desc: "Build notifications in your channels.", mark: "SL", connected: true, meta: "#crystal-builds" },
      { id: "linear", name: "Linear", desc: "Turn issues into build tasks.", mark: "L", connected: false },
    ],
  },
];

function Settings() {
  const [active, setActive] = useState<typeof tabs[number]["id"]>("profile");
  const [showKey, setShowKey] = useState(false);
  const { theme, setTheme } = useTheme();
  const [defaultEffort, setDefaultEffort] = useState<typeof effortLevels[number]["id"]>("medium");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [githubLinked, setGithubLinked] = useState(true);
  const [connected, setConnected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(connectorGroups.flatMap((g) => g.items.map((i) => [i.id, !!i.connected]))),
  );
  const [connectorFilter, setConnectorFilter] = useState<"all" | "connected" | "available">("all");

  const onAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatar(URL.createObjectURL(file));
    e.target.value = "";
  };



  return (
    <div className="mx-auto mt-8 max-w-5xl px-4 pb-16">
      <div className="mb-7">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Settings</div>
        <h1 className="mt-1 font-display text-3xl md:text-4xl">Account & preferences</h1>
      </div>

      <div className="grid gap-5 md:grid-cols-[60px_1fr] lg:grid-cols-[200px_1fr]">
        <aside className="surface sticky top-20 z-10 flex h-fit gap-1 overflow-x-auto rounded-xl p-1.5 md:block md:overflow-visible">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                title={t.label}
                aria-label={t.label}
                className={`flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors md:w-full md:justify-center lg:justify-start ${
                  isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="md:hidden lg:inline">{t.label}</span>
              </button>
            );
          })}

        </aside>

        <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {active === "profile" && (
            <>
              <div className="surface flex flex-col gap-4 rounded-xl p-5 sm:flex-row sm:items-center">
                {avatar ? (
                  <img src={avatar} alt="Your profile avatar" className="h-16 w-16 shrink-0 rounded-full object-cover" />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--gradient-brand)] font-display text-xl text-white">AX</div>
                )}
                <div className="flex-1">
                  <div className="font-display text-xl">Alex Reyes</div>
                  <div className="text-sm text-muted-foreground">alex@crystal.dev · Pro plan</div>
                  <p className="mt-1 text-[11px] text-muted-foreground">PNG or JPG, up to 2MB. Preview only — nothing is uploaded.</p>
                </div>
                <div className="flex gap-2">
                  <label className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-md border border-border px-3 text-sm transition-colors hover:bg-secondary">
                    <Upload className="h-3.5 w-3.5" /> Upload
                    <input type="file" accept="image/*" className="sr-only" onChange={onAvatarFile} aria-label="Upload avatar" />
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!avatar}
                    onClick={() => setAvatar(null)}
                    className="text-muted-foreground"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </Button>
                </div>
              </div>

              <div className="surface rounded-xl p-5">
                <h3 className="font-display text-lg">Connected account</h3>
                <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-secondary p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-background">
                    <BrandIcon id="github" className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">GitHub</span>
                      {githubLinked && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-background px-2 py-0.5 text-[10px] text-muted-foreground">
                          <Check className="h-3 w-3 text-rose-500" /> Connected
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {githubLinked ? "Sign in with GitHub and sync repos." : "Link GitHub to sign in and sync repos."}
                    </p>
                    {githubLinked && <div className="mt-1.5 truncate font-mono text-[10px] text-muted-foreground">alexr · 12 repos</div>}
                  </div>
                  <Button
                    size="sm"
                    variant={githubLinked ? "outline" : "default"}
                    className={githubLinked ? "" : "btn-brand"}
                    onClick={() => setGithubLinked((v) => !v)}
                  >
                    {githubLinked ? "Disconnect" : "Connect"}
                  </Button>
                </div>
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

          {active === "usage" && (
            <div className="space-y-5">
              <div className="surface rounded-xl p-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Current plan</div>
                    <div className="mt-1 font-display text-2xl gradient-text">Pro</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl">1,820 <span className="text-base text-muted-foreground">/ 3,000</span></div>
                    <div className="text-xs text-muted-foreground">credits remaining this cycle</div>
                  </div>
                </div>
                <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "60.6%" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="h-full rounded-full bg-[var(--gradient-brand)]"
                  />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-secondary p-3">
                    <div className="text-xs text-muted-foreground">Platform credits</div>
                    <div className="mt-1 font-display text-xl">1,340 <span className="text-sm text-muted-foreground">/ 2,200</span></div>
                    <p className="mt-1 text-[11px] text-muted-foreground">Prompting, planning and code generation.</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary p-3">
                    <div className="text-xs text-muted-foreground">Cloud / hosting credits</div>
                    <div className="mt-1 font-display text-xl">480 <span className="text-sm text-muted-foreground">/ 800</span></div>
                    <p className="mt-1 text-[11px] text-muted-foreground">Previews, deploys, storage and bandwidth.</p>
                  </div>
                </div>
              </div>

              <div className="surface rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg">This week</h3>
                  <span className="text-xs text-muted-foreground">
                    {weeklyUsage.reduce((a, d) => a + d.credits, 0)} credits used
                  </span>
                </div>
                <div className="mt-4 flex h-36 items-end gap-2">
                  {weeklyUsage.map((d) => {
                    const max = Math.max(...weeklyUsage.map((w) => w.credits));
                    return (
                      <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(d.credits / max) * 100}%` }}
                          transition={{ duration: 0.5 }}
                          title={`${d.day}: ${d.credits} credits — ${d.project}`}
                          className="w-full rounded-t-md bg-gradient-to-t from-rose-400 to-amber-300"
                        />
                        <span className="text-[10px] text-muted-foreground">{d.day}</span>
                      </div>
                    );
                  })}
                </div>
                <ul className="mt-4 divide-y divide-border text-sm">
                  {weeklyUsage.map((d) => (
                    <li key={d.day} className="flex items-center justify-between py-1.5">
                      <span className="text-muted-foreground">{d.day} · {d.project}</span>
                      <span className="font-mono text-xs">{d.credits}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="surface rounded-xl p-5">
                <h3 className="font-display text-lg">Default effort level</h3>
                <p className="mt-1 text-sm text-muted-foreground">Applied to new prompts unless you change it in the builder.</p>
                <div className="mt-4 grid gap-1 rounded-lg border border-border bg-secondary p-1 sm:grid-cols-4">
                  {effortLevels.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setDefaultEffort(l.id)}
                      className={`relative rounded-md px-3 py-2 text-sm transition-colors ${
                        defaultEffort === l.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {defaultEffort === l.id && <motion.div layoutId="effort-pill" className="absolute inset-0 rounded-md bg-background shadow-sm" />}
                      <span className="relative flex items-center justify-center gap-1.5">
                        {l.label} <span className="font-mono text-[10px] text-muted-foreground">{l.cost}</span>
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {effortLevels.find((l) => l.id === defaultEffort)?.desc}
                </p>
              </div>

              <div className="surface rounded-xl p-5">
                <h3 className="font-display text-lg">Guardrails</h3>
                <div className="mt-3 space-y-3">
                  <label className="flex items-center justify-between gap-4 rounded-lg border border-border bg-secondary p-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Warn me before high-cost actions
                      </div>
                      <div className="text-xs text-muted-foreground">Confirm before running High or Max effort prompts.</div>
                    </div>
                    <Toggle defaultOn />
                  </label>
                  <label className="flex items-center justify-between gap-4 rounded-lg border border-border bg-secondary p-3">
                    <div>
                      <div className="text-sm font-medium">Auto-fallback to Low effort under 15% balance</div>
                      <div className="text-xs text-muted-foreground">Keeps you building when credits run low.</div>
                    </div>
                    <Toggle defaultOn={false} />
                  </label>
                </div>
              </div>
            </div>
          )}

          {active === "appearance" && (
            <div className="surface rounded-xl p-5">
              <h3 className="font-display text-lg">Theme</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Follows your system preference by default — a manual choice is remembered and stays in sync with the navbar toggle.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {([
                  { id: "light", label: "Light", swatch: "bg-gradient-to-br from-amber-50 to-rose-100" },
                  { id: "dark", label: "Dark", swatch: "bg-gradient-to-br from-stone-900 to-stone-700" },
                  { id: "system", label: "System", swatch: "bg-gradient-to-br from-amber-100 to-stone-700" },
                ] as const).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`surface cursor-pointer rounded-lg p-3 text-left ${theme === t.id ? "ring-2 ring-rose-300" : ""}`}
                  >
                    <div className={`h-16 rounded-md ${t.swatch}`} />
                    <div className="mt-2 text-sm font-medium">{t.label}</div>
                  </button>
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

          {active === "connectors" && (
            <div className="space-y-5">
              <div className="surface rounded-xl p-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg">Connectors</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Link services to your workspace — deploys, data, design and team tools.
                    </p>
                  </div>
                  <div className="flex gap-1 rounded-lg border border-border bg-secondary p-0.5">
                    {(["all", "connected", "available"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setConnectorFilter(f)}
                        className={`relative rounded-md px-3 py-1.5 text-xs capitalize transition-colors ${
                          connectorFilter === f ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {connectorFilter === f && (
                          <motion.div layoutId="conn-filter" className="absolute inset-0 rounded-md bg-background shadow-sm" />
                        )}
                        <span className="relative">{f}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {connectorGroups.map((g) => {
                const items = g.items.filter((i) =>
                  connectorFilter === "all" ? true : connectorFilter === "connected" ? connected[i.id] : !connected[i.id],
                );
                if (!items.length) return null;
                return (
                  <div key={g.group}>
                    <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">{g.group}</div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {items.map((c) => {
                        const on = connected[c.id];
                        return (
                          <motion.div key={c.id} whileHover={{ y: -3 }} className="surface flex flex-col rounded-xl p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary">
                                <BrandIcon id={c.id} className="h-4 w-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{c.name}</span>
                                  {on && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                                      <Check className="h-3 w-3 text-rose-500" /> Connected
                                    </span>
                                  )}
                                </div>
                                <p className="mt-0.5 text-xs text-muted-foreground">{c.desc}</p>
                                {on && c.meta && (
                                  <div className="mt-1.5 truncate font-mono text-[10px] text-muted-foreground">{c.meta}</div>
                                )}
                              </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                              <Button
                                size="sm"
                                variant={on ? "outline" : "default"}
                                className={on ? "" : "btn-brand"}
                                onClick={() => setConnected((s) => ({ ...s, [c.id]: !s[c.id] }))}
                              >
                                {on ? "Disconnect" : "Connect"}
                              </Button>
                              {on && (
                                <Button size="sm" variant="ghost" className="text-muted-foreground">
                                  Configure
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
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
