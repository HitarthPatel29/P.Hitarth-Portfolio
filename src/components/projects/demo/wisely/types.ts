import type { ComponentType } from 'react';

export type EntryKind = 'expense' | 'income' | 'transfer';
export type ShareWithType = 'friend' | 'group';
export type ExpenseMode = 'shared' | 'personal';

export type DemoWallet = {
  id: number;
  walletId: number;
  name: string;
  walletName: string;
  cardName?: string;
  walletColor?: string;
  color?: string;
  balance: number;
  walletBalance?: number;
  initialBalance?: number;
  expenses?: WalletLedgerEntry[];
};

export type WalletFormData = {
  walletName: string;
  cardName: string;
  walletColor: string;
  walletBalance?: number;
  initialBalance?: number;
};

export type DemoMember = {
  userId: number;
  name: string;
};

export type DemoConnection = {
  id: number;
  name: string;
  type: ShareWithType;
  members?: DemoMember[];
  profilePicture?: string;
};

export type SplitDetail = {
  userId: number;
  name: string;
  amount: number | '';
  portion: number | '';
  include: boolean;
};

export type ExpenseDraft = {
  id?: number | null;
  title: string;
  amount: number | string;
  totalAmount?: number | string;
  date: string;
  category: string;
  predictedCategory?: string | null;
  payerId: number | null;
  owes: string;
  shareWithId: number | null;
  shareWith: string;
  shareWithType: ShareWithType;
  splitDetails: SplitDetail[];
  userId: number | null;
  walletId: number | string | null;
  toWalletId: number | string | null;
  paymentId: number | string | null;
  isSettleUp: boolean;
  entryKind: EntryKind;
  billSplitUsed?: boolean;
};

export type ExpensePayload = {
  title: string;
  amount: number;
  date: string;
  category: string;
  payerId?: number | null;
  shareWithId?: number | null;
  shareWithType?: ShareWithType;
  splitDetails?: SplitDetail[];
  isSettleUp?: boolean;
  paymentId?: number | string | null;
  walletId?: number | string | null;
  toWalletId?: number | string | null;
  isPersonal?: boolean;
  entryKind?: EntryKind;
  predictedCategory?: string | null;
};

export type IncomePayload = {
  title: string;
  amount: number;
  date: string;
  category: string;
  walletId: number | string | null;
};

export type TransferPayload = {
  title: string;
  amount: number;
  date: string;
  fromWalletId: number | string | null;
  toWalletId: number | string | null;
};

export type LedgerEntry = {
  id: string;
  expenseId?: string;
  entryKind: EntryKind;
  title: string;
  date: string;
  category: string;
  totalAmount: number;
  totalExpenseAmount?: number;
  isPersonal: boolean;
  isSettleUp: boolean;
  userContribution: number;
  walletId: number | null;
  toWalletId?: number | null;
  payerId?: number | null;
  splitDetails?: SplitDetail[];
  groupId?: number | null;
  groupName?: string;
  type?: 'transfer_in' | 'transfer_out';
  highlight?: boolean;
};

export type WalletLedgerEntry = LedgerEntry & {
  expenseId: string;
};

export type FilterGroup = {
  groupId: number;
  groupName: string;
};

export type CategoryOption = {
  value: string;
  label: string;
  Icon?: ComponentType<{ className?: string }>;
  imageUrl?: string;
  suffix?: string;
};

export type ComboboxChangeEvent = {
  target: { name?: string; value: string };
};
