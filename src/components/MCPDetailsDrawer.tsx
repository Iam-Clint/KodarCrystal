import { ExternalLink, KeyRound, Plug, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MCPActivity } from "@/components/MCPActivity";
import { BrandIcon } from "@/components/BrandIcon";
import type { MCPServer } from "@/components/MCPConnections";

export function MCPDetailsDrawer({
  server,
  connected,
  onOpenChange,
  onToggle,
}: {
  server: MCPServer | null;
  connected: boolean;
  onOpenChange: (open: boolean) => void;
  onToggle: (id: string) => void;
}) {
  return (
    <Sheet open={!!server} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-full overflow-y-auto sm:max-w-lg">
        {server && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary"><BrandIcon id={server.id} className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <SheetTitle className="font-display text-xl">{server.name}</SheetTitle>
                  <SheetDescription className="text-xs">{server.desc}</SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { label: "Status", value: connected ? "Live" : "Not connected" },
                  { label: "Tools", value: `${server.tools}` },
                  { label: "Category", value: server.category },
                ].map((s) => (
                  <div key={s.label} className="surface rounded-lg p-3">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                    <p className="mt-1 text-sm font-medium">{s.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Approved scopes
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {server.scope.split(",").map((s) => (
                    <span key={s} className="rounded-full bg-secondary px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                      {s.trim()}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Crystal can only call tools covered by these scopes. Revoke any time.
                </p>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-sm font-medium">
                  <Plug className="h-4 w-4 text-rose-500" /> Quick actions
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button size="sm" variant={connected ? "outline" : "default"} className={connected ? "min-h-11" : "min-h-11 btn-brand"} onClick={() => onToggle(server.id)}>
                    {connected ? "Disconnect" : "Connect"}
                  </Button>
                  <Button size="sm" variant="outline" className="min-h-11"><RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Re-sync tools</Button>
                  <Button size="sm" variant="outline" className="min-h-11"><KeyRound className="mr-1.5 h-3.5 w-3.5" /> Edit scopes</Button>
                  <Button size="sm" variant="ghost" className="min-h-11 text-muted-foreground"><ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Docs</Button>
                  <Button size="sm" variant="ghost" className="min-h-11 text-destructive"><Trash2 className="mr-1.5 h-3.5 w-3.5" /> Revoke</Button>
                </div>
              </div>

              <div>
                <MCPActivity serverId={server.id} />
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
