import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { appTypes, effortLevels, inferProjectName, type Effort } from '@/lib/site-blueprint';
const starters: Record<string, string> = {
  'Landing page': 'Build a landing page for a coffee subscription service with featured beans, testimonials and pricing.',
  'SaaS dashboard': 'Build a SaaS dashboard for business teams to manage projects, track progress and collaborate.',
  Portfolio: 'Build a portfolio for a designer with selected work, case studies and a contact page.',
  'E-commerce': 'Build an e-commerce store for handmade goods with a product catalog, cart and checkout.',
  Blog: 'Build a blog about technology with categories, articles and a newsletter signup.',
  'Mobile app': 'Build a mobile app for students to track study goals, assignments and daily progress.',
};
const styles = [{ id: 'clean', name: 'Clean & Minimal', desc: 'System font · subtle borders' }, { id: 'bold', name: 'Bold & Editorial', desc: 'Display serif · high contrast' }, { id: 'warm', name: 'Warm & Friendly', desc: 'Soft corners · brand colors' }];
function StylePreview({ direction }: { direction: string }) {
  return <svg viewBox="0 0 240 140" aria-hidden="true" className={`style-preview style-${direction} mb-3 w-full rounded-md`}><rect width="240" height="140" fill="var(--style-bg)" /><path d="M14 28H226" stroke="var(--style-line)" /><rect x="14" y="12" width="33" height="5" rx="2" fill="var(--style-fg)" /><rect x="183" y="12" width="43" height="5" rx="2" fill="var(--style-line)" /><text x="15" y="57" fill="var(--style-fg)" fontSize="17" fontFamily={direction === 'bold' ? 'var(--font-display)' : 'var(--font-sans)'}>Make something</text><text x="15" y="77" fill="var(--style-fg)" fontSize="17" fontFamily={direction === 'bold' ? 'var(--font-display)' : 'var(--font-sans)'}>worth sharing.</text><rect x="15" y="89" width="78" height="4" rx="2" fill="var(--style-line)" /><rect x="15" y="102" width="48" height="15" rx={direction === 'warm' ? 7 : 2} fill="var(--style-accent)" /><rect x="146" y="43" width="79" height="76" rx={direction === 'warm' ? 12 : 2} fill="var(--style-line)" /><path d="M156 99l20-30 14 18 14-12 12 24Z" fill="var(--style-accent)" /></svg>;
}
export function ProjectIntakeDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState('');
  const [appType, setAppType] = useState('');
  const [style, setStyle] = useState('clean');
  const [name, setName] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [effort, setEffort] = useState<Effort>('medium');
  const start = () => { if (!prompt.trim()) return; onOpenChange(false); void navigate({ to: '/builder', search: { prompt: prompt.trim(), style, effort, name: name.trim() || inferProjectName(prompt), visibility, appType, mode: 'plan' } }); };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="intake-dialog flex h-dvh max-h-dvh w-full max-w-none flex-col gap-5 overflow-y-auto p-5 sm:h-auto sm:max-h-[90dvh] sm:max-w-3xl sm:p-8">
    <div className="pr-6"><div className="mb-2 flex items-center gap-2 text-xs text-brand"><Sparkles className="h-4 w-4" />NEW PROJECT · STEP {step} OF 3</div><DialogTitle className="font-display text-3xl font-normal">{step === 1 ? 'What are you building?' : step === 2 ? 'Choose your style' : 'Configure your project'}</DialogTitle><DialogDescription className="mt-2">{step === 1 ? 'Every great build starts with an idea.' : step === 2 ? 'Pick a direction that feels like your brand.' : 'A few final details before your blueprint.'}</DialogDescription></div>
    <div className="flex gap-2" aria-label={`Step ${step} of 3`}>{[1, 2, 3].map(s => <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-brand' : 'bg-secondary'}`} />)}</div>
    <div className="min-h-0 flex-1">
      {step === 1 && <div><label htmlFor="project-idea" className="text-sm font-medium">Describe your app idea</label><textarea id="project-idea" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="A coffee subscription service with a beautiful storefront, flexible plans, and an account for managing deliveries…" className="mt-2 h-40 w-full resize-none rounded-lg border border-input bg-secondary/50 p-4 text-sm outline-none focus:ring-2 focus:ring-brand" /><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">{appTypes.map(t => <Button key={t} variant="outline" aria-pressed={appType === t} className={`min-h-16 whitespace-normal ${appType === t ? 'border-brand bg-brand/5 ring-1 ring-brand' : ''}`} onClick={() => { setAppType(t); setPrompt(starters[t]); }}>{t}</Button>)}</div></div>}
      {step === 2 && <div className="grid gap-3 sm:grid-cols-3">{styles.map(s => <Button key={s.id} variant="outline" aria-pressed={style === s.id} onClick={() => setStyle(s.id)} className={`flex h-auto flex-col items-stretch whitespace-normal p-3 text-left ${style === s.id ? 'border-brand ring-2 ring-brand' : ''}`}><StylePreview direction={s.id} /><span className="flex items-center justify-between gap-1 text-sm">{s.name}{style === s.id && <Check className="text-brand" />}</span><span className="mt-1 text-[11px] text-muted-foreground">{s.desc}</span></Button>)}</div>}
      {step === 3 && <div className="space-y-5"><div><label htmlFor="project-name" className="text-sm font-medium">Project name</label><input id="project-name" value={name} onChange={e => setName(e.target.value)} placeholder={inferProjectName(prompt)} className="mt-2 h-11 w-full rounded-md border border-input bg-secondary/50 px-3 text-sm" /></div><fieldset><legend className="mb-2 text-sm font-medium">Visibility</legend><div className="flex gap-5">{['public', 'private'].map(v => <label key={v} className="flex min-h-11 cursor-pointer items-center gap-2 text-sm capitalize"><input type="radio" name="visibility" value={v} checked={visibility === v} onChange={() => setVisibility(v)} className="accent-brand" />{v}</label>)}</div></fieldset><fieldset><legend className="mb-2 text-sm font-medium">Effort</legend><div className="grid grid-cols-4 gap-2">{effortLevels.map(e => <Button key={e.id} variant="outline" aria-pressed={effort === e.id} onClick={() => setEffort(e.id)} className={`h-auto min-h-16 flex-col gap-1 px-1 ${effort === e.id ? 'border-brand ring-1 ring-brand' : ''}`}><span>{e.label}</span><span className="text-[11px] text-muted-foreground">{e.cost}</span></Button>)}</div></fieldset></div>}
    </div>
    <footer className="mt-2 flex justify-between gap-2 border-t border-border pt-5"><Button variant="ghost" className="min-h-11" onClick={() => step === 1 ? onOpenChange(false) : setStep(s => s - 1)}><ArrowLeft />{step === 1 ? 'Cancel' : 'Back'}</Button><Button className="btn-brand min-h-11" disabled={!prompt.trim()} onClick={() => step === 3 ? start() : setStep(s => s + 1)}>{step === 3 ? 'Start planning' : 'Continue'}<ArrowRight /></Button></footer>
  </DialogContent></Dialog>;
}