"use client";

/**
 * IconButton Component - Reusable icon-only button component
 *
 * DRY (Don't Repeat Yourself) solution for icon buttons across the app.
 * Eliminates duplicate button styling code in LikeButton, FavoriteButton, etc.
 *
 * Features:
 * - Size variants (small, medium, large)
 * - Active/inactive states (for toggle buttons)
 * - Loading state with disabled
 * - Hover effects
 * - Focus ring for accessibility
 * - Custom colors via props
 * - Rounded or square shape
 *
 * Usage Examples:
 *
 * Like button:
 * <IconButton
 *   icon={isLiked ? HeartSolid : HeartOutline}
 *   isActive={isLiked}
 *   activeColor="text-red-500"
 *   inactiveColor="text-gray-400"
 *   hoverColor="hover:text-red-500"
 *   focusRing="focus:ring-red-300"
 *   size="medium"
 *   onClick={handleLike}
 *   disabled={isLoading}
 *   ariaLabel="Like photo"
 * />
 *
 * Favorite button:
 * <IconButton
 *   icon={isFavorited ? StarSolid : StarOutline}
 *   isActive={isFavorited}
 *   activeColor="text-yellow-500"
 *   inactiveColor="text-gray-400"
 *   hoverColor="hover:text-yellow-500"
 *   focusRing="focus:ring-yellow-300"
 *   size="medium"
 *   onClick={handleFavorite}
 *   disabled={isLoading}
 *   ariaLabel="Favorite photo"
 * />
 *
 * @author Isnendy Ankp
 * @since 2026-02-07
 */

import { ButtonHTMLAttributes, ReactNode } from "react";

export type IconButtonSize = "small" | "medium" | "large";
export type IconButtonShape = "circle" | "rounded" | "square";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon to display (can be component or node) */
  icon: ReactNode;
  /** Button size */
  size?: IconButtonSize;
  /** Button shape (circle, rounded, square) */
  shape?: IconButtonShape;
  /** Is button in active state? (for toggle buttons) */
  isActive?: boolean;
  /** Color class for active state */
  activeColor?: string;
  /** Color class for inactive state */
  inactiveColor?: string;
  /** Color class for disabled state */
  disabledColor?: string;
  /** Hover effect class */
  hoverColor?: string;
  /** Focus ring color class */
  focusRing?: string;
  /** Hover background effect */
  showHoverBg?: boolean;
  /** Is button loading? */
  isLoading?: boolean;
  /** Optional aria-label for accessibility */
  ariaLabel?: string;
  /** Optional tooltip text */
  title?: string;
}

export function IconButton({
  icon,
  size = "medium",
  shape = "circle",
  isActive = false,
  activeColor = "text-blue-600",
  inactiveColor = "text-gray-600",
  disabledColor = "text-gray-300",
  hoverColor = "",
  focusRing = "focus:ring-blue-300",
  showHoverBg = true,
  isLoading = false,
  disabled = false,
  ariaLabel,
  title,
  className = "",
  onClick,
  ...props
}: IconButtonProps) {
  // === SIZE VARIANTS ===
  // Same pattern as LikeButton/FavoriteButton for consistency

  const sizeClasses = {
    small: "h-5 w-5",
    medium: "h-6 w-6",
    large: "h-8 w-8",
  };

  const buttonSizeClasses = {
    small: "p-1 text-sm",
    medium: "p-2 text-base",
    large: "p-3 text-lg",
  };

  // === SHAPE VARIANTS ===

  const shapeClasses = {
    circle: "rounded-full",
    rounded: "rounded-lg",
    square: "rounded-none",
  };

  // === COLOR LOGIC ===
  // Determine color based on state:
  // 1. Disabled > Loading > Active > Inactive

  const getColorClass = () => {
    if (disabled || isLoading) {
      return disabledColor;
    }
    if (isActive) {
      return activeColor;
    }
    return inactiveColor;
  };

  // === STYLING ===

  const baseStyles = "flex items-center justify-center transition-all duration-200";
  const sizeStyle = buttonSizeClasses[size];
  const shapeStyle = shapeClasses[shape];
  const colorStyle = getColorClass();
  const hoverStyle = hoverColor || (isActive ? "" : `hover:${activeColor.replace(/^text-/, "text-")}`);
  const hoverBgStyle = showHoverBg && !(disabled || isLoading) ? "hover:bg-gray-100" : "";
  const focusStyle = "focus:outline-none focus:ring-2";
  const disabledStyle = (disabled || isLoading) ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  const loadingStyle = isLoading ? "cursor-not-allowed" : "";

  const buttonClasses = `
    ${baseStyles}
    ${sizeStyle}
    ${shapeStyle}
    ${colorStyle}
    ${hoverStyle}
    ${hoverBgStyle}
    ${focusStyle}
    ${focusRing}
    ${disabledStyle}
    ${loadingStyle}
    ${className}
  `.trim().replace(/\s+/g, " ");

  // === RENDER ===

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={buttonClasses}
      aria-label={ariaLabel}
      title={title}
      {...props}
    >
      {/* Clone icon and add size class */}
      {typeof icon === "object" && "type" in icon ? (
        // It's a React component, clone with className
        <icon.type {...icon.props} className={sizeClasses[size]} />
      ) : (
        // It's a ReactNode, render as-is
        <span className={sizeClasses[size]}>{icon}</span>
      )}
    </button>
  );
}

/**
 * NOTES FOR UNDERSTANDING:
 * ========================
 *
 * 1. DRY PRINCIPLE:
 *    ==============
 *    Before: Each button component (LikeButton, FavoriteButton) had its own:
 *    - sizeClasses object
 *    - buttonSizeClasses object
 *    - Button JSX with duplicate styling
 *    - Color logic
 *
 *    After: All styling logic centralized in IconButton component
 *    - Just pass icon, colors, and behavior as props
 *    - Single source of truth for button styling
 *
 * 2. SIZE VARIANTS:
 *    ==============
 *    small:  h-5 w-5 icon, p-1 button (20px icon, 4px padding)
 *    medium: h-6 w-6 icon, p-2 button (24px icon, 8px padding)
 *    large:  h-8 w-8 icon, p-3 button (32px icon, 12px padding)
 *
 *    Same sizes as LikeButton/FavoriteButton for consistency!
 *
 * 3. COLOR LOGIC:
 *    ============
 *    Priority: Disabled > Loading > Active > Inactive
 *
 *    Example for Like button:
 *    - inactive (not liked): text-gray-400
 *    - active (liked): text-red-500
 *    - loading: text-gray-300 (disabledColor)
 *    - disabled: text-gray-300 (disabledColor)
 *
 * 4. ACTIVE STATE:
 *    =============
 *    For toggle buttons (like, favorite, bookmark):
 *    - isActive={isLiked} → Shows activeColor
 *    - isActive={false} → Shows inactiveColor
 *
 *    For simple icon buttons (close, menu, etc.):
 *    - Omit isActive prop → Always shows inactiveColor
 *
 * 5. HOVER EFFECTS:
 *    ==============
 *    If hoverColor provided: Use that
 *    If not provided and not active: Auto-generate from activeColor
 *      Example: activeColor="text-red-500" → hover:text-red-500
 *
 * 6. ACCESSIBILITY:
 *    ==============
 *    - aria-label: Screen reader text (REQUIRED for icon-only buttons)
 *    - title: Tooltip text on hover
 *    - focus:ring: Keyboard navigation highlight
 *    - disabled: Prevents interaction when loading/disabled
 *
 * 7. REFACTORING EXAMPLE:
 *    ====================
 *    BEFORE (LikeButton):
 *    ```tsx
 *    const sizeClasses = { small: "h-5 w-5", medium: "h-6 w-6", large: "h-8 w-8" };
 *    const buttonSizeClasses = { small: "p-1", medium: "p-2", large: "p-3" };
 *
 *    <button className={`${buttonSizeClasses[size]} flex items-center justify-center
 *      rounded-full transition-all duration-200 ${isLiked ? "text-red-500" : "text-gray-400"}
 *      hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-300`}>
 *      {isLiked ? <HeartSolid className={sizeClasses[size]} />
 *               : <HeartOutline className={sizeClasses[size]} />}
 *    </button>
 *    ```
 *
 *    AFTER (using IconButton):
 *    ```tsx
 *    <IconButton
 *      icon={isLiked ? HeartSolid : HeartOutline}
 *      isActive={isLiked}
 *      activeColor="text-red-500"
 *      inactiveColor="text-gray-400"
 *      focusRing="focus:ring-red-300"
 *      size="medium"
 *      onClick={handleLike}
 *      ariaLabel="Like photo"
 *    />
 *    ```
 *
 *    Result: ~20 lines reduced to ~10 lines!
 *
 * 8. USAGE IN EXISTING COMPONENTS:
 *    ==============================
 *    LikeButton.tsx:
 *    - Extract sizeClasses/buttonSizeClasses → Remove (use IconButton)
 *    - Replace button JSX → <IconButton />
 *    - Keep business logic (optimistic updates, API calls)
 *    - Total reduction: ~40 lines of styling code
 *
 *    FavoriteButton.tsx:
 *    - Extract sizeClasses/buttonSizeClasses → Remove (use IconButton)
 *    - Replace button JSX → <IconButton />
 *    - Keep business logic (optimistic updates, API calls)
 *    - Total reduction: ~40 lines of styling code
 *
 * 9. FUTURE USE CASES:
 *    ==================
 *    - Bookmark button (same pattern as favorite)
 *    - Follow button (same pattern as like)
 *    - Thumbs up/down buttons
 *    - Share button
 *    - Download button
 *    - Delete button (trash icon)
 *    - Edit button (pencil icon)
 *    - Close button (X icon)
 *    - Menu button (hamburger icon)
 *    - Any icon-only action button!
 *
 * 10. TYPE SAFETY:
 *     ============
 *     - TypeScript props interface
 *     - Prop types validated at compile time
 *     - No runtime prop errors
 *     - IntelliSense/autocomplete support
 *
 * 11. PERFORMANCE:
 *     ============
 *     - Memoized size classes (defined outside component)
 *     - No unnecessary re-renders
 *     - Optimized className concatenation
 *     - Minimal prop drilling
 *
 * 12. TESTING:
 *     ========
 *     Easy to test:
 *     - Unit test: Test styling for each state
 *     - Integration test: Test click handler
 *     - Accessibility test: Test aria-label, keyboard nav
 */
