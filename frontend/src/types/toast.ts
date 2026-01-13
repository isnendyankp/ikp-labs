/**
 * Toast Notification Types
 *
 * Type definitions for the toast notification system.
 * Provides type safety for toast notifications throughout the application.
 */

/**
 * Available toast notification types
 * - success: Green toast for successful operations
 * - error: Red toast for errors and failures
 * - warning: Yellow toast for warnings
 * - info: Blue toast for informational messages
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast notification interface
 *
 * Represents a single toast notification with its metadata.
 */
export interface Toast {
  /** Unique identifier for the toast */
  id: string;

  /** Type of toast notification */
  type: ToastType;

  /** Message to display to the user */
  message: string;

  /** Duration in milliseconds before auto-dismiss (default: 4000ms) */
  duration?: number;

  /** Timestamp when the toast was created */
  createdAt: number;
}

/**
 * Toast configuration interface
 *
 * Simplified interface for creating new toasts without ID and timestamp.
 */
export interface ToastConfig {
  /** Message to display to the user */
  message: string;

  /** Type of toast notification */
  type: ToastType;

  /** Duration in milliseconds before auto-dismiss (optional) */
  duration?: number;
}

/**
 * Default durations for each toast type (in milliseconds)
 */
export const DEFAULT_DURATIONS: Record<ToastType, number> = {
  success: 4000,
  error: 5000,
  warning: 5000,
  info: 4000,
} as const;

/**
 * Maximum number of toasts to display simultaneously
 */
export const MAX_VISIBLE_TOASTS = 5;

/**
 * Toast icons mapping (emoji representation)
 */
export const TOAST_ICONS: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
} as const;
