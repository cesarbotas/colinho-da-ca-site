import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cadastrarCliente, type ClienteData } from "@/lib/api";

const CadastroCliente = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ClienteData>({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    endereco: "",
    observacoes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.telefone) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, email e telefone.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await cadastrarCliente(formData);
      toast({
        title: "Sucesso!",
        description: "Cliente cadastrado com sucesso.",
      });
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        endereco: "",
        observacoes: "",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao cadastrar cliente.",
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
            <User className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Cadastro de Cliente
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-2xl border border-border shadow-lg">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input id="nome" placeholder="Digite o nome completo" value={formData.nome} onChange={handleChange} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" placeholder="email@exemplo.com" value={formData.email} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input id="telefone" placeholder="(00) 00000-0000" value={formData.telefone} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input id="endereco" placeholder="Rua, número, bairro" value={formData.endereco} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Informações adicionais sobre o cliente"
                rows={4}
                value={formData.observacoes}
                onChange={handleChange}
              />
            </div>

            <Button className="w-full" size="lg" type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cadastrar Cliente
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CadastroCliente;
