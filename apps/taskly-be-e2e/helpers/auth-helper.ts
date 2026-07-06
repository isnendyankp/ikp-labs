import { ApiClient } from "./api-client";

export interface AuthResult {
  token: string;
  userId: number;
  email: string;
}

export class AuthHelper {
  constructor(private client: ApiClient) {}

  async registerAndLogin(email: string, password: string): Promise<AuthResult> {
    const registerResp = await this.client.post("/api/auth/register", {
      email,
      password,
    });
    if (registerResp.status !== 201) {
      throw new Error(
        `register failed: status=${registerResp.status} body=${JSON.stringify(registerResp.body)}`,
      );
    }
    const userId = (registerResp.body as { id: number }).id;

    const loginResp = await this.client.post("/api/auth/login", {
      email,
      password,
    });
    if (loginResp.status !== 200) {
      throw new Error(
        `login failed: status=${loginResp.status} body=${JSON.stringify(loginResp.body)}`,
      );
    }
    const token = (loginResp.body as { token: string }).token;

    return { token, userId, email };
  }
}
