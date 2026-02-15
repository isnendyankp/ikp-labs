/**
 * useScrollRestoration Hook
 *
 * Manages scroll position persistence for the gallery page.
 * Stores scroll position before navigation and restores it when returning.
 *
 * Features:
 * - Saves scroll position to sessionStorage
 * - Restores scroll position with expiration (30 minutes)
 * - Key includes filter/page/sort for uniqueness
 * - Works for both mobile and desktop
 *
 * @example
 * ```tsx
 * const { saveScrollPosition, restoreScrollPosition } = useScrollRestoration();
 *
 * // Save before navigation
 * saveScrollPosition('all', 1, 'newest');
 *
 * // Restore on mount
 * restoreScrollPosition('all', 1, 'newest');
 * ```
 */

import { useCallback } from "react";

export type FilterOption = "all" | "my-photos" | "liked" | "favorited";
export type SortByOption = "newest" | "oldest" | "mostLiked" | "mostFavorited";

interface ScrollPositionData {
  scrollY: number;
  timestamp: number;
  photoId?: string;
}

const STORAGE_PREFIX = "gallery-scroll-position";
const EXPIRATION_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Get storage key for scroll position
 * Includes filter, page, and sort to ensure uniqueness
 */
function getStorageKey(
  filter: FilterOption,
  page: number,
  sort: SortByOption,
): string {
  return `${STORAGE_PREFIX}-${filter}-${page}-${sort}`;
}

/**
 * Hook for managing scroll position restoration
 * Uses sessionStorage to persist scroll position across navigation
 */
export function useScrollRestoration() {
  /**
   * Save current scroll position to sessionStorage
   * @param filter - Current filter option
   * @param page - Current page number
   * @param sort - Current sort option
   * @param photoId - Optional photo ID being viewed
   */
  const saveScrollPosition = useCallback(
    (
      filter: FilterOption,
      page: number,
      sort: SortByOption,
      photoId?: string,
    ) => {
      if (typeof window === "undefined") return;

      try {
        const key = getStorageKey(filter, page, sort);
        const data: ScrollPositionData = {
          scrollY: window.scrollY,
          timestamp: Date.now(),
          photoId,
        };
        sessionStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.warn("Failed to save scroll position:", error);
      }
    },
    [],
  );

  /**
   * Restore scroll position from sessionStorage
   * Only restores if:
   * - Data exists for the given filter/page/sort combination
   * - Data is less than 30 minutes old
   *
   * @param filter - Current filter option
   * @param page - Current page number
   * @param sort - Current sort option
   * @returns true if position was restored, false otherwise
   */
  const restoreScrollPosition = useCallback(
    (filter: FilterOption, page: number, sort: SortByOption): boolean => {
      if (typeof window === "undefined") return false;

      try {
        const key = getStorageKey(filter, page, sort);
        const stored = sessionStorage.getItem(key);

        if (!stored) return false;

        const data: ScrollPositionData = JSON.parse(stored);

        // Check if data has expired
        const isExpired = Date.now() - data.timestamp > EXPIRATION_MS;

        if (isExpired) {
          sessionStorage.removeItem(key);
          return false;
        }

        // Restore scroll position
        window.scrollTo({
          top: data.scrollY,
          behavior: "instant", // Use instant to avoid animation
        });

        // Clean up after restoration
        sessionStorage.removeItem(key);

        return true;
      } catch (error) {
        console.warn("Failed to restore scroll position:", error);
        return false;
      }
    },
    [],
  );

  /**
   * Clear stored scroll position for a specific filter/page/sort combination
   * Useful when filter/sort/page changes
   */
  const clearScrollPosition = useCallback(
    (filter: FilterOption, page: number, sort: SortByOption) => {
      if (typeof window === "undefined") return;

      try {
        const key = getStorageKey(filter, page, sort);
        sessionStorage.removeItem(key);
      } catch (error) {
        console.warn("Failed to clear scroll position:", error);
      }
    },
    [],
  );

  /**
   * Clear all stored scroll positions
   * Useful for cleanup or logout
   */
  const clearAllScrollPositions = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach((key) => {
        if (key.startsWith(STORAGE_PREFIX)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn("Failed to clear scroll positions:", error);
    }
  }, []);

  return {
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition,
    clearAllScrollPositions,
  };
}
