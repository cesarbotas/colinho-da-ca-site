import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminClienteList from "@/components/admin/AdminClienteList";
import AdminClienteForm from "@/components/admin/AdminClienteForm";
import { type ClienteData } from "@/lib/api";

type View = "list" | "form";

const AdminClientes = () => {
  const navigate = useNavigate();
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
          <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Administração
          </Button>
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Clientes
            </h1>
          </div>

          {view === "list" ? (
            <AdminClienteList onNovoCliente={handleNovo} onEditarCliente={handleEditar} />
          ) : (
            <AdminClienteForm cliente={clienteEditando} onVoltar={handleVoltar} />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminClientes;
