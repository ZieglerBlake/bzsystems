"use client";

import { useEffect, useRef } from "react";

/* FIG.01 — the company artifact. A slowly rotating wireframe core:
   outer cube, inner cube, one blue signal ring. Canvas 2D, no deps.
   Static frame under prefers-reduced-motion. Decorative (aria-hidden). */

const INK = "16, 19, 18";
const SIGNAL = "#1E70CD";

type V3 = [number, number, number];

const CUBE: V3[] = [
  [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
  [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
];

const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
];

export default function CoreArtifact() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let inView = true;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function project(v: V3, angle: number, scale: number) {
      const tilt = 0.45;
      // rotate Y
      let x = v[0] * Math.cos(angle) + v[2] * Math.sin(angle);
      let z = -v[0] * Math.sin(angle) + v[2] * Math.cos(angle);
      // rotate X (tilt)
      let y = v[1] * Math.cos(tilt) - z * Math.sin(tilt);
      z = v[1] * Math.sin(tilt) + z * Math.cos(tilt);
      const f = 4.2;
      const p = f / (f - z);
      return { x: w / 2 + x * p * scale, y: h / 2 + y * p * scale };
    }

    function drawCube(angle: number, size: number, alpha: number) {
      const pts = CUBE.map((v) => project(v, angle, size));
      ctx!.strokeStyle = `rgba(${INK}, ${alpha})`;
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      for (const [a, b] of EDGES) {
        ctx!.moveTo(pts[a].x, pts[a].y);
        ctx!.lineTo(pts[b].x, pts[b].y);
      }
      ctx!.stroke();
      // vertex dots
      ctx!.fillStyle = `rgba(${INK}, ${alpha + 0.15})`;
      for (const p of pts) {
        ctx!.fillRect(p.x - 1, p.y - 1, 2, 2);
      }
    }

    function render(t: number) {
      ctx!.clearRect(0, 0, w, h);
      const base = Math.min(w, h);
      const angle = reduced ? 0.7 : t * 0.00028;
      const size = base * 0.19;

      // dashed orbit
      ctx!.strokeStyle = `rgba(${INK}, 0.14)`;
      ctx!.setLineDash([2, 7]);
      ctx!.beginPath();
      ctx!.arc(w / 2, h / 2, base * 0.4, 0, Math.PI * 2);
      ctx!.stroke();
      ctx!.setLineDash([]);

      // crosshair ticks
      ctx!.strokeStyle = `rgba(${INK}, 0.35)`;
      ctx!.beginPath();
      for (const [ax, ay, bx, by] of [
        [w / 2 - base * 0.47, h / 2, w / 2 - base * 0.42, h / 2],
        [w / 2 + base * 0.42, h / 2, w / 2 + base * 0.47, h / 2],
        [w / 2, h / 2 - base * 0.47, w / 2, h / 2 - base * 0.42],
        [w / 2, h / 2 + base * 0.42, w / 2, h / 2 + base * 0.47],
      ]) {
        ctx!.moveTo(ax, ay);
        ctx!.lineTo(bx, by);
      }
      ctx!.stroke();

      drawCube(angle, size, 0.38);
      drawCube(-angle * 1.6, size * 0.52, 0.22);

      // signal ring — tilted circle through the core
      const ringPts: { x: number; y: number }[] = [];
      for (let i = 0; i <= 64; i++) {
        const a = (i / 64) * Math.PI * 2;
        const v: V3 = [Math.cos(a) * 1.45, Math.sin(a) * 0.16, Math.sin(a) * 1.45];
        ringPts.push(project(v, angle * 0.7, size));
      }
      ctx!.strokeStyle = SIGNAL;
      ctx!.globalAlpha = 0.75;
      ctx!.beginPath();
      ringPts.forEach((p, i) => (i === 0 ? ctx!.moveTo(p.x, p.y) : ctx!.lineTo(p.x, p.y)));
      ctx!.stroke();
      ctx!.globalAlpha = 1;

      // signal packet on the ring
      if (!reduced) {
        const pi = Math.floor(((t * 0.012) % 64 + 64) % 64);
        const pp = ringPts[pi];
        ctx!.fillStyle = SIGNAL;
        ctx!.beginPath();
        ctx!.arc(pp.x, pp.y, 2.4, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function loop(t: number) {
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
      if (!running) render(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    io.observe(canvas);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    resize();
    render(performance.now());
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="h-full w-full" />;
}
