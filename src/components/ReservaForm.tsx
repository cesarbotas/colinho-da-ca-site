import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2, Check, ChevronsUpDown, CalendarIcon, Ticket } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cadastrarReserva, atualizarReserva, listarClientes, listarPets, authService, aplicarCupom, type ReservaData, type ClienteData, type PetData } from "@/lib/api";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface ReservaFormProps {
  reserva?: ReservaData | null;
  onVoltar: () => void;
}

const ReservaForm = ({ reserva, onVoltar }: ReservaFormProps) => {
  const isEditing = !!reserva?.id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [clientes, setClientes] = useState<ClienteData[]>([]);
  const [pets, setPets] = useState<PetData[]>([]);
  const [openCliente, setOpenCliente] = useState(false);
  const [openDataInicio, setOpenDataInicio] = useState(false);
  const [openDataFim, setOpenDataFim] = useState(false);
  const [codigoCupom, setCodigoCupom] = useState("");
  const [cupomId, setCupomId] = useState<number | null>(null);
  const [valorDescontoLocal, setValorDescontoLocal] = useState(0);
  const [aplicandoCupom, setAplicandoCupom] = useState(false);
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
    const valorFinal = valorTotal - valorDescontoLocal;

    return { quantidadeDiarias: diarias, valorTotal, valorDesconto: valorDescontoLocal, valorFinal, valoresPorPet };
  }, [formData.dataInicial, formData.dataFinal, formData.petIds, pets, valorDescontoLocal]);

  useEffect(() => {
    const carregarClientes = async () => {
      setLoadingData(true);
      try {
        const clienteId = authService.getClienteId();
        const response = await listarClientes(1, 100, clienteId ? clienteId : undefined);
        setClientes(response.data);
        
        // Se for nova reserva e tiver apenas 1 cliente, seleciona automaticamente
        if (!isEditing && response.data.length === 1 && clienteId) {
          setFormData(prev => ({ 
            ...prev, 
            clienteId: response.data[0].id as number
          }));
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar clientes.",
          variant: "destructive",
        });
      } finally {
        setLoadingData(false);
      }
    };
    carregarClientes();
  }, [isEditing]);

  useEffect(() => {
    if (formData.clienteId) {
      const carregarPets = async () => {
        try {
          const response = await listarPets(1, 100, formData.clienteId);
          setPets(response.data);
          
          // Se for nova reserva e não tiver pets cadastrados, mostrar mensagem e redirecionar
          if (!isEditing && response.data.length === 0) {
            toast({
              title: "Nenhum pet cadastrado",
              description: "Você precisa cadastrar pelo menos um pet antes de fazer uma reserva.",
              variant: "destructive",
            });
            setTimeout(() => {
              navigate("/cadastro/pets?novo=true");
            }, 2000);
          }
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
  }, [formData.clienteId, isEditing, navigate]);

  const handleClienteChange = (clienteId: number) => {
    setFormData((prev) => ({ ...prev, clienteId, petIds: [] }));
    setValorDescontoLocal(0);
    setCodigoCupom("");
    setCupomId(null);
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
    setValorDescontoLocal(0);
    setCodigoCupom("");
    setCupomId(null);
  };

  const handleAplicarCupom = async () => {
    if (!codigoCupom.trim()) {
      toast({ title: "Erro", description: "Informe o código do cupom.", variant: "destructive" });
      return;
    }
    if (calculos.quantidadeDiarias === 0 || formData.petIds.length === 0) {
      toast({ title: "Erro", description: "Selecione pets e datas antes de aplicar o cupom.", variant: "destructive" });
      return;
    }
    setAplicandoCupom(true);
    try {
      const resultado = await aplicarCupom(
        0,
        codigoCupom, 
        calculos.valorTotal, 
        formData.petIds.length, 
        calculos.quantidadeDiarias
      );
      setValorDescontoLocal(resultado.valorDesconto);
      setCupomId(resultado.cupomId || null);
      toast({ title: "Sucesso!", description: "Cupom aplicado com sucesso." });
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao aplicar cupom.",
        variant: "destructive",
      });
    } finally {
      setAplicandoCupom(false);
    }
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
      const usuarioId = authService.getUserData()?.id || 0;
      const payload = {
        clienteId: formData.clienteId,
        usuarioId,
        dataInicial: formData.dataInicial,
        dataFinal: formData.dataFinal,
        quantidadeDiarias: calculos.quantidadeDiarias,
        quantidadePets: formData.petIds.length,
        valorTotal: calculos.valorTotal,
        valorDesconto: valorDescontoLocal,
        valorFinal: calculos.valorFinal,
        cupomId: cupomId,
        observacoes: formData.observacoes,
        petIds: formData.petIds,
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

  return (
    <>
      <Button variant="ghost" onClick={onVoltar} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para a lista
      </Button>

      {loadingData ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
      <div className="grid md:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6 bg-card p-8 rounded-2xl border border-border shadow-lg">
        <h2 className="text-2xl font-semibold">
          {isEditing ? "Editar Reserva" : "Nova Reserva"}
        </h2>

        <div className="space-y-2">
          <Label>Cliente *</Label>
          <Input
            value={clientes.find((c) => c.id === formData.clienteId)?.nome || ""}
            disabled
            className="bg-muted"
          />
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
                    setValorDescontoLocal(0);
                    setCodigoCupom("");
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
                    setValorDescontoLocal(0);
                    setCodigoCupom("");
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
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-2">Este cliente não possui pets cadastrados.</p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate("/cadastro/pets?novo=true")}
                  >
                    Cadastrar Pet
                  </Button>
                </div>
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

            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Subtotal:</span>
                <span className="text-sm font-medium">R$ {calculos.valorTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Desconto:</span>
                <span className="text-sm font-medium text-green-600">- R$ {calculos.valorDesconto.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-bold">Valor Final:</span>
                <span className="text-2xl font-bold text-primary">R$ {calculos.valorFinal.toFixed(2)}</span>
              </div>
            </div>

            {calculos.valorTotal > 0 && (
              <div className="border-t pt-3 space-y-2">
                <Label htmlFor="cupom">Cupom de Desconto</Label>
                <div className="flex gap-2">
                  <Input
                    id="cupom"
                    placeholder="Código do cupom"
                    value={codigoCupom}
                    onChange={(e) => setCodigoCupom(e.target.value.toUpperCase())}
                    disabled={aplicandoCupom}
                  />
                  <Button onClick={handleAplicarCupom} disabled={aplicandoCupom || !codigoCupom.trim()} size="sm">
                    {aplicandoCupom && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Ticket className="mr-2 h-4 w-4" />
                    Aplicar
                  </Button>
                </div>
                {codigoCupom && valorDescontoLocal > 0 && (
                  <p className="text-xs text-green-600">Cupom aplicado: {codigoCupom}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </>
  );
};

export default ReservaForm;
