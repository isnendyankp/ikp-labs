"use client";

import { useState, useEffect } from "react";
import {
  deleteProfilePicture,
  getProfilePictureUrl,
} from "../services/profileService";
import { ProfilePictureResponse } from "../types/api";

/**
 * ProfilePicture Component
 *
 * Displays user's profile picture with:
 * - Current profile picture or default avatar
 * - Delete picture functionality
 * - Loading states
 * - Error handling
 * - Responsive sizing
 *
 * Props:
 * - pictureUrl: URL to profile picture (from backend)
 * - userName: User's full name (for initials in avatar)
 * - size: Display size ('sm', 'md', 'lg', 'xl')
 * - showDeleteButton: Whether to show delete button
 * - onDeleteSuccess: Callback when delete succeeds
 * - onDeleteError: Callback when delete fails
 *
 * Usage:
 * <ProfilePicture
 *   pictureUrl={user.profilePictureUrl}
 *   userName={user.fullName}
 *   size="lg"
 *   showDeleteButton={true}
 *   onDeleteSuccess={(response) => console.log('Deleted!', response)}
 * />
 */

interface ProfilePictureProps {
  pictureUrl?: string | null;
  userName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showDeleteButton?: boolean;
  onDeleteSuccess?: (response: ProfilePictureResponse) => void;
  onDeleteError?: (error: string) => void;
}

export default function ProfilePicture({
  pictureUrl,
  userName = "User",
  size = "md",
  showDeleteButton = false,
  onDeleteSuccess,
  onDeleteError,
}: ProfilePictureProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPictureUrl, setCurrentPictureUrl] = useState(pictureUrl);

  /**
   * Update currentPictureUrl when pictureUrl prop changes
   */
  useEffect(() => {
    setCurrentPictureUrl(pictureUrl);
  }, [pictureUrl]);

  /**
   * Get size classes for the picture
   */
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-12 h-12 text-sm";
      case "md":
        return "w-24 h-24 text-xl";
      case "lg":
        return "w-32 h-32 text-2xl";
      case "xl":
        return "w-48 h-48 text-4xl";
      default:
        return "w-24 h-24 text-xl";
    }
  };

  /**
   * Get user initials from full name
   */
  const getUserInitials = (name: string): string => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  /**
   * Handle delete picture
   */
  const handleDelete = async () => {
    // Confirm before delete
    const confirmed = window.confirm(
      "Are you sure you want to delete your profile picture?",
    );
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await deleteProfilePicture();

      if (response.data) {
        console.log("✅ Picture deleted successfully:", response.data);

        // Update local state
        setCurrentPictureUrl(null);

        // Call success callback
        if (onDeleteSuccess) {
          onDeleteSuccess(response.data);
        }
      } else if (response.error) {
        const errorMessage = response.error.message || "Delete failed";
        setError(errorMessage);

        if (onDeleteError) {
          onDeleteError(errorMessage);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Delete failed";
      setError(errorMessage);

      if (onDeleteError) {
        onDeleteError(errorMessage);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const sizeClasses = getSizeClasses();
  const fullPictureUrl = currentPictureUrl
    ? getProfilePictureUrl(currentPictureUrl)
    : null;

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Profile Picture or Avatar */}
      <div className="relative">
        {fullPictureUrl ? (
          // Display uploaded picture
          <img
            src={fullPictureUrl}
            alt={`${userName}'s profile picture`}
            className={`${sizeClasses} rounded-full object-cover border-4 border-white shadow-lg`}
            onError={(e) => {
              // Fallback if image fails to load
              console.error("Failed to load image:", fullPictureUrl);
              setCurrentPictureUrl(null);
            }}
          />
        ) : (
          // Default avatar with initials
          <div
            className={`${sizeClasses} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg border-4 border-white`}
          >
            {getUserInitials(userName)}
          </div>
        )}

        {/* Loading overlay during delete */}
        {isDeleting && (
          <div
            className={`${sizeClasses} rounded-full absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center`}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* User Name */}
      <div className="text-center">
        <p className="font-semibold text-gray-800">{userName}</p>
      </div>

      {/* Delete Button */}
      {showDeleteButton && currentPictureUrl && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`py-1 px-3 text-sm rounded-lg font-medium transition-colors ${
            isDeleting
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {isDeleting ? "Deleting..." : "Delete Picture"}
        </button>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 max-w-xs">
          <p className="text-xs text-red-800 text-center">{error}</p>
        </div>
      )}
    </div>
  );
}
