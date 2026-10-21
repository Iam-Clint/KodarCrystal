import { createFileRoute, Link } from '@tanstack/react-router';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CrystalLogo } from '@/components/Navbar';
import { authCardClass, authFieldClass, authInputClass, cardVariants } from '@/components/auth-motion';
import { useResendCooldown } from '@/hooks/use-resend-cooldown';
import { RESET_EXPIRY_MINUTES } from '@/lib/account-flow';
import { toast } from 'sonner';
export const Route = createFileRoute('/forgot-password')({ head: () => ({ meta: [
  { title: 'Forgot your password — Crystal.dev' }, { name: 'description', content: 'Request a reset link for your Crystal account.' },
  { property: 'og:title', content: 'Forgot your password — Crystal.dev' }, { property: 'og:description', content: 'Recover access to your Crystal account with a password reset link.' },
  { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
] }), component: ForgotPasswordPage });
function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { seconds, restart } = useResendCooldown();
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => { setLoading(false); setSent(true); restart(); }, 1000);
    return () => clearTimeout(timer);
  }, [loading]);
  return <main className="auth-flow relative flex min-h-[calc(100dvh-3.5rem)] items-center justify-center overflow-hidden px-4 py-10"><div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
    <AnimatePresence mode="wait"><motion.div key={sent ? 'success' : 'form'} variants={cardVariants} initial="hidden" animate="show" exit="exit" className={authCardClass}>
      {sent ? <div className="text-center">
        <svg viewBox="0 0 160 120" className="mx-auto h-32 w-40 text-brand" fill="none" aria-hidden="true">
          <motion.path d="M18 30 Q80 24 142 30 L140 101 Q80 106 20 101 Z M19 31 L80 76 L141 31 M21 100 L59 62 M139 100 L101 62" pathLength="100" strokeDasharray="100" initial={{ strokeDashoffset: reduced ? 0 : 100 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 0.8, ease: 'easeInOut' }} stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <motion.path d="M66 12 L71 17 M89 9 L88 17 M109 16 L103 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} />
        </svg>
        <h1 className="mt-4 text-3xl">Check your email</h1><p className="mt-3 break-words text-sm leading-relaxed text-muted-foreground">We sent a reset link to <strong className="text-foreground">{email}</strong>. It expires in {RESET_EXPIRY_MINUTES} minutes.</p>
        <Button variant="ghost" disabled={seconds > 0} className="mt-5 min-h-11 text-brand" onClick={() => { restart(); toast.success('Reset link resent'); }}>{seconds > 0 ? `Resend in ${seconds}s` : 'Resend link'}</Button>
        <Link to="/login" className="mt-3 flex min-h-11 items-center justify-center text-sm text-muted-foreground hover:text-foreground">Back to login</Link>
      </div> : <>
        <CrystalLogo className="mx-auto h-9 w-9" /><h1 className="mt-4 text-center text-3xl">Forgot your password?</h1><p className="mt-2 text-center text-sm text-muted-foreground">Enter your email and we'll send a reset link.</p>
        <form className="mt-6 space-y-3" onSubmit={event => { event.preventDefault(); setLoading(true); }}><label className={authFieldClass}><Mail className="h-4 w-4 shrink-0 text-muted-foreground" /><input aria-label="Email address" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" className={authInputClass} /></label><Button type="submit" disabled={loading} className="btn-brand min-h-11 w-full">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send reset link'}</Button></form>
        <Link to="/login" className="mt-4 flex min-h-11 items-center justify-center text-sm text-muted-foreground hover:text-foreground">Back to login</Link>
      </>}
    </motion.div></AnimatePresence>
  </main>;
}
