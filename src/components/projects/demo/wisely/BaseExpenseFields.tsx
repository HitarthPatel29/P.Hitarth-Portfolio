import { useEffect, useRef, useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { predictCategory } from '../classifyClient';
import IconCombobox from './IconCombobox';
import { EXPENSE_CATEGORIES } from './expenseCategories';
import type { ComboboxChangeEvent, ExpenseDraft } from './types';

const inputClass =
  'w-full appearance-none border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400';

type FieldChange = (event: ComboboxChangeEvent | { target: { name: string; value: string } }) => void;

type BaseExpenseFieldsProps = {
  expense: ExpenseDraft | null;
  onChange: FieldChange;
  errors?: Record<string, string>;
};

export default function BaseExpenseFields({ expense, onChange, errors = {} }: BaseExpenseFieldsProps) {
  const [suggestion, setSuggestion] = useState<{ category: string; confidence: number } | null>(null);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const lastFetchedTitle = useRef('');

  useEffect(() => {
    const raw = (expense?.title ?? '').trim();
    if (raw.length < 3) {
      setSuggestion(null);
      setSuggestLoading(false);
      return;
    }
    if (raw === lastFetchedTitle.current) return;

    setSuggestLoading(true);
    const handle = window.setTimeout(async () => {
      try {
        const data = await predictCategory(raw);
        lastFetchedTitle.current = raw;
        if (data?.category) {
          setSuggestion({ category: data.category, confidence: data.confidence ?? 0 });
          onChange({ target: { name: 'predictedCategory', value: data.category } });
        } else {
          setSuggestion(null);
        }
      } catch {
        setSuggestion(null);
      } finally {
        setSuggestLoading(false);
      }
    }, 800);

    return () => window.clearTimeout(handle);
    // onChange is omitted so identity changes don't re-fire the lookup.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expense?.title]);

  const applySuggestion = () => {
    if (!suggestion) return;
    onChange({ target: { name: 'category', value: suggestion.category } });
  };

  const currentCategory = expense?.category ?? '';
  const showChip =
    !!suggestion?.category && suggestion.category.toLowerCase() !== String(currentCategory).toLowerCase();

  if (!expense) return null;

  const amountValue =
    expense.amount === undefined || expense.amount === null
      ? expense.totalAmount === 0 || expense.totalAmount === ''
        ? ''
        : expense.totalAmount
      : expense.amount === 0 || expense.amount === ''
        ? ''
        : expense.amount;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="grid grid-cols-2 gap-2 p-4">
        <div className="col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Expense title</label>
          <input
            type="text"
            name="title"
            value={expense.title ?? ''}
            onChange={onChange}
            required
            placeholder="e.g. Lunch with client"
            className={inputClass}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          {errors.title && (
            <p id="title-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.title}
            </p>
          )}

          {showChip && suggestion && (
            <div className="mt-2 flex items-center gap-2" aria-live="polite">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                <SparklesIcon className="h-3.5 w-3.5" aria-hidden />
                Suggested: {suggestion.category}
                {suggestion.confidence ? (
                  <span className="opacity-70">({Math.round(suggestion.confidence * 100)}%)</span>
                ) : null}
              </span>
              <button
                type="button"
                onClick={applySuggestion}
                className="text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
              >
                Apply
              </button>
            </div>
          )}
          {!showChip && suggestLoading && (expense?.title ?? '').trim().length >= 3 && (
            <p className="mt-2 text-xs italic text-gray-400 dark:text-gray-500" aria-live="polite">
              Looking up category suggestion...
            </p>
          )}
        </div>
        <div className="col-span-2">
          <IconCombobox
            label="Expense Category"
            name="category"
            value={expense.category ?? ''}
            onChange={onChange}
            options={EXPENSE_CATEGORIES}
            placeholder="Select a type"
            required
            error={errors.category}
          />
          {errors.category && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300">$</span>
            <input
              type="number"
              name="amount"
              value={amountValue ?? ''}
              onChange={onChange}
              step="0.01"
              min="0"
              placeholder="0.00"
              className={`${inputClass} min-w-0 flex-1`}
              aria-invalid={!!errors.amount}
            />
          </div>
          {errors.amount && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <input
            type="date"
            name="date"
            value={expense.date ?? ''}
            onChange={onChange}
            required
            className={inputClass}
            aria-invalid={!!errors.date}
          />
          {errors.date && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>}
        </div>
      </div>
    </div>
  );
}
