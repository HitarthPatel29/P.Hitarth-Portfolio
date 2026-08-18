import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { WALLET_COLOR_MAP } from './walletColors';
import { getWalletId } from './walletOrderStorage';
import type { DemoWallet } from './types';

function SortableWalletRow({ wallet }: { wallet: DemoWallet }) {
  const id = getWalletId(wallet) ?? 0;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const colorKey = wallet.walletColor || wallet.color;
  const colorClasses =
    colorKey && WALLET_COLOR_MAP[colorKey]
      ? `bg-gradient-to-br ${WALLET_COLOR_MAP[colorKey]}`
      : 'bg-gradient-to-br from-emerald-400 to-emerald-700';

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900 ${
        isDragging ? 'z-10 opacity-90 shadow-lg' : ''
      }`}
    >
      <button
        type="button"
        className="cursor-grab rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 active:cursor-grabbing dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
        aria-label={`Drag to reorder ${wallet.walletName ?? wallet.name}`}
        {...attributes}
        {...listeners}
      >
        <Bars3Icon className="h-5 w-5" aria-hidden="true" />
      </button>
      <span className={`h-10 w-10 shrink-0 rounded-lg ${colorClasses}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-gray-900 dark:text-gray-100">
          {wallet.walletName ?? wallet.name ?? 'Wallet'}
        </p>
        {wallet.cardName && (
          <p className="truncate text-sm text-gray-500 dark:text-gray-400">{wallet.cardName}</p>
        )}
      </div>
    </li>
  );
}

type ReorderWalletsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  wallets?: DemoWallet[];
  onSave: (wallets: DemoWallet[]) => void;
};

export default function ReorderWalletsModal({
  isOpen,
  onClose,
  wallets = [],
  onSave,
}: ReorderWalletsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<DemoWallet[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    if (isOpen) setItems([...wallets]);
  }, [isOpen, wallets]);

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

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      focusable[0]?.focus();
    }
  }, [isOpen]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setItems((prev) => {
      const oldIndex = prev.findIndex((w) => getWalletId(w) === active.id);
      const newIndex = prev.findIndex((w) => getWalletId(w) === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleSave = () => {
    onSave(items);
    onClose();
  };

  if (!isOpen) return null;

  const sortableIds = items.map(getWalletId).filter((id): id is number => id != null);

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
        aria-labelledby="reorder-wallets-modal-title"
        className="relative flex max-h-[85vh] w-full max-w-md animate-fadeIn flex-col rounded-xl bg-gray-100 p-6 text-gray-900 shadow-2xl shadow-black dark:bg-gray-800 dark:text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex shrink-0 items-center justify-between">
          <h2 id="reorder-wallets-modal-title" className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Reorder Wallets
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

        <p className="mb-4 shrink-0 text-sm text-gray-600 dark:text-gray-400">
          Drag wallets to change their order in the carousel. The first wallet appears when you open this page.
        </p>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
            <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
              {items.map((wallet) => (
                <SortableWalletRow key={getWalletId(wallet)} wallet={wallet} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>

        <div className="mt-6 flex shrink-0 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-300 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 rounded-xl bg-emerald-500 py-2.5 font-medium text-white transition-colors hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            Save order
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
