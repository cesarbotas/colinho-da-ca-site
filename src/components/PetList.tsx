import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { listarPets, excluirPet, getPorteLabel, type PetData } from "@/lib/api";

interface PetListProps {
  onNovoPet: () => void;
  onEditarPet: (pet: PetData) => void;
}

const PetList = ({ onNovoPet, onEditarPet }: PetListProps) => {
  const [pets, setPets] = useState<PetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const carregarPets = async () => {
    setLoading(true);
    try {
      const response = await listarPets();
      setPets(response.data);
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao carregar pets.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPets();
  }, []);

  const handleExcluir = async () => {
    if (deleteId === null) return;
    setDeleting(true);
    try {
      await excluirPet(deleteId);
      toast({ title: "Sucesso!", description: "Pet excluído com sucesso." });
      setPets((prev) => prev.filter((p) => p.id !== deleteId));
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao excluir pet.",
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
          {loading ? "Carregando..." : `${pets.length} pet(s) encontrado(s)`}
        </p>
        <Button onClick={onNovoPet}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Pet
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">Nenhum pet cadastrado.</p>
          <p className="text-sm mt-2">Clique em "Novo Pet" para começar.</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Pet</TableHead>
                <TableHead>Porte</TableHead>
                <TableHead>Raça</TableHead>
                <TableHead>Tutor (Cliente)</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pets.map((pet) => (
                <TableRow key={pet.id}>
                  <TableCell className="font-medium">{pet.nome}</TableCell>
                  <TableCell>{getPorteLabel(pet.porte)}</TableCell>
                  <TableCell>{pet.raca || "—"}</TableCell>
                  <TableCell>{pet.clienteNome || pet.tutor}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => onEditarPet(pet)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => setDeleteId(pet.id!)}>
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

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este pet? Esta ação não pode ser desfeita.
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

export default PetList;
