import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type CardProps = {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  as?: 'div' | 'article' | 'li';
};

export function Card({ children, className, interactive = false, as = 'div' }: CardProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        'rounded-lg border border-hairline bg-navy-surface shadow-card shadow-inset',
        interactive &&
          'transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-hairline-strong hover:bg-navy-raised hover:shadow-gold-glow',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
