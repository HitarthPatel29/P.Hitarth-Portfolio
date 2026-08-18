import type { DemoWallet } from './types';

export function getWalletId(wallet: DemoWallet | null | undefined): number | undefined {
  return wallet?.walletId ?? wallet?.id;
}

export function walletIdsFromList(wallets: DemoWallet[]): number[] {
  return (wallets || []).map(getWalletId).filter((id): id is number => id != null);
}

export function setWalletOrder(_userId: number | string | undefined, _walletIds: number[]) {
  // Demo keeps order in memory only.
}
