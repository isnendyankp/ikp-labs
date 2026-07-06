import { APIRequestContext } from "@playwright/test";

export class ApiClient {
  private baseURL: string;

  constructor(private request: APIRequestContext) {
    this.baseURL = "http://localhost:8082";
  }

  async post(endpoint: string, data: unknown, token?: string) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
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

  async get(endpoint: string, token?: string) {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
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

  async put(endpoint: string, data: unknown, token?: string) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
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

  async delete(endpoint: string, token?: string) {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
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
