import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Loader2, CalendarIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cadastrarCupom, atualizarCupom, type CupomData } from "@/lib/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AdminCupomFormProps {
  cupom?: CupomData | null;
  onVoltar: () => void;
}

const AdminCupomForm = ({ cupom, onVoltar }: AdminCupomFormProps) => {
  const isEditing = !!cupom?.id;
  const [loading, setLoading] = useState(false);
  const [openDataInicio, setOpenDataInicio] = useState(false);
  const [openDataFim, setOpenDataFim] = useState(false);
  const [formData, setFormData] = useState({
    codigo: cupom?.codigo || "",
    descricao: cupom?.descricao || "",
    tipoDesconto: cupom?.tipoDesconto || 1,
    valorDesconto: cupom?.valorDesconto || 0,
    dataInicio: cupom?.dataInicio ? cupom.dataInicio.split('T')[0] : "",
    dataFim: cupom?.dataFim ? cupom.dataFim.split('T')[0] : "",
    quantidadeMaxima: cupom?.quantidadeMaxima || 0,
    ativo: cupom?.ativo ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.codigo || !formData.dataInicio || !formData.dataFim || formData.valorDesconto <= 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha código, valor, data início e data fim.",
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

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-2xl border border-border shadow-lg max-w-2xl">
        <h2 className="text-2xl font-semibold">
          {isEditing ? "Editar Cupom" : "Novo Cupom"}
        </h2>

        <div className="space-y-2">
          <Label htmlFor="codigo">Código *</Label>
          <Input
            id="codigo"
            value={formData.codigo}
            onChange={(e) => setFormData((prev) => ({ ...prev, codigo: e.target.value.toUpperCase() }))}
            placeholder="Ex: DESCONTO50"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            value={formData.descricao}
            onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))}
            placeholder="Descrição do cupom..."
            rows={3}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tipo de Desconto *</Label>
            <Select value={formData.tipoDesconto.toString()} onValueChange={(v) => setFormData((prev) => ({ ...prev, tipoDesconto: Number(v) }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Percentual (%)</SelectItem>
                <SelectItem value="2">Valor Fixo (R$)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorDesconto">Valor do Desconto *</Label>
            <Input
              id="valorDesconto"
              type="number"
              step="0.01"
              min="0"
              value={formData.valorDesconto}
              onChange={(e) => setFormData((prev) => ({ ...prev, valorDesconto: parseFloat(e.target.value) }))}
              placeholder={formData.tipoDesconto === 1 ? "Ex: 10" : "Ex: 50.00"}
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Data Início *</Label>
            <Popover open={openDataInicio} onOpenChange={setOpenDataInicio}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dataInicio ? format(new Date(formData.dataInicio + 'T12:00:00'), "dd/MM/yyyy") : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dataInicio ? new Date(formData.dataInicio + 'T12:00:00') : undefined}
                  onSelect={(date) => {
                    setFormData((prev) => ({ ...prev, dataInicio: date ? format(date, "yyyy-MM-dd") : "" }));
                    setOpenDataInicio(false);
                  }}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Data Fim *</Label>
            <Popover open={openDataFim} onOpenChange={setOpenDataFim}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dataFim ? format(new Date(formData.dataFim + 'T12:00:00'), "dd/MM/yyyy") : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dataFim ? new Date(formData.dataFim + 'T12:00:00') : undefined}
                  onSelect={(date) => {
                    setFormData((prev) => ({ ...prev, dataFim: date ? format(date, "yyyy-MM-dd") : "" }));
                    setOpenDataFim(false);
                  }}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantidadeMaxima">Quantidade Máxima de Usos (0 = ilimitado)</Label>
          <Input
            id="quantidadeMaxima"
            type="number"
            min="0"
            value={formData.quantidadeMaxima}
            onChange={(e) => setFormData((prev) => ({ ...prev, quantidadeMaxima: parseInt(e.target.value) || 0 }))}
          />
        </div>

        <Button className="w-full" size="lg" type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Salvar Alterações" : "Cadastrar Cupom"}
        </Button>
      </form>
    </>
  );
};

export default AdminCupomForm;
