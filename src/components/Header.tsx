import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import logoAsset from "@/assets/case-logo-descritivo.png.asset.json";
const logo = logoAsset.url;

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

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Sobre Nós", path: "/sobre" },
    { name: "Cases", path: "/cases" },
    { name: "Soluções", path: "/solucoes" },
    { name: "Nosso Time", path: "/equipe" },
  ];

  const half = Math.ceil(navLinks.length / 2);
  const leftLinks = navLinks.slice(0, half);
  const rightLinks = navLinks.slice(half);

  const linkClass = (path: string) =>
    `font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
      isActive(path) ? "text-white" : "text-white/70 hover:text-white"
    }`;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-md`}
      style={{ backgroundColor: '#4a2281' }}
    >
      <nav className="container-custom">
        {/* Desktop: nav-left | logo center | nav-right */}
        <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center h-20 gap-8">
          <div className="flex items-center justify-start gap-8">
            {leftLinks.map((link) => (
              <Link key={link.path} to={link.path} className={linkClass(link.path)}>
                {link.name}
              </Link>
            ))}
          </div>

          <Link
            to="/"
            className="flex items-center justify-center flex-shrink-0 -my-2"
            onClick={() => window.scrollTo(0, 0)}
          >
            <img
              src={logo}
              alt="CASE - Empresa Júnior"
              className="h-20 md:h-24 w-auto object-contain invert brightness-0 scale-150 origin-center"
            />
          </Link>

          <div className="flex items-center justify-end gap-8">
            {rightLinks.map((link) => (
              <Link key={link.path} to={link.path} className={linkClass(link.path)}>
                {link.name}
              </Link>
            ))}
            <ContactDialog
              trigger={
                <Button className="btn-highlight rounded-full px-6 font-mono text-xs uppercase tracking-[0.18em]">
                  Contato
                </Button>
              }
            />
          </div>
        </div>

        {/* Mobile: logo center, menu button right */}
        <div className="lg:hidden flex items-center justify-between h-20">
          <div className="w-10" />
          <Link
            to="/"
            className="flex items-center flex-shrink-0 -my-2"
            onClick={() => window.scrollTo(0, 0)}
          >
            <img
              src={logo}
              alt="CASE - Empresa Júnior"
              className="h-16 w-auto object-contain invert brightness-0 scale-125 origin-center"
            />
          </Link>
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

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden absolute top-20 left-0 right-0 border-b shadow-lg animate-fade-in"
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
