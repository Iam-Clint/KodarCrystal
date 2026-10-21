import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { isAuthed } from "@/lib/auth";

const CommunityFeed = lazy(() => import("@/components/CommunityFeed"));

const categories = ["SaaS", "Landing page", "E-commerce", "Portfolio", "Blog", "Other"];

function SubmitBuildDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const reset = () => {
    setName("");
    setUrl("");
    setDescription("");
    setCategory("");
  };

  const submit = () => {
    onOpenChange(false);
    toast.success("Thanks! We'll review and post it soon.");
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Share your project</DialogTitle>
          <DialogDescription>
            Tell us what you built. We review every submission before it lands in the community feed.
          </DialogDescription>
        </DialogHeader>
        <form
          className="min-w-0 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="build-name">Project name</Label>
            <Input
              id="build-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Brewly Coffee"
              className="min-h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="build-url">Live URL</Label>
            <Input
              id="build-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="min-h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="build-description">Short description</Label>
            <Textarea
              id="build-description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A coffee subscription storefront with flexible plans."
              className="min-h-0 resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="build-category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="build-category" className="min-h-11 w-full">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="mt-2 gap-2 sm:gap-2">
            <Button type="button" variant="ghost" className="min-h-11" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-brand min-h-11">
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
  const [submitOpen, setSubmitOpen] = useState(false);
  useEffect(() => {
    if (!isAuthed()) {
      void navigate({ to: "/signup", replace: true });
      return;
    }
    setAllowed(true);
  }, [navigate]);
  if (!allowed) return <div className="min-h-[60vh] bg-background" />;
  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 pt-8">
        <div className="surface flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-4">
          <p className="min-w-0 text-sm">
            Built something with Crystal?{" "}
            <span className="text-muted-foreground">Share it with the community.</span>
          </p>
          <Button
            variant="outline"
            className="min-h-11 shrink-0 border-brand/40 text-brand hover:border-brand hover:bg-brand/5 hover:text-brand"
            onClick={() => setSubmitOpen(true)}
          >
            Submit build
          </Button>
        </div>
      </div>
      <Suspense fallback={<div className="min-h-[60vh] bg-background" />}>
        <CommunityFeed />
      </Suspense>
      <SubmitBuildDialog open={submitOpen} onOpenChange={setSubmitOpen} />
    </>
  );
}
