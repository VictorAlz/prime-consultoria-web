import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import ContactDialog from "@/components/ContactDialog";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Consultoria profissional"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight">
            Transformando desafios em
            <span className="block mt-2 bg-gradient-to-r from-accent via-highlight to-accent bg-clip-text text-transparent">
              oportunidades de sucesso
            </span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Consultoria estratégica de alto nível para empresas que buscam
            excelência, inovação e resultados transformadores.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <ContactDialog
              trigger={
                <Button
                  size="lg"
                  className="btn-highlight rounded-full text-base md:text-lg px-8 py-6 group"
                >
                  Fale com um Especialista
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              }
            />
            <Button
              size="lg"
              className="btn-highlight rounded-full text-base md:text-lg px-8 py-6"
            >
              Conheça Nossos Cases
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pt-16 max-w-4xl mx-auto">
            {[
              { number: "15+", label: "Anos de Experiência" },
              { number: "500+", label: "Projetos Entregues" },
              { number: "100+", label: "Clientes Satisfeitos" },
              { number: "98%", label: "Taxa de Sucesso" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center space-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl md:text-4xl font-bold text-accent">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-primary-foreground/80">
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
