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

      {/* Content — editorial left-aligned hero */}
      <div className="container-custom relative z-10 pt-32 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-6xl space-y-8 sm:space-y-10 animate-fade-in">
          <div className="font-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase text-accent/90 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-accent/60" />
            Consultoria · Tecnologia · FeMASS
          </div>

          <h1 className="font-serif uppercase text-primary-foreground leading-[0.95] tracking-tight text-[2.6rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[9rem] font-normal">
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
