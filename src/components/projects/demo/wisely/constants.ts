import type { DemoConnection, DemoWallet, FilterGroup } from './types';

export const DEMO_USER_ID = 1;

export const DEMO_WALLETS: DemoWallet[] = [
  {
    id: 1,
    walletId: 1,
    name: 'Checking Account',
    walletName: 'Checking Account',
    cardName: 'RBC Chequing',
    walletColor: 'emerald',
    balance: 3240.55,
    walletBalance: 3240.55,
  },
  {
    id: 2,
    walletId: 2,
    name: 'Savings',
    walletName: 'Savings',
    cardName: 'High Interest Savings',
    walletColor: 'blue',
    balance: 8120.0,
    walletBalance: 8120.0,
  },
  {
    id: 3,
    walletId: 3,
    name: 'Cash Wallet',
    walletName: 'Cash Wallet',
    cardName: 'Cash',
    walletColor: 'amber',
    balance: 85.0,
    walletBalance: 85.0,
  },
];

export const DEMO_FRIENDS_AND_GROUPS: DemoConnection[] = [
  { id: 2, name: 'Alex Chen', type: 'friend', members: [] },
  { id: 3, name: 'Sam Rivera', type: 'friend', members: [] },
  {
    id: 4,
    name: 'Apartment',
    type: 'group',
    members: [
      { userId: DEMO_USER_ID, name: 'You' },
      { userId: 2, name: 'Alex Chen' },
      { userId: 3, name: 'Sam Rivera' },
    ],
  },
];

export const DEMO_FILTER_GROUPS: FilterGroup[] = [{ groupId: 4, groupName: 'Apartment' }];
