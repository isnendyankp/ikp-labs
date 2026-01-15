"use client";

/**
 * EmptyState Component
 *
 * Displayed when there's no data to show.
 * Provides helpful messaging and optional action button.
 *
 * Features:
 * - Customizable icon (emoji or image)
 * - Title and description
 * - Optional CTA button
 * - Centered layout
 */

import { ButtonHTMLAttributes, ReactNode } from "react";

export interface EmptyStateProps {
  /** Icon to display (emoji or React node) */
  icon?: string | ReactNode;
  /** Title text */
  title: string;
  /** Description message */
  message?: string;
  /** Action button text */
  actionText?: string;
  /** Action button click handler */
  onAction?: () => void;
  /** Action button props */
  actionButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  /** Additional CSS classes */
  className?: string;
}

export function EmptyState({
  icon,
  title,
  message,
  actionText,
  onAction,
  actionButtonProps,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 ${className}`}
    >
      {/* Icon */}
      {icon && (
        <div className="text-6xl mb-4">
          {typeof icon === "string" ? <span role="img">{icon}</span> : icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
        {title}
      </h3>

      {/* Message */}
      {message && (
        <p className="text-gray-500 text-center max-w-md mb-6">{message}</p>
      )}

      {/* Action Button */}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          {...actionButtonProps}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
