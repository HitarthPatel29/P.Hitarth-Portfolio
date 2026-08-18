import { useEffect, useState } from 'react';
import ExpenseForm from './ExpenseForm';
import IncomeForm from './IncomeForm';
import TransferForm from './TransferForm';
import { createNewExpense } from './expenseModel';
import { useNotification } from './NotificationContext';
import type {
  DemoConnection,
  DemoWallet,
  ExpenseDraft,
  ExpenseMode,
  ExpensePayload,
  IncomePayload,
  TransferPayload,
} from './types';

const ENTRY_MODES = ['expense', 'income', 'transfer'] as const;
type EntryMode = (typeof ENTRY_MODES)[number];

type AddEntryProps = {
  userId: number;
  wallets: DemoWallet[];
  friendsAndGroups: DemoConnection[];
  onSaveExpense: (payload: ExpensePayload, mode: ExpenseMode) => void;
  onSaveIncome: (payload: IncomePayload) => void;
  onSaveTransfer: (payload: TransferPayload) => void;
};

export default function AddEntry({
  userId,
  wallets,
  friendsAndGroups,
  onSaveExpense,
  onSaveIncome,
  onSaveTransfer,
}: AddEntryProps) {
  const { showSuccess, showAlert } = useNotification();
  const [entryMode, setEntryMode] = useState<EntryMode>('expense');
  const [expense, setExpense] = useState<ExpenseDraft | null>(null);

  useEffect(() => {
    if (entryMode === 'expense') {
      if (friendsAndGroups.length > 0) {
        const current = friendsAndGroups[0];
        setExpense(
          createNewExpense(current.id, current.name, current.type, current.members || [], userId),
        );
      } else {
        void showAlert({
          title: 'No Friends or Groups found',
          message: 'No Friends or Groups found to Share Expense.',
          type: 'error',
          showCancel: false,
          confirmText: 'OK',
          onConfirm: () => setEntryMode('income'),
        });
      }
    }
  }, [friendsAndGroups, userId, entryMode, showAlert]);

  const handleSaveExpense = (payload: ExpensePayload, mode: ExpenseMode) => {
    onSaveExpense(payload, mode);
    showSuccess(
      mode === 'personal' ? 'Personal expense added successfully!' : 'Expense added successfully!',
      { asSnackbar: true },
    );
  };

  const handleSaveIncome = (payload: IncomePayload) => {
    onSaveIncome(payload);
    showSuccess('Income added successfully!', { asSnackbar: true });
  };

  const handleSaveTransfer = (payload: TransferPayload) => {
    onSaveTransfer(payload);
    showSuccess('Transfer added successfully!', { asSnackbar: true });
  };

  if (entryMode === 'expense' && !expense) {
    return (
      <div
        className="p-6 text-gray-500 dark:text-gray-400"
        role="status"
        aria-live="polite"
        aria-label="Loading expense form"
      >
        <div className="text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-500"
            aria-hidden="true"
          />
          <p className="sr-only">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-gray-100 p-2 dark:bg-gray-800">
        {ENTRY_MODES.map((m) => {
          const disabled = m === 'expense' && friendsAndGroups.length === 0 && !expense;
          return (
            <button
              key={m}
              type="button"
              onClick={() => !disabled && setEntryMode(m)}
              disabled={disabled}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                entryMode === m
                  ? 'bg-emerald-500 text-white shadow'
                  : disabled
                    ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                    : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              aria-pressed={entryMode === m}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          );
        })}
      </div>

      {entryMode === 'expense' && expense && (
        <ExpenseForm
          mode="create"
          initialData={expense}
          onSubmit={handleSaveExpense}
          currentUserId={userId}
          friendsAndGroups={friendsAndGroups}
          wallets={wallets}
          defaultMode="shared"
          onCancel={() => undefined}
        />
      )}

      {entryMode === 'income' && (
        <IncomeForm wallets={wallets} onSubmit={handleSaveIncome} onCancel={() => undefined} />
      )}

      {entryMode === 'transfer' && (
        <TransferForm wallets={wallets} onSubmit={handleSaveTransfer} onCancel={() => undefined} />
      )}
    </div>
  );
}
