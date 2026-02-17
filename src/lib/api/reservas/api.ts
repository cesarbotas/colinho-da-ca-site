import { API_BASE_URL, PaginatedResponse } from "../config";
import { ReservaData } from "./types";
import { getAuthHeaders } from "../auth";

export async function listarReservas(page: number = 1, pageSize: number = 10, clienteId?: number, filtrosAdicionais?: string): Promise<PaginatedResponse<ReservaData>> {
  let url = `${API_BASE_URL}/api/v1/reservas?Paginacao.NumeroPagina=${page}&Paginacao.QuantidadeRegistros=${pageSize}`;
  if (clienteId) {
    url += `&ClienteId=${clienteId}`;
  }
  if (filtrosAdicionais) {
    url += `&${filtrosAdicionais}`;
  }
  const response = await fetch(url, { headers: await getAuthHeaders() });
  if (!response.ok) throw new Error("Erro ao buscar reservas");
  return response.json();
}

export async function cadastrarReserva(data: ReservaData): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/reservas`, {
    method: "POST",
    headers: { ...await getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro ao cadastrar reserva" }));
    throw new Error(error.message || "Erro ao cadastrar reserva");
  }
}

export async function atualizarReserva(id: string | number, data: ReservaData): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/reservas/${id}`, {
    method: "PUT",
    headers: { ...await getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro ao atualizar reserva" }));
    throw new Error(error.message || "Erro ao atualizar reserva");
  }
}

export async function excluirReserva(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/reservas/${id}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao excluir reserva");
}

export async function confirmarReserva(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/reservas/${id}/confirmar`, {
    method: "POST",
    headers: await getAuthHeaders(),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro ao confirmar reserva" }));
    throw new Error(error.message || "Erro ao confirmar reserva");
  }
}

export async function aprovarPagamento(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/reservas/${id}/aprovar-pagamento`, {
    method: "POST",
    headers: await getAuthHeaders(),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro ao aprovar pagamento" }));
    throw new Error(error.message || "Erro ao aprovar pagamento");
  }
}

export async function enviarComprovante(id: string | number, comprovante: string, observacoes?: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/reservas/${id}/comprovante`, {
    method: "POST",
    headers: { ...await getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ 
      comprovantePagamento: comprovante,
      observacoesPagamento: observacoes || ""
    }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro ao enviar comprovante" }));
    throw new Error(error.message || "Erro ao enviar comprovante");
  }
}

export async function buscarComprovante(id: string | number): Promise<{ comprovantePagamento: string; observacoesPagamento: string; dataPagamento: string }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/reservas/${id}/comprovante`, {
    headers: await getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Comprovante não encontrado");
  return response.json();
}

export async function cancelarReserva(id: string | number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/reservas/${id}/cancelar`, {
    method: "POST",
    headers: await getAuthHeaders(),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro ao cancelar reserva" }));
    throw new Error(error.message || "Erro ao cancelar reserva");
  }
}

export async function aplicarDesconto(id: string | number, valorDesconto: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/reservas/${id}/desconto`, {
    method: "POST",
    headers: { ...await getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ valorDesconto }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro ao aplicar desconto" }));
    throw new Error(error.message || "Erro ao aplicar desconto");
  }
}

export async function aplicarCupom(id: string | number, codigoCupom: string, valorTotal: number, quantidadePets: number, quantidadeDiarias: number): Promise<{ valorTotal: number; valorDesconto: number; valorFinal: number; cupomAplicado: string; cupomId?: number }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/reservas/${id}/aplicar-cupom`, {
    method: "POST",
    headers: { ...await getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ codigoCupom, valorTotal, quantidadePets, quantidadeDiarias }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro ao aplicar cupom" }));
    throw new Error(error.message || "Cupom inválido ou expirado");
  }
  return response.json();
}
