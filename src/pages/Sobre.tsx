import { Link } from "react-router-dom";
import { Book, MessageCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Sobre = () => {
  const aboutSections = [
    {
      icon: Book,
      title: "Nossa História",
      description: "Conheça a trajetória que nos trouxe até aqui e nossos valores",
      path: "/sobre/historia",
      color: "from-primary to-accent",
    },
    {
      icon: MessageCircle,
      title: "Contato",
      description: "Entre em contato conosco e tire suas dúvidas",
      path: "/sobre/contato",
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
            Sobre o Colinho da Ca
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Dedicados a proporcionar carinho, segurança e bem-estar para seu melhor amigo
          </p>
        </div>

        {/* About Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {aboutSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card
                key={section.path}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50"
              >
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{section.title}</CardTitle>
                  <CardDescription className="text-base">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={section.path}>
                    <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
                      Explorar
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Mission Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">Nossa Missão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-lg text-muted-foreground">
                No <span className="text-primary font-semibold">Colinho da Ca</span>, acreditamos que cada pet merece ser tratado com amor, respeito e dedicação.
              </p>
              <p className="text-lg text-muted-foreground">
                Nossa missão é proporcionar um ambiente acolhedor onde seu companheiro se sinta seguro, feliz e amado como se estivesse em casa.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Sobre;
