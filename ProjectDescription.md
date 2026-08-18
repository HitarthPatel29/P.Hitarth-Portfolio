# Build Prompt: Hitarth Patel — Portfolio Website
### Theme: "Fintech Ledger" (Navy & Gold) — WiselySplit Live Demo Edition
> Paste everything below into Cursor with Opus. It's written as a direct instruction set — follow it section by section, in the suggested build order at the bottom.

---

## 1. Role & Brief

Build a single-page, scroll-based portfolio website for **Hitarth Patel**, a backend-focused software developer (Java/Spring Boot, applied ML, fintech). The site's job is to get a recruiter or hiring engineer to *feel* competence in the first 5 seconds and *prove* it within 30 — the centerpiece is a live, interactive mini-demo of his flagship project, **WiselySplit**, embedded directly in the page.

The visual language is **"Fintech Ledger"**: it should feel like a premium private-banking statement or a high-trust fintech dashboard — navy, gold, tabular numbers, hairline rules, ledger rows — not a generic dark-mode dev portfolio.

---

## 2. Tech Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS** (v3.4+) — all styling via utility classes + a small set of CSS custom properties for the palette
- **Framer Motion** — scroll reveals, count-up numbers, list animations
- **lucide-react** — icon set
- State: plain **React `useState`/`useReducer`** for the demo. No backend, no API calls, no persistence — everything lives in memory and resets on refresh. Do not wire up real auth, real Stripe, or a real database. This is a *flavor demo*, not a clone of the real app.
- No router needed — single page, anchor-link navigation (`#about`, `#projects`, etc.)
- Fonts via Google Fonts (see Section 4)

---

## 3. Site Structure (in scroll order)

1. Sticky nav bar
2. Hero
3. Professional Summary
4. Technical Skills ("Statement of Skills")
5. **Featured Project — WiselySplit (with live demo)** ← centerpiece, most build time here
6. Applied Research — Facial Recognition project
7. Work Experience
8. Education & Certifications
9. Contact / footer ("statement closing")

---

## 4. Design System

### 4.1 Color Palette

| Token | Hex | Use |
|---|---|---|
| `navy-deep` | `#0B1E3D` | Page background |
| `navy-surface` | `#13294B` | Cards, panels, nav bg |
| `navy-surface-raised` | `#1C355E` | Hover states, elevated cards |
| `gold` | `#D4AF37` | Primary accent — borders, headings, CTAs, dividers |
| `gold-muted` | `#C9A227` | Secondary gold, less saturated for large areas |
| `cream` | `#F5F1E6` | Primary text on navy |
| `text-muted` | `#AFB9CC` | Secondary text on navy |
| `success-green` | `#3E8E6D` | Income / positive amounts |
| `expense-rose` | `#C0605C` | Expenses / negative amounts |
| `transfer-slate` | `#7C93B3` | Transfers (neutral, not +/-) |
| `hairline` | `rgba(212,175,55,0.18)` | Ledger-rule divider lines |

Use gold as an **accent**, not a base — aim for gold covering roughly 10–15% of visual weight (borders, numerals, icons, rules), never large filled backgrounds. Restraint = "trust," not flash.

### 4.2 Typography

- **Display / headings:** `Fraunces` (serif, banking/editorial gravitas) — use for name, section titles, big statements
- **Body / UI:** `Inter` — clean, neutral, highly legible
- **Numbers / currency / stats:** `IBM Plex Mono` with `font-variant-numeric: tabular-nums` — every dollar figure, percentage, and stat on the site uses this so numbers align like a real ledger

### 4.3 Visual Motifs

- Thin gold **hairline rules** separating sections and list rows (like a bank statement)
- Cards: `rounded-lg` (8–10px), 1px gold-hairline border, soft navy shadow, subtle lift + gold-glow on hover
- Section headers styled like statement headers: small-caps eyebrow label + a rule line
- No stock photography. No generic "business people" imagery. Use an initials monogram (`HP`) as the nav mark, icon-based visuals, and abstract geometric/gradient accents (e.g. a faint SVG grid of ledger lines behind the hero)

---

## 5. Section-by-Section Content & Behavior

> Use the real content below — do not invent metrics, do not use Lorem Ipsum.

### 5.1 Nav bar
Sticky, `navy-surface` bg, `HP` gold monogram mark on the left, anchor links (About · Skills · Projects · Research · Experience · Education · Contact), a gold-outlined "Resume" button on the right. Collapses to a hamburger menu on mobile that slides in a navy panel with gold border.

### 5.2 Hero
- Eyebrow label: `SOFTWARE DEVELOPER`
- Headline (Fraunces, large): **Hitarth Patel**
- Subhead: *Backend Systems & Applied Machine Learning*
- One-line positioning pulled from the summary: "18+ months building scalable backend systems — from a self-training fintech ML pipeline to production-hardened microservices."
- CTA buttons: **View WiselySplit Demo** (scrolls to §5.5) / **Download Resume** / **Contact**
- Background: faint SVG ledger-line grid pattern in `hairline` color over `navy-deep`, very subtle

### 5.3 Professional Summary
Card with the full summary text, ledger-rule top border:
> "Software Developer with 18+ months of hands-on experience building scalable backend systems across deployed applications, freelance product work, applied research, and a professional internship. Expert proficiency in Java 17, Spring Boot 3.5 and Hibernate/JPA with microservice as well as monolithic architecture. Skilled in writing clean, maintainable, well-documented code, with hands-on exposure to applied machine learning (Naive Bayes classification, self-training feedback loops). Comfortable in Agile/Scrum environments with remote, collaborative teams. Microsoft Azure Certified. Honors graduate with an 86.7% GPA."

### 5.4 Technical Skills — "Statement of Skills"
Render as alternating-shade ledger rows, each row = one category:

| Category | Items |
|---|---|
| Core & Languages | Java, Python, JavaScript |
| Java Ecosystem | Spring Boot, Spring Data JPA, Hibernate ORM, Spring MVC, REST API Design, Resilience4j, RestTemplate, WebClient, FeignClient, Apache Kafka, JWT, BCrypt, Spring Security, Spring Validation, Spring JDBC |
| Architecture | Monolithic, Microservice |
| Frontend | React.js, Tailwind CSS |
| ML / Data | SMILE (Naive Bayes), scikit-learn, scikit-image, Keras/TensorFlow, FaceNet |
| Databases & DevOps | MySQL, MongoDB, Microsoft Azure, Git, CI/CD (Jenkins), Docker, Railway |
| Methodologies | Agile/Scrum, TDD, BDD, Code Review Practices |
| Testing | JUnit, Mockito, Postman, Selenium |
| Soft Skills | Problem-Solving, Communication, Cross-Functional Collaboration, Stakeholder Management, Adaptability, Time Management |

Items render as small gold-outlined pills within each row.

Add a small "By the Numbers" stat strip below, count-up-on-scroll (Framer Motion `useInView`):
`18+ months experience` · `70+ REST endpoints shipped` · `100+ bugs resolved` · `86.7% GPA`

---

### 5.5 ⭐ Featured Project: WiselySplit (centerpiece)

**Header:** Project title, tagline *"Full-Stack Financial Web Application"*, tech pills (Java 17 · Spring Boot 3.5 · MySQL · React.js · Stripe Connect · Naïve Bayes · SMILE), link to `wiselysplit.xyz` and GitHub.

**Layout:** two-column on desktop (stacks on mobile) — left/top = narrative, right/bottom = live demo widget.

**Narrative column** — render as ledger line-items (icon + short version of each bullet):
- Architected and shipped a full-stack fintech platform — 70+ RESTful endpoints (Spring Boot 3.5, Spring MVC), JWT + BCrypt auth with RBAC via Spring Security, Stripe Connect for P2P settlements, Google OAuth SSO
- Designed and deployed a Naive Bayes/SMILE classification pipeline to auto-categorize transactions in real time, with a self-training feedback loop that retrains on user corrections
- Adopted Hibernate/JPA for entity mapping and query optimization, migrating select modules from raw JDBC to ORM-managed persistence
- Maintained the app 10+ months in production — resolved 100+ bugs, hardened 15+ financial edge cases (negative balances, failed payment retries, partial settlements, mid-group split recalculation)
- Built Apple Pay + Shortcuts integrations for one-tap automated expense logging
- Reduced per-session API round-trips by ~50–60% via prefetching and eliminating redundant client calls
- Introduced Apache Kafka for async, event-driven messaging between core services

**Demo widget** — labeled clearly: *"Try it — Interactive Demo"* with a small badge: *"Demo only. Nothing is saved."*

Style the widget as a bordered "app frame" (like a phone/app screenshot frame) in `navy-surface`, gold hairline border, rounded corners, with two views:

#### A) Add Entry form
- **Type toggle** (segmented control, 3 options): `Expense` / `Income` / `Transfer` — selecting one recolors the form accent (rose / green / slate) and swaps the category list
- **Amount** field — large `IBM Plex Mono` input, `$` prefix
- **Category** dropdown, contextual to type:
  - Expense: Food & Dining, Transportation, Rent & Housing, Utilities, Shopping, Entertainment, Healthcare, Other
  - Income: Salary, Freelance, Gift, Interest, Other
  - Transfer: Internal Transfer
- **Wallet** select: Checking Account, Savings, Cash Wallet (Transfer adds a second "To wallet" field)
- **Note** text field (e.g. "Starbucks coffee")
- **Date** — defaults to today

**"AI Categorize" flourish** (this is the storytelling payoff — it's what makes the demo *about* WiselySplit's actual differentiator): as the user types in Note, after a short debounce show a small pulsing "🤖 analyzing…" state (~400ms), then a suggestion badge: *"Suggested: Food & Dining · 92% confidence"*. Implement with simple keyword matching (not real ML) — e.g. "coffee/restaurant/grocery" → Food & Dining, "uber/gas/transit" → Transportation, "rent/mortgage" → Rent & Housing, "salary/payroll" → Income. If the user picks a different category than suggested, show a brief toast: *"Got it — noted for next time"* (a nod to the real self-training feedback loop).

On submit: animate the new row sliding into the ledger list below, animate the wallet balance count-up/down, clear the form.

#### B) Wallets view
- 2–3 wallet cards at the top (Checking, Savings, Cash Wallet), each showing a gold `IBM Plex Mono` balance figure
- Below: a running ledger list of entries — icon by category, description, category tag, date, amount (color-coded: green `+`, rose `−`, slate `↔` for transfers)
- Selecting a wallet card filters the list to that wallet; default view = "All Wallets"
- Pre-seed with realistic example data so it's never empty on load:

  | Entry | Type | Wallet | Amount | Category |
  |---|---|---|---|---|
  | Freelance Payment | Income | Checking | +$450.00 | Freelance |
  | Grocery Store | Expense | Checking | −$54.20 | Food & Dining |
  | Rent | Expense | Checking | −$1,200.00 | Rent & Housing |
  | Transfer to Savings | Transfer | Checking → Savings | $500.00 | Internal Transfer |
  | Coffee Shop | Expense | Cash Wallet | −$6.75 | Food & Dining |

  (Starting balances: Checking $3,240.55 · Savings $8,120.00 · Cash Wallet $85.00 — adjust freely for realism.)

- New entries the visitor adds appear at the top of the list with a slide/fade-in

Keep this demo self-contained in its own hook (state + seed data + mock categorizer), so it's easy to reason about and doesn't leak into the rest of the page.

---

### 5.6 Applied Research — Facial Recognition
Card/timeline entry: *"Facial Recognition: Impact of Photo Enhancement Algorithms" — Mohawk College (Hybrid), Sept–Dec 2024*. Tech: Java 17 · Keras/TensorFlow · OpenCV · FaceNet · Dlib.
- Led a 4-person team on a real archival problem: identifying individuals in low-res, dithered war memorial photographs
- Integrated and tested image-enhancement + face-recognition model combinations, including fine-tuning FaceNet on a labeled archival photo library
- Owned the Git repo end-to-end; ran the team day-to-day, led weekly meetings with the supervising professor

Pull out the key finding as a gold-bordered **pull-quote** block:
> Enhancement algorithms improved recognition on photos with degraded-but-present facial data, but worsened accuracy on photos with little-to-no facial data — producing evidence-backed guidance on when pre-processing should and shouldn't be used in archival digitization workflows.

### 5.7 Work Experience
Reverse-chronological "statement lines," each with company, role, dates, 2–3 condensed bullets:

**Software System Analyst (Freelance) — Contribiia, Toronto, ON (Remote)** · Jan–Apr 2025
- Bridged 2 business stakeholders and 2 UI/UX designers for a fintech ROSCA startup lacking structured requirements
- Translated product ideas into development-ready specs (features, edge cases, validation rules); led design reviews
- Delivered a complete UI/UX spec package, giving the startup a clear concept-to-prototype path

**Web Developer Intern — Glacier Inc., Gujarat, India** · Jun–Dec 2022
- 6-month React.js internship building responsive, cross-device web pages
- Mentored on component structuring, performance, and coding standards
- Owned WordPress theme/plugin customization; resolved layout/compatibility issues
- Set up Selenium regression testing via Katalon Recorder; wrote/maintained unit tests

**Customer Service Associate & Baker — Tim Hortons, Hamilton, ON** · Jan 2023–Present
- Collaborates within a 10+ person team maintaining service quality during peak hours
- Led and trained 7+ new employees in the kitchen

### 5.8 Education & Certifications
- **Advanced Diploma – Computer System Technology**, Mohawk College, Hamilton, ON — Jan 2023–Dec 2025 — Honors Graduate, GPA 86.7%
- Badges/pills: **Microsoft Azure Fundamentals (AZ-900)** — Nov 2024 · **Microsoft Azure AI Fundamentals (AI-900)** — Mar 2023

### 5.9 Contact / Footer
Styled like the closing of a bank statement: gold rule, then contact links — `p2004hitarth@gmail.com` · `+1 (365) 883-2904` · Hamilton, ON · LinkedIn · GitHub · wiselysplit.xyz. Small copyright line beneath.

---

## 6. Animation Guidelines

- Framer Motion scroll-reveal: fade + slide-up (~16px), staggered children within a section
- Count-up animation for all stat numbers, triggered on scroll-into-view (once)
- Card hover: subtle lift (`translateY(-2px)`) + soft gold-glow shadow
- Demo widget: row slide-in on new entry, balance count animates to new value, "analyzing…" pulse before AI suggestion appears
- Respect `prefers-reduced-motion` — disable non-essential motion when set
- Keep everything understated — this is a banking aesthetic; nothing should feel gimmicky or bouncy

## 7. Responsive Requirements

- Mobile-first. Test at 375px, 768px, 1280px, 1440px+
- Demo widget stacks vertically on mobile (form above, wallets/list below)
- Nav collapses to a hamburger with a slide-in gold-bordered navy panel
- Skills table collapses to stacked cards on small screens (not a horizontally-scrolling table)

## 8. Accessibility

- Maintain AA contrast — gold text should be used sparingly and checked against navy backgrounds; prefer gold for large text/icons/borders over small body copy
- Full keyboard navigation for nav and the demo form (tab order, focus states with visible gold outline)
- Semantic HTML (`nav`, `section`, `main`, `header`, `footer`), `aria-label`s on icon-only buttons
- Form inputs properly labeled (visible or `aria-label`, not placeholder-only)

## 9. Suggested File Structure

```
src/
  components/
    Nav.tsx
    Hero.tsx
    Summary.tsx
    Skills.tsx
    projects/
      WiselySplitSection.tsx
      demo/
        DemoShell.tsx          # tab switcher: Add Entry / Wallets
        AddEntryForm.tsx
        WalletsView.tsx
        useLedgerState.ts      # state, seed data, mock categorizer
        mockCategorizer.ts
    Research.tsx
    Experience.tsx
    Education.tsx
    Contact.tsx
    ui/
      Card.tsx
      Badge.tsx
      SegmentedControl.tsx
      CountUpStat.tsx
  data/
    resumeData.ts              # all copy from Section 5 as typed objects
  styles/
    globals.css                # Tailwind base + CSS vars for palette/fonts
  App.tsx
  main.tsx
```

## 10. Suggested Build Order

1. Scaffold Vite + React + TS + Tailwind; set up `globals.css` with the color/font tokens from Section 4
2. Build shared `ui/` primitives (Card, Badge, SegmentedControl, CountUpStat)
3. Build static sections top to bottom: Nav → Hero → Summary → Skills → (placeholder for Projects) → Research → Experience → Education → Contact
4. Build the WiselySplit demo in isolation: `useLedgerState` hook + seed data first, then `AddEntryForm`, then `WalletsView`, then wire them together in `DemoShell`
5. Build `mockCategorizer.ts` and wire the "AI Categorize" flourish into the form
6. Add Framer Motion scroll-reveals and count-up stats across the page
7. Responsive pass at all four breakpoints
8. Accessibility pass (keyboard nav, contrast, labels, reduced-motion)
9. Final polish pass on hover states, spacing rhythm, and hairline consistency

## 11. Guardrails

- Don't invent metrics, claims, or experience not present in Section 5's content
- Don't call any real API, don't persist demo data anywhere, don't wire up real Stripe/auth
- Don't use stock photography or generic imagery — icon-based and typographic only
- Don't let gold dominate — accent only
- Don't use Lorem Ipsum anywhere — use the real content provided
- Don't reproduce the actual WiselySplit production UI exactly — this is an original "inspired by" demo, not a clone

## 12. Acceptance Checklist

- [ ] All resume content present and accurate, no placeholder text
- [ ] Navy/gold ledger aesthetic consistent across every section
- [ ] Demo: can add an Expense, Income, and Transfer entry; each updates the correct wallet balance and appears in the ledger list
- [ ] Demo: AI-categorize suggestion appears and can be overridden
- [ ] All stat numbers count up on scroll
- [ ] Fully responsive at 375/768/1280/1440px
- [ ] Keyboard-navigable, AA contrast, reduced-motion respected
- [ ] `npm run dev` runs cleanly with no console errors