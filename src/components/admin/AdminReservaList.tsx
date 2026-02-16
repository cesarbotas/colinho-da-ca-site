import { useState, useEffect, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Loader2, ChevronDown, ChevronRight, Check, Eye, X, DollarSign, Search, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { listarReservas, excluirReserva, confirmarReserva, aprovarPagamento, buscarComprovante, cancelarReserva, aplicarDesconto, type ReservaData } from "@/lib/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AdminReservaListProps {
  onNovaReserva: () => void;
  onEditarReserva: (reserva: ReservaData) => void;
}

const AdminReservaList = ({ onNovaReserva, onEditarReserva }: AdminReservaListProps) => {
  const [reservas, setReservas] = useState<ReservaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [comprovanteModal, setComprovanteModal] = useState<{ open: boolean; data: any }>({ open: false, data: null });
  const [descontoModal, setDescontoModal] = useState<{ open: boolean; id: string | number | null; valor: string }>({ open: false, id: null, valor: "" });
  const [confirmarModal, setConfirmarModal] = useState<string | number | null>(null);
  const [cancelarModal, setCancelarModal] = useState<string | number | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [filtroNomeCliente, setFiltroNomeCliente] = useState("");
  const [filtroDataInicial, setFiltroDataInicial] = useState("");
  const [filtroDataFinal, setFiltroDataFinal] = useState("");
  const [filtrosAplicados, setFiltrosAplicados] = useState({ nomeCliente: "", dataInicial: "", dataFinal: "" });

  const carregarReservas = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filtrosAplicados.nomeCliente.trim()) {
        params.append('ClienteNome', filtrosAplicados.nomeCliente.trim());
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
    setFiltrosAplicados({
      nomeCliente: filtroNomeCliente,
      dataInicial: filtroDataInicial,
      dataFinal: filtroDataFinal
    });
    setPage(1);
  };

  const limparFiltros = () => {
    setFiltroNomeCliente("");
    setFiltroDataInicial("");
    setFiltroDataFinal("");
    setFiltrosAplicados({ nomeCliente: "", dataInicial: "", dataFinal: "" });
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

  const handleConfirmar = async (id: string | number) => {
    try {
      await confirmarReserva(id);
      toast({ title: "Sucesso!", description: "Reserva confirmada com sucesso." });
      setConfirmarModal(null);
      carregarReservas();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao confirmar reserva.",
        variant: "destructive",
      });
    }
  };

  const handleAprovarPagamento = async (id: string | number) => {
    try {
      await aprovarPagamento(id);
      toast({ title: "Sucesso!", description: "Pagamento aprovado com sucesso." });
      carregarReservas();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao aprovar pagamento.",
        variant: "destructive",
      });
    }
  };

  const handleVerComprovante = async (id: string | number) => {
    try {
      const data = await buscarComprovante(id);
      setComprovanteModal({ open: true, data });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Comprovante não encontrado.",
        variant: "destructive",
      });
    }
  };

  const handleCancelarReserva = async (id: string | number) => {
    try {
      await cancelarReserva(id);
      toast({ title: "Sucesso!", description: "Reserva cancelada com sucesso." });
      setCancelarModal(null);
      carregarReservas();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao cancelar reserva.",
        variant: "destructive",
      });
    }
  };

  const handleAplicarDesconto = async () => {
    if (!descontoModal.id) return;
    try {
      await aplicarDesconto(descontoModal.id, parseFloat(descontoModal.valor));
      toast({ title: "Sucesso!", description: "Desconto aplicado com sucesso." });
      setDescontoModal({ open: false, id: null, valor: "" });
      carregarReservas();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao aplicar desconto.",
        variant: "destructive",
      });
    }
  };

  const abrirModalDesconto = (id: string | number) => {
    const reserva = reservas.find(r => r.id === id);
    setDescontoModal({ open: true, id, valor: (reserva?.valorDesconto || 0).toString() });
  };

  return (
    <>
      {/* Filtros */}
      <div className="bg-card rounded-2xl border border-border shadow-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="filtroNomeCliente">Nome do Cliente</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="filtroNomeCliente"
                placeholder="Buscar por nome..."
                value={filtroNomeCliente}
                onChange={(e) => setFiltroNomeCliente(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
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
          {(filtroNomeCliente || filtroDataInicial || filtroDataFinal) && (
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
                <TableHead className="w-[15%]">Valor Total</TableHead>
                <TableHead className="text-right w-[15%]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservas.map((reserva) => (
                <Fragment key={reserva.id}>
                  <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => setExpandedId(expandedId === reserva.id ? null : reserva.id)}>
                    <TableCell>
                      {expandedId === reserva.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </TableCell>
                    <TableCell className="font-medium">{reserva.clienteNome}</TableCell>
                    <TableCell>{reserva.quantidadePets || reserva.pets?.length || 0}</TableCell>
                    <TableCell>{reserva.quantidadeDiarias || 0}</TableCell>
                    <TableCell>{reserva.dataInicial ? format(new Date(reserva.dataInicial.split('T')[0] + 'T12:00:00'), "dd/MM/yyyy", { locale: ptBR }) : "—"}</TableCell>
                    <TableCell>{reserva.dataFinal ? format(new Date(reserva.dataFinal.split('T')[0] + 'T12:00:00'), "dd/MM/yyyy", { locale: ptBR }) : "—"}</TableCell>
                    <TableCell className="font-semibold">R$ {((reserva.valorTotal || 0) - (reserva.valorDesconto || 0)).toFixed(2)}</TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          {reserva.status !== 5 && reserva.status !== 6 && (
                        <div className="flex justify-end gap-2">
                          {reserva.status === 1 && (
                            <Button variant="outline" size="sm" onClick={() => abrirModalDesconto(reserva.id!)}>
                              <DollarSign className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => onEditarReserva(reserva)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => setDeleteId(reserva.id!)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
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
                              {reserva.status === 6 ? (
                                <div className="flex items-center justify-center w-full">
                                  <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500 text-white">
                                      <X className="h-4 w-4" />
                                    </div>
                                    <p className="text-xs mt-1 text-center text-red-500 font-semibold">Cancelada</p>
                                  </div>
                                </div>
                              ) : (
                                [1, 2, 3, 4, 5].map((step, index) => (
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
                                ))
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            {reserva.status === 1 && (
                              <>
                                <Button size="sm" onClick={() => setConfirmarModal(reserva.id!)}>
                                  <Check className="mr-2 h-4 w-4" />
                                  Confirmar Reserva
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => setCancelarModal(reserva.id!)}>
                                  <X className="mr-2 h-4 w-4" />
                                  Cancelar Reserva
                                </Button>
                              </>
                            )}
                            {reserva.status === 3 && (
                              <>
                                <Button size="sm" variant="outline" onClick={() => handleVerComprovante(reserva.id!)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver Comprovante
                                </Button>
                                <Button size="sm" onClick={() => handleAprovarPagamento(reserva.id!)}>
                                  <Check className="mr-2 h-4 w-4" />
                                  Aprovar Pagamento
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => setCancelarModal(reserva.id!)}>
                                  <X className="mr-2 h-4 w-4" />
                                  Cancelar Reserva
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
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

      <AlertDialog open={comprovanteModal.open} onOpenChange={(open) => !open && setComprovanteModal({ open: false, data: null })}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Comprovante de Pagamento</AlertDialogTitle>
          </AlertDialogHeader>
          {comprovanteModal.data && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Observações:</p>
                <p className="text-sm">{comprovanteModal.data.observacoesPagamento || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Comprovante:</p>
                <iframe 
                  src={comprovanteModal.data.comprovantePagamento} 
                  className="w-full h-[600px] rounded border"
                  title="Comprovante de Pagamento"
                />
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Fechar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={descontoModal.open} onOpenChange={(open) => !open && setDescontoModal({ open: false, id: null, valor: "" })}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Conceder Desconto</AlertDialogTitle>
          </AlertDialogHeader>
          {descontoModal.id && (() => {
            const reserva = reservas.find(r => r.id === descontoModal.id);
            return reserva ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Cliente</p>
                    <p className="text-sm font-medium">{reserva.clienteNome}</p>
                  </div>
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
                    <p className="text-xs text-muted-foreground">Desconto Atual</p>
                    <p className="text-sm font-medium text-green-600">- R$ {(reserva.valorDesconto || 0).toFixed(2)}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Novo Valor do Desconto</label>
                  <Input
                    type="number"
                    placeholder="Valor do desconto"
                    value={descontoModal.valor}
                    onChange={(e) => setDescontoModal({ ...descontoModal, valor: e.target.value })}
                    step="0.01"
                    min="0"
                    className="mt-2"
                  />
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-xs text-muted-foreground">Valor Final</p>
                  <p className="text-lg font-semibold text-primary">
                    R$ {((reserva.valorTotal || 0) - parseFloat(descontoModal.valor || "0")).toFixed(2)}
                  </p>
                </div>
              </div>
            ) : null;
          })()}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleAplicarDesconto}>
              Conceder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmarModal !== null} onOpenChange={(open) => !open && setConfirmarModal(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Reserva</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja confirmar esta reserva?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmarModal && handleConfirmar(confirmarModal)}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={cancelarModal !== null} onOpenChange={(open) => !open && setCancelarModal(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Reserva</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não</AlertDialogCancel>
            <AlertDialogAction onClick={() => cancelarModal && handleCancelarReserva(cancelarModal)}>
              Sim, Cancelar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminReservaList;