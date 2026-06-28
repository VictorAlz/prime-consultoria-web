import { useEffect, useRef } from "react";

/**
 * Neo4j-style graph view background.
 * Nodes drift slowly and form edges. When the mouse moves over the header,
 * it acts as a virtual node — repelling/attracting nearby nodes and creating
 * highlighted edges between the cursor and its closest neighbors.
 */
const HeaderGraphBackground = () => {
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
    const mouse = { x: -9999, y: -9999, active: false };

    const isMobile = () => window.innerWidth < 768;
    const isTouch = () =>
      typeof window !== "undefined" &&
      (("ontouchstart" in window) || (navigator.maxTouchPoints ?? 0) > 0);

    const seedNodes = () => {
      const count = isMobile() ? 55 : 140;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        r: Math.random() * 1.8 + 1.2,
        pink: Math.random() < 0.22,
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

    const onMove = (e: MouseEvent) => {
      if (isTouch()) return; // ignore pointer interaction on touch devices
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = mouse.x >= 0 && mouse.x <= width && mouse.y >= 0 && mouse.y <= height;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };
    if (!isTouch()) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseout", onLeave);
    }

    const accent = "160, 235, 255";    // brighter cyan
    const highlight = "255, 130, 170"; // brighter pink
    const white = "255, 255, 255";
    const linkDist = () => (isMobile() ? 130 : 180);
    const mouseRadius = () => (isMobile() ? 130 : 200);
    const NEAREST_K = 3; // always connect each node to its K nearest neighbors → "second brain"

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Apply mouse repulsion + drift
      const mr = mouseRadius();
      for (const n of nodes) {
        if (mouse.active) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mr && dist > 0.001) {
            const force = (1 - dist / mr) * 0.6;
            n.vx += (dx / dist) * force * 0.07;
            n.vy += (dy / dist) * force * 0.07;
          }
        }
        // friction
        n.vx *= 0.97;
        n.vy *= 0.97;
        // baseline drift to keep things alive
        n.vx += (Math.random() - 0.5) * 0.025;
        n.vy += (Math.random() - 0.5) * 0.025;
        // clamp top speed (lower on mobile to avoid jitter)
        const sp = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        const maxSp = isMobile() ? 0.45 : 0.9;
        if (sp > maxSp) { n.vx = (n.vx / sp) * maxSp; n.vy = (n.vy / sp) * maxSp; }

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0) { n.x = 0; n.vx *= -1; }
        if (n.x > width) { n.x = width; n.vx *= -1; }
        if (n.y < 0) { n.y = 0; n.vy *= -1; }
        if (n.y > height) { n.y = height; n.vy *= -1; }
      }

      // Edges node↔node (distance-based web)
      const max = linkDist();
      // Track distances for nearest-K pass
      const dists: number[][] = nodes.map(() => []);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          dists[i].push(dist); dists[j].push(dist);
          if (dist < max) {
            const alpha = (1 - dist / max) * 0.55;
            const color = a.pink || b.pink ? highlight : accent;
            ctx.strokeStyle = `rgba(${color}, ${alpha})`;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Nearest-K edges — guarantees a continuously connected "second brain"
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const pairs: { j: number; d: number }[] = [];
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const dx = a.x - nodes[j].x;
          const dy = a.y - nodes[j].y;
          pairs.push({ j, d: Math.sqrt(dx * dx + dy * dy) });
        }
        pairs.sort((p, q) => p.d - q.d);
        for (let k = 0; k < NEAREST_K && k < pairs.length; k++) {
          const b = nodes[pairs[k].j];
          const color = a.pink || b.pink ? highlight : accent;
          ctx.strokeStyle = `rgba(${color}, 0.35)`;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Edges mouse↔nodes (graphview highlight)
      if (mouse.active) {
        for (const n of nodes) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mr) {
            const alpha = (1 - dist / mr) * 0.85;
            ctx.strokeStyle = `rgba(${white}, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
          }
        }
      }

      // Nodes (glow + core)
      for (const n of nodes) {
        const color = n.pink ? highlight : accent;
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 7);
        grad.addColorStop(0, `rgba(${color}, 0.75)`);
        grad.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${white}, 1)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Mouse node
      if (mouse.active) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 18);
        grad.addColorStop(0, `rgba(${white}, 0.9)`);
        grad.addColorStop(1, `rgba(${white}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 18, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${white}, 1)`;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block opacity-95" />
    </div>
  );
};

export default HeaderGraphBackground;