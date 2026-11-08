import { useDemoTimeout } from "@/hooks/use-demo-timeout";
import { Loader2 } from "lucide-react";
import { memo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { BrandIcon } from "@/components/BrandIcon";
import { oauthVariants } from "@/components/auth-motion";
import { signIn } from "@/lib/auth";

const providers = [
  { id: "google", label: "Continue with Google" },
  { id: "apple", label: "Continue with Apple" },
  { id: "github", label: "Continue with GitHub" },
];

export const OAuthButtons = memo(function OAuthButtons({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
 const schedule = useDemoTimeout();
  const [loading, setLoading] = useState<string | null>(null);

  const go = (provider: string) => {
    setLoading(provider);
    schedule(() => {
      signIn();
      navigate({ to: "/workspace" });
    }, 900);
  };

  return (
    <motion.div
      variants={oauthVariants}
      initial="hidden"
      animate="show"
      className={`grid gap-2 ${className}`}
    >
      {providers.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => go(p.id)}
          disabled={loading !== null}
          aria-label={p.label}
          className="surface flex min-h-[44px] w-full items-center justify-center gap-2.5 rounded-lg px-3 text-[15px] font-medium transition-colors hover:bg-secondary disabled:opacity-60 sm:text-sm"
        >
          {loading === p.id ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
          ) : (
            <BrandIcon id={p.id} className="h-[18px] w-[18px] shrink-0" mono={p.id !== "google"} />
          )}
          <span className="truncate">{p.label}</span>
        </button>
      ))}
    </motion.div>
  );
});
