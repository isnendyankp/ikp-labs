"use client";

import { useState, useRef, ChangeEvent } from "react";
import {
  uploadProfilePicture,
  validateImageFile,
} from "../services/profileService";
import { ProfilePictureResponse } from "../types/api";

/**
 * ProfilePictureUpload Component
 *
 * Provides profile picture upload functionality with:
 * - File selection via input or drag-and-drop
 * - Client-side validation (size, type)
 * - Upload progress and loading states
 * - Preview before upload
 * - Error handling
 *
 * Props:
 * - onUploadSuccess: Callback when upload succeeds
 * - onUploadError: Callback when upload fails
 *
 * Usage:
 * <ProfilePictureUpload
 *   onUploadSuccess={(response) => console.log('Uploaded!', response)}
 *   onUploadError={(error) => console.error('Error:', error)}
 * />
 */

interface ProfilePictureUploadProps {
  onUploadSuccess?: (response: ProfilePictureResponse) => void;
  onUploadError?: (error: string) => void;
  currentPictureUrl?: string | null;
}

export default function ProfilePictureUpload({
  onUploadSuccess,
  onUploadError,
  currentPictureUrl,
}: ProfilePictureUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle file selection from input
   */
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  /**
   * Handle drag over event
   */
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  /**
   * Handle drag leave event
   */
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  /**
   * Handle file drop
   */
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  /**
   * Process selected file (validate and preview)
   */
  const processFile = (file: File) => {
    // Clear previous error
    setError(null);

    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      if (onUploadError) {
        onUploadError(validationError);
      }
      return;
    }

    // Set selected file
    setSelectedFile(file);

    // Create preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  /**
   * Handle upload button click
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await uploadProfilePicture(selectedFile);

      if (response.data) {
        console.log("✅ Upload successful:", response.data);

        // Call success callback
        if (onUploadSuccess) {
          onUploadSuccess(response.data);
        }

        // Clear selected file and preview
        setSelectedFile(null);
        setPreviewUrl(null);

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else if (response.error) {
        const errorMessage = response.error.message || "Upload failed";
        setError(errorMessage);

        if (onUploadError) {
          onUploadError(errorMessage);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);

      if (onUploadError) {
        onUploadError(errorMessage);
      }
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Handle cancel button click
   */
  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**
   * Trigger file input click
   */
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto space-y-4">
      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400"
        }`}
      >
        {/* Preview or Current Picture */}
        {previewUrl || currentPictureUrl ? (
          <div className="mb-4">
            <img
              src={previewUrl || currentPictureUrl || ""}
              alt="Preview"
              className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-white shadow-lg"
            />
            <p className="mt-2 text-sm text-gray-600">
              {previewUrl ? "New picture preview" : "Current profile picture"}
            </p>
          </div>
        ) : (
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {/* Instructions */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleButtonClick}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Click to select file
          </button>
          <p className="text-sm text-gray-500">or drag and drop</p>
          <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Selected file info */}
      {selectedFile && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Selected:</span> {selectedFile.name}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Size: {(selectedFile.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Action buttons */}
      {selectedFile && (
        <div className="flex gap-3">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              isUploading
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isUploading ? "Uploading..." : "Upload Picture"}
          </button>

          <button
            onClick={handleCancel}
            disabled={isUploading}
            className="py-3 px-4 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
