"use client";

/**
 * FavoriteButton Component - Star button untuk favorite/unfavorite photos
 *
 * Features:
 * - Optimistic updates (UI update instant, rollback jika error)
 * - Loading state (prevent double-click)
 * - Star icon toggle (outline ☆ / filled ⭐)
 * - NO count display (favorites are private!)
 * - Error handling dengan rollback
 *
 * ANALOGI SEDERHANA:
 * ==================
 * Seperti YouTube "Save to Watch Later" atau Browser Bookmarks:
 * - User klik ☆ → Langsung jadi ⭐ (optimistic) → API call → Jika error, balik ke ☆ (rollback)
 * - PRIVATE collection (tidak ada counter seperti likes)
 *
 * KEY DIFFERENCES dari LikeButton:
 * =================================
 * LikeButton (PUBLIC appreciation):
 * - Icon: Heart ❤️
 * - Color: Red
 * - Shows like count (public)
 * - Cannot like own photos
 *
 * FavoriteButton (PRIVATE bookmarks):
 * - Icon: Star ⭐
 * - Color: Yellow/Gold
 * - NO count display (private!)
 * - CAN favorite own photos
 *
 * Usage:
 * <FavoriteButton
 *   photoId={123}
 *   initialIsFavorited={false}
 *   size="medium"
 *   onFavoriteChange={() => refetchPhotos()}
 * />
 */

import React, { useState, useEffect } from "react";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import photoFavoriteService from "../services/photoFavoriteService";
import { useToast } from "@/context/ToastContext";

// === TYPE DEFINITIONS ===

interface FavoriteButtonProps {
  photoId: number;
  initialIsFavorited?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
  onFavoriteChange?: (photoId: number) => void;
}

// === COMPONENT ===

export default function FavoriteButton({
  photoId,
  initialIsFavorited = false,
  size = "medium",
  className = "",
  onFavoriteChange,
}: FavoriteButtonProps) {
  // === STATE ===

  const [isFavorited, setIsFavorited] = useState<boolean>(initialIsFavorited);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showError } = useToast();

  // === SYNC STATE WITH PROPS ===
  // When parent component refreshes data, update local state
  // This fixes the bug where favorite status doesn't update after navigation
  useEffect(() => {
    setIsFavorited(initialIsFavorited);
  }, [initialIsFavorited]);

  // === SIZE VARIANTS ===

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

  // === CLICK HANDLER ===

  /**
   * Handle favorite/unfavorite click
   *
   * Flow (Optimistic Update Pattern):
   * 1. Prevent event bubbling (stopPropagation)
   * 2. Store previous state (untuk rollback)
   * 3. Update UI immediately (optimistic)
   * 4. Call API
   * 5. If error: Rollback to previous state
   * 6. If success: Keep optimistic state
   */
  const handleFavoriteClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    // CRITICAL: Prevent event bubbling to parent PhotoCard's onClick
    // Without this, clicking favorite button will navigate to detail page!
    e.stopPropagation();

    // Prevent double-click
    if (isLoading) return;

    // Store previous state for rollback
    const previousIsFavorited = isFavorited;

    // Optimistic update (update UI immediately)
    const newIsFavorited = !isFavorited;

    setIsFavorited(newIsFavorited);
    setIsLoading(true);

    try {
      // Call API
      const response = newIsFavorited
        ? await photoFavoriteService.favoritePhoto(photoId)
        : await photoFavoriteService.unfavoritePhoto(photoId);

      // Check for errors
      if (response.error) {
        // Rollback on error
        console.error(
          "❌ Favorite/Unfavorite failed, rolling back:",
          response.error,
        );
        setIsFavorited(previousIsFavorited);

        // Show error toast
        showError(response.error.message || "Failed to update favorite");
      } else {
        // Success - optimistic update was correct
        console.log("✅ Favorite/Unfavorite successful");

        // Notify parent component of the change
        if (onFavoriteChange) {
          console.log(
            "🔄 Calling onFavoriteChange callback with photoId:",
            photoId,
          );
          onFavoriteChange(photoId);
        } else {
          console.log("⚠️  onFavoriteChange callback not provided");
        }
      }
    } catch (error) {
      // Rollback on exception
      console.error(
        "❌ Exception during favorite/unfavorite, rolling back:",
        error,
      );
      setIsFavorited(previousIsFavorited);

      showError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // === RENDER ===

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        disabled={isLoading}
        className={`
          ${buttonSizeClasses[size]}
          flex items-center justify-center
          rounded-full
          transition-all duration-200
          ${
            isFavorited
              ? "text-yellow-500 hover:text-yellow-600"
              : "text-gray-400 hover:text-yellow-500"
          }
          ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-100"}
          focus:outline-none focus:ring-2 focus:ring-yellow-300
        `}
        aria-label={isFavorited ? "Unfavorite photo" : "Favorite photo"}
        title={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorited ? (
          <StarSolid className={`${sizeClasses[size]} animate-pulse-once`} />
        ) : (
          <StarOutline className={sizeClasses[size]} />
        )}
      </button>

      {/* NO COUNT DISPLAY - Favorites are private! */}
      {/* Unlike LikeButton, we don't show favorite count because it's a private collection */}
    </div>
  );
}

/**
 * NOTES UNTUK PEMAHAMAN (PEMULA):
 * =================================
 *
 * 1. PERBEDAAN LIKES vs FAVORITES:
 *    ==============================
 *    Likes (PUBLIC):
 *    - Icon: Heart ❤️ (red)
 *    - Purpose: Show appreciation (like Instagram)
 *    - Visibility: Everyone sees like count
 *    - Business rule: Cannot like own photos
 *    - Shows count: "5 likes"
 *
 *    Favorites (PRIVATE):
 *    - Icon: Star ⭐ (yellow)
 *    - Purpose: Personal bookmarks (like YouTube "Save to Watch Later")
 *    - Visibility: Only you see your favorites
 *    - Business rule: CAN favorite own photos
 *    - NO count display (private collection!)
 *
 * 2. OPTIMISTIC UPDATES:
 *    ===================
 *    Bayangkan YouTube "Add to Playlist":
 *    - User klik ☆ → Langsung jadi ⭐ (tidak tunggu server response)
 *    - Jika server gagal → Balik ke ☆ (rollback)
 *    - Jika server sukses → Tetap ⭐
 *
 *    Kenapa pakai pattern ini?
 *    - User experience lebih baik (instant feedback)
 *    - App feels faster
 *    - User tidak tunggu network latency
 *
 * 3. STATE MANAGEMENT:
 *    =================
 *    isFavorited → Boolean (star filled atau outline)
 *    isLoading → Boolean (prevent double-click)
 *    NO favoriteCount → Karena favorites itu private!
 *
 * 4. ROLLBACK PATTERN:
 *    =================
 *    const previous = currentState;  // Simpan state lama
 *    setCurrentState(newState);      // Update optimistically
 *    try {
 *      await api.call();             // Call API
 *    } catch {
 *      setCurrentState(previous);    // Rollback jika error
 *    }
 *
 * 5. HEROICONS:
 *    ===========
 *    StarOutline (24/outline) → ☆ Empty star
 *    StarSolid (24/solid) → ⭐ Filled star
 *
 * 6. TAILWIND CSS:
 *    =============
 *    text-yellow-500 → Yellow/Gold color untuk favorited state
 *    text-gray-400 → Gray untuk unfavorited state
 *    hover:text-yellow-600 → Darker yellow on hover
 *    animate-pulse-once → Small animation saat favorite
 *
 * 7. PROPS:
 *    ======
 *    photoId → ID foto (untuk API call)
 *    initialIsFavorited → Initial state (dari backend)
 *    size → 'small' | 'medium' | 'large'
 *    onFavoriteChange → Callback untuk notify parent component
 *
 * 8. PREVENT DOUBLE-CLICK:
 *    =====================
 *    if (isLoading) return;  // Jika sedang loading, ignore click
 *    setIsLoading(true);     // Set loading saat mulai API call
 *    finally { setIsLoading(false); }  // Reset loading after API
 *
 * 9. ERROR HANDLING:
 *    ===============
 *    - Check response.error
 *    - Rollback state jika error
 *    - Show error message ke user
 *    - Log error untuk debugging
 *
 * 10. ACCESSIBILITY:
 *     ==============
 *     - aria-label → Screen reader support ("Favorite photo" / "Unfavorite photo")
 *     - title → Tooltip on hover
 *     - disabled={isLoading} → Prevent interaction saat loading
 *     - focus:ring → Keyboard navigation highlight
 *
 * 11. PRIVACY BY DESIGN:
 *     ==================
 *     - NO favorite count display (unlike LikeButton)
 *     - Favorites hanya visible untuk user sendiri
 *     - Backend enforces privacy (user_id from JWT)
 *     - Frontend tidak expose jumlah favorites ke public
 *
 * 12. COMPONENT REUSABILITY:
 *     =====================
 *     FavoriteButton bisa dipakai di:
 *     - GalleryPhotoCard (small size)
 *     - PhotoDetailPage (large size)
 *     - FavoritedPhotosPage (medium size)
 *     - PublicPhotosPage (medium size)
 *
 *     Same component, different sizes → Props-based customization!
 *
 * 13. BOTH CAN COEXIST:
 *     =================
 *     User bisa like DAN favorite foto yang sama:
 *     - Like → Public appreciation (❤️)
 *     - Favorite → Private bookmark (⭐)
 *     - Independent actions, different purposes
 *
 *     Example: Instagram post
 *     - You like it (show appreciation to creator)
 *     - You save it (keep for later reference)
 *     - Both actions valid pada foto yang sama!
 */
