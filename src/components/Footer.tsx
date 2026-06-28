import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";
import femassLogo from "@/assets/femass-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { name: "Home", path: "/" },
    { name: "Sobre Nós", path: "/sobre" },
    { name: "Cases", path: "/cases" },
    { name: "Soluções", path: "/solucoes" },
    { name: "Nosso Time", path: "/equipe" },
    { name: "Área Membros", path: "/admin/login" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/CASEEmpresaJr/?locale=pt_BR", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/caseempresajunior/", label: "Instagram" },
    { icon: Linkedin, href: "linkedin.com/company/case-empresa-júnior?originalSubdomain=br", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom pt-20 md:pt-28 pb-10">
        {/* Manchete editorial */}
        <div className="mb-16 md:mb-24 max-w-5xl">
          <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-accent flex items-center gap-3 mb-6">
            <span className="inline-block h-px w-8 bg-accent/60" />
            Vamos conversar
          </div>
          <h2 className="font-serif uppercase text-primary-foreground leading-[0.95] tracking-tight text-4xl md:text-6xl lg:text-7xl font-normal">
            Pronto para<br />
            <em className="not-italic text-accent">construir</em> algo?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-primary-foreground/10 border border-primary-foreground/10">
          {/* Instituição Parceira */}
          <div className="bg-primary p-8 space-y-6">
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary-foreground/60">
              Instituição
            </div>
            <img src={femassLogo} alt="FeMASS" className="h-16 w-auto" />
            <p className="font-mono text-xs text-primary-foreground/70 tracking-wide">
              Faculdade Prof. Miguel Ângelo da Silva Santos
            </p>
          </div>

          {/* Informações */}
          <div className="bg-primary p-8 space-y-6">
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-accent">
              Contato
            </div>
            <div className="space-y-4 font-mono text-xs text-primary-foreground/80 tracking-wide leading-relaxed">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-accent" strokeWidth={1.25} />
                <span>
                  Av. Aluizio da Silva Gomes, 50<br />
                  Granja dos Cavaleiros<br />
                  Macaé — RJ, 27930-560
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-accent" strokeWidth={1.25} />
                <span>+55 (22) 99946-4910</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-accent" strokeWidth={1.25} />
                <span>+55 (22) 99944-3332</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-accent" strokeWidth={1.25} />
                <span>contato@caseej.com</span>
              </div>
              <div className="pt-2 text-[10px] tracking-[0.2em] uppercase text-primary-foreground/50">
                CNPJ 26.676.739/0001-01
              </div>
            </div>
          </div>

          {/* Navegação */}
          <div className="bg-primary p-8 space-y-6">
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-accent">
              Navegação
            </div>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-mono text-xs uppercase tracking-[0.18em] text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes Sociais */}
          <div className="bg-primary p-8 space-y-6">
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-accent">
              Social
            </div>
            <div className="flex flex-col gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  <social.icon className="h-4 w-4" strokeWidth={1.25} />
                  <span>{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary-foreground/50">
            © {currentYear} CASE Empresa Júnior
          </p>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary-foreground/50">
            Desde 2012 · FeMASS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
