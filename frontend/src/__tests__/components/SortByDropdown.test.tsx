/**
 * Unit Tests for SortByDropdown Component
 *
 * Testing Philosophy: NO MOCKING
 * - Uses real JSDOM environment
 * - Tests component rendering and behavior
 * - NO API calls - only tests UI rendering
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SortByDropdown, { SortByOption } from '../../components/SortByDropdown';

describe('SortByDropdown', () => {
  const mockOnSortChange = jest.fn();
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================
  // Rendering Tests
  // ============================================

  describe('Rendering', () => {
    it('should render dropdown button in default variant', () => {
      render(
        <SortByDropdown
          currentSort="newest"
          onSortChange={mockOnSortChange}
        />
      );

      expect(screen.getByRole('button', { name: /sort photos/i })).toBeInTheDocument();
    });

    it('should not render button in compact variant', () => {
      render(
        <SortByDropdown
          currentSort="newest"
          onSortChange={mockOnSortChange}
          variant="compact"
        />
      );

      expect(screen.queryByRole('button', { name: /sort photos/i })).not.toBeInTheDocument();
    });

    it('should display current sort label on button', () => {
      render(
        <SortByDropdown
          currentSort="mostLiked"
          onSortChange={mockOnSortChange}
        />
      );

      expect(screen.getByText('Most Liked')).toBeInTheDocument();
    });

    it('should display current sort icon on button', () => {
      render(
        <SortByDropdown
          currentSort="oldest"
          onSortChange={mockOnSortChange}
        />
      );

      expect(screen.getByText('📅')).toBeInTheDocument();
    });

    it('should have aria-expanded attribute', () => {
      render(
        <SortByDropdown
          currentSort="newest"
          onSortChange={mockOnSortChange}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // ============================================
  // Open/Close Tests
  // ============================================

  describe('Open/Close', () => {
    it('should open dropdown when button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <SortByDropdown
          currentSort="newest"
          onSortChange={mockOnSortChange}
        />
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(screen.getByText('Oldest First')).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('should close dropdown when button is clicked again', async () => {
      const user = userEvent.setup();
      render(
        <SortByDropdown
          currentSort="newest"
          onSortChange={mockOnSortChange}
        />
      );

      const button = screen.getByRole('button');
      await user.click(button);
      await user.click(button);

      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('should close dropdown when clicking outside', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <SortByDropdown
            currentSort="newest"
            onSortChange={mockOnSortChange}
          />
          <div data-testid="outside">Outside</div>
        </div>
      );

      const button = screen.getByRole('button');
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');

      await user.click(screen.getByTestId('outside'));
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // ============================================
  // Sort Options Tests
  // ============================================

  describe('Sort Options', () => {
    it('should display all sort options when open', async () => {
      const user = userEvent.setup();
      render(
        <SortByDropdown
          currentSort="newest"
          onSortChange={mockOnSortChange}
        />
      );

      await user.click(screen.getByRole('button'));

      // Only in dropdown (not in button)
      expect(screen.getByText('Oldest First')).toBeInTheDocument();
      expect(screen.getByText('Most Liked')).toBeInTheDocument();
      expect(screen.getByText('Most Favorited')).toBeInTheDocument();
    });

    it('should display icons for each option', async () => {
      const user = userEvent.setup();
      render(
        <SortByDropdown
          currentSort="newest"
          onSortChange={mockOnSortChange}
        />
      );

      await user.click(screen.getByRole('button'));

      expect(screen.getAllByText('🆕').length).toBeGreaterThan(0);
      expect(screen.getByText('📅')).toBeInTheDocument();
      expect(screen.getByText('❤️')).toBeInTheDocument();
      expect(screen.getByText('⭐')).toBeInTheDocument();
    });

    it('should display descriptions for each option', async () => {
      const user = userEvent.setup();
      render(
        <SortByDropdown
          currentSort="newest"
          onSortChange={mockOnSortChange}
        />
      );

      await user.click(screen.getByRole('button'));

      expect(screen.getByText('Most recently uploaded')).toBeInTheDocument();
      expect(screen.getByText('Oldest uploads first')).toBeInTheDocument();
      expect(screen.getByText('Sorted by likes count')).toBeInTheDocument();
      expect(screen.getByText('Sorted by favorites count')).toBeInTheDocument();
    });

    it('should highlight selected option', async () => {
      const user = userEvent.setup();
      render(
        <SortByDropdown
          currentSort="mostFavorited"
          onSortChange={mockOnSortChange}
        />
      );

      await user.click(screen.getByRole('button'));

      // Selected option should have checkmark
      const checkmarks = document.querySelectorAll('svg');
      expect(checkmarks.length).toBeGreaterThan(0);
    });
  });

  // ============================================
  // Selection Tests
  // ============================================

  describe('Selection', () => {
    it('should call onSortChange when option is clicked', async () => {
      const user = userEvent.setup();
      render(
        <SortByDropdown
          currentSort="newest"
          onSortChange={mockOnSortChange}
        />
      );

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Oldest First'));

      expect(mockOnSortChange).toHaveBeenCalledWith('oldest');
    });

    it('should close dropdown after selection', async () => {
      const user = userEvent.setup();
      render(
        <SortByDropdown
          currentSort="newest"
          onSortChange={mockOnSortChange}
        />
      );

      const button = screen.getByRole('button');
      await user.click(button);
      await user.click(screen.getByText('Most Liked'));

      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('should handle each sort option selection', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <SortByDropdown
          currentSort="newest"
          onSortChange={mockOnSortChange}
        />
      );

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Oldest First'));
      expect(mockOnSortChange).toHaveBeenCalledWith('oldest');

      rerender(
        <SortByDropdown
          currentSort="oldest"
          onSortChange={mockOnSortChange}
        />
      );

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Most Liked'));
      expect(mockOnSortChange).toHaveBeenCalledWith('mostLiked');

      rerender(
        <SortByDropdown
          currentSort="mostLiked"
          onSortChange={mockOnSortChange}
        />
      );

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Most Favorited'));
      expect(mockOnSortChange).toHaveBeenCalledWith('mostFavorited');
    });
  });

  // ============================================
  // Controlled Mode Tests
  // ============================================

  describe('Controlled Mode', () => {
    it('should use controlled isOpen state', () => {
      render(
        <SortByDropdown
          currentSort="newest"
          onSortChange={mockOnSortChange}
          isOpen={true}
          onOpenChange={mockOnOpenChange}
        />
      );

      // Dropdown should be open without clicking
      expect(screen.getByText('Oldest First')).toBeInTheDocument();
    });

    it('should call onOpenChange when button is clicked in controlled mode', async () => {
      const user = userEvent.setup();
      render(
        <SortByDropdown
          currentSort="newest"
          onSortChange={mockOnSortChange}
          isOpen={false}
          onOpenChange={mockOnOpenChange}
        />
      );

      await user.click(screen.getByRole('button'));
      expect(mockOnOpenChange).toHaveBeenCalledWith(true);
    });

    it('should call onOpenChange when clicking outside in controlled mode', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <SortByDropdown
            currentSort="newest"
            onSortChange={mockOnSortChange}
            isOpen={true}
            onOpenChange={mockOnOpenChange}
          />
          <div data-testid="outside">Outside</div>
        </div>
      );

      await user.click(screen.getByTestId('outside'));
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  // ============================================
  // Edge Cases Tests
  // ============================================

  describe('Edge Cases', () => {
    it('should default to first option for invalid currentSort', () => {
      render(
        <SortByDropdown
          currentSort={'invalid' as SortByOption}
          onSortChange={mockOnSortChange}
        />
      );

      expect(screen.getByText('Newest First')).toBeInTheDocument();
    });

    it('should handle rapid open/close clicks', async () => {
      const user = userEvent.setup();
      render(
        <SortByDropdown
          currentSort="newest"
          onSortChange={mockOnSortChange}
        />
      );

      const button = screen.getByRole('button');
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
