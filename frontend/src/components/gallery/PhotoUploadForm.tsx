/**
 * PhotoUploadForm Component
 *
 * Form untuk upload photo ke gallery.
 *
 * Features:
 * - File input dengan drag & drop
 * - Image preview sebelum upload
 * - Title & description input
 * - Public/Private toggle
 * - Validation (file size, format)
 * - Upload progress indicator
 */

'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { uploadPhoto } from '../../services/galleryService';
import { useRouter } from 'next/navigation';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

export default function PhotoUploadForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  // Handle drag & drop
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Validate and set file
  const validateAndSetFile = (selectedFile: File) => {
    setError(null);

    // Check file type
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError('File type not allowed. Please use JPG, PNG, GIF, or WebP.');
      return;
    }

    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }

    // Set file and create preview
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const response = await uploadPhoto(file, title, description, isPublic);

      if (response.data) {
        alert('Photo uploaded successfully!');
        router.push('/gallery');
      } else if (response.error) {
        setError(response.error.message);
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Clear form
  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setTitle('');
    setDescription('');
    setIsPublic(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {/* File Upload Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photo *
        </label>

        {/* Drag & Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-64 rounded"
            />
          ) : (
            <div>
              <div className="text-6xl mb-4">📷</div>
              <p className="text-gray-600 mb-2">
                Click to select or drag & drop
              </p>
              <p className="text-sm text-gray-400">
                JPG, PNG, GIF, WebP up to 5MB
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {file && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>

      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title (optional)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          placeholder="Enter photo title"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
        />
        <p className="mt-1 text-sm text-gray-400">
          {title.length}/100 characters
        </p>
      </div>

      {/* Description Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description (optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
          rows={4}
          placeholder="Enter photo description"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 resize-none"
        />
        <p className="mt-1 text-sm text-gray-400">
          {description.length}/500 characters
        </p>
      </div>

      {/* Privacy Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isPublic"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="isPublic" className="text-sm font-medium text-gray-700 cursor-pointer">
          Make this photo public (visible to everyone)
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={!file || uploading}
          className={`
            flex-1 py-3 px-6 rounded-lg font-medium transition-colors
            ${!file || uploading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
        >
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </button>

        <button
          type="button"
          onClick={handleClear}
          disabled={uploading}
          className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={() => router.push('/gallery')}
          disabled={uploading}
          className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
