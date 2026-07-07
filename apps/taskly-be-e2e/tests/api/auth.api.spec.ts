import { test, expect } from "@playwright/test";
import { ApiClient } from "../../helpers/api-client";
import { AuthHelper } from "../../helpers/auth-helper";
import { uniqueEmail, validPassword } from "../../helpers/test-data";

// ── POST /api/auth/register ──────────────────────────────────────────────────

test.describe("POST /api/auth/register", () => {
  test("returns 201 with {id, email} for valid email and password", async ({
    request,
  }) => {
    const client = new ApiClient(request);
    const email = uniqueEmail();

    const res = await client.post("/api/auth/register", {
      email,
      password: validPassword(),
    });

    expect(res.status).toBe(201);
    expect((res.body as { id: number }).id).toBeGreaterThan(0);
    expect((res.body as { email: string }).email).toBe(email);
    expect(res.body).not.toHaveProperty("password_hash");
  });

  test("returns 409 when email is already registered", async ({ request }) => {
    const client = new ApiClient(request);
    const email = uniqueEmail();
    const password = validPassword();

    await client.post("/api/auth/register", { email, password });
    const res = await client.post("/api/auth/register", { email, password });

    expect(res.status).toBe(409);
    expect((res.body as { error: string }).error).toContain("already");
  });

  test("returns 400 when email field is missing", async ({ request }) => {
    const client = new ApiClient(request);

    const res = await client.post("/api/auth/register", {
      password: validPassword(),
    });

    expect(res.status).toBe(400);
  });

  test("returns 400 when email is an invalid format", async ({ request }) => {
    const client = new ApiClient(request);

    const res = await client.post("/api/auth/register", {
      email: "not-an-email",
      password: validPassword(),
    });

    expect(res.status).toBe(400);
  });

  test("returns 400 when password is shorter than 8 characters", async ({
    request,
  }) => {
    const client = new ApiClient(request);

    const res = await client.post("/api/auth/register", {
      email: uniqueEmail(),
      password: "short",
    });

    expect(res.status).toBe(400);
  });
});

// ── POST /api/auth/login ─────────────────────────────────────────────────────

test.describe("POST /api/auth/login", () => {
  test("returns 200 with {token} for correct credentials", async ({
    request,
  }) => {
    const client = new ApiClient(request);
    const email = uniqueEmail();
    const password = validPassword();

    await client.post("/api/auth/register", { email, password });
    const res = await client.post("/api/auth/login", { email, password });

    expect(res.status).toBe(200);
    const token = (res.body as { token: string }).token;
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  test("returns 401 for wrong password", async ({ request }) => {
    const client = new ApiClient(request);
    const email = uniqueEmail();

    await client.post("/api/auth/register", {
      email,
      password: validPassword(),
    });
    const res = await client.post("/api/auth/login", {
      email,
      password: "WrongPass99!",
    });

    expect(res.status).toBe(401);
    expect((res.body as { error: string }).error).toContain("invalid");
  });

  test("returns 401 for unknown email", async ({ request }) => {
    const client = new ApiClient(request);

    const res = await client.post("/api/auth/login", {
      email: uniqueEmail(),
      password: validPassword(),
    });

    expect(res.status).toBe(401);
    expect((res.body as { error: string }).error).toContain("invalid");
  });

  test("returns 400 when email field is missing", async ({ request }) => {
    const client = new ApiClient(request);

    const res = await client.post("/api/auth/login", {
      password: validPassword(),
    });

    expect(res.status).toBe(400);
  });

  test("returns 400 when password field is missing", async ({ request }) => {
    const client = new ApiClient(request);

    const res = await client.post("/api/auth/login", {
      email: uniqueEmail(),
    });

    expect(res.status).toBe(400);
  });
});

// ── GET /api/me ──────────────────────────────────────────────────────────────

test.describe("GET /api/me", () => {
  test("returns 200 with {id, email} for valid token", async ({ request }) => {
    const client = new ApiClient(request);
    const auth = new AuthHelper(client);
    const email = uniqueEmail();

    const { token, userId } = await auth.registerAndLogin(
      email,
      validPassword(),
    );
    const res = await client.get("/api/me", token);

    expect(res.status).toBe(200);
    expect((res.body as { id: number }).id).toBe(userId);
    expect((res.body as { email: string }).email).toBe(email);
  });

  test("returns 401 when Authorization header is absent", async ({
    request,
  }) => {
    const client = new ApiClient(request);

    const res = await client.get("/api/me");

    expect(res.status).toBe(401);
    expect((res.body as { error: string }).error).toContain("authorization");
  });

  test("returns 401 for a malformed token", async ({ request }) => {
    const client = new ApiClient(request);

    const res = await client.get("/api/me", "Bearer this.is.not.valid");

    expect(res.status).toBe(401);
  });
});
