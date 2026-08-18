import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { AlertModal, type AlertType } from './AlertModal';
import { Snackbar, type SnackbarPosition, type SnackbarType } from './Snackbar';

type AlertOptions = {
  title?: string;
  message: string;
  type?: AlertType;
  confirmText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
  cancelText?: string;
};

type SnackbarOptions = {
  message: string;
  type?: SnackbarType;
  duration?: number;
  position?: SnackbarPosition;
};

type NotifyOptions = {
  asSnackbar?: boolean;
  title?: string;
  duration?: number;
  position?: SnackbarPosition;
  confirmText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
  cancelText?: string;
};

type NotificationValue = {
  showAlert: (opts: AlertOptions) => Promise<boolean>;
  showSnackbar: (opts: SnackbarOptions) => void;
  showSuccess: (message: string, options?: NotifyOptions) => void;
  showError: (message: string, options?: NotifyOptions) => void;
  showInfo: (message: string, options?: NotifyOptions) => void;
  showWarning: (message: string, options?: NotifyOptions) => void;
};

const NotificationContext = createContext<NotificationValue | null>(null);

type AlertState = AlertOptions & {
  isOpen: boolean;
  onClose: () => void;
};

type SnackbarState = SnackbarOptions & {
  isOpen: boolean;
  onClose: () => void;
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);

  const showAlert = useCallback((opts: AlertOptions) => {
    return new Promise<boolean>((resolve) => {
      setAlert({
        isOpen: true,
        title: opts.title,
        message: opts.message,
        type: opts.type ?? 'info',
        confirmText: opts.confirmText,
        showCancel: opts.showCancel,
        cancelText: opts.cancelText,
        onConfirm: () => {
          opts.onConfirm?.();
          resolve(true);
        },
        onClose: () => {
          setAlert(null);
          resolve(false);
        },
      });
    });
  }, []);

  const showSnackbar = useCallback((opts: SnackbarOptions) => {
    setSnackbar({
      isOpen: true,
      message: opts.message,
      type: opts.type ?? 'info',
      duration: opts.duration ?? 4000,
      position: opts.position ?? 'top-center',
      onClose: () => setSnackbar(null),
    });
  }, []);

  const showSuccess = useCallback(
    (message: string, options: NotifyOptions = {}) => {
      if (options.asSnackbar) {
        showSnackbar({ message, type: 'success', duration: options.duration, position: options.position });
      } else {
        void showAlert({
          message,
          type: 'success',
          title: options.title ?? 'Success',
          confirmText: options.confirmText,
          onConfirm: options.onConfirm,
          showCancel: options.showCancel,
          cancelText: options.cancelText,
        });
      }
    },
    [showAlert, showSnackbar],
  );

  const showError = useCallback(
    (message: string, options: NotifyOptions = {}) => {
      if (options.asSnackbar) {
        showSnackbar({ message, type: 'error', duration: options.duration, position: options.position });
      } else {
        void showAlert({
          message,
          type: 'error',
          title: options.title ?? 'Error',
          confirmText: options.confirmText,
          onConfirm: options.onConfirm,
          showCancel: options.showCancel,
          cancelText: options.cancelText,
        });
      }
    },
    [showAlert, showSnackbar],
  );

  const showInfo = useCallback(
    (message: string, options: NotifyOptions = {}) => {
      if (options.asSnackbar) {
        showSnackbar({ message, type: 'info', duration: options.duration, position: options.position });
      } else {
        void showAlert({
          message,
          type: 'info',
          title: options.title ?? 'Information',
          confirmText: options.confirmText,
          onConfirm: options.onConfirm,
          showCancel: options.showCancel,
          cancelText: options.cancelText,
        });
      }
    },
    [showAlert, showSnackbar],
  );

  const showWarning = useCallback(
    (message: string, options: NotifyOptions = {}) => {
      if (options.asSnackbar) {
        showSnackbar({ message, type: 'warning', duration: options.duration, position: options.position });
      } else {
        void showAlert({
          message,
          type: 'warning',
          title: options.title ?? 'Warning',
          confirmText: options.confirmText,
          onConfirm: options.onConfirm,
          showCancel: options.showCancel,
          cancelText: options.cancelText,
        });
      }
    },
    [showAlert, showSnackbar],
  );

  const value: NotificationValue = {
    showAlert,
    showSnackbar,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {alert && <AlertModal {...alert} />}
      {snackbar && <Snackbar {...snackbar} />}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
