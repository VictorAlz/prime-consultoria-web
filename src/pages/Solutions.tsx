import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SolutionCard from "@/components/SolutionCard";
import {
  LineChart,
  Target,
  Users,
  Lightbulb,
  Cog,
  TrendingUp,
} from "lucide-react";

const Solutions = () => {
  const solutions = [
    {
      icon: Target,
      title: "Estratégia Empresarial",
      description:
        "Desenvolvimento de estratégias corporativas alinhadas aos objetivos de negócio, análise de mercado e planejamento de longo prazo.",
    },
    {
      icon: LineChart,
      title: "Transformação Digital",
      description:
        "Implementação de tecnologias disruptivas, automação de processos e criação de experiências digitais inovadoras.",
    },
    {
      icon: Cog,
      title: "Otimização de Processos",
      description:
        "Mapeamento, análise e redesenho de processos operacionais para maximizar eficiência e reduzir custos.",
    },
    {
      icon: Users,
      title: "Gestão de Pessoas",
      description:
        "Desenvolvimento de liderança, gestão de talentos, cultura organizacional e programas de capacitação.",
    },
    {
      icon: Lightbulb,
      title: "Inovação e Design Thinking",
      description:
        "Workshops de inovação, prototipagem rápida e implementação de metodologias ágeis para resolução de problemas complexos.",
    },
    {
      icon: TrendingUp,
      title: "Crescimento e Expansão",
      description:
        "Estratégias de crescimento, expansão de mercado, fusões e aquisições, e internacionalização de negócios.",
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
              Nossas Soluções
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90">
              Oferecemos um portfólio completo de serviços de consultoria
              estratégica para impulsionar o crescimento e a transformação do
              seu negócio.
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
              Pronto para Transformar seu Negócio?
            </h2>
            <p className="text-lg text-muted-foreground">
              Entre em contato conosco e descubra como nossas soluções podem
              impulsionar seus resultados.
            </p>
            <button className="btn-highlight rounded-full px-8 py-4 text-lg font-medium inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
              Agendar Consultoria Gratuita
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Solutions;
