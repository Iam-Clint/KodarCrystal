import { Link } from "@tanstack/react-router";
import { Sparkles, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
  }, [light]);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <nav className="glass-strong flex items-center justify-between rounded-2xl px-4 py-2.5 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.5)]">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--glow-purple)] to-[var(--glow-blue)]">
              <Sparkles className="h-4 w-4 text-white" />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[var(--glow-purple)] to-[var(--glow-blue)] blur-md opacity-60 -z-10" />
            </div>
            <span className="font-display text-base font-semibold tracking-tight">Prompt to App</span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {[
              { to: "/", label: "Home" },
              { to: "/dashboard", label: "Dashboard" },
              { to: "/builder", label: "Builder" },
              { to: "/pricing", label: "Pricing" },
              { to: "/settings", label: "Settings" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-white/5 data-[status=active]:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLight((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white/5 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Toggle theme"
            >
              {light ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Button asChild size="sm" className="bg-gradient-to-r from-[var(--glow-purple)] to-[var(--glow-blue)] text-white hover:opacity-90 shadow-[0_4px_20px_-4px_var(--glow-purple)]">
              <Link to="/builder">Start Building</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
