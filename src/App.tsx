import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth";
import Index from "./pages/Index";
import Servicos from "./pages/servicos/Servicos";
import Sobre from "./pages/sobre/Sobre";
import ServicoCuidados from "./pages/servicos/ServicoCuidados";
import ServicoHospedagem from "./pages/servicos/ServicoHospedagem";
import Cadastro from "./pages/cadastros/Cadastro";
import CadastroCliente from "./pages/cadastros/CadastroCliente";
import CadastroPets from "./pages/cadastros/CadastroPets";
import CadastroReservas from "./pages/cadastros/CadastroReservas";
import SobreHistoria from "./pages/sobre/SobreHistoria";
import SobreContato from "./pages/sobre/SobreContato";
import { Login } from "./pages/auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/servicos/cuidados" element={<ServicoCuidados />} />
          <Route path="/servicos/hospedagem" element={<ServicoHospedagem />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<ProtectedRoute><Cadastro /></ProtectedRoute>} />
          <Route path="/cadastro/cliente" element={<ProtectedRoute><CadastroCliente /></ProtectedRoute>} />
          <Route path="/cadastro/pets" element={<ProtectedRoute><CadastroPets /></ProtectedRoute>} />
          <Route path="/cadastro/reservas" element={<ProtectedRoute><CadastroReservas /></ProtectedRoute>} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/sobre/historia" element={<SobreHistoria />} />
          <Route path="/sobre/contato" element={<SobreContato />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
