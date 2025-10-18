import { APIRequestContext } from '@playwright/test';

/**
 * ApiClient - HTTP request wrapper for backend API testing
 *
 * This class provides a clean interface for making HTTP requests to the backend API
 * with automatic JWT token handling and consistent error handling.
 *
 * Usage:
 * ```typescript
 * const client = new ApiClient(request);
 * const response = await client.post('/api/auth/login', { email, password });
 * ```
 */
export class ApiClient {
  private baseURL: string;

  constructor(private request: APIRequestContext) {
    this.baseURL = 'http://localhost:8081';
  }

  /**
   * Send POST request with optional JWT token
   */
  async post(endpoint: string, data: any, token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await this.request.post(`${this.baseURL}${endpoint}`, {
      headers,
      data,
    });

    return {
      status: response.status(),
      body: await response.json().catch(() => ({})),
      headers: response.headers(),
    };
  }

  /**
   * Send GET request with optional JWT token
   */
  async get(endpoint: string, token?: string) {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await this.request.get(`${this.baseURL}${endpoint}`, {
      headers,
    });

    return {
      status: response.status(),
      body: await response.json().catch(() => ({})),
      headers: response.headers(),
    };
  }

  /**
   * Send PUT request with optional JWT token
   */
  async put(endpoint: string, data: any, token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await this.request.put(`${this.baseURL}${endpoint}`, {
      headers,
      data,
    });

    return {
      status: response.status(),
      body: await response.json().catch(() => ({})),
      headers: response.headers(),
    };
  }

  /**
   * Send DELETE request with optional JWT token
   */
  async delete(endpoint: string, token?: string) {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await this.request.delete(`${this.baseURL}${endpoint}`, {
      headers,
    });

    return {
      status: response.status(),
      body: await response.json().catch(() => ({})),
      headers: response.headers(),
    };
  }
}
