"use client";

/**
 * Toast Context
 *
 * Global state management for toast notifications.
 * Provides toast functionality to all components via Context API.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  Toast,
  ToastConfig,
  DEFAULT_DURATIONS,
  MAX_VISIBLE_TOASTS,
} from "@/types/toast";

/**
 * Toast Context Interface
 *
 * Defines the shape of the toast context value.
 */
interface ToastContextValue {
  /** Array of active toasts */
  toasts: Toast[];

  /**
   * Show a toast notification
   * @param config - Toast configuration (message, type, duration)
   */
  showToast: (config: ToastConfig) => void;

  /**
   * Convenience method to show success toast
   * @param message - Success message
   * @param duration - Optional duration in milliseconds
   */
  showSuccess: (message: string, duration?: number) => void;

  /**
   * Convenience method to show error toast
   * @param message - Error message
   * @param duration - Optional duration in milliseconds
   */
  showError: (message: string, duration?: number) => void;

  /**
   * Convenience method to show warning toast
   * @param message - Warning message
   * @param duration - Optional duration in milliseconds
   */
  showWarning: (message: string, duration?: number) => void;

  /**
   * Convenience method to show info toast
   * @param message - Info message
   * @param duration - Optional duration in milliseconds
   */
  showInfo: (message: string, duration?: number) => void;

  /**
   * Remove a toast by ID
   * @param id - Toast ID to remove
   */
  removeToast: (id: string) => void;
}

/**
 * Toast Context
 */
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/**
 * Toast Provider Props
 */
interface ToastProviderProps {
  children: ReactNode;
}

/**
 * Toast Provider Component
 *
 * Provides toast context to all child components.
 * Manages toast state and auto-dismissal logic.
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /**
   * Remove a toast from the list
   */
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Show a toast notification
   * Automatically removes the toast after the specified duration.
   */
  const showToast = useCallback(
    (config: ToastConfig) => {
      const { message, type, duration } = config;

      // Enforce maximum visible toasts limit
      setToasts((prev) => {
        if (prev.length >= MAX_VISIBLE_TOASTS) {
          // Remove oldest toast
          const oldest = prev[0];
          removeToast(oldest.id);
        }
        return prev;
      });

      // Create new toast
      const id = Math.random().toString(36).substring(7);
      const toastDuration = duration ?? DEFAULT_DURATIONS[type];
      const newToast: Toast = {
        id,
        type,
        message,
        duration: toastDuration,
        createdAt: Date.now(),
      };

      // Add toast to state
      setToasts((prev) => [...prev, newToast]);

      // Auto-dismiss after duration
      setTimeout(() => {
        removeToast(id);
      }, toastDuration);
    },
    [removeToast],
  );

  /**
   * Convenience methods for different toast types
   */
  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, type: "success", duration });
    },
    [showToast],
  );

  const showError = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, type: "error", duration });
    },
    [showToast],
  );

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, type: "warning", duration });
    },
    [showToast],
  );

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      showToast({ message, type: "info", duration });
    },
    [showToast],
  );

  const contextValue: ToastContextValue = {
    toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
}

/**
 * useToast Hook
 *
 * Hook to consume the toast context.
 * Must be used within a ToastProvider.
 *
 * @throws Error if used outside ToastProvider
 * @returns Toast context value
 */
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used within a ToastProvider. Wrap your app with <ToastProvider>.",
    );
  }

  return context;
}
