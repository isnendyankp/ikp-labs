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

  /**
   * Send POST request with multipart/form-data (for file uploads)
   *
   * Usage:
   * ```typescript
   * const response = await client.postMultipart('/api/gallery/upload', {
   *   file: './tests/fixtures/images/test-photo.jpg',
   *   title: 'My Photo',
   *   description: 'Description here',
   *   isPublic: 'false'
   * }, token);
   * ```
   */
  async postMultipart(endpoint: string, formData: Record<string, string>, token?: string) {
    const fs = require('fs');
    const path = require('path');

    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Build multipart form data
    const multipart: any = {};

    for (const [key, value] of Object.entries(formData)) {
      if (key === 'file') {
        // Handle file upload
        const filePath = path.resolve(value);
        if (fs.existsSync(filePath)) {
          multipart[key] = {
            name: path.basename(filePath),
            mimeType: this.getMimeType(filePath),
            buffer: fs.readFileSync(filePath)
          };
        }
      } else {
        // Handle regular form fields
        multipart[key] = value;
      }
    }

    const response = await this.request.post(`${this.baseURL}${endpoint}`, {
      headers,
      multipart,
    });

    return {
      status: response.status(),
      body: await response.json().catch(() => ({})),
      headers: response.headers(),
    };
  }

  /**
   * Get MIME type based on file extension
   */
  private getMimeType(filePath: string): string {
    const ext = filePath.toLowerCase().split('.').pop();
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'pdf': 'application/pdf',
      'txt': 'text/plain'
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
  }
}
