import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Bed, Utensils, Camera } from "lucide-react";
import { Link } from "react-router-dom";

const ServicoHospedagem = () => {
  const amenities = [
    {
      icon: Bed,
      title: "Acomodações Confortáveis",
      description: "Espaços amplos e confortáveis para garantir o descanso do seu pet",
    },
    {
      icon: Utensils,
      title: "Alimentação de Qualidade",
      description: "Refeições balanceadas respeitando a dieta e preferências do seu pet",
    },
    {
      icon: Camera,
      title: "Acompanhamento em Tempo Real",
      description: "Envio de fotos e vídeos para você acompanhar como está seu companheiro",
    },
    {
      icon: Home,
      title: "Ambiente Familiar",
      description: "Um verdadeiro lar temporário para seu pet se sentir em casa",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
          <div className="inline-block p-3 bg-gradient-to-br from-accent to-primary rounded-2xl mb-6">
            <Home className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Hospedagem
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Um lar temporário acolhedor e seguro onde seu pet receberá todo amor e atenção que merece
          </p>
        </div>

        {/* Amenities Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
          {amenities.map((amenity) => {
            const Icon = amenity.icon;
            return (
              <Card key={amenity.title} className="border-2 hover:border-accent/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{amenity.title}</h3>
                      <p className="text-muted-foreground">{amenity.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <Card className="border-2 border-accent/20">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-bold mb-4 text-center">
                Como Funciona
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Nossa hospedagem foi criada para que seu pet se sinta em casa. Recebemos um número limitado de hóspedes por vez para garantir atenção individualizada.
                </p>
                <p>
                  Durante a estadia, mantemos você informado com atualizações regulares, fotos e vídeos do seu companheiro. Respeitamos a rotina, dieta e necessidades específicas de cada pet.
                </p>
                <p>
                  A segurança e o bem-estar são nossas prioridades. Nosso ambiente é preparado para proporcionar momentos de diversão, descanso e muito carinho.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center animate-in fade-in slide-in-from-bottom-4">
          <Card className="max-w-2xl mx-auto border-2 border-accent/20">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-bold mb-4">
                Reserve a hospedagem do seu pet!
              </h2>
              <p className="text-muted-foreground mb-6">
                Entre em contato para verificar disponibilidade e agendar a estadia
              </p>
              <Link to="/cadastro/reservas">
                <Button size="lg" className="bg-gradient-to-r from-accent to-primary hover:opacity-90">
                  Fazer Reserva
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ServicoHospedagem;
