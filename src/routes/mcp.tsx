import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthGate } from "@/components/AuthGate";
import { Plug, ShieldCheck, ArrowLeft } from "lucide-react";
import { MCPConnections } from "@/components/MCPConnections";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mcp")({
  head: () => ({
    meta: [
      { title: "MCP Connections — Crystal.dev" },
      { name: "description", content: "Connect Crystal to the apps you already use — GitHub, Vercel, Supabase, Notion and more." },
      { property: "og:title", content: "MCP Connections — Crystal.dev" },
      { property: "og:description", content: "Connect Crystal to the apps you already use — GitHub, Vercel, Supabase, Notion and more." },
    ],
  }),
  component: () => (
    <AuthGate>
      <MCPPage />
    </AuthGate>
  ),
});

function MCPPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8">
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground">
        <Link to="/dashboard"><ArrowLeft className="mr-1 h-4 w-4" /> Back to dashboard</Link>
      </Button>

      <header className="mb-8 max-w-2xl">
        <div className="flex items-center gap-2">
          <Plug className="h-5 w-5 text-rose-500" />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Integrations</span>
        </div>
        <h1 className="mt-2 font-display text-4xl">
          MCP <em className="italic gradient-text">connections</em>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Give Crystal live tools from the apps you already use. Every connection is scoped to the
          permissions you approve — never more. Search, filter by category, and connect or disconnect
          any server from this single panel.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Permission-scoped access
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Plug className="h-3.5 w-3.5 text-rose-500" />
            Model Context Protocol
          </span>
        </div>
      </header>

      <MCPConnections />
    </div>
  );
}
