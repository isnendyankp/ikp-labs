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

import React from "react";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import photoFavoriteService from "../services/photoFavoriteService";
import ActionButton from "./ActionButton";

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
  return (
    <ActionButton
      photoId={photoId}
      initialActive={initialIsFavorited}
      activeIcon={<StarSolid />}
      inactiveIcon={<StarOutline />}
      activeColor="text-yellow-500"
      inactiveColor="text-gray-400"
      hoverColor="hover:text-yellow-500"
      focusRing="focus:ring-yellow-300"
      apiCall={(isActive) =>
        isActive
          ? photoFavoriteService.unfavoritePhoto(photoId)
          : photoFavoriteService.favoritePhoto(photoId)
      }
      activeLabel="Unfavorite photo"
      inactiveLabel="Favorite photo"
      size={size}
      className={className}
      // NO countLabel - favorites are private!
      onChange={onFavoriteChange}
    />
  );
}

/**
 * NOTES UNTUK PEMAHAMAN (PEMULA):
 * =================================
 *
 * This component now uses ActionButton to eliminate DRY violations.
 * All optimistic update logic, state management, and error handling
 * are centralized in ActionButton component.
 *
 * Key differences from LikeButton:
 * - Uses Star icons (yellow color)
 * - NO count display (favorites are private!)
 * - No isOwnPhoto check (you CAN favorite your own photos)
 *
 * See ActionButton.tsx for the shared optimistic update implementation.
 */
