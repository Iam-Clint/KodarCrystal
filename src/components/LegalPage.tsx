export type LegalSection = { heading: string; body: string[] };

export function LegalPage({ title, updated, intro, sections }: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">Crystal.dev · Legal</div>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">{title}</h1>
      <p className="mt-2 text-xs text-muted-foreground">Last updated {updated}</p>
      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{intro}</p>
      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.heading} className="surface rounded-xl p-6">
            <h2 className="font-display text-xl">{s.heading}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-2 text-sm leading-relaxed text-muted-foreground">{p}</p>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
