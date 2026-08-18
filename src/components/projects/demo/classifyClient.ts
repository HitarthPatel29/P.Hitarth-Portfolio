import { categorize } from './mockCategorizer';

const DEFAULT_API_BASE = 'https://wiselysplit.xyz/api';

export type PredictResult = {
  category: string;
  confidence: number;
};

function apiBase(): string {
  return (import.meta.env.VITE_WISELYSPLIT_API_BASE || DEFAULT_API_BASE).replace(/\/$/, '');
}

function fallbackPredict(title: string): PredictResult | null {
  const suggestion = categorize(title, 'expense');
  if (!suggestion) return null;
  return { category: suggestion.category, confidence: suggestion.confidence };
}

/** Live Naive Bayes predict, with keyword fallback when the API is unreachable. */
export async function predictCategory(title: string): Promise<PredictResult | null> {
  const raw = title.trim();
  if (raw.length < 3) return null;

  try {
    const url = new URL(`${apiBase()}/classify/predict`);
    url.searchParams.set('title', raw);
    const response = await fetch(url.toString());
    if (!response.ok) return fallbackPredict(raw);
    const data = (await response.json()) as { category?: string | null; confidence?: number };
    if (data?.category) {
      return { category: data.category, confidence: data.confidence ?? 0 };
    }
    return fallbackPredict(raw);
  } catch {
    return fallbackPredict(raw);
  }
}
