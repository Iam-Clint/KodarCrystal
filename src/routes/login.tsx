import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrystalLogo } from "@/components/Navbar";
import { OAuthButtons } from "@/components/OAuthButtons";
import { signIn } from "@/lib/auth";
import {
  authCardClass,
  authFieldClass,
  authInputClass,
  cardVariants,
  errorTransition,
  errorVariants,
  itemVariants,
  listVariants,
} from "@/components/auth-motion";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Crystal.dev" },
      { name: "description", content: "Sign in to Crystal to keep building beautiful apps with AI." },
      { property: "og:title", content: "Log in — Crystal.dev" },
      { property: "og:description", content: "Sign in to Crystal to keep building beautiful apps with AI." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return setError("Enter a valid email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    setError(null);
    setLoading(true);
    setTimeout(() => {
      signIn();
      navigate({ to: "/dashboard" });
    }, 900);
  };

  return (
    <main className="relative flex min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-16">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
      <motion.div variants={cardVariants} initial="hidden" animate="show" className={authCardClass}>
        <div className="flex flex-col items-center text-center">
          <CrystalLogo className="h-8 w-8 sm:h-9 sm:w-9" />
          <h1 className="mt-4 font-display text-2xl sm:text-3xl">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Log in to continue building</p>
        </div>

        <OAuthButtons className="mt-6 sm:mt-7" />

        <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground sm:my-6">
          <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
        </div>

        <motion.form
          variants={listVariants}
          initial="hidden"
          animate="show"
          onSubmit={submit}
          className="space-y-3"
        >
          <motion.label variants={itemVariants} className={authFieldClass}>
            <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className={authInputClass}
            />
          </motion.label>
          <motion.label variants={itemVariants} className={authFieldClass}>
            <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={authInputClass}
            />
          </motion.label>

          <AnimatePresence initial={false}>
            {error && (
              <motion.div
                key="err"
                variants={errorVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                transition={errorTransition}
                role="alert"
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-600 dark:text-rose-300">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <label className="flex items-center gap-1.5 text-muted-foreground">
              <input type="checkbox" className="h-3.5 w-3.5 rounded" /> Remember me
            </label>
            <Link to="/forgot-password" className="text-muted-foreground hover:text-foreground">
              Forgot password?
            </Link>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button type="submit" disabled={loading} className="btn-brand h-11 w-full text-[15px] sm:h-10 sm:text-sm">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Log in <ArrowRight className="ml-1 h-4 w-4" /></>}
            </Button>
          </motion.div>
        </motion.form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-foreground hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </main>
  );
}
