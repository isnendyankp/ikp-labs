/**
 * ToastContext Tests
 *
 * Tests for the Toast context and useToast hook.
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { useToast } from "../../context/ToastContext";
import { ToastProvider } from "../../context/ToastContext";

describe("ToastContext", () => {
  it("provides toast context to children", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    expect(result.current.toasts).toEqual([]);
    expect(typeof result.current.showToast).toBe("function");
    expect(typeof result.current.showSuccess).toBe("function");
    expect(typeof result.current.showError).toBe("function");
    expect(typeof result.current.showWarning).toBe("function");
    expect(typeof result.current.showInfo).toBe("function");
    expect(typeof result.current.removeToast).toBe("function");
  });

  it("shows toast when showToast is called", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showToast({
        message: "Test message",
        type: "success",
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe("Test message");
    expect(result.current.toasts[0].type).toBe("success");
  });

  it("shows success toast with correct defaults", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showSuccess("Success message");
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe("success");
    expect(result.current.toasts[0].message).toBe("Success message");
    expect(result.current.toasts[0].duration).toBe(4000); // Default success duration
  });

  it("shows error toast with correct defaults", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showError("Error message");
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe("error");
    expect(result.current.toasts[0].message).toBe("Error message");
    expect(result.current.toasts[0].duration).toBe(5000); // Default error duration
  });

  it("shows warning toast with correct defaults", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showWarning("Warning message");
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe("warning");
    expect(result.current.toasts[0].message).toBe("Warning message");
    expect(result.current.toasts[0].duration).toBe(5000); // Default warning duration
  });

  it("shows info toast with correct defaults", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showInfo("Info message");
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].type).toBe("info");
    expect(result.current.toasts[0].message).toBe("Info message");
    expect(result.current.toasts[0].duration).toBe(4000); // Default info duration
  });

  it("removes toast by id", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showSuccess("First message");
      result.current.showError("Second message");
    });

    expect(result.current.toasts).toHaveLength(2);

    act(() => {
      result.current.removeToast(result.current.toasts[0].id);
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe("Second message");
  });

  it("enforces maximum visible toasts limit", () => {
    jest.useFakeTimers();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    // Add 6 toasts (MAX_VISIBLE_TOASTS is 5)
    act(() => {
      for (let i = 0; i < 6; i++) {
        result.current.showSuccess(`Message ${i}`);
      }
    });

    // Should have max 5 toasts
    expect(result.current.toasts.length).toBeLessThanOrEqual(5);

    jest.useRealTimers();
  });

  it("throws error when useToast is used outside provider", () => {
    // Suppress console.error for this test
    const consoleError = console.error;
    console.error = jest.fn();

    expect(() => {
      renderHook(() => useToast());
    }).toThrow("useToast must be used within a ToastProvider");

    console.error = consoleError;
  });

  it("auto-dismisses toast after duration", async () => {
    jest.useFakeTimers();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.showSuccess("Auto-dismiss message");
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    await waitFor(() => {
      expect(result.current.toasts).toHaveLength(0);
    });

    jest.useRealTimers();
  });
});
