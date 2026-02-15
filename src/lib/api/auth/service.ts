import { API_BASE_URL } from "../config";
import { LoginData, RegisterData, AuthResponse } from "./types";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

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
    localStorage.setItem(ACCESS_TOKEN_KEY, authData.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
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
    localStorage.setItem(ACCESS_TOKEN_KEY, authData.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
    return authData;
  },

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) throw new Error("No refresh token available");
    
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    
    if (!response.ok) {
      this.logout();
      throw new Error("Failed to refresh token");
    }
    
    const authData = await response.json();
    localStorage.setItem(ACCESS_TOKEN_KEY, authData.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
    return authData;
  },

  logout() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  getToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
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

  isTokenExpired(): boolean {
    const decoded = this.decodeToken();
    if (!decoded) return true;
    // Adiciona margem de 5 minutos para renovar antes de expirar
    return Date.now() >= (decoded.exp - 300) * 1000;
  },

  async getValidToken(): Promise<string | null> {
    const token = this.getToken();
    if (!token) return null;
    
    if (this.isTokenExpired()) {
      console.log('Token expired, attempting refresh...');
      try {
        await this.refreshToken();
        console.log('Token refreshed successfully');
        return this.getToken();
      } catch (error) {
        console.error('Failed to refresh token:', error);
        this.logout();
        return null;
      }
    }
    
    return token;
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
    return !!this.getToken() && !this.isTokenExpired();
  },
};

export async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await authService.getValidToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
