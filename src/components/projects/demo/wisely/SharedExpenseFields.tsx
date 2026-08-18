import { ChevronDownIcon, UserCircleIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { getFriendOweOptions } from './expenseModel';
import IconCombobox from './IconCombobox';
import type { ComboboxChangeEvent, DemoConnection, DemoWallet, ExpenseDraft } from './types';

const selectClass =
  'w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 pr-9 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 appearance-none cursor-pointer';

function ToggleSwitch({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel ?? 'Toggle'}
      className={`flex h-5 w-10 items-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
        checked ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <div
        className={`h-4 w-4 transform rounded-full bg-white shadow transition ${
          checked ? 'translate-x-5' : 'translate-x-1'
        }`}
        aria-hidden="true"
      />
    </button>
  );
}

function buildShareWithOptions(friendsAndGroups: DemoConnection[]) {
  return friendsAndGroups.map((p) => {
    const isGroup = p.type === 'group';
    return {
      value: String(p.id),
      label: p.name,
      suffix: isGroup ? '(Group)' : undefined,
      imageUrl: p.profilePicture,
      Icon: isGroup ? UserGroupIcon : UserCircleIcon,
    };
  });
}

type SharedExpenseFieldsProps = {
  expense: ExpenseDraft | null;
  friendsAndGroups?: DemoConnection[];
  currentUserId: number;
  equalSplit: boolean;
  billSplitApplied: boolean;
  wallets?: DemoWallet[];
  onShareWithChange: (e: ComboboxChangeEvent) => void;
  onPayerChange: (payerId: number) => void;
  onWalletChange: (walletId: number | null) => void;
  onOpenBillSplit: () => void;
  onFieldChange: (e: { target: { name: string; value: string } }) => void;
  toggleInclude: (index: number) => void;
  onEqualToggle: (val: boolean) => void;
  onPortionChange: (index: number, value: string) => void;
  onAmountChange: (index: number, value: string) => void;
};

export default function SharedExpenseFields({
  expense,
  friendsAndGroups = [],
  currentUserId,
  equalSplit,
  billSplitApplied,
  wallets = [],
  onShareWithChange,
  onPayerChange,
  onWalletChange,
  onOpenBillSplit,
  onFieldChange,
  toggleInclude,
  onEqualToggle,
  onPortionChange,
  onAmountChange,
}: SharedExpenseFieldsProps) {
  if (!expense) return null;

  const isPayerUser = (expense.payerId ?? currentUserId) === currentUserId;
  const walletId = expense.walletId ?? '';

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col gap-4 p-4">
        <IconCombobox
          label="Share expense with"
          ariaLabel="Share expense with"
          value={expense.shareWithId ?? ''}
          options={buildShareWithOptions(friendsAndGroups)}
          onChange={onShareWithChange}
        />

        <div className={`grid gap-4 ${isPayerUser ? 'grid-cols-1 sm:grid-cols-2' : ''}`}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Paid by</label>
            <div className="relative">
              <select
                name="payerId"
                value={expense.payerId ?? ''}
                onChange={(e) => onPayerChange(parseInt(e.target.value, 10))}
                required
                className={selectClass}
              >
                <option value={currentUserId}>You</option>
                {expense.shareWithType === 'group' &&
                  (expense.splitDetails || []).map((m, i) => (
                    <option key={i} value={m.userId}>
                      {m.name}
                    </option>
                  ))}
                {expense.shareWithType === 'friend' && expense.shareWithId && (
                  <option value={expense.shareWithId}>{expense.shareWith}</option>
                )}
              </select>
              <ChevronDownIcon
                className="pointer-events-none absolute right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                aria-hidden
              />
            </div>
          </div>
          {isPayerUser && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Wallet (optional)</label>
              <div className="relative">
                <select
                  name="walletId"
                  value={walletId === null ? '' : walletId}
                  onChange={(e) => {
                    const val = e.target.value;
                    onWalletChange(val === '' ? null : Number(val));
                  }}
                  className={selectClass}
                >
                  <option value="">No wallet</option>
                  {(wallets || []).map((w) => {
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
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={onOpenBillSplit}
            className="w-full rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Split a bill
          </button>
        </div>

        {!billSplitApplied && expense.shareWithType === 'friend' && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Who owes</label>
            <div className="relative">
              <select
                name="owes"
                value={expense.owes ?? ''}
                onChange={onFieldChange}
                required
                className={selectClass}
              >
                <option value="">Select option</option>
                {getFriendOweOptions(expense.shareWith).map((opt, idx) => (
                  <option key={idx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon
                className="pointer-events-none absolute right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                aria-hidden
              />
            </div>
          </div>
        )}

        {(billSplitApplied || expense.shareWithType === 'group') &&
          Array.isArray(expense.splitDetails) &&
          expense.splitDetails.length > 0 && (
            <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-600 dark:bg-gray-700/50">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Split between</span>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span>Equally</span>
                  <ToggleSwitch checked={equalSplit} onChange={onEqualToggle} ariaLabel="Toggle equal split" />
                </div>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white dark:bg-gray-800">
                    <th className="p-3 text-left font-semibold text-gray-700 dark:text-gray-300">Name</th>
                    <th className="p-3 text-right font-semibold text-gray-700 dark:text-gray-300">Amount ($)</th>
                    <th className="p-3 text-right font-semibold text-gray-700 dark:text-gray-300">Portion</th>
                    <th className="p-3 text-center font-semibold text-gray-700 dark:text-gray-300">Include</th>
                  </tr>
                </thead>
                <tbody>
                  {expense.splitDetails.map((m, i) => {
                    const rowDisabled = !m.include;
                    const lockInputs = equalSplit || rowDisabled;
                    return (
                      <tr
                        key={i}
                        className={`border-t border-gray-200 dark:border-gray-600 ${rowDisabled ? 'bg-gray-50 opacity-50 dark:bg-gray-700/50' : ''}`}
                      >
                        <td className="p-3 text-gray-900 dark:text-gray-100">{m.name}</td>
                        <td className="p-3 text-right">
                          <input
                            type="number"
                            value={m.amount === '' ? '' : m.amount}
                            step="0.01"
                            min="0"
                            disabled={lockInputs}
                            onChange={(e) => onAmountChange(i, e.target.value)}
                            onBlur={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!Number.isNaN(val)) onAmountChange(i, val.toFixed(2));
                            }}
                            className="w-20 rounded border border-gray-300 bg-gray-100 px-2 py-1 text-right text-gray-900 focus:ring-1 focus:ring-emerald-400 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                          />
                        </td>
                        <td className="p-3 text-right">
                          <input
                            type="number"
                            value={m.portion === '' ? '' : Number(m.portion)}
                            min="0"
                            step="1"
                            disabled={lockInputs}
                            onChange={(e) => onPortionChange(i, e.target.value)}
                            className="w-14 rounded border border-gray-300 bg-gray-100 px-2 py-1 text-right text-gray-900 focus:ring-1 focus:ring-emerald-400 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={!!m.include}
                            onChange={() => toggleInclude(i)}
                            className="h-4 w-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-400"
                          />
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="border-t border-gray-200 bg-white font-semibold dark:border-gray-600 dark:bg-gray-800">
                    <td className="p-3 text-right text-gray-700 dark:text-gray-300">Total:</td>
                    <td className="p-3 text-right text-gray-900 dark:text-gray-100">
                      $
                      {expense.splitDetails
                        .reduce((s, m) => s + (m.include ? Number(m.amount) || 0 : 0), 0)
                        .toFixed(2)}
                    </td>
                    <td className="p-3 text-right text-gray-900 dark:text-gray-100">
                      {expense.splitDetails
                        .reduce((s, m) => s + (m.include ? Number(m.portion) || 0 : 0), 0)
                        .toFixed(0)}
                    </td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  );
}
