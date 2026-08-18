import { useState } from 'react';
import { Lock, RotateCcw } from 'lucide-react';
import AddEntry from './wisely/AddEntry';
import PersonalExpense from './wisely/PersonalExpense';
import { NotificationProvider } from './wisely/NotificationContext';
import { DEMO_FRIENDS_AND_GROUPS, DEMO_USER_ID } from './wisely/constants';
import { useLedgerState } from './useLedgerState';

type DemoTab = 'add' | 'expenses';

export function DemoShell() {
  const [tab, setTab] = useState<DemoTab>('add');
  const ledger = useLedgerState();

  return (
    <NotificationProvider>
      <div className="dark ws-demo overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 text-gray-100 shadow-card">
        <div className="flex items-center justify-between gap-3 bg-white px-4 py-3 dark:bg-gray-800">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {tab === 'add' ? 'Add Entry' : 'Personal Expenses'}
            </p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-[0.66rem] uppercase tracking-wide text-gray-500 dark:text-gray-400">
              <Lock size={10} aria-hidden="true" />
              Demo only. Nothing is saved.
            </p>
          </div>
          <button
            type="button"
            onClick={ledger.reset}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-[0.7rem] text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <RotateCcw size={12} aria-hidden="true" />
            Reset
          </button>
        </div>

        <div className="px-4 pb-4 dark:bg-gray-800 border-b border-gray-700">
          <div className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 p-2 dark:bg-gray-900">
            {(
              [
                { value: 'add', label: 'Add Entry' },
                { value: 'expenses', label: 'Personal Expenses' },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTab(option.value)}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  tab === option.value
                    ? 'bg-emerald-500 text-white shadow'
                    : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
                aria-pressed={tab === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className={tab === 'add' ? 'p-4 sm:p-5' : 'pb-1'}>
          <div hidden={tab !== 'add'}>
            <AddEntry
              userId={DEMO_USER_ID}
              wallets={ledger.wallets}
              friendsAndGroups={DEMO_FRIENDS_AND_GROUPS}
              onSaveExpense={(payload, mode) => {
                ledger.addExpense(payload, mode);
                setTab('expenses');
              }}
              onSaveIncome={(payload) => {
                ledger.addIncome(payload);
                setTab('expenses');
              }}
              onSaveTransfer={(payload) => {
                ledger.addTransfer(payload);
                setTab('expenses');
              }}
            />
          </div>

          <div hidden={tab !== 'expenses'}>
            <PersonalExpense
              wallets={ledger.wallets}
              userId={DEMO_USER_ID}
              onAddEntry={() => setTab('add')}
              onAddWallet={ledger.addWallet}
              onEditWallet={ledger.editWallet}
              onDeleteWallet={ledger.deleteWallet}
              onWalletsReorder={ledger.reorderWallets}
            />
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
}
