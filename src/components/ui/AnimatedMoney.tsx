import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { formatMoney } from '../../lib/format';
import { cn } from '../../lib/cn';

type AnimatedMoneyProps = {
  value: number;
  className?: string;
  durationMs?: number;
};

export function AnimatedMoney({ value, className, durationMs = 650 }: AnimatedMoneyProps) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    if (from === value) return;

    if (reduceMotion) {
      fromRef.current = value;
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (value - from) * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        fromRef.current = value;
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs, reduceMotion]);

  return <span className={cn('num', className)}>{formatMoney(display)}</span>;
}
