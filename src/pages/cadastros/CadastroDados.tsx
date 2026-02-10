import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { User, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { authService, listarClientes, atualizarCliente, type ClienteData } from "@/lib/api";

const CadastroDados = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ClienteData>({
    nome: "",
    email: "",
    celular: "",
    cpf: "",
    observacoes: "",
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const clienteId = authService.getClienteId();
        if (clienteId) {
          const response = await listarClientes(1, 1, clienteId);
          if (response.data.length > 0) {
            setFormData(response.data[0]);
          }
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar dados.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.email || !formData.celular || !formData.cpf) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, email, celular e CPF.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await atualizarCliente(formData.id!, formData);
      toast({ title: "Sucesso!", description: "Dados atualizados com sucesso." });
      navigate("/cadastro");
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar dados.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => navigate("/cadastro")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o Painel
          </Button>
          <div className="flex items-center gap-3 mb-8">
            <User className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Meus Dados
            </h1>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-2xl border border-border shadow-lg">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input id="nome" value={formData.nome} onChange={handleChange} required />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="celular">Celular *</Label>
                  <Input id="celular" value={formData.celular} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input id="cpf" value={formData.cpf} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea id="observacoes" rows={4} value={formData.observacoes} onChange={handleChange} />
              </div>

              <Button className="w-full" size="lg" type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Alterações
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default CadastroDados;
