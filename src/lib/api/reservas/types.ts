export interface ReservaData {
  id?: string | number;
  clienteId: number;
  clienteNome?: string;
  dataInicial: string;
  dataFinal: string;
  observacoes?: string;
  pets?: Array<{ id: number; nome: string; valorDiaria?: number }>;
  petIds?: number[];
  quantidadeDiarias?: number;
  quantidadePets?: number;
  valorTotal?: number;
  valorDesconto?: number;
  valorFinal?: number;
  cupomAplicado?: string;
  status?: number;
  comprovantePagamento?: string;
  dataPagamento?: string | null;
  observacoesPagamento?: string | null;
  statusTimeline?: { [key: string]: boolean };
  historico?: Array<{
    status: number;
    usuarioId: number;
    usuarioNome: string;
    dataAlteracao: string;
  }>;
}
