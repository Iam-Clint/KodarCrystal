import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Sun, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CrystalLogo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 32 32" className="h-full w-full" fill="none">
        <defs>
          <linearGradient id="crystalGrad" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0%" stopColor="oklch(0.7 0.22 350)" />
            <stop offset="50%" stopColor="oklch(0.78 0.2 30)" />
            <stop offset="100%" stopColor="oklch(0.85 0.16 70)" />
          </linearGradient>
        </defs>
        <path
          d="M16 2 L28 12 L22 28 L10 28 L4 12 Z"
          fill="url(#crystalGrad)"
          stroke="oklch(1 0 0 / 0.4)"
          strokeWidth="0.5"
        />
        <path d="M16 2 L22 28 M16 2 L10 28 M4 12 L28 12" stroke="oklch(1 0 0 / 0.5)" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

export function Navbar() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <CrystalLogo className="h-6 w-6" />
            <span className="font-display text-xl font-medium tracking-tight">Crystal</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {[
              { to: "/community", label: "Community" },
              { to: "/backend", label: "Backend" },
              { to: "/mcp", label: "MCP" },
              { to: "/pricing", label: "Pricing" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <a href="https://github.com" className="hidden h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground sm:flex">
            <Github className="h-4 w-4" />
          </a>
          <button
            onClick={() => setDark((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground hidden sm:inline">
            Log in
          </Link>
          <Button asChild size="sm" className="btn-brand h-8 rounded-md px-3 text-sm">
            <Link to="/signup">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
