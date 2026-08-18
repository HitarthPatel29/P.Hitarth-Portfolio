import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import InputField from './InputField';
import { WALLET_COLORS } from './walletColors';
import type { DemoWallet, WalletFormData } from './types';

type AddWalletProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: WalletFormData) => void;
  editWallet?: DemoWallet | null;
  onEdit?: (walletId: number, data: WalletFormData) => void;
};

export default function AddWallet({ isOpen, onClose, onAdd, editWallet = null, onEdit }: AddWalletProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const isEdit = !!editWallet;
  const [showCardNameTooltip, setShowCardNameTooltip] = useState(false);
  const [walletName, setWalletName] = useState('');
  const [cardName, setCardName] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [walletColor, setWalletColor] = useState('emerald');

  useEffect(() => {
    if (isOpen) {
      if (editWallet) {
        setWalletName(editWallet.walletName ?? '');
        setCardName(editWallet.cardName ?? '');
        setWalletBalance(
          String(editWallet.initialBalance ?? editWallet.walletBalance ?? editWallet.balance ?? ''),
        );
        setWalletColor(editWallet.walletColor ?? editWallet.color ?? 'emerald');
      } else {
        setWalletName('');
        setCardName('');
        setWalletBalance('');
        setWalletColor('emerald');
      }
    }
  }, [isOpen, editWallet]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      focusableElements[0]?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSubmit = () => {
    const balanceNum = parseFloat(walletBalance);
    if (!walletName.trim()) return;
    const parsedBalance = Number.isNaN(balanceNum) ? 0 : balanceNum;
    const data: WalletFormData = {
      walletName: walletName.trim(),
      cardName: cardName.trim(),
      walletColor,
      ...(isEdit ? { initialBalance: parsedBalance } : { walletBalance: parsedBalance }),
    };
    if (isEdit && onEdit) {
      const id = editWallet.id ?? editWallet.walletId;
      onEdit(id, data);
    } else {
      onAdd(data);
    }
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="dark fixed inset-0 z-[80] flex items-center justify-center bg-black/30 px-4"
      onClick={onClose}
      role="presentation"
      aria-hidden={!isOpen}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-wallet-modal-title"
        className="relative w-full max-w-md animate-fadeIn rounded-xl bg-gray-100 p-6 text-gray-900 shadow-2xl shadow-black dark:bg-gray-800 dark:text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="add-wallet-modal-title" className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {isEdit ? 'Edit Wallet' : 'Add Wallet / Card / Account'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-gray-100 p-1 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-900 dark:hover:bg-gray-700"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <InputField
          label="Name"
          type="text"
          value={walletName}
          onChange={(e) => setWalletName(e.target.value)}
          placeholder="e.g. Main Wallet, Credit Card"
          id="wallet-name"
        />

        <InputField
          label={
            <span className="inline-flex items-center gap-1">
              Card Name <span className="text-xs font-normal text-gray-400">(for Apple Automation)</span>
              <span className="relative">
                <button
                  type="button"
                  onClick={() => setShowCardNameTooltip((v) => !v)}
                  onBlur={() => setShowCardNameTooltip(false)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none dark:hover:text-gray-300"
                  aria-label="Card name info"
                >
                  <InformationCircleIcon className="h-5 w-5" />
                </button>
                {showCardNameTooltip && (
                  <span className="absolute left-1/2 top-6 z-50 w-64 -translate-x-1/2 rounded-lg bg-gray-900 p-3 text-xs font-normal leading-relaxed text-white shadow-lg dark:bg-gray-700">
                    The Card Name is used for Apple Automation. Check the Card Name from your Apple Automation App
                    and enter the exact text.
                  </span>
                )}
              </span>
            </span>
          }
          type="text"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="e.g. Royal Bank Cashback Master Card"
          id="card-name"
        />

        <InputField
          label={isEdit ? 'Initial Balance' : 'Current Balance'}
          type="number"
          value={walletBalance}
          onChange={(e) => setWalletBalance(e.target.value)}
          placeholder="0.00"
          id="wallet-balance"
          step="0.01"
        />

        <div className="mb-6">
          <label className="mb-2 block font-medium text-gray-900 dark:text-gray-100">Card Color</label>
          <div className="flex flex-wrap gap-2">
            {WALLET_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setWalletColor(c.id)}
                aria-pressed={walletColor === c.id}
                aria-label={`Select ${c.name} color`}
                className={`h-10 w-10 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 ${
                  walletColor === c.id
                    ? 'scale-110 border-gray-900 dark:border-white'
                    : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
                }`}
              >
                <span className={`block h-full w-full rounded-md bg-gradient-to-br ${c.gradient}`} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-300 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!walletName.trim()}
            className="flex-1 rounded-xl bg-emerald-500 py-2.5 font-medium text-white transition-colors hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isEdit ? 'Save' : 'Add'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
