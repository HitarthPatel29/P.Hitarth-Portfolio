import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, Download, Headset, LayoutDashboard } from 'lucide-react';
import { profile } from '../data/resumeData';
import { LedgerGrid } from './ui/LedgerGrid';

export function Hero() {
  const reduceMotion = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduceMotion ? undefined : { opacity: 0, y: 16 },
    animate: reduceMotion ? undefined : { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="top" className="relative overflow-hidden border-b border-hairline">
      <LedgerGrid />

      <div className="relative mx-auto w-full max-w-statement px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
        <motion.p {...rise(0)} className="eyebrow flex flex-wrap items-center gap-2">
          <LayoutDashboard size={12} aria-hidden="true" />
          Dashboard
          <span className="text-gold/35" aria-hidden="true">
            /
          </span>
          {profile.eyebrow}
        </motion.p>

        <motion.h1
          {...rise(0.08)}
          className="mt-4 font-display text-[2.75rem] font-semibold leading-[1.05] tracking-tight text-cream sm:text-6xl lg:text-7xl"
        >
          {profile.name}
        </motion.h1>

        <motion.p
          {...rise(0.16)}
          className="mt-4 font-display text-lg italic text-gold/90 sm:text-2xl"
        >
          {profile.subhead}
        </motion.p>

        <motion.div {...rise(0.22)} className="mt-7 max-w-2xl">
          <span className="rule block" aria-hidden="true" />
          <p className="mt-5 text-[0.95rem] leading-relaxed text-muted sm:text-base">
            {profile.positioning}
          </p>
        </motion.div>

        <motion.div {...rise(0.3)} className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-md border border-gold bg-gold/10 px-5 py-3 text-sm font-medium text-gold transition-colors hover:bg-gold/20"
          >
            Open Wallet Demo
            <ArrowDown size={15} aria-hidden="true" />
          </a>
          <a
            href={profile.resumeFile}
            download
            title="Download Resume"
            aria-label="Export Account Summary — download resume"
            className="inline-flex items-center gap-2 rounded-md border border-hairline px-5 py-3 text-sm font-medium text-cream transition-colors hover:border-hairline-strong hover:bg-navy-surface"
          >
            <Download size={15} aria-hidden="true" />
            Export Account Summary
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium text-muted transition-colors hover:text-cream"
          >
            <Headset size={15} aria-hidden="true" />
            Support
          </a>
        </motion.div>
      </div>
    </section>
  );
}
