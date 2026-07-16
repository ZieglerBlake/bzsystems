"use client";

import { useEffect, useRef } from "react";

/* Live system map — the hero's background layer. Canvas 2D, no deps.
   Nodes = ventures orbiting the BZ core; blue packets travel the edges.
   Pauses when offscreen or tab-hidden; renders one static frame under
   prefers-reduced-motion. Purely decorative (aria-hidden); all content
   is HTML layered above. */

type MapNode = {
  label: string;
  tag: string;
  x: number; // normalized 0..1
  y: number;
  core?: boolean;
  faint?: boolean;
  phase: number;
};

/* Nodes are deliberately unnamed: the ventures are not listed here. */
const NODES: MapNode[] = [
  { label: "", tag: "BZ CORE", x: 0.5, y: 0.56, core: true, phase: 0 },
  { label: "", tag: "SYS.01", x: 0.82, y: 0.24, phase: 1.3 },
  { label: "", tag: "SYS.02", x: 0.14, y: 0.3, phase: 2.1 },
  { label: "", tag: "SYS.03", x: 0.8, y: 0.74, phase: 3.4 },
  { label: "", tag: "SYS.04", x: 0.18, y: 0.78, phase: 4.2 },
  { label: "", tag: "SYS.NEXT", x: 0.63, y: 0.1, faint: true, phase: 5.0 },
];

const SIGNAL = "#1E70CD";

export default function SystemMap({
  className = "",
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const INK = variant === "dark" ? "244, 246, 245" : "16, 19, 18";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let inView = true;
    const mouse = { x: -9999, y: -9999 };

    // Packets: one per edge (core -> satellite), staggered.
    const packets = NODES.slice(1).map((_, i) => ({
      edge: i + 1,
      t: (i * 0.23) % 1,
      speed: 0.0016 + (i % 3) * 0.0007,
    }));

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function nodePos(n: MapNode, t: number) {
      const driftX = n.core ? 0 : Math.sin(t * 0.00035 + n.phase) * 9;
      const driftY = n.core ? 0 : Math.cos(t * 0.00028 + n.phase * 1.7) * 7;
      let x = n.x * w + driftX;
      let y = n.y * h + driftY;
      // Cursor gravity — nodes lean gently toward the pointer
      const dx = mouse.x - x;
      const dy = mouse.y - y;
      const dist = Math.hypot(dx, dy);
      if (dist < 260 && dist > 1) {
        const pull = (1 - dist / 260) * 12;
        x += (dx / dist) * pull;
        y += (dy / dist) * pull;
      }
      return { x, y };
    }

    function edgeCtrl(a: { x: number; y: number }, b: { x: number; y: number }, i: number) {
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const sign = i % 2 === 0 ? 1 : -1;
      return { x: mx + (-dy / len) * len * 0.12 * sign, y: my + (dx / len) * len * 0.12 * sign };
    }

    function bezier(a: { x: number; y: number }, c: { x: number; y: number }, b: { x: number; y: number }, t: number) {
      const u = 1 - t;
      return {
        x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
        y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
      };
    }

    function render(t: number) {
      ctx!.clearRect(0, 0, w, h);

      // Dot grid
      ctx!.fillStyle = `rgba(${INK}, 0.09)`;
      const gap = 30;
      for (let gx = gap / 2; gx < w; gx += gap) {
        for (let gy = gap / 2; gy < h; gy += gap) {
          ctx!.fillRect(gx, gy, 1, 1);
        }
      }

      const pos = NODES.map((n) => nodePos(n, t));
      const core = pos[0];

      // Orbit guides around the core — dashed schematic circles
      ctx!.strokeStyle = `rgba(${INK}, 0.06)`;
      ctx!.setLineDash([2, 7]);
      ctx!.lineWidth = 1;
      for (const r of [Math.min(w, h) * 0.22, Math.min(w, h) * 0.38]) {
        ctx!.beginPath();
        ctx!.arc(core.x, core.y, r, 0, Math.PI * 2);
        ctx!.stroke();
      }
      ctx!.setLineDash([]);

      // Edges
      for (let i = 1; i < NODES.length; i++) {
        const cpt = edgeCtrl(core, pos[i], i);
        ctx!.strokeStyle = `rgba(${INK}, ${NODES[i].faint ? 0.05 : 0.1})`;
        if (NODES[i].faint) ctx!.setLineDash([3, 6]);
        ctx!.beginPath();
        ctx!.moveTo(core.x, core.y);
        ctx!.quadraticCurveTo(cpt.x, cpt.y, pos[i].x, pos[i].y);
        ctx!.stroke();
        ctx!.setLineDash([]);
      }

      // Packets with trails
      for (const p of packets) {
        if (NODES[p.edge].faint) continue;
        const cpt = edgeCtrl(core, pos[p.edge], p.edge);
        for (let k = 0; k < 6; k++) {
          const tt = p.t - k * 0.012;
          if (tt < 0 || tt > 1) continue;
          const pt = bezier(core, cpt, pos[p.edge], tt);
          ctx!.fillStyle = k === 0 ? SIGNAL : `rgba(30, 112, 205, ${0.4 - k * 0.065})`;
          ctx!.beginPath();
          ctx!.arc(pt.x, pt.y, k === 0 ? 2.2 : 1.6, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      // Nodes
      ctx!.font = '10px "JetBrains Mono", ui-monospace, monospace';
      for (let i = 0; i < NODES.length; i++) {
        const n = NODES[i];
        const { x, y } = pos[i];
        const alpha = n.faint ? 0.3 : 1;

        // Pulse ring
        if (!reduced) {
          const period = 5200 + n.phase * 700;
          const pt = ((t + n.phase * 1000) % period) / period;
          if (pt < 0.55 && !n.faint) {
            const pr = 8 + pt * 46;
            ctx!.strokeStyle = `rgba(30, 112, 205, ${(0.38 * (1 - pt / 0.55)) * alpha})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.arc(x, y, pr, 0, Math.PI * 2);
            ctx!.stroke();
          }
        }

        // Crosshair ticks
        ctx!.strokeStyle = `rgba(${INK}, ${0.3 * alpha})`;
        ctx!.lineWidth = 1;
        const tick = n.core ? 12 : 8;
        const gapT = n.core ? 7 : 5;
        ctx!.beginPath();
        for (const [ax, ay, bx, by] of [
          [x - tick, y, x - gapT, y],
          [x + gapT, y, x + tick, y],
          [x, y - tick, x, y - gapT],
          [x, y + gapT, x, y + tick],
        ]) {
          ctx!.moveTo(ax, ay);
          ctx!.lineTo(bx, by);
        }
        ctx!.stroke();

        // Ring + core dot
        ctx!.strokeStyle = n.core
          ? `rgba(30, 112, 205, ${0.85 * alpha})`
          : `rgba(${INK}, ${0.45 * alpha})`;
        ctx!.beginPath();
        ctx!.arc(x, y, n.core ? 6.5 : 4.5, 0, Math.PI * 2);
        ctx!.stroke();
        ctx!.fillStyle = n.core ? SIGNAL : `rgba(${INK}, ${0.9 * alpha})`;
        ctx!.beginPath();
        ctx!.arc(x, y, n.core ? 2.6 : 1.8, 0, Math.PI * 2);
        ctx!.fill();

        // Labels + fake coordinates (labels dim on narrow screens where
        // they'd collide with the hero copy; coordinates desktop-only)
        const narrow = w < 640;
        const lx = x + (n.x > 0.6 ? -8 : 8);
        ctx!.textAlign = n.x > 0.6 ? "right" : "left";
        ctx!.fillStyle = `rgba(${INK}, ${(narrow ? 0.22 : 0.5) * alpha})`;
        ctx!.fillText(n.tag, lx, y - 14);
        if (!narrow) {
          ctx!.fillStyle = `rgba(${INK}, ${0.24 * alpha})`;
          ctx!.fillText(
            `${(n.x * 100).toFixed(1)}°N ${(n.y * 100).toFixed(1)}°W`,
            lx,
            y + 22,
          );
        }
      }
    }

    function loop(t: number) {
      for (const p of packets) {
        p.t += p.speed;
        if (p.t > 1.05) p.t = -0.05;
      }
      render(t);
      raf = requestAnimationFrame(loop);
    }

    function start() {
      if (running || reduced || !inView || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced || !running) render(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    io.observe(canvas);

    const onVis = () => (document.hidden ? stop() : start());
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("mousemove", onMouse, { passive: true });

    resize();
    render(performance.now());
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [variant]);

  return <canvas ref={canvasRef} aria-hidden className={`h-full w-full ${className}`} />;
}
