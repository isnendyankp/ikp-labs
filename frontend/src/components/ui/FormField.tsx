"use client";

/**
 * FormField Component
 *
 * Reusable form field wrapper with label, error, and validation states.
 *
 * Features:
 * - Label with required indicator (*)
 * - Error message display
 * - Valid message display (green checkmark)
 * - Border color changes based on state
 * - Support for any input component as children
 */

import { ReactNode } from "react";

export interface FormFieldProps {
  /** Field label text */
  label: string;
  /** Error message to display */
  error?: string;
  /** Whether the field has valid input */
  isValid?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Field identifier */
  id?: string;
  /** Additional CSS classes for the container */
  className?: string;
  /** Input component (input, select, textarea, etc.) */
  children: ReactNode;
}

export function FormField({
  label,
  error,
  isValid = false,
  required = false,
  id,
  className = "",
  children,
}: FormFieldProps) {
  // Determine border color based on validation state
  const getBorderColor = () => {
    if (error) return "border-red-500 focus-within:border-red-500";
    if (isValid) return "border-green-500 focus-within:border-green-500";
    return "border-gray-300 focus-within:border-blue-500";
  };

  return (
    <div className={`mb-4 ${className}`}>
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Field with Border Color */}
      <div className={getBorderColor()}>{children}</div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {/* Valid Message */}
      {isValid && !error && (
        <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Looks good!
        </p>
      )}
    </div>
  );
}
