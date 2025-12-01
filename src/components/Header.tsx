import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Sobre Nós", path: "/about" },
    { name: "Cases", path: "/cases" },
    { name: "Soluções", path: "/solutions" },
    { name: "Nosso Time", path: "/team" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-md`}
      style={{ backgroundColor: '#4a2281' }}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center"
            onClick={() => window.scrollTo(0, 0)}
          >
            <img 
              src={logo} 
              alt="CASE - Empresa Júnior" 
              className="h-16 md:h-20 w-auto"
            />
          </Link>

          {/* Menu Button */}
          <button
            className="p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        {isMobileMenuOpen && (
          <div 
            className="absolute top-20 left-0 right-0 border-b shadow-lg animate-fade-in"
            style={{ backgroundColor: '#4a2281' }}
          >
            <div className="flex flex-col space-y-4 p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-medium transition-colors ${
                    isActive(link.path)
                      ? "text-white"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <ContactDialog
                trigger={
                  <Button className="btn-highlight rounded-full w-full">
                    Entre em Contato
                  </Button>
                }
              />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
