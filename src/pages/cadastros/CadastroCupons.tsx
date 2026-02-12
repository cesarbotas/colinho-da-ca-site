import { useState } from "react";
import CupomForm from "@/components/CupomForm";
import CupomList from "@/components/CupomList";
import { CupomData } from "@/lib/api";

const CadastroCupons = () => {
  const [view, setView] = useState<"list" | "form">("list");
  const [cupomSelecionado, setCupomSelecionado] = useState<CupomData | null>(null);

  const handleNovoCupom = () => {
    setCupomSelecionado(null);
    setView("form");
  };

  const handleEditarCupom = (cupom: CupomData) => {
    setCupomSelecionado(cupom);
    setView("form");
  };

  const handleVoltar = () => {
    setCupomSelecionado(null);
    setView("list");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Gerenciar Cupons</h1>
      {view === "list" ? (
        <CupomList onNovoCupom={handleNovoCupom} onEditarCupom={handleEditarCupom} />
      ) : (
        <CupomForm cupom={cupomSelecionado} onVoltar={handleVoltar} />
      )}
    </div>
  );
};

export default CadastroCupons;
