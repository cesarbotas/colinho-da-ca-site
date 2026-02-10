export interface ReservaData {
  id?: string | number;
  clienteId: number;
  clienteNome?: string;
  dataInicial: string;
  dataFinal: string;
  observacoes?: string;
  pets?: Array<{ id: number; nome: string }>;
}
