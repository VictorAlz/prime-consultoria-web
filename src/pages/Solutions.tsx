import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SolutionCard from "@/components/SolutionCard";
import {
  Globe,
  Smartphone,
  Bot,
  Code,
  Palette,
  Zap,
} from "lucide-react";

const Solutions = () => {
  const solutions = [
    {
      icon: Globe,
      title: "Sites Institucionais",
      description:
        "Desenvolvimento de sites modernos e responsivos que transmitem a identidade da sua marca e atraem novos clientes.",
    },
    {
      icon: Smartphone,
      title: "Web Apps",
      description:
        "Criação de aplicações web completas e personalizadas para resolver problemas específicos do seu negócio.",
    },
    {
      icon: Bot,
      title: "Automações com IA",
      description:
        "Implementação de soluções inteligentes com inteligência artificial para automatizar processos e aumentar a produtividade.",
    },
    {
      icon: Palette,
      title: "Landing Pages",
      description:
        "Páginas de alta conversão otimizadas para campanhas de marketing e captação de leads.",
    },
    {
      icon: Code,
      title: "Sistemas Personalizados",
      description:
        "Desenvolvimento de sistemas sob medida para gestão, controle e automação de processos internos.",
    },
    {
      icon: Zap,
      title: "Integrações e APIs",
      description:
        "Conexão entre diferentes sistemas e plataformas para otimizar fluxos de trabalho e centralizar informações.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground">
              Nossos Serviços
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90">
              Desenvolvemos soluções digitais sob medida para transformar suas
              ideias em produtos reais. Sites, aplicações web e automações com
              inteligência artificial.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <SolutionCard {...solution} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold">
              Tem um Projeto em Mente?
            </h2>
            <p className="text-lg text-muted-foreground">
              Conte-nos sua ideia e transformaremos em realidade. Desenvolvemos
              soluções com qualidade e preço acessível.
            </p>
            <button className="btn-highlight rounded-full px-8 py-4 text-lg font-medium inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
              Solicitar Orçamento Gratuito
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Solutions;
