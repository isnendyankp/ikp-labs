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
