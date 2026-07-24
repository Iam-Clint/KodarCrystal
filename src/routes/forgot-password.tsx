import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, ArrowRight, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrystalLogo } from "@/components/Navbar";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — Crystal" },
      { name: "description", content: "Request a password reset link for your Crystal account." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Mock: pretend we dispatched a reset email.
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
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
          <h1 className="mt-4 font-display text-3xl">
            {sent ? "Check your inbox" : "Forgot your password?"}
          </h1>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {sent
              ? `We sent a password reset link to ${email}. Follow the instructions to set a new password.`
              : "Enter the email associated with your account and we'll send you a reset link."}
          </p>
        </div>

        {sent ? (
          <div className="mt-7 space-y-4">
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
            <Button asChild variant="outline" className="h-10 w-full">
              <Link to="/login">
                <ArrowLeft className="mr-1 h-4 w-4" /> Back to log in
              </Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-7 space-y-3">
            <label className="surface flex items-center gap-2 rounded-lg px-3 py-2.5">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
            <Button type="submit" disabled={loading} className="btn-brand h-10 w-full">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>Send reset link <ArrowRight className="ml-1 h-4 w-4" /></>
              )}
            </Button>
            <Link
              to="/login"
              className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" /> Back to log in
            </Link>
          </form>
        )}
      </motion.div>
    </main>
  );
}
