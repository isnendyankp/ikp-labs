"use client";

/**
 * ActionButton Component - Reusable button with optimistic update pattern
 *
 * Eliminates DRY violations between LikeButton and FavoriteButton by
 * centralizing the optimistic update logic (store previous, update UI, API call, rollback).
 *
 * Features:
 * - Optimistic updates (UI update instant, rollback if error)
 * - Loading state (prevent double-click)
 * - Icon toggle (outline / filled)
 * - Optional count display
 * - Error handling with rollback
 * - Generic API function support
 * - Disabled condition callback
 *
 * Usage:
 * <ActionButton
 *   photoId={123}
 *   initialActive={false}
 *   activeIcon={<HeartSolid />}
 *   inactiveIcon={<HeartOutline />}
 *   activeColor="text-red-500"
 *   inactiveColor="text-gray-400"
 *   hoverColor="hover:text-red-500"
 *   focusRing="focus:ring-red-300"
 *   apiCall={(isActive) => isActive ? unlikePhoto(photoId) : likePhoto(photoId)}
 *   activeLabel="Unlike photo"
 *   inactiveLabel="Like photo"
 *   initialCount={5}
 *   countLabel={(count) => `${count} ${count === 1 ? 'like' : 'likes'}`}
 *   shouldDisable={() => isOwnPhoto}
 *   disabledLabel="Cannot like own photo"
 *   onChange={(photoId) => console.log('Changed:', photoId)}
 * />
 */

import React, { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { IconButton } from "./ui/IconButton";

// === TYPE DEFINITIONS ===

interface ActionButtonProps {
  // Required props
  photoId: number;
  initialActive?: boolean;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
  activeColor: string;
  inactiveColor: string;
  hoverColor: string;
  focusRing: string;
  apiCall: (isActive: boolean) => Promise<{ error?: { message?: string } }>;

  // Display props
  activeLabel: string;
  inactiveLabel: string;
  size?: "small" | "medium" | "large";
  className?: string;

  // Optional count display
  initialCount?: number;
  countLabel?: (count: number) => string;
  showCountOnlyWhenActive?: boolean;

  // Optional disabled condition
  shouldDisable?: () => boolean;
  disabledLabel?: string;

  // Optional callback
  onChange?: (photoId: number) => void;
}

// === COMPONENT ===

export default function ActionButton({
  photoId,
  initialActive = false,
  activeIcon,
  inactiveIcon,
  activeColor,
  inactiveColor,
  hoverColor,
  focusRing,
  apiCall,
  activeLabel,
  inactiveLabel,
  size = "medium",
  className = "",
  initialCount = 0,
  countLabel,
  showCountOnlyWhenActive = false,
  shouldDisable,
  disabledLabel,
  onChange,
}: ActionButtonProps) {
  // === STATE ===

  const [isActive, setIsActive] = useState<boolean>(initialActive);
  const [count, setCount] = useState<number>(initialCount);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showError, showInfo } = useToast();

  // === SYNC STATE WITH PROPS ===
  // When parent component refreshes data, update local state
  useEffect(() => {
    setIsActive(initialActive);
    if (countLabel !== undefined) {
      setCount(initialCount);
    }
  }, [initialActive, initialCount, countLabel]);

  // === CLICK HANDLER ===

  /**
   * Handle action button click (like/unlike, favorite/unfavorite, etc.)
   *
   * Flow (Optimistic Update Pattern):
   * 1. Prevent event bubbling (stopPropagation)
   * 2. Check disabled condition
   * 3. Prevent double-click
   * 4. Store previous state (for rollback)
   * 5. Update UI immediately (optimistic)
   * 6. Call API
   * 7. If error: Rollback to previous state
   * 8. If success: Keep optimistic state
   */
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // CRITICAL: Prevent event bubbling to parent PhotoCard's onClick
    e.stopPropagation();

    // Check if action should be disabled
    const isDisabled = shouldDisable?.();
    if (isDisabled) {
      if (disabledLabel) {
        showInfo(disabledLabel);
      }
      return;
    }

    // Prevent double-click
    if (isLoading) return;

    // Store previous state for rollback
    const previousIsActive = isActive;
    const previousCount = count;

    // Optimistic update (update UI immediately)
    const newIsActive = !isActive;
    const newCount =
      countLabel !== undefined ? (newIsActive ? count + 1 : count - 1) : count;

    setIsActive(newIsActive);
    if (countLabel !== undefined) {
      setCount(newCount);
    }
    setIsLoading(true);

    try {
      // Call API with the NEW active state (what we want it to become)
      // If currently inactive (becoming active), call activate action
      // If currently active (becoming inactive), call deactivate action
      const response = await apiCall(previousIsActive);

      // Check for errors
      if (response.error) {
        // Rollback on error
        console.error("❌ Action failed, rolling back:", response.error);
        setIsActive(previousIsActive);
        if (countLabel !== undefined) {
          setCount(previousCount);
        }

        // Show error toast
        showError(response.error.message || "Failed to update");
      } else {
        // Success - optimistic update was correct
        console.log("✅ Action successful");

        // Notify parent component of the change
        if (onChange) {
          console.log("🔄 Calling onChange callback with photoId:", photoId);
          onChange(photoId);
        }
      }
    } catch (error) {
      // Rollback on exception
      console.error("❌ Exception during action, rolling back:", error);
      setIsActive(previousIsActive);
      if (countLabel !== undefined) {
        setCount(previousCount);
      }

      showError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // === RENDER ===

  const isDisabled = shouldDisable?.();
  const showCount =
    countLabel !== undefined &&
    count > 0 &&
    (!showCountOnlyWhenActive || isActive);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Action Button */}
      <IconButton
        icon={isActive ? activeIcon : inactiveIcon}
        isActive={isActive}
        activeColor={activeColor}
        inactiveColor={inactiveColor}
        hoverColor={hoverColor}
        focusRing={focusRing}
        size={size}
        onClick={handleClick}
        disabled={isLoading || isDisabled}
        isLoading={isLoading}
        ariaLabel={
          isDisabled && disabledLabel
            ? disabledLabel
            : isActive
              ? activeLabel
              : inactiveLabel
        }
        title={
          isDisabled && disabledLabel
            ? disabledLabel
            : isActive
              ? activeLabel
              : inactiveLabel
        }
      />

      {/* Optional Count Display */}
      {showCount && countLabel && (
        <span className="text-sm text-gray-600 font-medium">
          {countLabel(count)}
        </span>
      )}
    </div>
  );
}

/**
 * DESIGN NOTES:
 * =============
 *
 * 1. OPTIMISTIC UPDATE PATTERN:
 *    This component implements the optimistic update pattern:
 *    - Update UI immediately before API response
 *    - Rollback to previous state if API fails
 *    - Store previous state for potential rollback
 *
 * 2. GENERIC API FUNCTION:
 *    The apiCall prop accepts a function that:
 *    - Takes the current active state (before toggle)
 *    - Returns a Promise with response
 *    - Can be used for like/unlike, favorite/unfavorite, etc.
 *
 *    Example for like:
 *    apiCall={(isActive) => isActive ? unlikePhoto(id) : likePhoto(id)}
 *
 * 3. COUNT DISPLAY:
 *    - Optional via countLabel prop
 *    - showCountOnlyWhenActive: hide count when inactive
 *    - countLabel function for custom formatting
 *
 * 4. DISABLED CONDITION:
 *    - shouldDisable callback for dynamic disabled logic
 *    - disabledLabel for tooltip/toast when disabled
 *
 * 5. REUSABILITY:
 *    This component can be used for:
 *    - LikeButton (Heart icon, red color, shows count)
 *    - FavoriteButton (Star icon, yellow color, no count)
 *    - Any future toggle action with optimistic updates
 *
 * 6. DRY ELIMINATION:
 *    This component eliminates ~60 lines of duplicate code:
 *    - Optimistic update logic (~30 lines)
 *    - State management (~10 lines)
 *    - Error handling (~20 lines)
 */
