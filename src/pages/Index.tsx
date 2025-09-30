import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Home, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20">
        <div className="text-center max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-in">
            Colinho da Ca
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Um cantinho especial onde seu pet recebe todo amor, carinho e cuidado que merece
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/servicos">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 group">
                Conheça Nossos Serviços
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/sobre/contato">
              <Button size="lg" variant="outline" className="border-2 hover:bg-secondary">
                Fale Conosco
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            O que oferecemos
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Cuidados Especiais</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Atenção individualizada com muito carinho e dedicação para garantir o bem-estar do seu pet
                </p>
                <Link to="/servicos/cuidados">
                  <Button variant="outline" className="group/btn border-2">
                    Saiba Mais
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-accent/50">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Hospedagem</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Um lar temporário acolhedor e seguro onde seu melhor amigo se sente em casa
                </p>
                <Link to="/servicos/hospedagem">
                  <Button variant="outline" className="group/btn border-2">
                    Saiba Mais
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
            <CardContent className="pt-12 pb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pronto para conhecer nosso trabalho?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Entre em contato conosco e descubra como podemos cuidar do seu companheiro com todo amor e dedicação que ele merece
              </p>
              <Link to="/sobre/contato">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  Agendar uma Visita
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
