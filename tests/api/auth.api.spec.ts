import { test, expect } from "@playwright/test";
import { ApiClient } from "./helpers/api-client";
import { AuthHelper } from "./helpers/auth-helper";
import {
  generateUniqueEmail,
  generateRandomFullName,
  generateValidPassword,
  generateRegistrationData,
} from "./helpers/test-data";

/**
 * Authentication API Tests
 *
 * Tests all authentication endpoints:
 * - POST /api/auth/register
 * - POST /api/auth/login
 * - POST /api/auth/refresh
 * - POST /api/auth/validate
 * - GET /api/auth/health (tested in health.api.spec.ts)
 */

test.describe("Authentication API Tests", () => {
  /**
   * POST /api/auth/register - User Registration Endpoint
   */
  test.describe("POST /api/auth/register", () => {
    test("Should register successfully with valid data", async ({
      request,
    }) => {
      const client = new ApiClient(request);
      const testData = generateRegistrationData();

      const response = await client.post("/api/auth/register", testData);

      // Verify response status
      expect(response.status).toBe(201);

      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBeTruthy();
      expect(response.body.token).toBeTruthy();

      // Verify user data
      expect(response.body.email).toBe(testData.email);
      expect(response.body.fullName).toBe(testData.fullName);
      expect(response.body.userId).toBeTruthy();

      // Verify JWT token format
      const tokenParts = response.body.token.split(".");
      expect(tokenParts.length).toBe(3); // header.payload.signature

      console.log("✅ Test: Register with valid data - PASSED");
    });

    test("Should reject duplicate email registration", async ({ request }) => {
      const client = new ApiClient(request);
      const email = generateUniqueEmail();

      // First, register a user with this email
      await client.post("/api/auth/register", {
        fullName: "First User",
        email,
        password: "TestPass123!",
        confirmPassword: "TestPass123!",
      });

      // Try to register again with same email
      const duplicateData = {
        fullName: "Duplicate User",
        email, // Same email as above
        password: "TestPass123!",
        confirmPassword: "TestPass123!",
      };

      const response = await client.post("/api/auth/register", duplicateData);

      // Verify response status
      expect(response.status).toBe(400);

      // Verify error response
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("already exists");

      console.log("✅ Test: Reject duplicate email - PASSED");
    });

    test("Should validate required fields", async ({ request }) => {
      const client = new ApiClient(request);

      // Send request with empty fields
      const invalidData = {
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      };

      const response = await client.post("/api/auth/register", invalidData);

      // Verify response status
      expect(response.status).toBe(400);

      console.log("✅ Test: Validate required fields - PASSED");
    });

    test("Should validate email format", async ({ request }) => {
      const client = new ApiClient(request);

      const invalidEmailData = {
        fullName: "Test User",
        email: "invalid-email-format", // Invalid email
        password: "TestPass123!",
        confirmPassword: "TestPass123!",
      };

      const response = await client.post(
        "/api/auth/register",
        invalidEmailData,
      );

      // Verify response status
      expect(response.status).toBe(400);

      console.log("✅ Test: Validate email format - PASSED");
    });

    test("Should validate password strength", async ({ request }) => {
      const client = new ApiClient(request);

      const weakPasswordData = {
        fullName: "Test User",
        email: generateUniqueEmail(),
        password: "weak", // Too weak
        confirmPassword: "weak",
      };

      const response = await client.post(
        "/api/auth/register",
        weakPasswordData,
      );

      // Verify response status
      expect(response.status).toBe(400);

      console.log("✅ Test: Validate password strength - PASSED");
    });

    test.fixme("Should validate password confirmation match", async ({
      request,
    }) => {
      const client = new ApiClient(request);

      const mismatchData = {
        fullName: "Test User",
        email: generateUniqueEmail(),
        password: "TestPass123!",
        confirmPassword: "DifferentPass123!", // Doesn't match
      };

      const response = await client.post("/api/auth/register", mismatchData);

      // Verify response status
      expect(response.status).toBe(400);

      console.log("✅ Test: Validate password confirmation - PASSED");
    });
  });

  /**
   * POST /api/auth/login - User Login Endpoint
   */
  test.describe("POST /api/auth/login", () => {
    test("Should login successfully with valid credentials", async ({
      request,
    }) => {
      const client = new ApiClient(request);
      const password = "SecurePass123!";
      const email = generateUniqueEmail();

      // Register user first (CI has fresh DB)
      await client.post("/api/auth/register", {
        fullName: "Login Test User",
        email,
        password,
        confirmPassword: password,
      });

      // Now login with registered credentials
      const response = await client.post("/api/auth/login", {
        email,
        password,
      });

      // Verify response status
      expect(response.status).toBe(200);

      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBeTruthy();
      expect(response.body.token).toBeTruthy();

      // Verify user data
      expect(response.body.email).toBe(email);
      expect(response.body.fullName).toBeTruthy();
      expect(response.body.userId).toBeTruthy();

      // Verify JWT token format
      const tokenParts = response.body.token.split(".");
      expect(tokenParts.length).toBe(3);

      console.log("✅ Test: Login with valid credentials - PASSED");
    });

    test("Should reject invalid password", async ({ request }) => {
      const client = new ApiClient(request);
      const email = generateUniqueEmail();

      // Register user first
      await client.post("/api/auth/register", {
        fullName: "Password Test User",
        email,
        password: "CorrectPass123!",
        confirmPassword: "CorrectPass123!",
      });

      // Try login with wrong password
      const response = await client.post("/api/auth/login", {
        email,
        password: "WrongPassword123!",
      });

      // Verify response status
      expect(response.status).toBe(401);

      // Verify error response
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Invalid");

      console.log("✅ Test: Reject invalid password - PASSED");
    });

    test("Should reject non-existent email", async ({ request }) => {
      const client = new ApiClient(request);

      const nonExistentData = {
        email: "nonexistent@example.com",
        password: "AnyPassword123!",
      };

      const response = await client.post("/api/auth/login", nonExistentData);

      // Verify response status
      expect(response.status).toBe(401);

      // Verify error response
      expect(response.body.success).toBe(false);

      console.log("✅ Test: Reject non-existent email - PASSED");
    });

    test("Should validate required fields", async ({ request }) => {
      const client = new ApiClient(request);

      // Send request with empty fields
      const invalidData = {
        email: "",
        password: "",
      };

      const response = await client.post("/api/auth/login", invalidData);

      // Verify response status
      expect(response.status).toBe(400);

      console.log("✅ Test: Validate required fields - PASSED");
    });

    test("Should validate email format on login", async ({ request }) => {
      const client = new ApiClient(request);

      const invalidEmailData = {
        email: "not-an-email",
        password: "TestPass123!",
      };

      const response = await client.post("/api/auth/login", invalidEmailData);

      // Verify response status
      expect(response.status).toBe(400);

      console.log("✅ Test: Validate email format - PASSED");
    });
  });

  /**
   * POST /api/auth/refresh - Token Refresh Endpoint
   */
  test.describe("POST /api/auth/refresh", () => {
    let validToken: string;

    // Register and get a valid token before tests
    test.beforeAll(async ({ request }) => {
      const client = new ApiClient(request);
      const authHelper = new AuthHelper(client);

      const result = await authHelper.registerAndGetToken();
      validToken = result.token;
    });

    test("Should refresh valid token", async ({ request }) => {
      const client = new ApiClient(request);

      const response = await client.post(
        "/api/auth/refresh?token=" + validToken,
        {},
      );

      // Verify response status
      expect(response.status).toBe(200);

      // Verify new token returned
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeTruthy();
      expect(response.body.token).not.toBe(validToken); // Should be new token

      console.log("✅ Test: Refresh valid token - PASSED");
    });

    test("Should reject invalid token", async ({ request }) => {
      const client = new ApiClient(request);
      const invalidToken = "invalid.token.here";

      const response = await client.post(
        "/api/auth/refresh?token=" + invalidToken,
        {},
      );

      // Verify response status
      expect(response.status).toBe(401);

      console.log("✅ Test: Reject invalid token - PASSED");
    });

    test("Should reject missing token", async ({ request }) => {
      const client = new ApiClient(request);

      const response = await client.post("/api/auth/refresh?token=", {});

      // Verify response status (401 or 400)
      expect([400, 401]).toContain(response.status);

      console.log("✅ Test: Reject missing token - PASSED");
    });
  });

  /**
   * POST /api/auth/validate - Token Validation Endpoint
   */
  test.describe("POST /api/auth/validate", () => {
    let validToken: string;
    let userEmail: string;

    // Register and get a valid token before tests
    test.beforeAll(async ({ request }) => {
      const client = new ApiClient(request);
      const authHelper = new AuthHelper(client);

      const result = await authHelper.registerAndGetToken();
      validToken = result.token;
      userEmail = result.email;
    });

    test("Should validate valid token", async ({ request }) => {
      const client = new ApiClient(request);

      const response = await client.post(
        `/api/auth/validate?token=${validToken}&email=${userEmail}`,
        {},
      );

      // Verify response status
      expect(response.status).toBe(200);

      // Verify validation response
      expect(response.body.success).toBe(true);
      expect(response.body.valid).toBe(true);
      expect(response.body.message).toContain("valid");

      console.log("✅ Test: Validate valid token - PASSED");
    });

    test("Should reject invalid token", async ({ request }) => {
      const client = new ApiClient(request);
      const invalidToken = "invalid.token.here";

      const response = await client.post(
        `/api/auth/validate?token=${invalidToken}&email=${userEmail}`,
        {},
      );

      // Verify response status
      expect(response.status).toBe(200);

      // Verify validation response (valid: false)
      expect(response.body.success).toBe(true);
      expect(response.body.valid).toBe(false);

      console.log("✅ Test: Validate invalid token - PASSED");
    });

    test("Should reject token with wrong email", async ({ request }) => {
      const client = new ApiClient(request);
      const wrongEmail = "wrong@example.com";

      const response = await client.post(
        `/api/auth/validate?token=${validToken}&email=${wrongEmail}`,
        {},
      );

      // Verify validation response (valid: false)
      expect(response.body.valid).toBe(false);

      console.log("✅ Test: Validate token with wrong email - PASSED");
    });
  });
});
