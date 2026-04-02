import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Ban, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { listarCupons, inativarCupom, type CupomData } from "@/lib/api";

interface CupomListProps {
  onNovoCupom: () => void;
  onEditarCupom: (cupom: CupomData) => void;
}

const tipoLabels: Record<number, string> = {
  1: "% Total",
  2: "% Pet Mín",
  3: "% Pet Diárias",
  4: "Fixo Mín",
  5: "Último Pet",
};

const CupomList = ({ onNovoCupom, onEditarCupom }: CupomListProps) => {
  const [cupons, setCupons] = useState<CupomData[]>([]);
  const [loading, setLoading] = useState(true);
  const [inativarId, setInativarId] = useState<string | number | null>(null);
  const [inativando, setInativando] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const carregarCupons = async () => {
    setLoading(true);
    try {
      const response = await listarCupons(page, pageSize);
      setCupons(response.data);
      setTotal(response.total);
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao carregar cupons.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCupons();
  }, [page, pageSize]);

  const handleInativar = async () => {
    if (inativarId === null) return;
    setInativando(true);
    try {
      await inativarCupom(inativarId);
      toast({ title: "Sucesso!", description: "Cupom inativado com sucesso." });
      carregarCupons();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao inativar cupom.",
        variant: "destructive",
      });
    } finally {
      setInativando(false);
      setInativarId(null);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

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
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Desconto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cupons.map((cupom) => (
                <TableRow key={cupom.id}>
                  <TableCell className="font-medium">{cupom.codigo}</TableCell>
                  <TableCell className="max-w-xs truncate">{cupom.descricao}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{tipoLabels[cupom.tipo]}</Badge>
                  </TableCell>
                  <TableCell>
                    {cupom.percentual > 0 ? `${cupom.percentual}%` : cupom.valorFixo ? `R$ ${cupom.valorFixo}` : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={cupom.ativo ? "default" : "secondary"}>
                      {cupom.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => onEditarCupom(cupom)} disabled={!cupom.ativo}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {cupom.ativo && (
                        <Button variant="destructive" size="sm" onClick={() => setInativarId(cupom.id!)}>
                          <Ban className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <AlertDialog open={inativarId !== null} onOpenChange={(open) => !open && setInativarId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar inativação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja inativar este cupom? Ele não poderá mais ser utilizado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={inativando}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleInativar} disabled={inativando}>
              {inativando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Inativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CupomList;
