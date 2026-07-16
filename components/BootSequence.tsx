"use client";

import { useEffect, useRef, useState } from "react";

/* Entrance: the control room comes online. Grid materializes, crosshairs
   snap in, the registry plots node by node, edges connect, then a blue
   scanline sweeps left-to-right "printing" the real page beneath.
   ~1.6s total. Once per session, skippable on any input, and never
   mounts under prefers-reduced-motion (content is never gated — the
   overlay only exists after hydration). */

const INK = "16, 19, 18";
const FIELD = "247, 248, 246";
const SIGNAL = "#1E70CD";

const NODES = [
  { tag: "LLC", x: 0.5, y: 0.56, core: true },
  { tag: "01", x: 0.14, y: 0.3 },
  { tag: "02", x: 0.82, y: 0.24 },
  { tag: "03", x: 0.8, y: 0.74 },
  { tag: "04", x: 0.18, y: 0.78 },
  { tag: "05", x: 0.63, y: 0.1 },
];

const STATUS_A = "BZ SYSTEMS / INITIALIZING";
const STATUS_B = "BZ SYSTEMS / ALL SYSTEMS NOMINAL";

// Timeline (ms)
const T_GRID = 200;
const T_NODES = 420;
const NODE_GAP = 110;
const T_EDGES = 780;
const T_NOMINAL = 1150;
const T_SWEEP = 1220;
const SWEEP_MS = 380;
const T_END = T_SWEEP + SWEEP_MS;

export default function BootSequence() {
  const [active, setActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem("bz-boot") === "1") return;
    sessionStorage.setItem("bz-boot", "1");
    setActive(true);
  }, []);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let raf = 0;
    let skipTo = 0; // when skipping, fast-forward offset
    const t0 = performance.now();

    const pos = NODES.map((n) => ({ ...n, px: n.x * w, py: n.y * h }));
    const core = pos[0];

    function draw(now: number) {
      const t = now - t0 + skipTo;
      ctx!.clearRect(0, 0, w, h);

      // Field
      ctx!.fillStyle = `rgba(${FIELD}, 1)`;
      ctx!.fillRect(0, 0, w, h);

      // Grid
      const gridA = Math.min(1, t / T_GRID) * 0.09;
      ctx!.fillStyle = `rgba(${INK}, ${gridA})`;
      for (let gx = 15; gx < w; gx += 30) {
        for (let gy = 15; gy < h; gy += 30) {
          ctx!.fillRect(gx, gy, 1, 1);
        }
      }

      // Corner crosshairs snap in after the grid
      if (t > T_GRID) {
        ctx!.strokeStyle = `rgba(${INK}, 0.4)`;
        ctx!.lineWidth = 1;
        const m = 24;
        const L = 14;
        ctx!.beginPath();
        for (const [cx, cy, dx, dy] of [
          [m, m, 1, 1],
          [w - m, m, -1, 1],
          [m, h - m, 1, -1],
          [w - m, h - m, -1, -1],
        ]) {
          ctx!.moveTo(cx, cy);
          ctx!.lineTo(cx + dx * L, cy);
          ctx!.moveTo(cx, cy);
          ctx!.lineTo(cx, cy + dy * L);
        }
        ctx!.stroke();
      }

      // Status line — typed
      ctx!.font = '12px "JetBrains Mono", ui-monospace, monospace';
      ctx!.textAlign = "left";
      const status = t > T_NOMINAL ? STATUS_B : STATUS_A;
      const chars = Math.floor(Math.max(0, t - 120) / 14);
      ctx!.fillStyle = `rgba(${INK}, 0.62)`;
      ctx!.fillText(status.slice(0, chars), 48, Math.max(64, h * 0.14));
      if (chars < status.length || Math.floor(t / 300) % 2 === 0) {
        const tw = ctx!.measureText(status.slice(0, chars)).width;
        ctx!.fillStyle = SIGNAL;
        ctx!.fillRect(50 + tw, Math.max(64, h * 0.14) - 10, 6, 12);
      }

      // Edges draw from core outward
      if (t > T_EDGES) {
        const ep = Math.min(1, (t - T_EDGES) / 320);
        ctx!.strokeStyle = `rgba(${INK}, 0.16)`;
        for (let i = 1; i < pos.length; i++) {
          ctx!.beginPath();
          ctx!.moveTo(core.px, core.py);
          ctx!.lineTo(
            core.px + (pos[i].px - core.px) * ep,
            core.py + (pos[i].py - core.py) * ep,
          );
          ctx!.stroke();
        }
      }

      // Nodes tick in one by one
      for (let i = 0; i < pos.length; i++) {
        const tn = T_NODES + i * NODE_GAP;
        if (t < tn) continue;
        const a = Math.min(1, (t - tn) / 140);
        const n = pos[i];
        ctx!.strokeStyle = n.core
          ? `rgba(30, 112, 205, ${0.9 * a})`
          : `rgba(${INK}, ${0.45 * a})`;
        ctx!.beginPath();
        ctx!.arc(n.px, n.py, n.core ? 6.5 : 4.5, 0, Math.PI * 2);
        ctx!.stroke();
        ctx!.fillStyle = n.core ? SIGNAL : `rgba(${INK}, ${0.9 * a})`;
        ctx!.beginPath();
        ctx!.arc(n.px, n.py, n.core ? 2.6 : 1.8, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.fillStyle = `rgba(${INK}, ${0.5 * a})`;
        ctx!.fillText(n.tag, n.px + 10, n.py - 10);
      }

      // Scanline sweep — clears the overlay, printing the page beneath
      if (t > T_SWEEP) {
        const sp = Math.min(1, (t - T_SWEEP) / SWEEP_MS);
        const sx = sp * (w + 40);
        ctx!.clearRect(0, 0, sx, h);
        ctx!.fillStyle = SIGNAL;
        ctx!.globalAlpha = 1 - sp * 0.3;
        ctx!.fillRect(sx, 0, 1.5, h);
        ctx!.globalAlpha = 1;
      }

      if (t >= T_END) {
        setActive(false);
        return;
      }
      raf = requestAnimationFrame(draw);
    }

    const skip = () => {
      if (skipTo === 0) skipTo = Math.max(0, T_SWEEP - (performance.now() - t0));
    };
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchmove", skip, { passive: true });

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
    };
  }, [active]);

  if (!active) return null;
  return (
    <div className="fixed inset-0 z-50" aria-hidden>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
