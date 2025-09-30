import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PawPrint } from "lucide-react";

const CadastroPets = () => {
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

          <form className="space-y-6 bg-card p-8 rounded-2xl border border-border shadow-lg">
            <div className="space-y-2">
              <Label htmlFor="nomePet">Nome do Pet</Label>
              <Input id="nomePet" placeholder="Digite o nome do pet" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="especie">Espécie</Label>
                <Select>
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
                <Input id="raca" placeholder="Raça do pet" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idade">Idade</Label>
                <Input id="idade" placeholder="Ex: 3 anos" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="peso">Peso</Label>
                <Input id="peso" placeholder="Ex: 15kg" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tutor">Tutor Responsável</Label>
              <Input id="tutor" placeholder="Nome do tutor" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoesPet">Observações</Label>
              <Textarea
                id="observacoesPet"
                placeholder="Cuidados especiais, alergias, medicamentos, temperamento..."
                rows={4}
              />
            </div>

            <Button className="w-full" size="lg">
              Cadastrar Pet
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CadastroPets;
