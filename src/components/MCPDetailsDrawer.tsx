import { useDemoTimeout } from "@/hooks/use-demo-timeout";
import { useEffect, useState } from "react";
import { ExternalLink, KeyRound, Loader2, Plug, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const schedule = useDemoTimeout();
  const [syncing, setSyncing] = useState(false);
  const [editingScopes, setEditingScopes] = useState(false);
  const [checkedScopes, setCheckedScopes] = useState<Record<string, boolean>>({});
  const [revokeOpen, setRevokeOpen] = useState(false);

  useEffect(() => {
    setSyncing(false);
    setEditingScopes(false);
    setRevokeOpen(false);
    setCheckedScopes(
      server
        ? Object.fromEntries(server.scope.split(",").map((s) => [s.trim(), true]))
        : {},
    );
  }, [server]);

  const resync = () => {
    if (syncing) return;
    setSyncing(true);
    schedule(() => {
      setSyncing(false);
      toast.success("Synced successfully");
    }, 1200);
  };

  const handleRevoke = () => {
    if (!server || !connected) return;
    setRevokeOpen(false);
    onToggle(server.id);
    onOpenChange(false);
    toast.success(`${server.name} connection revoked`);
  };

  return (
    <>
      <Sheet open={!!server} onOpenChange={onOpenChange}>
        <SheetContent className="w-full max-w-full overflow-y-auto sm:max-w-lg">
          {server && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary">
                    <BrandIcon id={server.id} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <SheetTitle className="font-display text-xl">{server.name}</SheetTitle>
                    <SheetDescription className="text-xs">{server.desc}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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

                {/* Scopes */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-medium">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" /> Approved scopes
                  </h3>

                  {editingScopes ? (
                    <div className="mt-2 space-y-1.5">
                      {Object.keys(checkedScopes).map((scope) => (
                        <label
                          key={scope}
                          className="flex cursor-pointer items-center gap-2.5 rounded-md border border-border bg-secondary px-3 py-2"
                        >
                          <input
                            type="checkbox"
                            checked={checkedScopes[scope]}
                            onChange={() =>
                              setCheckedScopes((prev) => ({ ...prev, [scope]: !prev[scope] }))
                            }
                            className="h-3.5 w-3.5 accent-rose-500"
                          />
                          <span className="font-mono text-xs">{scope}</span>
                        </label>
                      ))}
                      <Button
                        size="sm"
                        className="mt-2 btn-brand"
                        onClick={() => {
                          setEditingScopes(false);
                          toast.success("Scopes updated");
                        }}
                      >
                        Save scopes
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {server.scope.split(",").map((s) => (
                        <span
                          key={s}
                          className={`rounded-full px-2.5 py-1 font-mono text-[11px] transition-opacity ${
                            checkedScopes[s.trim()] === false
                              ? "bg-secondary text-muted-foreground/40 line-through"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="mt-2 text-xs text-muted-foreground">
                    KodarCrystal can only call tools covered by these scopes. Revoke any time.
                  </p>
                </div>

                {/* Quick actions */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-medium">
                    <Plug className="h-4 w-4 text-brand" /> Quick actions
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={connected ? "outline" : "default"}
                      className={connected ? "min-h-11" : "min-h-11 btn-brand"}
                      onClick={() => onToggle(server.id)}
                    >
                      {connected ? "Disconnect" : "Connect"}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="min-h-11"
                      disabled={syncing}
                      onClick={resync}
                    >
                      {syncing ? (
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                      )}
                      {syncing ? "Syncing…" : "Re-sync tools"}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className={`min-h-11 ${editingScopes ? "ring-2 ring-ring" : ""}`}
                      onClick={() => setEditingScopes((v) => !v)}
                    >
                      <KeyRound className="mr-1.5 h-3.5 w-3.5" />
                      {editingScopes ? "Done editing" : "Edit scopes"}
                    </Button>

                    <Button size="sm" variant="ghost" className="min-h-11 text-muted-foreground" asChild>
                      <a
                        href={`/docs#mcp-connections`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Docs
                      </a>
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="min-h-11 text-destructive hover:bg-destructive/10"
                      onClick={() => setRevokeOpen(true)}
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Revoke
                    </Button>
                  </div>
                </div>

                {/* Activity */}
                <div>
                  <MCPActivity serverId={server.id} />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Revoke confirmation dialog — rendered outside Sheet so it isn't clipped */}
      <AlertDialog open={revokeOpen} onOpenChange={setRevokeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke access to {server?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This disconnects {server?.name} from KodarCrystal and removes all granted scopes. You can reconnect any time from the MCP page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
