/**
 * Unit Tests for Pagination Component
 *
 * Testing Philosophy: NO MOCKING
 * - Uses real JSDOM environment
 * - Tests component rendering and behavior
 * - NO API calls - only tests UI rendering
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../../../components/gallery/Pagination';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================
  // Rendering Tests
  // ============================================

  describe('Rendering', () => {
    it('should render previous and next buttons', () => {
      render(
        <Pagination
          currentPage={0}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('should render page indicator', () => {
      render(
        <Pagination
          currentPage={0}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText(/page 1 of 5/i)).toBeInTheDocument();
    });

    it('should display correct page number (1-indexed)', () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      // currentPage is 0-indexed, so 2 = Page 3
      expect(screen.getByText(/page 3 of 10/i)).toBeInTheDocument();
    });
  });

  // ============================================
  // Previous Button Tests
  // ============================================

  describe('Previous Button', () => {
    it('should be disabled on first page', () => {
      render(
        <Pagination
          currentPage={0}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const prevButton = screen.getByRole('button', { name: /previous/i });
      expect(prevButton).toBeDisabled();
    });

    it('should be enabled when not on first page', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const prevButton = screen.getByRole('button', { name: /previous/i });
      expect(prevButton).not.toBeDisabled();
    });

    it('should call onPageChange with previous page when clicked', async () => {
      const user = userEvent.setup();
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const prevButton = screen.getByRole('button', { name: /previous/i });
      await user.click(prevButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(1);
    });
  });

  // ============================================
  // Next Button Tests
  // ============================================

  describe('Next Button', () => {
    it('should be disabled on last page', () => {
      render(
        <Pagination
          currentPage={4}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByRole('button', { name: /next/i });
      expect(nextButton).toBeDisabled();
    });

    it('should be enabled when not on last page', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByRole('button', { name: /next/i });
      expect(nextButton).not.toBeDisabled();
    });

    it('should call onPageChange with next page when clicked', async () => {
      const user = userEvent.setup();
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(3);
    });
  });

  // ============================================
  // Loading State Tests
  // ============================================

  describe('Loading State', () => {
    it('should disable both buttons when loading', () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
          loading={true}
        />
      );

      const prevButton = screen.getByRole('button', { name: /previous/i });
      const nextButton = screen.getByRole('button', { name: /next/i });

      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it('should disable previous button on first page with loading', () => {
      render(
        <Pagination
          currentPage={0}
          totalPages={5}
          onPageChange={mockOnPageChange}
          loading={true}
        />
      );

      const prevButton = screen.getByRole('button', { name: /previous/i });
      expect(prevButton).toBeDisabled();
    });

    it('should disable next button on last page with loading', () => {
      render(
        <Pagination
          currentPage={4}
          totalPages={5}
          onPageChange={mockOnPageChange}
          loading={true}
        />
      );

      const nextButton = screen.getByRole('button', { name: /next/i });
      expect(nextButton).toBeDisabled();
    });
  });

  // ============================================
  // Edge Cases Tests
  // ============================================

  describe('Edge Cases', () => {
    it('should handle single page correctly', () => {
      render(
        <Pagination
          currentPage={0}
          totalPages={1}
          onPageChange={mockOnPageChange}
        />
      );

      const prevButton = screen.getByRole('button', { name: /previous/i });
      const nextButton = screen.getByRole('button', { name: /next/i });

      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
      expect(screen.getByText(/page 1 of 1/i)).toBeInTheDocument();
    });

    it('should handle two pages correctly - first page', () => {
      render(
        <Pagination
          currentPage={0}
          totalPages={2}
          onPageChange={mockOnPageChange}
        />
      );

      const prevButton = screen.getByRole('button', { name: /previous/i });
      const nextButton = screen.getByRole('button', { name: /next/i });

      expect(prevButton).toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });

    it('should handle two pages correctly - last page', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={2}
          onPageChange={mockOnPageChange}
        />
      );

      const prevButton = screen.getByRole('button', { name: /previous/i });
      const nextButton = screen.getByRole('button', { name: /next/i });

      expect(prevButton).not.toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it('should handle large page numbers correctly', () => {
      render(
        <Pagination
          currentPage={99}
          totalPages={100}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText(/page 100 of 100/i)).toBeInTheDocument();
    });
  });

  // ============================================
  // Navigation Flow Tests
  // ============================================

  describe('Navigation Flow', () => {
    it('should allow navigating forward through pages', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <Pagination
          currentPage={0}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      // Click next on page 1
      await user.click(screen.getByRole('button', { name: /next/i }));
      expect(mockOnPageChange).toHaveBeenCalledWith(1);

      // Simulate page change
      rerender(
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      // Click next on page 2
      await user.click(screen.getByRole('button', { name: /next/i }));
      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it('should allow navigating backward through pages', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <Pagination
          currentPage={2}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      // Click previous on page 3
      await user.click(screen.getByRole('button', { name: /previous/i }));
      expect(mockOnPageChange).toHaveBeenCalledWith(1);

      // Simulate page change
      rerender(
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      // Click previous on page 2
      await user.click(screen.getByRole('button', { name: /previous/i }));
      expect(mockOnPageChange).toHaveBeenCalledWith(0);
    });
  });
});
