import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Moon, Sun, Github, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { signOut } from "@/lib/auth";

const APP_ROUTES = ["/dashboard", "/builder", "/results", "/settings", "/mcp"];



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
  const { resolved, toggle } = useTheme();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });


  if (pathname.startsWith("/workspace") || pathname.startsWith("/preview/")) return null;

  const isApp = APP_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to={isApp ? "/dashboard" : "/"} className="flex items-center gap-2">
            <CrystalLogo className="h-6 w-6" />
            <span className="font-display text-xl font-medium tracking-tight">Crystal.dev</span>
            <span className="hidden text-[11px] text-muted-foreground lg:inline">Prompt to App Builder</span>
          </Link>
          {!isApp && (
            <nav className="hidden items-center gap-1 md:flex">
              {[
                { to: "/community", label: "Community" },
                { to: "/docs", label: "Docs" },
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
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isApp && (
            <a href="https://github.com" aria-label="Crystal.dev on GitHub" className="hidden h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground sm:flex">
              <Github className="h-4 w-4" />
            </a>
          )}
          <button
            onClick={toggle}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
            aria-label={resolved === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {resolved === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {isApp ? (
            <>
              <Link
                to="/settings"
                aria-label="Account settings"
                className="flex h-8 items-center gap-2 rounded-full border border-border/60 py-1 pl-1 pr-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--gradient-brand)] text-white">
                  <User className="h-3.5 w-3.5" />
                </span>
                <span className="hidden sm:inline">Alex</span>
              </Link>
              <button
                onClick={() => {
                  signOut();
                  navigate({ to: "/", replace: true });
                }}
                aria-label="Log out"
                title="Log out"
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (

            <>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground hidden sm:inline">
                Log in
              </Link>
              <Button asChild size="sm" className="btn-brand h-8 rounded-md px-3 text-sm">
                <Link to="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

