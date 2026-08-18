import { skills, stats } from '../data/resumeData';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { CountUpStat } from './ui/CountUpStat';
import { Reveal, RevealItem, RevealList } from './ui/Reveal';
import { Section } from './ui/Section';
import { cn } from '../lib/cn';

export function Skills() {
  return (
    <Section id="skills" eyebrow="Portfolio" title="Skills & Tech Stack">
      <Card className="overflow-hidden">
        <div className="hidden grid-cols-[minmax(0,1fr)] items-center border-b border-hairline bg-navy-deep/40 px-6 py-3 sm:grid sm:grid-cols-[13rem_minmax(0,1fr)]">
          <span className="eyebrow">Category</span>
          <span className="eyebrow">Proficiencies</span>
        </div>

        <RevealList>
          {skills.map((row, index) => (
            <RevealItem key={row.category}>
              <div
                className={cn(
                  'grid gap-3 border-b border-hairline px-5 py-4 last:border-b-0 sm:grid-cols-[13rem_minmax(0,1fr)] sm:items-baseline sm:gap-6 sm:px-6 sm:py-4',
                  index % 2 === 1 && 'bg-navy-deep/25',
                )}
              >
                <h3 className="font-display text-sm font-semibold text-gold/90 sm:text-[0.95rem]">
                  {row.category}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {row.items.map((item) => (
                    <li key={item}>
                      <Badge>{item}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealList>
      </Card>

      <Reveal delay={0.1}>
        <div className="mt-8 grid grid-cols-2 divide-x divide-y divide-[var(--hairline)] rounded-lg border border-hairline bg-navy-surface/60 sm:grid-cols-4 sm:divide-y-0">
          {stats.map((stat) => (
            <CountUpStat
              key={stat.label}
              value={stat.value}
              label={stat.label}
              prefix={stat.prefix}
              suffix={stat.suffix}
              decimals={stat.decimals}
            />
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
