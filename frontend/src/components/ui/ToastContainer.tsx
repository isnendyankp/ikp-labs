"use client";

/**
 * Toast Container Component
 *
 * Fixed-position container that displays all active toast notifications.
 * Positioned at top-right of the screen by default.
 */

import { useToast } from "@/context/ToastContext";
import { Toast } from "./Toast";
import "./ToastContainer.css";

/**
 * Toast Container Component
 *
 * Renders all active toasts in a fixed-position container.
 * Uses the useToast hook to access the toasts array and removeToast function.
 */
export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className="toast-container"
      role="region"
      aria-label="Toast notifications"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
}
