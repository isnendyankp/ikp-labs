/**
 * Test Data Generator Utilities
 *
 * This module provides functions to generate unique, valid test data
 * for API testing. All generated data follows the backend validation rules.
 */

/**
 * Generate unique email address for testing
 * Format: test.api.{timestamp}.{random}@example.com
 */
export function generateUniqueEmail(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `test.api.${timestamp}.${random}@example.com`;
}

/**
 * Generate random full name from sample data
 */
export function generateRandomFullName(): string {
  const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
  const lastNames = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${firstName} ${lastName}`;
}

/**
 * Get a valid password that meets backend validation requirements
 * Requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
export function generateValidPassword(): string {
  return 'TestPass123!';
}

/**
 * Generate weak password for validation testing
 */
export function generateWeakPassword(): string {
  return 'weak';
}

/**
 * Generate complete valid user data
 */
export interface UserData {
  fullName: string;
  email: string;
  password: string;
}

export function generateValidUserData(): UserData {
  return {
    fullName: generateRandomFullName(),
    email: generateUniqueEmail(),
    password: generateValidPassword(),
  };
}

/**
 * Generate registration request data (includes confirmPassword)
 */
export interface RegistrationData extends UserData {
  confirmPassword: string;
}

export function generateRegistrationData(): RegistrationData {
  const password = generateValidPassword();
  return {
    fullName: generateRandomFullName(),
    email: generateUniqueEmail(),
    password,
    confirmPassword: password,
  };
}
