import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Briefcase, ShoppingBag, BarChart3, Smartphone, GraduationCap, Users,
  Sparkles, Check, ArrowRight, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome to Crystal — Pick your first use case" },
      { name: "description", content: "Tell Crystal what you want to build first so we can tailor your prompt builder." },
    ],
  }),
  component: OnboardingPage,
});

const useCases = [
  { id: "saas", label: "SaaS landing page", desc: "Marketing site with pricing, features and CTA.", icon: Briefcase, seed: "A modern SaaS landing page with hero, features, pricing tiers and testimonials." },
  { id: "ecom", label: "E-commerce store", desc: "Product catalog with cart and Stripe checkout.", icon: ShoppingBag, seed: "An e-commerce store with product grid, cart drawer and Stripe checkout." },
  { id: "dashboard", label: "Admin dashboard", desc: "Analytics, tables and charts for internal tools.", icon: BarChart3, seed: "An admin dashboard with sidebar navigation, KPI cards, charts and a data table." },
  { id: "portfolio", label: "Personal portfolio", desc: "Showcase your work with a polished portfolio.", icon: Smartphone, seed: "A minimalist personal portfolio with case studies, about page and contact form." },
  { id: "edu", label: "Learning platform", desc: "Courses, lessons and progress tracking.", icon: GraduationCap, seed: "A learning platform with course cards, lesson pages and progress tracking." },
  { id: "social", label: "Social / community app", desc: "Feed, profiles and comments.", icon: Users, seed: "A social community app with a feed, user profiles, likes and comments." },
];

function OnboardingPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!selected) return;
    setLoading(true);
    // Mock persistence for the prompt builder to pick up.
    try {
      const uc = useCases.find((u) => u.id === selected);
      if (uc && typeof window !== "undefined") {
        window.localStorage.setItem("crystal:onboarding", JSON.stringify({ id: uc.id, seed: uc.seed }));
      }
    } catch { /* ignore */ }
    setTimeout(() => navigate({ to: "/builder" }), 600);
  };

  return (
    <main className="relative mx-auto max-w-4xl px-4 pb-16 pt-16 sm:pt-20">
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-40" />

      <div className="mb-8 flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
        Step 1 of 1 · Welcome to Crystal
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="text-center font-display text-4xl md:text-5xl"
      >
        What do you want to <em className="italic gradient-text">build first?</em>
      </motion.h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">
        Pick a use case and Crystal will pre-fill your Prompt Builder so you can start shipping right away.
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {useCases.map((u, i) => {
          const Icon = u.icon;
          const isActive = selected === u.id;
          return (
            <motion.button
              key={u.id}
              onClick={() => setSelected(u.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -3 }}
              className={`surface relative rounded-2xl p-5 text-left transition-all ${
                isActive ? "ring-2 ring-rose-400 ring-offset-2 ring-offset-background" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                  <Icon className="h-4 w-4 text-rose-500" />
                </div>
                {isActive && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
              <div className="mt-3 text-sm font-medium">{u.label}</div>
              <p className="mt-1 text-xs text-muted-foreground">{u.desc}</p>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-10 flex items-center justify-between gap-3">
        <button
          onClick={() => navigate({ to: "/builder" })}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Skip for now
        </button>
        <Button onClick={submit} disabled={!selected || loading} className="btn-brand h-10 px-5">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
            <>
              <Sparkles className="mr-1.5 h-4 w-4" /> Continue to Prompt Builder <ArrowRight className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </main>
  );
}
