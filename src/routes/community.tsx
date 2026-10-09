import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { isAuthed } from "@/lib/auth";

const CommunityFeed = lazy(() => import("@/components/CommunityFeed"));

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — Crystal.dev" },
      { name: "description", content: "Browse, remix and learn from apps built by the Crystal community." },
      { property: "og:title", content: "Community — Crystal.dev" },
      { property: "og:description", content: "Browse, remix and learn from apps built by the Crystal community." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Community,
});

function Community() {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    if (!isAuthed()) {
      void navigate({ to: "/signup", replace: true });
      return;
    }
    setAllowed(true);
  }, [navigate]);
  if (!allowed) return <div className="min-h-[60vh] bg-background" />;
  return <Suspense fallback={<div className="min-h-[60vh] bg-background" />}><CommunityFeed /></Suspense>;
}
