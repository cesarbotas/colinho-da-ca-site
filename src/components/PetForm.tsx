import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cadastrarPet, atualizarPet, type PetData } from "@/lib/api";

interface PetFormProps {
  pet?: PetData | null;
  onVoltar: () => void;
}

const PetForm = ({ pet, onVoltar }: PetFormProps) => {
  const isEditing = !!pet?.id;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PetData>({
    nomePet: pet?.nomePet || "",
    especie: pet?.especie || "",
    raca: pet?.raca || "",
    idade: pet?.idade || "",
    peso: pet?.peso || "",
    tutor: pet?.tutor || "",
    observacoes: pet?.observacoes || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, especie: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nomePet || !formData.especie || !formData.tutor) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome do pet, espécie e tutor.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await atualizarPet(pet!.id!, formData);
        toast({ title: "Sucesso!", description: "Pet atualizado com sucesso." });
      } else {
        await cadastrarPet(formData);
        toast({ title: "Sucesso!", description: "Pet cadastrado com sucesso." });
      }
      onVoltar();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar pet.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="ghost" onClick={onVoltar} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para a lista
      </Button>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-2xl border border-border shadow-lg">
        <h2 className="text-2xl font-semibold">
          {isEditing ? "Editar Pet" : "Novo Pet"}
        </h2>

        <div className="space-y-2">
          <Label htmlFor="nomePet">Nome do Pet *</Label>
          <Input id="nomePet" placeholder="Digite o nome do pet" value={formData.nomePet} onChange={handleChange} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="especie">Espécie *</Label>
            <Select value={formData.especie} onValueChange={handleSelectChange}>
              <SelectTrigger id="especie">
                <SelectValue placeholder="Selecione a espécie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cachorro">Cachorro</SelectItem>
                <SelectItem value="gato">Gato</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="raca">Raça</Label>
            <Input id="raca" placeholder="Raça do pet" value={formData.raca} onChange={handleChange} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="idade">Idade</Label>
            <Input id="idade" placeholder="Ex: 3 anos" value={formData.idade} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="peso">Peso</Label>
            <Input id="peso" placeholder="Ex: 15kg" value={formData.peso} onChange={handleChange} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tutor">Tutor Responsável *</Label>
          <Input id="tutor" placeholder="Nome do tutor" value={formData.tutor} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea id="observacoes" placeholder="Cuidados especiais, alergias, medicamentos, temperamento..." rows={4} value={formData.observacoes} onChange={handleChange} />
        </div>

        <Button className="w-full" size="lg" type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Salvar Alterações" : "Cadastrar Pet"}
        </Button>
      </form>
    </>
  );
};

export default PetForm;
