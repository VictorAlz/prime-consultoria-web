import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ContactDialog from "@/components/ContactDialog";
import HeaderGraphBackground from "@/components/HeaderGraphBackground";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90">
      {/* Futuristic Animated Network Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(var(--accent) / 0.35) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <HeaderGraphBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-primary/85" />
      </div>

      {/* Content — editorial left-aligned hero */}
      <div className="container-custom relative z-10 pt-32 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-6xl space-y-8 sm:space-y-10 animate-fade-in">
          <div className="font-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase text-accent/90 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-accent/60" />
            Consultoria · Tecnologia · FeMASS
          </div>

          <h1 className="font-serif uppercase text-primary-foreground leading-[0.95] tracking-tight text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[6.5rem] font-normal">
            Ideias que<br />
            viram <em className="not-italic text-accent">software</em><br />
            de verdade.
          </h1>

          <p className="font-mono text-xs sm:text-sm md:text-base text-primary-foreground/80 max-w-xl leading-relaxed tracking-wide">
            Sites, web apps e automações com IA — entregues por uma empresa
            júnior de tecnologia gerenciada por alunos da FeMASS.
          </p>

          <div className="space-y-4 pt-2">
            <div className="font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-primary-foreground/60">
              Comece um projeto
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              <ContactDialog
                trigger={
                  <Button
                    size="lg"
                    className="group bg-background text-primary hover:bg-background/90 rounded-none font-mono text-xs tracking-[0.2em] uppercase px-7 py-6 border border-background"
                  >
                    Fale com um especialista
                    <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                }
              />
              <Link to="/cases">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-none font-mono text-xs tracking-[0.2em] uppercase px-7 py-6 bg-transparent border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  Ver cases
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats — mono ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-primary-foreground/10 border border-primary-foreground/10 mt-14 sm:mt-20">
            {[
              { number: "3+", label: "Anos de atuação" },
              { number: "50+", label: "Projetos entregues" },
              { number: "30+", label: "Clientes atendidos" },
              { number: "100%", label: "Comprometimento" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-primary px-5 py-6 space-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="font-serif text-3xl sm:text-4xl md:text-5xl text-accent leading-none">
                  {stat.number}
                </div>
                <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-primary-foreground/70">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  );
};

export default Hero;
