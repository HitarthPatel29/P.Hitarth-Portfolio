import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export type AlertType = 'info' | 'success' | 'error' | 'warning';

type AlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: AlertType;
  confirmText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
  cancelText?: string;
};

const typeStyles: Record<
  AlertType,
  { icon: string; iconBg: string; iconColor: string; button: string; role: string }
> = {
  info: {
    icon: 'ℹ️',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    button: 'bg-blue-500 hover:bg-blue-600 text-white',
    role: 'dialog',
  },
  success: {
    icon: '✓',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    button: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    role: 'alertdialog',
  },
  error: {
    icon: '✕',
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-600 dark:text-red-400',
    button: 'bg-red-500 hover:bg-red-600 text-white',
    role: 'alertdialog',
  },
  warning: {
    icon: '⚠',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    button: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    role: 'alertdialog',
  },
};

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmText = 'OK',
  onConfirm,
  showCancel = false,
  cancelText = 'Cancel',
}: AlertModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      focusable[0]?.focus();
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

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const styles = typeStyles[type] ?? typeStyles.info;

  return createPortal(
    <div
      className="dark fixed inset-0 z-[80] flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        role={styles.role}
        aria-modal="true"
        aria-labelledby={title ? 'demo-modal-title' : undefined}
        aria-describedby="demo-modal-description"
        className="w-full max-w-md rounded-2xl bg-white p-6 text-gray-900 shadow-2xl dark:bg-gray-900 dark:text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${styles.iconBg}`}
            aria-hidden="true"
          >
            <span className={`text-2xl font-semibold ${styles.iconColor}`}>{styles.icon}</span>
          </div>
          <div className="flex-1">
            {title && (
              <h3 id="demo-modal-title" className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
            )}
            <p id="demo-modal-description" className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {message}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              {showCancel && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {cancelText}
                </button>
              )}
              <button
                type="button"
                onClick={handleConfirm}
                className={`rounded-xl px-4 py-2 font-semibold transition-colors ${styles.button}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
