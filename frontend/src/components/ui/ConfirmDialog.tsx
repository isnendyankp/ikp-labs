"use client";

/**
 * ConfirmDialog Component
 *
 * Modal confirmation dialog for destructive actions.
 *
 * Features:
 * - Modal overlay with backdrop
 * - ESC key to close
 * - Click outside to close
 * - Focus trap (tab stays within dialog)
 * - ARIA attributes for accessibility
 * - Customizable buttons
 */

import { useEffect, useRef } from "react";

export interface ConfirmDialogProps {
  /** Whether dialog is open */
  isOpen: boolean;
  /** Dialog title */
  title: string;
  /** Dialog message/description */
  message: string;
  /** Callback when confirmed */
  onConfirm: () => void;
  /** Callback when cancelled */
  onCancel: () => void;
  /** Confirm button text (default: "Confirm") */
  confirmText?: string;
  /** Cancel button text (default: "Cancel") */
  cancelText?: string;
  /** Dialog variant (default: "danger") */
  variant?: "danger" | "warning" | "info";
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return;

    // Focus confirm button when dialog opens
    confirmButtonRef.current?.focus();

    // Handle tab key for focus trap
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusableElements = dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Handle ESC key
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleTabKey);
    document.addEventListener("keydown", handleEscapeKey);

    // Prevent body scroll when dialog is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleTabKey);
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onCancel]);

  // Don't render if not open
  if (!isOpen) return null;

  // Variant styles
  const variantStyles = {
    danger: {
      confirm: "bg-red-600 hover:bg-red-700 text-white",
      icon: "⚠️",
    },
    warning: {
      confirm: "bg-yellow-600 hover:bg-yellow-700 text-white",
      icon: "⚠️",
    },
    info: {
      confirm: "bg-blue-600 hover:bg-blue-700 text-white",
      icon: "ℹ️",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-message"
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog content */}
      <div
        ref={dialogRef}
        className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()} // Prevent click through to backdrop
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
          <span className="text-2xl" role="img" aria-label="warning icon">
            {styles.icon}
          </span>
        </div>

        {/* Title */}
        <h3
          id="dialog-title"
          className="text-lg font-semibold text-gray-900 mb-2"
        >
          {title}
        </h3>

        {/* Message */}
        <p id="dialog-message" className="text-sm text-gray-600 mb-6">
          {message}
        </p>

        {/* Action buttons */}
        <div className="flex gap-3 justify-end">
          {/* Cancel button */}
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            {cancelText}
          </button>

          {/* Confirm button */}
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${styles.confirm}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
