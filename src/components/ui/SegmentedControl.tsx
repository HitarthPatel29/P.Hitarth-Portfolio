import { cn } from '../../lib/cn';

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  activeClassName?: string;
  className?: string;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  activeClassName,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        'grid gap-1 rounded-md border border-hairline bg-navy-deep/70 p-1',
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded px-2 py-2 text-xs font-medium tracking-wide transition-colors duration-200',
              selected
                ? cn('bg-navy-raised text-cream shadow-inset', activeClassName)
                : 'text-muted hover:text-cream',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
