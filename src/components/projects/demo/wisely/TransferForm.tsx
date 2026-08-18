import { useEffect, useState, type FormEvent } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useNotification } from './NotificationContext';
import type { DemoWallet, TransferPayload } from './types';

const inputClass =
  'w-full appearance-none border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400';
const selectClass =
  'w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 pr-9 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 appearance-none cursor-pointer';

type TransferFormProps = {
  wallets?: DemoWallet[];
  onSubmit: (payload: TransferPayload) => void;
  onCancel?: () => void;
};

export default function TransferForm({ wallets = [], onSubmit, onCancel }: TransferFormProps) {
  const { showError } = useNotification();
  const [transfer, setTransfer] = useState({
    title: '',
    amount: '',
    date: '',
    fromWalletId: null as number | null,
    toWalletId: null as number | null,
  });

  useEffect(() => {
    if (!transfer.date) {
      const today = new Date().toLocaleDateString('en-CA');
      setTransfer((prev) => ({ ...prev, date: today }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateField = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setTransfer((prev) => ({ ...prev, [name]: value }));
  };

  const handleWalletSelect = (field: 'fromWalletId' | 'toWalletId') => (e: { target: { value: string } }) => {
    const val = e.target.value;
    setTransfer((prev) => ({ ...prev, [field]: val === '' ? null : Number(val) }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (transfer.fromWalletId != null && transfer.fromWalletId === transfer.toWalletId) {
      showError('From and To wallets must be different.', { asSnackbar: true });
      return;
    }
    onSubmit({
      ...transfer,
      amount: parseFloat(transfer.amount) || 0,
    });
  };

  const hasWallets = Array.isArray(wallets) && wallets.length >= 2;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col gap-4 p-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Transfer title</label>
            <input
              type="text"
              name="title"
              value={transfer.title}
              onChange={updateField}
              required
              placeholder="e.g. Move savings"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">$</span>
                <input
                  type="number"
                  name="amount"
                  value={transfer.amount}
                  onChange={updateField}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
              <input
                type="date"
                name="date"
                value={transfer.date}
                onChange={updateField}
                required
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col gap-4 p-4">
          {hasWallets ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">From wallet</label>
                <div className="relative">
                  <select
                    name="fromWalletId"
                    value={transfer.fromWalletId === null ? '' : transfer.fromWalletId}
                    onChange={handleWalletSelect('fromWalletId')}
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
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">To wallet</label>
                <div className="relative">
                  <select
                    name="toWalletId"
                    value={transfer.toWalletId === null ? '' : transfer.toWalletId}
                    onChange={handleWalletSelect('toWalletId')}
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
            </div>
          ) : (
            <div className="rounded-lg bg-gray-100 px-3 py-3 text-sm text-gray-600 dark:bg-gray-700/50 dark:text-gray-400">
              You need at least two wallets to make a transfer.
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-3">
        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white transition hover:bg-emerald-600"
        >
          Save transfer
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
