/**
 * Unit Tests for useScrollRestoration Hook
 *
 * Testing Philosophy: NO MOCKING
 * - Uses real JSDOM environment
 * - Tests hook behavior directly
 * - Uses real sessionStorage
 */

import { renderHook, act } from '@testing-library/react';
import { useScrollRestoration } from '../../hooks/useScrollRestoration';

describe('useScrollRestoration', () => {
  // Clear sessionStorage before each test
  beforeEach(() => {
    sessionStorage.clear();
  });

  // ============================================
  // Return Value Tests
  // ============================================

  describe('Return Values', () => {
    it('should return saveScrollPosition function', () => {
      const { result } = renderHook(() => useScrollRestoration());

      expect(result.current.saveScrollPosition).toBeDefined();
      expect(typeof result.current.saveScrollPosition).toBe('function');
    });

    it('should return restoreScrollPosition function', () => {
      const { result } = renderHook(() => useScrollRestoration());

      expect(result.current.restoreScrollPosition).toBeDefined();
      expect(typeof result.current.restoreScrollPosition).toBe('function');
    });

    it('should return clearScrollPosition function', () => {
      const { result } = renderHook(() => useScrollRestoration());

      expect(result.current.clearScrollPosition).toBeDefined();
      expect(typeof result.current.clearScrollPosition).toBe('function');
    });

    it('should return clearAllScrollPositions function', () => {
      const { result } = renderHook(() => useScrollRestoration());

      expect(result.current.clearAllScrollPositions).toBeDefined();
      expect(typeof result.current.clearAllScrollPositions).toBe('function');
    });
  });

  // ============================================
  // Save Scroll Position Tests
  // ============================================

  describe('saveScrollPosition', () => {
    it('should save scroll position to sessionStorage', () => {
      const { result } = renderHook(() => useScrollRestoration());

      act(() => {
        result.current.saveScrollPosition('all', 1, 'newest');
      });

      const key = 'gallery-scroll-position-all-1-newest';
      const stored = sessionStorage.getItem(key);
      expect(stored).not.toBeNull();

      const data = JSON.parse(stored!);
      expect(data).toHaveProperty('scrollY');
      expect(data).toHaveProperty('timestamp');
    });

    it('should save scroll position with photoId when provided', () => {
      const { result } = renderHook(() => useScrollRestoration());

      act(() => {
        result.current.saveScrollPosition('all', 1, 'newest', 'photo-123');
      });

      const key = 'gallery-scroll-position-all-1-newest';
      const stored = sessionStorage.getItem(key);
      const data = JSON.parse(stored!);

      expect(data.photoId).toBe('photo-123');
    });

    it('should save different positions for different filter/page/sort combinations', () => {
      const { result } = renderHook(() => useScrollRestoration());

      act(() => {
        result.current.saveScrollPosition('all', 1, 'newest');
        result.current.saveScrollPosition('my-photos', 2, 'oldest');
        result.current.saveScrollPosition('liked', 1, 'mostLiked');
      });

      expect(sessionStorage.getItem('gallery-scroll-position-all-1-newest')).not.toBeNull();
      expect(sessionStorage.getItem('gallery-scroll-position-my-photos-2-oldest')).not.toBeNull();
      expect(sessionStorage.getItem('gallery-scroll-position-liked-1-mostLiked')).not.toBeNull();
    });
  });

  // ============================================
  // Restore Scroll Position Tests
  // ============================================

  describe('restoreScrollPosition', () => {
    it('should return false when no position is stored', () => {
      const { result } = renderHook(() => useScrollRestoration());

      let restored: boolean;
      act(() => {
        restored = result.current.restoreScrollPosition('all', 1, 'newest');
      });

      expect(restored!).toBe(false);
    });

    it('should return true and restore position when valid data exists', () => {
      const { result } = renderHook(() => useScrollRestoration());

      // First save a position
      act(() => {
        result.current.saveScrollPosition('all', 1, 'newest');
      });

      // Then restore it
      let restored: boolean;
      act(() => {
        restored = result.current.restoreScrollPosition('all', 1, 'newest');
      });

      expect(restored!).toBe(true);
    });

    it('should remove stored position after restoration', () => {
      const { result } = renderHook(() => useScrollRestoration());

      // Save position
      act(() => {
        result.current.saveScrollPosition('all', 1, 'newest');
      });

      const key = 'gallery-scroll-position-all-1-newest';
      expect(sessionStorage.getItem(key)).not.toBeNull();

      // Restore position
      act(() => {
        result.current.restoreScrollPosition('all', 1, 'newest');
      });

      // Should be removed after restoration
      expect(sessionStorage.getItem(key)).toBeNull();
    });

    it('should return false for expired position (30 minutes old)', () => {
      const { result } = renderHook(() => useScrollRestoration());

      // Save position with old timestamp (31 minutes ago)
      const key = 'gallery-scroll-position-all-1-newest';
      const oldTimestamp = Date.now() - 31 * 60 * 1000; // 31 minutes ago
      const expiredData = {
        scrollY: 500,
        timestamp: oldTimestamp,
      };
      sessionStorage.setItem(key, JSON.stringify(expiredData));

      let restored: boolean;
      act(() => {
        restored = result.current.restoreScrollPosition('all', 1, 'newest');
      });

      expect(restored!).toBe(false);
      // Should be cleaned up
      expect(sessionStorage.getItem(key)).toBeNull();
    });
  });

  // ============================================
  // Clear Scroll Position Tests
  // ============================================

  describe('clearScrollPosition', () => {
    it('should clear specific scroll position', () => {
      const { result } = renderHook(() => useScrollRestoration());

      // Save multiple positions
      act(() => {
        result.current.saveScrollPosition('all', 1, 'newest');
        result.current.saveScrollPosition('my-photos', 1, 'newest');
      });

      // Clear only one
      act(() => {
        result.current.clearScrollPosition('all', 1, 'newest');
      });

      expect(sessionStorage.getItem('gallery-scroll-position-all-1-newest')).toBeNull();
      expect(sessionStorage.getItem('gallery-scroll-position-my-photos-1-newest')).not.toBeNull();
    });

    it('should not throw when clearing non-existent position', () => {
      const { result } = renderHook(() => useScrollRestoration());

      expect(() => {
        act(() => {
          result.current.clearScrollPosition('all', 99, 'newest');
        });
      }).not.toThrow();
    });
  });

  // ============================================
  // Clear All Scroll Positions Tests
  // ============================================

  describe('clearAllScrollPositions', () => {
    it('should clear all scroll positions', () => {
      const { result } = renderHook(() => useScrollRestoration());

      // Save multiple positions
      act(() => {
        result.current.saveScrollPosition('all', 1, 'newest');
        result.current.saveScrollPosition('my-photos', 2, 'oldest');
        result.current.saveScrollPosition('liked', 3, 'mostLiked');
      });

      // Clear all
      act(() => {
        result.current.clearAllScrollPositions();
      });

      expect(sessionStorage.getItem('gallery-scroll-position-all-1-newest')).toBeNull();
      expect(sessionStorage.getItem('gallery-scroll-position-my-photos-2-oldest')).toBeNull();
      expect(sessionStorage.getItem('gallery-scroll-position-liked-3-mostLiked')).toBeNull();
    });

    it('should not clear other sessionStorage items', () => {
      const { result } = renderHook(() => useScrollRestoration());

      // Set a different item
      sessionStorage.setItem('other-key', 'other-value');

      act(() => {
        result.current.clearAllScrollPositions();
      });

      expect(sessionStorage.getItem('other-key')).toBe('other-value');
    });

    it('should not throw when no positions exist', () => {
      const { result } = renderHook(() => useScrollRestoration());

      expect(() => {
        act(() => {
          result.current.clearAllScrollPositions();
        });
      }).not.toThrow();
    });
  });

  // ============================================
  // Hook Stability Tests
  // ============================================

  describe('Hook Stability', () => {
    it('should return stable function references', () => {
      const { result, rerender } = renderHook(() => useScrollRestoration());

      const firstSave = result.current.saveScrollPosition;
      const firstRestore = result.current.restoreScrollPosition;
      const firstClear = result.current.clearScrollPosition;
      const firstClearAll = result.current.clearAllScrollPositions;

      rerender();

      expect(result.current.saveScrollPosition).toBe(firstSave);
      expect(result.current.restoreScrollPosition).toBe(firstRestore);
      expect(result.current.clearScrollPosition).toBe(firstClear);
      expect(result.current.clearAllScrollPositions).toBe(firstClearAll);
    });
  });

  // ============================================
  // Edge Cases Tests
  // ============================================

  describe('Edge Cases', () => {
    it('should handle all filter options', () => {
      const { result } = renderHook(() => useScrollRestoration());
      const filters: Array<'all' | 'my-photos' | 'liked' | 'favorited'> = ['all', 'my-photos', 'liked', 'favorited'];

      filters.forEach((filter) => {
        act(() => {
          result.current.saveScrollPosition(filter, 1, 'newest');
        });
        expect(sessionStorage.getItem(`gallery-scroll-position-${filter}-1-newest`)).not.toBeNull();
      });
    });

    it('should handle all sort options', () => {
      const { result } = renderHook(() => useScrollRestoration());
      const sorts: Array<'newest' | 'oldest' | 'mostLiked' | 'mostFavorited'> = ['newest', 'oldest', 'mostLiked', 'mostFavorited'];

      sorts.forEach((sort) => {
        act(() => {
          result.current.saveScrollPosition('all', 1, sort);
        });
        expect(sessionStorage.getItem(`gallery-scroll-position-all-1-${sort}`)).not.toBeNull();
      });
    });

    it('should handle large page numbers', () => {
      const { result } = renderHook(() => useScrollRestoration());

      act(() => {
        result.current.saveScrollPosition('all', 999, 'newest');
      });

      expect(sessionStorage.getItem('gallery-scroll-position-all-999-newest')).not.toBeNull();
    });

    it('should handle malformed sessionStorage data gracefully', () => {
      const { result } = renderHook(() => useScrollRestoration());

      // Set malformed data
      sessionStorage.setItem('gallery-scroll-position-all-1-newest', 'not-valid-json');

      let restored: boolean;
      expect(() => {
        act(() => {
          restored = result.current.restoreScrollPosition('all', 1, 'newest');
        });
      }).not.toThrow();

      expect(restored!).toBe(false);
    });
  });
});
