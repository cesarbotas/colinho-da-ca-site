import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Loader2, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cadastrarPet, atualizarPet, listarClientes, authService, PortePet, PortePetLabel, type PetData, type ClienteData } from "@/lib/api";
import { cn } from "@/lib/utils";

interface PetFormProps {
  pet?: PetData | null;
  onVoltar: () => void;
}

const PetForm = ({ pet, onVoltar }: PetFormProps) => {
  const isEditing = !!pet?.id;
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<ClienteData[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<PetData>({
    nome: pet?.nome || "",
    porte: pet?.porte || "",
    raca: pet?.raca || "",
    idade: pet?.idade || "",
    peso: pet?.peso || "",
    tutor: pet?.tutor || "",
    observacoes: pet?.observacoes || "",
    clienteId: pet?.clienteId,
  });

  useEffect(() => {
    const carregarClientes = async () => {
      try {
        const clienteId = authService.getClienteId();
        const response = await listarClientes(1, 100, clienteId || undefined);
        setClientes(response.data);
        
        // Se for novo pet e tiver apenas 1 cliente, seleciona automaticamente
        if (!isEditing && response.data.length === 1 && clienteId) {
          setFormData(prev => ({ 
            ...prev, 
            clienteId: response.data[0].id as number,
            tutor: response.data[0].nome 
          }));
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar clientes.",
          variant: "destructive",
        });
      }
    };
    carregarClientes();
  }, [isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePorteChange = (value: string) => {
    setFormData((prev) => ({ ...prev, porte: value }));
  };

  const handleClienteChange = (clienteId: number) => {
    const cliente = clientes.find(c => c.id === clienteId);
    setFormData((prev) => ({ ...prev, clienteId, tutor: cliente?.nome || "" }));
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.porte || !formData.clienteId) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome do pet, porte e tutor.",
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
          <Label htmlFor="nome">Nome do Pet *</Label>
          <Input id="nome" placeholder="Digite o nome do pet" value={formData.nome} onChange={handleChange} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="porte">Porte *</Label>
            <Select value={formData.porte} onValueChange={handlePorteChange}>
              <SelectTrigger id="porte">
                <SelectValue placeholder="Selecione o porte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PortePet.PEQUENO}>{PortePetLabel[PortePet.PEQUENO]}</SelectItem>
                <SelectItem value={PortePet.MEDIO}>{PortePetLabel[PortePet.MEDIO]}</SelectItem>
                <SelectItem value={PortePet.GRANDE}>{PortePetLabel[PortePet.GRANDE]}</SelectItem>
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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {formData.clienteId
                  ? clientes.find((c) => c.id === formData.clienteId)?.nome
                  : "Selecione o cliente..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Buscar cliente..." />
                <CommandList>
                  <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                  <CommandGroup>
                    {clientes.map((cliente) => (
                      <CommandItem
                        key={cliente.id}
                        value={cliente.nome}
                        onSelect={() => handleClienteChange(cliente.id as number)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.clienteId === cliente.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {cliente.nome}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
