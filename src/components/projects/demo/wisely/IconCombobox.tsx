import { useEffect, useRef, useState, type ComponentType } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import type { CategoryOption, ComboboxChangeEvent } from './types';

const triggerClass =
  'w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 flex items-center gap-3 text-left cursor-pointer min-h-[42px]';

function OptionIcon({ option, size = 'sm' }: { option: CategoryOption; size?: 'sm' | 'lg' }) {
  const iconClass = size === 'lg' ? 'w-5 h-5' : 'w-6 h-6';
  const { imageUrl, Icon } = option;
  if (imageUrl) {
    return <img src={imageUrl} alt="" className="h-full w-full object-cover" />;
  }
  if (Icon) {
    const Glyph = Icon as ComponentType<{ className?: string }>;
    return <Glyph className={`${iconClass} text-gray-500 dark:text-gray-400`} aria-hidden />;
  }
  return null;
}

type IconComboboxProps = {
  label?: string;
  name?: string;
  value: string | number;
  onChange?: (event: ComboboxChangeEvent) => void;
  options?: CategoryOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  ariaLabel?: string;
  className?: string;
};

export default function IconCombobox({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  required = false,
  error,
  ariaLabel,
  className = '',
}: IconComboboxProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => String(o.value) === String(value));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [open]);

  const handleSelect = (opt: CategoryOption) => {
    onChange?.({ target: { name, value: String(opt.value) } });
    setOpen(false);
  };

  const accessibleLabel = ariaLabel ?? label;

  return (
    <div ref={ref} className={`relative ${className}`}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && (
            <span className="ml-1 text-red-500" aria-hidden>
              *
            </span>
          )}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={accessibleLabel}
        aria-invalid={!!error}
        className={`${triggerClass} ${error ? 'border-red-500 dark:border-red-400' : ''}`}
      >
        {selected ? (
          <>
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
              <OptionIcon option={selected} size="sm" />
            </span>
            <span className="flex-1 truncate">
              {selected.label}
              {selected.suffix ? ` ${selected.suffix}` : ''}
            </span>
          </>
        ) : (
          <span className="flex-1 truncate text-gray-500 dark:text-gray-400">{placeholder}</span>
        )}
        <ChevronDownIcon
          className={`h-5 w-5 flex-shrink-0 text-gray-500 transition-transform dark:text-gray-400 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open && options.length > 0 && (
        <ul
          role="listbox"
          aria-label={accessibleLabel}
          className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-800"
        >
          {options.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <li
                key={opt.value === '' ? 'empty' : opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt)}
                className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 transition ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200'
                    : 'text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                  <OptionIcon option={opt} size="lg" />
                </span>
                <span className="truncate">
                  {opt.label}
                  {opt.suffix ? ` ${opt.suffix}` : ''}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
