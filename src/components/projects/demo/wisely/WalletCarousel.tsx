import { useCallback, useEffect, useRef, useState, type MouseEvent, type TouchEvent as ReactTouchEvent } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import WalletCard from './WalletCard';
import ReorderWalletsModal from './ReorderWalletsModal';
import { getWalletId, setWalletOrder, walletIdsFromList } from './walletOrderStorage';
import type { DemoWallet } from './types';

const SWIPE_THRESHOLD = 60;
const LAYER_SPACING = 80;

type WalletCarouselProps = {
  wallets?: DemoWallet[];
  loading?: boolean;
  userId?: number | string;
  activeWalletIndex?: number;
  onActiveWalletChange?: (index: number) => void;
  onWalletsReorder?: (wallets: DemoWallet[]) => void;
  onEdit?: (wallet: DemoWallet) => void;
  onDelete?: (wallet: DemoWallet) => void;
  emptyMessage?: string;
  className?: string;
};

export default function WalletCarousel({
  wallets = [],
  loading = false,
  userId,
  activeWalletIndex: activeWalletIndexProp,
  onActiveWalletChange,
  onWalletsReorder,
  onEdit,
  onDelete,
  emptyMessage = 'No wallets yet. Add one using the button above.',
  className = '',
}: WalletCarouselProps) {
  const [internalActiveIndex, setInternalActiveIndex] = useState(0);
  const isControlled = activeWalletIndexProp !== undefined;
  const activeWalletIndex = isControlled ? activeWalletIndexProp : internalActiveIndex;

  const setActiveWalletIndex = useCallback(
    (updater: number | ((prev: number) => number)) => {
      const nextIndex = typeof updater === 'function' ? updater(activeWalletIndex) : updater;
      const clamped = Math.min(Math.max(0, nextIndex), Math.max(0, wallets.length - 1));
      if (clamped === activeWalletIndex) return;
      if (!isControlled) setInternalActiveIndex(clamped);
      onActiveWalletChange?.(clamped);
    },
    [activeWalletIndex, isControlled, onActiveWalletChange, wallets.length],
  );

  const [dragOffset, setDragOffset] = useState(0);
  const dragOffsetRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [openMenuWalletId, setOpenMenuWalletId] = useState<number | string | null>(null);
  const [showReorderWallets, setShowReorderWallets] = useState(false);
  const dragStartRef = useRef({ x: 0 });
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isControlled) return;
    setInternalActiveIndex((i) => Math.min(i, Math.max(0, wallets.length - 1)));
  }, [wallets.length, isControlled]);

  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuWalletId(null);
      }
    };
    if (openMenuWalletId != null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuWalletId]);

  const goToPrev = useCallback(() => {
    setActiveWalletIndex((i) => Math.max(0, i - 1));
  }, [setActiveWalletIndex]);

  const goToNext = useCallback(() => {
    setActiveWalletIndex((i) => Math.min(wallets.length - 1, i + 1));
  }, [setActiveWalletIndex, wallets.length]);

  const getOffsetForWallet = useCallback(
    (walletIndex: number) => walletIndex - activeWalletIndex,
    [activeWalletIndex],
  );

  const getScaleForOffset = (offset: number) => {
    const abs = Math.abs(offset);
    if (abs === 0) return 1;
    return Math.max(0.55, 1 - abs * 0.12);
  };

  const handleDragStart = useCallback((clientX: number) => {
    setIsDragging(true);
    isDraggingRef.current = true;
    dragStartRef.current = { x: clientX };
    dragOffsetRef.current = 0;
    setDragOffset(0);
  }, []);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDraggingRef.current) return;
    const delta = clientX - dragStartRef.current.x;
    const maxDrag = containerRef.current?.offsetWidth ? containerRef.current.offsetWidth * 0.4 : 150;
    const clamped = Math.max(-maxDrag, Math.min(maxDrag, delta));
    dragOffsetRef.current = clamped;
    setDragOffset(clamped);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    const current = dragOffsetRef.current;
    if (Math.abs(current) > SWIPE_THRESHOLD) {
      if (current > 0 && activeWalletIndex > 0) goToPrev();
      else if (current < 0 && activeWalletIndex < wallets.length - 1) goToNext();
    }

    dragOffsetRef.current = 0;
    setDragOffset(0);
  }, [goToPrev, goToNext, activeWalletIndex, wallets.length]);

  const handleTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => handleDragStart(e.touches[0].clientX);
  const handleTouchEnd = () => handleDragEnd();
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e: globalThis.MouseEvent) => handleDragMove(e.clientX);
    const onMouseUp = () => handleDragEnd();
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const carouselMounted = !loading && wallets.length > 0;
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchMove = (e: globalThis.TouchEvent) => {
      if (isDraggingRef.current) e.preventDefault();
      handleDragMove(e.touches[0].clientX);
    };
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => el.removeEventListener('touchmove', onTouchMove);
  }, [handleDragMove, carouselMounted]);

  const handleReorderWalletsSave = (orderedWallets: DemoWallet[]) => {
    const activeId = wallets[activeWalletIndex] ? getWalletId(wallets[activeWalletIndex]) : null;
    if (userId) setWalletOrder(userId, walletIdsFromList(orderedWallets));
    onWalletsReorder?.(orderedWallets);
    if (activeId != null) {
      const newIndex = orderedWallets.findIndex((w) => getWalletId(w) === activeId);
      if (newIndex >= 0) setActiveWalletIndex(newIndex);
    }
  };

  return (
    <>
      <section className={`relative flex min-h-[180px] flex-col justify-between ${className}`}>
        {loading ? (
          <div className="flex h-full items-center justify-center py-8 text-sm text-gray-500 dark:text-gray-400">
            Loading wallets...
          </div>
        ) : wallets.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {emptyMessage}
          </div>
        ) : (
          <>
            <div className="relative z-40 flex h-8 w-full justify-end">
              {wallets.length > 1 && (
                <div className="group relative">
                  <button
                    type="button"
                    onClick={() => setShowReorderWallets(true)}
                    className="rounded-lg bg-white/95 p-1.5 shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-400 active:scale-95 dark:bg-gray-800"
                    aria-label="Reorder wallets"
                  >
                    <EllipsisHorizontalIcon className="h-5 w-5 text-gray-700 dark:text-gray-200" aria-hidden="true" />
                  </button>
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute right-0 top-full mt-1 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 dark:bg-gray-700"
                  >
                    Reorder wallets
                  </span>
                </div>
              )}
            </div>

            <div
              ref={containerRef}
              className="relative flex min-h-[140px] flex-1 touch-none select-none items-center justify-center overflow-x-hidden"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
            >
              {wallets.map((wallet, idx) => {
                const offset = getOffsetForWallet(idx);
                const isActive = offset === 0;
                const scale = getScaleForOffset(offset);
                const zIndex = 10 - Math.abs(offset);
                const translateX = offset * LAYER_SPACING + (isActive ? dragOffset : 0);
                const walletId = wallet.walletId ?? wallet.id;

                return (
                  <WalletCard
                    key={walletId}
                    wallet={wallet}
                    openMenuId={openMenuWalletId}
                    onMenuToggle={(id) => setOpenMenuWalletId((prev) => (prev === id ? null : id))}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    menuRef={menuRef}
                    isDragging={isDragging}
                    isActive={offset === 0}
                    onMouseDown={offset === 0 ? handleMouseDown : undefined}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: '240px',
                      transform: `translate(calc(-50% + ${translateX}px), -50%) scale(${scale})`,
                      zIndex,
                      transition: isDragging
                        ? 'none'
                        : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
                      transformOrigin: 'center',
                    }}
                  />
                );
              })}

              {wallets.length > 1 && (
                <>
                  {activeWalletIndex > 0 && (
                    <button
                      type="button"
                      onClick={goToPrev}
                      className="absolute left-0 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/95 p-2 shadow-lg transition-transform hover:scale-110 active:scale-95 dark:bg-gray-800"
                      aria-label="Previous wallet"
                    >
                      <ChevronLeftIcon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                    </button>
                  )}
                  {activeWalletIndex < wallets.length - 1 && (
                    <button
                      type="button"
                      onClick={goToNext}
                      className="absolute right-0 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/95 p-2 shadow-lg transition-transform hover:scale-110 active:scale-95 dark:bg-gray-800"
                      aria-label="Next wallet"
                    >
                      <ChevronRightIcon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="flex max-h-[20px] min-h-[20px] items-center justify-center gap-2">
              {wallets.length > 1 &&
                wallets.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveWalletIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === activeWalletIndex ? 'w-6 bg-emerald-500' : 'w-2 bg-gray-400/60 hover:bg-gray-400/80'
                    }`}
                    aria-label={`Go to wallet ${i + 1}`}
                  />
                ))}
            </div>
          </>
        )}
      </section>

      <ReorderWalletsModal
        isOpen={showReorderWallets}
        onClose={() => setShowReorderWallets(false)}
        wallets={wallets}
        onSave={handleReorderWalletsSave}
      />
    </>
  );
}
