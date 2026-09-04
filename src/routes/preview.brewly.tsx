import { createFileRoute } from "@tanstack/react-router";
import { PreviewFrame } from "@/components/PreviewFrame";

export const Route = createFileRoute("/preview/brewly")({
  head: () => ({
    meta: [
      { title: "Brewly preview — Crystal.dev" },
      { name: "description", content: "Standalone live preview of the Brewly coffee subscription app generated in Crystal.dev." },
      { property: "og:title", content: "Brewly preview — Crystal.dev" },
      { property: "og:description", content: "Standalone live preview of the Brewly app generated in Crystal.dev." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PreviewPage,
});

function PreviewPage() {
  return (
    <div className="min-h-screen bg-secondary/30 p-4 sm:p-8">
      <h1 className="sr-only">Brewly live preview</h1>
      <PreviewFrame />
    </div>
  );
}
