import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import ContactDialog from "@/components/ContactDialog";

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rafId = 0;

    type Node = { x: number; y: number; vx: number; vy: number; r: number; pink: boolean };
    let nodes: Node[] = [];

    const isMobile = () => window.innerWidth < 768;

    const seedNodes = () => {
      const count = isMobile() ? 22 : 55;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 1.2,
        pink: Math.random() < 0.18,
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedNodes();
    };

    resize();
    window.addEventListener("resize", resize);

    const accent = "117, 218, 246"; // #75DAF6
    const highlight = "215, 83, 115"; // #D75373
    const linkDist = () => (isMobile() ? 110 : 150);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Move nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      // Edges
      const max = linkDist();
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < max) {
            const alpha = (1 - dist / max) * 0.35;
            const color = a.pink || b.pink ? highlight : accent;
            ctx.strokeStyle = `rgba(${color}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Nodes (with glow)
      for (const n of nodes) {
        const color = n.pink ? highlight : accent;
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6);
        grad.addColorStop(0, `rgba(${color}, 0.6)`);
        grad.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${color}, 0.95)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

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
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-primary/85" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 pt-28 sm:pt-32 pb-16 sm:pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 animate-fade-in">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight">
            Suas ideias em
            <span className="block mt-2 bg-gradient-to-r from-accent via-highlight to-accent bg-clip-text text-transparent">
              soluções digitais reais
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Desenvolvemos sites, web apps e automações com inteligência artificial
            para transformar o seu negócio.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-6 sm:pt-8 w-full">
            <ContactDialog
              trigger={
                <Button
                  size="lg"
                  className="btn-highlight rounded-full text-sm sm:text-base md:text-lg px-6 sm:px-8 py-5 sm:py-6 group w-full sm:w-auto"
                >
                  Fale com um Especialista
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              }
            />
            <Link to="/cases" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="btn-highlight rounded-full text-sm sm:text-base md:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto"
              >
                Conheça Nossos Cases
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 pt-12 sm:pt-16 max-w-4xl mx-auto">
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
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-primary-foreground/80">
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
