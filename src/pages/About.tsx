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
      <section className="pt-32 pb-24 bg-gradient-to-br from-primary via-primary/95 to-primary/90">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="flex items-center justify-center gap-4 font-mono text-xs uppercase tracking-[0.3em] text-primary-foreground/70">
              <span className="h-px w-12 bg-primary-foreground/40" />
              <span>Quem somos</span>
              <span className="h-px w-12 bg-primary-foreground/40" />
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-normal text-primary-foreground leading-[1.05]">
              Sobre a <em className="italic text-highlight">CASE EJ</em>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
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
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                <span className="h-px w-10 bg-border" />
                <span>Nossa trajetória</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-normal mb-8 leading-[1.1]">
                Nossa <em className="italic text-highlight">História</em>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border mb-16">
            <div className="p-8 bg-card animate-fade-in">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">01 / Missão</div>
              <h3 className="font-serif text-3xl font-normal mb-4 text-primary">
                Nossa Missão
              </h3>
              <p className="text-muted-foreground">
                Formar profissionais capacitados através da vivência empresarial, 
                oferecendo soluções de consultoria e assessoria de qualidade para 
                pequenos empreendedores da região de Macaé.
              </p>
            </div>

            <div className="p-8 bg-card animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">02 / Visão</div>
              <h3 className="font-serif text-3xl font-normal mb-4 text-primary">
                Nossa Visão
              </h3>
              <p className="text-muted-foreground">
                Ser reconhecida como a principal empresa júnior multidisciplinar 
                de Macaé, referência em desenvolvimento de talentos e impacto 
                social através do empreendedorismo.
              </p>
            </div>

            <div className="p-8 bg-card animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">03 / Princípios</div>
              <h3 className="font-serif text-3xl font-normal mb-4 text-primary">
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
            <div className="flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
              <span className="h-px w-10 bg-border" />
              <span>Princípios que nos guiam</span>
              <span className="h-px w-10 bg-border" />
            </div>
            <h3 className="font-serif text-4xl md:text-5xl font-normal mb-10 text-center leading-[1.1]">
              Nossos <em className="italic text-highlight">Valores</em>
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
