# Hitarth Patel — Portfolio

Single-page portfolio for Hitarth Patel, a backend-focused software developer (Java/Spring Boot,
applied ML, fintech). The centerpiece is an interactive in-memory demo inspired by his flagship
project, **WiselySplit**.

The visual language is "Fintech Ledger": navy and gold, tabular numerals, hairline rules, and
statement-style rows — closer to a private-banking statement than a typical dev portfolio.

## Stack

- Vite 5 + React 18 + TypeScript (strict)
- Tailwind CSS 3.4 with palette tokens in `src/styles/globals.css`
- Framer Motion for scroll reveals, count-ups, and ledger row animation
- embla-carousel-react for the LinkedIn posts row
- lucide-react for icons
- Fonts: Fraunces (display), Inter (body), IBM Plex Mono (all numerals)

No router, no backend, no persistence.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

Other scripts:

```bash
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build
npm run typecheck  # tsc --noEmit
```

## About the WiselySplit demo

The demo under `src/components/projects/demo/` is an original "inspired by" widget, not a clone of
the production app. Everything is deliberately self-contained:

- `useLedgerState.ts` — reducer, seed wallets/entries, balance math
- `mockCategorizer.ts` — keyword rules standing in for the real Naive Bayes/SMILE classifier
- `AddEntryForm.tsx` — expense/income/transfer entry with the "AI categorize" flourish
- `WalletsView.tsx` — wallet cards, wallet filtering, and the running ledger

State lives in memory and resets on refresh. There are no API calls, no auth, and no Stripe
integration — the confidence percentages are cosmetic.

## Content

All copy lives in `src/data/resumeData.ts` as typed objects, sourced from the resume. Update that
one file to change anything on the page.

Two values need confirming before publishing: `profile.linkedin` and `profile.github` are best
guesses, since the resume lists those labels without URLs.

The LinkedIn carousel reads `linkedinPosts` — one entry per post, holding the `urn:li:...` id from
LinkedIn's own "Embed this post" snippet. Adding or reordering entries there is all that's needed;
the carousel shows 3 cards on desktop, 2 on tablet, 1 on mobile and advances one card at a time.

## Layout

```
src/
  components/
    Nav.tsx  Hero.tsx  Summary.tsx  Skills.tsx
    Research.tsx  Experience.tsx  Education.tsx  LinkedInPosts.tsx  Contact.tsx
    projects/
      WiselySplitSection.tsx
      demo/          # DemoShell, AddEntryForm, WalletsView, state, categorizer
    ui/              # Card, Badge, SegmentedControl, CountUpStat, Section, Reveal, ...
  data/resumeData.ts
  lib/               # cn, money/date formatting
  styles/globals.css
```

## Accessibility & motion

- Semantic landmarks, labelled form controls, `aria-live` on the categorizer status and toast
- Keyboard-navigable nav and demo form with visible gold focus rings
- `prefers-reduced-motion` disables reveals, count-ups, and the mobile menu slide
