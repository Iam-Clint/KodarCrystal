import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Prompt to App" },
      { name: "description", content: "Simple plans for individuals, builders and teams. Switch between monthly and yearly billing." },
    ],
  }),
  component: Pricing,
});

const plans = [
  {
    name: "Free", monthly: 0, yearly: 0, tagline: "For exploring",
    features: ["3 apps / month", "Community templates", "Basic export (HTML)", "Single workspace", "Email support"],
  },
  {
    name: "Pro", monthly: 24, yearly: 19, tagline: "For builders", featured: true,
    features: ["Unlimited apps", "Premium templates", "All export formats", "Custom branding", "Priority AI generation", "Version history"],
  },
  {
    name: "Enterprise", monthly: 99, yearly: 79, tagline: "For teams",
    features: ["Everything in Pro", "Multiplayer editing", "Roles & SSO", "Shared design system", "Audit logs", "Dedicated support"],
  },
];

function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="mx-auto mt-8 max-w-6xl px-4 pb-20">
      <div className="text-center">
        <div className="text-xs uppercase tracking-widest text-[var(--glow-cyan)]">Pricing</div>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-6xl">Built for every stage</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Start free. Upgrade when you're ready to ship.</p>

        <div className="mx-auto mt-8 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
          {(["Monthly", "Yearly"] as const).map((label, i) => {
            const active = (i === 1) === yearly;
            return (
              <button
                key={label}
                onClick={() => setYearly(i === 1)}
                className={`relative rounded-full px-5 py-1.5 text-sm transition-colors ${active ? "text-white" : "text-muted-foreground"}`}
              >
                {active && <motion.div layoutId="bill" className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--glow-purple)] to-[var(--glow-blue)]" />}
                <span className="relative">{label}</span>
                {label === "Yearly" && <span className="relative ml-1.5 rounded-full bg-[var(--glow-cyan)]/20 px-1.5 py-0.5 text-[9px] text-[var(--glow-cyan)]">-20%</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            whileHover={{ y: -8 }}
            className={`glass gradient-border relative rounded-3xl p-7 ${p.featured ? "scale-[1.04] shadow-[0_0_60px_-10px_var(--glow-purple)]" : ""}`}
          >
            {p.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[var(--glow-purple)] to-[var(--glow-blue)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-[0_4px_20px_-4px_var(--glow-purple)]">
                Most Popular
              </div>
            )}
            <div className="text-sm text-muted-foreground">{p.tagline}</div>
            <div className="mt-1 font-display text-2xl font-semibold">{p.name}</div>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="font-display text-5xl font-bold">${yearly ? p.yearly : p.monthly}</span>
              <span className="text-sm text-muted-foreground">/{yearly ? "mo, billed yearly" : "month"}</span>
            </div>
            <Button className={`mt-6 w-full ${p.featured ? "bg-gradient-to-r from-[var(--glow-purple)] to-[var(--glow-blue)] text-white" : "bg-white/10 hover:bg-white/15"}`}>
              {p.name === "Free" ? "Start free" : p.name === "Enterprise" ? "Contact sales" : "Start 14-day trial"}
            </Button>
            <ul className="mt-6 space-y-2.5 border-t border-white/5 pt-6">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--glow-cyan)]" /> {f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h3 className="font-display text-2xl font-semibold">Frequently asked</h3>
        <div className="mx-auto mt-6 grid max-w-3xl gap-3 text-left">
          {[
            ["Can I change plans later?", "Yes — upgrade or downgrade anytime, prorated automatically."],
            ["Do you offer student discounts?", "50% off Pro with a valid .edu email."],
            ["What payment methods?", "All major cards, Apple Pay, Google Pay and SEPA."],
          ].map(([q, a]) => (
            <div key={q} className="glass rounded-xl p-5">
              <div className="font-medium">{q}</div>
              <div className="mt-1 text-sm text-muted-foreground">{a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
