import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ClientCarousel from "@/components/ClientCarousel";
import HistorySection from "@/components/HistorySection";
import CaseCard from "@/components/CaseCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const featuredCases = [
    {
      title: "Transformação Digital no Varejo",
      category: "Varejo",
      description:
        "Implementação de estratégia omnichannel que revolucionou a experiência do cliente e aumentou significativamente as vendas online.",
      results: "Aumento de 150% nas vendas online em 6 meses",
    },
    {
      title: "Otimização de Processos Industriais",
      category: "Indústria",
      description:
        "Redesenho completo dos processos operacionais utilizando metodologia Lean Six Sigma para maximizar eficiência e reduzir custos.",
      results: "Redução de 40% nos custos operacionais",
    },
    {
      title: "Estratégia de Expansão Internacional",
      category: "Tecnologia",
      description:
        "Planejamento e execução de entrada em novos mercados internacionais, incluindo análise de viabilidade e adaptação cultural.",
      results: "Expansão bem-sucedida para 5 novos países",
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
            <Button
              size="lg"
              className="btn-primary rounded-full px-8 group"
            >
              Ver Todos os Cases
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
