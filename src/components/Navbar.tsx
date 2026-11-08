import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Moon, Sun, User, LogOut, Keyboard, Settings, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import { useTheme } from "@/components/ThemeProvider";
import { signOut, useAuth } from "@/lib/auth";
const APP_ROUTES = ["/dashboard", "/builder", "/results", "/settings", "/mcp"];
const links = [{ to: "/community", label: "Community" }, { to: "/docs", label: "Docs" }, { to: "/pricing", label: "Pricing" }] as const;
export function KodarCrystalLogo({ className = "h-7 w-7" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><g transform="rotate(-30 12 12)"><circle cx="7.3" cy="3.2" r="1.45" /><rect x="5.5" y="4.7" width="3.6" height="14.6" rx="1.8" /><rect x="14.9" y="4.7" width="3.6" height="14.6" rx="1.8" /><circle cx="16.7" cy="20.8" r="1.45" /></g></svg>;
}
export function Navbar() {
  const { resolved, toggle } = useTheme();
  const navigate = useNavigate();
  const authenticated = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: state => state.location.pathname });
  if (pathname.startsWith("/workspace") || pathname.startsWith("/preview/")) return null;
  const isApp = APP_ROUTES.some(route => pathname === route || pathname.startsWith(route + "/"));
  const logout = () => { signOut(); void navigate({ to: "/", replace: true }); };
  return <header className="kodar-header sticky top-0 z-50 w-full border-b border-border bg-background/95">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-5 sm:h-[72px] sm:px-8">
      <Link to={authenticated || isApp ? "/dashboard" : "/"} aria-label="KodarCrystal home" className="flex shrink-0 items-center gap-2.5"><KodarCrystalLogo className="h-6 w-6" /><span className="text-[18px] font-semibold tracking-[-0.045em]">Kodar<span className="font-normal text-muted-foreground">Crystal</span></span></Link>
      {!isApp && <nav aria-label="Primary navigation" className="hidden items-center gap-2 md:flex">{links.map(link => <Link key={link.to} to={link.to} className="kodar-nav-link flex items-center px-4 text-xs text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground">{link.label}</Link>)}</nav>}
      <div className="flex items-center gap-1.5 sm:gap-3">
        <button type="button" onClick={toggle} className="flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label={resolved === "dark" ? "Switch to light theme" : "Switch to dark theme"}>{resolved === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>
        {authenticated ? <DropdownMenu><DropdownMenuTrigger asChild><button aria-label="Account menu" className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-secondary text-foreground"><User className="h-4 w-4" /></button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56"><div className="px-2 py-2"><div className="text-sm font-medium">Demo account</div><div className="text-xs text-muted-foreground">KodarCrystal local preview</div></div><DropdownMenuSeparator /><DropdownMenuItem onSelect={() => navigate({ to: "/dashboard" })}><User />Dashboard</DropdownMenuItem><DropdownMenuItem onSelect={() => navigate({ to: "/settings" })}><Settings />Settings</DropdownMenuItem><DropdownMenuItem onSelect={() => toast("Keyboard shortcuts coming soon")}><Keyboard />Keyboard shortcuts</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive" onSelect={logout}><LogOut />Log out</DropdownMenuItem></DropdownMenuContent></DropdownMenu> : <><Link to="/login" className="hidden text-xs text-muted-foreground hover:text-foreground sm:inline">Log in</Link><Button asChild size="sm" className="btn-brand min-h-10 rounded-full px-4 text-xs"><Link to="/signup">Get started</Link></Button></>}
        {!isApp && <Sheet open={menuOpen} onOpenChange={setMenuOpen}><SheetTrigger asChild><Button type="button" variant="ghost" size="icon" aria-label="Open navigation" className="h-11 w-11 md:hidden"><Menu className="h-5 w-5" /></Button></SheetTrigger><SheetContent side="right" aria-describedby={undefined}><SheetTitle className="text-lg">KodarCrystal</SheetTitle><nav aria-label="Mobile navigation" className="mt-8 flex flex-col gap-2">{links.map(link => <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center rounded-md px-3 text-base hover:bg-secondary">{link.label}</Link>)}<Link to="/changelog" onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center rounded-md px-3 hover:bg-secondary">Changelog</Link>{!authenticated && <Link to="/login" onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center rounded-md px-3 hover:bg-secondary">Log in</Link>}<a href="https://kodarmonet.vercel.app" className="mt-6 border-t border-border px-3 pt-6 text-sm text-muted-foreground">KodarMonet Labs ↗</a><a href="https://kodardesign.vercel.app" className="px-3 py-3 text-sm text-muted-foreground">KodarDesign ↗</a></nav></SheetContent></Sheet>}
      </div>
    </div>
  </header>;
}
