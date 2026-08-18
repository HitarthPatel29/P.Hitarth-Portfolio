import { useEffect, useState } from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import FilterModal, { type AppliedFilters } from './FilterModal';
import AddWallet from './AddWallet';
import { AlertModal } from './AlertModal';
import WalletCarousel from './WalletCarousel';
import ExpensesGroupByDate, { type GroupedExpenseItem } from './ExpensesGroupByDate';
import PrimaryButton from './PrimaryButton';
import { useNotification } from './NotificationContext';
import { DEMO_FILTER_GROUPS, DEMO_USER_ID } from './constants';
import { getWalletId } from './walletOrderStorage';
import type { DemoWallet, WalletFormData, WalletLedgerEntry } from './types';
import type { ExpenseCardType } from './ExpenseItemCard';

type PersonalExpenseProps = {
  wallets: DemoWallet[];
  userId?: number;
  onAddEntry: () => void;
  onAddWallet: (data: WalletFormData) => void;
  onEditWallet: (walletId: number, data: WalletFormData) => void;
  onDeleteWallet: (walletId: number) => void;
  onWalletsReorder: (wallets: DemoWallet[]) => void;
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function PersonalExpense({
  wallets,
  userId = DEMO_USER_ID,
  onAddEntry,
  onAddWallet,
  onEditWallet,
  onDeleteWallet,
  onWalletsReorder,
}: PersonalExpenseProps) {
  const { showInfo } = useNotification();
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [editWallet, setEditWallet] = useState<DemoWallet | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [walletToDelete, setWalletToDelete] = useState<DemoWallet | null>(null);
  const [activeWalletIndex, setActiveWalletIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [groupFilter, setGroupFilter] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [monthFilter, setMonthFilter] = useState('');
  const [displayStartDate, setDisplayStartDate] = useState('');
  const [displayEndDate, setDisplayEndDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState<WalletLedgerEntry[]>([]);

  useEffect(() => {
    setActiveWalletIndex((i) => Math.min(i, Math.max(0, wallets.length - 1)));
  }, [wallets.length]);

  useEffect(() => {
    const currentWallet = wallets[activeWalletIndex];
    const source =
      currentWallet && Array.isArray(currentWallet.expenses) ? currentWallet.expenses : [];
    let list = [...source];

    if (displayStartDate && displayEndDate) {
      list = list.filter((e) => e.date >= displayStartDate && e.date <= displayEndDate);
    }
    if (search.trim() !== '') {
      list = list.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (typeFilter.length > 0) {
      list = list.filter((e) => typeFilter.includes(e.category ?? ''));
    }
    if (categoryFilter.length > 0) {
      list = list.filter((e) => {
        const kind = e.entryKind || 'expense';
        const isIncome = kind === 'income';
        const isTransfer = kind === 'transfer';
        const isPersonalExpense = e.isPersonal && !e.isSettleUp && !isIncome && !isTransfer;
        const isSharedExpense = !e.isPersonal && !e.isSettleUp;
        const isSettlement = !!e.isSettleUp;
        return (
          (categoryFilter.includes('personal') && isPersonalExpense) ||
          (categoryFilter.includes('shared') && isSharedExpense) ||
          (categoryFilter.includes('settlements') && isSettlement) ||
          (categoryFilter.includes('income') && isIncome) ||
          (categoryFilter.includes('transfer') && isTransfer)
        );
      });
    }
    if (groupFilter) {
      list = list.filter((e) => String(e.groupId) === String(groupFilter));
    }
    if (monthFilter) {
      list = list.filter((e) => MONTH_NAMES[new Date(e.date).getMonth()] === monthFilter);
    }
    list.sort((a, b) =>
      sort === 'newest'
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    setFilteredExpenses(list);
  }, [
    wallets,
    activeWalletIndex,
    search,
    typeFilter,
    categoryFilter,
    groupFilter,
    sort,
    monthFilter,
    displayStartDate,
    displayEndDate,
  ]);

  useEffect(() => {
    const now = new Date();
    const end = now.toLocaleDateString('en-CA');
    const monthAgo = new Date(now);
    monthAgo.setMonth(now.getMonth() - 1);
    setStartDate(monthAgo.toLocaleDateString('en-CA'));
    setEndDate(end);
  }, []);

  const handleApplyFilters = (f: AppliedFilters) => {
    setTypeFilter(f.typeFilter);
    setCategoryFilter(f.categoryFilter || []);
    setGroupFilter(f.groupFilter);
    setSort(f.sort);
    setMonthFilter(f.month);
    if (f.startDate && f.endDate) {
      setDisplayStartDate(f.startDate);
      setDisplayEndDate(f.endDate);
    } else if (!f.startDate && !f.endDate) {
      setDisplayStartDate('');
      setDisplayEndDate('');
    }
    setShowFilter(false);
  };

  const handleAddWallet = (data: WalletFormData) => {
    onAddWallet(data);
    setActiveWalletIndex(wallets.length);
  };

  const handleEditWallet = (targetWalletId: number, data: WalletFormData) => {
    onEditWallet(targetWalletId, data);
    setEditWallet(null);
    setShowAddWallet(false);
  };

  const handleDeleteWallet = () => {
    if (!walletToDelete) return;
    const deletedId = getWalletId(walletToDelete);
    if (deletedId == null) return;
    const deletedIndex = wallets.findIndex((w) => getWalletId(w) === deletedId);
    onDeleteWallet(deletedId);
    setActiveWalletIndex((i) => {
      const nextLength = wallets.length - 1;
      if (nextLength <= 0) return 0;
      if (deletedIndex === -1) return Math.min(i, nextLength - 1);
      if (i > deletedIndex) return i - 1;
      if (i === deletedIndex) return Math.min(i, nextLength - 1);
      return i;
    });
    setShowDeleteModal(false);
    setWalletToDelete(null);
  };

  const grouped = filteredExpenses.reduce<Record<string, GroupedExpenseItem[]>>((acc, e) => {
    const dateKey = e.date || 'unknown';
    if (!acc[dateKey]) acc[dateKey] = [];

    const entryKind = e.entryKind || 'expense';
    let cardType: ExpenseCardType;
    if (entryKind === 'income') cardType = 'income';
    else if (entryKind === 'transfer' || e.type === 'transfer_in' || e.type === 'transfer_out') cardType = 'transfer';
    else if (e.isSettleUp) cardType = 'settle';
    else if (e.isPersonal) cardType = 'personal';
    else cardType = 'shared';

    const userShare =
      cardType === 'shared'
        ? Number(e.splitDetails?.find((s) => Number(s.userId) === Number(userId))?.amount ?? 0)
        : 0;
    const userBalance = cardType === 'shared' ? Math.abs((e.totalAmount ?? 0) - userShare) : 0;

    let subtitle: string;
    if (entryKind === 'income') subtitle = `Income · ${e.category ?? ''}`;
    else if (entryKind === 'transfer') subtitle = e.type === 'transfer_in' ? 'Transfer In' : 'Transfer Out';
    else if (e.isPersonal) subtitle = `Category: ${e.category ?? ''}`;
    else subtitle = `Category: ${e.category ?? ''}${e.groupId != null && e.groupName ? `, Group: ${e.groupName}` : ''}`;

    acc[dateKey].push({
      expenseId: e.expenseId,
      title: e.title,
      subtitle,
      amount: Math.abs(e.totalAmount ?? 0).toFixed(2),
      userBalance: cardType === 'shared' ? userBalance.toFixed(2) : undefined,
      cardType,
      highlight: e.isSettleUp || !!e.highlight,
      onClick: () =>
        showInfo('Opening entry details is not available in this demo.', { asSnackbar: true }),
    });
    return acc;
  }, {});

  const dateKeys = Object.keys(grouped);

  return (
    <div className="flex min-h-0 flex-col">
      <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-4">
        <WalletCarousel
          wallets={wallets}
          loading={false}
          userId={userId}
          activeWalletIndex={activeWalletIndex}
          onActiveWalletChange={setActiveWalletIndex}
          onWalletsReorder={onWalletsReorder}
          onEdit={(w) => {
            setEditWallet(w);
            setShowAddWallet(true);
          }}
          onDelete={(w) => {
            setWalletToDelete(w);
            setShowDeleteModal(true);
          }}
          emptyMessage="No wallets yet. Add one using the button below."
          className="mb-2 h-[25vh] min-h-[150px] flex-shrink-0"
        />

        <section className="flex min-h-0 flex-1 flex-col">
          <div className="mb-4 flex flex-shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            <input
              type="text"
              placeholder="Search entries..."
              className="w-full min-w-0 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 sm:flex-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex gap-2 sm:flex-shrink-0 sm:gap-3">
              <button
                type="button"
                onClick={() => setShowFilter(true)}
                className="flex flex-1 items-center justify-center rounded-xl border border-emerald-700 bg-emerald-200 p-2.5 hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 dark:border-gray-600 dark:bg-emerald-200 dark:hover:bg-emerald-300 sm:flex-none"
                aria-label="Open filters"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5 text-emerald-700" />
              </button>
              <PrimaryButton
                label="Import CSV"
                onClick={() =>
                  showInfo('CSV import is not available in this demo.', { asSnackbar: true })
                }
                color="blue"
                className="flex-1 whitespace-nowrap sm:flex-none"
                ariaLabel="Import entries from a CSV file"
              />
              <PrimaryButton
                label="Add Entry"
                onClick={onAddEntry}
                className="flex-1 whitespace-nowrap sm:flex-none"
                ariaLabel="Add a new entry"
              />
              <PrimaryButton
                label="Add Wallet/Card"
                onClick={() => setShowAddWallet(true)}
                className="flex-1 whitespace-nowrap sm:flex-none"
                ariaLabel="Add wallet, card, or account"
              />
            </div>
          </div>

          <div className="flex max-h-[28rem] min-h-[120px] flex-1 flex-col gap-5 overflow-y-auto pb-8">
            {dateKeys.length === 0 ? (
              <p className="py-8 text-center text-gray-500 dark:text-gray-400">
                No entries found for this wallet.
              </p>
            ) : (
              dateKeys.map((dateKey) => (
                <ExpensesGroupByDate key={dateKey} date={dateKey} expenses={grouped[dateKey]} />
              ))
            )}
          </div>
        </section>
      </div>

      <FilterModal
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={handleApplyFilters}
        groups={DEMO_FILTER_GROUPS}
        initialFilters={{
          typeFilter,
          categoryFilter,
          groupFilter,
          sort,
          startDate: displayStartDate || startDate,
          endDate: displayEndDate || endDate,
          month: monthFilter,
        }}
      />

      <AddWallet
        isOpen={showAddWallet}
        onClose={() => {
          setShowAddWallet(false);
          setEditWallet(null);
        }}
        onAdd={handleAddWallet}
        editWallet={editWallet}
        onEdit={handleEditWallet}
      />

      <AlertModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setWalletToDelete(null);
        }}
        title="Delete Wallet"
        message={
          walletToDelete
            ? `Are you sure you want to delete "${walletToDelete.walletName}"? This cannot be undone.`
            : ''
        }
        type="warning"
        confirmText="Confirm Delete"
        showCancel
        cancelText="Cancel"
        onConfirm={handleDeleteWallet}
      />
    </div>
  );
}
