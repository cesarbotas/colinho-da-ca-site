import { API_BASE_URL, PaginatedResponse } from "../config";
import { ClienteData } from "./types";
import { getAuthHeaders } from "../auth";

export async function listarClientes(page: number = 1, pageSize: number = 10, id?: number): Promise<PaginatedResponse<ClienteData>> {
  let url = `${API_BASE_URL}/api/v1/clientes?Paginacao.NumeroPagina=${page}&Paginacao.QuantidadeRegistros=${pageSize}`;
  if (id) {
    url += `&Id=${id}`;
  }
  const response = await fetch(url, {
    headers: await getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao buscar clientes");
  return response.json();
}

export async function cadastrarCliente(data: ClienteData): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/clientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...await getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro ao cadastrar cliente" }));
    throw new Error(error.message || "Erro ao cadastrar cliente");
  }
}

export async function atualizarCliente(id: string | number, data: ClienteData): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/clientes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...await getAuthHeaders() },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro ao atualizar cliente" }));
    throw new Error(error.message || "Erro ao atualizar cliente");
  }
}

export async function excluirCliente(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/clientes/${id}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao excluir cliente");
}
