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
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center space-y-4 mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold">Cases de Sucesso</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Conheça alguns dos projetos que transformaram negócios e geraram
              resultados excepcionais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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

          <div className="text-center animate-fade-in">
            <Link to="/cases">
              <Button
                size="lg"
                className="btn-primary rounded-full px-8 group"
              >
                Ver Todos os Cases
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
