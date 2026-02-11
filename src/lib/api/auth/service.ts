import { API_BASE_URL } from "../config";
import { LoginData, RegisterData, AuthResponse } from "./types";

const TOKEN_KEY = "auth_token";
const USER_DATA_KEY = "user_data";

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
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(authData.usuario));
    return authData;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao registrar usuário");
    const authData = await response.json();
    localStorage.setItem(TOKEN_KEY, authData.token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(authData.usuario));
    return authData;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUserData(): AuthResponse["usuario"] | null {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  },

  getClienteId(): number | null {
    const userData = this.getUserData();
    return userData?.clienteId || null;
  },

  getPerfil(): number | null {
    const userData = this.getUserData();
    return userData?.perfis?.[0]?.id || null;
  },

  hasPerfil(perfilId: number): boolean {
    const userData = this.getUserData();
    return userData?.perfis?.some(p => p.id === perfilId) || false;
  },

  isAdmin(): boolean {
    return this.hasPerfil(1);
  },

  isCliente(): boolean {
    return this.hasPerfil(2);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export function getAuthHeaders(): HeadersInit {
  const token = authService.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
