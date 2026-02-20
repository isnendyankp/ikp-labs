import { test, expect } from "@playwright/test";
import { ApiClient } from "./helpers/api-client";
import { AuthHelper } from "./helpers/auth-helper";
import {
  generateUniqueEmail,
  generateRandomFullName,
  generateValidPassword,
} from "./helpers/test-data";

/**
 * User Management API Tests
 *
 * Tests all user management endpoints:
 * - POST /api/users (create user)
 * - GET /api/users (get all users)
 * - GET /api/users/{id} (get user by ID)
 * - PUT /api/users/{id} (update user)
 * - DELETE /api/users/{id} (delete user)
 * - GET /api/users/email/{email} (get user by email)
 * - GET /api/users/check-email/{email} (check if email exists)
 * - GET /api/users/count (get total user count)
 */

test.describe("User Management API Tests", () => {
  let validToken: string;
  let testUserId: number;

  // Register and get a valid JWT token before all tests
  test.beforeAll(async ({ request }) => {
    const client = new ApiClient(request);
    const authHelper = new AuthHelper(client);

    // Register a new user to get token (CI has fresh DB)
    const result = await authHelper.registerAndGetToken();

    validToken = result.token;
  });

  /**
   * POST /api/users - Create User Endpoint
   */
  test.describe("POST /api/users", () => {
    test("Should create user successfully with valid data", async ({
      request,
    }) => {
      const client = new ApiClient(request);

      const newUserData = {
        fullName: generateRandomFullName(),
        email: generateUniqueEmail(),
        password: generateValidPassword(),
      };

      const response = await client.post("/api/users", newUserData, validToken);

      // Verify response status
      expect(response.status).toBe(201);

      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("created");
      expect(response.body.user).toBeTruthy();

      // Verify user data
      expect(response.body.user.email).toBe(newUserData.email);
      expect(response.body.user.fullName).toBe(newUserData.fullName);
      expect(response.body.user.id).toBeTruthy();

      // Store test user ID for later tests
      testUserId = response.body.user.id;

      console.log("✅ Test: Create user with valid data - PASSED");
    });

    test("Should reject user creation without JWT token", async ({
      request,
    }) => {
      const client = new ApiClient(request);

      const newUserData = {
        fullName: "Unauthorized User",
        email: generateUniqueEmail(),
        password: generateValidPassword(),
      };

      // No token provided
      const response = await client.post("/api/users", newUserData);

      // Verify response status (401 Unauthorized)
      expect(response.status).toBe(401);

      console.log("✅ Test: Reject create user without token - PASSED");
    });

    test("Should reject duplicate email when creating user", async ({
      request,
    }) => {
      const client = new ApiClient(request);

      const duplicateEmailData = {
        fullName: "Duplicate Email User",
        email: "testuser123@example.com", // Email that already exists
        password: generateValidPassword(),
      };

      const response = await client.post(
        "/api/users",
        duplicateEmailData,
        validToken,
      );

      // Verify response status
      expect(response.status).toBe(400);

      // Verify error message
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("already exists");

      console.log("✅ Test: Reject duplicate email - PASSED");
    });

    test("Should validate required fields when creating user", async ({
      request,
    }) => {
      const client = new ApiClient(request);

      // Send request with empty fields
      const invalidData = {
        fullName: "",
        email: "",
        password: "",
      };

      const response = await client.post("/api/users", invalidData, validToken);

      // Verify response status
      expect(response.status).toBe(400);

      // Verify error response
      expect(response.body.success).toBe(false);

      console.log(
        "✅ Test: Validate required fields when creating user - PASSED",
      );
    });

    test("Should validate email format when creating user", async ({
      request,
    }) => {
      const client = new ApiClient(request);

      const invalidEmailData = {
        fullName: "Invalid Email User",
        email: "not-a-valid-email", // Invalid email format
        password: generateValidPassword(),
      };

      const response = await client.post(
        "/api/users",
        invalidEmailData,
        validToken,
      );

      // Verify response status
      expect(response.status).toBe(400);

      console.log("✅ Test: Validate email format when creating user - PASSED");
    });
  });

  /**
   * GET /api/users - Get All Users Endpoint
   */
  test.describe("GET /api/users", () => {
    test("Should retrieve all users with valid JWT token", async ({
      request,
    }) => {
      const client = new ApiClient(request);

      const response = await client.get("/api/users", validToken);

      // Verify response status
      expect(response.status).toBe(200);

      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.users)).toBe(true);
      expect(response.body.users.length).toBeGreaterThan(0);

      // Verify user objects have required fields
      const firstUser = response.body.users[0];
      expect(firstUser.id).toBeTruthy();
      expect(firstUser.email).toBeTruthy();
      expect(firstUser.fullName).toBeTruthy();

      console.log("✅ Test: Retrieve all users with valid token - PASSED");
    });

    test("Should reject get all users without JWT token", async ({
      request,
    }) => {
      const client = new ApiClient(request);

      // No token provided
      const response = await client.get("/api/users");

      // Verify response status (401 Unauthorized)
      expect(response.status).toBe(401);

      console.log("✅ Test: Reject get all users without token - PASSED");
    });

    test("Should reject get all users with invalid JWT token", async ({
      request,
    }) => {
      const client = new ApiClient(request);

      const invalidToken = "invalid.jwt.token.here";
      const response = await client.get("/api/users", invalidToken);

      // Verify response status (401 Unauthorized)
      expect(response.status).toBe(401);

      console.log("✅ Test: Reject get all users with invalid token - PASSED");
    });
  });

  /**
   * GET /api/users/{id} - Get User By ID Endpoint
   */
  test.describe("GET /api/users/{id}", () => {
    test("Should retrieve user by ID with valid JWT token", async ({
      request,
    }) => {
      const client = new ApiClient(request);

      // First, create a user to get a valid ID
      const newUserData = {
        fullName: generateRandomFullName(),
        email: generateUniqueEmail(),
        password: generateValidPassword(),
      };

      const createResponse = await client.post(
        "/api/users",
        newUserData,
        validToken,
      );
      const userId = createResponse.body.user.id;

      // Now retrieve the user by ID
      const response = await client.get(`/api/users/${userId}`, validToken);

      // Verify response status
      expect(response.status).toBe(200);

      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeTruthy();

      // Verify user data matches
      expect(response.body.user.id).toBe(userId);
      expect(response.body.user.email).toBe(newUserData.email);
      expect(response.body.user.fullName).toBe(newUserData.fullName);

      console.log("✅ Test: Retrieve user by ID with valid token - PASSED");
    });

    test("Should reject get user by ID without JWT token", async ({
      request,
    }) => {
      const client = new ApiClient(request);

      // Try to get user without token
      const response = await client.get("/api/users/1");

      // Verify response status (401 Unauthorized)
      expect(response.status).toBe(401);

      console.log("✅ Test: Reject get user by ID without token - PASSED");
    });

    test("Should return 404 for non-existent user ID", async ({ request }) => {
      const client = new ApiClient(request);

      const nonExistentId = 999999;
      const response = await client.get(
        `/api/users/${nonExistentId}`,
        validToken,
      );

      // Verify response status (404 Not Found)
      expect(response.status).toBe(404);

      console.log("✅ Test: Return 404 for non-existent user ID - PASSED");
    });
  });

  /**
   * PUT /api/users/{id} - Update User Endpoint
   */
  test.describe("PUT /api/users/{id}", () => {
    test("Should update user successfully with valid data", async ({
      request,
    }) => {
      const client = new ApiClient(request);

      // First, create a user to update
      const newUserData = {
        fullName: generateRandomFullName(),
        email: generateUniqueEmail(),
        password: generateValidPassword(),
      };

      const createResponse = await client.post(
        "/api/users",
        newUserData,
        validToken,
      );
      const userId = createResponse.body.user.id;

      // Update the user
      const updateData = {
        fullName: "Updated Full Name",
        email: generateUniqueEmail(), // New unique email
        password: "NewPassword123!",
      };

      const response = await client.put(
        `/api/users/${userId}`,
        updateData,
        validToken,
      );

      // Verify response status
      expect(response.status).toBe(200);

      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("updated");
      expect(response.body.user).toBeTruthy();

      // Verify updated data
      expect(response.body.user.id).toBe(userId);
      expect(response.body.user.fullName).toBe(updateData.fullName);
      expect(response.body.user.email).toBe(updateData.email);

      console.log("✅ Test: Update user with valid data - PASSED");
    });

    test("Should reject update without JWT token", async ({ request }) => {
      const client = new ApiClient(request);

      const updateData = {
        fullName: "Unauthorized Update",
        email: generateUniqueEmail(),
        password: "NewPassword123!",
      };

      // Try to update without token
      const response = await client.put("/api/users/1", updateData);

      // Verify response status (401 Unauthorized)
      expect(response.status).toBe(401);

      console.log("✅ Test: Reject update without token - PASSED");
    });

    test("Should return 404 when updating non-existent user", async ({
      request,
    }) => {
      const client = new ApiClient(request);

      const nonExistentId = 999999;
      const updateData = {
        fullName: "Non-existent User",
        email: generateUniqueEmail(),
        password: "NewPassword123!",
      };

      const response = await client.put(
        `/api/users/${nonExistentId}`,
        updateData,
        validToken,
      );

      // Verify response status (404 Not Found)
      expect(response.status).toBe(404);

      console.log(
        "✅ Test: Return 404 when updating non-existent user - PASSED",
      );
    });

    test("Should reject update with duplicate email", async ({ request }) => {
      const client = new ApiClient(request);

      // Create first user
      const user1Data = {
        fullName: "User One",
        email: generateUniqueEmail(),
        password: generateValidPassword(),
      };
      const user1Response = await client.post(
        "/api/users",
        user1Data,
        validToken,
      );
      const user1Id = user1Response.body.user.id;

      // Create second user
      const user2Data = {
        fullName: "User Two",
        email: generateUniqueEmail(),
        password: generateValidPassword(),
      };
      const user2Response = await client.post(
        "/api/users",
        user2Data,
        validToken,
      );

      // Try to update user1 with user2's email (duplicate)
      const updateData = {
        fullName: "User One Updated",
        email: user2Data.email, // Duplicate email
        password: "NewPassword123!",
      };

      const response = await client.put(
        `/api/users/${user1Id}`,
        updateData,
        validToken,
      );

      // Verify response status (400 Bad Request)
      expect(response.status).toBe(400);
      expect(response.body.message).toContain("already exists");

      console.log("✅ Test: Reject update with duplicate email - PASSED");
    });
  });

  /**
   * DELETE /api/users/{id} - Delete User Endpoint
   */
  test.describe("DELETE /api/users/{id}", () => {
    test("Should delete user successfully with valid JWT token", async ({
      request,
    }) => {
      const client = new ApiClient(request);

      // First, create a user to delete
      const newUserData = {
        fullName: generateRandomFullName(),
        email: generateUniqueEmail(),
        password: generateValidPassword(),
      };

      const createResponse = await client.post(
        "/api/users",
        newUserData,
        validToken,
      );
      const userId = createResponse.body.user.id;

      // Delete the user
      const response = await client.delete(`/api/users/${userId}`, validToken);

      // Verify response status
      expect(response.status).toBe(200);

      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("deleted");

      // Verify user is actually deleted by trying to get it
      const getResponse = await client.get(`/api/users/${userId}`, validToken);
      expect(getResponse.status).toBe(404);

      console.log("✅ Test: Delete user successfully - PASSED");
    });

    test("Should reject delete without JWT token", async ({ request }) => {
      const client = new ApiClient(request);

      // Try to delete without token
      const response = await client.delete("/api/users/1");

      // Verify response status (401 Unauthorized)
      expect(response.status).toBe(401);

      console.log("✅ Test: Reject delete without token - PASSED");
    });

    test("Should return 404 when deleting non-existent user", async ({
      request,
    }) => {
      const client = new ApiClient(request);

      const nonExistentId = 999999;
      const response = await client.delete(
        `/api/users/${nonExistentId}`,
        validToken,
      );

      // Verify response status (404 Not Found)
      expect(response.status).toBe(404);

      console.log(
        "✅ Test: Return 404 when deleting non-existent user - PASSED",
      );
    });
  });

  /**
   * GET /api/users/email/{email} - Get User By Email Endpoint
   */
  test.describe("GET /api/users/email/{email}", () => {
    test("Should retrieve user by email with valid JWT token", async ({
      request,
    }) => {
      const client = new ApiClient(request);

      // First, create a user with known email
      const newUserData = {
        fullName: generateRandomFullName(),
        email: generateUniqueEmail(),
        password: generateValidPassword(),
      };

      await client.post("/api/users", newUserData, validToken);

      // Now retrieve the user by email
      const response = await client.get(
        `/api/users/email/${newUserData.email}`,
        validToken,
      );

      // Verify response status
      expect(response.status).toBe(200);

      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeTruthy();

      // Verify user data matches
      expect(response.body.user.email).toBe(newUserData.email);
      expect(response.body.user.fullName).toBe(newUserData.fullName);

      console.log("✅ Test: Retrieve user by email with valid token - PASSED");
    });

    test("Should reject get user by email without JWT token", async ({
      request,
    }) => {
      const client = new ApiClient(request);

      // Try to get user by email without token
      const response = await client.get("/api/users/email/test@example.com");

      // Verify response status (401 Unauthorized)
      expect(response.status).toBe(401);

      console.log("✅ Test: Reject get user by email without token - PASSED");
    });

    test("Should return 404 for non-existent email", async ({ request }) => {
      const client = new ApiClient(request);

      const nonExistentEmail = `nonexistent${Date.now()}@example.com`;
      const response = await client.get(
        `/api/users/email/${nonExistentEmail}`,
        validToken,
      );

      // Verify response status (404 Not Found)
      expect(response.status).toBe(404);

      console.log("✅ Test: Return 404 for non-existent email - PASSED");
    });
  });

  /**
   * GET /api/users/check-email/{email} - Check Email Exists Endpoint
   */
  test.describe("GET /api/users/check-email/{email}", () => {
    test("Should return true for existing email", async ({ request }) => {
      const client = new ApiClient(request);

      // First, create a user with known email
      const newUserData = {
        fullName: generateRandomFullName(),
        email: generateUniqueEmail(),
        password: generateValidPassword(),
      };

      await client.post("/api/users", newUserData, validToken);

      // Check if email exists
      const response = await client.get(
        `/api/users/check-email/${newUserData.email}`,
        validToken,
      );

      // Verify response status
      expect(response.status).toBe(200);

      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.exists).toBe(true);

      console.log("✅ Test: Return true for existing email - PASSED");
    });

    test("Should return false for non-existent email", async ({ request }) => {
      const client = new ApiClient(request);

      const nonExistentEmail = `nonexistent${Date.now()}@example.com`;
      const response = await client.get(
        `/api/users/check-email/${nonExistentEmail}`,
        validToken,
      );

      // Verify response status
      expect(response.status).toBe(200);

      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.exists).toBe(false);

      console.log("✅ Test: Return false for non-existent email - PASSED");
    });

    test("Should reject check-email without JWT token", async ({ request }) => {
      const client = new ApiClient(request);

      // Try to check email without token
      const response = await client.get(
        "/api/users/check-email/test@example.com",
      );

      // Verify response status (401 Unauthorized)
      expect(response.status).toBe(401);

      console.log("✅ Test: Reject check-email without token - PASSED");
    });
  });

  /**
   * GET /api/users/count - Get Total User Count Endpoint
   */
  test.describe("GET /api/users/count", () => {
    test("Should return total user count with valid JWT token", async ({
      request,
    }) => {
      const client = new ApiClient(request);

      const response = await client.get("/api/users/count", validToken);

      // Verify response status
      expect(response.status).toBe(200);

      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeDefined();
      expect(typeof response.body.count).toBe("number");
      expect(response.body.count).toBeGreaterThan(0);

      console.log("✅ Test: Return total user count with valid token - PASSED");
    });

    test("Should reject get user count without JWT token", async ({
      request,
    }) => {
      const client = new ApiClient(request);

      // Try to get count without token
      const response = await client.get("/api/users/count");

      // Verify response status (401 Unauthorized)
      expect(response.status).toBe(401);

      console.log("✅ Test: Reject get user count without token - PASSED");
    });
  });
});
