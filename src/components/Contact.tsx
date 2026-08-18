import { Github, Globe, Headset, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { profile } from '../data/resumeData';
import { Reveal } from './ui/Reveal';

const links = [
  { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
  { icon: Phone, label: profile.phone, href: `tel:${profile.phoneHref}` },
  { icon: MapPin, label: profile.location, href: null },
  { icon: Linkedin, label: 'LinkedIn', href: profile.linkedin },
  { icon: Github, label: 'GitHub', href: profile.github },
  { icon: Globe, label: 'wiselysplit.xyz', href: profile.site },
];

export function Contact() {
  return (
    <footer id="contact" className="scroll-mt-24 border-t border-hairline bg-navy-surface/30">
      <div className="mx-auto w-full max-w-statement px-5 py-16 sm:px-8 sm:py-20">
        <Reveal>
          <div className="h-0.5 w-full bg-gold/50" aria-hidden="true" />

          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="eyebrow inline-flex items-center gap-1.5">
                <Headset size={12} aria-hidden="true" />
                Support
              </span>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-cream sm:text-[2rem]">
                Let’s build something dependable.
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                Open to backend and full-stack roles. The fastest way to reach me is email — no
                ticket number required.
              </p>
            </div>

            <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {links.map((link) => {
                const Icon = link.icon;
                const content = (
                  <>
                    <Icon size={14} className="shrink-0 text-gold/75" aria-hidden="true" />
                    <span className="truncate">{link.label}</span>
                  </>
                );
                return (
                  <li key={link.label}>
                    {link.href ? (
                      <a
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                        className="inline-flex items-center gap-2.5 text-sm text-cream/85 transition-colors hover:text-gold"
                      >
                        {content}
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2.5 text-sm text-muted">
                        {content}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-12 border-t border-hairline pt-6">
            <span className="eyebrow">Statement Closing</span>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="flex items-center gap-2.5 text-[0.7rem] uppercase tracking-eyebrow text-muted">
                <span className="flex h-6 w-6 items-center justify-center rounded border border-hairline-strong font-display text-[0.6rem] font-bold text-gold">
                  HP
                </span>
                {profile.name}
              </span>
              <span className="num text-[0.7rem] text-muted/70">
                © {new Date().getFullYear()} {profile.name}. All rights reserved.
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
