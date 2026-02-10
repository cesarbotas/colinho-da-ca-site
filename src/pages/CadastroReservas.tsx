import { useState } from "react";
import ReservaList from "@/components/ReservaList";
import ReservaForm from "@/components/ReservaForm";
import { type ReservaData } from "@/lib/api";

type View = "list" | "form";

const CadastroReservas = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Reservas de Hospedagem
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as reservas de hospedagem dos pets
          </p>
        </div>

        {view === "list" ? (
          <ReservaList onNovaReserva={handleNovaReserva} onEditarReserva={handleEditarReserva} />
        ) : (
          <ReservaForm reserva={reservaSelecionada} onVoltar={handleVoltar} />
        )}
      </main>
    </div>
  );
};

export default CadastroReservas;
