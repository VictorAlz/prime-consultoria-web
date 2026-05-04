import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CaseCard from "@/components/CaseCard";
import { Button } from "@/components/ui/button";

const Cases = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const categories = ["Todos", "Web App", "Logística", "Site", "Automação IA"];

  const allCases = [
    {
      title: "Plataforma Educacional Petróleo Verde",
      category: "Web App",
      description:
        "Desenvolvimento de plataforma educacional focada na capacitação profissional no setor de óleo e gás, com trilhas de aprendizado, certificações e acompanhamento de progresso dos alunos.",
      results: "Mais de 1.500 profissionais capacitados em 8 meses",
    },
    {
      title: "Sistema de Conferência de Containers",
      category: "Logística",
      description:
        "Sistema inteligente para conferência e rastreamento de containers em operações logísticas, automatizando o controle de cargas, reduzindo erros e otimizando o fluxo portuário.",
      results: "Redução de 70% no tempo de conferência por container",
    },
  ];

  const filteredCases =
    selectedCategory === "Todos"
      ? allCases
      : allCases.filter((c) => c.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground">
              Cases de Sucesso
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90">
              Conheça os projetos que transformaram negócios e geraram
              resultados extraordinários em diversos setores.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 border-b">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "btn-primary rounded-full"
                    : "rounded-full"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCases.map((caseItem, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CaseCard {...caseItem} />
              </div>
            ))}
          </div>

          {filteredCases.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                Nenhum case encontrado nesta categoria.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cases;
