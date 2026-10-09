import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AuthGate } from "@/components/AuthGate";

const Workspace = lazy(() => import("@/components/WorkspacePage"));

export const Route = createFileRoute("/workspace")({
  head: () => ({
    meta: [
      { title: "Workspace — Watch your app get built | Crystal.dev" },
      { name: "description", content: "Chat with Crystal.dev and watch a live preview of your app come together, prompt by prompt." },
      { property: "og:title", content: "Workspace — Watch your app get built | Crystal.dev" },
      { property: "og:description", content: "Chat with Crystal.dev and watch a live preview of your app come together." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AuthGate>
      <Suspense fallback={<div className="min-h-[60vh] bg-background" />}><Workspace /></Suspense>
    </AuthGate>
  ),
});

