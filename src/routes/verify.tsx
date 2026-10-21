import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CrystalLogo } from '@/components/Navbar';
import { SuccessCircle } from '@/components/SuccessCircle';
import { authCardClass, cardVariants, digitSpring, shakeVariants } from '@/components/auth-motion';
import { useResendCooldown } from '@/hooks/use-resend-cooldown';
import { isValidOtp, RESEND_SECONDS } from '@/lib/account-flow';
import { signIn } from '@/lib/auth';
import { toast } from 'sonner';

export const Route = createFileRoute('/verify')({
  head: () => ({ meta: [
    { title: 'Verify your email — Crystal.dev' },
    { name: 'description', content: 'Confirm your email with a six-digit code to begin building with Crystal.' },
    { property: 'og:title', content: 'Verify your email — Crystal.dev' },
    { property: 'og:description', content: 'Confirm your email and continue to your Crystal projects.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }), component: VerifyPage,
});

function DigitBounce({ pulse, delay, children }: { pulse: number; delay: number; children: React.ReactNode }) {
  const controls = useAnimationControls();
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!pulse || reduced) return;
    const timer = setTimeout(async () => {
      await controls.start({ scale: 1.18, transition: digitSpring });
      await controls.start({ scale: 1, transition: digitSpring });
    }, delay);
    return () => { clearTimeout(timer); controls.stop(); };
  }, [pulse, delay, controls, reduced]);
  return <motion.div animate={controls}>{children}</motion.div>;
}

function VerifyPage() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [pulses, setPulses] = useState<number[]>(Array(6).fill(0));
  const [pasted, setPasted] = useState(false);
  const [phase, setPhase] = useState<'input' | 'converge' | 'success' | 'exit'>('input');
  const [error, setError] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const shake = useAnimationControls();
  const { seconds, restart } = useResendCooldown(RESEND_SECONDS);
  const code = digits.join('');
  useEffect(() => { inputs.current[0]?.focus(); }, []);
  useEffect(() => {
    if (code.length !== 6 || phase !== 'input') return;
    const timer = setTimeout(async () => {
      if (isValidOtp(code)) { setPhase('converge'); return; }
      setError(true);
      await shake.start(reduced ? { x: 0 } : 'shake');
      setDigits(Array(6).fill(''));
      inputs.current[0]?.focus();
    }, 400);
    return () => clearTimeout(timer);
  }, [code, phase, shake, reduced]);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (phase === 'converge') timer = setTimeout(() => setPhase('success'), 700);
    if (phase === 'success') timer = setTimeout(() => setPhase('exit'), 950);
    if (phase === 'exit') timer = setTimeout(() => { signIn(); void navigate({ to: '/dashboard' }); }, 250);
    return () => { if (timer) clearTimeout(timer); };
  }, [phase, navigate]);
  const updateDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    setError(false); setPasted(false);
    setDigits(previous => previous.map((entry, i) => i === index ? digit : entry));
    if (digit) {
      setPulses(previous => previous.map((entry, i) => i === index ? entry + 1 : entry));
      inputs.current[index + 1]?.focus();
    }
  };
  const pasteCode = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!text) return;
    setError(false); setPasted(true);
    setDigits(Array.from({ length: 6 }, (_, i) => text[i] ?? ''));
    setPulses(previous => previous.map((entry, i) => text[i] ? entry + 1 : entry));
    inputs.current[Math.min(text.length, 5)]?.focus();
  };
  const stride = ((rowRef.current?.clientWidth ?? 328) + 8) / 6;
  return <main className="auth-flow relative flex min-h-[calc(100dvh-3.5rem)] items-center justify-center overflow-hidden px-4 py-10">
    <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
    <motion.div variants={cardVariants} initial="hidden" animate={phase === 'exit' ? 'exit' : 'show'} className={authCardClass}>
      <div className="text-center"><CrystalLogo className="mx-auto h-9 w-9" /><h1 className="mt-4 text-3xl">Check your inbox</h1><p className="mt-2 text-sm text-muted-foreground">We sent a 6-digit code to your email.</p></div>
      <div className="relative mt-8 flex h-28 items-center justify-center">
        {(phase === 'input' || phase === 'converge') && <motion.div ref={rowRef} variants={shakeVariants} animate={shake} className="grid w-full max-w-[328px] grid-cols-6 gap-2" onPaste={pasteCode}>
          {digits.map((digit, i) => <motion.div key={i} animate={{ x: phase === 'converge' && !reduced ? (2.5 - i) * stride : 0, opacity: phase === 'converge' ? 0 : 1 }} transition={{ x: { duration: 0.4, ease: 'easeIn' }, opacity: { delay: 0.4, duration: 0.3 } }}>
            <DigitBounce pulse={pulses[i] ?? 0} delay={pasted ? i * 60 : 0}>
              <input ref={element => { inputs.current[i] = element; }} aria-label={`Digit ${i + 1}`} aria-invalid={error} value={digit} onChange={event => updateDigit(i, event.target.value)} onKeyDown={event => {
                if (event.key === 'Backspace') { event.preventDefault(); if (digit) updateDigit(i, ''); else { updateDigit(Math.max(0, i - 1), ''); inputs.current[Math.max(0, i - 1)]?.focus(); } }
                if (event.key === 'ArrowLeft') inputs.current[i - 1]?.focus();
                if (event.key === 'ArrowRight') inputs.current[i + 1]?.focus();
              }} disabled={phase !== 'input'} maxLength={1} inputMode="numeric" pattern="[0-9]*" autoComplete={i === 0 ? 'one-time-code' : 'off'} className={`h-14 w-full min-w-0 rounded-lg border bg-background text-center font-mono text-xl outline-none focus:ring-2 focus:ring-brand/40 ${error ? 'border-destructive text-destructive' : 'border-border'}`} />
            </DigitBounce>
          </motion.div>)}
        </motion.div>}
        {(phase === 'success' || phase === 'exit') && <SuccessCircle />}
      </div>
      <div className="min-h-6 text-center">{error && <p role="alert" className="text-sm text-destructive">That code isn't right. Please try again.</p>}{phase === 'success' && <p role="status" className="text-sm text-live">Email verified</p>}</div>
      <div className="mt-4 flex flex-wrap items-center justify-center text-sm text-muted-foreground"><span>Didn't receive it?</span><Button variant="ghost" disabled={seconds > 0 || phase !== 'input'} className="min-h-11 px-2 text-brand" onClick={() => { restart(); toast.success('Verification code resent'); }}>{seconds > 0 ? `Resend in ${seconds}s` : 'Resend'}</Button></div>
      <Link to="/login" className="mt-3 flex min-h-11 items-center justify-center text-sm text-muted-foreground hover:text-foreground">Back to login</Link>
    </motion.div>
  </main>;
}
