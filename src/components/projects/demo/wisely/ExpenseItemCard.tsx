export type ExpenseCardType =
  | 'lent'
  | 'owe'
  | 'settle'
  | 'personal'
  | 'income'
  | 'transfer'
  | 'shared'
  | 'not-involved';

type ExpenseItemCardProps = {
  date?: string;
  title: string;
  subtitle?: string;
  amount: string | number;
  userBalance?: string | number;
  type?: ExpenseCardType;
  highlight?: boolean;
  grouped?: boolean;
  isLast?: boolean;
  onClick?: () => void;
};

export default function ExpenseItemCard({
  date,
  title,
  subtitle,
  amount,
  userBalance,
  type,
  highlight = false,
  grouped = false,
  isLast = false,
  onClick,
}: ExpenseItemCardProps) {
  const isSettle = type === 'settle';
  const isPersonal = type === 'personal';
  const isIncome = type === 'income';
  const isTransfer = type === 'transfer';
  const isShared = type === 'shared';
  const balanceNum = Number(userBalance ?? 0);

  const bgStyles = isSettle
    ? 'bg-cyan-50/80 dark:bg-cyan-900/30 hover:bg-cyan-100/80 dark:hover:bg-cyan-800/40'
    : isIncome
      ? 'bg-green-50/80 dark:bg-green-900/30 hover:bg-green-100/80 dark:hover:bg-green-800/40'
      : isTransfer
        ? 'bg-white dark:bg-gray-800 hover:bg-gray-50/80 dark:hover:bg-gray-700/40'
        : isPersonal
          ? 'bg-indigo-50/50 dark:bg-indigo-900/30 hover:bg-indigo-100/80 dark:hover:bg-indigo-800/40'
          : isShared
            ? 'bg-white dark:bg-gray-800 hover:bg-gray-50/80 dark:hover:bg-gray-700/40'
            : highlight
              ? 'bg-yellow-50 hover:bg-yellow-100'
              : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50';

  const borderStyles = isSettle
    ? 'border-cyan-200 dark:border-cyan-700'
    : isIncome
      ? 'border-green-200 dark:border-green-700'
      : isTransfer
        ? 'border-amber-200 dark:border-amber-700'
        : isPersonal
          ? 'border-indigo-200 dark:border-indigo-700'
          : 'border-gray-300 dark:border-gray-700';

  let topLabel: string | undefined;
  let topColor: string | undefined;
  let bottomLabel: string | undefined;
  let bottomColor: string | undefined;
  if (type === 'lent') {
    topLabel = 'You Lent';
    topColor = 'text-emerald-600';
    bottomLabel = `$${amount}`;
    bottomColor = 'text-emerald-600';
  } else if (type === 'owe') {
    topLabel = 'You Owe';
    topColor = 'text-red-500';
    bottomLabel = `$${amount}`;
    bottomColor = 'text-red-500';
  } else if (type === 'settle') {
    topLabel = 'Settled';
    topColor = 'text-cyan-600 dark:text-cyan-400';
    bottomLabel = `$${amount}`;
    bottomColor = 'text-cyan-600 dark:text-cyan-400';
  } else if (type === 'income') {
    topLabel = 'Income';
    topColor = 'text-green-600 dark:text-green-400';
    bottomLabel = `+$${amount}`;
    bottomColor = 'text-green-600 dark:text-green-400';
  } else if (type === 'transfer') {
    topLabel = 'Transfer';
    topColor = 'text-gray-600 dark:text-gray-400';
    bottomLabel = `$${amount}`;
    bottomColor = 'text-gray-600 dark:text-gray-400';
  } else if (type === 'personal') {
    topLabel = 'Spent';
    topColor = 'text-indigo-600 dark:text-indigo-400';
    bottomLabel = `$${amount}`;
    bottomColor = 'text-indigo-600 dark:text-indigo-400';
  } else if (type === 'shared') {
    topLabel = balanceNum > 0 ? `You Lent $${userBalance}` : `You Owe $${Math.abs(balanceNum)}`;
    topColor = balanceNum > 0 ? 'text-emerald-600' : 'text-red-500';
    bottomLabel = `Spent $${amount}`;
    bottomColor = 'text-red-600 dark:text-red-500';
  } else {
    topLabel = 'You are not involved';
    topColor = 'text-gray-500 dark:text-gray-400';
    bottomLabel = `$${amount}`;
    bottomColor = 'text-gray-500 dark:text-gray-400';
  }

  const ariaAmount =
    type === 'shared' ? `you lent $${userBalance}, paid $${amount}` : `${topLabel} $${amount}`;

  const standaloneClass = `rounded-xl border shadow-sm hover:shadow-md hover:border-gray-100 dark:hover:border-gray-600 ${borderStyles}`;
  const groupedClass = !isLast ? 'border-b border-gray-200 dark:border-gray-700' : '';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full cursor-pointer items-center justify-between px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-emerald-400 ${bgStyles} ${grouped ? groupedClass : standaloneClass}`}
      aria-label={`${title}. ${ariaAmount}${date ? ` on ${date}` : ''}${subtitle ? `. ${subtitle}` : ''}`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {!grouped && date && (
          <div className="w-12 shrink-0 text-center text-sm font-semibold leading-tight" aria-hidden="true">
            {date?.split(' ')[0]} <br />
            <span className="text-base font-normal">{date?.split(' ')[1]}</span>
          </div>
        )}
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate font-medium text-gray-900 dark:text-gray-100">{title}</p>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
      </div>

      <div className="ml-3 flex shrink-0 flex-col items-end" aria-hidden="true">
        {topLabel && <p className={`text-sm font-semibold ${topColor}`}>{topLabel}</p>}
        <p className={`font-semibold ${bottomColor}`}>{bottomLabel}</p>
      </div>
    </button>
  );
}
