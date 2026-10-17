import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Crystal.dev" },
      { name: "description", content: "Simple plans for individuals, builders and teams." },
      { property: "og:title", content: "Pricing — Crystal.dev" },
      { property: "og:description", content: "Simple plans for individuals, builders and teams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pricing,
});

const plans = [
  { name: "Free", monthly: 0, yearly: 0, tagline: "For exploring",
    features: ["3 projects / month", "Community templates", "Basic export", "Single workspace"] },
  { name: "Pro", monthly: 24, yearly: 19, tagline: "For builders", featured: true,
    features: ["Unlimited projects", "Premium templates", "All export formats", "Custom domain", "Priority AI", "Version history"] },
  { name: "Team", monthly: 99, yearly: 79, tagline: "For teams",
    features: ["Everything in Pro", "Multiplayer editing", "Roles & SSO", "Shared design system", "Audit logs", "Dedicated support"] },
];

function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="text-center">
        <h1 className="font-display text-4xl md:text-6xl">Pricing that <em className="italic gradient-text">scales</em></h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">Start free. Upgrade when you're ready to ship.</p>

        <div className="mx-auto mt-7 inline-flex items-center gap-0.5 rounded-full border border-border bg-secondary p-0.5">
          {(["Monthly", "Yearly"] as const).map((label, i) => {
            const active = (i === 1) === yearly;
            return (
              <button
                key={label}
                onClick={() => setYearly(i === 1)}
                className={`relative rounded-full px-4 py-1 text-sm transition-colors ${active ? "text-foreground" : "text-muted-foreground"}`}
              >
                {active && <motion.div layoutId="bill" className="absolute inset-0 rounded-full bg-background shadow-sm" />}
                <span className="relative">{label}</span>
                {label === "Yearly" && <span className="relative ml-1.5 rounded-full bg-rose-100 px-1.5 py-0.5 text-[9px] text-rose-700">-20%</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`surface relative rounded-2xl p-6 ${p.featured ? "ring-2 ring-rose-300 shadow-[var(--shadow-elevated)]" : ""}`}
          >
            {p.featured && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--gradient-brand)] px-2.5 py-0.5 text-[10px] font-medium text-white">
                Most popular
              </div>
            )}
            <div className="text-xs text-muted-foreground">{p.tagline}</div>
            <div className="mt-1 font-display text-xl">{p.name}</div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-5xl">${yearly ? p.yearly : p.monthly}</span>
              <span className="text-sm text-muted-foreground">/mo</span>
            </div>
            <Button asChild className={`mt-5 w-full ${p.featured ? "btn-brand" : ""}`} variant={p.featured ? "default" : "outline"}>
              {p.name === "Team" ? (
                <a href="mailto:hello@crystal.dev">Contact sales</a>
              ) : (
                <Link to="/signup">{p.name === "Free" ? "Start free" : "Start trial"}</Link>
              )}
            </Button>
            <ul className="mt-6 space-y-2 border-t border-border pt-5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" /> {f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h3 className="font-display text-2xl">Frequently asked</h3>
        <div className="mx-auto mt-5 grid max-w-2xl gap-2 text-left">
          {[
            ["Can I change plans later?", "Yes — upgrade or downgrade anytime, prorated automatically."],
            ["Do you offer student discounts?", "50% off Pro with a valid .edu email."],
            ["What payment methods?", "All major cards, Apple Pay, Google Pay and SEPA."],
          ].map(([q, a]) => (
            <div key={q} className="surface rounded-lg p-4">
              <div className="text-sm font-medium">{q}</div>
              <div className="mt-0.5 text-sm text-muted-foreground">{a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
