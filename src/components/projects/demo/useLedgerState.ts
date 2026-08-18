import { useCallback, useMemo, useReducer, useRef } from 'react';
import { DEMO_FRIENDS_AND_GROUPS, DEMO_USER_ID, DEMO_WALLETS } from './wisely/constants';
import { userShareFromPayload } from './wisely/expenseModel';
import type {
  DemoWallet,
  ExpenseMode,
  ExpensePayload,
  IncomePayload,
  LedgerEntry,
  TransferPayload,
  WalletFormData,
  WalletLedgerEntry,
} from './wisely/types';

function toWalletId(value: number | string | null | undefined): number | null {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function withBalance(wallet: DemoWallet, balance: number): DemoWallet {
  return { ...wallet, balance, walletBalance: balance };
}

const seedEntries: LedgerEntry[] = [
  {
    id: 'seed-1',
    expenseId: 'seed-1',
    entryKind: 'income',
    title: 'Freelance Payment',
    date: '2026-08-12',
    category: 'Freelance',
    totalAmount: 450,
    isPersonal: true,
    isSettleUp: false,
    userContribution: 450,
    walletId: 1,
    payerId: DEMO_USER_ID,
  },
  {
    id: 'seed-2',
    expenseId: 'seed-2',
    entryKind: 'expense',
    title: 'Grocery Store',
    date: '2026-08-10',
    category: 'Food & Dining',
    totalAmount: 54.2,
    isPersonal: true,
    isSettleUp: false,
    userContribution: 54.2,
    walletId: 1,
    payerId: DEMO_USER_ID,
  },
  {
    id: 'seed-3',
    expenseId: 'seed-3',
    entryKind: 'expense',
    title: 'Rent',
    date: '2026-08-01',
    category: 'Housing',
    totalAmount: 1200,
    isPersonal: true,
    isSettleUp: false,
    userContribution: 1200,
    walletId: 1,
    payerId: DEMO_USER_ID,
  },
  {
    id: 'seed-4',
    expenseId: 'seed-4',
    entryKind: 'transfer',
    title: 'Transfer to Savings',
    date: '2026-07-30',
    category: 'Transfer',
    totalAmount: 500,
    isPersonal: true,
    isSettleUp: false,
    userContribution: 0,
    walletId: 1,
    toWalletId: 2,
    payerId: DEMO_USER_ID,
  },
  {
    id: 'seed-5',
    expenseId: 'seed-5',
    entryKind: 'expense',
    title: 'Coffee Shop',
    date: '2026-07-29',
    category: 'Food & Dining',
    totalAmount: 6.75,
    isPersonal: true,
    isSettleUp: false,
    userContribution: 6.75,
    walletId: 3,
    payerId: DEMO_USER_ID,
  },
  {
    id: 'seed-6',
    expenseId: 'seed-6',
    entryKind: 'expense',
    title: 'Dinner with Alex',
    date: '2026-08-08',
    category: 'Food & Dining',
    totalAmount: 86,
    isPersonal: false,
    isSettleUp: false,
    userContribution: 43,
    walletId: 1,
    payerId: DEMO_USER_ID,
    splitDetails: [
      { userId: DEMO_USER_ID, name: 'You', amount: 43, portion: 1, include: true },
      { userId: 2, name: 'Alex Chen', amount: 43, portion: 1, include: true },
    ],
  },
  {
    id: 'seed-7',
    expenseId: 'seed-7',
    entryKind: 'expense',
    title: 'Internet Bill',
    date: '2026-08-05',
    category: 'Utilities',
    totalAmount: 90,
    isPersonal: false,
    isSettleUp: false,
    userContribution: 30,
    walletId: 1,
    payerId: DEMO_USER_ID,
    groupId: 4,
    groupName: 'Apartment',
    splitDetails: [
      { userId: DEMO_USER_ID, name: 'You', amount: 30, portion: 1, include: true },
      { userId: 2, name: 'Alex Chen', amount: 30, portion: 1, include: true },
      { userId: 3, name: 'Sam Rivera', amount: 30, portion: 1, include: true },
    ],
  },
];

type State = {
  wallets: DemoWallet[];
  entries: LedgerEntry[];
};

type Action =
  | { kind: 'add'; entry: LedgerEntry }
  | { kind: 'addWallet'; wallet: DemoWallet }
  | { kind: 'editWallet'; id: number; data: WalletFormData }
  | { kind: 'deleteWallet'; id: number }
  | { kind: 'reorderWallets'; wallets: DemoWallet[] }
  | { kind: 'reset' };

function applyToBalances(wallets: DemoWallet[], entry: LedgerEntry): DemoWallet[] {
  return wallets.map((wallet) => {
    if (entry.entryKind === 'transfer') {
      if (wallet.id === entry.walletId) return withBalance(wallet, wallet.balance - entry.totalAmount);
      if (wallet.id === entry.toWalletId) return withBalance(wallet, wallet.balance + entry.totalAmount);
      return wallet;
    }
    if (entry.walletId == null || wallet.id !== entry.walletId) return wallet;
    const delta = entry.entryKind === 'income' ? entry.totalAmount : -entry.totalAmount;
    return withBalance(wallet, wallet.balance + delta);
  });
}

function stripExpenses(wallet: DemoWallet): DemoWallet {
  const { expenses: _expenses, ...rest } = wallet;
  return rest;
}

function reducer(state: State, action: Action): State {
  switch (action.kind) {
    case 'add':
      return {
        wallets: applyToBalances(state.wallets, action.entry),
        entries: [action.entry, ...state.entries],
      };
    case 'addWallet':
      return { ...state, wallets: [...state.wallets, action.wallet] };
    case 'editWallet':
      return {
        ...state,
        wallets: state.wallets.map((wallet) => {
          if (wallet.id !== action.id && wallet.walletId !== action.id) return wallet;
          const nextBalance = action.data.initialBalance ?? action.data.walletBalance ?? wallet.balance;
          return withBalance(
            {
              ...wallet,
              name: action.data.walletName,
              walletName: action.data.walletName,
              cardName: action.data.cardName,
              walletColor: action.data.walletColor,
            },
            nextBalance,
          );
        }),
      };
    case 'deleteWallet':
      return {
        ...state,
        wallets: state.wallets.filter((wallet) => wallet.id !== action.id && wallet.walletId !== action.id),
      };
    case 'reorderWallets':
      return { ...state, wallets: action.wallets.map(stripExpenses) };
    case 'reset':
      return initialState();
  }
}

function initialState(): State {
  return {
    wallets: DEMO_WALLETS.map((w) => ({ ...w })),
    entries: seedEntries.map((e) => ({ ...e })),
  };
}

function newId() {
  return `entry-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function attachExpensesToWallets(wallets: DemoWallet[], entries: LedgerEntry[]): DemoWallet[] {
  return wallets.map((wallet) => {
    const expenses: WalletLedgerEntry[] = [];
    for (const entry of entries) {
      if (entry.entryKind === 'transfer') {
        if (wallet.id === entry.walletId) {
          expenses.push({ ...entry, expenseId: entry.id, type: 'transfer_out' });
        }
        if (wallet.id === entry.toWalletId) {
          expenses.push({ ...entry, expenseId: `${entry.id}-in`, type: 'transfer_in' });
        }
      } else if (entry.walletId === wallet.id) {
        expenses.push({ ...entry, expenseId: entry.id });
      }
    }
    return { ...wallet, walletBalance: wallet.balance, expenses };
  });
}

export function useLedgerState() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const nextWalletId = useRef(Math.max(0, ...DEMO_WALLETS.map((w) => w.id)) + 1);

  const addExpense = useCallback((payload: ExpensePayload, mode: ExpenseMode) => {
    const amount = payload.amount;
    const walletId = toWalletId(payload.walletId);
    const contribution = userShareFromPayload(payload, DEMO_USER_ID);
    const isGroup = payload.shareWithType === 'group';
    const group = isGroup ? DEMO_FRIENDS_AND_GROUPS.find((c) => c.id === payload.shareWithId) : undefined;
    const id = newId();
    dispatch({
      kind: 'add',
      entry: {
        id,
        expenseId: id,
        entryKind: 'expense',
        title: payload.title,
        date: payload.date,
        category: payload.category,
        totalAmount: amount,
        isPersonal: mode === 'personal' || !!payload.isPersonal,
        isSettleUp: !!payload.isSettleUp,
        userContribution: contribution,
        walletId: payload.payerId === DEMO_USER_ID || mode === 'personal' ? walletId : null,
        payerId: payload.payerId ?? DEMO_USER_ID,
        splitDetails: payload.splitDetails,
        groupId: isGroup ? (payload.shareWithId ?? null) : null,
        groupName: group?.name,
      },
    });
  }, []);

  const addIncome = useCallback((payload: IncomePayload) => {
    const id = newId();
    dispatch({
      kind: 'add',
      entry: {
        id,
        expenseId: id,
        entryKind: 'income',
        title: payload.title,
        date: payload.date,
        category: payload.category,
        totalAmount: payload.amount,
        isPersonal: true,
        isSettleUp: false,
        userContribution: payload.amount,
        walletId: toWalletId(payload.walletId),
        payerId: DEMO_USER_ID,
      },
    });
  }, []);

  const addTransfer = useCallback((payload: TransferPayload) => {
    const id = newId();
    dispatch({
      kind: 'add',
      entry: {
        id,
        expenseId: id,
        entryKind: 'transfer',
        title: payload.title,
        date: payload.date,
        category: 'Transfer',
        totalAmount: payload.amount,
        isPersonal: true,
        isSettleUp: false,
        userContribution: 0,
        walletId: toWalletId(payload.fromWalletId),
        toWalletId: toWalletId(payload.toWalletId),
        payerId: DEMO_USER_ID,
      },
    });
  }, []);

  const addWallet = useCallback((data: WalletFormData) => {
    const id = nextWalletId.current++;
    const balance = data.walletBalance ?? 0;
    dispatch({
      kind: 'addWallet',
      wallet: {
        id,
        walletId: id,
        name: data.walletName,
        walletName: data.walletName,
        cardName: data.cardName,
        walletColor: data.walletColor,
        balance,
        walletBalance: balance,
      },
    });
  }, []);

  const editWallet = useCallback((id: number, data: WalletFormData) => {
    dispatch({ kind: 'editWallet', id, data });
  }, []);

  const deleteWallet = useCallback((id: number) => {
    dispatch({ kind: 'deleteWallet', id });
  }, []);

  const reorderWallets = useCallback((wallets: DemoWallet[]) => {
    dispatch({ kind: 'reorderWallets', wallets });
  }, []);

  const reset = useCallback(() => {
    nextWalletId.current = Math.max(0, ...DEMO_WALLETS.map((w) => w.id)) + 1;
    dispatch({ kind: 'reset' });
  }, []);

  const wallets = useMemo(
    () => attachExpensesToWallets(state.wallets, state.entries),
    [state.wallets, state.entries],
  );

  return {
    wallets,
    entries: state.entries,
    addExpense,
    addIncome,
    addTransfer,
    addWallet,
    editWallet,
    deleteWallet,
    reorderWallets,
    reset,
  };
}
