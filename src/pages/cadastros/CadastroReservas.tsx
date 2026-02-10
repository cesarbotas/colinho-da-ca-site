import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { CalendarCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReservaList from "@/components/ReservaList";
import ReservaForm from "@/components/ReservaForm";
import { type ReservaData } from "@/lib/api";

type View = "list" | "form";

const CadastroReservas = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("list");
  const [reservaSelecionada, setReservaSelecionada] = useState<ReservaData | null>(null);

  const handleNovaReserva = () => {
    setReservaSelecionada(null);
    setView("form");
  };

  const handleEditarReserva = (reserva: ReservaData) => {
    setReservaSelecionada(reserva);
    setView("form");
  };

  const handleVoltar = () => {
    setReservaSelecionada(null);
    setView("list");
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
            <CalendarCheck className="w-10 h-10 text-secondary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Minhas Reservas
            </h1>
          </div>

          {view === "list" ? (
            <ReservaList onNovaReserva={handleNovaReserva} onEditarReserva={handleEditarReserva} />
          ) : (
            <ReservaForm reserva={reservaSelecionada} onVoltar={handleVoltar} />
          )}
        </div>
      </main>
    </div>
  );
};

export default CadastroReservas;
