import { ApiClient } from './api-client';
import { generateRegistrationData, RegistrationData } from './test-data';

/**
 * AuthHelper - Utilities for authentication in tests
 *
 * This class provides helper methods for common authentication operations
 * like registering users and obtaining JWT tokens for testing.
 */
export class AuthHelper {
  constructor(private client: ApiClient) {}

  /**
   * Register a new user and return the JWT token
   *
   * @param userData - Optional user data. If not provided, generates random data
   * @returns Object with token, userId, email, and full response
   */
  async registerAndGetToken(userData?: RegistrationData) {
    const data = userData || generateRegistrationData();

    const response = await this.client.post('/api/auth/register', data);

    if (response.status !== 201 || !response.body.token) {
      throw new Error(
        `Registration failed: ${response.status} - ${JSON.stringify(response.body)}`
      );
    }

    return {
      token: response.body.token,
      userId: response.body.userId,
      email: response.body.email,
      fullName: response.body.fullName,
      response: response.body,
    };
  }

  /**
   * Login with credentials and return the JWT token
   *
   * @param email - User email
   * @param password - User password
   * @returns Object with token, userId, email, and full response
   */
  async loginAndGetToken(email: string, password: string) {
    const response = await this.client.post('/api/auth/login', { email, password });

    if (response.status !== 200 || !response.body.token) {
      throw new Error(
        `Login failed: ${response.status} - ${JSON.stringify(response.body)}`
      );
    }

    return {
      token: response.body.token,
      userId: response.body.userId,
      email: response.body.email,
      fullName: response.body.fullName,
      response: response.body,
    };
  }

  /**
   * Register a user and login (combined operation)
   *
   * @param email - User email
   * @param fullName - User full name
   * @param password - User password
   * @returns Object with token, userId, email, fullName
   */
  async registerAndLogin(email: string, fullName: string, password: string) {
    const userData: RegistrationData = {
      email,
      fullName,
      password,
    };

    const response = await this.client.post('/api/auth/register', userData);

    if (response.status !== 201 || !response.body.token) {
      throw new Error(
        `Registration failed: ${response.status} - ${JSON.stringify(response.body)}`
      );
    }

    return {
      token: response.body.token,
      userId: response.body.userId,
      email: response.body.email,
      fullName: response.body.fullName,
    };
  }

  /**
   * Delete a user (for test cleanup)
   *
   * @param userId - User ID to delete
   * @param token - JWT token for authorization
   */
  async deleteUser(userId: number, token: string) {
    const response = await this.client.delete(`/api/users/${userId}`, token);

    if (response.status !== 204 && response.status !== 200) {
      throw new Error(
        `User deletion failed: ${response.status} - ${JSON.stringify(response.body)}`
      );
    }
  }

  /**
   * Validate JWT token format (basic check)
   *
   * @param token - JWT token to validate
   * @returns true if token has valid JWT format (3 parts separated by dots)
   */
  validateTokenFormat(token: string): boolean {
    const parts = token.split('.');
    return parts.length === 3;
  }
}
