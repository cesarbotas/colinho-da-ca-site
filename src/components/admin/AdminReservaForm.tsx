import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowLeft, Loader2, Check, ChevronsUpDown, CalendarIcon, X, Percent } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cadastrarReserva, atualizarReserva, listarClientes, listarPets, cancelarReserva, aplicarDesconto, confirmarReserva, type ReservaData, type ClienteData, type PetData } from "@/lib/api";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AdminReservaFormProps {
  reserva?: ReservaData | null;
  onVoltar: () => void;
}

const AdminReservaForm = ({ reserva, onVoltar }: AdminReservaFormProps) => {
  const isEditing = !!reserva?.id;
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<ClienteData[]>([]);
  const [pets, setPets] = useState<PetData[]>([]);
  const [openCliente, setOpenCliente] = useState(false);
  const [openDataInicio, setOpenDataInicio] = useState(false);
  const [openDataFim, setOpenDataFim] = useState(false);
  const [openDesconto, setOpenDesconto] = useState(false);
  const [openCancelar, setOpenCancelar] = useState(false);
  const [openConfirmar, setOpenConfirmar] = useState(false);
  const [valorDesconto, setValorDesconto] = useState("");
  const [formData, setFormData] = useState({
    clienteId: reserva?.clienteId || 0,
    petIds: reserva?.pets?.map(p => p.id) || [],
    dataInicial: reserva?.dataInicial ? reserva.dataInicial.split('T')[0] : "",
    dataFinal: reserva?.dataFinal ? reserva.dataFinal.split('T')[0] : "",
    observacoes: reserva?.observacoes || "",
  });

  const VALOR_DIARIA = 85;

  const calculos = useMemo(() => {
    if (!formData.dataInicial || !formData.dataFinal || formData.petIds.length === 0) {
      return { quantidadeDiarias: 0, valorTotal: 0, valorDesconto: 0, valorFinal: 0, valoresPorPet: [] };
    }

    const inicio = new Date(formData.dataInicial + 'T12:00:00');
    const fim = new Date(formData.dataFinal + 'T12:00:00');
    const diarias = Math.max(1, Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)));

    const valoresPorPet = formData.petIds.map(petId => {
      const pet = pets.find(p => p.id === petId);
      const valorPet = VALOR_DIARIA * diarias;
      return { petId, nome: pet?.nome || '', valorPet };
    });

    const valorTotal = valoresPorPet.reduce((sum, p) => sum + p.valorPet, 0);
    const desconto = parseFloat(valorDesconto) || reserva?.valorDesconto || 0;
    const valorFinal = valorTotal - desconto;

    return { quantidadeDiarias: diarias, valorTotal, valorDesconto: desconto, valorFinal, valoresPorPet };
  }, [formData.dataInicial, formData.dataFinal, formData.petIds, pets, reserva?.valorDesconto, valorDesconto]);

  useEffect(() => {
    if (isEditing && reserva?.valorDesconto) {
      setValorDesconto(reserva.valorDesconto.toString());
    }
  }, [isEditing, reserva?.valorDesconto]);

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

    if (new Date(formData.dataInicial) > new Date(formData.dataFinal)) {
      toast({
        title: "Datas inválidas",
        description: "A data inicial não pode ser maior que a data final.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        quantidadeDiarias: calculos.quantidadeDiarias,
        quantidadePets: formData.petIds.length,
        valorTotal: calculos.valorTotal,
      };
      
      if (isEditing) {
        await atualizarReserva(reserva!.id!, payload);
        toast({ title: "Sucesso!", description: "Reserva atualizada com sucesso." });
      } else {
        await cadastrarReserva(payload);
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

  const handleCancelar = async () => {
    if (!reserva?.id) return;
    setLoading(true);
    try {
      await cancelarReserva(reserva.id);
      toast({ title: "Sucesso!", description: "Reserva cancelada com sucesso." });
      setOpenCancelar(false);
      onVoltar();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao cancelar reserva.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmar = async () => {
    if (!reserva?.id) return;
    setLoading(true);
    try {
      await confirmarReserva(reserva.id);
      toast({ title: "Sucesso!", description: "Reserva confirmada com sucesso." });
      setOpenConfirmar(false);
      onVoltar();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao confirmar reserva.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAplicarDesconto = async () => {
    if (!reserva?.id || !valorDesconto) return;
    const desconto = parseFloat(valorDesconto);
    if (isNaN(desconto) || desconto < 0) {
      toast({ title: "Erro", description: "Valor de desconto inválido.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await aplicarDesconto(reserva.id, desconto);
      toast({ title: "Sucesso!", description: "Desconto aplicado com sucesso." });
      setOpenDesconto(false);
      setValorDesconto("");
      onVoltar();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao aplicar desconto.",
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

      <div className="grid md:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6 bg-card p-8 rounded-2xl border border-border shadow-lg">
        <h2 className="text-2xl font-semibold">
          {isEditing ? "Editar Reserva" : "Nova Reserva"}
        </h2>

        <div className="space-y-2">
          <Label>Cliente *</Label>
          <Popover open={openCliente} onOpenChange={setOpenCliente}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCliente}
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

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Data Início *</Label>
            <Popover open={openDataInicio} onOpenChange={setOpenDataInicio}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dataInicial ? format(new Date(formData.dataInicial + 'T12:00:00'), "dd/MM/yyyy") : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dataInicial ? new Date(formData.dataInicial + 'T12:00:00') : undefined}
                  onSelect={(date) => {
                    const newDataInicial = date ? format(date, "yyyy-MM-dd") : "";
                    const hoje = format(new Date(), "yyyy-MM-dd");
                    
                    if (newDataInicial && newDataInicial < hoje) {
                      toast({
                        title: "Data inválida",
                        description: "A data inicial não pode ser anterior a hoje.",
                        variant: "destructive",
                      });
                      return;
                    }
                    
                    if (formData.dataFinal && newDataInicial > formData.dataFinal) {
                      toast({
                        title: "Data inválida",
                        description: "A data inicial não pode ser maior que a data final.",
                        variant: "destructive",
                      });
                      return;
                    }
                    setFormData((prev) => ({ ...prev, dataInicial: newDataInicial }));
                    setOpenDataInicio(false);
                  }}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
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
                  {formData.dataFinal ? format(new Date(formData.dataFinal + 'T12:00:00'), "dd/MM/yyyy") : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dataFinal ? new Date(formData.dataFinal + 'T12:00:00') : undefined}
                  onSelect={(date) => {
                    const newDataFinal = date ? format(date, "yyyy-MM-dd") : "";
                    const hoje = format(new Date(), "yyyy-MM-dd");
                    
                    if (newDataFinal && newDataFinal < hoje) {
                      toast({
                        title: "Data inválida",
                        description: "A data final não pode ser anterior a hoje.",
                        variant: "destructive",
                      });
                      return;
                    }
                    
                    if (formData.dataInicial && newDataFinal < formData.dataInicial) {
                      toast({
                        title: "Data inválida",
                        description: "A data final não pode ser menor que a data inicial.",
                        variant: "destructive",
                      });
                      return;
                    }
                    setFormData((prev) => ({ ...prev, dataFinal: newDataFinal }));
                    setOpenDataFim(false);
                  }}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
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
                      {pet.nome} - {pet.racaNome || "Sem raça"}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

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
        
        {isEditing && reserva?.status === 1 && (
          <Button 
            variant="default" 
            size="lg" 
            type="button" 
            onClick={() => setOpenConfirmar(true)} 
            disabled={loading}
            className="w-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Check className="mr-2 h-4 w-4" />
            Confirmar Reserva
          </Button>
        )}
        
        {isEditing && reserva?.status && reserva.status <= 4 && (
          <Button 
            variant="destructive" 
            size="lg" 
            type="button" 
            onClick={() => setOpenCancelar(true)} 
            disabled={loading}
            className="w-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <X className="mr-2 h-4 w-4" />
            Cancelar Reserva
          </Button>
        )}
      </form>

      <div className="space-y-4 bg-card p-6 rounded-2xl border border-border shadow-lg">
          <h3 className="text-lg font-semibold">Resumo</h3>
          
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Diárias</p>
              <p className="text-xl font-bold">{calculos.quantidadeDiarias}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pets</p>
              <p className="text-xl font-bold">{formData.petIds.length}</p>
            </div>

            <div className="border-t pt-3">
              <p className="text-xs font-semibold mb-2">Valores:</p>
              <div className="space-y-1">
                {calculos.valoresPorPet.length > 0 ? (
                  calculos.valoresPorPet.map(p => (
                    <div key={p.petId} className="flex justify-between text-xs bg-muted/50 p-2 rounded">
                      <span>{p.nome}</span>
                      <span className="font-bold">R$ {p.valorPet.toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">Selecione pets e datas</p>
                )}
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold">Subtotal:</span>
                <span className="text-lg font-bold">R$ {calculos.valorTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-green-600">
                <span className="text-sm font-bold">Desconto:</span>
                <span className="text-lg font-bold">- R$ {calculos.valorDesconto.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-sm font-bold">Total:</span>
                <span className="text-2xl font-bold text-primary">R$ {calculos.valorFinal.toFixed(2)}</span>
              </div>
            </div>

            {isEditing && reserva?.status === 1 && (
              <Dialog open={openDesconto} onOpenChange={setOpenDesconto}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <Percent className="mr-2 h-4 w-4" />
                    Conceder Desconto
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Conceder Desconto</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="desconto">Valor do Desconto (R$)</Label>
                      <Input
                        id="desconto"
                        type="number"
                        step="0.01"
                        min="0"
                        max={calculos.valorTotal}
                        value={valorDesconto}
                        onChange={(e) => setValorDesconto(e.target.value)}
                        placeholder="0,00"
                      />
                    </div>
                    <div className="bg-muted p-3 rounded">
                      <p className="text-sm text-muted-foreground">Resumo:</p>
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>R$ {calculos.valorTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Desconto:</span>
                        <span>- R$ {(parseFloat(valorDesconto) || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-1">
                        <span>Total:</span>
                        <span>R$ {(calculos.valorTotal - (parseFloat(valorDesconto) || 0)).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setOpenDesconto(false)} className="flex-1">
                        Cancelar
                      </Button>
                      <Button onClick={handleAplicarDesconto} disabled={loading} className="flex-1">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Aplicar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {isEditing && reserva?.status && (
              <div className="border-t pt-3">
                <p className="text-xs font-semibold mb-2">Status:</p>
                <div className="flex items-center gap-1">
                  {reserva.status === 6 ? (
                    <div className="flex items-center justify-center w-full">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-red-500 text-white">
                          <X className="h-3 w-3" />
                        </div>
                        <p className="text-xs mt-1 text-red-500 font-semibold">Cancelada</p>
                      </div>
                    </div>
                  ) : (
                    [1, 2, 3, 4, 5].map((step, index) => (
                      <div key={step} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            reserva.statusTimeline?.[step] ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            {reserva.statusTimeline?.[step] && <Check className="h-3 w-3" />}
                          </div>
                        </div>
                        {index < 4 && (
                          <div className={`flex-1 h-0.5 ${
                            reserva.statusTimeline?.[step + 1] ? 'bg-primary' : 'bg-muted'
                          }`} />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={openConfirmar} onOpenChange={setOpenConfirmar}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Reserva</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja confirmar esta reserva?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmar} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openCancelar} onOpenChange={setOpenCancelar}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Reserva</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Não</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelar} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sim, Cancelar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminReservaForm;
