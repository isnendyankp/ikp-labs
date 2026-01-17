/**
 * FilterDropdown Component
 *
 * A dropdown component for filtering gallery photos.
 * Provides 4 filter options: All Photos, My Photos, My Liked Photos, My Favorited Photos
 *
 * Features:
 * - Dropdown UI with open/close state
 * - Visual indicator for selected option
 * - Click outside to close
 * - Keyboard accessible
 * - Consistent styling with app design
 */

"use client";

import { useState, useEffect, useRef } from "react";

export type FilterOption = "all" | "my-photos" | "liked" | "favorited";

interface FilterDropdownProps {
  currentFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

interface FilterConfig {
  value: FilterOption;
  label: string;
  icon: string;
}

const FILTER_OPTIONS: FilterConfig[] = [
  { value: "all", label: "All Photos", icon: "🌐" },
  { value: "my-photos", label: "My Photos", icon: "📸" },
  { value: "liked", label: "My Liked Photos", icon: "❤️" },
  { value: "favorited", label: "My Favorited Photos", icon: "⭐" },
];

export default function FilterDropdown({
  currentFilter,
  onFilterChange,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current filter config
  const currentFilterConfig =
    FILTER_OPTIONS.find((opt) => opt.value === currentFilter) ||
    FILTER_OPTIONS[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleFilterSelect = (filter: FilterOption) => {
    onFilterChange(filter);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:border-gray-400 transition-colors shadow-sm"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>{currentFilterConfig.icon}</span>
        <span>{currentFilterConfig.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterSelect(option.value)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                  ${
                    currentFilter === option.value
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <span className="text-xl">{option.icon}</span>
                <span>{option.label}</span>
                {currentFilter === option.value && (
                  <svg
                    className="w-5 h-5 ml-auto text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
