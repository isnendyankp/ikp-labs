/**
 * Pagination Component
 *
 * Reusable pagination controls untuk Gallery list.
 *
 * Features:
 * - Previous/Next buttons
 * - Current page indicator
 * - Disabled state ketika di ujung
 * - Responsive design
 */

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  loading = false
}: PaginationProps) {
  const hasPrevious = currentPage > 0;
  const hasNext = currentPage < totalPages - 1;

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevious || loading}
        className={`
          px-6 py-2 rounded-lg font-medium transition-colors
          ${hasPrevious && !loading
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        ← Previous
      </button>

      {/* Page Indicator */}
      <div className="px-4 py-2 bg-gray-100 rounded-lg">
        <span className="text-sm font-medium text-gray-700">
          Page {currentPage + 1} of {totalPages}
        </span>
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext || loading}
        className={`
          px-6 py-2 rounded-lg font-medium transition-colors
          ${hasNext && !loading
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        Next →
      </button>
    </div>
  );
}
