import { ArrowRight, Check, FileText, Layers, NotebookPen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { estimateCredits, type Effort, type SiteBlueprint as Blueprint } from '@/lib/site-blueprint';

export function SiteBlueprint({ plan, effort, onApprove, onRefine }: { plan: Blueprint; effort: Effort; onApprove: () => void; onRefine: () => void }) {
  const estimate = estimateCredits(plan.pages, plan.componentCount, effort);
  return <section aria-label="Site Blueprint" className="min-w-0 space-y-5">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
      <div><div className="flex items-center gap-2 text-xs font-medium text-brand"><NotebookPen className="h-4 w-4" /> BEFORE THE BUILD</div><h2 className="mt-1 font-display text-3xl">Site Blueprint</h2></div>
      <span className="flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand/5 px-3 py-1.5 text-xs"><Check className="h-3 w-3 text-brand" /> Ready for your review</span>
    </header>
    <section className="surface rounded-lg p-5"><h3 className="mb-4 flex items-center gap-2 text-lg"><span className="text-brand">A.</span> Project Brief</h3>
      <h4 className="font-display text-2xl">{plan.name}</h4><p className="mt-2 break-words text-sm leading-relaxed text-muted-foreground">{plan.description}</p>
      <dl className="mt-5 grid gap-4 border-t border-border pt-4 sm:grid-cols-2"><div><dt className="text-xs text-muted-foreground">Target audience</dt><dd className="mt-1 text-sm">{plan.audience}</dd></div><div><dt className="text-xs text-muted-foreground">Primary goal</dt><dd className="mt-1 text-sm">{plan.goal}</dd></div></dl>
    </section>
    <section><div className="mb-3 flex items-center justify-between gap-2"><h3 className="text-xl"><span className="text-brand">B.</span> Pages &amp; Routes</h3><span className="text-xs text-muted-foreground">{plan.pages.length} pages</span></div>
      <div className="space-y-2">{plan.pages.map(p => <div key={p.path} className="surface grid min-w-0 gap-2 rounded-lg p-3 sm:grid-cols-[130px_minmax(0,1fr)_auto] sm:items-start">
        <div className="flex min-w-0 items-center gap-2"><FileText className="h-4 w-4 shrink-0 text-brand" /><code className="break-all text-xs">{p.path}</code></div>
        <div><div className="text-sm font-medium">{p.name}</div><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.sections.join(' · ')}</p></div>
        <span className={`w-fit rounded-md px-2 py-1 text-[11px] ${p.complexity === 'Complex' ? 'bg-brand/10 text-brand' : p.complexity === 'Medium' ? 'bg-brand-3/15 text-foreground' : 'bg-secondary text-muted-foreground'}`}>{p.complexity}</span>
      </div>)}</div>
    </section>
    <section className="border-t border-border pt-5"><h3 className="mb-3 text-xl"><span className="text-brand">C.</span> Component Inventory</h3><div className="grid gap-3 sm:grid-cols-2">{Object.entries(plan.components).filter(([, items]) => items.length).map(([group, items]) => <div key={group} className="surface rounded-lg p-4"><div className="mb-3 flex items-center gap-2 text-xs font-medium text-brand"><Layers className="h-3.5 w-3.5" />{group}</div><div className="flex flex-wrap gap-1.5">{items.map(item => <span key={item} className="rounded-md bg-secondary px-2 py-1 text-[11px]">{item}</span>)}</div></div>)}</div></section>
    <section className="border-t border-border pt-5"><h3 className="mb-3 text-xl"><span className="text-brand">D.</span> Tech Decisions</h3><div className="flex flex-wrap gap-2">{plan.tech.map(t => <span key={t} className="rounded-md border border-border bg-card px-2.5 py-1.5 text-xs">{t}</span>)}</div></section>
    <section className="surface rounded-lg p-5"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-xl"><span className="text-brand">E.</span> Estimated Credits</h3><span className="text-xs capitalize text-muted-foreground">{effort} effort</span></div>
      <dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-3"><dt className="text-muted-foreground">{estimate.pageCount} pages × {estimate.creditsPerPage} credits</dt><dd>{estimate.pageCount * estimate.creditsPerPage}</dd></div><div className="flex justify-between gap-3"><dt className="text-muted-foreground">{estimate.componentCount} reusable components</dt><dd>{estimate.componentCredits}</dd></div><div className="flex items-center justify-between border-t border-border pt-3"><dt>Total estimated build</dt><dd className="font-display text-3xl text-brand">{estimate.total}<span className="ml-1 font-sans text-xs text-muted-foreground">credits</span></dd></div></dl>
      <p className="mt-3 text-[11px] text-muted-foreground">Planning uses no credits. Build estimate only; no credits will be charged in this demo.</p>
    </section>
    <div className="flex flex-wrap gap-2"><Button className="btn-brand min-h-11" onClick={onApprove}><Sparkles className="h-4 w-4" />Approve &amp; Build<ArrowRight className="h-4 w-4" /></Button><Button variant="outline" className="min-h-11" onClick={onRefine}>Refine Plan</Button></div>
  </section>;
}