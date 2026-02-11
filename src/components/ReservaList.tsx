import { useState, useEffect, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { listarReservas, excluirReserva, authService, type ReservaData } from "@/lib/api";
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

  const carregarReservas = async () => {
    setLoading(true);
    try {
      const clienteId = authService.getClienteId();
      const response = await listarReservas(page, pageSize, clienteId || undefined);
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
  }, [page, pageSize]);

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

  return (
    <>
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
                    <TableCell className="font-semibold">R$ {(reserva.valorTotal || 0).toFixed(2)}</TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => onEditarReserva(reserva)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setDeleteId(reserva.id!)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedId === reserva.id && (
                    <TableRow key={`${reserva.id}-details`}>
                      <TableCell colSpan={8} className="bg-muted/30">
                        <div className="py-2 px-4 space-y-2">
                          {reserva.pets && reserva.pets.length > 0 && (
                            <div>
                              <p className="text-sm font-semibold mb-2">Pets:</p>
                              <ul className="list-disc list-inside space-y-1">
                                {reserva.pets.map((pet) => (
                                  <li key={pet.id} className="text-sm text-muted-foreground">{pet.nome}</li>
                                ))}
                              </ul>
                            </div>
                          )}
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
    </>
  );
};

export default ReservaList;
