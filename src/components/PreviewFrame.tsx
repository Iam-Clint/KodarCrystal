import { memo } from "react";
import { Loader2 } from "lucide-react";

export type PreviewDevice = "desktop" | "tablet" | "mobile";

/** Mocked live-preview of the generated app. */
export const PreviewFrame = memo(function PreviewFrame({
  device = "desktop",
  building = false,
}: {
  device?: PreviewDevice;
  building?: boolean;
}) {
  const width =
    device === "desktop" ? "max-w-4xl" : device === "tablet" ? "max-w-xl" : "max-w-[320px]";

  return (
    <div className={`mx-auto w-full ${width} transition-[max-width]`}>
      <div className="surface overflow-hidden rounded-xl">
        <div className="flex items-center gap-1.5 border-b border-border bg-secondary/50 px-3 py-2">
          <div className="h-2 w-2 rounded-full bg-red-400" />
          <div className="h-2 w-2 rounded-full bg-yellow-400" />
          <div className="h-2 w-2 rounded-full bg-green-400" />
          <div className="ml-3 text-[11px] text-muted-foreground">brewly.crystal.dev</div>
          {building && <Loader2 className="ml-auto h-3 w-3 animate-spin text-muted-foreground" />}
        </div>
        <div className="bg-gradient-to-br from-rose-50 to-amber-50 p-6 dark:from-zinc-900 dark:to-zinc-800">
          <div className="flex items-center justify-between">
            <div className="font-display text-lg text-foreground">Brewly</div>
            <div className="flex gap-3 text-[11px] text-muted-foreground">
              <span>Beans</span>
              <span>Plans</span>
              <span>Story</span>
            </div>
          </div>
          <div className="mt-8 text-center">
            <div className="font-display text-3xl text-foreground">
              Coffee, <em className="italic">delivered</em>.
            </div>
            <p className="mx-auto mt-2 max-w-sm text-xs text-muted-foreground">
              Freshly roasted beans at your door every week.
            </p>
            <div className="mt-4 inline-flex rounded-md bg-foreground px-3 py-1.5 text-[11px] text-background">
              Subscribe
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {["Ethiopia", "Colombia", "Sumatra"].map((b) => (
              <div key={b} className="rounded-lg bg-background/70 p-3">
                <div className="aspect-square rounded-md bg-gradient-to-br from-rose-200 to-amber-200" />
                <div className="mt-2 text-[11px] text-foreground">{b}</div>
                <div className="text-[11px] text-muted-foreground">Medium roast</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
