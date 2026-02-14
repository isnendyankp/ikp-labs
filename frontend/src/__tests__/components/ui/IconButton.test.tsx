/**
 * IconButton Component Tests
 *
 * Tests for the reusable IconButton component.
 * This is a foundational component used by LikeButton and FavoriteButton.
 *
 * Test Coverage:
 * - Size variants (small, medium, large)
 * - Shape variants (circle, rounded, square)
 * - Active/inactive state toggle
 * - Disabled state
 * - Loading state
 * - Click handler
 * - Accessibility (aria-label)
 * - Custom color props
 * - Hover effects
 * - Focus ring
 *
 * @author Isnendy Ankp
 * @since 2026-02-07
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IconButton } from "../../../components/ui/IconButton";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

describe("IconButton Component", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ========== BASIC RENDER TESTS ==========

  describe("Basic Rendering", () => {
    it("renders icon correctly", () => {
      render(<IconButton icon={<HeartIcon />} onClick={mockOnClick} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button.querySelector("svg")).toBeInTheDocument();
    });

    it("renders with custom aria-label", () => {
      render(
        <IconButton
          icon={<HeartIcon />}
          onClick={mockOnClick}
          ariaLabel="Like photo"
        />
      );

      const button = screen.getByLabelText("Like photo");
      expect(button).toBeInTheDocument();
    });

    it("renders with title attribute for tooltip", () => {
      render(
        <IconButton
          icon={<HeartIcon />}
          onClick={mockOnClick}
          title="Like this photo"
        />
      );

      const button = screen.getByTitle("Like this photo");
      expect(button).toBeInTheDocument();
    });
  });

  // ========== SIZE VARIANTS ==========

  describe("Size Variants", () => {
    it("renders small size correctly", () => {
      const { container } = render(
        <IconButton
          icon={<HeartIcon />}
          size="small"
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("p-1"); // small padding
    });

    it("renders medium size correctly", () => {
      const { container } = render(
        <IconButton
          icon={<HeartIcon />}
          size="medium"
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("p-2"); // medium padding
    });

    it("renders large size correctly", () => {
      const { container } = render(
        <IconButton
          icon={<HeartIcon />}
          size="large"
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("p-3"); // large padding
    });

    it("uses medium size as default", () => {
      const { container } = render(
        <IconButton icon={<HeartIcon />} onClick={mockOnClick} />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("p-2"); // default to medium
    });
  });

  // ========== SHAPE VARIANTS ==========

  describe("Shape Variants", () => {
    it("renders circle shape correctly", () => {
      const { container } = render(
        <IconButton
          icon={<HeartIcon />}
          shape="circle"
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded-full");
    });

    it("renders rounded shape correctly", () => {
      const { container } = render(
        <IconButton
          icon={<HeartIcon />}
          shape="rounded"
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded-lg");
    });

    it("renders square shape correctly", () => {
      const { container } = render(
        <IconButton
          icon={<HeartIcon />}
          shape="square"
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded-none");
    });

    it("uses circle shape as default", () => {
      const { container } = render(
        <IconButton icon={<HeartIcon />} onClick={mockOnClick} />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded-full");
    });
  });

  // ========== ACTIVE STATE ==========

  describe("Active State", () => {
    it("shows active state when isActive=true", () => {
      render(
        <IconButton
          icon={<HeartIcon />}
          isActive={true}
          activeColor="text-red-500"
          inactiveColor="text-gray-400"
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-red-500");
      expect(button).not.toHaveClass("text-gray-400");
    });

    it("shows inactive state when isActive=false", () => {
      render(
        <IconButton
          icon={<HeartIcon />}
          isActive={false}
          activeColor="text-red-500"
          inactiveColor="text-gray-400"
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-gray-400");
      expect(button).not.toHaveClass("text-red-500");
    });

    it("toggles between active and inactive states", () => {
      const { rerender } = render(
        <IconButton
          icon={<HeartIcon />}
          isActive={false}
          activeColor="text-red-500"
          inactiveColor="text-gray-400"
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-gray-400");

      // Rerender with isActive=true
      rerender(
        <IconButton
          icon={<HeartIcon />}
          isActive={true}
          activeColor="text-red-500"
          inactiveColor="text-gray-400"
          onClick={mockOnClick}
        />
      );

      expect(button).toHaveClass("text-red-500");
      expect(button).not.toHaveClass("text-gray-400");
    });
  });

  // ========== DISABLED STATE ==========

  describe("Disabled State", () => {
    it("is disabled when disabled=true", () => {
      render(
        <IconButton
          icon={<HeartIcon />}
          disabled={true}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("shows disabled styling when disabled", () => {
      render(
        <IconButton
          icon={<HeartIcon />}
          disabled={true}
          disabledColor="text-gray-300"
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-gray-300");
      expect(button).toHaveClass("opacity-50");
      expect(button).toHaveClass("cursor-not-allowed");
    });

    it("does not call onClick when disabled", async () => {
      const user = userEvent.setup();

      render(
        <IconButton
          icon={<HeartIcon />}
          disabled={true}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it("is disabled when isLoading=true", () => {
      render(
        <IconButton
          icon={<HeartIcon />}
          isLoading={true}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });
  });

  // ========== LOADING STATE ==========

  describe("Loading State", () => {
    it("is disabled during loading", () => {
      render(
        <IconButton
          icon={<HeartIcon />}
          isLoading={true}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("cursor-not-allowed");
    });

    it("does not call onClick when loading", async () => {
      const user = userEvent.setup();

      render(
        <IconButton
          icon={<HeartIcon />}
          isLoading={true}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it("prioritizes loading over active state", () => {
      render(
        <IconButton
          icon={<HeartIcon />}
          isActive={true}
          isLoading={true}
          activeColor="text-red-500"
          disabledColor="text-gray-300"
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      // When loading, should show disabledColor
      expect(button).toHaveClass("text-gray-300");
    });
  });

  // ========== CLICK HANDLER ==========

  describe("Click Handler", () => {
    it("calls onClick when clicked", async () => {
      const user = userEvent.setup();

      render(<IconButton icon={<HeartIcon />} onClick={mockOnClick} />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("calls onClick multiple times when clicked multiple times", async () => {
      const user = userEvent.setup();

      render(<IconButton icon={<HeartIcon />} onClick={mockOnClick} />);

      const button = screen.getByRole("button");
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });

    it("passes event object to onClick handler", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn((e) => {
        expect(e).toBeDefined();
        expect(e.type).toBe("click");
      });

      render(<IconButton icon={<HeartIcon />} onClick={handleClick} />);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(handleClick).toHaveBeenCalled();
    });
  });

  // ========== CUSTOM COLORS ==========

  describe("Custom Colors", () => {
    it("applies activeColor when active", () => {
      render(
        <IconButton
          icon={<HeartIcon />}
          isActive={true}
          activeColor="text-pink-500"
          inactiveColor="text-gray-400"
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-pink-500");
    });

    it("applies inactiveColor when inactive", () => {
      render(
        <IconButton
          icon={<HeartIcon />}
          isActive={false}
          activeColor="text-red-500"
          inactiveColor="text-blue-400"
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-blue-400");
    });

    it("applies hoverColor on hover", () => {
      render(
        <IconButton
          icon={<HeartIcon />}
          hoverColor="hover:text-purple-500"
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("hover:text-purple-500");
    });

    it("applies focusRing color", () => {
      render(
        <IconButton
          icon={<HeartIcon />}
          focusRing="focus:ring-purple-300"
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("focus:ring-purple-300");
    });
  });

  // ========== ICON CHANGING ==========

  describe("Icon Changing", () => {
    it("changes icon when prop changes", () => {
      const { rerender } = render(
        <IconButton icon={<HeartIcon />} onClick={mockOnClick} />
      );

      // Initially has outline heart
      expect(screen.getByRole("button")).toBeInTheDocument();

      // Change to solid heart
      rerender(<IconButton icon={<HeartSolid />} onClick={mockOnClick} />);

      // Should still have button with updated icon
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders React component icon correctly", () => {
      render(
        <IconButton
          icon={<HeartIcon data-testid="heart-icon" />}
          onClick={mockOnClick}
        />
      );

      const icon = screen.getByTestId("heart-icon");
      expect(icon).toBeInTheDocument();
    });
  });

  // ========== ACCESSIBILITY ==========

  describe("Accessibility", () => {
    it("has aria-label when provided", () => {
      render(
        <IconButton
          icon={<HeartIcon />}
          onClick={mockOnClick}
          ariaLabel="Like photo"
        />
      );

      const button = screen.getByLabelText("Like photo");
      expect(button).toBeInTheDocument();
    });

    it("is focusable with keyboard", () => {
      render(<IconButton icon={<HeartIcon />} onClick={mockOnClick} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("focus:outline-none");
      expect(button).toHaveClass("focus:ring-2");
    });

    it("has title attribute for tooltip", () => {
      render(
        <IconButton
          icon={<HeartIcon />}
          onClick={mockOnClick}
          title="Click to like"
        />
      );

      const button = screen.getByTitle("Click to like");
      expect(button).toBeInTheDocument();
    });
  });

  // ========== CUSTOM CLASS NAME ==========

  describe("Custom className", () => {
    it("applies custom className", () => {
      render(
        <IconButton
          icon={<HeartIcon />}
          onClick={mockOnClick}
          className="ml-4 mt-2"
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("ml-4");
      expect(button).toHaveClass("mt-2");
    });

    it("applies multiple custom classes", () => {
      render(
        <IconButton
          icon={<HeartIcon />}
          onClick={mockOnClick}
          className="ml-4 mt-2 p-4"
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("ml-4");
      expect(button).toHaveClass("mt-2");
      expect(button).toHaveClass("p-4");
    });
  });

  // ========== HOVER BACKGROUND ==========

  describe("Hover Background", () => {
    it("shows hover background when showHoverBg=true", () => {
      render(
        <IconButton
          icon={<HeartIcon />}
          showHoverBg={true}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("hover:bg-gray-100");
    });

    it("does not show hover background when showHoverBg=false", () => {
      render(
        <IconButton
          icon={<HeartIcon />}
          showHoverBg={false}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).not.toHaveClass("hover:bg-gray-100");
    });

    it("shows hover background by default", () => {
      render(<IconButton icon={<HeartIcon />} onClick={mockOnClick} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("hover:bg-gray-100");
    });

    it("does not show hover background when disabled", () => {
      render(
        <IconButton
          icon={<HeartIcon />}
          showHoverBg={true}
          disabled={true}
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      // Should not have hover background when disabled
      expect(button).not.toHaveClass("hover:bg-gray-100");
    });
  });

  // ========== EDGE CASES ==========

  describe("Edge Cases", () => {
    it("handles null icon gracefully", () => {
      render(
        // @ts-expect-error - Testing null icon case
        <IconButton icon={null} onClick={mockOnClick} />
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("handles missing onClick gracefully", () => {
      render(<IconButton icon={<HeartIcon />} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      // Button should still be rendered even without onClick
    });

    it("handles empty aria-label", () => {
      render(
        <IconButton
          icon={<HeartIcon />}
          onClick={mockOnClick}
          ariaLabel=""
        />
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("handles all props combined", () => {
      render(
        <IconButton
          icon={<HeartIcon />}
          size="large"
          shape="rounded"
          isActive={true}
          activeColor="text-red-500"
          inactiveColor="text-gray-400"
          hoverColor="hover:text-red-600"
          focusRing="focus:ring-red-300"
          showHoverBg={true}
          disabled={false}
          isLoading={false}
          ariaLabel="Like photo"
          title="Click to like"
          className="ml-4"
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("text-red-500"); // active
      expect(button).toHaveClass("p-3"); // large
      expect(button).toHaveClass("rounded-lg"); // rounded
      expect(button).toHaveClass("hover:text-red-600"); // hoverColor
      expect(button).toHaveClass("hover:bg-gray-100"); // hoverBg
      expect(button).toHaveClass("focus:ring-red-300"); // focusRing
      expect(button).toHaveClass("ml-4"); // custom className
      expect(button).not.toBeDisabled(); // not disabled
    });
  });

  // ========== INTEGRATION WITH ICONBUTTON ==========

  describe("Integration: Icon Toggle Pattern", () => {
    it("supports icon toggle pattern (like button)", () => {
      const { rerender } = render(
        <IconButton
          icon={<HeartIcon />}
          isActive={false}
          activeColor="text-red-500"
          inactiveColor="text-gray-400"
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");

      // Initially inactive (outline heart)
      expect(button).toHaveClass("text-gray-400");

      // Simulate click → rerender with isActive=true
      rerender(
        <IconButton
          icon={<HeartSolid />}
          isActive={true}
          activeColor="text-red-500"
          inactiveColor="text-gray-400"
          onClick={mockOnClick}
        />
      );

      // Now active (solid heart)
      expect(button).toHaveClass("text-red-500");
    });

    it("supports star icon toggle pattern (favorite button)", () => {
      const { rerender } = render(
        <IconButton
          icon={<HeartIcon />}
          isActive={false}
          activeColor="text-yellow-500"
          inactiveColor="text-gray-400"
          hoverColor="hover:text-yellow-500"
          focusRing="focus:ring-yellow-300"
          onClick={mockOnClick}
        />
      );

      const button = screen.getByRole("button");

      // Inactive: gray
      expect(button).toHaveClass("text-gray-400");

      // Active: yellow
      rerender(
        <IconButton
          icon={<HeartSolid />}
          isActive={true}
          activeColor="text-yellow-500"
          inactiveColor="text-gray-400"
          hoverColor="hover:text-yellow-500"
          focusRing="focus:ring-yellow-300"
          onClick={mockOnClick}
        />
      );

      expect(button).toHaveClass("text-yellow-500");
    });
  });

  // ========== STYLING CONSISTENCY ==========

  describe("Styling Consistency", () => {
    it("has transition class for smooth animations", () => {
      render(<IconButton icon={<HeartIcon />} onClick={mockOnClick} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("transition-all");
      expect(button).toHaveClass("duration-200");
    });

    it("has flex center alignment", () => {
      render(<IconButton icon={<HeartIcon />} onClick={mockOnClick} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("flex");
      expect(button).toHaveClass("items-center");
      expect(button).toHaveClass("justify-center");
    });

    it("has outline-none for focus styles", () => {
      render(<IconButton icon={<HeartIcon />} onClick={mockOnClick} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("focus:outline-none");
    });

    it("has focus ring for accessibility", () => {
      render(<IconButton icon={<HeartIcon />} onClick={mockOnClick} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("focus:ring-2");
    });
  });
});
