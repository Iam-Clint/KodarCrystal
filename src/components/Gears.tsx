/** Interlocked spinning gears — pure SVG + CSS, no dependencies. */

function gearPath(teeth: number, rOut: number, rRoot: number): string {
  const parts: string[] = [];
  const steps = teeth * 4;
  for (let i = 0; i < steps; i++) {
    // Alternate root → tip → tip → root for a square-ish tooth profile.
    const r = i % 4 === 1 || i % 4 === 2 ? rOut : rRoot;
    const a = (i / steps) * Math.PI * 2 - Math.PI / 2;
    parts.push(`${i === 0 ? "M" : "L"}${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`);
  }
  return parts.join(" ") + " Z";
}

function Gear({
  teeth,
  hole,
  className = "",
  duration,
  reverse = false,
}: {
  teeth: number;
  hole: number;
  className?: string;
  duration: string;
  reverse?: boolean;
}) {
  return (
    <svg
      viewBox="-60 -60 120 120"
      aria-hidden="true"
      className={`${reverse ? "gear-spin-ccw" : "gear-spin-cw"} ${className}`}
      style={{ animationDuration: duration }}
    >
      <path d={gearPath(teeth, 54, 43)} fill="currentColor" />
      <circle r={hole} fill="var(--background)" />
      <circle r={hole + 5} fill="none" stroke="var(--background)" strokeWidth="2" opacity="0.35" />
    </svg>
  );
}

export function Gears() {
  return (
    <div className="relative h-44 w-64" aria-hidden="true">
      <Gear teeth={12} hole={14} duration="14s" className="absolute left-0 top-10 h-36 w-36 text-rose-400" />
      <Gear teeth={9} hole={11} duration="9s" reverse className="absolute right-14 top-0 h-24 w-24 text-amber-400" />
      <Gear teeth={7} hole={8} duration="6s" className="absolute bottom-0 right-4 h-16 w-16 text-rose-300" />
    </div>
  );
}
