import type {
  DemoMember,
  DemoWallet,
  ExpenseDraft,
  ExpenseMode,
  ExpensePayload,
} from './types';

export const defaultExpense: ExpenseDraft = {
  id: null,
  title: '',
  amount: 0,
  date: '',
  category: '',
  payerId: null,
  owes: '',
  shareWithId: null,
  shareWith: '',
  shareWithType: 'friend',
  splitDetails: [],
  userId: null,
  walletId: null,
  toWalletId: null,
  paymentId: null,
  isSettleUp: false,
  entryKind: 'expense',
};

function toNumber(value: unknown): number {
  const n = typeof value === 'number' ? value : parseFloat(String(value ?? ''));
  return Number.isFinite(n) ? n : 0;
}

export const createNewExpense = (
  shareWithId: number,
  shareWith: string,
  type: string = 'friend',
  members: DemoMember[] = [],
  currentUserId?: number,
): ExpenseDraft => {
  const expense: ExpenseDraft = {
    ...defaultExpense,
    shareWithId,
    shareWith,
    shareWithType: type.toLowerCase() === 'group' ? 'group' : 'friend',
    payerId: currentUserId ?? null,
    splitDetails: [],
  };

  if (expense.shareWithType === 'group') {
    expense.splitDetails = members.map((m) => ({
      userId: m.userId,
      name: m.name,
      amount: 0,
      portion: 1,
      include: true,
    }));
  }

  return expense;
};

export const createNewPersonalExpense = (
  currentUserId: number,
  entryKind: ExpenseDraft['entryKind'] = 'expense',
): ExpenseDraft => ({
  ...defaultExpense,
  userId: currentUserId || null,
  walletId: null,
  toWalletId: null,
  entryKind,
  title: '',
  amount: 0,
  date: '',
  category: '',
});

export const validateExpense = (
  expense: ExpenseDraft,
  currentUserId: number,
  billSplitApplied: boolean,
  mode: ExpenseMode = 'shared',
  wallets: DemoWallet[] = [],
): string | null => {
  if (!expense.title) return 'Expense title is required.';
  if (!expense.date) return 'Date is required.';
  if (!expense.amount || toNumber(expense.amount) <= 0) {
    if (!expense.totalAmount || toNumber(expense.totalAmount) <= 0) return 'Enter a valid amount.';
  }
  if (!expense.category) return 'Please select an expense type.';

  if (mode === 'personal') {
    if (!expense.userId) return 'User is required for personal expense.';
    if (Array.isArray(wallets) && wallets.length > 0 && (expense.walletId == null || expense.walletId === '')) {
      return 'Please select a wallet for this entry.';
    }
    if (expense.entryKind === 'transfer') {
      if (expense.toWalletId == null || expense.toWalletId === '') {
        return 'Please select a destination wallet for the transfer.';
      }
      if (String(expense.walletId) === String(expense.toWalletId)) {
        return 'Source and destination wallets must be different.';
      }
    }
    return null;
  }

  if (!expense.shareWith) return 'Please select who to share expense with.';
  if (!expense.payerId) return 'Please select who paid.';

  if (!billSplitApplied && expense.shareWithType === 'friend') {
    if (expense.owes === '' && expense.splitDetails.length === 0)
      return 'Please specify who owes the amount.';

    if (expense.owes === 'You owe full amount' && expense.payerId === currentUserId)
      return 'You cannot create an expense where you owe yourself the full amount.';

    if (
      expense.owes === `${expense.shareWith} owes full amount` &&
      expense.payerId === expense.shareWithId
    )
      return `${expense.shareWith} cannot owe themselves the full amount.`;
  }

  if (expense.shareWithType === 'group' && (!expense.splitDetails || expense.splitDetails.length === 0))
    return 'Please include at least one member in the split.';

  if (billSplitApplied || expense.shareWithType === 'group') {
    const includedMembers = expense.splitDetails.filter((m) => m.include);
    if (includedMembers.length === 1 && includedMembers[0].userId === expense.payerId) {
      const payerName = includedMembers[0].name || 'Payer';
      return `The expense cannot be payed by and shared by only ${payerName}. Please include at least one more member to share the Expense.`;
    }
  }

  return null;
};

export const normalizeExpenseForAPI = (
  expense: ExpenseDraft,
  currentUserId: number,
  billSplitApplied: boolean,
  mode: ExpenseMode = 'shared',
): ExpensePayload => {
  const amount = toNumber(expense.amount);

  if (mode === 'personal') {
    return {
      title: expense.title || '',
      amount: toNumber(expense.totalAmount || expense.amount),
      date: expense.date || '',
      category: expense.category || '',
      payerId: expense.userId ?? currentUserId ?? expense.payerId,
      walletId: expense.walletId ?? null,
      toWalletId: expense.entryKind === 'transfer' ? (expense.toWalletId ?? null) : null,
      isPersonal: true,
      entryKind: expense.entryKind || 'expense',
      predictedCategory: expense.predictedCategory ?? null,
    };
  }

  const clean: ExpenseDraft = {
    ...expense,
    amount,
    splitDetails: expense.splitDetails || [],
  };

  if (billSplitApplied || clean.shareWithType === 'group') {
    clean.splitDetails = (expense.splitDetails || []).map((m) => ({
      ...m,
      amount: toNumber(m.amount),
      portion: parseInt(String(m.portion || 1), 10),
      include: m.include !== false,
    }));
  }

  if (!billSplitApplied && clean.shareWithType === 'friend') {
    const total = toNumber(clean.amount);
    const half = parseFloat((total / 2).toFixed(2));
    const friendId = clean.shareWithId;
    const friendName = clean.shareWith;

    if (clean.owes === `You and ${friendName} split equally`) {
      clean.splitDetails = [
        { userId: currentUserId, name: 'You', amount: half, portion: 1, include: true },
        { userId: friendId ?? 0, name: friendName, amount: half, portion: 1, include: true },
      ];
    } else if (clean.owes === 'You owe full amount') {
      clean.splitDetails = [
        { userId: currentUserId, name: 'You', amount: total, portion: 1, include: true },
      ];
    } else if (clean.owes === `${friendName} owes full amount`) {
      clean.splitDetails = [
        { userId: friendId ?? 0, name: friendName, amount: total, portion: 1, include: true },
      ];
    } else {
      clean.splitDetails = [
        { userId: currentUserId, name: 'You', amount: half, portion: 1, include: true },
        { userId: friendId ?? 0, name: friendName, amount: half, portion: 1, include: true },
      ];
    }
  }

  return {
    title: clean.title || '',
    amount: toNumber(clean.amount),
    date: clean.date || '',
    category: clean.category || '',
    payerId: clean.payerId ?? currentUserId,
    shareWithId: clean.shareWithId,
    shareWithType: clean.shareWithType || 'friend',
    splitDetails: clean.splitDetails,
    isSettleUp: !!clean.isSettleUp,
    paymentId: clean.paymentId ?? null,
    walletId: clean.walletId ?? null,
    isPersonal: false,
    predictedCategory: clean.predictedCategory ?? null,
  };
};

export const getFriendOweOptions = (friendName = 'Friend') => [
  { label: 'You owe full amount', value: 'You owe full amount' },
  { label: `${friendName} owes full amount`, value: `${friendName} owes full amount` },
  { label: `You and ${friendName} split equally`, value: `You and ${friendName} split equally` },
];

export function userShareFromPayload(payload: ExpensePayload, currentUserId: number): number {
  if (payload.isPersonal) return payload.amount;
  const details = payload.splitDetails ?? [];
  const mine = details.find((m) => m.userId === currentUserId);
  if (mine) return toNumber(mine.amount);
  return payload.amount;
}

export function cloneExpense(obj: ExpenseDraft): ExpenseDraft {
  return JSON.parse(JSON.stringify(obj)) as ExpenseDraft;
}
