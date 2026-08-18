import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Reveal } from './Reveal';

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, eyebrow, title, children, className }: SectionProps) {
  return (
    <section id={id} className={cn('scroll-mt-24 py-16 sm:py-20', className)}>
      <div className="mx-auto w-full max-w-statement px-5 sm:px-8">
        <Reveal>
          <SectionHeader eyebrow={eyebrow} title={title} />
        </Reveal>
        {children}
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="mb-8 sm:mb-10">
      <div className="flex items-center gap-4">
        <span className="eyebrow whitespace-nowrap">{eyebrow}</span>
        <span className="rule" aria-hidden="true" />
      </div>
      <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-cream sm:text-[2rem]">
        {title}
      </h2>
    </header>
  );
}
