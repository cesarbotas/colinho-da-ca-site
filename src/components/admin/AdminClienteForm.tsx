import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cadastrarCliente, atualizarCliente, type ClienteData } from "@/lib/api";

interface AdminClienteFormProps {
  cliente?: ClienteData | null;
  onVoltar: () => void;
}

const AdminClienteForm = ({ cliente, onVoltar }: AdminClienteFormProps) => {
  const isEditing = !!cliente?.id;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ClienteData>({
    nome: cliente?.nome || "",
    email: cliente?.email || "",
    celular: cliente?.celular ? cliente.celular.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3") : "",
    cpf: cliente?.cpf ? cliente.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : "",
    observacoes: cliente?.observacoes || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let maskedValue = value;
    
    if (id === "cpf") {
      maskedValue = value.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").slice(0, 14);
    } else if (id === "celular") {
      maskedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3").slice(0, 15);
    }
    
    setFormData((prev) => ({ ...prev, [id]: maskedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.celular) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, email e celular.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        cpf: formData.cpf?.replace(/\D/g, ""),
        celular: formData.celular?.replace(/\D/g, ""),
      };
      if (isEditing) {
        await atualizarCliente(cliente!.id!, payload);
        toast({ title: "Sucesso!", description: "Cliente atualizado com sucesso." });
      } else {
        await cadastrarCliente(payload);
        toast({ title: "Sucesso!", description: "Cliente cadastrado com sucesso." });
      }
      onVoltar();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar cliente.",
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
          {isEditing ? "Editar Cliente" : "Novo Cliente"}
        </h2>

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
            <Label htmlFor="celular">Celular *</Label>
            <Input id="celular" placeholder="(00) 00000-0000" value={formData.celular} onChange={handleChange} onBlur={handleBlur} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input id="cpf" placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} onBlur={handleBlur} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea id="observacoes" placeholder="Informações adicionais" rows={4} value={formData.observacoes} onChange={handleChange} />
        </div>

        <Button className="w-full" size="lg" type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Salvar Alterações" : "Cadastrar Cliente"}
        </Button>
      </form>
    </>
  );
};

export default AdminClienteForm;
