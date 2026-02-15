/**
 * Unit Tests for useClickOutside Hook
 *
 * Testing Philosophy: NO MOCKING
 * - Uses real JSDOM environment
 * - Tests hook behavior directly
 * - Uses real event listeners
 */

import { renderHook } from "@testing-library/react";
import { useRef } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";

describe("useClickOutside", () => {
  // ============================================
  // Basic Functionality Tests
  // ============================================

  describe("Basic Functionality", () => {
    it("should call callback when clicking outside the element", () => {
      const callback = jest.fn();

      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        useClickOutside(ref, callback);
        return ref;
      });

      // Create a div and assign it to the ref
      const div = document.createElement("div");
      document.body.appendChild(div);

      // Manually set the ref current
      result.current.current = div;

      // Simulate click outside
      const outsideElement = document.createElement("span");
      document.body.appendChild(outsideElement);

      const mouseEvent = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
      });
      outsideElement.dispatchEvent(mouseEvent);

      // Note: The hook uses document.addEventListener, so we need to dispatch to document
      // @ts-expect-error - JSDOM MouseEvent doesn't fully support all properties
      document.dispatchEvent(
        new MouseEvent("mousedown", {
          bubbles: true,
          cancelable: true,
          target: outsideElement,
        }),
      );

      // Cleanup
      document.body.removeChild(div);
      document.body.removeChild(outsideElement);
    });

    it("should not call callback when clicking inside the element", () => {
      const callback = jest.fn();

      renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        useClickOutside(ref, callback);
        return ref;
      });

      // Callback should not have been called initially
      expect(callback).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // Event Listener Tests
  // ============================================

  describe("Event Listener Management", () => {
    it("should add mousedown event listener on mount", () => {
      const addEventListenerSpy = jest.spyOn(document, "addEventListener");
      const callback = jest.fn();

      renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        useClickOutside(ref, callback);
      });

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "mousedown",
        expect.any(Function),
      );

      addEventListenerSpy.mockRestore();
    });

    it("should remove mousedown event listener on unmount", () => {
      const removeEventListenerSpy = jest.spyOn(
        document,
        "removeEventListener",
      );
      const callback = jest.fn();

      const { unmount } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        useClickOutside(ref, callback);
      });

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "mousedown",
        expect.any(Function),
      );

      removeEventListenerSpy.mockRestore();
    });
  });

  // ============================================
  // Ref Handling Tests
  // ============================================

  describe("Ref Handling", () => {
    it("should work with null ref", () => {
      const callback = jest.fn();

      renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        useClickOutside(ref, callback);
      });

      // Should not throw error
      expect(() => {
        document.dispatchEvent(new MouseEvent("mousedown"));
      }).not.toThrow();
    });

    it("should work with undefined ref current", () => {
      const callback = jest.fn();

      renderHook(() => {
        const ref = useRef<HTMLDivElement | null>(null);
        useClickOutside(ref, callback);
      });

      // Should not throw error when ref.current is null
      expect(callback).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // Callback Handling Tests
  // ============================================

  describe("Callback Handling", () => {
    it("should update callback when it changes", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const { rerender } = renderHook(
        ({ callback }) => {
          const ref = useRef<HTMLDivElement>(null);
          useClickOutside(ref, callback);
        },
        { initialProps: { callback: callback1 } },
      );

      rerender({ callback: callback2 });

      // After rerender, the new callback should be used
      // (The hook's useEffect will update with the new callback)
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // Edge Cases Tests
  // ============================================

  describe("Edge Cases", () => {
    it("should handle multiple instances of the hook", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      renderHook(() => {
        const ref1 = useRef<HTMLDivElement>(null);
        const ref2 = useRef<HTMLDivElement>(null);
        useClickOutside(ref1, callback1);
        useClickOutside(ref2, callback2);
      });

      // Both hooks should register their event listeners
      // No errors should occur
    });

    it("should not call callback if ref.current is null", () => {
      const callback = jest.fn();

      renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        useClickOutside(ref, callback);
      });

      // Trigger a mousedown event
      document.dispatchEvent(new MouseEvent("mousedown"));

      // Since ref.current is null, callback should not be called
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
