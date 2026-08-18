import { experience } from '../data/resumeData';
import { RevealItem, RevealList } from './ui/Reveal';
import { Section } from './ui/Section';

export function Experience() {
  return (
    <Section id="experience" eyebrow="Income History" title="Work Experience">
      <RevealList className="border-t border-hairline">
        {experience.map((role) => (
          <RevealItem key={`${role.company}-${role.period}`}>
            <article className="grid gap-4 border-b border-hairline py-6 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-8">
              <div className="num text-xs text-gold/80 sm:pt-1">{role.period}</div>

              <div>
                <h3 className="font-display text-lg font-semibold text-cream">{role.role}</h3>
                <p className="mt-1 text-sm text-muted">
                  {role.company}
                  <span className="px-1.5 text-muted/40">·</span>
                  {role.location}
                </p>

                <ul className="mt-4 space-y-2.5">
                  {role.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 text-[0.9rem] leading-relaxed text-cream/80"
                    >
                      <span
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/70"
                        aria-hidden="true"
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </RevealItem>
        ))}
      </RevealList>
    </Section>
  );
}
