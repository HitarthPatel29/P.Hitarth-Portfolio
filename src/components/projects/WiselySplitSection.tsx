import type { LucideIcon } from 'lucide-react';
import {
  BrainCircuit,
  Database,
  ExternalLink,
  Gauge,
  Github,
  Layers,
  Radio,
  ShieldCheck,
  Smartphone,
  Wallet,
} from 'lucide-react';
import { wiselySplit } from '../../data/resumeData';
import { Badge } from '../ui/Badge';
import { Reveal, RevealItem, RevealList } from '../ui/Reveal';
import { DemoShell } from './demo/DemoShell';

const icons: Record<string, LucideIcon> = {
  Layers,
  BrainCircuit,
  Database,
  ShieldCheck,
  Smartphone,
  Gauge,
  Radio,
};

export function WiselySplitSection() {
  return (
    <section id="projects" className="scroll-mt-24 border-y border-hairline bg-navy-surface/25 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-statement px-5 sm:px-8">
        <Reveal>
          <header className="mb-9">
            <div className="flex items-center gap-4">
              <span className="eyebrow inline-flex items-center gap-1.5 whitespace-nowrap">
                <Wallet size={11} aria-hidden="true" />
                Wallet
                <span className="text-gold/35" aria-hidden="true">
                  /
                </span>
                Featured Project
              </span>
              <span className="rule" aria-hidden="true" />
              <span className="num whitespace-nowrap text-[0.7rem] text-muted">
                {wiselySplit.period}
              </span>
            </div>

            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-cream sm:text-[2.5rem]">
              {wiselySplit.title}
            </h2>
            <p className="mt-1.5 font-display text-base italic text-gold/90 sm:text-lg">
              {wiselySplit.tagline}
            </p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {wiselySplit.tech.map((item) => (
                <li key={item}>
                  <Badge>{item}</Badge>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <a
                href={wiselySplit.liveUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gold transition-colors hover:text-gold-muted"
              >
                wiselysplit.xyz
                <ExternalLink size={14} aria-hidden="true" />
              </a>
              <a
                href={wiselySplit.repoUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-cream"
              >
                <Github size={14} aria-hidden="true" />
                GitHub
              </a>
            </div>
          </header>
        </Reveal>

        <RevealList className="mb-10 divide-y divide-[var(--hairline)] border-t border-hairline">
          {wiselySplit.highlights.map((item) => {
            const Icon = icons[item.icon] ?? Layers;
            return (
              <RevealItem key={item.text}>
                <div className="flex items-start gap-4 py-4">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-hairline bg-navy-deep/60">
                    <Icon size={15} className="text-gold/80" aria-hidden="true" />
                  </span>
                  <p className="text-[0.9rem] leading-relaxed text-cream/80">{item.text}</p>
                </div>
              </RevealItem>
            );
          })}
        </RevealList>

        <Reveal delay={0.12} className="mx-auto w-full max-w-4xl">
          <DemoShell />
          <p className="mt-3 text-center text-[0.7rem] leading-relaxed text-muted/80">
            Interactive demo — entries stay in this session. Category suggestions call WiselySplit&apos;s
            predict API when reachable, and fall back to keywords otherwise.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
