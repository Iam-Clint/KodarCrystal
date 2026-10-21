import { motion, useReducedMotion } from 'framer-motion';
import { checkVariants, successCircleVariants } from '@/components/auth-motion';

export function SuccessCircle() {
  const reduced = useReducedMotion();
  return <motion.div role="img" aria-label="Success" variants={successCircleVariants} initial={reduced ? false : 'hidden'} animate="show" className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-live text-success-foreground">
    <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none" aria-hidden="true">
      <motion.path d="M11 25l9 9 18-20" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" pathLength="100" strokeDasharray="100" variants={checkVariants} initial={reduced ? false : 'hidden'} animate="show" />
    </svg>
  </motion.div>;
}