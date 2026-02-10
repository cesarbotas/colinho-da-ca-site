import { Link } from "react-router-dom";
import { Heart, Home } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Servicos = () => {
  const services = [
    {
      icon: Heart,
      title: "Cuidados Especiais",
      description: "Atenção individualizada com muito carinho e dedicação para seu pet",
      path: "/servicos/cuidados",
      color: "from-primary to-accent",
    },
    {
      icon: Home,
      title: "Hospedagem",
      description: "Um lar temporário acolhedor e seguro para seu melhor amigo",
      path: "/servicos/hospedagem",
      color: "from-accent to-primary",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Nossos Serviços
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Oferecemos cuidados especializados com amor e dedicação para garantir o bem-estar do seu pet
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.path}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50"
              >
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={service.path}>
                    <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
                      Saiba Mais
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-lg border-2 border-primary/20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para proporcionar o melhor para seu pet?
            </h2>
            <p className="text-muted-foreground mb-6">
              Entre em contato conosco e descubra como podemos cuidar do seu companheiro
            </p>
            <Link to="/sobre/contato">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                Fale Conosco
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Servicos;
