import { useEffect, useState, type FormEvent } from 'react';
import {
  cloneExpense,
  createNewExpense,
  createNewPersonalExpense,
  normalizeExpenseForAPI,
  validateExpense,
} from './expenseModel';
import BillSplit from './BillSplit';
import BaseExpenseFields from './BaseExpenseFields';
import SharedExpenseFields from './SharedExpenseFields';
import PersonalExpenseFields from './PersonalExpenseFields';
import { useNotification } from './NotificationContext';
import type {
  ComboboxChangeEvent,
  DemoConnection,
  DemoMember,
  DemoWallet,
  ExpenseDraft,
  ExpenseMode,
  ExpensePayload,
  SplitDetail,
} from './types';

type ExpenseFormProps = {
  mode?: 'create' | 'edit';
  initialData: ExpenseDraft;
  onSubmit: (payload: ExpensePayload, mode: ExpenseMode) => void;
  onCancel?: () => void;
  currentUserId: number;
  friendsAndGroups?: DemoConnection[];
  wallets?: DemoWallet[];
  defaultMode?: ExpenseMode;
};

export default function ExpenseForm({
  mode = 'create',
  initialData,
  onSubmit,
  onCancel,
  currentUserId,
  friendsAndGroups = [],
  wallets = [],
  defaultMode = 'shared',
}: ExpenseFormProps) {
  const { showError } = useNotification();
  const [expenseMode, setExpenseMode] = useState<ExpenseMode>(defaultMode);
  const [expense, setExpense] = useState<ExpenseDraft>(initialData);
  const [equalSplit, setEqualSplit] = useState(true);
  const [showBillSplit, setShowBillSplit] = useState(false);
  const [billSplitApplied, setBillSplitApplied] = useState(false);

  const includedOf = (arr: SplitDetail[]) => (arr || []).filter((m) => m.include);

  const equalDivide = (prev: ExpenseDraft): ExpenseDraft => {
    const next = cloneExpense(prev);
    const inc = includedOf(next.splitDetails);
    const n = inc.length;
    const per = n ? (parseFloat(String(next.amount)) || 0) / n : 0;
    next.splitDetails = (next.splitDetails || []).map((m) =>
      m.include ? { ...m, portion: 1, amount: per } : { ...m, portion: 0, amount: 0 },
    );
    return next;
  };

  const amountsFromPortions = (prev: ExpenseDraft): ExpenseDraft => {
    const next = cloneExpense(prev);
    const inc = includedOf(next.splitDetails);
    const totalPortions = inc.reduce((s, m) => s + (Number(m.portion) || 0), 0);
    next.splitDetails = (next.splitDetails || []).map((m) => {
      if (!m.include) return { ...m, amount: 0 };
      if (totalPortions <= 0) return { ...m, amount: 0 };
      const share = (Number(m.portion) || 0) / totalPortions;
      const calculated = (Number(next.amount) || 0) * share;
      return { ...m, amount: Number(calculated.toFixed(2)) };
    });
    return next;
  };

  const portionsFromAmounts = (prev: ExpenseDraft): ExpenseDraft => {
    const next = cloneExpense(prev);
    const inc = includedOf(next.splitDetails);
    const sumAmt = inc.reduce((s, m) => s + (Number(m.amount) || 0), 0);
    const n = inc.length || 1;
    next.splitDetails = (next.splitDetails || []).map((m) => {
      if (!m.include) return { ...m, portion: 0 };
      if (sumAmt <= 0) return { ...m, portion: 0 };
      const avg = sumAmt / n;
      const calculated = (Number(m.amount) || 0) / avg;
      return { ...m, portion: Number(calculated.toFixed(1)) };
    });
    return next;
  };

  useEffect(() => {
    if (!expense?.date) {
      const today = new Date().toLocaleDateString('en-CA');
      setExpense((p) => (p ? { ...p, date: today } : { ...createNewPersonalExpense(currentUserId), date: today }));
    }
    setBillSplitApplied((prev) => expense?.billSplitUsed ?? prev);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildBillSplitMembers = (): DemoMember[] => {
    if (expense.shareWithType === 'group') {
      const unique: DemoMember[] = [];
      const seen = new Set<number>();
      (expense.splitDetails || []).forEach((m) => {
        if (!seen.has(m.userId)) {
          seen.add(m.userId);
          unique.push({ userId: m.userId, name: m.name });
        }
      });
      return unique;
    }
    return [
      { userId: currentUserId, name: 'You' },
      { userId: expense.shareWithId ?? 0, name: expense.shareWith },
    ];
  };

  const updateField = (e: { target: { name?: string; value: string } }) => {
    const { name, value } = e.target;
    if (!name) return;
    setExpense((prev) => {
      let next = cloneExpense(prev);
      (next as unknown as Record<string, unknown>)[name] = value;
      if (name === 'amount' && next.shareWithType === 'group') {
        next = equalSplit ? equalDivide(next) : amountsFromPortions(next);
      }
      return next;
    });
  };

  const handleModeToggle = (newMode: ExpenseMode) => {
    if (newMode === expenseMode) return;
    setExpenseMode(newMode);
    setExpense((prev) => {
      const common = {
        title: prev?.title ?? '',
        amount: prev?.amount ?? 0,
        date: prev?.date ?? new Date().toLocaleDateString('en-CA'),
        category: prev?.category ?? '',
      };
      if (newMode === 'personal') {
        return { ...createNewPersonalExpense(currentUserId), ...common };
      }
      const first = friendsAndGroups[0];
      if (!first) return prev;
      const base = createNewExpense(
        first.id,
        first.name,
        first.type || 'friend',
        first.members || [],
        currentUserId,
      );
      return { ...base, ...common };
    });
    if (newMode === 'shared') setEqualSplit(true);
  };

  const handleShareWithChange = (e: ComboboxChangeEvent) => {
    const selected = friendsAndGroups.find((p) => p.id === parseInt(e.target.value, 10));
    if (!selected) return;
    setExpense((prev) => {
      const base = createNewExpense(
        selected.id,
        selected.name,
        selected.type || 'friend',
        selected.members || [],
        currentUserId,
      );
      base.title = prev?.title ?? '';
      base.amount = prev?.amount ?? 0;
      base.date = prev?.date ?? '';
      base.category = prev?.category ?? '';
      base.payerId = prev?.payerId ?? currentUserId;
      return base.shareWithType === 'group' ? equalDivide(base) : base;
    });
    setEqualSplit(true);
  };

  const handlePayerChange = (payerId: number) => {
    setExpense((prev) => ({ ...cloneExpense(prev), payerId }));
  };

  const handleWalletChange = (walletId: number | null) => {
    setExpense((prev) => ({ ...cloneExpense(prev), walletId }));
  };

  const toggleInclude = (index: number) => {
    setExpense((prev) => {
      let next = cloneExpense(prev);
      const member = next.splitDetails[index];
      member.include = !member.include;
      if (!member.include) {
        member.portion = 0;
        member.amount = 0;
        next = equalSplit ? equalDivide(next) : amountsFromPortions(next);
      } else if (equalSplit) {
        next = equalDivide(next);
      } else {
        member.portion = 1;
        next = amountsFromPortions(next);
      }
      return next;
    });
  };

  const handleEqualToggle = (val: boolean) => {
    setEqualSplit(val);
    setExpense((prev) => {
      if (prev?.shareWithType !== 'group') return prev;
      return val ? equalDivide(prev) : amountsFromPortions(prev);
    });
  };

  const handlePortionChange = (index: number, value: string) => {
    const v = value === '' ? '' : Number(value);
    setExpense((prev) => {
      let next = cloneExpense(prev);
      next.splitDetails[index].portion = v;
      if (next.shareWithType === 'group' && !equalSplit) next = amountsFromPortions(next);
      return next;
    });
  };

  const handleAmountChange = (index: number, value: string) => {
    const v = value === '' ? '' : Number(value);
    setExpense((prev) => {
      let next = cloneExpense(prev);
      next.splitDetails[index].amount = v;
      if (next.shareWithType === 'group' && !equalSplit) next = portionsFromAmounts(next);
      return next;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const error = validateExpense(expense, currentUserId, billSplitApplied, expenseMode, wallets);
    if (error) {
      showError(error, { asSnackbar: true });
      return;
    }
    const payload = normalizeExpenseForAPI({ ...expense }, currentUserId, billSplitApplied, expenseMode);
    onSubmit(payload, expenseMode);
  };

  const handleOpenBillSplit = () => {
    const members = buildBillSplitMembers();
    if (!members.length) {
      showError('No participants available to split this bill.', {
        asSnackbar: true,
      });
      return;
    }
    setShowBillSplit(true);
  };

  const handleBillSplitApply = (billSplitDetails: SplitDetail[], totalAmount: number) => {
    setExpense((prev) => {
      const prevClone = cloneExpense(prev);
      if (
        prevClone.shareWithType === 'friend' &&
        (!prevClone.splitDetails || prevClone.splitDetails.length === 0)
      ) {
        prevClone.splitDetails = [
          { userId: currentUserId, name: 'You', amount: 0, portion: 0, include: false },
          {
            userId: prevClone.shareWithId ?? 0,
            name: prevClone.shareWith,
            amount: 0,
            portion: 0,
            include: false,
          },
        ];
      }
      const updatedSplitDetails = (prevClone.splitDetails || []).map((member) => {
        const updated = billSplitDetails.find((m) => m.userId === member.userId);
        if (updated) {
          return {
            ...member,
            amount: Number(Number(updated.amount).toFixed(2)),
            include: true,
            portion: 1,
          };
        }
        return { ...member, amount: 0, include: false, portion: 0 };
      });
      return {
        ...prevClone,
        amount: Number(totalAmount.toFixed(2)),
        splitDetails: updatedSplitDetails,
      };
    });
    setEqualSplit(false);
    setShowBillSplit(false);
    setBillSplitApplied(true);
  };

  if (showBillSplit) {
    return (
      <BillSplit members={buildBillSplitMembers()} onApply={handleBillSplitApply} onCancel={() => setShowBillSplit(false)} />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl">
      <div className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 p-2 dark:bg-gray-800">
        <button
          type="button"
          onClick={() => handleModeToggle('shared')}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
            expenseMode === 'shared'
              ? 'bg-emerald-500 text-white shadow'
              : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
          aria-pressed={expenseMode === 'shared'}
        >
          Shared expense
        </button>
        <button
          type="button"
          onClick={() => handleModeToggle('personal')}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
            expenseMode === 'personal'
              ? 'bg-emerald-500 text-white shadow'
              : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
          aria-pressed={expenseMode === 'personal'}
        >
          Personal expense
        </button>
      </div>

      <BaseExpenseFields expense={expense} onChange={updateField} />

      {expenseMode === 'shared' && (
        <SharedExpenseFields
          expense={expense}
          friendsAndGroups={friendsAndGroups}
          currentUserId={currentUserId}
          equalSplit={equalSplit}
          billSplitApplied={billSplitApplied}
          wallets={wallets}
          onShareWithChange={handleShareWithChange}
          onPayerChange={handlePayerChange}
          onWalletChange={handleWalletChange}
          onOpenBillSplit={handleOpenBillSplit}
          onFieldChange={updateField}
          toggleInclude={toggleInclude}
          onEqualToggle={handleEqualToggle}
          onPortionChange={handlePortionChange}
          onAmountChange={handleAmountChange}
        />
      )}
      {expenseMode === 'personal' && (
        <PersonalExpenseFields expense={expense} wallets={wallets} onWalletChange={handleWalletChange} />
      )}

      <div className="mt-2 flex flex-col gap-3">
        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white transition hover:bg-emerald-600"
        >
          {mode === 'edit' ? 'Update expense' : 'Save expense'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
