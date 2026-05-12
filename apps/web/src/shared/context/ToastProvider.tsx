import { useCallback, useMemo, useState } from "react";

import {
  ToastContext,
  type ToastType,
} from "./toast.context";

import "./Toast.css";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = "info"
    ) => {
      const id = crypto.randomUUID();

      setToasts((currentToasts) => [
        ...currentToasts,
        {
          id,
          message,
          type,
        },
      ]);

      window.setTimeout(() => {
        removeToast(id);
      }, 3500);
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({
      showToast,
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        className="toast-container"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast--${toast.type}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}