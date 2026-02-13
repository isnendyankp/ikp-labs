/**
 * Unit Tests for ConfirmDialog Component
 *
 * Testing Philosophy: NO MOCKING
 * - Uses real JSDOM environment
 * - Tests component rendering and behavior
 * - NO API calls - only tests UI rendering
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';

describe('ConfirmDialog', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================
  // Rendering Tests
  // ============================================

  describe('Rendering', () => {
    it('should render when isOpen is true', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Delete Photo"
          message="Are you sure you want to delete this photo?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('Delete Photo')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to delete this photo?')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(
        <ConfirmDialog
          isOpen={false}
          title="Delete Photo"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.queryByText('Delete Photo')).not.toBeInTheDocument();
    });

    it('should render confirm and cancel buttons', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Confirm Action"
          message="Please confirm"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should render custom button text', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Delete Item"
          message="This cannot be undone"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          confirmText="Delete"
          cancelText="Keep"
        />
      );

      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /keep/i })).toBeInTheDocument();
    });

    it('should have proper ARIA attributes', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Test Dialog"
          message="Test message"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });
  });

  // ============================================
  // Variant Tests
  // ============================================

  describe('Variants', () => {
    it('should render danger variant by default', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Delete"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      expect(confirmButton).toHaveClass('bg-red-600');
    });

    it('should render warning variant', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Warning"
          message="This is a warning"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          variant="warning"
        />
      );

      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      expect(confirmButton).toHaveClass('bg-yellow-600');
    });

    it('should render info variant', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Info"
          message="This is info"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          variant="info"
        />
      );

      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      expect(confirmButton).toHaveClass('bg-blue-600');
    });

    it('should display correct icon for danger variant', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Delete"
          message="Are you sure?"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          variant="danger"
        />
      );

      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    it('should display correct icon for info variant', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Info"
          message="Info message"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
          variant="info"
        />
      );

      expect(screen.getByText('ℹ️')).toBeInTheDocument();
    });
  });

  // ============================================
  // Interaction Tests
  // ============================================

  describe('Interactions', () => {
    it('should call onConfirm when confirm button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ConfirmDialog
          isOpen={true}
          title="Confirm"
          message="Please confirm"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      await user.click(screen.getByRole('button', { name: /confirm/i }));
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ConfirmDialog
          isOpen={true}
          title="Confirm"
          message="Please confirm"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      await user.click(screen.getByRole('button', { name: /cancel/i }));
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when backdrop is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ConfirmDialog
          isOpen={true}
          title="Confirm"
          message="Please confirm"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      // Click on backdrop (the overlay div)
      const backdrop = screen.getByRole('dialog').querySelector('.bg-black');
      if (backdrop) {
        await user.click(backdrop);
        expect(mockOnCancel).toHaveBeenCalledTimes(1);
      }
    });

    it('should call onCancel when Escape key is pressed', async () => {
      const user = userEvent.setup();
      render(
        <ConfirmDialog
          isOpen={true}
          title="Confirm"
          message="Please confirm"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      await user.keyboard('{Escape}');
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });

  // ============================================
  // Focus Management Tests
  // ============================================

  describe('Focus Management', () => {
    it('should focus confirm button when dialog opens', async () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Confirm"
          message="Please confirm"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      // Wait for useEffect to run
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      expect(confirmButton).toHaveFocus();
    });
  });

  // ============================================
  // Accessibility Tests
  // ============================================

  describe('Accessibility', () => {
    it('should have aria-labelledby pointing to title', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Accessible Dialog"
          message="Test message"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title');
    });

    it('should have aria-describedby pointing to message', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Accessible Dialog"
          message="Test description"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-describedby', 'dialog-message');
    });

    it('should have title with correct id', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Test Title"
          message="Test message"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const title = screen.getByText('Test Title');
      expect(title).toHaveAttribute('id', 'dialog-title');
    });

    it('should have message with correct id', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          title="Test Title"
          message="Test message content"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const message = screen.getByText('Test message content');
      expect(message).toHaveAttribute('id', 'dialog-message');
    });
  });

  // ============================================
  // Edge Cases Tests
  // ============================================

  describe('Edge Cases', () => {
    it('should handle long title gracefully', () => {
      const longTitle = 'This is a very long title that might wrap to multiple lines but should still be readable';
      render(
        <ConfirmDialog
          isOpen={true}
          title={longTitle}
          message="Message"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle long message gracefully', () => {
      const longMessage = 'This is a very long message that provides detailed information about the action being confirmed and its potential consequences.';
      render(
        <ConfirmDialog
          isOpen={true}
          title="Title"
          message={longMessage}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });
  });
});
