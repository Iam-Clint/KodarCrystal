import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CrystalLogo } from '@/components/Navbar';
import { SuccessCircle } from '@/components/SuccessCircle';
import { authCardClass, authFieldClass, authInputClass, cardVariants } from '@/components/auth-motion';
import { passwordError } from '@/lib/account-flow';
export const Route = createFileRoute('/reset-password')({ head: () => ({ meta: [
  { title: 'Set a new password — Crystal.dev' }, { name: 'description', content: 'Choose a new password for your Crystal account.' },
  { property: 'og:title', content: 'Set a new password — Crystal.dev' }, { property: 'og:description', content: 'Reset your Crystal password and return to sign in.' },
  { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
] }), component: ResetPasswordPage });
function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<'form' | 'loading' | 'success'>('form');
  useEffect(() => {
    if (phase === 'form') return;
    const timer = setTimeout(() => {
      if (phase === 'loading') setPhase('success');
      else void navigate({ to: '/login', search: { reset: 1 } });
    }, phase === 'loading' ? 1000 : 1200);
    return () => clearTimeout(timer);
  }, [phase, navigate]);
  return <main className="auth-flow relative flex min-h-[calc(100dvh-3.5rem)] items-center justify-center overflow-hidden px-4 py-10"><div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
    <motion.div variants={cardVariants} initial="hidden" animate="show" className={authCardClass}>
      <CrystalLogo className="mx-auto h-9 w-9" /><h1 className="mt-4 text-center text-3xl">Set a new password.</h1>
      {phase === 'success' ? <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="py-8"><SuccessCircle /><p role="status" className="mt-5 text-center text-sm text-live">Password updated</p></motion.div> : <form className="mt-6 space-y-3" onSubmit={event => { event.preventDefault(); const issue = passwordError(password, confirm); setError(issue); if (!issue) setPhase('loading'); }}>
        <label className={authFieldClass}><Lock className="h-4 w-4 shrink-0 text-muted-foreground" /><input aria-label="New password" type="password" required autoComplete="new-password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} className={authInputClass} /></label>
        <label className={authFieldClass}><Lock className="h-4 w-4 shrink-0 text-muted-foreground" /><input aria-label="Confirm password" type="password" required autoComplete="new-password" placeholder="Confirm password" value={confirm} onChange={e => setConfirm(e.target.value)} className={authInputClass} /></label>
        {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} role="alert" className="text-sm text-destructive">{error}</motion.p>}
        <Button disabled={phase === 'loading'} className="btn-brand min-h-11 w-full" type="submit">{phase === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update password'}</Button>
      </form>}
      <Link to="/login" className="mt-4 flex min-h-11 items-center justify-center text-sm text-muted-foreground hover:text-foreground">Back to login</Link>
    </motion.div>
  </main>;
}
