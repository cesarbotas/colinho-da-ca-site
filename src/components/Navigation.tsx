import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

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

  const toggleDropdown = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Colinho da Ca
            </h1>
          </Link>

          {/* Desktop Menu */}
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
                
                {/* Dropdown */}
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
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
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
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
