import type { EntryKind as EntryType } from './wisely/types';

export type Suggestion = {
  category: string;
  confidence: number;
  type: EntryType;
};

type Rule = {
  keywords: string[];
  category: string;
  type: EntryType;
  confidence: number;
};

/**
 * Keyword fallback for when GET /classify/predict is unreachable.
 * Category labels match WiselySplit's production dropdown.
 */
const rules: Rule[] = [
  {
    keywords: ['coffee', 'starbucks', 'tims', 'restaurant', 'grocery', 'groceries', 'dinner', 'lunch', 'pizza', 'cafe', 'food'],
    category: 'Food & Dining',
    type: 'expense',
    confidence: 0.92,
  },
  {
    keywords: ['uber', 'lyft', 'gas', 'fuel', 'transit', 'bus', 'presto', 'parking', 'train'],
    category: 'Transport',
    type: 'expense',
    confidence: 0.9,
  },
  {
    keywords: ['rent', 'mortgage', 'landlord', 'lease'],
    category: 'Housing',
    type: 'expense',
    confidence: 0.95,
  },
  {
    keywords: ['hydro', 'electric', 'water bill', 'internet', 'phone bill', 'utility', 'utilities'],
    category: 'Utilities',
    type: 'expense',
    confidence: 0.88,
  },
  {
    keywords: ['amazon', 'clothes', 'shoes', 'shopping', 'target', 'walmart', 'ikea'],
    category: 'Shopping',
    type: 'expense',
    confidence: 0.85,
  },
  {
    keywords: ['netflix', 'spotify', 'movie', 'cinema', 'concert', 'game', 'steam'],
    category: 'Entertainment',
    type: 'expense',
    confidence: 0.89,
  },
  {
    keywords: ['pharmacy', 'dentist', 'doctor', 'clinic', 'medicine', 'prescription'],
    category: 'Health & Medical',
    type: 'expense',
    confidence: 0.91,
  },
  {
    keywords: ['salary', 'payroll', 'paycheque', 'paycheck', 'wages'],
    category: 'Salary',
    type: 'income',
    confidence: 0.94,
  },
  {
    keywords: ['freelance', 'contract', 'invoice', 'client', 'gig'],
    category: 'Freelance',
    type: 'income',
    confidence: 0.9,
  },
  {
    keywords: ['gift', 'birthday', 'present'],
    category: 'Gift',
    type: 'income',
    confidence: 0.82,
  },
  {
    keywords: ['interest', 'dividend', 'gic', 'investment'],
    category: 'Investment',
    type: 'income',
    confidence: 0.86,
  },
  {
    keywords: ['transfer', 'move to savings', 'top up'],
    category: 'Transfer',
    type: 'transfer',
    confidence: 0.93,
  },
];

export function categorize(note: string, type: EntryType): Suggestion | null {
  const text = note.trim().toLowerCase();
  if (text.length < 3) return null;

  const matches = rules.filter((rule) => rule.keywords.some((keyword) => text.includes(keyword)));
  if (matches.length === 0) return null;

  const sameType = matches.filter((rule) => rule.type === type);
  const best = (sameType.length > 0 ? sameType : matches).reduce((a, b) =>
    b.confidence > a.confidence ? b : a,
  );

  return { category: best.category, confidence: best.confidence, type: best.type };
}
