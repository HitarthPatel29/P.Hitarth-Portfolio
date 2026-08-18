import { ChevronDownIcon } from '@heroicons/react/24/solid';
import type { DemoWallet, ExpenseDraft } from './types';

const selectClass =
  'w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 pr-9 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 appearance-none cursor-pointer';

type PersonalExpenseFieldsProps = {
  expense: ExpenseDraft | null;
  wallets?: DemoWallet[];
  onWalletChange: (walletId: number | null) => void;
};

export default function PersonalExpenseFields({
  expense,
  wallets = [],
  onWalletChange,
}: PersonalExpenseFieldsProps) {
  const walletId = expense?.walletId ?? '';
  const hasWallets = Array.isArray(wallets) && wallets.length > 0;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col gap-4 p-4">
        {hasWallets ? (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Select wallet</label>
            <div className="relative">
              <select
                name="walletId"
                value={walletId === null ? '' : walletId}
                onChange={(e) => {
                  const val = e.target.value;
                  onWalletChange(val === '' ? null : Number(val) || Number(val));
                }}
                required
                className={selectClass}
                aria-required="true"
              >
                <option value="">Choose a wallet...</option>
                {wallets.map((w) => {
                  const id = w.walletId ?? w.id;
                  const name = w.walletName ?? w.name ?? `Wallet ${id}`;
                  return (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  );
                })}
              </select>
              <ChevronDownIcon
                className="pointer-events-none absolute right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                aria-hidden
              />
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-gray-100 px-3 py-3 text-sm text-gray-600 dark:bg-gray-700/50 dark:text-gray-400">
            You don&apos;t have any wallets yet. This expense will be saved without a wallet.
          </div>
        )}
      </div>
    </div>
  );
}
