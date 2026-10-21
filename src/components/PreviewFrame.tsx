import { memo, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export type PreviewDevice = "desktop" | "tablet" | "mobile";

/** Mocked live-preview of the generated app. */
export const PreviewFrame = memo(function PreviewFrame({
  device = "desktop",
  building = false,
  page = "/",
}: {
  device?: PreviewDevice;
  building?: boolean;
  page?: string;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = useState(0);
  const [contentHeight, setContentHeight] = useState(600);
  const targetWidth = device === "desktop" ? 960 : device === "tablet" ? 768 : 375;
  useEffect(() => {
    const outer = outerRef.current;
    const content = contentRef.current;
    if (!outer || !content) return;
    const observer = new ResizeObserver(() => {
      setAvailableWidth(outer.clientWidth);
      setContentHeight(content.offsetHeight);
    });
    observer.observe(outer); observer.observe(content);
    return () => observer.disconnect();
  }, []);
  const scale = availableWidth > 0 ? Math.min(1, availableWidth / targetWidth) : 1;
  return (
    <div ref={outerRef} className="mx-auto w-full overflow-hidden" style={{ maxWidth: targetWidth, height: contentHeight * scale }} data-preview-device={device}>
      <div ref={contentRef} className="preview-canvas surface overflow-hidden rounded-xl" style={{ width: targetWidth, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <div className="flex items-center gap-1.5 border-b border-border bg-secondary/50 px-3 py-2">
          <div className="h-2 w-2 rounded-full bg-destructive" />
          <div className="h-2 w-2 rounded-full bg-brand-3" />
          <div className="h-2 w-2 rounded-full bg-live" />
          <div className="ml-3 text-[11px] text-muted-foreground">brewly.crystal.dev{page === "/" ? "" : page}</div>
          {building && <Loader2 className="ml-auto h-3 w-3 animate-spin text-muted-foreground" />}
        </div>
        <div className="preview-coffee-background p-6">
          <div className="flex items-center justify-between">
            <div className="font-display text-lg text-foreground">Brewly</div>
            <div className="flex gap-3 text-[11px] text-muted-foreground">
              <span>Beans</span>
              <span>Plans</span>
              <span>Story</span>
            </div>
          </div>
          {page !== "/" ? <BrewlySubpage page={page} /> : <>
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
          <div className="preview-columns mt-8">
            {["Ethiopia", "Colombia", "Sumatra"].map((b) => (
              <div key={b} className="rounded-lg bg-background/70 p-3">
                <div className="preview-bean-art aspect-square rounded-md" />
                <div className="mt-2 text-[11px] text-foreground">{b}</div>
                <div className="text-[11px] text-muted-foreground">Medium roast</div>
              </div>
            ))}
          </div>
          </>}
        </div>
      </div>
    </div>
  );
});

function BrewlySubpage({ page }: { page: string }) {
  const content = page === '/pricing' ? { title: 'Your perfect coffee plan.', desc: 'Fresh roasts, flexible deliveries. Pause or change your plan anytime.', items: ['Starter — $18 / month', 'Daily Ritual — $32 / month', 'Coffee Lover — $48 / month'] } : page === '/about' ? { title: 'Good coffee. Good people.', desc: 'We started Brewly to bring exceptional, responsibly sourced coffee to your everyday routine.', items: ['Our story — from a small roastery to your doorstep', 'Our founder — a lifelong love of great coffee', 'Our promise — fair sourcing, freshly roasted'] } : { title: 'Notes from the roastery.', desc: 'Stories, brewing guides and discoveries from the world of coffee.', items: ['The art of the perfect pour-over', 'Meet our growers in Colombia', 'Finding your favorite roast'] };
  return <section aria-label={`${page} page content`} className="mt-8"><h2 className="text-center font-display text-3xl">{content.title}</h2><p className="mx-auto mt-3 max-w-md text-center text-sm text-muted-foreground">{content.desc}</p><div className="preview-columns mt-8">{content.items.map(item => <article key={item} className="rounded-lg border border-border bg-card p-4"><div className="mb-4 h-1 w-8 rounded-full bg-brand" /><h3 className="font-sans text-sm font-medium">{item}</h3><p className="mt-3 text-xs leading-relaxed text-muted-foreground">{page === '/pricing' ? 'Fresh beans · flexible delivery · free shipping' : page === '/about' ? 'Thoughtfully sourced. Carefully roasted. Shared with you.' : 'Explore the people and techniques behind every cup.'}</p></article>)}</div></section>;
}
