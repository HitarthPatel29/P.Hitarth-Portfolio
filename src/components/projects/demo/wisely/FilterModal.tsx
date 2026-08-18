import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/solid';
import type { FilterGroup } from './types';

export type AppliedFilters = {
  typeFilter: string[];
  categoryFilter: string[];
  groupFilter: string;
  sort: 'newest' | 'oldest';
  startDate: string;
  endDate: string;
  month: string;
};

type FilterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: AppliedFilters) => void;
  groups?: FilterGroup[];
  initialFilters?: Partial<AppliedFilters>;
};

export default function FilterModal({
  isOpen,
  onClose,
  onApply,
  groups = [],
  initialFilters = {},
}: FilterModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [typeFilter, setTypeFilter] = useState<string[]>(initialFilters.typeFilter || []);
  const [categoryFilter, setCategoryFilter] = useState<string[]>(initialFilters.categoryFilter || []);
  const [groupFilter, setGroupFilter] = useState(initialFilters.groupFilter || '');
  const [sort, setSort] = useState<'newest' | 'oldest'>(initialFilters.sort || 'newest');
  const [startDate, setStartDate] = useState(initialFilters.startDate || '');
  const [endDate, setEndDate] = useState(initialFilters.endDate || '');
  const [month, setMonth] = useState(initialFilters.month || '');

  useEffect(() => {
    if (isOpen) {
      setTypeFilter(initialFilters.typeFilter || []);
      setCategoryFilter(initialFilters.categoryFilter || []);
      setGroupFilter(initialFilters.groupFilter || '');
      setSort(initialFilters.sort || 'newest');
      setStartDate(initialFilters.startDate || '');
      setEndDate(initialFilters.endDate || '');
      setMonth(initialFilters.month || '');
    }
  }, [isOpen, initialFilters]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      focusableElements[0]?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const toggleTypeFilter = (item: string) => {
    setTypeFilter((prev) => (prev.includes(item) ? prev.filter((t) => t !== item) : [...prev, item]));
  };

  const toggleCategoryFilter = (item: string) => {
    setCategoryFilter((prev) => (prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]));
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="dark fixed inset-0 z-[80] flex items-center justify-center bg-black/30 px-4"
      onClick={onClose}
      role="presentation"
      aria-hidden={!isOpen}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-modal-title"
        className="relative w-full max-w-md animate-fadeIn rounded-xl bg-gray-100 p-6 shadow-2xl shadow-black dark:bg-gray-800 dark:text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="filter-modal-title" className="text-xl font-bold">
            Filter
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-gray-100 p-1 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-900 dark:hover:bg-gray-700"
            aria-label="Close filter modal"
          >
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <fieldset className="mb-4">
          <legend className="mb-2 font-medium">
            Expense Type{' '}
            {typeFilter.length > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">({typeFilter.length} selected)</span>
            )}
          </legend>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Expense type filters">
            {[
              'Food & Dining',
              'Transport',
              'Housing',
              'Utilities',
              'Health & Medical',
              'Entertainment',
              'Shopping',
              'Education',
              'Personal Care',
              'Travel',
              'Finance',
              'Savings & Investments',
              'Gifts & Donations',
              'Kids & Family',
              'Pets',
              'Other',
            ].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleTypeFilter(item)}
                aria-pressed={typeFilter.includes(item)}
                className={
                  'rounded-full border px-4 py-1 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 ' +
                  (typeFilter.includes(item)
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-700 text-gray-900 hover:bg-gray-200 dark:border-gray-300 dark:text-gray-100 dark:hover:bg-gray-700')
                }
              >
                {item}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mb-4">
          <legend className="mb-2 font-medium">
            Show{' '}
            {categoryFilter.length > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">({categoryFilter.length} selected)</span>
            )}
          </legend>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Expense category filters">
            {[
              { value: 'personal', label: 'Personal' },
              { value: 'shared', label: 'Shared' },
              { value: 'settlements', label: 'Settlements' },
              { value: 'income', label: 'Income' },
              { value: 'transfer', label: 'Transfers' },
            ].map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleCategoryFilter(value)}
                aria-pressed={categoryFilter.includes(value)}
                className={
                  'rounded-full border px-4 py-1 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 ' +
                  (categoryFilter.includes(value)
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-700 text-gray-900 hover:bg-gray-200 dark:border-gray-300 dark:text-gray-100 dark:hover:bg-gray-700')
                }
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mb-4">
          <label htmlFor="group-filter" className="mb-2 block font-medium">
            By Group:
          </label>
          <select
            id="group-filter"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:border-gray-600 dark:bg-gray-900"
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            aria-label="Filter by group"
          >
            <option value="">All Groups</option>
            {groups.map((g) => (
              <option key={g.groupId} value={g.groupId}>
                {g.groupName}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="mb-4">
          <legend className="mb-2 font-medium">Sort By</legend>
          <div className="flex gap-3" role="radiogroup" aria-label="Sort order">
            <button
              type="button"
              onClick={() => setSort('newest')}
              role="radio"
              aria-checked={sort === 'newest'}
              aria-label="Sort by newest first"
              className={
                'rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ' +
                (sort === 'newest'
                  ? 'border-green-500 bg-green-500 text-white'
                  : 'border-gray-800 text-gray-800 hover:bg-gray-200 dark:border-gray-200 dark:text-gray-200 dark:hover:bg-gray-700')
              }
            >
              Newest
            </button>
            <button
              type="button"
              onClick={() => setSort('oldest')}
              role="radio"
              aria-checked={sort === 'oldest'}
              aria-label="Sort by oldest first"
              className={
                'rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 ' +
                (sort === 'oldest'
                  ? 'border-green-500 bg-green-500 text-white'
                  : 'border-gray-800 text-gray-800 hover:bg-gray-200 dark:border-gray-200 dark:text-gray-200 dark:hover:bg-gray-700')
              }
            >
              Oldest
            </button>
          </div>
        </fieldset>

        <div className="mb-4">
          <p className="mb-2 font-medium">Date Range</p>
          <div className="flex gap-3">
            <label htmlFor="start-date" className="sr-only">
              Start date
            </label>
            <input
              id="start-date"
              type="date"
              className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:border-gray-600 dark:bg-gray-900"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setMonth('');
              }}
              aria-label="Start date for filter"
            />
            <label htmlFor="end-date" className="sr-only">
              End date
            </label>
            <input
              id="end-date"
              type="date"
              className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:border-gray-600 dark:bg-gray-900"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setMonth('');
              }}
              aria-label="End date for filter"
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="month-filter" className="mb-2 block font-medium">
            By Month
          </label>
          <select
            id="month-filter"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:border-gray-600 dark:bg-gray-900"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            aria-label="Filter by month"
          >
            <option value="">Select Month</option>
            <option>January</option>
            <option>February</option>
            <option>March</option>
            <option>April</option>
            <option>May</option>
            <option>June</option>
            <option>July</option>
            <option>August</option>
            <option>September</option>
            <option>October</option>
            <option>November</option>
            <option>December</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 rounded-lg border border-gray-300 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            onClick={() => {
              setTypeFilter([]);
              setCategoryFilter([]);
              setGroupFilter('');
              setSort('newest');
              setStartDate('');
              setEndDate('');
              setMonth('');
            }}
          >
            Clear All
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg bg-green-500 py-2 font-medium text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            onClick={() =>
              onApply({
                typeFilter,
                categoryFilter,
                groupFilter,
                sort,
                startDate,
                endDate,
                month,
              })
            }
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
