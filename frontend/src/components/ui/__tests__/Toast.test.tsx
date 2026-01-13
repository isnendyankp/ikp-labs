/**
 * Toast Component Tests
 *
 * Tests for the Toast notification component.
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Toast } from "../Toast";
import { Toast as ToastType } from "@/types/toast";

describe("Toast Component", () => {
  const mockToast: ToastType = {
    id: "1",
    type: "success",
    message: "Test success message",
    duration: 4000,
    createdAt: Date.now(),
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Use fake timers to control setTimeout
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders toast with correct message and icon", () => {
    render(<Toast toast={mockToast} onClose={mockOnClose} />);

    expect(screen.getByText("Test success message")).toBeInTheDocument();
    expect(screen.getByText("✅")).toBeInTheDocument();
  });

  it("renders different toast types with correct icons", () => {
    const { rerender } = render(
      <Toast toast={{ ...mockToast, type: "success" }} onClose={mockOnClose} />,
    );
    expect(screen.getByText("✅")).toBeInTheDocument();

    rerender(
      <Toast toast={{ ...mockToast, type: "error" }} onClose={mockOnClose} />,
    );
    expect(screen.getByText("❌")).toBeInTheDocument();

    rerender(
      <Toast toast={{ ...mockToast, type: "warning" }} onClose={mockOnClose} />,
    );
    expect(screen.getByText("⚠️")).toBeInTheDocument();

    rerender(
      <Toast toast={{ ...mockToast, type: "info" }} onClose={mockOnClose} />,
    );
    expect(screen.getByText("ℹ️")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    render(<Toast toast={mockToast} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText("Close notification");
    fireEvent.click(closeButton);

    // Wait for animation duration
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledWith("1");
    });
  });

  it("auto-dismisses after duration", async () => {
    render(<Toast toast={mockToast} onClose={mockOnClose} />);

    // Fast forward time
    jest.advanceTimersByTime(4000);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledWith("1");
    });
  });

  it("has correct accessibility attributes", () => {
    render(<Toast toast={mockToast} onClose={mockOnClose} />);

    const toast = screen.getByRole("alert");
    expect(toast).toHaveAttribute("aria-live", "polite");
  });
});
