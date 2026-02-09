// Configuração da API
// Quando a API estiver pronta, atualize a URL base aqui
export const API_BASE_URL = "https://colinho-da-ca-api.onrender.com";
// export const API_BASE_URL = "http://localhost:5163";

export interface ClienteData {
  id?: string | number;
  nome: string;
  email: string;
  celular: string;
  cpf: string;
  endereco: string;
  observacoes: string;
}

export interface PaginatedResponse<T> {
  page: number;
  pageSize: number;
  total: number;
  data: T[];
}

export interface PetData {
  id?: string | number;
  nomePet: string;
  especie: string;
  raca: string;
  idade: string;
  peso: string;
  tutor: string;
  observacoes: string;
}

export async function listarClientes(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<ClienteData>> {
  const response = await fetch(`${API_BASE_URL}/api/v1/clientes?page=${page}&pageSize=${pageSize}`);
  if (!response.ok) throw new Error("Erro ao buscar clientes");
  return response.json();
}

export async function cadastrarCliente(data: ClienteData): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/clientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erro ao cadastrar cliente");
}

export async function atualizarCliente(id: string | number, data: ClienteData): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/clientes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erro ao atualizar cliente");
}

export async function excluirCliente(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/clientes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao excluir cliente");
}

// Pet CRUD
export async function listarPets(): Promise<PetData[]> {
  const response = await fetch(`${API_BASE_URL}/api/pets`);
  if (!response.ok) throw new Error("Erro ao buscar pets");
  return response.json();
}

export async function cadastrarPet(data: PetData): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/pets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erro ao cadastrar pet");
}

export async function atualizarPet(id: string | number, data: PetData): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/pets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erro ao atualizar pet");
}

export async function excluirPet(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/pets/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao excluir pet");
}
