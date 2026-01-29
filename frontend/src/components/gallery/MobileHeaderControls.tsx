/**
 * MobileHeaderControls Component
 *
 * Icon-only filter and sort controls for mobile gallery header.
 * Displays filter and sort as clickable icons that show dropdown menus.
 *
 * Features:
 * - Filter icon (Search) that opens filter dropdown
 * - Sort icon (Adjustments) that opens sort dropdown
 * - Click outside to close dropdowns
 * - Touch-friendly tap targets (min 44x44px)
 * - ARIA labels for accessibility
 * - Hidden on desktop (sm:hidden)
 *
 * @example
 * ```tsx
 * <MobileHeaderControls
 *   currentFilter="all"
 *   onFilterChange={(filter) => console.log(filter)}
 *   currentSort="newest"
 *   onSortChange={(sort) => console.log(sort)}
 * />
 * ```
 */

"use client";

import { useState, useRef } from "react";
import { Search, Settings2 } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { FilterDropdown, type FilterOption } from "@/components/FilterDropdown";
import { SortByDropdown, type SortByOption } from "@/components/SortByDropdown";

interface MobileHeaderControlsProps {
  /** Currently selected filter option */
  currentFilter: FilterOption;
  /** Callback when filter option changes */
  onFilterChange: (filter: FilterOption) => void;
  /** Currently selected sort option */
  currentSort: SortByOption;
  /** Callback when sort option changes */
  onSortChange: (sort: SortByOption) => void;
}

/**
 * MobileHeaderControls - Icon-only filter and sort controls for mobile
 *
 * Renders two icon buttons in the header:
 * - Filter icon (🔍): Opens filter dropdown with 4 options
 * - Sort icon (⚙️): Opens sort dropdown with 4 options
 *
 * Dropdowns appear below the icons and can be dismissed by clicking outside.
 */
export function MobileHeaderControls({
  currentFilter,
  onFilterChange,
  currentSort,
  onSortChange,
}: MobileHeaderControlsProps) {
  // State for dropdown open/close
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Refs for click outside detection
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Click outside handlers to close dropdowns
  useClickOutside(filterRef, () => setIsFilterOpen(false));
  useClickOutside(sortRef, () => setIsSortOpen(false));

  // Handle filter selection
  const handleFilterChange = (filter: FilterOption) => {
    onFilterChange(filter);
    setIsFilterOpen(false);
  };

  // Handle sort selection
  const handleSortChange = (sort: SortByOption) => {
    onSortChange(sort);
    setIsSortOpen(false);
  };

  return (
    <div className="flex items-center gap-2 sm:hidden">
      {/* Filter Icon Button */}
      <div ref={filterRef} className="relative">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          aria-label="Filter photos"
          aria-haspopup="true"
          aria-expanded={isFilterOpen}
          className="p-3 hover:bg-gray-100 rounded-lg active:scale-95 transition-transform"
        >
          <Search className="w-5 h-5 text-gray-700" strokeWidth={2} />
        </button>

        {/* Filter Dropdown */}
        {isFilterOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border p-2 z-50 min-w-[200px]">
            <FilterDropdown
              currentFilter={currentFilter}
              onFilterChange={handleFilterChange}
              variant="compact"
            />
          </div>
        )}
      </div>

      {/* Sort Icon Button */}
      <div ref={sortRef} className="relative">
        <button
          onClick={() => setIsSortOpen(!isSortOpen)}
          aria-label="Sort photos"
          aria-haspopup="true"
          aria-expanded={isSortOpen}
          className="p-3 hover:bg-gray-100 rounded-lg active:scale-95 transition-transform"
        >
          <Settings2 className="w-5 h-5 text-gray-700" strokeWidth={2} />
        </button>

        {/* Sort Dropdown */}
        {isSortOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border p-2 z-50 min-w-[200px]">
            <SortByDropdown
              currentSort={currentSort}
              onSortChange={handleSortChange}
              variant="compact"
            />
          </div>
        )}
      </div>
    </div>
  );
}
