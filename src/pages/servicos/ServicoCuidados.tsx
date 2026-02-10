import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Sparkles, Clock, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const ServicoCuidados = () => {
  const features = [
    {
      icon: Heart,
      title: "Atenção Personalizada",
      description: "Cada pet recebe cuidados individualizados de acordo com suas necessidades",
    },
    {
      icon: Sparkles,
      title: "Ambiente Acolhedor",
      description: "Espaço preparado para proporcionar conforto e bem-estar",
    },
    {
      icon: Clock,
      title: "Horários Flexíveis",
      description: "Atendimento adaptado à sua rotina e necessidades",
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Protocolos de segurança para garantir a tranquilidade do seu pet",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
          <div className="inline-block p-3 bg-gradient-to-br from-primary to-accent rounded-2xl mb-6">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Cuidados Especiais
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Oferecemos atenção individualizada com muito carinho e dedicação. Seu pet merece o melhor!
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center animate-in fade-in slide-in-from-bottom-4">
          <Card className="max-w-2xl mx-auto border-2 border-primary/20">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-bold mb-4">
                Agende uma visita!
              </h2>
              <p className="text-muted-foreground mb-6">
                Venha conhecer nossa estrutura e ver de perto como cuidamos dos nossos hóspedes
              </p>
              <Link to="/sobre/contato">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  Entre em Contato
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ServicoCuidados;
