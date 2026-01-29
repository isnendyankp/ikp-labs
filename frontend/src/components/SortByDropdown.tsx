/**
 * SortByDropdown Component
 *
 * A reusable dropdown component for sorting gallery photos by different criteria.
 * Provides a clean UI with icon indicators and descriptions for each sort option.
 *
 * @component
 * @example
 * ```tsx
 * import SortByDropdown, { SortByOption } from '@/components/SortByDropdown';
 *
 * function GalleryPage() {
 *   const [sort, setSort] = useState<SortByOption>('newest');
 *
 *   return (
 *     <SortByDropdown
 *       currentSort={sort}
 *       onSortChange={(newSort) => {
 *         setSort(newSort);
 *         // Fetch photos with new sort order
 *       }}
 *     />
 *   );
 * }
 * ```
 *
 * Features:
 * - 4 sort options: newest, oldest, mostLiked, mostFavorited
 * - Clean Tailwind CSS UI design with hover states
 * - Accessible with ARIA attributes
 * - Click-outside-to-close functionality
 * - Icon and description for each option
 * - Visual indicator for currently selected option
 * - Callback on selection change
 *
 * @see {@link https://github.com/isnendyankp/ikp-labs} - Project Repository
 */

'use client';

import { useState, useRef, useEffect } from 'react';

/**
 * Available sort options for gallery photos.
 *
 * @typedef {('newest' | 'oldest' | 'mostLiked' | 'mostFavorited')} SortByOption
 *
 * - `newest`: Sort by creation date (newest first) - Default
 * - `oldest`: Sort by creation date (oldest first)
 * - `mostLiked`: Sort by like count (highest first, then by newest)
 * - `mostFavorited`: Sort by favorite count (highest first, then by newest)
 */
export type SortByOption = 'newest' | 'oldest' | 'mostLiked' | 'mostFavorited';

/**
 * Props for the SortByDropdown component.
 *
 * @interface SortByDropdownProps
 * @property {SortByOption} currentSort - Currently selected sort option
 * @property {(sort: SortByOption) => void} onSortChange - Callback function called when sort option changes
 * @property {"default" | "compact"} variant - Display mode variant (default: shows button, compact: menu only)
 */
interface SortByDropdownProps {
  /** Currently selected sort option */
  currentSort: SortByOption;
  /** Callback function invoked when user selects a different sort option */
  onSortChange: (sort: SortByOption) => void;
  /**
   * Variant for dropdown display mode
   * - "default": Shows dropdown button trigger (desktop)
   * - "compact": Hides button, shows only menu items (mobile icon mode)
   */
  variant?: "default" | "compact";
}

/**
 * Configuration for all available sort options.
 * Each option includes a value, label, icon, and description.
 *
 * @constant
 * @type {Array<{value: SortByOption, label: string, icon: string, description: string}>}
 */
const SORT_OPTIONS: Array<{
  value: SortByOption;
  label: string;
  icon: string;
  description: string;
}> = [
  {
    value: 'newest',
    label: 'Newest First',
    icon: '🆕',
    description: 'Most recently uploaded'
  },
  {
    value: 'oldest',
    label: 'Oldest First',
    icon: '📅',
    description: 'Oldest uploads first'
  },
  {
    value: 'mostLiked',
    label: 'Most Liked',
    icon: '❤️',
    description: 'Sorted by likes count'
  },
  {
    value: 'mostFavorited',
    label: 'Most Favorited',
    icon: '⭐',
    description: 'Sorted by favorites count'
  }
];

/**
 * SortByDropdown - A dropdown component for selecting photo sort order.
 *
 * Renders a button that opens a dropdown menu with 4 sorting options.
 * Closes automatically when clicking outside the dropdown or selecting an option.
 *
 * @param {SortByDropdownProps} props - Component props
 * @param {SortByOption} props.currentSort - Currently selected sort option
 * @param {(sort: SortByOption) => void} props.onSortChange - Callback when sort changes
 * @returns {JSX.Element} Rendered dropdown component
 *
 * @example
 * <SortByDropdown
 *   currentSort="newest"
 *   onSortChange={(sort) => console.log('Selected:', sort)}
 * />
 */
export default function SortByDropdown({
  currentSort,
  onSortChange,
  variant = "default",
}: SortByDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current sort option details
  const currentOption = SORT_OPTIONS.find(opt => opt.value === currentSort) || SORT_OPTIONS[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSortSelect = (sort: SortByOption) => {
    onSortChange(sort);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button - Hidden in compact mode */}
      {variant === "default" && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm min-w-[200px]"
          aria-label="Sort photos"
          aria-expanded={isOpen}
        >
          <span className="text-lg">{currentOption.icon}</span>
          <span className="flex-1 text-left font-medium text-gray-700">
            {currentOption.label}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      {/* Dropdown Menu - Always visible in compact mode, controlled by isOpen otherwise */}
      {(variant === "compact" || isOpen) && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="py-1">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortSelect(option.value)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  currentSort === option.value ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{option.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        currentSort === option.value ? 'text-blue-700' : 'text-gray-900'
                      }`}>
                        {option.label}
                      </span>
                      {currentSort === option.value && (
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Named export for easier imports
export { SortByDropdown };
