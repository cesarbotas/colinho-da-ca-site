export interface LoginData {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
}
