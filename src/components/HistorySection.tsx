import { Calendar, TrendingUp, Users, Award } from "lucide-react";

const HistorySection = () => {
  const milestones = [
    {
      icon: Calendar,
      year: "2009",
      title: "Fundação",
      description: "Iniciamos nossa jornada com uma visão clara de excelência",
    },
    {
      icon: Users,
      year: "2015",
      title: "Expansão",
      description: "Crescimento da equipe e abertura de novas filiais",
    },
    {
      icon: TrendingUp,
      year: "2020",
      title: "Inovação",
      description: "Implementação de metodologias ágeis e transformação digital",
    },
    {
      icon: Award,
      year: "2024",
      title: "Reconhecimento",
      description: "Prêmios nacionais e internacionais de excelência",
    },
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-background to-muted/20">
      <div className="container-custom">
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold">
            Muitos Anos de História
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Uma trajetória marcada por crescimento sustentável, inovação
            constante e resultados extraordinários para nossos clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className="relative group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300 card-hover">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <milestone.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-highlight mb-2">
                  {milestone.year}
                </div>
                <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                <p className="text-muted-foreground">{milestone.description}</p>
              </div>

              {/* Connecting Line (hidden on last item) */}
              {index < milestones.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HistorySection;
