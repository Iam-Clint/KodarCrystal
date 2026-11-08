import { createFileRoute } from "@tanstack/react-router";
import { PreviewFrame } from "@/components/PreviewFrame";
import { useEffect, useState } from "react";
import { brewlyPages } from "@/lib/site-blueprint";

export const Route = createFileRoute("/preview/brewly")({
  head: () => ({
    meta: [
      { title: "Brewly preview — KodarCrystal" },
      { name: "description", content: "Standalone live preview of the Brewly coffee subscription app generated in KodarCrystal." },
      { property: "og:title", content: "Brewly preview — KodarCrystal" },
      { property: "og:description", content: "Standalone live preview of the Brewly app generated in KodarCrystal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PreviewPage,
});

function PreviewPage() {
  const [page, setPage] = useState("/");
  useEffect(() => {
    const update = () => {
      const path = window.location.hash.slice(1);
      setPage(brewlyPages.some(candidate => candidate.path === path) ? path : "/");
    };
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  return (
    <div className="min-h-screen bg-secondary/30 p-4 sm:p-8">
      <h1 className="sr-only">Brewly live preview</h1>
      <PreviewFrame page={page} />
    </div>
  );
}
