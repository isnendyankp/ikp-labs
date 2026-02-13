/**
 * Unit Tests for EmptyState Component
 *
 * Testing Philosophy: NO MOCKING
 * - Uses real JSDOM environment
 * - Tests component rendering and behavior
 * - NO API calls - only tests UI rendering
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '../../../components/ui/EmptyState';

describe('EmptyState', () => {
  // ============================================
  // Rendering Tests
  // ============================================

  describe('Rendering', () => {
    it('should render title', () => {
      render(<EmptyState title="No photos found" />);

      expect(screen.getByText('No photos found')).toBeInTheDocument();
    });

    it('should render title as heading', () => {
      render(<EmptyState title="Empty Gallery" />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Empty Gallery');
    });

    it('should render message when provided', () => {
      render(
        <EmptyState
          title="No results"
          message="Try adjusting your filters"
        />
      );

      expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();
    });

    it('should not render message when not provided', () => {
      render(<EmptyState title="No data" />);

      // Component should only have the title
      const container = screen.getByText('No data').closest('div');
      expect(container?.textContent).toBe('No data');
    });

    it('should render string icon', () => {
      render(
        <EmptyState
          icon="📷"
          title="No photos"
        />
      );

      expect(screen.getByText('📷')).toBeInTheDocument();
    });

    it('should render React node icon', () => {
      const CustomIcon = () => <span data-testid="custom-icon">Icon</span>;
      render(
        <EmptyState
          icon={<CustomIcon />}
          title="No items"
        />
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('should not render icon when not provided', () => {
      render(<EmptyState title="Simple title" />);

      // Check that no emoji/icon is rendered
      const container = screen.getByRole('heading', { level: 3 }).parentElement;
      expect(container?.querySelector('.text-6xl')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // Action Button Tests
  // ============================================

  describe('Action Button', () => {
    it('should render action button when actionText and onAction are provided', () => {
      render(
        <EmptyState
          title="No photos"
          actionText="Upload Photo"
          onAction={() => {}}
        />
      );

      expect(screen.getByRole('button', { name: /upload photo/i })).toBeInTheDocument();
    });

    it('should not render action button when actionText is missing', () => {
      render(
        <EmptyState
          title="No photos"
          onAction={() => {}}
        />
      );

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should not render action button when onAction is missing', () => {
      render(
        <EmptyState
          title="No photos"
          actionText="Upload Photo"
        />
      );

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should call onAction when button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnAction = jest.fn();

      render(
        <EmptyState
          title="No photos"
          actionText="Add Photo"
          onAction={mockOnAction}
        />
      );

      const button = screen.getByRole('button', { name: /add photo/i });
      await user.click(button);

      expect(mockOnAction).toHaveBeenCalledTimes(1);
    });

    it('should apply actionButtonProps to the button', () => {
      render(
        <EmptyState
          title="No photos"
          actionText="Upload"
          onAction={() => {}}
          actionButtonProps={{ disabled: true, 'data-testid': 'action-btn' }}
        />
      );

      const button = screen.getByRole('button', { name: /upload/i });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('data-testid', 'action-btn');
    });
  });

  // ============================================
  // Custom ClassName Tests
  // ============================================

  describe('Custom ClassName', () => {
    it('should apply custom className', () => {
      render(
        <EmptyState
          title="No data"
          className="custom-class another-class"
        />
      );

      const container = screen.getByText('No data').closest('div');
      expect(container).toHaveClass('custom-class');
      expect(container).toHaveClass('another-class');
    });
  });

  // ============================================
  // Accessibility Tests
  // ============================================

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<EmptyState title="Empty State Title" />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
    });

    it('should render icon with role="img" for string icons', () => {
      render(
        <EmptyState
          icon="📷"
          title="No photos"
        />
      );

      const iconElement = screen.getByRole('img');
      expect(iconElement).toHaveTextContent('📷');
    });
  });

  // ============================================
  // Edge Cases Tests
  // ============================================

  describe('Edge Cases', () => {
    it('should handle long title gracefully', () => {
      const longTitle = 'This is a very long title that might overflow but should still render correctly';
      render(<EmptyState title={longTitle} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle long message gracefully', () => {
      const longMessage = 'This is a very long description message that provides additional context about why there is no data to display and what the user can do to resolve this situation.';
      render(
        <EmptyState
          title="No data"
          message={longMessage}
        />
      );

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('should render with minimal props (only title)', () => {
      render(<EmptyState title="Minimal" />);

      expect(screen.getByText('Minimal')).toBeInTheDocument();
    });

    it('should render with all props', () => {
      const mockOnAction = jest.fn();

      render(
        <EmptyState
          icon="📷"
          title="No photos yet"
          message="Start by uploading your first photo"
          actionText="Upload Photo"
          onAction={mockOnAction}
          className="custom-empty-state"
        />
      );

      expect(screen.getByText('📷')).toBeInTheDocument();
      expect(screen.getByText('No photos yet')).toBeInTheDocument();
      expect(screen.getByText('Start by uploading your first photo')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /upload photo/i })).toBeInTheDocument();
    });
  });
});
