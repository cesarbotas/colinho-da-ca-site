import { useState, useEffect, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Loader2, ChevronDown, ChevronRight, Upload, Check, Search, Filter, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { listarReservas, excluirReserva, enviarComprovante, authService, type ReservaData } from "@/lib/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReservaListProps {
  onNovaReserva: () => void;
  onEditarReserva: (reserva: ReservaData) => void;
}

const ReservaList = ({ onNovaReserva, onEditarReserva }: ReservaListProps) => {
  const [reservas, setReservas] = useState<ReservaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [filtroDataInicial, setFiltroDataInicial] = useState("");
  const [filtroDataFinal, setFiltroDataFinal] = useState("");
  const [filtrosAplicados, setFiltrosAplicados] = useState({ dataInicial: "", dataFinal: "" });

  const carregarReservas = async () => {
    setLoading(true);
    try {
      const clienteId = authService.getClienteId();
      const params = new URLSearchParams();
      
      if (clienteId) {
        params.append('ClienteId', clienteId.toString());
      }
      
      if (filtrosAplicados.dataInicial) {
        params.append('DataInicial', filtrosAplicados.dataInicial);
      }
      
      if (filtrosAplicados.dataFinal) {
        params.append('DataFinal', filtrosAplicados.dataFinal);
      }
      
      const response = await listarReservas(page, pageSize, undefined, params.toString());
      setReservas(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao carregar reservas.",
        variant: "destructive",
      });
      setReservas([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarReservas();
  }, [page, pageSize, filtrosAplicados]);

  const aplicarFiltros = () => {
    setFiltrosAplicados({ dataInicial: filtroDataInicial, dataFinal: filtroDataFinal });
    setPage(1);
  };

  const limparFiltros = () => {
    setFiltroDataInicial("");
    setFiltroDataFinal("");
    setFiltrosAplicados({ dataInicial: "", dataFinal: "" });
    setPage(1);
  };

  const handleExcluir = async () => {
    if (deleteId === null) return;
    setDeleting(true);
    try {
      await excluirReserva(deleteId);
      toast({ title: "Sucesso!", description: "Reserva excluída com sucesso." });
      carregarReservas();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao excluir reserva.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleEnviarComprovante = async (id: string | number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = reader.result as string;
        await enviarComprovante(id, base64);
        toast({ title: "Sucesso!", description: "Comprovante enviado com sucesso." });
        carregarReservas();
      } catch (error) {
        toast({
          title: "Erro",
          description: error instanceof Error ? error.message : "Erro ao enviar comprovante.",
          variant: "destructive",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* Filtros */}
      <div className="bg-card rounded-2xl border border-border shadow-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="filtroDataInicial">Data Inicial</Label>
            <Input
              id="filtroDataInicial"
              type="date"
              value={filtroDataInicial}
              onChange={(e) => setFiltroDataInicial(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filtroDataFinal">Data Final</Label>
            <Input
              id="filtroDataFinal"
              type="date"
              value={filtroDataFinal}
              onChange={(e) => setFiltroDataFinal(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={aplicarFiltros}>
            <Search className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          {(filtroDataInicial || filtroDataFinal) && (
            <Button variant="outline" onClick={limparFiltros}>
              <X className="mr-2 h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground">
            {loading ? "Carregando..." : `${total} reserva(s) encontrada(s)`}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Exibir:</span>
            <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={onNovaReserva}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Reserva
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : reservas.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">Nenhuma reserva cadastrada.</p>
          <p className="text-sm mt-2">Clique em "Nova Reserva" para começar.</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead className="w-[20%]">Cliente</TableHead>
                <TableHead className="w-[10%]">Qtd. Pets</TableHead>
                <TableHead className="w-[10%]">Diárias</TableHead>
                <TableHead className="w-[15%]">Data Início</TableHead>
                <TableHead className="w-[15%]">Data Fim</TableHead>
                <TableHead className="w-[15%]">Valor Final</TableHead>
                <TableHead className="text-right w-[15%]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservas.map((reserva) => {
                const getRowClassName = () => {
                  if (reserva.status === 5) return "bg-green-50 hover:bg-green-100"; // Finalizada - verde claro
                  if (reserva.status === 6) return "bg-red-50 hover:bg-red-100"; // Cancelada - vermelho claro
                  if (reserva.status === 2 || reserva.status === 3) return "bg-yellow-50 hover:bg-yellow-100"; // Pendência pagamento - amarelo
                  return "hover:bg-muted/50"; // Padrão
                };
                
                const getStatusIndicator = () => {
                  if (reserva.status === 5) return <span className="text-green-600 text-xs font-medium">✓ Finalizada</span>;
                  if (reserva.status === 6) return <span className="text-red-600 text-xs font-medium">✗ Cancelada</span>;
                  if (reserva.status === 2 || reserva.status === 3) return <span className="text-yellow-600 text-xs font-medium">⚠ Pendente Pagamento</span>;
                  return null;
                };
                
                return (
                <Fragment key={reserva.id}>
                  <TableRow className={`cursor-pointer ${getRowClassName()}`} onClick={() => setExpandedId(expandedId === reserva.id ? null : reserva.id)}>
                    <TableCell>
                      {expandedId === reserva.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{reserva.clienteNome}</span>
                        {getStatusIndicator()}
                      </div>
                    </TableCell>
                    <TableCell>{reserva.quantidadePets || reserva.pets?.length || 0}</TableCell>
                    <TableCell>{reserva.quantidadeDiarias || 0}</TableCell>
                    <TableCell>{reserva.dataInicial ? format(new Date(reserva.dataInicial.split('T')[0] + 'T12:00:00'), "dd/MM/yyyy", { locale: ptBR }) : "—"}</TableCell>
                    <TableCell>{reserva.dataFinal ? format(new Date(reserva.dataFinal.split('T')[0] + 'T12:00:00'), "dd/MM/yyyy", { locale: ptBR }) : "—"}</TableCell>
                    <TableCell className="font-semibold">R$ {((reserva.valorTotal || 0) - (reserva.valorDesconto || 0)).toFixed(2)}</TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        {reserva.status === 1 && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => onEditarReserva(reserva)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => setDeleteId(reserva.id!)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedId === reserva.id && (
                    <TableRow key={`${reserva.id}-details`}>
                      <TableCell colSpan={8} className="bg-muted/30">
                        <div className="py-4 px-4 space-y-4">
                          <div className="grid grid-cols-2 gap-4 p-4 bg-background rounded-lg border">
                            <div>
                              <p className="text-xs text-muted-foreground">Período</p>
                              <p className="text-sm font-medium">
                                {reserva.dataInicial ? format(new Date(reserva.dataInicial.split('T')[0] + 'T12:00:00'), "dd/MM/yyyy", { locale: ptBR }) : "—"} até {reserva.dataFinal ? format(new Date(reserva.dataFinal.split('T')[0] + 'T12:00:00'), "dd/MM/yyyy", { locale: ptBR }) : "—"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Diárias</p>
                              <p className="text-sm font-medium">{reserva.quantidadeDiarias || 0} diária(s)</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Quantidade de Pets</p>
                              <p className="text-sm font-medium">{reserva.quantidadePets || 0} pet(s)</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Subtotal</p>
                              <p className="text-sm font-medium">R$ {(reserva.valorTotal || 0).toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Desconto</p>
                              <p className="text-sm font-medium text-green-600">- R$ {(reserva.valorDesconto || 0).toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Valor Final</p>
                              <p className="text-sm font-semibold text-primary">R$ {((reserva.valorTotal || 0) - (reserva.valorDesconto || 0)).toFixed(2)}</p>
                            </div>
                          </div>
                          {reserva.pets && reserva.pets.length > 0 && (
                            <div>
                              <p className="text-sm font-semibold mb-2">Pets:</p>
                              <ul className="list-disc list-inside space-y-1">
                                {reserva.pets.map((pet) => (
                                  <li key={pet.id} className="text-sm text-muted-foreground">{pet.nome} - {pet.racaNome || "Sem raça"}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold mb-3">Status da Reserva:</p>
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((step, index) => (
                                <div key={step} className="flex items-center flex-1">
                                  <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                      reserva.statusTimeline?.[step] ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                    }`}>
                                      {reserva.statusTimeline?.[step] && <Check className="h-4 w-4" />}
                                    </div>
                                    <p className="text-xs mt-1 text-center">
                                      {step === 1 && 'Criada'}
                                      {step === 2 && 'Confirmada'}
                                      {step === 3 && 'Pag. Pendente'}
                                      {step === 4 && 'Pag. Aprovado'}
                                      {step === 5 && 'Finalizada'}
                                    </p>
                                  </div>
                                  {index < 4 && (
                                    <div className={`flex-1 h-1 ${
                                      reserva.statusTimeline?.[step + 1] ? 'bg-primary' : 'bg-muted'
                                    }`} />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            {(reserva.status === 2 || reserva.status === 3) && (
                              <label>
                                <input
                                  type="file"
                                  accept="image/*,application/pdf"
                                  className="hidden"
                                  onChange={(e) => handleEnviarComprovante(reserva.id!, e)}
                                />
                                <Button size="sm" asChild>
                                  <span>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Enviar Comprovante
                                  </span>
                                </Button>
                              </label>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );})}
            </TableBody>
          </Table>
        </div>
      )}

      {!loading && total > pageSize && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Página {page} de {Math.ceil(total / pageSize)}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(total / pageSize)}
          >
            Próxima
          </Button>
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta reserva? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleExcluir} disabled={deleting}>
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ReservaList;