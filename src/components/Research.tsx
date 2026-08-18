import { Quote, ScanFace } from 'lucide-react';
import { research } from '../data/resumeData';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { Reveal } from './ui/Reveal';
import { Section } from './ui/Section';

export function Research() {
  return (
    <Section id="research" eyebrow="Insights" title="Applied Research">
      <Reveal>
        <Card className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-hairline bg-navy-deep/60">
                <ScanFace size={16} className="text-gold/80" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold leading-snug text-cream">
                  {research.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{research.org}</p>
              </div>
            </div>
            <span className="num text-xs text-gold/80">{research.period}</span>
          </div>

          <ul className="mt-5 flex flex-wrap gap-2">
            {research.tech.map((item) => (
              <li key={item}>
                <Badge>{item}</Badge>
              </li>
            ))}
          </ul>

          <ul className="mt-6 space-y-3 border-t border-hairline pt-5">
            {research.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3 text-[0.9rem] leading-relaxed text-cream/80">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/70" aria-hidden="true" />
                {bullet}
              </li>
            ))}
          </ul>

          <figure className="mt-7 rounded-md border border-gold/45 bg-gold/[0.05] p-5">
            <Quote size={16} className="mb-3 text-gold/70" aria-hidden="true" />
            <blockquote className="font-display text-[0.98rem] italic leading-relaxed text-cream/90">
              {research.finding}
            </blockquote>
            <figcaption className="mt-3 text-[0.68rem] uppercase tracking-eyebrow text-muted">
              Key finding
            </figcaption>
          </figure>
        </Card>
      </Reveal>
    </Section>
  );
}
