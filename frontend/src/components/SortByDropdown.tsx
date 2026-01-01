/**
 * SortByDropdown Component
 *
 * Reusable dropdown for sorting photos by different criteria.
 *
 * Features:
 * - 4 sort options: newest, oldest, mostLiked, mostFavorited
 * - Clean Tailwind UI design
 * - Accessible with keyboard navigation
 * - Icon indicators for each option
 * - Callback on selection change
 *
 * Usage:
 * ```tsx
 * <SortByDropdown
 *   currentSort="newest"
 *   onSortChange={(sort) => handleSortChange(sort)}
 * />
 * ```
 */

'use client';

import { useState, useRef, useEffect } from 'react';

export type SortByOption = 'newest' | 'oldest' | 'mostLiked' | 'mostFavorited';

interface SortByDropdownProps {
  currentSort: SortByOption;
  onSortChange: (sort: SortByOption) => void;
}

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

export default function SortByDropdown({ currentSort, onSortChange }: SortByDropdownProps) {
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
      {/* Dropdown Button */}
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

      {/* Dropdown Menu */}
      {isOpen && (
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
