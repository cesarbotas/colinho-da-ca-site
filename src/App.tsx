import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Servicos from "./pages/Servicos";
import Sobre from "./pages/Sobre";
import ServicoCuidados from "./pages/ServicoCuidados";
import ServicoHospedagem from "./pages/ServicoHospedagem";
import Cadastro from "./pages/Cadastro";
import CadastroCliente from "./pages/CadastroCliente";
import CadastroPets from "./pages/CadastroPets";
import SobreHistoria from "./pages/SobreHistoria";
import SobreContato from "./pages/SobreContato";
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
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/cadastro/cliente" element={<CadastroCliente />} />
          <Route path="/cadastro/pets" element={<CadastroPets />} />
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
