'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserFromToken, isAuthenticated } from '../../lib/auth';
import { getCurrentProfilePicture } from '../../services/profileService';
import LogoutButton from '../../components/LogoutButton';
import ProfilePicture from '../../components/ProfilePicture';
import ProfilePictureUpload from '../../components/ProfilePictureUpload';
import { AuthUser, ProfilePictureResponse } from '../../types/api';

/**
 * Home Page Component
 *
 * Protected route that displays user information after successful login/registration.
 *
 * Features:
 * - Authentication check on mount
 * - Redirect to /login if not authenticated
 * - Display welcome message with user's full name
 * - Show user email and name from JWT token
 * - Logout button to end session
 *
 * Route: /home
 */
export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [showUploadSection, setShowUploadSection] = useState(false);

  useEffect(() => {
    // Check authentication on component mount
    if (!isAuthenticated()) {
      // Not authenticated - redirect to login
      router.push('/login');
      return;
    }

    // Get user info from JWT token
    const userInfo = getUserFromToken();
    if (userInfo) {
      setUser(userInfo);

      // Fetch user profile picture from backend
      fetchProfilePicture();
    } else {
      // Token exists but can't decode - redirect to login
      router.push('/login');
    }

    setLoading(false);
  }, [router]);

  /**
   * Fetch profile picture from backend
   */
  const fetchProfilePicture = async () => {
    try {
      const response = await getCurrentProfilePicture();
      if (response.data && response.data.profilePictureUrl) {
        setProfilePictureUrl(response.data.profilePictureUrl);
      }
    } catch (error) {
      console.error('Failed to fetch profile picture:', error);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user, return null (redirecting to login)
  if (!user) {
    return null;
  }

  /**
   * Handle successful upload
   */
  const handleUploadSuccess = (response: ProfilePictureResponse) => {
    console.log('✅ Upload successful:', response);
    setProfilePictureUrl(response.profilePictureUrl);
    setShowUploadSection(false);
  };

  /**
   * Handle successful delete
   */
  const handleDeleteSuccess = (response: ProfilePictureResponse) => {
    console.log('✅ Delete successful:', response);
    setProfilePictureUrl(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Registration Form</h1>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Picture */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>

              {/* Profile Picture Display */}
              <ProfilePicture
                pictureUrl={profilePictureUrl}
                userName={user.fullName}
                size="xl"
                showDeleteButton={true}
                onDeleteSuccess={handleDeleteSuccess}
                onDeleteError={(error) => alert('Delete failed: ' + error)}
              />

              {/* Upload Toggle Button */}
              <div className="mt-6">
                <button
                  onClick={() => setShowUploadSection(!showUploadSection)}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {showUploadSection ? 'Hide Upload' : 'Change Picture'}
                </button>
              </div>

              {/* Upload Section */}
              {showUploadSection && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <ProfilePictureUpload
                    currentPictureUrl={profilePictureUrl}
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={(error) => alert('Upload failed: ' + error)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column - User Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-8">
              {/* Welcome Message */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Welcome, {user.fullName}!
              </h2>

              {/* User Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <p className="text-lg text-gray-900">{user.fullName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <p className="text-lg text-gray-900">{user.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User ID
                  </label>
                  <p className="text-lg text-gray-900">{user.id}</p>
                </div>
              </div>

              {/* Info Message */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700">
                  You are successfully logged in. Your session is secured with JWT authentication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
