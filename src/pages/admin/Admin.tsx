import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { Users, PawPrint, CalendarCheck } from "lucide-react";

const Admin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Administração
        </h1>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Gerencie todos os cadastros do sistema
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Link
            to="/admin/clientes"
            className="group p-8 rounded-2xl bg-card border border-border hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/10"
          >
            <Users className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold mb-2">Clientes</h2>
            <p className="text-muted-foreground">
              Gerencie todos os clientes cadastrados
            </p>
          </Link>

          <Link
            to="/admin/pets"
            className="group p-8 rounded-2xl bg-card border border-border hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/10"
          >
            <PawPrint className="w-12 h-12 text-accent mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold mb-2">Pets</h2>
            <p className="text-muted-foreground">
              Visualize e gerencie todos os pets
            </p>
          </Link>

          <Link
            to="/admin/reservas"
            className="group p-8 rounded-2xl bg-card border border-border hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/10"
          >
            <CalendarCheck className="w-12 h-12 text-secondary mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold mb-2">Reservas</h2>
            <p className="text-muted-foreground">
              Gerencie todas as reservas do sistema
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Admin;
