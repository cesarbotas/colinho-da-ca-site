import { useState } from "react";
import AdminCupomList from "@/components/admin/AdminCupomList";
import AdminCupomForm from "@/components/admin/AdminCupomForm";
import { CupomData } from "@/lib/api";

const Cupons = () => {
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
      <h1 className="text-3xl font-bold mb-8">Cupons de Desconto</h1>
      {view === "list" ? (
        <AdminCupomList onNovoCupom={handleNovoCupom} onEditarCupom={handleEditarCupom} />
      ) : (
        <AdminCupomForm cupom={cupomSelecionado} onVoltar={handleVoltar} />
      )}
    </div>
  );
};

export default Cupons;
