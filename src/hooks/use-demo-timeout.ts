import { useCallback, useEffect, useRef } from "react";

/** Simulated actions must not finish after their screen has been left. */
export function useDemoTimeout() {
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
  }, []);
  return useCallback((callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      callback();
    }, delay);
    timers.current.add(timer);
    return timer;
  }, []);
}
