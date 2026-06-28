import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ClientCarousel from "@/components/ClientCarousel";
import HistorySection from "@/components/HistorySection";
import CaseCard from "@/components/CaseCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import casePetroleoVerde from "@/assets/cases/case-petroleo-verde.jpg";
import caseContainers from "@/assets/cases/case-containers.jpg";
import caseChatbot from "@/assets/cases/case-chatbot.jpg";

const Index = () => {
  const featuredCases = [
    {
      title: "Plataforma Educacional Petróleo Verde",
      category: "Web App",
      description:
        "Desenvolvimento de plataforma educacional focada na capacitação profissional no setor de óleo e gás, com trilhas de aprendizado, certificações e acompanhamento de progresso dos alunos.",
      results: "Mais de 1.500 profissionais capacitados em 8 meses",
      image: casePetroleoVerde,
    },
    {
      title: "Sistema de Conferência de Containers",
      category: "Logística",
      description:
        "Sistema inteligente para conferência e rastreamento de containers em operações logísticas, automatizando o controle de cargas, reduzindo erros e otimizando o fluxo portuário.",
      results: "Redução de 70% no tempo de conferência por container",
      image: caseContainers,
    },
    {
      title: "Chatbot de Atendimento com IA",
      category: "Automação IA",
      description:
        "Implementação de assistente virtual inteligente para atendimento 24/7, reduzindo tempo de resposta e custos operacionais.",
      results: "80% das dúvidas resolvidas automaticamente",
      image: caseChatbot,
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ClientCarousel />
      <HistorySection />

      {/* Cases em Destaque */}
      <section className="section-padding bg-background border-t border-border">
        <div className="container-custom">
          <div className="mb-16 md:mb-24 max-w-5xl animate-fade-in">
            <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-highlight flex items-center gap-3 mb-6">
              <span className="inline-block h-px w-8 bg-highlight/60" />
              Projetos selecionados
            </div>
            <h2 className="font-serif uppercase text-foreground leading-[0.95] tracking-tight text-4xl md:text-6xl lg:text-7xl font-normal mb-8">
              Cases de<br />
              <em className="not-italic text-highlight">sucesso</em>.
            </h2>
            <p className="font-mono text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed tracking-wide">
              Conheça alguns dos projetos que transformaram negócios e geraram
              resultados excepcionais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {featuredCases.map((caseItem, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CaseCard {...caseItem} />
              </div>
            ))}
          </div>

          <div className="animate-fade-in border-t border-border pt-10">
            <Link to="/cases">
              <Button
                size="lg"
                className="rounded-none font-mono text-xs tracking-[0.2em] uppercase px-7 py-6 bg-primary text-primary-foreground hover:bg-primary/90 group"
              >
                Ver todos os cases
                <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
