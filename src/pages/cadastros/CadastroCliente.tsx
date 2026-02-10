import { useState } from "react";
import Navigation from "@/components/Navigation";
import { User } from "lucide-react";
import ClienteList from "@/components/ClienteList";
import ClienteForm from "@/components/ClienteForm";
import { type ClienteData } from "@/lib/api";

type View = "list" | "form";

const CadastroCliente = () => {
  const [view, setView] = useState<View>("list");
  const [clienteEditando, setClienteEditando] = useState<ClienteData | null>(null);

  const handleNovo = () => {
    setClienteEditando(null);
    setView("form");
  };

  const handleEditar = (cliente: ClienteData) => {
    setClienteEditando(cliente);
    setView("form");
  };

  const handleVoltar = () => {
    setClienteEditando(null);
    setView("list");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <User className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Clientes
            </h1>
          </div>

          {view === "list" ? (
            <ClienteList onNovoCliente={handleNovo} onEditarCliente={handleEditar} />
          ) : (
            <ClienteForm cliente={clienteEditando} onVoltar={handleVoltar} />
          )}
        </div>
      </main>
    </div>
  );
};

export default CadastroCliente;
