import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Loader2, Power } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { listarCupons, excluirCupom, ativarDesativarCupom, type CupomData } from "@/lib/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AdminCupomListProps {
  onNovoCupom: () => void;
  onEditarCupom: (cupom: CupomData) => void;
}

const AdminCupomList = ({ onNovoCupom, onEditarCupom }: AdminCupomListProps) => {
  const [cupons, setCupons] = useState<CupomData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const carregarCupons = async () => {
    setLoading(true);
    try {
      const response = await listarCupons(page, pageSize);
      setCupons(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao carregar cupons.",
        variant: "destructive",
      });
      setCupons([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCupons();
  }, [page, pageSize]);

  const handleExcluir = async () => {
    if (deleteId === null) return;
    setDeleting(true);
    try {
      await excluirCupom(deleteId);
      toast({ title: "Sucesso!", description: "Cupom excluído com sucesso." });
      carregarCupons();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao excluir cupom.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleAtivarDesativar = async (id: string | number) => {
    try {
      await ativarDesativarCupom(id);
      toast({ title: "Sucesso!", description: "Status do cupom alterado com sucesso." });
      carregarCupons();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao alterar status do cupom.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground">
            {loading ? "Carregando..." : `${total} cupom(ns) encontrado(s)`}
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
        <Button onClick={onNovoCupom}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cupom
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : cupons.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">Nenhum cupom cadastrado.</p>
          <p className="text-sm mt-2">Clique em "Novo Cupom" para começar.</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%]">Código</TableHead>
                <TableHead className="w-[20%]">Descrição</TableHead>
                <TableHead className="w-[10%]">Tipo</TableHead>
                <TableHead className="w-[10%]">Valor</TableHead>
                <TableHead className="w-[12%]">Início</TableHead>
                <TableHead className="w-[12%]">Fim</TableHead>
                <TableHead className="w-[8%]">Uso</TableHead>
                <TableHead className="w-[8%]">Status</TableHead>
                <TableHead className="text-right w-[15%]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cupons.map((cupom) => (
                <TableRow key={cupom.id}>
                  <TableCell className="font-medium">{cupom.codigo}</TableCell>
                  <TableCell>{cupom.descricao || "—"}</TableCell>
                  <TableCell>{cupom.tipoDesconto === 1 ? "Percentual" : "Valor Fixo"}</TableCell>
                  <TableCell>{cupom.tipoDesconto === 1 ? `${cupom.valorDesconto}%` : `R$ ${cupom.valorDesconto.toFixed(2)}`}</TableCell>
                  <TableCell>{cupom.dataInicio ? format(new Date(cupom.dataInicio.split('T')[0] + 'T12:00:00'), "dd/MM/yyyy", { locale: ptBR }) : "—"}</TableCell>
                  <TableCell>{cupom.dataFim ? format(new Date(cupom.dataFim.split('T')[0] + 'T12:00:00'), "dd/MM/yyyy", { locale: ptBR }) : "—"}</TableCell>
                  <TableCell>{cupom.quantidadeUtilizada || 0}/{cupom.quantidadeMaxima || "∞"}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${cupom.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {cupom.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleAtivarDesativar(cupom.id!)}>
                        <Power className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onEditarCupom(cupom)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => setDeleteId(cupom.id!)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
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
              Tem certeza que deseja excluir este cupom? Esta ação não pode ser desfeita.
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

export default AdminCupomList;
