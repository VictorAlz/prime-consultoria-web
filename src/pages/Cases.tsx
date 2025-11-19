import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CaseCard from "@/components/CaseCard";
import { Button } from "@/components/ui/button";

const Cases = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const categories = ["Todos", "Varejo", "Indústria", "Tecnologia", "Financeiro", "Saúde"];

  const allCases = [
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
    {
      title: "Modernização Bancária Digital",
      category: "Financeiro",
      description:
        "Transformação completa da experiência digital, implementação de open banking e desenvolvimento de novos produtos financeiros.",
      results: "95% de satisfação dos clientes digitais",
    },
    {
      title: "Sistema de Gestão Hospitalar",
      category: "Saúde",
      description:
        "Implementação de plataforma integrada para gestão de pacientes, prontuários eletrônicos e otimização de recursos hospitalares.",
      results: "Redução de 30% no tempo de atendimento",
    },
    {
      title: "E-commerce de Nova Geração",
      category: "Varejo",
      description:
        "Criação de plataforma de e-commerce com IA para recomendações personalizadas e experiência de compra diferenciada.",
      results: "Aumento de 200% na taxa de conversão",
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
