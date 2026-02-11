import { API_BASE_URL, PaginatedResponse } from "../config";
import { PetData } from "./types";
import { getAuthHeaders } from "../auth";

export async function listarPets(page: number = 1, pageSize: number = 10, clienteId?: number): Promise<PaginatedResponse<PetData>> {
  let url = `${API_BASE_URL}/api/v1/pets?Paginacao.NumeroPagina=${page}&Paginacao.QuantidadeRegistros=${pageSize}`;
  if (clienteId) {
    url += `&ClienteId=${clienteId}`;
  }
  const response = await fetch(url, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error("Erro ao buscar pets");
  return response.json();
}

export async function cadastrarPet(data: PetData): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/pets`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro ao cadastrar pet" }));
    throw new Error(error.message || "Erro ao cadastrar pet");
  }
}

export async function atualizarPet(id: string | number, data: PetData): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/pets/${id}`, {
    method: "PUT",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro ao atualizar pet" }));
    throw new Error(error.message || "Erro ao atualizar pet");
  }
}

export async function excluirPet(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/pets/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao excluir pet");
}
