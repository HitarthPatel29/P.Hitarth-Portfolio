import { Award, GraduationCap } from 'lucide-react';
import { certifications, education } from '../data/resumeData';
import { Card } from './ui/Card';
import { Reveal } from './ui/Reveal';
import { Section } from './ui/Section';

export function Education() {
  return (
    <Section id="education" eyebrow="Expense History" title="Education & Certifications">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <Reveal>
          <Card className="h-full p-6" interactive>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-hairline bg-navy-deep/60">
                <GraduationCap size={16} className="text-gold/80" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-base font-semibold leading-snug text-cream">
                  {education.degree}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {education.school}
                  <span className="px-1.5 text-muted/40">·</span>
                  {education.location}
                </p>
                <p className="num mt-1 text-xs text-gold/80">{education.period}</p>
              </div>
            </div>

            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-hairline pt-4">
              {education.honors.map((honor) => (
                <li key={honor} className="num text-sm text-cream/85">
                  {honor}
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>

        <Reveal delay={0.1}>
          <Card className="h-full p-6" interactive>
            <span className="eyebrow">Certifications</span>
            <ul className="mt-4 divide-y divide-[var(--hairline)]">
              {certifications.map((cert) => (
                <li key={cert.name} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
                  <Award size={15} className="mt-0.5 shrink-0 text-gold/80" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.88rem] leading-snug text-cream">{cert.name}</span>
                    <span className="num mt-0.5 block text-[0.7rem] text-muted">{cert.date}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
