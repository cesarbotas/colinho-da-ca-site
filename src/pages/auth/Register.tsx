import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { authService } from "@/lib/api/auth";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ nome: "", email: "", senha: "", cpf: "", celular: "" });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleBlur = (field: string, value: string) => {
    let maskedValue = value;
    
    if (field === "cpf") {
      maskedValue = value.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").slice(0, 14);
    } else if (field === "celular") {
      maskedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3").slice(0, 15);
    }
    
    setFormData({ ...formData, [field]: maskedValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        cpf: formData.cpf?.replace(/\D/g, ""),
        celular: formData.celular?.replace(/\D/g, ""),
      };
      await authService.register(payload);
      toast({ title: "Sucesso!", description: "Usuário registrado com sucesso." });
      navigate("/");
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao registrar usuário.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="p-4">
        <Link to="/" className="inline-block">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Colinho da Ca
          </h1>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Registrar - Colinho da Ca</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                type="text"
                value={formData.cpf}
                onChange={(e) => handleChange("cpf", e.target.value)}
                onBlur={(e) => handleBlur("cpf", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="celular">Celular</Label>
              <Input
                id="celular"
                type="tel"
                value={formData.celular}
                onChange={(e) => handleChange("celular", e.target.value)}
                onBlur={(e) => handleBlur("celular", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Registrar
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              Já tem conta? Fazer login
            </Button>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default Register;
