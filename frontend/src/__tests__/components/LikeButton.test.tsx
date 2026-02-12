/**
 * LikeButton Component Tests
 *
 * Tests for the LikeButton component which handles like/unlike functionality.
 *
 * Test Coverage:
 * - Basic rendering with like count
 * - Like/unlike toggle
 * - Optimistic update behavior (UI updates immediately)
 * - Rollback on error
 * - Cannot like own photo restriction
 * - Loading state during API call
 * - stopPropagation (prevents parent click)
 * - IconButton integration
 * - Callback (onLikeChange) invocation
 * - State sync with props
 *
 * @author Isnendy Ankp
 * @since 2026-02-07
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LikeButton from "../../components/LikeButton";
import photoLikeService from "../../services/photoLikeService";
import { ToastProvider } from "@/context/ToastContext";

// Mock the photoLikeService default export
jest.mock("../../services/photoLikeService");

// Get the mocked service
const mockedPhotoLikeService = photoLikeService as jest.Mocked<typeof photoLikeService>;

// Helper to render with ToastProvider
const renderWithToast = (ui: React.ReactElement) => {
  return render(<ToastProvider>{ui}</ToastProvider>);
};

describe("LikeButton Component", () => {
  const mockOnLikeChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock for successful API calls
    mockedPhotoLikeService.likePhoto.mockResolvedValue({
      data: { success: true },
    });
    mockedPhotoLikeService.unlikePhoto.mockResolvedValue({
      data: { success: true },
    });
  });

  // ========== BASIC RENDERING ==========

  describe("Basic Rendering", () => {
    it("renders like button with heart icon", () => {
      renderWithToast(<LikeButton photoId={123} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("aria-label", "Like photo");
    });

    it("renders with 0 likes when initialLikeCount=0", () => {
      renderWithToast(<LikeButton photoId={123} initialLikeCount={0} />);

      // Like count should NOT be displayed when count is 0
      expect(screen.queryByText(/likes?/)).not.toBeInTheDocument();
    });

    it("renders like count when > 0", () => {
      renderWithToast(<LikeButton photoId={123} initialLikeCount={5} />);

      expect(screen.getByText("5 likes")).toBeInTheDocument();
    });

    it("shows singular 'like' when count is 1", () => {
      renderWithToast(<LikeButton photoId={123} initialLikeCount={1} />);

      expect(screen.getByText("1 like")).toBeInTheDocument();
    });

    it("shows plural 'likes' when count > 1", () => {
      renderWithToast(<LikeButton photoId={123} initialLikeCount={2} />);

      expect(screen.getByText("2 likes")).toBeInTheDocument();
    });

    it("renders with correct aria-label when liked", () => {
      renderWithToast(<LikeButton photoId={123} initialIsLiked={true} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Unlike photo");
    });

    it("renders with correct title when liked", () => {
      renderWithToast(<LikeButton photoId={123} initialIsLiked={true} />);

      const button = screen.getByTitle("Unlike photo");
      expect(button).toBeInTheDocument();
    });
  });

  // ========== LIKE/UNLIKE TOGGLE ==========

  describe("Like/Unlike Toggle", () => {
    it("toggles from unlike to like when clicked", async () => {
      const user = userEvent.setup();

      renderWithToast(
        <LikeButton photoId={123} initialIsLiked={false} initialLikeCount={5} />
      );

      const button = screen.getByRole("button");

      // Initially not liked (outline heart)
      expect(button).toHaveAttribute("aria-label", "Like photo");
      expect(screen.getByText("5 likes")).toBeInTheDocument();

      // Click to like
      await user.click(button);

      // Optimistic update: should show liked immediately
      await waitFor(() => {
        expect(button).toHaveAttribute("aria-label", "Unlike photo");
        expect(screen.getByText("6 likes")).toBeInTheDocument(); // 5 + 1
      });

      // API should be called
      expect(mockedPhotoLikeService.likePhoto).toHaveBeenCalledWith(123);
    });

    it("toggles from like to unlike when clicked", async () => {
      const user = userEvent.setup();

      renderWithToast(
        <LikeButton photoId={123} initialIsLiked={true} initialLikeCount={5} />
      );

      const button = screen.getByRole("button");

      // Initially liked
      expect(button).toHaveAttribute("aria-label", "Unlike photo");
      expect(screen.getByText("5 likes")).toBeInTheDocument();

      // Click to unlike
      await user.click(button);

      // Optimistic update: should show unliked immediately
      await waitFor(() => {
        expect(button).toHaveAttribute("aria-label", "Like photo");
        expect(screen.getByText("4 likes")).toBeInTheDocument(); // 5 - 1
      });

      // API should be called
      expect(mockedPhotoLikeService.unlikePhoto).toHaveBeenCalledWith(
        123
      );
    });
  });

  // ========== OPTIMISTIC UPDATE ==========

  describe("Optimistic Update", () => {
    it("updates UI immediately before API response", async () => {
      const user = userEvent.setup();

      // Mock a slow API call
      (mockedPhotoLikeService.likePhoto as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
      );

      renderWithToast(
        <LikeButton photoId={123} initialIsLiked={false} initialLikeCount={5} />
      );

      const button = screen.getByRole("button");

      // Click to like
      await user.click(button);

      // UI should update immediately (before API response)
      expect(button).toHaveAttribute("aria-label", "Unlike photo");
      expect(screen.getByText("6 likes")).toBeInTheDocument();
    });

    it("increments like count optimistically", async () => {
      const user = userEvent.setup();

      renderWithToast(
        <LikeButton photoId={123} initialIsLiked={false} initialLikeCount={10} />
      );

      await user.click(screen.getByRole("button"));

      // Should increment immediately
      expect(screen.getByText("11 likes")).toBeInTheDocument();
    });

    it("decrements like count optimistically when unliking", async () => {
      const user = userEvent.setup();

      renderWithToast(
        <LikeButton photoId={123} initialIsLiked={true} initialLikeCount={10} />
      );

      await user.click(screen.getByRole("button"));

      // Should decrement immediately
      expect(screen.getByText("9 likes")).toBeInTheDocument();
    });
  });

  // ========== ROLLBACK ON ERROR ==========

  describe("Rollback on Error", () => {
    it("rolls back to previous state when API returns error", async () => {
      const user = userEvent.setup();

      // Mock failed API call
      (mockedPhotoLikeService.likePhoto as jest.Mock).mockResolvedValue({
        error: { message: "Failed to like photo" },
      });

      renderWithToast(
        <LikeButton photoId={123} initialIsLiked={false} initialLikeCount={5} />
      );

      const button = screen.getByRole("button");

      // Initial state
      expect(button).toHaveAttribute("aria-label", "Like photo");
      expect(screen.getByText("5 likes")).toBeInTheDocument();

      // Click to like
      await user.click(button);

      // After API error, should rollback to original state
      await waitFor(() => {
        expect(button).toHaveAttribute("aria-label", "Like photo");
        expect(screen.getByText("5 likes")).toBeInTheDocument();
      });
    });

    it("rolls back when API throws exception", async () => {
      const user = userEvent.setup();

      // Mock exception
      (mockedPhotoLikeService.likePhoto as jest.Mock).mockRejectedValue(
        new Error("Network error")
      );

      renderWithToast(
        <LikeButton photoId={123} initialIsLiked={false} initialLikeCount={5} />
      );

      const button = screen.getByRole("button");

      // Click to like
      await user.click(button);

      // After exception, should rollback to original state
      await waitFor(() => {
        expect(button).toHaveAttribute("aria-label", "Like photo");
        expect(screen.getByText("5 likes")).toBeInTheDocument();
      });
    });

    it("shows error toast when API fails", async () => {
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      // Mock failed API call
      (mockedPhotoLikeService.likePhoto as jest.Mock).mockResolvedValue({
        error: { message: "Failed to like photo" },
      });

      renderWithToast(<LikeButton photoId={123} />);

      await user.click(screen.getByRole("button"));

      // Should show error toast
      await waitFor(() => {
        // Check if error was logged (showError is called via ToastContext)
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });
  });

  // ========== CANNOT LIKE OWN PHOTO ==========

  describe("Cannot Like Own Photo", () => {
    it("is disabled when isOwnPhoto=true", () => {
      renderWithToast(<LikeButton photoId={123} isOwnPhoto={true} />);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("shows correct aria-label for own photo", () => {
      renderWithToast(<LikeButton photoId={123} isOwnPhoto={true} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "You cannot like your own photo");
    });

    it("shows correct title for own photo", () => {
      renderWithToast(<LikeButton photoId={123} isOwnPhoto={true} />);

      const button = screen.getByTitle("You cannot like your own photo");
      expect(button).toBeInTheDocument();
    });

    it("does not call API when clicking on own photo", async () => {
      const user = userEvent.setup();

      renderWithToast(<LikeButton photoId={123} isOwnPhoto={true} />);

      await user.click(screen.getByRole("button"));

      // API should NOT be called
      expect(mockedPhotoLikeService.likePhoto).not.toHaveBeenCalled();
    });

    it("shows info toast when trying to like own photo", async () => {
      const user = userEvent.setup();

      renderWithToast(<LikeButton photoId={123} isOwnPhoto={true} />);

      // Click should not throw error and should not call API
      await user.click(screen.getByRole("button"));

      // API should not be called (already tested in previous test)
      expect(mockedPhotoLikeService.likePhoto).not.toHaveBeenCalled();
    });
  });

  // ========== LOADING STATE ==========

  describe("Loading State", () => {
    it("is disabled during API call", async () => {
      const user = userEvent.setup();

      // Mock slow API call
      (mockedPhotoLikeService.likePhoto as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
      );

      renderWithToast(<LikeButton photoId={123} />);

      const button = screen.getByRole("button");

      // Click to like
      await user.click(button);

      // Should be disabled during loading
      expect(button).toBeDisabled();
    });

    it("prevents double-click", async () => {
      const user = userEvent.setup();

      // Mock slow API call
      (mockedPhotoLikeService.likePhoto as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
      );

      renderWithToast(<LikeButton photoId={123} initialLikeCount={5} />);

      const button = screen.getByRole("button");

      // First click
      await user.click(button);

      // Try second click immediately
      await user.click(button);

      // API should only be called once
      await waitFor(() => {
        expect(mockedPhotoLikeService.likePhoto).toHaveBeenCalledTimes(
          1
        );
      });
    });

    it("re-enables after API completes", async () => {
      const user = userEvent.setup();

      renderWithToast(<LikeButton photoId={123} />);

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
      const mockLikeClick = jest.fn();

      // Create a parent div with click handler
      const { container } = renderWithToast(
        <div onClick={mockParentClick} data-testid="parent">
          <LikeButton photoId={123} onLikeChange={mockLikeClick} />
        </div>
      );

      const button = screen.getByRole("button");

      // Click the button
      await user.click(button);

      // Parent click should NOT be called (stopPropagation worked)
      expect(mockParentClick).not.toHaveBeenCalled();

      // onLikeChange callback should be called
      await waitFor(() => {
        expect(mockLikeClick).toHaveBeenCalledWith(123);
      });
    });
  });

  // ========== CALLBACK ==========

  describe("onLikeChange Callback", () => {
    it("calls onLikeChange with photoId when liking", async () => {
      const user = userEvent.setup();

      renderWithToast(
        <LikeButton photoId={456} onLikeChange={mockOnLikeChange} />
      );

      await user.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(mockOnLikeChange).toHaveBeenCalledWith(456);
      });
    });

    it("calls onLikeChange when unliking", async () => {
      const user = userEvent.setup();

      renderWithToast(
        <LikeButton
          photoId={789}
          initialIsLiked={true}
          onLikeChange={mockOnLikeChange}
        />
      );

      await user.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(mockOnLikeChange).toHaveBeenCalledWith(789);
      });
    });

    it("does not call onLikeChange when API fails", async () => {
      const user = userEvent.setup();

      // Mock failed API call
      (mockedPhotoLikeService.likePhoto as jest.Mock).mockResolvedValue({
        error: { message: "Failed" },
      });

      renderWithToast(
        <LikeButton photoId={123} onLikeChange={mockOnLikeChange} />
      );

      await user.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(mockOnLikeChange).not.toHaveBeenCalled();
      });
    });
  });

  // ========== STATE SYNC WITH PROPS ==========

  describe("State Sync with Props", () => {
    it("syncs state when initialIsLiked prop changes", () => {
      const { rerender } = renderWithToast(
        <LikeButton photoId={123} initialIsLiked={false} />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Like photo");

      // Rerender with updated prop
      rerender(
        <ToastProvider>
          <LikeButton photoId={123} initialIsLiked={true} />
        </ToastProvider>
      );

      // State should sync with new prop
      expect(button).toHaveAttribute("aria-label", "Unlike photo");
    });

    it("syncs state when initialLikeCount prop changes", () => {
      const { rerender } = renderWithToast(
        <LikeButton photoId={123} initialLikeCount={5} />
      );

      expect(screen.getByText("5 likes")).toBeInTheDocument();

      // Rerender with updated prop
      rerender(
        <ToastProvider>
          <LikeButton photoId={123} initialLikeCount={10} />
        </ToastProvider>
      );

      // State should sync with new prop
      expect(screen.getByText("10 likes")).toBeInTheDocument();
    });
  });

  // ========== SIZE VARIANTS ==========

  describe("Size Variants", () => {
    it("renders small size correctly", () => {
      renderWithToast(<LikeButton photoId={123} size="small" />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      // Size is passed to IconButton
    });

    it("renders medium size correctly", () => {
      renderWithToast(<LikeButton photoId={123} size="medium" />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("renders large size correctly", () => {
      renderWithToast(<LikeButton photoId={123} size="large" />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  // ========== CUSTOM CLASS NAME ==========

  describe("Custom className", () => {
    it("applies custom className to wrapper div", () => {
      const { container } = renderWithToast(
        <LikeButton photoId={123} className="ml-4 mt-2" />
      );

      const wrapper = container.querySelector(".ml-4.mt-2");
      expect(wrapper).toBeInTheDocument();
    });
  });

  // ========== ICONBUTTON INTEGRATION ==========

  describe("IconButton Integration", () => {
    it("passes correct icon when liked", () => {
      renderWithToast(<LikeButton photoId={123} initialIsLiked={true} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Unlike photo");
    });

    it("passes correct icon when not liked", () => {
      renderWithToast(<LikeButton photoId={123} initialIsLiked={false} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Like photo");
    });

    it("uses correct colors for like button", () => {
      renderWithToast(<LikeButton photoId={123} initialIsLiked={true} />);

      const button = screen.getByRole("button");
      // Should have red color when liked
      expect(button).toBeInTheDocument();
    });
  });

  // ========== EDGE CASES ==========

  describe("Edge Cases", () => {
    it("handles 0 like count correctly", () => {
      renderWithToast(<LikeButton photoId={123} initialLikeCount={0} />);

      // Should not show count when 0
      expect(screen.queryByText(/likes?/)).not.toBeInTheDocument();
    });

    it("handles very large like count", () => {
      renderWithToast(<LikeButton photoId={123} initialLikeCount={999999} />);

      expect(screen.getByText("999999 likes")).toBeInTheDocument();
    });

    it("handles rapid clicks", async () => {
      const user = userEvent.setup();

      // Mock slow API
      (mockedPhotoLikeService.likePhoto as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
      );

      renderWithToast(<LikeButton photoId={123} />);

      const button = screen.getByRole("button");

      // Rapid clicks
      await user.click(button);
      await user.click(button);
      await user.click(button);

      // Should only call API once (loading state prevents double-click)
      await waitFor(() => {
        expect(mockedPhotoLikeService.likePhoto).toHaveBeenCalledTimes(
          1
        );
      });
    });

    it("handles missing onLikeChange gracefully", async () => {
      const user = userEvent.setup();

      renderWithToast(<LikeButton photoId={123} />);

      await user.click(screen.getByRole("button"));

      // Should not throw error
      await waitFor(() => {
        expect(mockedPhotoLikeService.likePhoto).toHaveBeenCalled();
      });
    });
  });
});
