import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { AuthGate } from "@/components/AuthGate";

const Workspace = lazy(() => import("@/components/WorkspacePage"));

export const Route = createFileRoute("/workspace")({
  validateSearch: zodValidator(z.object({ projectId: z.string().catch("").default("") })), 
  head: () => ({
    meta: [
      { title: "Workspace — Watch your app get built | KodarCrystal" },
      { name: "description", content: "Chat with KodarCrystal and watch a live preview of your app come together, prompt by prompt." },
      { property: "og:title", content: "Workspace — Watch your app get built | KodarCrystal" },
      { property: "og:description", content: "Chat with KodarCrystal and watch a live preview of your app come together." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkspaceRoute,
});

function WorkspaceRoute() {
  const { projectId } = Route.useSearch();
  return (
    <AuthGate>
      <Suspense fallback={<div className="min-h-[60vh] bg-background" />}><Workspace key={projectId} projectId={projectId} /></Suspense>
    </AuthGate>
  );
}

