import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles, Wand2, Code2, Users, LayoutTemplate, Zap, ArrowRight, Play,
  Check, Smartphone, BarChart3, MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingCard } from "@/components/FloatingCard";
import { features, steps, testimonials, plans } from "@/lib/mock-data";

const iconMap = { Sparkles, Wand2, Code2, Users, LayoutTemplate, Zap };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prompt to App — Turn Prompts Into Full Apps Instantly" },
      { name: "description", content: "AI-powered app generation. Describe your idea and get a complete app concept, pages, features and branding in seconds." },
      { property: "og:title", content: "Prompt to App — Turn Prompts Into Full Apps Instantly" },
      { property: "og:description", content: "Describe your idea, get a complete app concept in seconds." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="relative">
      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-4 pt-20 pb-32 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--glow-cyan)]" />
              Now in public beta — v2.0 shipped
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
            >
              Turn Prompts Into <span className="gradient-text">Full Apps</span> Instantly
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-xl text-lg text-muted-foreground"
            >
              Describe what you want to build. Get a complete app concept — pages, features, branding and UI structure — designed and ready to ship.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button asChild size="lg" className="h-12 bg-gradient-to-r from-[var(--glow-purple)] to-[var(--glow-blue)] px-6 text-white hover:opacity-90 shadow-[0_8px_30px_-6px_var(--glow-purple)]">
                <Link to="/builder">Start Building <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 border-white/15 bg-white/5 px-6 backdrop-blur hover:bg-white/10">
                <Play className="mr-2 h-4 w-4" /> Watch Demo
              </Button>
            </motion.div>
            <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <div>⭐ 4.9/5 from 2,400+ teams</div>
              <div className="hidden md:block">No credit card required</div>
            </div>
          </div>

          {/* Floating preview cards */}
          <div className="relative h-[520px]">
            <FloatingCard delay={0} rotate={-6} className="absolute left-0 top-8 w-56">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <div className="h-2 w-2 rounded-full bg-[var(--glow-purple)]" />
                <span className="text-xs text-muted-foreground">AI Prompt</span>
              </div>
              <p className="mt-2 font-mono text-[11px] leading-relaxed text-foreground/80">
                "Build a finance app with budgeting, AI insights and Stripe…"
              </p>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/5">
                <div className="h-full w-3/4 bg-gradient-to-r from-[var(--glow-purple)] to-[var(--glow-blue)] animate-shimmer" />
              </div>
            </FloatingCard>

            <FloatingCard delay={0.4} rotate={4} className="absolute right-0 top-0 w-64">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <BarChart3 className="h-3 w-3 text-[var(--glow-blue)]" />
                <span className="text-xs">Analytics</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-white/5 p-2">
                  <div className="text-[10px] text-muted-foreground">Users</div>
                  <div className="font-display text-lg font-semibold">12.4k</div>
                </div>
                <div className="rounded-lg bg-white/5 p-2">
                  <div className="text-[10px] text-muted-foreground">Revenue</div>
                  <div className="font-display text-lg font-semibold gradient-text">$48k</div>
                </div>
              </div>
              <div className="mt-3 flex h-12 items-end gap-1">
                {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-[var(--glow-purple)] to-[var(--glow-blue)]" style={{ height: `${h}%` }} />
                ))}
              </div>
            </FloatingCard>

            <FloatingCard delay={0.8} rotate={-3} className="absolute left-12 bottom-8 w-52">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <Smartphone className="h-3 w-3 text-[var(--glow-cyan)]" />
                <span className="text-xs">Mobile App</span>
              </div>
              <div className="mt-3 space-y-1.5">
                {["Home", "Wallet", "Insights", "Settings"].map((t) => (
                  <div key={t} className="flex items-center justify-between rounded-md bg-white/5 px-2 py-1.5">
                    <span className="text-[11px]">{t}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </FloatingCard>

            <FloatingCard delay={0.6} rotate={5} className="absolute right-8 bottom-20 w-48">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <MessageSquare className="h-3 w-3 text-[var(--glow-purple)]" />
                <span className="text-xs">Dashboard</span>
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-2 w-full rounded-full bg-white/10" />
                <div className="h-2 w-2/3 rounded-full bg-white/10" />
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <div className="h-8 rounded-md bg-gradient-to-br from-[var(--glow-purple)]/40 to-transparent" />
                  <div className="h-8 rounded-md bg-gradient-to-br from-[var(--glow-blue)]/40 to-transparent" />
                  <div className="h-8 rounded-md bg-gradient-to-br from-[var(--glow-cyan)]/40 to-transparent" />
                </div>
              </div>
            </FloatingCard>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs uppercase tracking-widest text-[var(--glow-cyan)]">Features</div>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Everything you need to ship</h2>
          <p className="mt-4 text-muted-foreground">A complete toolkit from prompt to production.</p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = iconMap[f.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -6, rotateX: 4, rotateY: -4 }}
                style={{ transformStyle: "preserve-3d" }}
                className="glass gradient-border group relative overflow-hidden rounded-2xl p-6"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--glow-purple)]/20 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--glow-purple)]/30 to-[var(--glow-blue)]/30 ring-1 ring-white/10">
                  <Icon className="h-5 w-5 text-[var(--glow-cyan)]" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs uppercase tracking-widest text-[var(--glow-cyan)]">How it works</div>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Three steps to launch</h2>
        </div>
        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          <div className="absolute inset-x-12 top-12 hidden h-px bg-gradient-to-r from-transparent via-[var(--glow-purple)]/40 to-transparent md:block" />
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="glass relative rounded-2xl p-8 text-center"
            >
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[var(--glow-purple)] to-[var(--glow-blue)] shadow-[0_0_40px_-5px_var(--glow-purple)]">
                <span className="font-display text-3xl font-bold text-white">{s.n}</span>
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs uppercase tracking-widest text-[var(--glow-cyan)]">Loved by builders</div>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">From idea to launch, faster</h2>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass gradient-border rounded-2xl p-6"
            >
              <p className="text-sm leading-relaxed text-foreground/90">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--glow-purple)] to-[var(--glow-blue)] text-sm font-semibold text-white">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs uppercase tracking-widest text-[var(--glow-cyan)]">Pricing</div>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Simple, transparent pricing</h2>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`glass relative rounded-2xl p-6 ${p.featured ? "scale-[1.04] gradient-border glow-purple" : "gradient-border"}`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[var(--glow-purple)] to-[var(--glow-blue)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                  Most Popular
                </div>
              )}
              <div className="text-sm text-muted-foreground">{p.tagline}</div>
              <div className="mt-1 font-display text-2xl font-semibold">{p.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">${p.price}</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
              <ul className="mt-6 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--glow-cyan)]" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild className={`mt-6 w-full ${p.featured ? "bg-gradient-to-r from-[var(--glow-purple)] to-[var(--glow-blue)] text-white" : "bg-white/5 hover:bg-white/10"}`}>
                <Link to="/pricing">Get started</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-7xl border-t border-white/5 px-4 py-10 text-center text-sm text-muted-foreground">
        © 2026 Prompt to App — Built with imagination.
      </footer>
    </main>
  );
}
