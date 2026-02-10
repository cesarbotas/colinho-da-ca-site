import { API_BASE_URL, PaginatedResponse } from "../config";
import { ReservaData } from "./types";

export async function listarReservas(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<ReservaData>> {
  const response = await fetch(`${API_BASE_URL}/api/v1/reservas?Paginacao.NumeroPagina=${page}&Paginacao.QuantidadeRegistros=${pageSize}`);
  if (!response.ok) throw new Error("Erro ao buscar reservas");
  return response.json();
}

export async function cadastrarReserva(data: ReservaData): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/reservas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erro ao cadastrar reserva");
}

export async function atualizarReserva(id: string | number, data: ReservaData): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/reservas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erro ao atualizar reserva");
}

export async function excluirReserva(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/reservas/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao excluir reserva");
}
