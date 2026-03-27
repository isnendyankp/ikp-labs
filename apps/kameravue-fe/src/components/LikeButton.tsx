"use client";

/**
 * LikeButton Component - Heart button untuk like/unlike photos
 *
 * Features:
 * - Optimistic updates (UI update instant, rollback jika error)
 * - Loading state (prevent double-click)
 * - Heart icon toggle (outline ♡ / filled ❤️)
 * - Like count display
 * - Error handling dengan rollback
 *
 * ANALOGI SEDERHANA:
 * ==================
 * Seperti Instagram Like Button:
 * - User klik ♡ → Langsung jadi ❤️ (optimistic) → API call → Jika error, balik ke ♡ (rollback)
 * - Count update instant → Jika error, rollback ke count sebelumnya
 *
 * Usage:
 * <LikeButton
 *   photoId={123}
 *   initialIsLiked={false}
 *   initialLikeCount={5}
 *   size="medium"
 * />
 */

import React from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import photoLikeService from "../services/photoLikeService";
import ActionButton from "./ActionButton";

// === TYPE DEFINITIONS ===

interface LikeButtonProps {
  photoId: number;
  initialIsLiked?: boolean;
  initialLikeCount?: number;
  size?: "small" | "medium" | "large";
  className?: string;
  onLikeChange?: (photoId: number) => void;
  isOwnPhoto?: boolean; // Disable like button for own photos
}

// === COMPONENT ===

export default function LikeButton({
  photoId,
  initialIsLiked = false,
  initialLikeCount = 0,
  size = "medium",
  className = "",
  onLikeChange,
  isOwnPhoto = false,
}: LikeButtonProps) {
  return (
    <ActionButton
      photoId={photoId}
      initialActive={initialIsLiked}
      initialCount={initialLikeCount}
      activeIcon={<HeartSolid />}
      inactiveIcon={<HeartOutline />}
      activeColor="text-red-500"
      inactiveColor="text-gray-400"
      hoverColor="hover:text-red-500"
      focusRing="focus:ring-red-300"
      apiCall={(isActive) =>
        isActive
          ? photoLikeService.unlikePhoto(photoId)
          : photoLikeService.likePhoto(photoId)
      }
      activeLabel="Unlike photo"
      inactiveLabel="Like photo"
      size={size}
      className={className}
      countLabel={(count) => `${count} ${count === 1 ? "like" : "likes"}`}
      shouldDisable={() => isOwnPhoto}
      disabledLabel="You cannot like your own photo"
      onChange={onLikeChange}
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
 * Key differences from FavoriteButton:
 * - Uses Heart icons (red color)
 * - Shows like count (public)
 * - Cannot like own photos (isOwnPhoto check)
 *
 * See ActionButton.tsx for the shared optimistic update implementation.
 */
