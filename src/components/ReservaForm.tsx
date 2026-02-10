import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2, Check, ChevronsUpDown, CalendarIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cadastrarReserva, atualizarReserva, listarClientes, listarPets, type ReservaData, type ClienteData, type PetData } from "@/lib/api";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReservaFormProps {
  reserva?: ReservaData | null;
  onVoltar: () => void;
}

const ReservaForm = ({ reserva, onVoltar }: ReservaFormProps) => {
  const isEditing = !!reserva?.id;
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<ClienteData[]>([]);
  const [pets, setPets] = useState<PetData[]>([]);
  const [openCliente, setOpenCliente] = useState(false);
  const [openDataInicio, setOpenDataInicio] = useState(false);
  const [openDataFim, setOpenDataFim] = useState(false);
  const [formData, setFormData] = useState({
    clienteId: reserva?.clienteId || 0,
    petIds: reserva?.pets?.map(p => p.id) || [],
    dataInicial: reserva?.dataInicial || "",
    dataFinal: reserva?.dataFinal || "",
    observacoes: reserva?.observacoes || "",
  });

  useEffect(() => {
    const carregarClientes = async () => {
      try {
        const response = await listarClientes(1, 100);
        setClientes(response.data);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar clientes.",
          variant: "destructive",
        });
      }
    };
    carregarClientes();
  }, []);

  useEffect(() => {
    if (formData.clienteId) {
      const carregarPets = async () => {
        try {
          const response = await listarPets(1, 100, formData.clienteId);
          setPets(response.data);
        } catch (error) {
          toast({
            title: "Erro",
            description: "Erro ao carregar pets.",
            variant: "destructive",
          });
        }
      };
      carregarPets();
    } else {
      setPets([]);
      setFormData(prev => ({ ...prev, petIds: [] }));
    }
  }, [formData.clienteId]);

  const handleClienteChange = (clienteId: number) => {
    setFormData((prev) => ({ ...prev, clienteId, petIds: [] }));
    setOpenCliente(false);
  };

  const handlePetToggle = (petId: number) => {
    setFormData((prev) => {
      const petIds = prev.petIds.includes(petId)
        ? prev.petIds.filter(id => id !== petId)
        : prev.petIds.length < 3
        ? [...prev.petIds, petId]
        : prev.petIds;
      return { ...prev, petIds };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clienteId || formData.petIds.length === 0 || !formData.dataInicial || !formData.dataFinal) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha cliente, pelo menos 1 pet, data início e data fim.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await atualizarReserva(reserva!.id!, formData);
        toast({ title: "Sucesso!", description: "Reserva atualizada com sucesso." });
      } else {
        await cadastrarReserva(formData);
        toast({ title: "Sucesso!", description: "Reserva cadastrada com sucesso." });
      }
      onVoltar();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar reserva.",
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
          {isEditing ? "Editar Reserva" : "Nova Reserva"}
        </h2>

        <div className="space-y-2">
          <Label>Cliente *</Label>
          <Popover open={openCliente} onOpenChange={setOpenCliente}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between">
                {formData.clienteId ? clientes.find((c) => c.id === formData.clienteId)?.nome : "Selecione o cliente..."}
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
                      <CommandItem key={cliente.id} value={cliente.nome} onSelect={() => handleClienteChange(cliente.id as number)}>
                        <Check className={cn("mr-2 h-4 w-4", formData.clienteId === cliente.id ? "opacity-100" : "opacity-0")} />
                        {cliente.nome}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {formData.clienteId > 0 && (
          <div className="space-y-2">
            <Label>Pets (selecione até 3) *</Label>
            <div className="border rounded-lg p-4 space-y-2">
              {pets.length === 0 ? (
                <p className="text-sm text-muted-foreground">Este cliente não possui pets cadastrados.</p>
              ) : (
                pets.map((pet) => (
                  <div key={pet.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`pet-${pet.id}`}
                      checked={formData.petIds.includes(pet.id as number)}
                      onCheckedChange={() => handlePetToggle(pet.id as number)}
                      disabled={!formData.petIds.includes(pet.id as number) && formData.petIds.length >= 3}
                    />
                    <label htmlFor={`pet-${pet.id}`} className="text-sm cursor-pointer">
                      {pet.nome} - {pet.raca || "Sem raça"}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Data Início *</Label>
            <Popover open={openDataInicio} onOpenChange={setOpenDataInicio}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dataInicial ? format(new Date(formData.dataInicial), "PPP", { locale: ptBR }) : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dataInicial ? new Date(formData.dataInicial) : undefined}
                  onSelect={(date) => {
                    setFormData((prev) => ({ ...prev, dataInicial: date ? format(date, "yyyy-MM-dd") : "" }));
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
                  {formData.dataFinal ? format(new Date(formData.dataFinal), "PPP", { locale: ptBR }) : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dataFinal ? new Date(formData.dataFinal) : undefined}
                  onSelect={(date) => {
                    setFormData((prev) => ({ ...prev, dataFinal: date ? format(date, "yyyy-MM-dd") : "" }));
                    setOpenDataFim(false);
                  }}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea
            id="observacoes"
            placeholder="Informações adicionais sobre a reserva..."
            rows={4}
            value={formData.observacoes}
            onChange={(e) => setFormData((prev) => ({ ...prev, observacoes: e.target.value }))}
          />
        </div>

        <Button className="w-full" size="lg" type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Salvar Alterações" : "Cadastrar Reserva"}
        </Button>
      </form>
    </>
  );
};

export default ReservaForm;
