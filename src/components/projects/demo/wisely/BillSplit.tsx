import { useMemo, useState } from 'react';
import { useNotification } from './NotificationContext';
import type { DemoMember, SplitDetail } from './types';

type BillSplitProps = {
  members: DemoMember[];
  onApply: (splitDetails: SplitDetail[], totalAmount: number) => void;
  onCancel: () => void;
};

export default function BillSplit({ members, onApply, onCancel }: BillSplitProps) {
  const { showError } = useNotification();
  const [itemPrice, setItemPrice] = useState('');
  const [taxIncluded, setTaxIncluded] = useState(true);
  const [selectedIds, setSelectedIds] = useState(() => members.map((m) => m.userId));
  const [totals, setTotals] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    members.forEach((m) => {
      initial[m.userId] = 0;
    });
    return initial;
  });

  const handleToggleMember = (userId: number) => {
    setSelectedIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
  };

  const handleAddItem = () => {
    const price = parseFloat(itemPrice);
    if (Number.isNaN(price) || price <= 0) {
      showError('Please enter a valid item price greater than 0.', { asSnackbar: true });
      return;
    }
    if (!selectedIds.length) {
      showError('Please select at least one participant for this item.', { asSnackbar: true });
      return;
    }

    const taxRate = taxIncluded ? 0.13 : 0;
    const itemTotal = price * (1 + taxRate);
    const perPersonRaw = itemTotal / selectedIds.length;

    setTotals((prev) => {
      const next = { ...prev };
      selectedIds.forEach((userId) => {
        next[userId] = Number(((next[userId] || 0) + perPersonRaw).toFixed(2));
      });
      return next;
    });

    setItemPrice('');
  };

  const overallTotal = useMemo(
    () => Object.values(totals).reduce((sum, value) => sum + (value || 0), 0),
    [totals],
  );

  const handleDone = () => {
    const activeMembers = members.filter((m) => (totals[m.userId] || 0) > 0);
    if (!activeMembers.length) {
      showError('Please add at least one item before finishing.', { asSnackbar: true });
      return;
    }

    const splitDetails: SplitDetail[] = activeMembers.map((m) => ({
      userId: m.userId,
      name: m.name,
      amount: Number((totals[m.userId] || 0).toFixed(2)),
      portion: 1,
      include: true,
    }));

    const totalAmount = splitDetails.reduce((sum, m) => sum + Number(m.amount), 0);
    onApply(splitDetails, totalAmount);
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Item Price</label>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300">$</span>
          <input
            type="number"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            step="0.01"
            min="0"
            placeholder="0.00"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tax</span>
        <div className="inline-flex overflow-hidden rounded-xl border border-gray-300">
          <button
            type="button"
            onClick={() => setTaxIncluded(true)}
            className={`px-3 py-1 text-sm font-medium ${
              taxIncluded ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200'
            }`}
          >
            Tax (13%)
          </button>
          <button
            type="button"
            onClick={() => setTaxIncluded(false)}
            className={`border-l border-gray-300 px-3 py-1 text-sm font-medium ${
              !taxIncluded ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200'
            }`}
          >
            No Tax
          </button>
        </div>
      </div>

      <div>
        <p className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Participants for this item</p>
        <div className="space-y-1">
          {members.map((m) => {
            const checked = selectedIds.includes(m.userId);
            return (
              <label
                key={m.userId}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleToggleMember(m.userId)}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-400"
                  />
                  <span className="text-sm text-gray-800 dark:text-gray-100">{m.name}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={handleAddItem}
          className="w-full rounded-xl bg-emerald-500 py-2 font-semibold text-white transition hover:bg-emerald-600"
        >
          Add This Item To Bill
        </button>
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
        <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-100">Current Totals</h3>
        {Object.values(totals).every((v) => !v) ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No items added yet. Add at least one item to see the split.</p>
        ) : (
          <div className="space-y-1">
            {members.map((m) => {
              const amount = totals[m.userId] || 0;
              if (!amount) return null;
              return (
                <div key={m.userId} className="flex justify-between text-sm text-gray-800 dark:text-gray-100">
                  <span>{m.name}</span>
                  <span>${amount.toFixed(2)}</span>
                </div>
              );
            })}
            <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 text-sm font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-50">
              <span>Total Bill</span>
              <span>${overallTotal.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleDone}
          className="w-full rounded-xl bg-emerald-500 py-2 font-semibold text-white transition hover:bg-emerald-600"
        >
          Done – Use This Split
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-xl border border-gray-300 py-2 font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
