import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Mail, ArrowRight, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrystalLogo } from "@/components/Navbar";
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

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — Crystal.dev" },
      { name: "description", content: "Request a password reset link for your Crystal account." },
      { property: "og:title", content: "Reset your password — Crystal.dev" },
      { property: "og:description", content: "Request a password reset link for your Crystal account." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return setError("Enter the email you signed up with.");
    setError(null);
    setLoading(true);
    // Mock: pretend we dispatched a reset email.
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  };

  return (
    <main className="relative flex min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-16">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
      {/* Modal-style presentation: the card floats in and out over the page. */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sent ? "sent" : "form"}
          variants={cardVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className={authCardClass}
        >
          <div className="flex flex-col items-center text-center">
            <CrystalLogo className="h-8 w-8 sm:h-9 sm:w-9" />
            <h1 className="mt-4 font-display text-2xl sm:text-3xl">
              {sent ? "Check your inbox" : "Forgot your password?"}
            </h1>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {sent
                ? `We sent a password reset link to ${email}. Follow the instructions to set a new password.`
                : "Enter the email associated with your account and we'll send you a reset link."}
            </p>
          </div>

          {sent ? (
            <div className="mt-6 space-y-4 sm:mt-7">
              <div className="surface flex items-start gap-3 rounded-lg p-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <div className="text-xs text-muted-foreground">
                  The link expires in 30 minutes. If you don't see the email, check your spam folder or{" "}
                  <button
                    onClick={() => setSent(false)}
                    className="font-medium text-foreground underline-offset-2 hover:underline"
                  >
                    try a different email
                  </button>
                  .
                </div>
              </div>
              <Button asChild variant="outline" className="h-11 w-full sm:h-10">
                <Link to="/login">
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back to log in
                </Link>
              </Button>
            </div>
          ) : (
            <motion.form
              variants={listVariants}
              initial="hidden"
              animate="show"
              onSubmit={submit}
              className="mt-6 space-y-3 sm:mt-7"
            >
              <motion.label variants={itemVariants} className={authFieldClass}>
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
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
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>Send reset link <ArrowRight className="ml-1 h-4 w-4" /></>
                  )}
                </Button>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link
                  to="/login"
                  className="mt-1 flex items-center justify-center gap-1 py-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3 w-3" /> Back to log in
                </Link>
              </motion.div>
            </motion.form>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
