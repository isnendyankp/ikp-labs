import { test, expect } from "@playwright/test";
import { ApiClient } from "../../helpers/api-client";
import { AuthHelper } from "../../helpers/auth-helper";
import { uniqueEmail, validPassword } from "../../helpers/test-data";

// ── POST /api/tasks ──────────────────────────────────────────────────────────

test.describe("POST /api/tasks", () => {
  test("returns 201 with full task object for valid title", async ({
    request,
  }) => {
    const client = new ApiClient(request);
    const { token } = await new AuthHelper(client).registerAndLogin(
      uniqueEmail(),
      validPassword(),
    );

    const res = await client.post("/api/tasks", { title: "Buy groceries" }, token);

    expect(res.status).toBe(201);
    const body = res.body as {
      id: number;
      user_id: number;
      title: string;
      status: string;
      created_at: string;
      updated_at: string;
    };
    expect(body.id).toBeGreaterThan(0);
    expect(body.title).toBe("Buy groceries");
    expect(body.status).toBe("todo");
    expect(body.created_at).toBeTruthy();
    expect(body.updated_at).toBeTruthy();
  });

  test("returns 400 when title is missing from request body", async ({
    request,
  }) => {
    const client = new ApiClient(request);
    const { token } = await new AuthHelper(client).registerAndLogin(
      uniqueEmail(),
      validPassword(),
    );

    const res = await client.post("/api/tasks", {}, token);

    expect(res.status).toBe(400);
  });

  test("returns 401 when Authorization header is absent", async ({
    request,
  }) => {
    const client = new ApiClient(request);

    const res = await client.post("/api/tasks", { title: "Any task" });

    expect(res.status).toBe(401);
    expect((res.body as { error: string }).error).toContain("authorization");
  });
});

// ── GET /api/tasks ───────────────────────────────────────────────────────────

test.describe("GET /api/tasks", () => {
  test("returns 200 with empty array when user has no tasks", async ({
    request,
  }) => {
    const client = new ApiClient(request);
    const { token } = await new AuthHelper(client).registerAndLogin(
      uniqueEmail(),
      validPassword(),
    );

    const res = await client.get("/api/tasks", token);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect((res.body as unknown[]).length).toBe(0);
  });

  test("returns 200 with array containing the user's tasks", async ({
    request,
  }) => {
    const client = new ApiClient(request);
    const { token } = await new AuthHelper(client).registerAndLogin(
      uniqueEmail(),
      validPassword(),
    );

    await client.post("/api/tasks", { title: "Task A" }, token);
    await client.post("/api/tasks", { title: "Task B" }, token);

    const res = await client.get("/api/tasks", token);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect((res.body as unknown[]).length).toBe(2);
  });

  test("returns 401 when Authorization header is absent", async ({
    request,
  }) => {
    const client = new ApiClient(request);

    const res = await client.get("/api/tasks");

    expect(res.status).toBe(401);
  });
});

// ── GET /api/tasks/:id ───────────────────────────────────────────────────────

test.describe("GET /api/tasks/:id", () => {
  test("returns 200 with task object for the task owner", async ({
    request,
  }) => {
    const client = new ApiClient(request);
    const { token } = await new AuthHelper(client).registerAndLogin(
      uniqueEmail(),
      validPassword(),
    );
    const createRes = await client.post(
      "/api/tasks",
      { title: "My task" },
      token,
    );
    const taskId = (createRes.body as { id: number }).id;

    const res = await client.get(`/api/tasks/${taskId}`, token);

    expect(res.status).toBe(200);
    expect((res.body as { id: number }).id).toBe(taskId);
    expect((res.body as { title: string }).title).toBe("My task");
  });

  test("returns 403 when another user requests the task", async ({
    request,
  }) => {
    const client = new ApiClient(request);
    const auth = new AuthHelper(client);

    const userA = await auth.registerAndLogin(uniqueEmail(), validPassword());
    const createRes = await client.post(
      "/api/tasks",
      { title: "User A task" },
      userA.token,
    );
    const taskId = (createRes.body as { id: number }).id;

    const userB = await auth.registerAndLogin(uniqueEmail(), validPassword());
    const res = await client.get(`/api/tasks/${taskId}`, userB.token);

    expect(res.status).toBe(403);
    expect((res.body as { error: string }).error).toContain("forbidden");
  });

  test("returns 404 for a non-existent task id", async ({ request }) => {
    const client = new ApiClient(request);
    const { token } = await new AuthHelper(client).registerAndLogin(
      uniqueEmail(),
      validPassword(),
    );

    const res = await client.get("/api/tasks/999999", token);

    expect(res.status).toBe(404);
    expect((res.body as { error: string }).error).toContain("not found");
  });

  test("returns 401 when Authorization header is absent", async ({
    request,
  }) => {
    const client = new ApiClient(request);

    const res = await client.get("/api/tasks/999999");

    expect(res.status).toBe(401);
  });
});

// ── PUT /api/tasks/:id ───────────────────────────────────────────────────────

test.describe("PUT /api/tasks/:id", () => {
  test("returns 200 with updated task when title is changed", async ({
    request,
  }) => {
    const client = new ApiClient(request);
    const { token } = await new AuthHelper(client).registerAndLogin(
      uniqueEmail(),
      validPassword(),
    );
    const createRes = await client.post(
      "/api/tasks",
      { title: "Old title" },
      token,
    );
    const taskId = (createRes.body as { id: number }).id;

    const res = await client.put(
      `/api/tasks/${taskId}`,
      { title: "New title" },
      token,
    );

    expect(res.status).toBe(200);
    expect((res.body as { title: string }).title).toBe("New title");
    expect((res.body as { status: string }).status).toBe("todo");
  });

  test("returns 200 when status is changed to in_progress", async ({
    request,
  }) => {
    const client = new ApiClient(request);
    const { token } = await new AuthHelper(client).registerAndLogin(
      uniqueEmail(),
      validPassword(),
    );
    const createRes = await client.post(
      "/api/tasks",
      { title: "Work item" },
      token,
    );
    const taskId = (createRes.body as { id: number }).id;

    const res = await client.put(
      `/api/tasks/${taskId}`,
      { status: "in_progress" },
      token,
    );

    expect(res.status).toBe(200);
    expect((res.body as { status: string }).status).toBe("in_progress");
  });

  test("returns 200 when status is changed to done", async ({ request }) => {
    const client = new ApiClient(request);
    const { token } = await new AuthHelper(client).registerAndLogin(
      uniqueEmail(),
      validPassword(),
    );
    const createRes = await client.post(
      "/api/tasks",
      { title: "Finish me" },
      token,
    );
    const taskId = (createRes.body as { id: number }).id;

    const res = await client.put(
      `/api/tasks/${taskId}`,
      { status: "done" },
      token,
    );

    expect(res.status).toBe(200);
    expect((res.body as { status: string }).status).toBe("done");
  });

  test("returns 400 when body contains neither title nor status", async ({
    request,
  }) => {
    const client = new ApiClient(request);
    const { token } = await new AuthHelper(client).registerAndLogin(
      uniqueEmail(),
      validPassword(),
    );
    const createRes = await client.post(
      "/api/tasks",
      { title: "Some task" },
      token,
    );
    const taskId = (createRes.body as { id: number }).id;

    const res = await client.put(`/api/tasks/${taskId}`, {}, token);

    expect(res.status).toBe(400);
    expect((res.body as { error: string }).error).toContain(
      "at least one of title or status",
    );
  });

  test("returns 400 when status is an unrecognized value", async ({
    request,
  }) => {
    const client = new ApiClient(request);
    const { token } = await new AuthHelper(client).registerAndLogin(
      uniqueEmail(),
      validPassword(),
    );
    const createRes = await client.post(
      "/api/tasks",
      { title: "Some task" },
      token,
    );
    const taskId = (createRes.body as { id: number }).id;

    const res = await client.put(
      `/api/tasks/${taskId}`,
      { status: "invalid_status" },
      token,
    );

    expect(res.status).toBe(400);
    expect((res.body as { error: string }).error).toContain(
      "status must be one of",
    );
  });

  test("returns 403 when another user updates the task", async ({
    request,
  }) => {
    const client = new ApiClient(request);
    const auth = new AuthHelper(client);

    const userA = await auth.registerAndLogin(uniqueEmail(), validPassword());
    const createRes = await client.post(
      "/api/tasks",
      { title: "User A task" },
      userA.token,
    );
    const taskId = (createRes.body as { id: number }).id;

    const userB = await auth.registerAndLogin(uniqueEmail(), validPassword());
    const res = await client.put(
      `/api/tasks/${taskId}`,
      { status: "done" },
      userB.token,
    );

    expect(res.status).toBe(403);
    expect((res.body as { error: string }).error).toContain("forbidden");
  });

  test("returns 404 for a non-existent task id", async ({ request }) => {
    const client = new ApiClient(request);
    const { token } = await new AuthHelper(client).registerAndLogin(
      uniqueEmail(),
      validPassword(),
    );

    const res = await client.put(
      "/api/tasks/999999",
      { status: "done" },
      token,
    );

    expect(res.status).toBe(404);
  });

  test("returns 401 when Authorization header is absent", async ({
    request,
  }) => {
    const client = new ApiClient(request);

    const res = await client.put(
      "/api/tasks/999999",
      { status: "done" },
    );

    expect(res.status).toBe(401);
  });
});

// ── DELETE /api/tasks/:id ────────────────────────────────────────────────────

test.describe("DELETE /api/tasks/:id", () => {
  test("returns 204 when owner deletes their task", async ({ request }) => {
    const client = new ApiClient(request);
    const { token } = await new AuthHelper(client).registerAndLogin(
      uniqueEmail(),
      validPassword(),
    );
    const createRes = await client.post(
      "/api/tasks",
      { title: "To be deleted" },
      token,
    );
    const taskId = (createRes.body as { id: number }).id;

    const res = await client.delete(`/api/tasks/${taskId}`, token);

    expect(res.status).toBe(204);

    // Verify task is gone
    const getRes = await client.get(`/api/tasks/${taskId}`, token);
    expect(getRes.status).toBe(404);
  });

  test("returns 403 when another user deletes the task", async ({
    request,
  }) => {
    const client = new ApiClient(request);
    const auth = new AuthHelper(client);

    const userA = await auth.registerAndLogin(uniqueEmail(), validPassword());
    const createRes = await client.post(
      "/api/tasks",
      { title: "User A task" },
      userA.token,
    );
    const taskId = (createRes.body as { id: number }).id;

    const userB = await auth.registerAndLogin(uniqueEmail(), validPassword());
    const res = await client.delete(`/api/tasks/${taskId}`, userB.token);

    expect(res.status).toBe(403);

    // Task must still exist after rejected delete
    const getRes = await client.get(`/api/tasks/${taskId}`, userA.token);
    expect(getRes.status).toBe(200);
  });

  test("returns 404 for a non-existent task id", async ({ request }) => {
    const client = new ApiClient(request);
    const { token } = await new AuthHelper(client).registerAndLogin(
      uniqueEmail(),
      validPassword(),
    );

    const res = await client.delete("/api/tasks/999999", token);

    expect(res.status).toBe(404);
  });

  test("returns 401 when Authorization header is absent", async ({
    request,
  }) => {
    const client = new ApiClient(request);

    const res = await client.delete("/api/tasks/999999");

    expect(res.status).toBe(401);
  });
});
