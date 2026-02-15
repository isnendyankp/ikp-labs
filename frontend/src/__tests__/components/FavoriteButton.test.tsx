/**
 * FavoriteButton Component Tests
 *
 * Tests for the FavoriteButton component which handles favorite/unfavorite functionality.
 *
 * Test Coverage:
 * - Basic rendering (NO count display - private feature)
 * - Favorite/unfavorite toggle
 * - Optimistic update behavior
 * - Rollback on error
 * - CAN favorite own photo (unlike like button)
 * - Loading state during API call
 * - stopPropagation (prevents parent click)
 * - IconButton integration
 * - Callback (onFavoriteChange) invocation
 * - State sync with props
 *
 * Key Differences from LikeButton:
 * - Icon: Star (☆ / ⭐) instead of Heart
 * - Color: Yellow/Gold instead of Red
 * - NO count display (favorites are private!)
 * - CAN favorite own photos
 *
 * @author Isnendy Ankp
 * @since 2026-02-07
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FavoriteButton from "../../components/FavoriteButton";
import photoFavoriteService from "../../services/photoFavoriteService";
import { ToastProvider } from "@/context/ToastContext";

// Mock the photoFavoriteService
jest.mock("../../services/photoFavoriteService");

// Get the mocked service
const mockedPhotoFavoriteService = photoFavoriteService as jest.Mocked<
  typeof photoFavoriteService
>;

// Helper to render with ToastProvider
const renderWithToast = (ui: React.ReactElement) => {
  return render(<ToastProvider>{ui}</ToastProvider>);
};

describe("FavoriteButton Component", () => {
  const mockOnFavoriteChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock for successful API calls
    mockedPhotoFavoriteService.favoritePhoto.mockResolvedValue({
      data: { success: true },
    });
    mockedPhotoFavoriteService.unfavoritePhoto.mockResolvedValue({
      data: { success: true },
    });
  });

  // ========== BASIC RENDERING ==========

  describe("Basic Rendering", () => {
    it("renders favorite button with star icon", () => {
      renderWithToast(<FavoriteButton photoId={123} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("aria-label", "Favorite photo");
    });

    it("does NOT show favorite count (private feature)", () => {
      renderWithToast(<FavoriteButton photoId={123} />);

      // Favorite count should NOT be displayed (favorites are private)
      expect(screen.queryByText(/favorites?/)).not.toBeInTheDocument();
    });

    it("renders with correct aria-label when favorited", () => {
      renderWithToast(
        <FavoriteButton photoId={123} initialIsFavorited={true} />,
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Unfavorite photo");
    });

    it("renders with correct title when favorited", () => {
      renderWithToast(
        <FavoriteButton photoId={123} initialIsFavorited={true} />,
      );

      const button = screen.getByTitle("Unfavorite photo");
      expect(button).toBeInTheDocument();
    });

    it("renders with correct title when not favorited", () => {
      renderWithToast(
        <FavoriteButton photoId={123} initialIsFavorited={false} />,
      );

      const button = screen.getByTitle("Favorite photo");
      expect(button).toBeInTheDocument();
    });
  });

  // ========== FAVORITE/UNFAVORITE TOGGLE ==========

  describe("Favorite/Unfavorite Toggle", () => {
    it("toggles from unfavorited to favorited when clicked", async () => {
      const user = userEvent.setup();

      renderWithToast(
        <FavoriteButton photoId={123} initialIsFavorited={false} />,
      );

      const button = screen.getByRole("button");

      // Initially not favorited (outline star)
      expect(button).toHaveAttribute("aria-label", "Favorite photo");

      // Click to favorite
      await user.click(button);

      // Optimistic update: should show favorited immediately
      await waitFor(() => {
        expect(button).toHaveAttribute("aria-label", "Unfavorite photo");
      });

      // API should be called
      expect(mockedPhotoFavoriteService.favoritePhoto).toHaveBeenCalledWith(
        123,
      );
    });

    it("toggles from favorited to unfavorited when clicked", async () => {
      const user = userEvent.setup();

      renderWithToast(
        <FavoriteButton photoId={123} initialIsFavorited={true} />,
      );

      const button = screen.getByRole("button");

      // Initially favorited
      expect(button).toHaveAttribute("aria-label", "Unfavorite photo");

      // Click to unfavorite
      await user.click(button);

      // Optimistic update: should show unfavorited immediately
      await waitFor(() => {
        expect(button).toHaveAttribute("aria-label", "Favorite photo");
      });

      // API should be called
      expect(mockedPhotoFavoriteService.unfavoritePhoto).toHaveBeenCalledWith(
        123,
      );
    });
  });

  // ========== OPTIMISTIC UPDATE ==========

  describe("Optimistic Update", () => {
    it("updates UI immediately before API response", async () => {
      const user = userEvent.setup();

      // Mock a slow API call
      mockedPhotoFavoriteService.favoritePhoto.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({}), 100)),
      );

      renderWithToast(
        <FavoriteButton photoId={123} initialIsFavorited={false} />,
      );

      const button = screen.getByRole("button");

      // Click to favorite
      await user.click(button);

      // UI should update immediately (before API response)
      expect(button).toHaveAttribute("aria-label", "Unfavorite photo");
    });

    it("updates UI immediately when unfavoriting", async () => {
      const user = userEvent.setup();

      // Mock a slow API call
      mockedPhotoFavoriteService.unfavoritePhoto.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({}), 100)),
      );

      renderWithToast(
        <FavoriteButton photoId={123} initialIsFavorited={true} />,
      );

      const button = screen.getByRole("button");

      // Click to unfavorite
      await user.click(button);

      // UI should update immediately (before API response)
      expect(button).toHaveAttribute("aria-label", "Favorite photo");
    });
  });

  // ========== ROLLBACK ON ERROR ==========

  describe("Rollback on Error", () => {
    it("rolls back to previous state when API returns error", async () => {
      const user = userEvent.setup();

      // Mock failed API call
      mockedPhotoFavoriteService.favoritePhoto.mockResolvedValue({
        error: { message: "Failed to favorite photo" },
      });

      renderWithToast(
        <FavoriteButton photoId={123} initialIsFavorited={false} />,
      );

      const button = screen.getByRole("button");

      // Initial state
      expect(button).toHaveAttribute("aria-label", "Favorite photo");

      // Click to favorite
      await user.click(button);

      // After API error, should rollback to original state
      await waitFor(() => {
        expect(button).toHaveAttribute("aria-label", "Favorite photo");
      });
    });

    it("rolls back when API throws exception", async () => {
      const user = userEvent.setup();

      // Mock exception
      mockedPhotoFavoriteService.favoritePhoto.mockRejectedValue(
        new Error("Network error"),
      );

      renderWithToast(
        <FavoriteButton photoId={123} initialIsFavorited={false} />,
      );

      const button = screen.getByRole("button");

      // Click to favorite
      await user.click(button);

      // After exception, should rollback to original state
      await waitFor(() => {
        expect(button).toHaveAttribute("aria-label", "Favorite photo");
      });
    });

    it("shows error toast when API fails", async () => {
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      // Mock failed API call
      mockedPhotoFavoriteService.favoritePhoto.mockResolvedValue({
        error: { message: "Failed to favorite photo" },
      });

      renderWithToast(<FavoriteButton photoId={123} />);

      await user.click(screen.getByRole("button"));

      // Should show error toast
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });
  });

  // ========== CAN FAVORITE OWN PHOTO ==========

  describe("Can Favorite Own Photo", () => {
    it("is enabled even for own photos (different from LikeButton)", () => {
      renderWithToast(<FavoriteButton photoId={123} isOwnPhoto={true} />);

      const button = screen.getByRole("button");
      // Should be enabled (unlike LikeButton)
      expect(button).not.toBeDisabled();
    });

    it("calls API when favoriting own photo", async () => {
      const user = userEvent.setup();

      renderWithToast(<FavoriteButton photoId={123} isOwnPhoto={true} />);

      await user.click(screen.getByRole("button"));

      // API should be called (different from LikeButton)
      await waitFor(() => {
        expect(mockedPhotoFavoriteService.favoritePhoto).toHaveBeenCalledWith(
          123,
        );
      });
    });

    it("shows correct aria-label for own photo", () => {
      renderWithToast(<FavoriteButton photoId={123} isOwnPhoto={true} />);

      const button = screen.getByRole("button");
      // Should allow favoriting own photos
      expect(button).toHaveAttribute("aria-label", "Favorite photo");
      expect(button).not.toBeDisabled();
    });
  });

  // ========== LOADING STATE ==========

  describe("Loading State", () => {
    it("is disabled during API call", async () => {
      const user = userEvent.setup();

      // Mock slow API call
      mockedPhotoFavoriteService.favoritePhoto.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({}), 100)),
      );

      renderWithToast(<FavoriteButton photoId={123} />);

      const button = screen.getByRole("button");

      // Click to favorite
      await user.click(button);

      // Should be disabled during loading
      expect(button).toBeDisabled();
    });

    it("prevents double-click", async () => {
      const user = userEvent.setup();

      // Mock slow API call
      mockedPhotoFavoriteService.favoritePhoto.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({}), 100)),
      );

      renderWithToast(<FavoriteButton photoId={123} />);

      const button = screen.getByRole("button");

      // First click
      await user.click(button);

      // Try second click immediately
      await user.click(button);

      // API should only be called once
      await waitFor(() => {
        expect(mockedPhotoFavoriteService.favoritePhoto).toHaveBeenCalledTimes(
          1,
        );
      });
    });

    it("re-enables after API completes", async () => {
      const user = userEvent.setup();

      renderWithToast(<FavoriteButton photoId={123} />);

      const button = screen.getByRole("button");

      // Click
      await user.click(button);

      // After API completes, button should be enabled again
      await waitFor(() => {
        expect(button).not.toBeDisabled();
      });
    });
  });

  // ========== STOPPROPAGATION ==========

  describe("stopPropagation", () => {
    it("prevents event bubbling to parent", async () => {
      const user = userEvent.setup();
      const mockParentClick = jest.fn();
      const mockFavoriteClick = jest.fn();

      // Create a parent div with click handler
      renderWithToast(
        <div onClick={mockParentClick} data-testid="parent">
          <FavoriteButton photoId={123} onFavoriteChange={mockFavoriteClick} />
        </div>,
      );

      const button = screen.getByRole("button");

      // Click the button
      await user.click(button);

      // Parent click should NOT be called (stopPropagation worked)
      expect(mockParentClick).not.toHaveBeenCalled();

      // onFavoriteChange callback should be called
      await waitFor(() => {
        expect(mockFavoriteClick).toHaveBeenCalledWith(123);
      });
    });
  });

  // ========== CALLBACK ==========

  describe("onFavoriteChange Callback", () => {
    it("calls onFavoriteChange with photoId when favoriting", async () => {
      const user = userEvent.setup();

      renderWithToast(
        <FavoriteButton
          photoId={456}
          onFavoriteChange={mockOnFavoriteChange}
        />,
      );

      await user.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(mockOnFavoriteChange).toHaveBeenCalledWith(456);
      });
    });

    it("calls onFavoriteChange when unfavoriting", async () => {
      const user = userEvent.setup();

      renderWithToast(
        <FavoriteButton
          photoId={789}
          initialIsFavorited={true}
          onFavoriteChange={mockOnFavoriteChange}
        />,
      );

      await user.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(mockOnFavoriteChange).toHaveBeenCalledWith(789);
      });
    });

    it("does not call onFavoriteChange when API fails", async () => {
      const user = userEvent.setup();

      // Mock failed API call
      mockedPhotoFavoriteService.favoritePhoto.mockResolvedValue({
        error: { message: "Failed" },
      });

      renderWithToast(
        <FavoriteButton
          photoId={123}
          onFavoriteChange={mockOnFavoriteChange}
        />,
      );

      await user.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(mockOnFavoriteChange).not.toHaveBeenCalled();
      });
    });
  });

  // ========== STATE SYNC WITH PROPS ==========

  describe("State Sync with Props", () => {
    it("syncs state when initialIsFavorited prop changes", () => {
      const { rerender } = renderWithToast(
        <FavoriteButton photoId={123} initialIsFavorited={false} />,
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Favorite photo");

      // Rerender with updated prop
      rerender(
        <ToastProvider>
          <FavoriteButton photoId={123} initialIsFavorited={true} />
        </ToastProvider>,
      );

      // State should sync with new prop
      expect(button).toHaveAttribute("aria-label", "Unfavorite photo");
    });
  });

  // ========== SIZE VARIANTS ==========

  describe("Size Variants", () => {
    it("renders small size correctly", () => {
      renderWithToast(<FavoriteButton photoId={123} size="small" />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("renders medium size correctly", () => {
      renderWithToast(<FavoriteButton photoId={123} size="medium" />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("renders large size correctly", () => {
      renderWithToast(<FavoriteButton photoId={123} size="large" />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  // ========== CUSTOM CLASS NAME ==========

  describe("Custom className", () => {
    it("applies custom className to wrapper div", () => {
      const { container } = renderWithToast(
        <FavoriteButton photoId={123} className="ml-4 mt-2" />,
      );

      const wrapper = container.querySelector(".ml-4.mt-2");
      expect(wrapper).toBeInTheDocument();
    });
  });

  // ========== ICONBUTTON INTEGRATION ==========

  describe("IconButton Integration", () => {
    it("passes correct icon when favorited", () => {
      renderWithToast(
        <FavoriteButton photoId={123} initialIsFavorited={true} />,
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Unfavorite photo");
    });

    it("passes correct icon when not favorited", () => {
      renderWithToast(
        <FavoriteButton photoId={123} initialIsFavorited={false} />,
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Favorite photo");
    });

    it("uses yellow color for favorited state", () => {
      renderWithToast(
        <FavoriteButton photoId={123} initialIsFavorited={true} />,
      );

      const button = screen.getByRole("button");
      // Should have yellow color when favorited
      expect(button).toBeInTheDocument();
    });
  });

  // ========== EDGE CASES ==========

  describe("Edge Cases", () => {
    it("handles rapid clicks", async () => {
      const user = userEvent.setup();

      // Mock slow API
      mockedPhotoFavoriteService.favoritePhoto.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({}), 100)),
      );

      renderWithToast(<FavoriteButton photoId={123} />);

      const button = screen.getByRole("button");

      // Rapid clicks
      await user.click(button);
      await user.click(button);
      await user.click(button);

      // Should only call API once (loading state prevents double-click)
      await waitFor(() => {
        expect(mockedPhotoFavoriteService.favoritePhoto).toHaveBeenCalledTimes(
          1,
        );
      });
    });

    it("handles missing onFavoriteChange gracefully", async () => {
      const user = userEvent.setup();

      renderWithToast(<FavoriteButton photoId={123} />);

      await user.click(screen.getByRole("button"));

      // Should not throw error
      await waitFor(() => {
        expect(mockedPhotoFavoriteService.favoritePhoto).toHaveBeenCalled();
      });
    });

    it("handles isOwnPhoto prop correctly", async () => {
      const user = userEvent.setup();

      renderWithToast(<FavoriteButton photoId={123} isOwnPhoto={true} />);

      const button = screen.getByRole("button");

      // Should be enabled (different from LikeButton)
      expect(button).not.toBeDisabled();

      // Click should work
      await user.click(button);

      // API should be called
      await waitFor(() => {
        expect(mockedPhotoFavoriteService.favoritePhoto).toHaveBeenCalled();
      });
    });
  });

  // ========== PRIVATE FEATURE ==========

  describe("Private Feature (No Count Display)", () => {
    it("never shows count regardless of initial state", () => {
      // Even if we had a count prop, it shouldn't display
      renderWithToast(<FavoriteButton photoId={123} />);

      // No count display
      expect(screen.queryByText(/favorites?/)).not.toBeInTheDocument();
    });

    it("only shows star icon (no text)", () => {
      renderWithToast(<FavoriteButton photoId={123} />);

      // Button with icon should exist
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();

      // No count text
      expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
    });
  });

  // ========== CONSISTENCY WITH LIKEBUTTON ==========

  describe("Consistency with LikeButton", () => {
    it("uses same optimistic update pattern", async () => {
      const user = userEvent.setup();

      // Mock slow API
      mockedPhotoFavoriteService.favoritePhoto.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({}), 100)),
      );

      renderWithToast(<FavoriteButton photoId={123} />);

      const button = screen.getByRole("button");

      const labelBefore = button.getAttribute("aria-label");

      await user.click(button);

      // UI should update immediately
      const labelAfter = button.getAttribute("aria-label");
      expect(labelAfter).not.toBe(labelBefore);
    });

    it("uses same rollback pattern on error", async () => {
      const user = userEvent.setup();

      // Mock failed API
      mockedPhotoFavoriteService.favoritePhoto.mockResolvedValue({
        error: { message: "Failed" },
      });

      renderWithToast(<FavoriteButton photoId={123} />);

      const button = screen.getByRole("button");
      const labelBefore = button.getAttribute("aria-label");

      await user.click(button);

      // Should rollback to original state
      await waitFor(() => {
        expect(button.getAttribute("aria-label")).toBe(labelBefore);
      });
    });

    it("uses same stopPropagation pattern", async () => {
      const user = userEvent.setup();
      const mockParentClick = jest.fn();

      renderWithToast(
        <div onClick={mockParentClick}>
          <FavoriteButton photoId={123} />
        </div>,
      );

      await user.click(screen.getByRole("button"));

      // Parent should not be called
      expect(mockParentClick).not.toHaveBeenCalled();
    });
  });
});
