export interface CupomData {
  id?: string | number;
  codigo: string;
  descricao: string;
  tipo: number;
  percentual: number;
  valorFixo: number | null;
  minimoValorTotal: number | null;
  minimoPets: number | null;
  minimoDiarias: number | null;
  dataInicio: string | null;
  dataFim: string | null;
  ativo?: boolean;
}
