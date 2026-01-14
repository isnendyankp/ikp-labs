"use client";

/**
 * Button Component
 *
 * Reusable button with loading state support.
 *
 * Features:
 * - Loading state with spinner
 * - Disabled state
 * - Multiple variants (primary, secondary, danger)
 * - Multiple sizes (small, medium, large)
 * - Full width option
 */

import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Loading state */
  loading?: boolean;
  /** Button variant */
  variant?: "primary" | "secondary" | "danger";
  /** Button size */
  size?: "small" | "medium" | "large";
  /** Full width */
  fullWidth?: boolean;
  /** Children content */
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      loading = false,
      variant = "primary",
      size = "medium",
      fullWidth = false,
      disabled,
      children,
      className = "",
      ...props
    },
    ref,
  ) => {
    // Variant styles
    const variantStyles = {
      primary: loading
        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
        : "bg-black text-white hover:bg-gray-800",
      secondary: loading
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50",
      danger: loading
        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
        : "bg-red-600 text-white hover:bg-red-700",
    };

    // Size styles
    const sizeStyles = {
      small: "py-2 px-4 text-sm",
      medium: "py-3 px-4 text-base",
      large: "py-4 px-6 text-lg",
    };

    // Base styles
    const baseStyles = "rounded-lg font-medium transition-colors duration-200";

    // Width styles
    const widthStyles = fullWidth ? "w-full" : "";

    // Combined styles
    const buttonStyles = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${widthStyles}
      ${className}
    `;

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={buttonStyles.trim()}
        {...props}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </div>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
