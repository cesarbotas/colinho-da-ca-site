import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cadastrarCupom, atualizarCupom, type CupomData } from "@/lib/api";

interface CupomFormProps {
  cupom?: CupomData | null;
  onVoltar: () => void;
}

const CupomForm = ({ cupom, onVoltar }: CupomFormProps) => {
  const isEditing = !!cupom?.id;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CupomData>({
    codigo: cupom?.codigo || "",
    descricao: cupom?.descricao || "",
    tipo: cupom?.tipo || 1,
    percentual: cupom?.percentual || 0,
    valorFixo: cupom?.valorFixo || null,
    minimoValorTotal: cupom?.minimoValorTotal || null,
    minimoPets: cupom?.minimoPets || null,
    minimoDiarias: cupom?.minimoDiarias || null,
    dataInicio: cupom?.dataInicio || null,
    dataFim: cupom?.dataFim || null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const numericFields = ["percentual", "valorFixo", "minimoValorTotal", "minimoPets", "minimoDiarias"];
    setFormData((prev) => ({ 
      ...prev, 
      [id]: numericFields.includes(id) ? (value === "" ? null : Number(value)) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.codigo || !formData.descricao) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha código e descrição.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await atualizarCupom(cupom!.id!, formData);
        toast({ title: "Sucesso!", description: "Cupom atualizado com sucesso." });
      } else {
        await cadastrarCupom(formData);
        toast({ title: "Sucesso!", description: "Cupom cadastrado com sucesso." });
      }
      onVoltar();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar cupom.",
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
          {isEditing ? "Editar Cupom" : "Novo Cupom"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="codigo">Código *</Label>
            <Input id="codigo" placeholder="Ex: DESC10" value={formData.codigo} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo *</Label>
            <Select value={formData.tipo.toString()} onValueChange={(v) => setFormData(prev => ({ ...prev, tipo: Number(v) }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Percentual sobre total</SelectItem>
                <SelectItem value="2">Percentual por pet com mínimo</SelectItem>
                <SelectItem value="3">Percentual por pet com diárias</SelectItem>
                <SelectItem value="4">Valor fixo com mínimo</SelectItem>
                <SelectItem value="5">Desconto no último pet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição *</Label>
          <Textarea id="descricao" placeholder="Descrição do cupom" rows={2} value={formData.descricao} onChange={handleChange} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="percentual">Percentual (%)</Label>
            <Input id="percentual" type="number" min="0" max="100" step="0.01" value={formData.percentual || ""} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="valorFixo">Valor Fixo (R$)</Label>
            <Input id="valorFixo" type="number" min="0" step="0.01" value={formData.valorFixo || ""} onChange={handleChange} />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minimoValorTotal">Mínimo Valor Total (R$)</Label>
            <Input id="minimoValorTotal" type="number" min="0" step="0.01" value={formData.minimoValorTotal || ""} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimoPets">Mínimo Pets</Label>
            <Input id="minimoPets" type="number" min="0" value={formData.minimoPets || ""} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimoDiarias">Mínimo Diárias</Label>
            <Input id="minimoDiarias" type="number" min="0" value={formData.minimoDiarias || ""} onChange={handleChange} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dataInicio">Data Início</Label>
            <Input id="dataInicio" type="datetime-local" value={formData.dataInicio?.slice(0, 16) || ""} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dataFim">Data Fim</Label>
            <Input id="dataFim" type="datetime-local" value={formData.dataFim?.slice(0, 16) || ""} onChange={handleChange} />
          </div>
        </div>

        <Button className="w-full" size="lg" type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Salvar Alterações" : "Cadastrar Cupom"}
        </Button>
      </form>
    </>
  );
};

export default CupomForm;
