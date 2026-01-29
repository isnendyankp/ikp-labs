/**
 * useClickOutside Hook
 *
 * Custom React hook to detect clicks outside a component.
 * Useful for closing dropdowns, modals, and other dismissible UI elements.
 *
 * @param ref - React ref to the component element
 * @param callback - Function to call when click is detected outside
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * useClickOutside(ref, () => setIsOpen(false));
 *
 * return (
 *   <div ref={ref}>
 *     Click outside to close me
 *   </div>
 * );
 * ```
 */

import { useEffect, RefObject } from "react";

export function useClickOutside(
  ref: RefObject<HTMLElement>,
  callback: () => void
): void {
  useEffect(() => {
    /**
     * Handle click events on the document
     * Calls callback if click is outside the referenced element
     */
    const handleClick = (event: MouseEvent) => {
      // If ref exists and click target is NOT inside the ref, call callback
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Add event listener for mousedown
    document.addEventListener("mousedown", handleClick);

    // Clean up: remove event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref, callback]);
}
