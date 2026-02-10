import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Award, Sparkles } from "lucide-react";

const SobreHistoria = () => {
  const values = [
    {
      icon: Heart,
      title: "Amor",
      description: "Cada pet é tratado com carinho genuíno e dedicação",
    },
    {
      icon: Users,
      title: "Compromisso",
      description: "Comprometidos com o bem-estar e felicidade de cada animal",
    },
    {
      icon: Award,
      title: "Excelência",
      description: "Buscamos sempre oferecer o melhor serviço possível",
    },
    {
      icon: Sparkles,
      title: "Transparência",
      description: "Comunicação clara e honesta com todos nossos clientes",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Nossa História
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Uma jornada construída com amor, dedicação e paixão por cuidar de pets
          </p>
        </div>

        {/* Story Content */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-8 pb-8 space-y-6 text-lg text-muted-foreground">
              <p>
                O <span className="text-primary font-semibold">Colinho da Ca</span> nasceu de um sonho: criar um espaço onde pets pudessem receber o mesmo amor e cuidado que recebem em suas próprias casas.
              </p>
              <p>
                Começamos pequenos, mas com um grande coração. Cada pet que passa por aqui deixa sua marca em nossa história e nos ensina algo novo sobre amor incondicional e dedicação.
              </p>
              <p>
                Ao longo dos anos, crescemos não apenas em estrutura, mas principalmente em experiência e conhecimento. Cada dia é uma oportunidade de fazer a diferença na vida de um pet e trazer tranquilidade para seus tutores.
              </p>
              <p>
                Hoje, somos mais do que um serviço de cuidados para pets. Somos uma família que entende a importância desses pequenos seres em nossas vidas e trabalhamos incansavelmente para garantir que cada um deles seja tratado com o respeito e carinho que merece.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nossos Valores
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl mb-2">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SobreHistoria;
