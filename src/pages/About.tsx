import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";

const About = () => {
  const values = [
    "Liderança e trabalho em equipe",
    "Gestão empresarial na prática",
    "Responsabilidade, ética e visão estratégica",
    "Aprendizado além da sala de aula",
    "Compromisso com resultados",
    "Inovação e criatividade",
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary via-primary/95 to-primary/90">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground">
              Sobre a CASE EJ
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90">
              A primeira empresa júnior multidisciplinar de Macaé, formando 
              profissionais através da experiência prática.
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
                A CASE EJ surgiu a partir da necessidade de experiência prática 
                para estudantes universitários de Macaé. Somos a <strong>primeira 
                empresa júnior multidisciplinar da cidade</strong>, criada por 
                estudantes universitários com apoio de professor orientador.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Desde nossa fundação, oferecemos serviços voltados para 
                <strong> consultoria e assessoria empresarial</strong>, com foco em 
                pequenos empreendedores locais. Nossos primeiros projetos foram 
                desenvolvidos junto à comunidade empresarial de Macaé, gerando 
                impacto real e aprendizado significativo para nossos membros.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Acreditamos que o aprendizado vai muito além da sala de aula. 
                Através da CASE EJ, nossos membros desenvolvem habilidades 
                essenciais como liderança, trabalho em equipe, gestão empresarial 
                na prática, responsabilidade, ética e visão estratégica — 
                competências que os preparam para os desafios do mercado de trabalho.
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
                Formar profissionais capacitados através da vivência empresarial, 
                oferecendo soluções de consultoria e assessoria de qualidade para 
                pequenos empreendedores da região de Macaé.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card shadow-sm animate-fade-in" style={{ animationDelay: "100ms" }}>
              <h3 className="text-2xl font-bold mb-4 text-primary">
                Nossa Visão
              </h3>
              <p className="text-muted-foreground">
                Ser reconhecida como a principal empresa júnior multidisciplinar 
                de Macaé, referência em desenvolvimento de talentos e impacto 
                social através do empreendedorismo.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-card shadow-sm animate-fade-in" style={{ animationDelay: "200ms" }}>
              <h3 className="text-2xl font-bold mb-4 text-primary">
                Nossos Princípios
              </h3>
              <p className="text-muted-foreground">
                Guiados por ética, responsabilidade e visão estratégica, 
                construímos aprendizado prático que transforma estudantes em 
                profissionais preparados para o mercado.
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
