import { useState } from "react";
import Navigation from "@/components/Navigation";
import { PawPrint } from "lucide-react";
import PetList from "@/components/PetList";
import PetForm from "@/components/PetForm";
import { type PetData } from "@/lib/api";

type View = "list" | "form";

const CadastroPets = () => {
  const [view, setView] = useState<View>("list");
  const [petEditando, setPetEditando] = useState<PetData | null>(null);

  const handleNovo = () => {
    setPetEditando(null);
    setView("form");
  };

  const handleEditar = (pet: PetData) => {
    setPetEditando(pet);
    setView("form");
  };

  const handleVoltar = () => {
    setPetEditando(null);
    setView("list");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <PawPrint className="w-10 h-10 text-accent" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Pets
            </h1>
          </div>

          {view === "list" ? (
            <PetList onNovoPet={handleNovo} onEditarPet={handleEditar} />
          ) : (
            <PetForm pet={petEditando} onVoltar={handleVoltar} />
          )}
        </div>
      </main>
    </div>
  );
};

export default CadastroPets;
