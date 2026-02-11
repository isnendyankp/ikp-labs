/**
 * ToastContainer Component Tests
 *
 * Tests for the Toast container component.
 */

import { render, screen, act } from "@testing-library/react";
import { ToastContainer } from "../ToastContainer";
import { ToastProvider, useToast } from "@/context/ToastContext";

// Helper component to test ToastContainer with context
function TestComponent() {
  const { showSuccess } = useToast();

  return (
    <div>
      <ToastContainer />
      <button onClick={() => showSuccess("Test toast")}>Show Toast</button>
    </div>
  );
}

describe("ToastContainer Component", () => {
  it("renders nothing when there are no toasts", () => {
    const { container } = render(
      <ToastProvider>
        <ToastContainer />
      </ToastProvider>,
    );

    const toastContainer = container.querySelector(".toast-container");
    expect(toastContainer).not.toBeInTheDocument();
  });

  it("renders toast container when toasts are present", () => {
    const { container } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    // Initially, no toast container
    let toastContainer = container.querySelector(".toast-container");
    expect(toastContainer).not.toBeInTheDocument();

    // Click button to show toast
    const button = screen.getByText("Show Toast");
    act(() => {
      button.click();
    });

    // Now toast container should be present
    toastContainer = container.querySelector(".toast-container");
    expect(toastContainer).toBeInTheDocument();
  });

  it("has correct accessibility attributes", () => {
    const { container } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    const button = screen.getByText("Show Toast");
    button.click();

    const toastContainer = container.querySelector(".toast-container");
    expect(toastContainer).toHaveAttribute("role", "region");
    expect(toastContainer).toHaveAttribute("aria-label", "Toast notifications");
    expect(toastContainer).toHaveAttribute("aria-live", "polite");
  });

  it("displays multiple toasts", () => {
    function MultiToastTest() {
      const { showSuccess, showError } = useToast();

      return (
        <div>
          <ToastContainer />
          <button
            onClick={() => {
              showSuccess("Success toast");
              showError("Error toast");
            }}
          >
            Show Multiple Toasts
          </button>
        </div>
      );
    }

    const { container } = render(
      <ToastProvider>
        <MultiToastTest />
      </ToastProvider>,
    );

    const button = screen.getByText("Show Multiple Toasts");
    button.click();

    const toastContainer = container.querySelector(".toast-container");
    expect(toastContainer).toBeInTheDocument();

    const toasts = container.querySelectorAll(".toast-item");
    expect(toasts).toHaveLength(2);
  });
});
