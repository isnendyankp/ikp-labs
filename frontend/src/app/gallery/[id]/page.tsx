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

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { isAuthenticated, getUserFromToken } from '../../../lib/auth';
import { GalleryPhoto, AuthUser } from '../../../types/api';
import { getPhotoById, updatePhoto, deletePhoto, getPhotoUrl } from '../../../services/galleryService';

export default function PhotoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const photoId = params.id as string;

  const [user, setUser] = useState<AuthUser | null>(null);
  const [photo, setPhoto] = useState<GalleryPhoto | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIsPublic, setEditIsPublic] = useState(false);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userInfo = getUserFromToken();
    if (userInfo) {
      setUser(userInfo);
    } else {
      router.push('/login');
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

      if (response.data && response.data.photo) {
        setPhoto(response.data.photo);
        setEditTitle(response.data.photo.title || '');
        setEditDescription(response.data.photo.description || '');
        setEditIsPublic(response.data.photo.isPublic);
      } else if (response.error) {
        alert('Photo not found or access denied');
        router.push('/gallery');
      }
    } catch (error) {
      console.error('Error fetching photo:', error);
      alert('Failed to load photo');
      router.push('/gallery');
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
        setPhoto(response.data.photo);
        setEditing(false);
        alert('Photo updated successfully!');
      } else if (response.error) {
        alert('Update failed: ' + response.error.message);
      }
    } catch (error) {
      alert('Update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!photo) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this photo? This action cannot be undone.'
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      const response = await deletePhoto(photo.id);

      if (response.data) {
        alert('Photo deleted successfully!');
        router.push('/gallery');
      } else if (response.error) {
        alert('Delete failed: ' + response.error.message);
      }
    } catch (error) {
      alert('Delete failed. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditTitle(photo?.title || '');
    setEditDescription(photo?.description || '');
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
              onClick={() => router.push('/gallery')}
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
              alt={photo.title || 'Photo'}
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
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
                    <label htmlFor="editIsPublic" className="text-sm font-medium text-gray-700">
                      Make this photo public
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
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
                        {photo.title || 'Untitled'}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(photo.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <span
                      className={`
                        px-3 py-1 text-sm font-medium rounded
                        ${photo.isPublic
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                        }
                      `}
                    >
                      {photo.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>

                  {photo.description && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                      <p className="text-gray-600">{photo.description}</p>
                    </div>
                  )}

                  {isOwner && (
                    <div className="flex gap-4 pt-4 border-t">
                      <button
                        onClick={() => setEditing(true)}
                        className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-300"
                      >
                        {deleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
