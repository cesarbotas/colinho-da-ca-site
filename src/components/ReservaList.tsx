import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { listarReservas, excluirReserva, type ReservaData } from "@/lib/api";
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

  const carregarReservas = async () => {
    setLoading(true);
    try {
      const response = await listarReservas();
      setReservas(response.data);
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao carregar reservas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarReservas();
  }, []);

  const handleExcluir = async () => {
    if (deleteId === null) return;
    setDeleting(true);
    try {
      await excluirReserva(deleteId);
      toast({ title: "Sucesso!", description: "Reserva excluída com sucesso." });
      setReservas((prev) => prev.filter((r) => r.id !== deleteId));
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
        <p className="text-muted-foreground">
          {loading ? "Carregando..." : `${reservas.length} reserva(s) encontrada(s)`}
        </p>
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
                <TableHead>Cliente</TableHead>
                <TableHead>Qtd. Pets</TableHead>
                <TableHead>Data Início</TableHead>
                <TableHead>Data Fim</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservas.map((reserva) => (
                <>
                  <TableRow key={reserva.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setExpandedId(expandedId === reserva.id ? null : reserva.id)}>
                    <TableCell>
                      {expandedId === reserva.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </TableCell>
                    <TableCell className="font-medium">{reserva.clienteNome}</TableCell>
                    <TableCell>{reserva.pets?.length || 0}</TableCell>
                    <TableCell>{format(new Date(reserva.dataInicial), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                    <TableCell>{format(new Date(reserva.dataFinal), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
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
                  {expandedId === reserva.id && reserva.pets && reserva.pets.length > 0 && (
                    <TableRow key={`${reserva.id}-pets`}>
                      <TableCell colSpan={6} className="bg-muted/30">
                        <div className="py-2 px-4">
                          <p className="text-sm font-semibold mb-2">Pets:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {reserva.pets.map((pet) => (
                              <li key={pet.id} className="text-sm text-muted-foreground">{pet.nome}</li>
                            ))}
                          </ul>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
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
