import { API_BASE_URL } from "../config";
import { LoginData, RegisterData, AuthResponse } from "./types";

const TOKEN_KEY = "auth_token";

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Credenciais inválidas" }));
      throw new Error(error.message || "Credenciais inválidas");
    }
    const authData = await response.json();
    localStorage.setItem(TOKEN_KEY, authData.token);
    return authData;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Erro ao registrar usuário" }));
      throw new Error(error.message || "Erro ao registrar usuário");
    }
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

  decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  },

  getUserData(): AuthResponse["usuario"] | null {
    const decoded = this.decodeToken();
    if (!decoded) return null;
    return {
      id: parseInt(decoded.nameid),
      nome: decoded.unique_name,
      email: decoded.email,
      celular: decoded.celular,
      cpf: decoded.cpf,
      clienteId: decoded.clienteId ? parseInt(decoded.clienteId) : null,
      perfis: decoded.perfis ? JSON.parse(decoded.perfis) : [],
    };
  },

  getClienteId(): number | null {
    const decoded = this.decodeToken();
    return decoded?.clienteId ? parseInt(decoded.clienteId) : null;
  },

  getPerfil(): number | null {
    const userData = this.getUserData();
    return userData?.perfis?.[0]?.Id || userData?.perfis?.[0]?.id || null;
  },

  hasPerfil(perfilId: number): boolean {
    const userData = this.getUserData();
    return userData?.perfis?.some(p => (p.Id || p.id) === perfilId) || false;
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
