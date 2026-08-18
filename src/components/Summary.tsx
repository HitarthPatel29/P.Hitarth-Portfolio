import { summary } from '../data/resumeData';
import { Card } from './ui/Card';
import { Reveal } from './ui/Reveal';
import { Section } from './ui/Section';

export function Summary() {
  return (
    <Section id="about" eyebrow="Profile" title="Professional Summary">
      <Reveal>
        <Card className="border-t-2 border-t-gold/50 p-6 sm:p-8">
          <p className="text-[0.95rem] leading-[1.85] text-cream/85 sm:text-[1.02rem]">{summary}</p>
        </Card>
      </Reveal>
    </Section>
  );
}
