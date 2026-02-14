"use client";

/**
 * Toast Component
 *
 * Individual toast notification component with slide-in/slide-out animations.
 * Displays different types of notifications (success, error, warning, info).
 */

import { useEffect, useState } from "react";
import type { Toast as ToastType } from "@/types/toast";
import { TOAST_ICONS } from "@/types/toast";
import "./Toast.css";

/**
 * Toast Component Props
 */
interface ToastProps {
  /** Toast data to display */
  toast: ToastType;

  /**
   * Callback when toast is closed (either by timeout or user action)
   * @param id - The ID of the toast being closed
   */
  onClose: (id: string) => void;
}

/**
 * Duration of slide-in/slide-out animation in milliseconds
 */
const ANIMATION_DURATION = 300;

/**
 * Toast Component
 *
 * Displays a single toast notification with appropriate styling,
 * icon, and animation based on its type.
 */
export function Toast({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger slide-in animation on mount
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    // Trigger slide-out animation before removal
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, toast.duration! - ANIMATION_DURATION);

    // Actually remove the toast after exit animation
    const removeTimer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration!);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [toast, onClose]);

  /**
   * Handle close button click
   */
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(toast.id);
    }, ANIMATION_DURATION);
  };

  /**
   * Get CSS classes based on toast type
   */
  const getTypeClasses = (): string => {
    const baseClasses = "toast-item";
    const typeClasses = {
      success: "toast-success",
      error: "toast-error",
      warning: "toast-warning",
      info: "toast-info",
    };
    return `${baseClasses} ${typeClasses[toast.type]}`;
  };

  const getAnimationStyles = (): React.CSSProperties => {
    if (isExiting) {
      return {
        opacity: 0,
        transform: "translateX(100%)",
        transition: `all ${ANIMATION_DURATION}ms ease-in-out`,
      };
    }
    if (isVisible) {
      return {
        opacity: 1,
        transform: "translateX(0)",
        transition: `all ${ANIMATION_DURATION}ms ease-in-out`,
      };
    }
    return {
      opacity: 0,
      transform: "translateX(100%)",
      transition: `all ${ANIMATION_DURATION}ms ease-in-out`,
    };
  };

  return (
    <div
      className={getTypeClasses()}
      style={getAnimationStyles()}
      role="alert"
      aria-live="polite"
    >
      <div className="toast-content">
        <span className="toast-icon" aria-hidden="true">
          {TOAST_ICONS[toast.type]}
        </span>
        <p className="toast-message">{toast.message}</p>
      </div>
      <button
        type="button"
        className="toast-close"
        onClick={handleClose}
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}
