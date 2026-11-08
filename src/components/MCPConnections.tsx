import { lazy, Suspense } from "react";
export type { MCPServer } from "@/components/MCPConnectionsPanel";

const Panel = lazy(() => import("@/components/MCPConnectionsPanel"));

export function MCPConnections({ compact = false }: { compact?: boolean }) {
  return (
    <Suspense fallback={<div className="min-h-32 bg-background" />}>
      <Panel compact={compact} />
    </Suspense>
  );
}
