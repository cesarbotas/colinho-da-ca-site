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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register(formData);
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
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="celular">Celular</Label>
              <Input
                id="celular"
                type="tel"
                value={formData.celular}
                onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
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
