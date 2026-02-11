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
  status?: number;
  comprovantePagamento?: string;
  statusTimeline?: { [key: string]: boolean };
  historico?: any[];
}
