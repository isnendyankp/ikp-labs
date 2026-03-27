/**
 * FABUpload Component
 *
 * Floating Action Button for quick photo upload access.
 * Fixed position button that stays visible while scrolling.
 *
 * Features:
 * - Fixed position at bottom-right corner
 * - Circular design (56x56px)
 * - Green background (bg-green-600)
 * - Upload icon from lucide-react
 * - Hover scale animation (110%)
 * - Active scale animation on click (95%)
 * - ARIA label for accessibility
 * - Focus ring for keyboard navigation
 * - Z-index 40 (above content, below BackToTop at z-50)
 *
 * @example
 * ```tsx
 * <FABUpload />
 * // With custom onClick
 * <FABUpload onClick={() => console.log('Upload clicked')} />
 * ```
 */

"use client";

import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";

interface FABUploadProps {
  /** Optional custom click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * FABUpload - Floating action button for photo upload
 *
 * Renders a circular button fixed at bottom-right of viewport.
 * Always visible on all devices for quick upload access.
 * Automatically navigates to /gallery/upload when clicked.
 */
export function FABUpload({ onClick, className = "" }: FABUploadProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push("/gallery/upload");
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Upload photo"
      type="button"
      className={`
        fixed bottom-4 right-4 z-40
        w-14 h-14 rounded-full
        bg-green-600 hover:bg-green-700
        text-white shadow-lg
        flex items-center justify-center
        hover:scale-110 active:scale-95
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
        ${className}
      `}
    >
      <Upload className="w-6 h-6" strokeWidth={2} />
    </button>
  );
}
