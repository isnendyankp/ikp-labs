import { test, expect } from "@playwright/test";
import { ApiClient } from "./helpers/api-client";
import { AuthHelper } from "./helpers/auth-helper";

/**
 * Protected API Endpoint Tests
 *
 * Tests JWT authentication on protected backend endpoints.
 * Uses Playwright's request API (no browser needed).
 *
 * Endpoints tested:
 * - GET /api/user/profile (protected)
 * - GET /api/user/dashboard (protected)
 * - GET /api/user/settings (protected)
 */

test.describe("Protected API Endpoints - JWT Authentication", () => {
  let validToken: string;
  let userEmail: string;
  let userFullName: string;

  /**
   * Setup: Register and get valid token before all tests
   */
  test.beforeAll(async ({ request }) => {
    const client = new ApiClient(request);
    const authHelper = new AuthHelper(client);

    // Register a new user to get token (CI has fresh DB)
    const loginResult = await authHelper.registerAndGetToken();

    validToken = loginResult.token;
    userEmail = loginResult.email;
    userFullName = loginResult.fullName;

    expect(validToken).toBeTruthy();
    console.log("✅ Setup: Valid token obtained for protected endpoint tests");
  });

  /**
   * Test 1: Access /api/user/profile WITH valid token
   */
  test("GET /api/user/profile - should return user profile with valid JWT", async ({
    request,
  }) => {
    const client = new ApiClient(request);

    const response = await client.get("/api/user/profile", validToken);

    // Verify response status
    expect(response.status).toBe(200);

    // Verify response body
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain("profile retrieved successfully");

    // Verify user data
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe(userEmail);
    expect(response.body.user.fullName).toBe(userFullName);

    console.log("✅ Test 1: Protected endpoint accessible with valid token");
  });

  /**
   * Test 2: Access /api/user/profile WITHOUT token (401)
   */
  test("GET /api/user/profile - should reject request without JWT (401)", async ({
    request,
  }) => {
    const client = new ApiClient(request);

    const response = await client.get("/api/user/profile");

    // Verify 401 Unauthorized
    expect(response.status).toBe(401);

    console.log("✅ Test 2: Request without token rejected (401)");
  });

  /**
   * Test 3: Access /api/user/profile with INVALID token (401)
   */
  test("GET /api/user/profile - should reject invalid JWT token (401)", async ({
    request,
  }) => {
    const client = new ApiClient(request);
    const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.INVALID.TOKEN";

    const response = await client.get("/api/user/profile", invalidToken);

    // Verify 401 Unauthorized
    expect(response.status).toBe(401);

    console.log("✅ Test 3: Request with invalid token rejected (401)");
  });

  /**
   * Test 4: Access /api/user/profile with MALFORMED token (401)
   */
  test("GET /api/user/profile - should reject malformed JWT (401)", async ({
    request,
  }) => {
    const client = new ApiClient(request);
    const malformedToken = "not-a-valid-jwt-token-at-all";

    const response = await client.get("/api/user/profile", malformedToken);

    // Verify 401 Unauthorized
    expect(response.status).toBe(401);

    console.log("✅ Test 4: Request with malformed token rejected (401)");
  });

  /**
   * Test 5: Access /api/user/dashboard WITH valid token
   */
  test("GET /api/user/dashboard - should return dashboard with valid JWT", async ({
    request,
  }) => {
    const client = new ApiClient(request);

    const response = await client.get("/api/user/dashboard", validToken);

    // Verify response status
    expect(response.status).toBe(200);

    // Verify response body
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain("Welcome to your dashboard");

    // Verify dashboard data
    expect(response.body.dashboard).toBeDefined();
    expect(response.body.dashboard.userId).toBeDefined();
    expect(response.body.dashboard.welcomeMessage).toBeDefined();

    console.log("✅ Test 5: Dashboard endpoint accessible with valid token");
  });

  /**
   * Test 6: Access /api/user/dashboard WITHOUT token (401)
   */
  test("GET /api/user/dashboard - should reject request without JWT (401)", async ({
    request,
  }) => {
    const client = new ApiClient(request);

    const response = await client.get("/api/user/dashboard");

    // Verify 401 Unauthorized
    expect(response.status).toBe(401);

    console.log("✅ Test 6: Dashboard request without token rejected (401)");
  });

  /**
   * Test 7: Access /api/user/settings WITH valid token
   */
  test("GET /api/user/settings - should return settings with valid JWT", async ({
    request,
  }) => {
    const client = new ApiClient(request);

    const response = await client.get("/api/user/settings", validToken);

    // Verify response status
    expect(response.status).toBe(200);

    // Verify response body
    expect(response.body.success).toBe(true);

    // Verify settings data
    expect(response.body.settings).toBeDefined();
    expect(response.body.settings.userId).toBeDefined();
    expect(response.body.settings.email).toBe(userEmail);

    console.log("✅ Test 7: Settings endpoint accessible with valid token");
  });

  /**
   * Test 8: Access /api/user/settings WITHOUT token (401)
   */
  test("GET /api/user/settings - should reject request without JWT (401)", async ({
    request,
  }) => {
    const client = new ApiClient(request);

    const response = await client.get("/api/user/settings");

    // Verify 401 Unauthorized
    expect(response.status).toBe(401);

    console.log("✅ Test 8: Settings request without token rejected (401)");
  });

  /**
   * Test 9: Decode token and verify user information
   */
  test("Should decode JWT and verify payload contains user info", async () => {
    // Decode JWT payload (client-side, no verification)
    const parts = validToken.split(".");
    expect(parts.length).toBe(3);

    // Decode base64 payload
    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());

    // Verify payload contains expected fields
    expect(payload.email).toBe(userEmail);
    expect(payload.fullName).toBe(userFullName);
    expect(payload.exp).toBeTruthy(); // Expiration time
    expect(payload.iat).toBeTruthy(); // Issued at time

    // Verify token not expired
    const now = Date.now() / 1000; // Convert to seconds
    expect(payload.exp).toBeGreaterThan(now);

    console.log("✅ Test 9: Token payload contains correct user information");
  });

  /**
   * Test 10: Multiple protected endpoints with same token
   */
  test("Should access multiple protected endpoints with same JWT", async ({
    request,
  }) => {
    const client = new ApiClient(request);

    // Access profile
    const profileResponse = await client.get("/api/user/profile", validToken);
    expect(profileResponse.status).toBe(200);

    // Access dashboard
    const dashboardResponse = await client.get(
      "/api/user/dashboard",
      validToken,
    );
    expect(dashboardResponse.status).toBe(200);

    // Access settings
    const settingsResponse = await client.get("/api/user/settings", validToken);
    expect(settingsResponse.status).toBe(200);

    // All should return same user email
    expect(profileResponse.body.user.email).toBe(userEmail);
    expect(settingsResponse.body.settings.email).toBe(userEmail);

    console.log(
      "✅ Test 10: Multiple protected endpoints accessible with same token",
    );
  });
});
