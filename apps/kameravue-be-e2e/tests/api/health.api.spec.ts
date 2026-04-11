import { test, expect } from '@playwright/test';

/**
 * Health Check API Test
 *
 * This is a smoke test to verify that:
 * 1. Backend API server is running
 * 2. API tests can make requests successfully
 * 3. Basic response validation works
 */

test.describe('Health Check API', () => {
  test('GET /api/auth/health - should return healthy status', async ({ request }) => {
    // Make GET request to health endpoint
    const response = await request.get('http://localhost:8081/api/auth/health');

    // Verify response status
    expect(response.status()).toBe(200);

    // Parse response body
    const body = await response.json();

    // Verify response structure
    expect(body).toHaveProperty('status');
    expect(body.status).toBe('UP');
    expect(body).toHaveProperty('service');
    expect(body.service).toBe('AuthController');
    expect(body).toHaveProperty('message');
    expect(body.message).toContain('Authentication service is running');
  });
});
