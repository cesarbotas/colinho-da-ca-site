import { API_BASE_URL, PaginatedResponse } from "../config";
import { ClienteData } from "./types";

export async function listarClientes(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<ClienteData>> {
  const response = await fetch(`${API_BASE_URL}/api/v1/clientes?Paginacao.NumeroPagina=${page}&Paginacao.QuantidadeRegistros=${pageSize}`);
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
