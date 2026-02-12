import { API_BASE_URL, PaginatedResponse } from "../config";
import { CupomData } from "./types";
import { getAuthHeaders } from "../auth";

export async function listarCupons(page: number = 1, pageSize: number = 10, id?: number): Promise<PaginatedResponse<CupomData>> {
  let url = `${API_BASE_URL}/api/v1/cupons?Paginacao.NumeroPagina=${page}&Paginacao.QuantidadeRegistros=${pageSize}`;
  if (id) {
    url += `&Id=${id}`;
  }
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao buscar cupons");
  return response.json();
}

export async function cadastrarCupom(data: CupomData): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/cupons`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro ao cadastrar cupom" }));
    throw new Error(error.message || "Erro ao cadastrar cupom");
  }
}

export async function atualizarCupom(id: string | number, data: CupomData): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/cupons/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro ao atualizar cupom" }));
    throw new Error(error.message || "Erro ao atualizar cupom");
  }
}

export async function inativarCupom(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/cupons/${id}/inativar`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao inativar cupom");
}

export async function excluirCupom(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/cupons/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao excluir cupom");
}
