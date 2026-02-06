import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PawPrint, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cadastrarPet, type PetData } from "@/lib/api";

const CadastroPets = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PetData>({
    nomePet: "",
    especie: "",
    raca: "",
    idade: "",
    peso: "",
    tutor: "",
    observacoes: "",
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
      await cadastrarPet(formData);
      toast({
        title: "Sucesso!",
        description: "Pet cadastrado com sucesso.",
      });
      setFormData({
        nomePet: "",
        especie: "",
        raca: "",
        idade: "",
        peso: "",
        tutor: "",
        observacoes: "",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao cadastrar pet.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <PawPrint className="w-10 h-10 text-accent" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Cadastro de Pets
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-2xl border border-border shadow-lg">
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
              <Textarea
                id="observacoes"
                placeholder="Cuidados especiais, alergias, medicamentos, temperamento..."
                rows={4}
                value={formData.observacoes}
                onChange={handleChange}
              />
            </div>

            <Button className="w-full" size="lg" type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cadastrar Pet
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CadastroPets;
