import { Calendar, TrendingUp, Users, Award } from "lucide-react";

const HistorySection = () => {
  const milestones = [
    {
      icon: Calendar,
      year: "2015",
      title: "Fundação",
      description: "Abertura do CNPJ e criação do estatuto da empresa",
    },
    {
      icon: Users,
      year: "2018",
      title: "Impacto Social",
      description: "Primeiros projetos de impacto social na comunidade",
    },
    {
      icon: TrendingUp,
      year: "2020",
      title: "Federação",
      description: "Federação no meio da pandemia e primeiro ENEJ da CASE",
    },
    {
      icon: Award,
      year: "2023",
      title: "Prêmio Nestlé",
      description: "Reconhecimento pelo Prêmio Nestlé de impacto social",
    },
    {
      icon: TrendingUp,
      year: "2024",
      title: "Reestruturação",
      description: "Reestruturação interna, novos desafios e meta do ano batida",
    },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="mb-16 md:mb-24 max-w-5xl animate-fade-in">
          <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-highlight flex items-center gap-3 mb-6">
            <span className="inline-block h-px w-8 bg-highlight/60" />
            Desde 2012
          </div>
          <h2 className="font-serif uppercase text-foreground leading-[0.95] tracking-tight text-4xl md:text-6xl lg:text-7xl font-normal mb-8">
            Muitos anos<br />
            de <em className="not-italic text-highlight">história</em>.
          </h2>
          <p className="font-mono text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed tracking-wide">
            Uma trajetória marcada por crescimento sustentável, inovação
            constante e resultados extraordinários para nossos clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px bg-border border border-border">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className="relative group bg-background p-8 animate-fade-in hover:bg-muted/30 transition-colors duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <milestone.icon className="h-6 w-6 text-highlight mb-8" strokeWidth={1.25} />
              <div className="font-serif text-5xl md:text-6xl text-foreground leading-none mb-4">
                {milestone.year}
              </div>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-highlight mb-3">
                {milestone.title}
              </div>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                {milestone.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HistorySection;
