# UX Improvements - Technical Design

**Plan**: UX Improvements
**Version**: 1.0
**Last Updated**: January 12, 2026

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Component Design](#component-design)
3. [State Management](#state-management)
4. [Styling System](#styling-system)
5. [Animation System](#animation-system)
6. [Testing Strategy](#testing-strategy)

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend (Port 3002)              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   App Router Pages                    │   │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────┐    │   │
│  │  │ Gallery    │  │ Profile    │  │ Login/Register│    │   │
│  │  └─────┬──────┘  └─────┬──────┘  └──────┬───────┘    │   │
│  └────────┼───────────────┼─────────────────┼────────────┘   │
│           │               │                 │                 │
│  ┌────────▼───────────────▼─────────────────▼────────────┐  │
│  │                    UI Components                       │  │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────────┐  │  │
│  │  │  Toast   │  │ Confirm  │  │   Skeleton/Loading │  │  │
│  │  │Container │  │  Dialog  │  │     Components     │  │  │
│  │  └──────────┘  └──────────┘  └────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│           │                       │                         │
│  ┌────────▼───────────────────────▼────────────┐           │
│  │              React Context Providers        │           │
│  │  ┌──────────────────────────────────────┐   │           │
│  │  │  ToastContext (toasts, showToast)    │   │           │
│  │  └──────────────────────────────────────┘   │           │
│  └──────────────────────────────────────────────┘           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

**Toast Notification Flow**:
```
User Action (e.g., Upload Photo)
    ↓
Component calls showToast('Success!', 'success')
    ↓
ToastContext adds toast to state
    ↓
ToastContainer renders new toast
    ↓
Toast auto-dismisses after duration
    ↓
Toast removed from state
```

**Loading State Flow**:
```
User Action (e.g., Click Upload)
    ↓
Component sets setLoading(true)
    ↓
UI renders skeleton/overlay
    ↓
Async operation completes
    ↓
Component sets setLoading(false)
    ↓
UI renders actual content/error
```

---

## Component Design

### Toast System Components

#### 1. Toast Types

**File**: `frontend/src/types/toast.ts`

```typescript
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  createdAt: number;
}

export interface ToastConfig {
  message: string;
  type: ToastType;
  duration?: number;
}
```

#### 2. Toast Context

**File**: `frontend/src/context/ToastContext.tsx`

```typescript
'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Toast, ToastType } from '@/types/toast';

interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType, duration = 4000) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = {
      id,
      type,
      message,
      duration,
      createdAt: Date.now(),
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
```

#### 3. Toast Component

**File**: `frontend/src/components/Toast.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Toast } from '@/types/toast';
import { CheckCircleIcon, XCircleIcon, ExclamationIcon, InformationIcon } from '@heroicons/react/24/outline';

interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const TOAST_ICONS = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationIcon,
  info: InformationIcon,
};

const TOAST_STYLES = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

export default function Toast({ toast, onDismiss }: ToastProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);

  const Icon = TOAST_ICONS[toast.type];
  const baseStyle = TOAST_STYLES[toast.type];
  const duration = toast.duration || 4000;

  // Progress bar animation
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) return 0;
          return prev - (100 / (duration / 100));
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isPaused, duration]);

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg min-w-[300px] max-w-md ${baseStyle} animate-slide-in`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={() => onDismiss(toast.id)}
      role="alert"
      aria-live="polite"
    >
      <Icon className="w-6 h-6 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 opacity-70 hover:opacity-100"
        aria-label="Close notification"
      >
        <XCircleIcon className="w-5 h-5" />
      </button>
      <div
        className="absolute bottom-0 left-0 h-1 bg-current opacity-30 transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
```

#### 4. Toast Container

**File**: `frontend/src/components/ToastContainer.tsx`

```typescript
'use client';

import { useToast } from '@/context/ToastContext';
import Toast from './Toast';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 sm:top-6 sm:right-6 md:top-8 md:right-8">
      {toasts.slice(0, 5).map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
}
```

#### 5. useToast Hook

**File**: `frontend/src/hooks/useToast.ts`

```typescript
'use client';

import { useToast as useToastContext } from '@/context/ToastContext';
import { ToastType } from '@/types/toast';

export function useToast() {
  const { toasts, showToast, removeToast } = useToastContext();

  const success = (message: string, duration?: number) => {
    showToast(message, 'success', duration);
  };

  const error = (message: string, duration?: number) => {
    showToast(message, 'error', duration);
  };

  const warning = (message: string, duration?: number) => {
    showToast(message, 'warning', duration);
  };

  const info = (message: string, duration?: number) => {
    showToast(message, 'info', duration);
  };

  return {
    toasts,
    success,
    error,
    warning,
    info,
    removeToast,
  };
}
```

---

### Confirmation Dialog Component

**File**: `frontend/src/components/ConfirmDialog.tsx`

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANT_STYLES = {
  danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
  info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
};

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap
  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [isOpen]);

  // ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-message"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="flex-1">
            <h3 id="dialog-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
            <p id="dialog-message" className="mt-2 text-sm text-gray-600">
              {message}
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${VARIANT_STYLES[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

### Skeleton Components

#### Photo Card Skeleton

**File**: `frontend/src/components/skeletons/PhotoCardSkeleton.tsx`

```typescript
'use client';

export default function PhotoCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Image placeholder */}
      <div className="aspect-square bg-gray-200 animate-pulse" />

      {/* Content placeholder */}
      <div className="p-4 space-y-3">
        {/* Title placeholder */}
        <div className="h-4 bg-gray-200 rounded animate-pulse" />

        {/* Metadata placeholder */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Action buttons placeholder */}
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
```

#### Gallery Grid Skeleton

**File**: `frontend/src/components/skeletons/GalleryGridSkeleton.tsx`

```typescript
'use client';

import PhotoCardSkeleton from './PhotoCardSkeleton';

export default function GalleryGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PhotoCardSkeleton key={i} />
      ))}
    </div>
  );
}
```

---

### Empty State Component

**File**: `frontend/src/components/EmptyState.tsx`

```typescript
'use client';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 mb-4 text-gray-400">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-6 max-w-md">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
```

---

### Form Field Component

**File**: `frontend/src/components/FormField.tsx`

```typescript
'use client';

import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  isValid?: boolean;
  required?: boolean;
  children: ReactNode;
}

export default function FormField({
  label,
  error,
  isValid,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className={error ? 'has-error' : isValid ? 'has-success' : ''}>
        {children}
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
      {isValid && !error && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Valid
        </p>
      )}
    </div>
  );
}
```

---

## State Management

### Local State for Loading

```typescript
const [loading, setLoading] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);

const handleUpload = async (file: File) => {
  setLoading(true);
  setUploadProgress(0);

  try {
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    await uploadPhoto(file);

    clearInterval(interval);
    setUploadProgress(100);

    showToast('Photo uploaded successfully!', 'success');
  } catch (error) {
    showToast('Upload failed', 'error');
  } finally {
    setLoading(false);
    setTimeout(() => setUploadProgress(0), 1000);
  }
};
```

---

## Styling System

### Tailwind CSS Classes

**Toast Styles**:
```css
@layer utilities {
  .animate-slide-in {
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .has-error input {
    @apply border-red-500 focus:border-red-500 focus:ring-red-500;
  }

  .has-success input {
    @apply border-green-500 focus:border-green-500 focus:ring-green-500;
  }
}
```

**Hover Effects**:
```css
.hover-lift {
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

---

## Animation System

### Like Animation

```typescript
const [isLiked, setIsLiked] = useState(false);
const [isAnimating, setIsAnimating] = useState(false);

const handleLike = () => {
  setIsAnimating(true);
  setIsLiked(!isLiked);

  setTimeout(() => {
    setIsAnimating(false);
  }, 300);
};

return (
  <button
    onClick={handleLike}
    className={`transition-all duration-300 ${
      isAnimating ? 'scale-125' : 'scale-100'
    } ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
  >
    <HeartIcon className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} />
  </button>
);
```

---

## Testing Strategy

### Unit Tests (Jest + RTL)

```typescript
// Toast.test.tsx
describe('Toast', () => {
  it('should render toast with correct message', () => {
    const toast = {
      id: '1',
      type: 'success' as const,
      message: 'Success!',
      createdAt: Date.now(),
    };

    render(<Toast toast={toast} onDismiss={jest.fn()} />);

    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  it('should call onDismiss when clicked', () => {
    const onDismiss = jest.fn();
    const toast = {
      id: '1',
      type: 'success' as const,
      message: 'Success!',
      createdAt: Date.now(),
    };

    render(<Toast toast={toast} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole('alert'));

    expect(onDismiss).toHaveBeenCalledWith('1');
  });
});
```

### E2E Tests (Playwright)

```typescript
// ux-improvements.spec.ts
test('UX-001: should show success toast after photo upload', async ({ page }) => {
  await page.goto('/gallery');
  await page.click('[data-testid="upload-button"]');

  // Upload file
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('test-photo.jpg');

  // Wait for toast
  await expect(page.locator('.fixed.top-4')).toContainText('uploaded successfully');
});

test('UX-008: should show dialog before deleting photo', async ({ page }) => {
  await page.goto('/gallery');
  await page.click('[data-testid="delete-button"]');

  // Check dialog appears
  await expect(page.locator('[role="dialog"]')).toBeVisible();
  await expect(page.locator('#dialog-title')).toContainText('Delete Photo');
});
```

---

**Technical Design Version**: 1.0
**Last Updated**: January 12, 2026
**Ready for Implementation**: Yes
