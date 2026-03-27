"use client";

/**
 * PasswordStrengthIndicator Component
 *
 * Visual indicator showing password strength in real-time.
 *
 * Features:
 * - Calculates strength based on multiple criteria
 * - Shows colored progress bar (red/yellow/green)
 * - Displays strength text (Weak/Medium/Strong)
 * - Provides helpful feedback for password creation
 *
 * Strength Criteria:
 * - Weak: < 8 characters or missing complexity
 * - Medium: 8+ characters with some complexity
 * - Strong: 12+ characters with high complexity
 */

import { useMemo } from "react";

export interface PasswordStrengthIndicatorProps {
  /** Password string to analyze */
  password: string;
  /** Additional CSS classes */
  className?: string;
}

type StrengthLevel = "weak" | "medium" | "strong";

interface StrengthResult {
  level: StrengthLevel;
  score: number; // 0-100
  label: string;
  color: string;
}

export function PasswordStrengthIndicator({
  password,
  className = "",
}: PasswordStrengthIndicatorProps) {
  const strength: StrengthResult | null = useMemo(() => {
    if (!password) return null;

    let score = 0;

    // Length criteria
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 25;

    // Complexity criteria
    if (/[a-z]/.test(password)) score += 12.5; // Has lowercase
    if (/[A-Z]/.test(password)) score += 12.5; // Has uppercase
    if (/[0-9]/.test(password)) score += 12.5; // Has number
    if (/[^a-zA-Z0-9]/.test(password)) score += 12.5; // Has special char

    // Determine level
    let level: StrengthLevel;
    let label: string;
    let color: string;

    if (score < 50) {
      level = "weak";
      label = "Weak";
      color = "bg-red-500";
    } else if (score < 75) {
      level = "medium";
      label = "Medium";
      color = "bg-yellow-500";
    } else {
      level = "strong";
      label = "Strong";
      color = "bg-green-500";
    }

    return { level, score, label, color };
  }, [password]);

  if (!strength) {
    return null;
  }

  return (
    <div className={`mt-2 ${className}`}>
      {/* Strength Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${strength.color} transition-all duration-300 ease-out`}
            style={{ width: `${strength.score}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700 min-w-[60px]">
          {strength.label}
        </span>
      </div>

      {/* Strength Tips */}
      <div className="mt-2 text-xs text-gray-500 space-y-1">
        {password.length < 8 && (
          <p className="text-red-600">• Use at least 8 characters</p>
        )}
        {password.length >= 8 && password.length < 12 && (
          <p className="text-yellow-600">
            • Use 12+ characters for stronger password
          </p>
        )}
        {password.length >= 12 && !/[a-z]/.test(password) && (
          <p className="text-yellow-600">• Add lowercase letters</p>
        )}
        {password.length >= 12 && !/[A-Z]/.test(password) && (
          <p className="text-yellow-600">• Add uppercase letters</p>
        )}
        {password.length >= 12 && !/[0-9]/.test(password) && (
          <p className="text-yellow-600">• Add numbers</p>
        )}
        {password.length >= 12 && !/[^a-zA-Z0-9]/.test(password) && (
          <p className="text-yellow-600">• Add special characters (!@#$%^&*)</p>
        )}
        {strength.level === "strong" && (
          <p className="text-green-600">✓ Great password! Very secure.</p>
        )}
      </div>
    </div>
  );
}
