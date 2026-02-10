import { API_BASE_URL, PaginatedResponse } from "../config";
import { PetData } from "./types";

export async function listarPets(page: number = 1, pageSize: number = 10, clienteId?: number): Promise<PaginatedResponse<PetData>> {
  let url = `${API_BASE_URL}/api/v1/pets?Paginacao.NumeroPagina=${page}&Paginacao.QuantidadeRegistros=${pageSize}`;
  if (clienteId) {
    url += `&ClienteId=${clienteId}`;
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error("Erro ao buscar pets");
  return response.json();
}

export async function cadastrarPet(data: PetData): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/pets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erro ao cadastrar pet");
}

export async function atualizarPet(id: string | number, data: PetData): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/pets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erro ao atualizar pet");
}

export async function excluirPet(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/pets/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao excluir pet");
}
