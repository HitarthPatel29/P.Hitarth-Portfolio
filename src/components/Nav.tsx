import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Bell,
  Briefcase,
  Download,
  Headset,
  Menu,
  Search,
  TrendingDown,
  TrendingUp,
  User,
  Wallet,
  X,
} from 'lucide-react';
import { navLinks, profile } from '../data/resumeData';
import { cn } from '../lib/cn';

const navIcons: Record<string, LucideIcon> = {
  User,
  Briefcase,
  Wallet,
  Search,
  TrendingUp,
  TrendingDown,
  Bell,
  Headset,
};

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-navy-raised focus:px-4 focus:py-2 focus:text-sm focus:text-cream"
      >
        Skip to content
      </a>

      <header
        className={cn(
          'sticky top-0 z-50 border-b transition-colors duration-300',
          scrolled
            ? 'border-hairline bg-navy-surface/95 backdrop-blur-md'
            : 'border-transparent bg-navy-surface/80 backdrop-blur-sm',
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 w-full max-w-statement items-center justify-between gap-4 px-5 sm:px-8"
        >
          <a
            href="#top"
            className="flex items-center gap-3"
            aria-label={`${profile.name} — back to top`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded border border-hairline-strong bg-navy-deep font-display text-sm font-bold text-gold">
              HP
            </span>
            <span className="hidden font-display text-sm font-semibold tracking-wide text-cream sm:block">
              Hitarth Patel
            </span>
          </a>

          <ul className="hidden items-center gap-0.5 xl:flex">
            {navLinks.map((link) => {
              const Icon = navIcons[link.icon];
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    title={link.hint}
                    className="inline-flex items-center gap-1.5 whitespace-nowrap rounded px-2.5 py-2 text-sm text-muted transition-colors hover:text-cream"
                  >
                    {Icon ? <Icon size={14} className="shrink-0 text-gold/70" aria-hidden="true" /> : null}
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={profile.resumeFile}
              download
              title="Download Resume"
              aria-label="Export Account Summary — download resume"
              className="hidden items-center gap-2 whitespace-nowrap rounded-md border border-gold/60 px-3.5 py-2 text-sm font-medium text-gold transition-colors hover:bg-gold/10 sm:inline-flex"
            >
              <Download size={15} aria-hidden="true" />
              Export Summary
            </a>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-hairline text-cream transition-colors hover:border-hairline-strong xl:hidden"
            >
              {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[55] bg-navy-deep/70 backdrop-blur-sm xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              id="mobile-menu"
              className="fixed right-0 top-0 z-[56] h-full w-[min(20rem,82vw)] border-l border-gold/40 bg-navy-surface p-6 xl:hidden"
              initial={reduceMotion ? { opacity: 0 } : { x: '100%' }}
              animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: '100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="eyebrow">Menu</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-hairline text-cream"
                >
                  <X size={17} aria-hidden="true" />
                </button>
              </div>

              <ul className="divide-y divide-[var(--hairline)]">
                {navLinks.map((link) => {
                  const Icon = navIcons[link.icon];
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 py-3.5 text-sm text-cream transition-colors hover:text-gold"
                      >
                        {Icon ? (
                          <Icon size={16} className="shrink-0 text-gold/75" aria-hidden="true" />
                        ) : null}
                        <span>{link.label}</span>
                        <span className="ml-auto text-[0.7rem] text-muted/70">{link.hint}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>

              <a
                href={profile.resumeFile}
                download
                onClick={() => setOpen(false)}
                title="Download Resume"
                aria-label="Export Account Summary — download resume"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md border border-gold/60 px-4 py-2.5 text-sm font-medium text-gold"
              >
                <Download size={15} aria-hidden="true" />
                Export Account Summary
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
