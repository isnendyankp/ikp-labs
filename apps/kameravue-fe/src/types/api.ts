/**
 * API Types untuk Frontend-Backend Communication
 *
 * Types ini sesuai dengan backend API endpoints:
 * - POST /api/users (registration)
 * - POST /api/auth/login (login)
 */

// === REGISTRATION TYPES ===

export interface UserRegistrationRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface UserRegistrationResponse {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// === LOGIN TYPES ===

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  tokenType?: string;
  userId?: number;
  email?: string;
  fullName?: string;
  loginTime?: string;
}

// === ERROR TYPES ===

export interface ApiError {
  message: string;
  errorCode?: string;
  fieldErrors?: Record<string, string>;
  timestamp?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  status: number;
}

// === FRONTEND FORM TYPES ===
// Types untuk forms di frontend (sebelum dikirim ke backend)

export interface RegistrationFormData {
  name: string; // Frontend: "name"
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// === AUTH STATE TYPES ===

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  token: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

// === PROFILE PICTURE TYPES ===

export interface ProfilePictureResponse {
  userId: number;
  userEmail: string;
  userName: string;
  pictureUrl: string | null;
  success: boolean;
  message: string;
  timestamp: string;
}

// === GALLERY TYPES ===

/**
 * Gallery Photo dari Backend
 * Sesuai dengan GalleryPhoto entity di backend
 */
export interface GalleryPhoto {
  id: number;
  userId: number;
  ownerName: string;
  filePath: string;
  title: string | null;
  description: string | null;
  isPublic: boolean;
  uploadOrder: number;
  createdAt: string;
  updatedAt: string;
  // Photo Likes fields (required - populated by backend)
  likeCount: number;
  isLikedByUser: boolean;
  // Photo Favorites fields (optional - populated by backend if available)
  isFavoritedByUser?: boolean;
}

/**
 * Request untuk upload photo baru
 * POST /api/gallery
 */
export interface GalleryUploadRequest {
  file: File;
  title?: string;
  description?: string;
  isPublic: boolean;
}

/**
 * Request untuk update photo
 * PUT /api/gallery/{id}
 */
export interface GalleryUpdateRequest {
  title?: string;
  description?: string;
  isPublic?: boolean;
}

/**
 * Response dari backend untuk gallery operations
 */
export interface GalleryPhotoResponse {
  success: boolean;
  message: string;
  photo: GalleryPhoto;
  timestamp: string;
}

/**
 * Response untuk list photos dengan pagination
 * GET /api/gallery/user/{userId}?page=0&size=12
 */
export interface GalleryListResponse {
  photos: GalleryPhoto[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Response detail untuk single photo (includes owner info)
 * GET /api/gallery/photo/{id}
 */
export interface GalleryPhotoDetailResponse {
  id: number;
  userId: number;
  ownerName: string;
  ownerEmail: string;
  filePath: string;
  title: string | null;
  description: string | null;
  isPublic: boolean;
  uploadOrder: number;
  createdAt: string;
  updatedAt: string;
  // Photo interaction fields
  likeCount: number;
  isLikedByUser: boolean;
  isFavoritedByUser?: boolean;
}

/**
 * Form data untuk upload (frontend only)
 */
export interface GalleryUploadFormData {
  file: File | null;
  title: string;
  description: string;
  isPublic: boolean;
  preview: string | null;
}
