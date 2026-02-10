import { API_BASE_URL } from "../config";
import { LoginData, AuthResponse } from "./types";

const TOKEN_KEY = "auth_token";

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Credenciais inválidas");
    const authData = await response.json();
    localStorage.setItem(TOKEN_KEY, authData.token);
    return authData;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export function getAuthHeaders(): HeadersInit {
  const token = authService.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
