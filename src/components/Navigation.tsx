import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/api";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const userData = authService.getUserData();
  const primeiroNome = userData?.nome?.split(' ')[0] || '';
  const isAdmin = authService.isAdmin();
  const isCliente = authService.isCliente();

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  const menuItems = [
    {
      title: "Serviços",
      path: "/servicos",
      submenu: [
        { title: "Cuidados Especiais", path: "/servicos/cuidados" },
        { title: "Hospedagem", path: "/servicos/hospedagem" },
      ],
    },
    {
      title: "Sobre",
      path: "/sobre",
      submenu: [
        { title: "Nossa História", path: "/sobre/historia" },
        { title: "Contato", path: "/sobre/contato" },
      ],
    },
  ];

  if (isAdmin) {
    menuItems.push({
      title: "Administração",
      path: "/admin",
      submenu: [
        { title: "Clientes", path: "/admin/clientes" },
        { title: "Pets", path: "/admin/pets" },
        { title: "Reservas", path: "/admin/reservas" },
      ],
    });
  }
  
  if (isCliente) {
    menuItems.push({
      title: primeiroNome || "Painel",
      path: "/cadastro",
      submenu: [
        { title: "Meus Dados", path: "/cadastro/dados" },
        { title: "Meus Pets", path: "/cadastro/pets" },
        { title: "Minhas Reservas", path: "/cadastro/reservas" },
      ],
    });
  }

  const toggleDropdown = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Colinho da Ca
            </h1>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <div
                key={item.title}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(item.title)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  to={item.path}
                  className="px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-secondary/50 transition-colors"
                >
                  {item.title}
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </Link>
                
                {openDropdown === item.title && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-card border border-border rounded-lg shadow-lg py-2 animate-in fade-in slide-in-from-top-2">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.path}
                        to={subitem.path}
                        className={`block px-4 py-2 hover:bg-secondary/50 transition-colors ${
                          location.pathname === subitem.path ? "bg-secondary text-primary font-medium" : ""
                        }`}
                      >
                        {subitem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {!isAuthenticated ? (
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 animate-in slide-in-from-top-4">
            {menuItems.map((item) => (
              <div key={item.title} className="mb-2">
                <button
                  onClick={() => toggleDropdown(item.title)}
                  className="w-full px-4 py-2 flex items-center justify-between hover:bg-secondary/50 rounded-lg transition-colors"
                >
                  {item.title}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openDropdown === item.title ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openDropdown === item.title && (
                  <div className="pl-4 mt-1 space-y-1">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.path}
                        to={subitem.path}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-2 rounded-lg hover:bg-secondary/50 transition-colors ${
                          location.pathname === subitem.path ? "bg-secondary text-primary font-medium" : ""
                        }`}
                      >
                        {subitem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {!isAuthenticated ? (
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="w-full mt-2">
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full mt-2">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
