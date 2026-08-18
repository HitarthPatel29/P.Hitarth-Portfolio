// NOTE: `linkedin` and `github` are best guesses — the resume lists the labels
// without URLs. Replace with the real profile URLs before publishing.
export const profile = {
  name: 'Hitarth Patel',
  eyebrow: 'Software Developer',
  subhead: 'Full-Stack Development & Backend Systems',
  positioning:
    '18+ months building scalable backend systems — Integrated a self-training ML pipeline into production-hardened fintech application.',
  location: 'Hamilton, ON',
  email: 'p2004hitarth@gmail.com',
  phone: '+1 (365) 883-2904',
  phoneHref: '+13658832904',
  linkedin: 'https://www.linkedin.com/in/hitarth-patel-a3a9b1250/',
  github: 'https://github.com/Hitarth-Patel-P',
  site: 'https://wiselysplit.xyz',
  resumeFile: '/Hitarth-Patel-Resume.docx',
} as const;

export const summary =
  'Software Developer with 18+ months of hands-on experience building scalable backend systems across deployed applications, freelance product work, applied research, and a professional internship. Expert proficiency in Java 17, Spring Boot 3.5 and Hibernate/JPA with microservice as well as monolithic architecture. Skilled in writing clean, maintainable, well-documented code, with hands-on exposure to applied machine learning (Naive Bayes classification, self-training feedback loops). Comfortable in Agile/Scrum environments with remote, collaborative teams. Microsoft Azure Certified. Honors graduate with an 86.7% GPA.';

// `icon` maps to a lucide icon in Nav.tsx. `hint` is the plain-English meaning,
// surfaced as a tooltip so the fintech naming never costs a recruiter a click.
export const navLinks = [
  { label: 'Profile', href: '#about', icon: 'User', hint: 'About' },
  { label: 'Portfolio', href: '#skills', icon: 'Briefcase', hint: 'Skills' },
  { label: 'Wallet', href: '#projects', icon: 'Wallet', hint: 'Projects' },
  { label: 'Insights', href: '#research', icon: 'Search', hint: 'Applied research' },
  { label: 'Income History', href: '#experience', icon: 'TrendingUp', hint: 'Work experience' },
  { label: 'Expense History', href: '#education', icon: 'TrendingDown', hint: 'Education' },
  { label: 'Notifications', href: '#posts', icon: 'Bell', hint: 'LinkedIn posts' },
  { label: 'Support', href: '#contact', icon: 'Headset', hint: 'Contact' },
] as const;

export type SkillRow = { category: string; items: string[] };

export const skills: SkillRow[] = [
  { category: 'Core & Languages', items: ['Java', 'Python', 'JavaScript'] },
  {
    category: 'Java Ecosystem',
    items: [
      'Spring Boot',
      'Spring Data JPA',
      'Hibernate ORM',
      'Spring MVC',
      'REST API Design',
      'Resilience4j',
      'RestTemplate',
      'WebClient',
      'FeignClient',
      'Apache Kafka',
      'JWT',
      'BCrypt',
      'Spring Security',
      'Spring Validation',
      'Spring JDBC',
    ],
  },
  { category: 'Architecture', items: ['Monolithic', 'Microservice'] },
  { category: 'Frontend', items: ['React.js', 'Tailwind CSS'] },
  {
    category: 'ML / Data',
    items: ['SMILE (Naive Bayes)', 'scikit-learn', 'scikit-image', 'Keras/TensorFlow', 'FaceNet'],
  },
  {
    category: 'Databases & DevOps',
    items: ['MySQL', 'MongoDB', 'Microsoft Azure', 'Git', 'CI/CD (Jenkins)', 'Docker', 'Railway'],
  },
  {
    category: 'Methodologies',
    items: ['Agile/Scrum', 'TDD', 'BDD', 'Code Review Practices'],
  },
  { category: 'Testing', items: ['JUnit', 'Mockito', 'Postman', 'Selenium'] },
  {
    category: 'Soft Skills',
    items: [
      'Problem-Solving',
      'Communication',
      'Cross-Functional Collaboration',
      'Stakeholder Management',
      'Adaptability',
      'Time Management',
    ],
  },
];

export type Stat = {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
};

export const stats: Stat[] = [
  { value: 18, suffix: '+', label: 'Months experience' },
  { value: 70, suffix: '+', label: 'REST endpoints shipped' },
  { value: 100, suffix: '+', label: 'Bugs resolved' },
  { value: 86.7, suffix: '%', decimals: 1, label: 'GPA' },
];

export const wiselySplit = {
  title: 'WiselySplit',
  tagline: 'Full-Stack Financial Web Application',
  period: 'Sep 2025 – Present',
  tech: [
    'Java 17',
    'Spring Boot 3.5',
    'MySQL',
    'React.js',
    'Stripe Connect',
    'Naïve Bayes',
    'SMILE',
  ],
  liveUrl: 'https://wiselysplit.xyz',
  repoUrl: 'https://github.com/Hitarth-Patel-P',
  highlights: [
    {
      icon: 'Layers',
      text: 'Architected and shipped a full-stack fintech platform — 70+ RESTful endpoints (Spring Boot 3.5, Spring MVC), JWT + BCrypt auth with RBAC via Spring Security, Stripe Connect for P2P settlements, Google OAuth SSO.',
    },
    {
      icon: 'BrainCircuit',
      text: 'Designed and deployed a Naive Bayes/SMILE classification pipeline to auto-categorize transactions in real time, with a self-training feedback loop that retrains on user corrections.',
    },
    {
      icon: 'Database',
      text: 'Adopted Hibernate/JPA for entity mapping and query optimization, migrating select modules from raw JDBC to ORM-managed persistence.',
    },
    {
      icon: 'ShieldCheck',
      text: 'Maintained the app 10+ months in production — resolved 100+ bugs, hardened 15+ financial edge cases (negative balances, failed payment retries, partial settlements, mid-group split recalculation).',
    },
    {
      icon: 'Smartphone',
      text: 'Built Apple Pay + Shortcuts integrations for one-tap automated expense logging.',
    },
    {
      icon: 'Gauge',
      text: 'Reduced per-session API round-trips by ~50–60% via prefetching and eliminating redundant client calls.',
    },
    {
      icon: 'Radio',
      text: 'Introduced Apache Kafka for async, event-driven messaging between core services.',
    },
  ],
} as const;

export const research = {
  title: 'Facial Recognition: Impact of Photo Enhancement Algorithms',
  org: 'Mohawk College (Hybrid)',
  period: 'Sept – Dec 2024',
  tech: ['Java 17', 'Keras/TensorFlow', 'OpenCV', 'FaceNet', 'Dlib'],
  bullets: [
    'Led a 4-person team on a real archival problem: identifying individuals in low-res, dithered war memorial photographs.',
    'Integrated and tested image-enhancement + face-recognition model combinations, including fine-tuning FaceNet on a labeled archival photo library.',
    'Owned the Git repo end-to-end; ran the team day-to-day, led weekly meetings with the supervising professor.',
  ],
  finding:
    'Enhancement algorithms improved recognition on photos with degraded-but-present facial data, but worsened accuracy on photos with little-to-no facial data — producing evidence-backed guidance on when pre-processing should and shouldn’t be used in archival digitization workflows.',
} as const;

export type Role = {
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
};

export const experience: Role[] = [
  {
    role: 'Software System Analyst (Freelance)',
    company: 'Contribiia',
    location: 'Toronto, ON (Remote)',
    period: 'Jan – Apr 2025',
    bullets: [
      'Bridged 2 business stakeholders and 2 UI/UX designers for a fintech ROSCA startup lacking structured requirements.',
      'Translated product ideas into development-ready specs (features, edge cases, validation rules); led design reviews.',
      'Delivered a complete UI/UX spec package, giving the startup a clear concept-to-prototype path.',
    ],
  },
  {
    role: 'Web Developer Intern',
    company: 'Glacier Inc.',
    location: 'Gujarat, India',
    period: 'Jun – Dec 2022',
    bullets: [
      '6-month React.js internship building responsive, cross-device web pages.',
      'Mentored on component structuring, performance, and coding standards.',
      'Owned WordPress theme/plugin customization; resolved layout/compatibility issues.',
      'Set up Selenium regression testing via Katalon Recorder; wrote/maintained unit tests.',
    ],
  },
  {
    role: 'Customer Service Associate & Baker',
    company: 'Tim Hortons',
    location: 'Hamilton, ON',
    period: 'Jan 2023 – Present',
    bullets: [
      'Collaborates within a 10+ person team maintaining service quality during peak hours.',
      'Led and trained 7+ new employees in the kitchen.',
    ],
  },
];

export const education = {
  degree: 'Advanced Diploma – Computer System Technology',
  school: 'Mohawk College',
  location: 'Hamilton, ON',
  period: 'Jan 2023 – Dec 2025',
  honors: ['Honors Graduate', 'GPA 86.7%'],
} as const;

export const certifications = [
  { name: 'Microsoft Azure Fundamentals (AZ-900)', date: 'Nov 2024' },
  { name: 'Microsoft Azure AI Fundamentals (AI-900)', date: 'Mar 2023' },
] as const;

// `urn` is the identifier from LinkedIn's own "Embed this post" snippet
// (Post menu → Embed this post). Order here is the order shown in the carousel.
export type LinkedInPost = { urn: string };

export const linkedinPosts: LinkedInPost[] = [
  { urn: 'urn:li:share:7493316668941565952' },
  { urn: 'urn:li:share:7490506991401066496' },
  { urn: 'urn:li:ugcPost:7480291673994915840' },
  { urn: 'urn:li:ugcPost:7467641390819069952' },
  { urn: 'urn:li:ugcPost:7460384572090945537' },
];

export const linkedInEmbedUrl = (urn: string) =>
  `https://www.linkedin.com/embed/feed/update/${urn}`;

export const linkedInPostUrl = (urn: string) =>
  `https://www.linkedin.com/feed/update/${urn}/`;
