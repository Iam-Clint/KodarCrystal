import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrystalLogo } from "@/components/Navbar";
import { OAuthButtons } from "@/components/OAuthButtons";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Crystal" },
      { name: "description", content: "Sign in to Crystal to keep building beautiful apps with AI." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => navigate({ to: "/onboarding" }), 900);
  };

  return (
    <main className="relative flex min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="surface relative w-full max-w-md rounded-2xl p-8"
      >
        <div className="flex flex-col items-center text-center">
          <CrystalLogo className="h-9 w-9" />
          <h1 className="mt-4 font-display text-3xl">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Log in to continue building</p>
        </div>

        <OAuthButtons className="mt-7" />

        <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          <label className="surface flex items-center gap-2 rounded-lg px-3 py-2.5">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
          <label className="surface flex items-center gap-2 rounded-lg px-3 py-2.5">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-1.5 text-muted-foreground">
              <input type="checkbox" className="h-3 w-3 rounded" /> Remember me
            </label>
            <Link to="/forgot-password" className="text-muted-foreground hover:text-foreground">Forgot password?</Link>
          </div>
          <Button type="submit" disabled={loading} className="btn-brand h-10 w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Log in <ArrowRight className="ml-1 h-4 w-4" /></>}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-foreground hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </main>
  );
}
