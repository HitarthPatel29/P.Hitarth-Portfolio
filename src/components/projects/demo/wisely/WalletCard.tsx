import type { CSSProperties, MouseEvent, Ref } from 'react';
import { EllipsisVerticalIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import { WALLET_COLOR_MAP } from './walletColors';
import type { DemoWallet } from './types';

type WalletCardProps = {
  wallet: DemoWallet;
  openMenuId: number | string | null;
  onMenuToggle?: (walletId: number | string | null) => void;
  onEdit?: (wallet: DemoWallet) => void;
  onDelete?: (wallet: DemoWallet) => void;
  menuRef?: Ref<HTMLDivElement>;
  isDragging?: boolean;
  isActive?: boolean;
  style?: CSSProperties;
  onMouseDown?: (e: MouseEvent<HTMLDivElement>) => void;
  className?: string;
};

export default function WalletCard({
  wallet,
  openMenuId,
  onMenuToggle,
  onEdit,
  onDelete,
  menuRef,
  isDragging = false,
  isActive = true,
  style,
  onMouseDown,
  className = '',
}: WalletCardProps) {
  const walletId = wallet.walletId ?? wallet.id;
  const walletName = wallet.walletName ?? wallet.name;
  const cardName = wallet.cardName;
  const balance = Number(wallet.walletBalance ?? wallet.balance ?? 0);
  const isMenuOpen = openMenuId === walletId;

  const getCardClasses = () => {
    const colorKey = wallet.walletColor || wallet.color;
    if (colorKey && WALLET_COLOR_MAP[colorKey]) {
      return `bg-gradient-to-br ${WALLET_COLOR_MAP[colorKey]} text-white shadow-emerald-900/20`;
    }
    return balance >= 0
      ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 border-emerald-400/40 text-white shadow-emerald-900/20'
      : 'bg-gradient-to-br from-rose-500 to-rose-700 border-rose-400/40 text-white shadow-rose-900/20';
  };

  return (
    <div
      className={className}
      style={{
        cursor: isActive ? (isDragging ? 'grabbing' : 'grab') : 'default',
        ...style,
      }}
      onMouseDown={onMouseDown}
    >
      <div
        className={`relative flex h-[130px] flex-col justify-between rounded-2xl border-2 p-5 shadow-xl ${getCardClasses()}`}
      >
        <div className="absolute right-2 top-2" ref={isMenuOpen ? menuRef : undefined}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onMenuToggle?.(walletId);
            }}
            className="rounded-lg bg-white/20 p-1.5 text-white transition-colors hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Wallet options"
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
          >
            <EllipsisVerticalIcon className="h-5 w-5" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 min-w-[140px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(wallet);
                  onMenuToggle?.(null);
                }}
                className="flex w-full items-center gap-2 rounded-t-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <PencilSquareIcon className="h-4 w-4" />
                Edit wallet
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(wallet);
                  onMenuToggle?.(null);
                }}
                className="flex w-full items-center gap-2 rounded-b-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
              >
                <TrashIcon className="h-4 w-4" />
                Delete wallet
              </button>
            </div>
          )}
        </div>

        <div className="pr-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-white">{walletName}</p>
          {cardName && (
            <p className="truncate text-xs font-light tracking-wide text-white/70">{cardName}</p>
          )}
        </div>

        <p className="text-2xl font-bold tracking-tight text-white">${Math.abs(balance).toFixed(2)}</p>
      </div>
    </div>
  );
}
