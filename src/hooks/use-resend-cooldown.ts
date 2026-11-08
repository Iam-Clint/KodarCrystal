import { useCallback, useEffect, useState } from 'react';
import { RESEND_SECONDS } from '@/lib/account-flow';
export function useResendCooldown(initial = 0) {
  const [seconds, setSeconds] = useState(initial);
  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds(value => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);
  const restart = useCallback(() => setSeconds(RESEND_SECONDS), []);
  return { seconds, restart };
}
