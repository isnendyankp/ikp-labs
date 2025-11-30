/**
 * Gallery E2E Test Helpers
 *
 * This file contains reusable helper functions for Gallery E2E tests.
 * Includes authentication, upload, navigation, and cleanup utilities.
 */

import { Page, expect } from '@playwright/test';
import path from 'path';

/**
 * Generate unique email for gallery tests
 * Pattern: e2e-gallery-{timestamp}-{random}@test.com
 */
export function generateGalleryTestEmail(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `e2e-gallery-${timestamp}-${random}@test.com`;
}

// More helper functions will be added below
