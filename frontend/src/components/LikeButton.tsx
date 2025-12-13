'use client';

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

import React, { useState } from 'react';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import photoLikeService from '../services/photoLikeService';

// === TYPE DEFINITIONS ===

interface LikeButtonProps {
  photoId: number;
  initialIsLiked?: boolean;
  initialLikeCount?: number;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

// === COMPONENT ===

export default function LikeButton({
  photoId,
  initialIsLiked = false,
  initialLikeCount = 0,
  size = 'medium',
  className = '',
}: LikeButtonProps) {
  // === STATE ===

  const [isLiked, setIsLiked] = useState<boolean>(initialIsLiked);
  const [likeCount, setLikeCount] = useState<number>(initialLikeCount);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // === SIZE VARIANTS ===

  const sizeClasses = {
    small: 'h-5 w-5',
    medium: 'h-6 w-6',
    large: 'h-8 w-8',
  };

  const buttonSizeClasses = {
    small: 'p-1 text-sm',
    medium: 'p-2 text-base',
    large: 'p-3 text-lg',
  };

  // === CLICK HANDLER ===

  /**
   * Handle like/unlike click
   *
   * Flow (Optimistic Update Pattern):
   * 1. Prevent event bubbling (stopPropagation)
   * 2. Store previous state (untuk rollback)
   * 3. Update UI immediately (optimistic)
   * 4. Call API
   * 5. If error: Rollback to previous state
   * 6. If success: Keep optimistic state
   */
  const handleLikeClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // CRITICAL: Prevent event bubbling to parent PhotoCard's onClick
    // Without this, clicking like button will navigate to detail page!
    e.stopPropagation();

    // Prevent double-click
    if (isLoading) return;

    // Store previous state for rollback
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    // Optimistic update (update UI immediately)
    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;

    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);
    setIsLoading(true);

    try {
      // Call API
      const response = newIsLiked
        ? await photoLikeService.likePhoto(photoId)
        : await photoLikeService.unlikePhoto(photoId);

      // Check for errors
      if (response.error) {
        // Rollback on error
        console.error('❌ Like/Unlike failed, rolling back:', response.error);
        setIsLiked(previousIsLiked);
        setLikeCount(previousLikeCount);

        // Show error message (optional - could use toast notification)
        alert(response.error.message || 'Failed to update like');
      } else {
        // Success - optimistic update was correct
        console.log('✅ Like/Unlike successful');
      }
    } catch (error) {
      // Rollback on exception
      console.error('❌ Exception during like/unlike, rolling back:', error);
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);

      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // === RENDER ===

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Like Button */}
      <button
        onClick={handleLikeClick}
        disabled={isLoading}
        className={`
          ${buttonSizeClasses[size]}
          flex items-center justify-center
          rounded-full
          transition-all duration-200
          ${isLiked
            ? 'text-red-500 hover:text-red-600'
            : 'text-gray-400 hover:text-red-500'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}
          focus:outline-none focus:ring-2 focus:ring-red-300
        `}
        aria-label={isLiked ? 'Unlike photo' : 'Like photo'}
        title={isLiked ? 'Unlike' : 'Like'}
      >
        {isLiked ? (
          <HeartSolid className={`${sizeClasses[size]} animate-pulse-once`} />
        ) : (
          <HeartOutline className={sizeClasses[size]} />
        )}
      </button>

      {/* Like Count */}
      {likeCount > 0 && (
        <span className="text-sm text-gray-600 font-medium">
          {likeCount} {likeCount === 1 ? 'like' : 'likes'}
        </span>
      )}
    </div>
  );
}

/**
 * NOTES UNTUK PEMAHAMAN (PEMULA):
 * =================================
 *
 * 1. OPTIMISTIC UPDATES:
 *    ===================
 *    Bayangkan Instagram Like:
 *    - User klik ♡ → Langsung jadi ❤️ (tidak tunggu server response)
 *    - Jika server gagal → Balik ke ♡ (rollback)
 *    - Jika server sukses → Tetap ❤️
 *
 *    Kenapa pakai pattern ini?
 *    - User experience lebih baik (instant feedback)
 *    - App feels faster
 *    - User tidak tunggu network latency
 *
 * 2. STATE MANAGEMENT:
 *    =================
 *    isLiked → Boolean (heart filled atau outline)
 *    likeCount → Number (jumlah likes)
 *    isLoading → Boolean (prevent double-click)
 *
 * 3. ROLLBACK PATTERN:
 *    =================
 *    const previous = currentState;  // Simpan state lama
 *    setCurrentState(newState);      // Update optimistically
 *    try {
 *      await api.call();             // Call API
 *    } catch {
 *      setCurrentState(previous);    // Rollback jika error
 *    }
 *
 * 4. HEROICONS:
 *    ===========
 *    HeartOutline (24/outline) → ♡ Empty heart
 *    HeartSolid (24/solid) → ❤️ Filled heart
 *
 * 5. TAILWIND CSS:
 *    =============
 *    text-red-500 → Red color untuk liked state
 *    text-gray-400 → Gray untuk unliked state
 *    hover:text-red-600 → Darker red on hover
 *    animate-pulse-once → Small animation saat like
 *
 * 6. PROPS:
 *    ======
 *    photoId → ID foto (untuk API call)
 *    initialIsLiked → Initial state (dari backend)
 *    initialLikeCount → Initial count (dari backend)
 *    size → 'small' | 'medium' | 'large'
 *
 * 7. PREVENT DOUBLE-CLICK:
 *    =====================
 *    if (isLoading) return;  // Jika sedang loading, ignore click
 *    setIsLoading(true);     // Set loading saat mulai API call
 *    finally { setIsLoading(false); }  // Reset loading after API
 *
 * 8. ERROR HANDLING:
 *    ===============
 *    - Check response.error
 *    - Rollback state jika error
 *    - Show error message ke user
 *    - Log error untuk debugging
 *
 * 9. ACCESSIBILITY:
 *    ==============
 *    - aria-label → Screen reader support
 *    - title → Tooltip on hover
 *    - disabled={isLoading} → Prevent interaction saat loading
 *    - focus:ring → Keyboard navigation highlight
 *
 * 10. COMPONENT REUSABILITY:
 *     =====================
 *     LikeButton bisa dipakai di:
 *     - GalleryPhotoCard (small size)
 *     - PhotoDetailPage (large size)
 *     - LikedPhotosPage (medium size)
 *
 *     Same component, different sizes → Props-based customization!
 */
