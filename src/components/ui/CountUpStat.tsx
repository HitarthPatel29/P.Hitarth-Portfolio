import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

type CountUpStatProps = {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  durationMs?: number;
};

export function CountUpStat({
  value,
  label,
  prefix = '',
  suffix = '',
  decimals = 0,
  durationMs = 1200,
}: CountUpStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      // ease-out cubic keeps the count-up understated rather than bouncy
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, durationMs, reduceMotion]);

  return (
    <div ref={ref} className="px-4 py-5 text-center sm:text-left">
      <div className="num text-2xl font-medium text-gold sm:text-[1.75rem]">
        {prefix}
        {display.toFixed(decimals)}
        {suffix}
      </div>
      <div className="mt-1.5 text-xs uppercase tracking-eyebrow text-muted">{label}</div>
    </div>
  );
}
