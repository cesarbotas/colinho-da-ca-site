// Configuração da API
// Quando a API estiver pronta, atualize a URL base aqui
export const API_BASE_URL = "http://localhost:5000";

export interface ClienteData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: string;
  observacoes: string;
}

export interface PetData {
  nomePet: string;
  especie: string;
  raca: string;
  idade: string;
  peso: string;
  tutor: string;
  observacoes: string;
}

export async function cadastrarCliente(data: ClienteData): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/clientes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Erro ao cadastrar cliente");
  }

  return response.json();
}

export async function cadastrarPet(data: PetData): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/pets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Erro ao cadastrar pet");
  }

  return response.json();
}
