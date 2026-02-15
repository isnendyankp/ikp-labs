"use client";

import { useState, useEffect } from "react";
import type { BackToTopProps } from "./landing.types";

/**
 * BackToTop Component
 *
 * Floating button that appears after scrolling down
 * - Shows after scroll threshold (default: 400px)
 * - Smooth scroll to top on click
 * - Fixed position (bottom-right by default, or bottom-left)
 * - Chevron up icon
 * - Accessibility: aria-label
 */
export function BackToTop({
  showAt = 400,
  position = "right",
}: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Handle scroll event to show/hide button
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAt);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Check initial scroll position
    handleScroll();

    // Cleanup on unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAt]);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-8 ${position === "left" ? "left-8" : "right-8"} z-50 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 hover:brightness-110 shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 15.75l7.5-7.5 7.5 7.5"
        />
      </svg>
    </button>
  );
}
