/**
 * StickyActionBar Component
 *
 * Wrapper component to make action bar sticky on desktop.
 * Filter and sort controls stick to top when scrolling.
 *
 * Features:
 * - Sticky positioning (sticky top-0)
 * - Background color to prevent content show-through
 * - Z-index 10 (above content, below FAB at z-40)
 * - Hidden on mobile (hidden sm:flex)
 * - Maintains existing action bar layout
 *
 * @example
 * ```tsx
 * <StickyActionBar
 *   currentFilter="all"
 *   onFilterChange={(filter) => console.log(filter)}
 *   currentSort="newest"
 *   onSortChange={(sort) => console.log(sort)}
 * />
 * ```
 */

"use client";

import { FilterDropdown, type FilterOption } from "@/components/FilterDropdown";
import { SortByDropdown, type SortByOption } from "@/components/SortByDropdown";

interface StickyActionBarProps {
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
 * StickyActionBar - Sticky wrapper for desktop action bar
 *
 * Renders filter and sort dropdowns in a sticky container.
 * Sticks to top of viewport when scrolling on desktop.
 * Hidden on mobile devices.
 */
export function StickyActionBar({
  currentFilter,
  onFilterChange,
  currentSort,
  onSortChange,
}: StickyActionBarProps) {
  return (
    <div className="hidden sm:flex sticky top-0 z-10 bg-gray-50 py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
        {/* Left: Filter and Sort Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Filter Dropdown */}
          <FilterDropdown
            currentFilter={currentFilter}
            onFilterChange={onFilterChange}
          />

          {/* Sort By Dropdown */}
          <SortByDropdown
            currentSort={currentSort}
            onSortChange={onSortChange}
          />
        </div>

        {/* Upload button removed - using FABUpload instead */}
      </div>
    </div>
  );
}
