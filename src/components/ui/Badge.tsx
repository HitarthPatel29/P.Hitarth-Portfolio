import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type BadgeProps = {
  children: ReactNode;
  className?: string;
  tone?: 'gold' | 'neutral' | 'success' | 'expense' | 'transfer';
};

const tones: Record<NonNullable<BadgeProps['tone']>, string> = {
  gold: 'border-hairline-strong text-gold/90',
  neutral: 'border-white/10 text-muted',
  success: 'border-success/40 text-success',
  expense: 'border-expense/40 text-expense',
  transfer: 'border-transfer/40 text-transfer',
};

export function Badge({ children, className, tone = 'gold' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border bg-navy-deep/40 px-2.5 py-1 text-[0.7rem] font-medium leading-none',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
