/**
 * Unit Tests for FilterDropdown Component
 *
 * Testing Philosophy: NO MOCKING
 * - Uses real JSDOM environment
 * - Tests component rendering and behavior
 * - NO API calls - only tests UI rendering
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterDropdown, { FilterOption } from '../../components/FilterDropdown';

describe('FilterDropdown', () => {
  const mockOnFilterChange = jest.fn();
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
        <FilterDropdown
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
        />
      );

      expect(screen.getByRole('button', { name: /all photos/i })).toBeInTheDocument();
    });

    it('should not render button in compact variant', () => {
      render(
        <FilterDropdown
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
          variant="compact"
        />
      );

      expect(screen.queryByRole('button', { name: /all photos/i })).not.toBeInTheDocument();
    });

    it('should display current filter label on button', () => {
      render(
        <FilterDropdown
          currentFilter="my-photos"
          onFilterChange={mockOnFilterChange}
        />
      );

      expect(screen.getByText('My Photos')).toBeInTheDocument();
    });

    it('should display current filter icon on button', () => {
      render(
        <FilterDropdown
          currentFilter="liked"
          onFilterChange={mockOnFilterChange}
        />
      );

      expect(screen.getByText('❤️')).toBeInTheDocument();
    });

    it('should have aria-expanded attribute', () => {
      render(
        <FilterDropdown
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
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
        <FilterDropdown
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
        />
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(screen.getByText('My Photos')).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('should close dropdown when button is clicked again', async () => {
      const user = userEvent.setup();
      render(
        <FilterDropdown
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
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
          <FilterDropdown
            currentFilter="all"
            onFilterChange={mockOnFilterChange}
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

    it('should close dropdown when Escape key is pressed', async () => {
      const user = userEvent.setup();
      render(
        <FilterDropdown
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
        />
      );

      const button = screen.getByRole('button');
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{Escape}');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // ============================================
  // Filter Options Tests
  // ============================================

  describe('Filter Options', () => {
    it('should display all filter options when open', async () => {
      const user = userEvent.setup();
      render(
        <FilterDropdown
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
        />
      );

      await user.click(screen.getByRole('button'));

      // All Photos appears in button and dropdown, My Photos only in dropdown
      expect(screen.getByText('My Photos')).toBeInTheDocument();
      expect(screen.getByText('My Liked Photos')).toBeInTheDocument();
      expect(screen.getByText('My Favorited Photos')).toBeInTheDocument();
    });

    it('should display icons for each option', async () => {
      const user = userEvent.setup();
      render(
        <FilterDropdown
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
        />
      );

      await user.click(screen.getByRole('button'));

      // Use getAllByText for items that appear multiple times
      expect(screen.getAllByText('🌐').length).toBeGreaterThan(0);
      expect(screen.getByText('📸')).toBeInTheDocument();
      expect(screen.getByText('❤️')).toBeInTheDocument();
      expect(screen.getByText('⭐')).toBeInTheDocument();
    });

    it('should highlight selected option', async () => {
      const user = userEvent.setup();
      render(
        <FilterDropdown
          currentFilter="liked"
          onFilterChange={mockOnFilterChange}
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
    it('should call onFilterChange when option is clicked', async () => {
      const user = userEvent.setup();
      render(
        <FilterDropdown
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
        />
      );

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('My Photos'));

      expect(mockOnFilterChange).toHaveBeenCalledWith('my-photos');
    });

    it('should close dropdown after selection', async () => {
      const user = userEvent.setup();
      render(
        <FilterDropdown
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
        />
      );

      const button = screen.getByRole('button');
      await user.click(button);
      await user.click(screen.getByText('My Liked Photos'));

      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('should handle each filter option selection', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <FilterDropdown
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
        />
      );

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('My Photos'));
      expect(mockOnFilterChange).toHaveBeenCalledWith('my-photos');

      rerender(
        <FilterDropdown
          currentFilter="my-photos"
          onFilterChange={mockOnFilterChange}
        />
      );

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('My Liked Photos'));
      expect(mockOnFilterChange).toHaveBeenCalledWith('liked');

      rerender(
        <FilterDropdown
          currentFilter="liked"
          onFilterChange={mockOnFilterChange}
        />
      );

      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('My Favorited Photos'));
      expect(mockOnFilterChange).toHaveBeenCalledWith('favorited');
    });
  });

  // ============================================
  // Controlled Mode Tests
  // ============================================

  describe('Controlled Mode', () => {
    it('should use controlled isOpen state', () => {
      render(
        <FilterDropdown
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
          isOpen={true}
          onOpenChange={mockOnOpenChange}
        />
      );

      // Dropdown should be open without clicking
      expect(screen.getByText('My Photos')).toBeInTheDocument();
    });

    it('should call onOpenChange when button is clicked in controlled mode', async () => {
      const user = userEvent.setup();
      render(
        <FilterDropdown
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
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
          <FilterDropdown
            currentFilter="all"
            onFilterChange={mockOnFilterChange}
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
    it('should default to first option for invalid currentFilter', () => {
      render(
        <FilterDropdown
          currentFilter={'invalid' as FilterOption}
          onFilterChange={mockOnFilterChange}
        />
      );

      expect(screen.getByText('All Photos')).toBeInTheDocument();
    });

    it('should handle rapid open/close clicks', async () => {
      const user = userEvent.setup();
      render(
        <FilterDropdown
          currentFilter="all"
          onFilterChange={mockOnFilterChange}
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
