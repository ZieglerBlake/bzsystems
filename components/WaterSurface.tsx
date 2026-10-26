"use client";

import { useEffect, useRef } from "react";

/* Water surface over the hero map. A low-res height field (2D wave
   equation) shaded as blue caustics and upscaled by the browser, so it
   reads as liquid and costs almost nothing. Drops land on their own; the
   cursor drags ripples through it and a click lands a big drop. Pauses
   offscreen or tab-hidden; absent under prefers-reduced-motion.
   Decorative only (aria-hidden, pointer-events-none). */

const CELL = 6; // CSS px per simulation cell
const DAMPING = 0.986;
const SHADE = 0.006; // slope -> opacity
const MAX_ALPHA = 110;

export default function WaterSurface() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cols = 2;
    let rows = 2;
    let cur = new Float32Array(4);
    let prev = new Float32Array(4);
    let img = ctx.createImageData(2, 2);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      cols = Math.max(2, Math.ceil(r.width / CELL));
      rows = Math.max(2, Math.ceil(r.height / CELL));
      canvas.width = cols;
      canvas.height = rows;
      cur = new Float32Array(cols * rows);
      prev = new Float32Array(cols * rows);
      img = ctx.createImageData(cols, rows);
    };

    const drop = (cx: number, cy: number, radius: number, strength: number) => {
      const x0 = Math.round(cx);
      const y0 = Math.round(cy);
      const r2 = radius * radius + 1;
      for (let y = -radius; y <= radius; y++) {
        for (let x = -radius; x <= radius; x++) {
          const d2 = x * x + y * y;
          if (d2 > radius * radius) continue;
          const px = x0 + x;
          const py = y0 + y;
          if (px < 1 || py < 1 || px >= cols - 1 || py >= rows - 1) continue;
          cur[py * cols + px] += strength * (1 - d2 / r2);
        }
      }
    };

    const step = () => {
      for (let y = 1; y < rows - 1; y++) {
        const row = y * cols;
        for (let x = 1; x < cols - 1; x++) {
          const i = row + x;
          prev[i] =
            ((cur[i - 1] + cur[i + 1] + cur[i - cols] + cur[i + cols]) * 0.5 -
              prev[i]) *
            DAMPING;
        }
      }
      const t = cur;
      cur = prev;
      prev = t;
    };

    const render = () => {
      const d = img.data;
      for (let y = 1; y < rows - 1; y++) {
        for (let x = 1; x < cols - 1; x++) {
          const i = y * cols + x;
          const s = cur[i - 1] - cur[i + 1] + (cur[i - cols] - cur[i + cols]);
          const o = i * 4;
          if (s > 0) {
            d[o] = 91; d[o + 1] = 155; d[o + 2] = 232; // #5B9BE8 crest
          } else {
            d[o] = 30; d[o + 1] = 112; d[o + 2] = 205; // #1E70CD trough
          }
          d[o + 3] = Math.min(1, Math.abs(s) * SHADE) * MAX_ALPHA;
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    // Cursor wakes and click drops, mapped from viewport to grid cells.
    let lastX = -1;
    let lastY = -1;
    const toCell = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / CELL;
      const y = (e.clientY - r.top) / CELL;
      return x >= 0 && y >= 0 && x < cols && y < rows ? { x, y } : null;
    };
    const onMove = (e: PointerEvent) => {
      const c = toCell(e);
      if (!c) return;
      if (Math.hypot(c.x - lastX, c.y - lastY) < 1.5) return;
      lastX = c.x;
      lastY = c.y;
      drop(c.x, c.y, 2, 30);
    };
    const onDown = (e: PointerEvent) => {
      const c = toCell(e);
      if (c) drop(c.x, c.y, 4, 220);
    };

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let raf = 0;
    let nextDrop = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      if (now >= nextDrop) {
        drop(Math.random() * cols, Math.random() * rows, 3, 85);
        nextDrop = now + 1600 + Math.random() * 2600;
      }
      step();
      render();
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
