import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export type SnackbarType = 'info' | 'success' | 'error' | 'warning';
export type SnackbarPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

type SnackbarProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type?: SnackbarType;
  duration?: number;
  position?: SnackbarPosition;
};

const positionClasses: Record<SnackbarPosition, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 transform',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 transform',
};

const typeStyles: Record<SnackbarType, { bg: string; icon: string }> = {
  info: { bg: 'bg-blue-500', icon: 'ℹ️' },
  success: { bg: 'bg-emerald-500', icon: '✓' },
  error: { bg: 'bg-red-500', icon: '✕' },
  warning: { bg: 'bg-yellow-500', icon: '⚠' },
};

export function Snackbar({
  isOpen,
  onClose,
  message,
  type = 'info',
  duration = 4000,
  position = 'top-center',
}: SnackbarProps) {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = window.setTimeout(() => onClose(), duration);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const styles = typeStyles[type] ?? typeStyles.info;

  return createPortal(
    <div
      className={`fixed ${positionClasses[position]} z-[80] animate-fadeIn`}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <div
        className={`flex min-w-[300px] max-w-md items-center gap-3 rounded-xl ${styles.bg} px-4 py-3 text-white shadow-lg`}
      >
        <span className="text-xl" aria-hidden="true">
          {styles.icon}
        </span>
        <p className="flex-1 text-sm font-medium">{message}</p>
      </div>
    </div>,
    document.body,
  );
}
