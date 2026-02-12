import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Ticket, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CupomList from "@/components/CupomList";
import CupomForm from "@/components/CupomForm";
import { type CupomData } from "@/lib/api";

type View = "list" | "form";

const AdminCupons = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("list");
  const [cupomEditando, setCupomEditando] = useState<CupomData | null>(null);

  const handleNovo = () => {
    setCupomEditando(null);
    setView("form");
  };

  const handleEditar = (cupom: CupomData) => {
    setCupomEditando(cupom);
    setView("form");
  };

  const handleVoltar = () => {
    setCupomEditando(null);
    setView("list");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Administração
          </Button>
          <div className="flex items-center gap-3 mb-8">
            <Ticket className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Cupons
            </h1>
          </div>

          {view === "list" ? (
            <CupomList onNovoCupom={handleNovo} onEditarCupom={handleEditar} />
          ) : (
            <CupomForm cupom={cupomEditando} onVoltar={handleVoltar} />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminCupons;
