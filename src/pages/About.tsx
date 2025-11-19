import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";

const About = () => {
  const values = [
    "Excelência em tudo que fazemos",
    "Inovação contínua",
    "Integridade e transparência",
    "Foco no cliente",
    "Colaboração e trabalho em equipe",
    "Responsabilidade social",
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground">
              Sobre Nós
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90">
              Uma história de excelência, inovação e compromisso com o sucesso
              dos nossos clientes.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Nossa História
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Fundada em 2009, nossa consultoria nasceu da visão de
                profissionais experientes que acreditavam no poder da estratégia
                bem executada para transformar negócios. Ao longo dos anos,
                crescemos de uma pequena equipe para uma das principais
                consultorias do país.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nossa trajetória é marcada por projetos desafiadores, clientes
                satisfeitos e resultados que superam expectativas. Trabalhamos
                com empresas de diversos portes e setores, sempre com o mesmo
                compromisso: entregar excelência e gerar valor real.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Hoje, somos reconhecidos como referência em consultoria
                estratégica, transformação digital e otimização de processos,
                com uma equipe multidisciplinar de especialistas prontos para
                enfrentar os desafios mais complexos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="section-padding bg-muted/20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 rounded-2xl bg-card shadow-sm animate-fade-in">
              <h3 className="text-2xl font-bold mb-4 text-primary">
                Nossa Missão
              </h3>
              <p className="text-muted-foreground">
                Transformar desafios empresariais em oportunidades de
                crescimento, através de soluções estratégicas inovadoras e
                resultados mensuráveis.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card shadow-sm animate-fade-in" style={{ animationDelay: "100ms" }}>
              <h3 className="text-2xl font-bold mb-4 text-primary">
                Nossa Visão
              </h3>
              <p className="text-muted-foreground">
                Ser reconhecida como a consultoria mais confiável e inovadora da
                América Latina, referência em transformação empresarial.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card shadow-sm animate-fade-in" style={{ animationDelay: "200ms" }}>
              <h3 className="text-2xl font-bold mb-4 text-primary">
                Nossos Princípios
              </h3>
              <p className="text-muted-foreground">
                Guiados por ética, excelência e inovação, construímos relações
                duradouras baseadas em confiança e resultados.
              </p>
            </div>
          </div>

          {/* Values List */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-center">
              Nossos Valores
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-lg bg-card animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0" />
                  <span className="text-lg">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
