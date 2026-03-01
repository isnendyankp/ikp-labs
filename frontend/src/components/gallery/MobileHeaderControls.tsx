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
 * - Touch-friendly tap targets (44x44px with p-3 padding)
 * - ARIA labels for accessibility
 * - Focus ring for keyboard navigation
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

import { useState } from "react";
import { Filter, Settings2 } from "lucide-react";
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

  // Handle filter button click with stopPropagation to prevent race condition
  const handleFilterButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFilterOpen(!isFilterOpen);
  };

  // Handle sort button click with stopPropagation to prevent race condition
  const handleSortButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSortOpen(!isSortOpen);
  };

  return (
    <div className="flex items-center gap-1 sm:hidden">
      {/* Filter Icon Button with Dropdown */}
      <div className="relative">
        {/* Filter Icon Button */}
        <button
          onClick={handleFilterButtonClick}
          aria-label="Filter photos"
          aria-haspopup="true"
          aria-expanded={isFilterOpen}
          className="p-3 hover:bg-gray-100 rounded-lg active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Filter className="w-5 h-5 text-gray-700" strokeWidth={2} />
        </button>
        {/* Filter Dropdown - appears when button is clicked */}
        <FilterDropdown
          currentFilter={currentFilter}
          onFilterChange={handleFilterChange}
          variant="compact"
          isOpen={isFilterOpen}
          onOpenChange={setIsFilterOpen}
        />
      </div>

      {/* Sort Icon Button with Dropdown */}
      <div className="relative">
        {/* Sort Icon Button */}
        <button
          onClick={handleSortButtonClick}
          aria-label="Sort photos"
          aria-haspopup="true"
          aria-expanded={isSortOpen}
          className="p-3 hover:bg-gray-100 rounded-lg active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Settings2 className="w-5 h-5 text-gray-700" strokeWidth={2} />
        </button>
        {/* Sort Dropdown - appears when button is clicked */}
        <SortByDropdown
          currentSort={currentSort}
          onSortChange={handleSortChange}
          variant="compact"
          isOpen={isSortOpen}
          onOpenChange={setIsSortOpen}
        />
      </div>
    </div>
  );
}
