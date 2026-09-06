import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Mail, Lock, User, ArrowRight, Loader2, Check, AlertCircle } from "lucide-react";
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

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — Crystal.dev" },
      { name: "description", content: "Create your Crystal account and start turning prompts into full apps." },
      { property: "og:title", content: "Sign up — Crystal.dev" },
      { property: "og:description", content: "Create your Crystal account and start turning prompts into full apps." },
    ],
  }),
  component: SignupPage,
});

const perks = ["Unlimited public projects", "Deploy in one click", "Live multiplayer editing"];

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError("Please enter your full name.");
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
          <h1 className="mt-4 font-display text-2xl sm:text-3xl">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Free forever · No credit card</p>
        </div>

        <ul className="mt-5 space-y-1.5">
          {perks.map((p) => (
            <li key={p} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" /> {p}
            </li>
          ))}
        </ul>

        <OAuthButtons className="mt-5 sm:mt-6" />

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
            <User className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className={authInputClass}
            />
          </motion.label>
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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 8 characters)"
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

          <motion.div variants={itemVariants}>
            <Button type="submit" disabled={loading} className="btn-brand h-11 w-full text-[15px] sm:h-10 sm:text-sm">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create account <ArrowRight className="ml-1 h-4 w-4" /></>}
            </Button>
          </motion.div>
          <motion.p variants={itemVariants} className="text-center text-[11px] text-muted-foreground">
            By continuing you agree to our{" "}
            <Link to="/legal/terms" className="underline hover:text-foreground">Terms</Link>
            {" "}&{" "}
            <Link to="/legal/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
          </motion.p>
        </motion.form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-foreground hover:underline">Log in</Link>
        </p>
      </motion.div>
    </main>
  );
}
