/**
 * Photo Detail Page
 *
 * View and manage individual photo.
 *
 * Features:
 * - View full-size photo
 * - Edit title and description
 * - Toggle public/private
 * - Delete photo
 * - Back to gallery
 * - Owner-only actions
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { isAuthenticated, getUserFromToken } from "../../../lib/auth";
import { GalleryPhotoDetailResponse, AuthUser } from "../../../types/api";
import {
  getPhotoById,
  updatePhoto,
  deletePhoto,
  getPhotoUrl,
} from "../../../services/galleryService";
import LikeButton from "../../../components/LikeButton";
import FavoriteButton from "../../../components/FavoriteButton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/context/ToastContext";

export default function PhotoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { showError, showSuccess } = useToast();
  const photoId = params.id as string;

  const [user, setUser] = useState<AuthUser | null>(null);
  const [photo, setPhoto] = useState<GalleryPhotoDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsPublic, setEditIsPublic] = useState(false);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const userInfo = getUserFromToken();
    if (userInfo) {
      setUser(userInfo);
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (user && photoId) {
      fetchPhoto();
    }
  }, [user, photoId]);

  const fetchPhoto = async () => {
    setLoading(true);

    try {
      const response = await getPhotoById(Number(photoId));

      if (response.data) {
        // Backend returns GalleryPhotoDetailResponse directly (flat object, not nested under .photo)
        setPhoto(response.data);
        setEditTitle(response.data.title || "");
        setEditDescription(response.data.description || "");
        setEditIsPublic(response.data.isPublic);
      } else if (response.error) {
        showError("Photo not found or access denied");
        router.push("/gallery");
      }
    } catch (error) {
      console.error("Error fetching photo:", error);
      showError("Failed to load photo");
      router.push("/gallery");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!photo) return;

    setSaving(true);

    try {
      const response = await updatePhoto(photo.id, {
        title: editTitle || undefined,
        description: editDescription || undefined,
        isPublic: editIsPublic,
      });

      if (response.data) {
        // Update photo dengan data baru (backend returns GalleryPhotoResponse directly, not wrapped)
        setPhoto({
          ...response.data,
        });
        setEditing(false);
        showSuccess("Photo updated successfully!");
      } else if (response.error) {
        showError("Update failed: " + response.error.message);
      }
    } catch (error) {
      showError("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!photo) return;

    setShowDeleteDialog(false);
    setDeleting(true);

    try {
      const response = await deletePhoto(photo.id);

      if (response.data) {
        showSuccess("Photo deleted successfully!");
        router.push("/gallery");
      } else if (response.error) {
        showError("Delete failed: " + response.error.message);
      }
    } catch (error) {
      showError("Delete failed. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditTitle(photo?.title || "");
    setEditDescription(photo?.description || "");
    setEditIsPublic(photo?.isPublic || false);
  };

  if (loading || !photo || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isOwner = photo.userId === user.id;
  const photoUrl = getPhotoUrl(photo.filePath);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Gallery
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Photo */}
          <div className="bg-white rounded-lg shadow p-4">
            <img
              src={photoUrl}
              alt={photo.title || "Photo"}
              className="w-full rounded-lg"
            />
          </div>

          {/* Right Column - Details & Actions */}
          <div className="space-y-6">
            {/* Photo Info Card */}
            <div className="bg-white rounded-lg shadow p-6">
              {editing ? (
                // Edit Mode
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      maxLength={100}
                      placeholder="Enter photo title..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      maxLength={500}
                      rows={4}
                      placeholder="Enter photo description..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="editIsPublic"
                      checked={editIsPublic}
                      onChange={(e) => setEditIsPublic(e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="editIsPublic"
                      className="text-sm font-medium text-gray-700"
                    >
                      Make this photo public
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {photo.title || "Untitled"}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(photo.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={`
                        px-3 py-1 text-sm font-medium rounded
                        ${
                          photo.isPublic
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      `}
                    >
                      {photo.isPublic ? "Public" : "Private"}
                    </span>
                  </div>

                  {photo.description && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Description
                      </h3>
                      <p className="text-gray-600">{photo.description}</p>
                    </div>
                  )}

                  {/* Like & Favorite Buttons - larger size for detail view */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-6">
                      <LikeButton
                        photoId={photo.id}
                        initialIsLiked={photo.isLikedByUser}
                        initialLikeCount={photo.likeCount}
                        size="large"
                        onLikeChange={fetchPhoto}
                        isOwnPhoto={user?.id === photo.userId}
                      />
                      <FavoriteButton
                        photoId={photo.id}
                        initialIsFavorited={photo.isFavoritedByUser}
                        size="large"
                        onFavoriteChange={fetchPhoto}
                      />
                    </div>
                  </div>

                  {isOwner && (
                    <div className="flex gap-4 pt-4 border-t">
                      <button
                        onClick={() => setEditing(true)}
                        className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDeleteClick}
                        disabled={deleting}
                        className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-300"
                      >
                        {deleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Photo"
        message="Are you sure you want to delete this photo? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
