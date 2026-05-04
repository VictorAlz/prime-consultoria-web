import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ContactDialog from "@/components/ContactDialog";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90">
      {/* Futuristic Network Background (Obsidian-like graph) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(var(--accent) / 0.35) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Animated network of nodes + edges */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1200 800"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.9" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="nodeGlowPink" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(var(--highlight))" stopOpacity="0.9" />
              <stop offset="100%" stopColor="hsl(var(--highlight))" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Edges */}
          <g stroke="hsl(var(--accent))" strokeOpacity="0.35" strokeWidth="1">
            <line x1="120" y1="180" x2="320" y2="260" />
            <line x1="320" y1="260" x2="540" y2="160" />
            <line x1="540" y1="160" x2="760" y2="280" />
            <line x1="760" y1="280" x2="980" y2="200" />
            <line x1="320" y1="260" x2="420" y2="480" />
            <line x1="420" y1="480" x2="640" y2="540" />
            <line x1="640" y1="540" x2="860" y2="460" />
            <line x1="860" y1="460" x2="1060" y2="600" />
            <line x1="180" y1="620" x2="420" y2="480" />
            <line x1="180" y1="620" x2="380" y2="700" />
            <line x1="640" y1="540" x2="760" y2="280" />
            <line x1="540" y1="160" x2="420" y2="480" />
            <line x1="980" y1="200" x2="1060" y2="600" />
            <line x1="120" y1="180" x2="60" y2="420" />
            <line x1="60" y1="420" x2="180" y2="620" />
          </g>

          {/* Glow nodes */}
          {[
            { cx: 120, cy: 180, r: 40, fill: "url(#nodeGlow)" },
            { cx: 540, cy: 160, r: 50, fill: "url(#nodeGlowPink)" },
            { cx: 980, cy: 200, r: 45, fill: "url(#nodeGlow)" },
            { cx: 420, cy: 480, r: 60, fill: "url(#nodeGlowPink)" },
            { cx: 860, cy: 460, r: 50, fill: "url(#nodeGlow)" },
            { cx: 180, cy: 620, r: 45, fill: "url(#nodeGlow)" },
            { cx: 1060, cy: 600, r: 55, fill: "url(#nodeGlowPink)" },
          ].map((n, i) => (
            <circle key={`g-${i}`} cx={n.cx} cy={n.cy} r={n.r} fill={n.fill} />
          ))}

          {/* Solid nodes */}
          <g>
            {[
              { cx: 120, cy: 180, r: 4, c: "accent" },
              { cx: 320, cy: 260, r: 3, c: "accent" },
              { cx: 540, cy: 160, r: 5, c: "highlight" },
              { cx: 760, cy: 280, r: 3, c: "accent" },
              { cx: 980, cy: 200, r: 4, c: "accent" },
              { cx: 60, cy: 420, r: 3, c: "accent" },
              { cx: 420, cy: 480, r: 6, c: "highlight" },
              { cx: 640, cy: 540, r: 4, c: "accent" },
              { cx: 860, cy: 460, r: 5, c: "accent" },
              { cx: 180, cy: 620, r: 4, c: "accent" },
              { cx: 380, cy: 700, r: 3, c: "accent" },
              { cx: 1060, cy: 600, r: 5, c: "highlight" },
            ].map((n, i) => (
              <circle
                key={`n-${i}`}
                cx={n.cx}
                cy={n.cy}
                r={n.r}
                fill={`hsl(var(--${n.c}))`}
                className="animate-pulse"
                style={{ animationDelay: `${(i % 5) * 0.4}s` }}
              />
            ))}
          </g>
        </svg>

        {/* Soft overlay to keep text legible */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-primary/85" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight">
            Suas ideias em
            <span className="block mt-2 bg-gradient-to-r from-accent via-highlight to-accent bg-clip-text text-transparent">
              soluções digitais reais
            </span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Desenvolvemos sites, web apps e automações com inteligência artificial
            para transformar o seu negócio.
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
            <Link to="/cases">
              <Button
                size="lg"
                className="btn-highlight rounded-full text-base md:text-lg px-8 py-6"
              >
                Conheça Nossos Cases
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pt-16 max-w-4xl mx-auto">
            {[
              { number: "3+", label: "Anos de Atuação" },
              { number: "50+", label: "Projetos Entregues" },
              { number: "30+", label: "Clientes Atendidos" },
              { number: "100%", label: "Comprometimento" },
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
