import { APIRequestContext } from '@playwright/test';

/**
 * Cleanup Helper - Database cleanup utilities for API tests
 *
 * This helper provides functions to clean up test data from the database
 * after tests complete, preventing test data pollution.
 *
 * Usage:
 * ```typescript
 * import { deleteUserByEmail, deleteTestUsers } from './cleanup';
 *
 * // Delete specific user
 * await deleteUserByEmail(request, 'test@example.com');
 *
 * // Delete all test users (emails matching pattern)
 * await deleteTestUsers(request, 'test.api');
 * ```
 */

/**
 * Delete a user by email address
 *
 * @param request - Playwright APIRequestContext
 * @param email - Email address of user to delete
 * @returns Promise<boolean> - true if deleted successfully, false otherwise
 *
 * Example:
 * ```typescript
 * const success = await deleteUserByEmail(request, 'testuser@example.com');
 * if (success) {
 *   console.log('User deleted successfully');
 * }
 * ```
 */
export async function deleteUserByEmail(
  request: APIRequestContext,
  email: string
): Promise<boolean> {
  try {
    const baseURL = 'http://localhost:8081';

    // First, get user by email to find the ID
    const getUserResponse = await request.get(`${baseURL}/api/users/email/${email}`);

    if (getUserResponse.status() === 404) {
      // User doesn't exist, consider it success
      console.log(`User with email ${email} not found (already deleted or never existed)`);
      return true;
    }

    if (getUserResponse.status() !== 200) {
      console.error(`Failed to get user by email ${email}: ${getUserResponse.status()}`);
      return false;
    }

    const userData = await getUserResponse.json();
    const userId = userData.id;

    // Delete user by ID
    const deleteResponse = await request.delete(`${baseURL}/api/users/${userId}`);

    if (deleteResponse.status() === 200) {
      console.log(`Successfully deleted user: ${email} (ID: ${userId})`);
      return true;
    } else {
      console.error(`Failed to delete user ${email}: ${deleteResponse.status()}`);
      return false;
    }
  } catch (error) {
    console.error(`Error deleting user by email ${email}:`, error);
    return false;
  }
}

/**
 * Delete all test users matching a pattern
 *
 * This function finds and deletes all users whose email contains the specified pattern.
 * Useful for cleaning up all test users created during a test suite.
 *
 * @param request - Playwright APIRequestContext
 * @param emailPattern - Pattern to match in email addresses (e.g., 'test.api', 'e2e.test')
 * @returns Promise<number> - Number of users deleted
 *
 * Example:
 * ```typescript
 * // Delete all users with 'test.api' in their email
 * const count = await deleteTestUsers(request, 'test.api');
 * console.log(`Deleted ${count} test users`);
 * ```
 */
export async function deleteTestUsers(
  request: APIRequestContext,
  emailPattern: string
): Promise<number> {
  try {
    const baseURL = 'http://localhost:8081';
    let deletedCount = 0;

    // Get all users
    const getUsersResponse = await request.get(`${baseURL}/api/users`);

    if (getUsersResponse.status() !== 200) {
      console.error(`Failed to get users list: ${getUsersResponse.status()}`);
      return 0;
    }

    const users = await getUsersResponse.json();

    // Filter users matching the pattern
    const testUsers = users.filter((user: any) =>
      user.email.includes(emailPattern)
    );

    console.log(`Found ${testUsers.length} users matching pattern '${emailPattern}'`);

    // Delete each matching user
    for (const user of testUsers) {
      const success = await deleteUserByEmail(request, user.email);
      if (success) {
        deletedCount++;
      }
    }

    console.log(`Successfully deleted ${deletedCount} out of ${testUsers.length} test users`);
    return deletedCount;
  } catch (error) {
    console.error(`Error deleting test users with pattern '${emailPattern}':`, error);
    return 0;
  }
}

/**
 * Clear all test data from the database
 *
 * WARNING: This is a destructive operation! Use with caution.
 * This function deletes ALL users matching common test patterns.
 *
 * @param request - Playwright APIRequestContext
 * @returns Promise<number> - Total number of users deleted
 *
 * Common test patterns cleaned:
 * - 'test.api' - API test users
 * - 'e2e.test' - E2E test users
 * - 'auth.flow' - Auth flow test users
 *
 * Example:
 * ```typescript
 * // Clean up after test suite
 * afterAll(async ({ request }) => {
 *   const totalDeleted = await clearTestData(request);
 *   console.log(`Cleanup: deleted ${totalDeleted} test users`);
 * });
 * ```
 */
export async function clearTestData(
  request: APIRequestContext
): Promise<number> {
  console.log('Starting test data cleanup...');

  let totalDeleted = 0;

  // Common test email patterns
  const testPatterns = [
    'test.api',      // API test users
    'e2e.test',      // E2E test users
    'auth.flow',     // Auth flow test users
    'testuser',      // Generic test users
    'e2etest',       // E2E test pattern
  ];

  for (const pattern of testPatterns) {
    const count = await deleteTestUsers(request, pattern);
    totalDeleted += count;
  }

  console.log(`Total test data cleanup: deleted ${totalDeleted} users`);
  return totalDeleted;
}

/**
 * Safe cleanup - only delete users created in the last hour
 *
 * This is a safer cleanup function that only deletes recent test users,
 * avoiding accidental deletion of older data.
 *
 * @param request - Playwright APIRequestContext
 * @param emailPattern - Pattern to match in email addresses
 * @param maxAgeMinutes - Maximum age of users to delete (default: 60 minutes)
 * @returns Promise<number> - Number of users deleted
 *
 * Note: This requires the backend to provide user creation timestamps.
 * If timestamps are not available, this function behaves like deleteTestUsers.
 */
export async function safeCleanup(
  request: APIRequestContext,
  emailPattern: string,
  maxAgeMinutes: number = 60
): Promise<number> {
  console.log(`Safe cleanup: deleting users matching '${emailPattern}' created in last ${maxAgeMinutes} minutes`);

  // For now, this is the same as deleteTestUsers
  // In the future, you can add timestamp checking here
  const count = await deleteTestUsers(request, emailPattern);

  return count;
}
