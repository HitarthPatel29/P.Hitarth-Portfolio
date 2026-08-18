import ExpenseItemCard, { type ExpenseCardType } from './ExpenseItemCard';

export type GroupedExpenseItem = {
  expenseId: string;
  title: string;
  subtitle?: string;
  amount: string;
  userBalance?: string;
  cardType: ExpenseCardType;
  highlight?: boolean;
  onClick?: () => void;
};

const formatGroupDate = (raw: string) => {
  if (!raw) return '';
  try {
    const d = new Date(`${raw}T00:00:00`);
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return raw;
  }
};

export default function ExpensesGroupByDate({
  date,
  expenses,
}: {
  date: string;
  expenses: GroupedExpenseItem[];
}) {
  if (!expenses || expenses.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2 px-1 text-sm font-semibold text-gray-500 dark:text-gray-400">
        {formatGroupDate(date)}
      </h3>
      <div className="mx-1 overflow-hidden rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-lg dark:border-gray-700 dark:hover:border-gray-500">
        {expenses.map((item, idx) => (
          <ExpenseItemCard
            key={item.expenseId}
            title={item.title}
            subtitle={item.subtitle}
            amount={item.amount}
            userBalance={item.userBalance}
            type={item.cardType}
            highlight={item.highlight}
            grouped
            isLast={idx === expenses.length - 1}
            onClick={item.onClick}
          />
        ))}
      </div>
    </div>
  );
}
