import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { name: "Home", path: "/" },
    { name: "Sobre Nós", path: "/about" },
    { name: "Cases", path: "/cases" },
    { name: "Soluções", path: "/solutions" },
    { name: "Nosso Time", path: "/team" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo da Instituição Parceira */}
          <div className="space-y-4">
            <div className="text-xl font-bold">
              Instituição<span className="text-accent">.</span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Parceiro oficial desde 2020
            </p>
          </div>

          {/* Informações da Empresa */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações</h3>
            <div className="space-y-3 text-sm text-primary-foreground/80">
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>
                  Av. Paulista, 1000<br />
                  São Paulo, SP - 01310-100
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>(11) 3000-0000</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>contato@consultoria.com.br</span>
              </div>
              <p className="pt-2">CNPJ: 00.000.000/0001-00</p>
            </div>
          </div>

          {/* Navegação */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Navegação</h3>
            <ul className="space-y-2 text-sm">
              {navigationLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes Sociais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Redes Sociais</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent transition-colors flex items-center justify-center group"
                >
                  <social.icon className="h-5 w-5 text-primary-foreground group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 text-center text-sm text-primary-foreground/60">
          <p>© {currentYear} Consultoria. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
