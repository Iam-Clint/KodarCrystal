export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 animate-grid-move" />
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[var(--glow-purple)] opacity-20 blur-[120px] animate-orb" />
      <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-[var(--glow-blue)] opacity-15 blur-[140px] animate-orb [animation-delay:-6s]" />
      <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-[var(--glow-cyan)] opacity-10 blur-[120px] animate-orb [animation-delay:-12s]" />
    </div>
  );
}
