"use client";

/**
 * PasswordRequirementsGuide Component
 *
 * Visual checklist showing password requirements in real-time.
 *
 * Features:
 * - Shows all 5 password requirements upfront
 * - Updates in real-time as user types
 * - Three visual states: gray (not touched), green (met), red (not met)
 * - Matches backend @ValidPassword validation exactly
 *
 * Visual States:
 * - ⚪ Gray: Not touched (field empty)
 * - ✓ Green: Requirement satisfied
 * - ✗ Red: Requirement not satisfied (shown on validation error)
 */

interface RequirementItemProps {
  text: string;
  met: boolean;
  touched: boolean;
}

function RequirementItem({ text, met, touched }: RequirementItemProps) {
  // Not touched yet - show gray
  if (!touched) {
    return (
      <li className="flex items-center text-sm text-gray-400">
        <span className="mr-2" aria-hidden="true">⚪</span>
        {text}
      </li>
    );
  }

  // Requirement met - show green
  if (met) {
    return (
      <li className="flex items-center text-sm text-green-600">
        <span className="mr-2" aria-hidden="true">✓</span>
        {text}
      </li>
    );
  }

  // Requirement not met - show red
  return (
    <li className="flex items-center text-sm text-red-600">
      <span className="mr-2" aria-hidden="true">✗</span>
      {text}
    </li>
  );
}

export interface PasswordRequirementsGuideProps {
  /** Current password value */
  password: string;
  /** Whether validation errors should be shown */
  showError?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function PasswordRequirementsGuide({
  password,
  showError = false,
  className = "",
}: PasswordRequirementsGuideProps) {
  // Track if user has started typing
  const touched = password.length > 0;

  // Check each requirement
  const requirements = [
    {
      text: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      text: "One lowercase letter (a-z)",
      met: /[a-z]/.test(password),
    },
    {
      text: "One uppercase letter (A-Z)",
      met: /[A-Z]/.test(password),
    },
    {
      text: "One number (0-9)",
      met: /[0-9]/.test(password),
    },
    {
      text: "One special character (@$!%*?&)",
      met: /[@$!%*?&]/.test(password),
    },
  ];

  return (
    <div className={`mt-2 space-y-1 ${className}`} role="status" aria-live="polite" aria-atomic="true">
      <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
      <ul className="space-y-1">
        {requirements.map((req, index) => (
          <RequirementItem
            key={index}
            text={req.text}
            met={req.met}
            touched={touched}
          />
        ))}
      </ul>
    </div>
  );
}
