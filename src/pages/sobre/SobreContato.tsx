import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { API_BASE_URL } from "@/lib/api";

const SobreContato = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    celular: "",
    assunto: "",
    mensagem: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/sobre/enviar-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Erro ao enviar mensagem");
      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
      setFormData({ nome: "", email: "", celular: "", assunto: "", mensagem: "" });
    } catch (error) {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefone",
      content: "(11) 99999-9999",
    },
    {
      icon: Mail,
      title: "Email",
      content: "colinhodaca@gmail.com",
    },
    {
      icon: MapPin,
      title: "Endereço",
      content: "Santos, SP",
    },
    {
      icon: Clock,
      title: "Horário",
      content: "Seg-Sex: 8h-18h | Sáb: 9h-14h",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Entre em Contato
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Estamos prontos para responder suas dúvidas e ajudar você a cuidar melhor do seu pet
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Envie sua Mensagem</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium mb-2">
                    Nome
                  </label>
                  <Input
                    id="nome"
                    placeholder="Seu nome completo"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="celular" className="block text-sm font-medium mb-2">
                    Celular
                  </label>
                  <Input
                    id="celular"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.celular}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="assunto" className="block text-sm font-medium mb-2">
                    Assunto
                  </label>
                  <Input
                    id="assunto"
                    placeholder="Assunto da mensagem"
                    value={formData.assunto}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="mensagem" className="block text-sm font-medium mb-2">
                    Mensagem
                  </label>
                  <Textarea
                    id="mensagem"
                    placeholder="Como podemos ajudar?"
                    rows={5}
                    value={formData.mensagem}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  size="lg"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enviar Mensagem
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info) => {
                  const Icon = info.icon;
                  return (
                    <div key={info.title} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{info.title}</h3>
                        <p className="text-muted-foreground">{info.content}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-3">Dúvidas Frequentes?</h3>
                <p className="text-muted-foreground mb-4">
                  Respondemos rapidamente a todas as mensagens. Geralmente em até 24 horas úteis.
                </p>
                <p className="text-muted-foreground">
                  Para urgências, entre em contato por telefone durante nosso horário de atendimento.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SobreContato;
