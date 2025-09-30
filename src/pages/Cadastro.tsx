import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { User, PawPrint } from "lucide-react";

const Cadastro = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Cadastro
        </h1>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Gerencie os cadastros de clientes e seus pets de forma simples e organizada
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link
            to="/cadastro/cliente"
            className="group p-8 rounded-2xl bg-card border border-border hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/10"
          >
            <User className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold mb-2">Cadastro de Cliente</h2>
            <p className="text-muted-foreground">
              Registre informações dos tutores e responsáveis
            </p>
          </Link>

          <Link
            to="/cadastro/pets"
            className="group p-8 rounded-2xl bg-card border border-border hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/10"
          >
            <PawPrint className="w-12 h-12 text-accent mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold mb-2">Cadastro de Pets</h2>
            <p className="text-muted-foreground">
              Adicione e gerencie informações dos pets
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Cadastro;
