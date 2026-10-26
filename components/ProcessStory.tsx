"use client";

import { useEffect, useRef, useState } from "react";

/* The process, fixed. A six-step process starts MANUAL (work queues up,
   two rework loops bounce items back); when the section comes into view
   the fixes land one step at a time on their own (no scroll pinning):
   each step turns blue, its queue drains, its loop fades, and the line
   straightens. Then it holds the fixed pipeline with work flowing.
   Replay restarts it. Illustrative, not a claim about any client.
   Canvas 2D for the flow, HTML for type. Runs only while on screen;
   reduced motion gets the finished state, static. */

const STEPS = ["Request", "Review", "Approve", "Execute", "Record", "Report"];
const LAST = STEPS.length - 1;
// Gentle zigzag that straightens as fixes land (offsets as a share of height).
const ZIG = [0.16, -0.14, 0.12, -0.16, 0.14, -0.1];
// Rework loops: items leaving step [from] get sent back to step [to].
const REWORK = [[2, 1], [4, 3]];
const LEAD_MS = 500; // pause before the first fix
const FIX_MS = 750; // one fix lands every 750ms

const INK = "rgb(16, 19, 18)";
const FAINT = "rgba(16, 19, 18, 0.32)";
const BLUE = "rgb(30, 112, 205)"; // signal
const PANEL = "#ffffff";
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

type Item = { u: number; wait: number };

export default function ProcessStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const replayRef = useRef<() => void>(() => {});
  const [stage, setStage] = useState({ fixed: 0, done: false });

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!section || !canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mono =
      getComputedStyle(document.body).getPropertyValue("--font-jetbrains-mono").trim() ||
      "ui-monospace, monospace";

    let W = 0, H = 0, tall = false;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      tall = W < 640;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const nodes = (straight: number) =>
      STEPS.map((_, i) => {
        const off = ZIG[i] * (1 - straight);
        return tall
          ? ([W * (0.42 + off * 0.6), H * (0.07 + (i * 0.86) / LAST)] as const)
          : ([W * (0.07 + (i * 0.86) / LAST), H * (0.46 + off)] as const);
      });

    const items: Item[] = Array.from({ length: 12 }, (_, i) => ({ u: (i / 12) * LAST, wait: 0 }));
    let start = -1; // set when the section first comes into view
    let last = performance.now();
    let shownFixed = -1, shownDone = false;

    const fixesAt = (now: number) =>
      STEPS.map((_, k) =>
        start < 0 ? 0 : clamp01((now - start - LEAD_MS - k * FIX_MS) / (FIX_MS * 0.7)),
      );

    const frame = (now: number, finished = false) => {
      const dt = Math.min(50, now - last);
      last = now;
      const fixes = finished ? STEPS.map(() => 1) : fixesAt(now);
      const auto = fixes.reduce((a, b) => a + b, 0) / STEPS.length;
      const pts = nodes(ease(auto));

      const fixed = fixes.filter((f) => f >= 0.5).length;
      const done = fixed === STEPS.length;
      if (fixed !== shownFixed || done !== shownDone) {
        shownFixed = fixed;
        shownDone = done;
        setStage({ fixed, done });
      }

      ctx.clearRect(0, 0, W, H);

      // Rework loops: dashed arcs that fade as their step gets fixed.
      ctx.setLineDash([5, 7]);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = INK;
      for (const [from, to] of REWORK) {
        const a = 0.35 * (1 - fixes[from]);
        if (a <= 0.01) continue;
        const [x1, y1] = pts[from], [x2, y2] = pts[to];
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        if (tall) ctx.quadraticCurveTo(Math.max(x1, x2) + 80, (y1 + y2) / 2, x2, y2);
        else ctx.quadraticCurveTo((x1 + x2) / 2, Math.max(y1, y2) + 80, x2, y2);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Segments: faint and dashed while manual, solid signal blue once fixed.
      for (let k = 0; k < LAST; k++) {
        const f = Math.min(fixes[k], fixes[k + 1]);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = f > 0.5 ? BLUE : FAINT;
        ctx.lineWidth = f > 0.5 ? 3 : 2;
        ctx.setLineDash(f > 0.5 ? [] : [8, 6]);
        ctx.beginPath();
        ctx.moveTo(pts[k][0], pts[k][1]);
        ctx.lineTo(pts[k + 1][0], pts[k + 1][1]);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Work items: queue at manual steps, stream through fixed ones.
      if (!reduced) {
        const speed = 0.0004 + auto * 0.0009;
        for (const it of items) {
          if (it.wait > 0) {
            it.wait -= dt;
            continue;
          }
          const before = Math.floor(it.u);
          it.u += speed * dt;
          const after = Math.floor(it.u);
          if (after !== before && after <= LAST) {
            const fx = fixes[after];
            it.wait = 900 * (1 - fx);
            const loop = REWORK.find(([from]) => from === after);
            if (loop && Math.random() < 0.4 * (1 - fx)) it.u = loop[1];
          }
          if (it.u >= LAST) it.u = 0;
        }
      }
      const queued = new Array(STEPS.length).fill(0);
      for (const it of items) {
        const k = Math.min(Math.floor(it.u), LAST), fr = it.u - Math.floor(it.u);
        let x: number, y: number;
        if (it.wait > 0 || k >= LAST) {
          const q = queued[k]++;
          const [nx, ny] = pts[k];
          x = tall ? nx - 26 - q * 10 : nx - 10 + q * 10;
          y = tall ? ny : ny + 28;
        } else {
          x = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * fr;
          y = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * fr;
        }
        ctx.fillStyle = fixes[k] > 0.5 ? BLUE : INK;
        ctx.globalAlpha = fixes[k] > 0.5 ? 0.9 : 0.4;
        ctx.fillRect(x - 3.5, y - 3.5, 7, 7);
      }
      ctx.globalAlpha = 1;

      // Steps: hollow ink ring while manual, filled signal blue once fixed.
      ctx.font = `500 12px ${mono}`;
      for (let k = 0; k <= LAST; k++) {
        const [x, y] = pts[k];
        const f = fixes[k];
        if (f > 0 && f < 1) {
          ctx.globalAlpha = 0.35 * Math.sin(f * Math.PI);
          ctx.fillStyle = BLUE;
          ctx.beginPath();
          ctx.arc(x, y, 16 + f * 22, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, Math.PI * 2);
        ctx.fillStyle = f > 0.5 ? BLUE : PANEL;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = f > 0.5 ? BLUE : FAINT;
        ctx.stroke();
        ctx.fillStyle = f > 0.5 ? INK : "rgba(16, 19, 18, 0.55)";
        ctx.textAlign = tall ? "left" : "center";
        ctx.fillText(STEPS[k].toUpperCase(), tall ? x + 24 : x, tall ? y + 4 : y - 24);
      }
    };

    if (reduced) {
      const draw = () => frame(performance.now(), true);
      draw();
      const ro = new ResizeObserver(() => {
        resize();
        draw();
      });
      ro.observe(canvas);
      return () => ro.disconnect();
    }

    replayRef.current = () => {
      start = performance.now();
      for (const it of items) it.wait = 0;
    };

    let visible = false, raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || document.documentElement.dataset.intro) {
        last = now;
        return;
      }
      frame(now);
    };
    const io = new IntersectionObserver(
      ([en]) => {
        visible = en.isIntersecting;
        if (visible && start < 0) start = performance.now();
      },
      { threshold: 0.35 },
    );
    io.observe(section);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  const caption = stage.done
    ? "Every step automated"
    : stage.fixed === 0
      ? "Today: manual handoffs, rework, waiting"
      : `Fix ${String(stage.fixed).padStart(2, "0")} / ${STEPS[stage.fixed - 1]} automated`;

  return (
    <section ref={sectionRef} aria-label="How a process gets fixed" className="relative overflow-hidden bg-wash">
      <div aria-hidden className="h-[2px] bg-signal shadow-glow" />
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-label uppercase text-signal-bright">The process, fixed</p>
            <h2 className="type-semi-extended mt-4 max-w-[22ch] text-h2 uppercase">
              {stage.done ? "The manual work is gone." : "Small fixes. One step at a time."}
            </h2>
            <p className="mt-3 font-mono text-label uppercase text-ink-dim" aria-live="polite">
              {caption}
            </p>
          </div>
          <button
            type="button"
            onClick={() => replayRef.current()}
            className="rounded-sm border border-line px-4 py-2 font-mono text-label uppercase text-ink-dim transition-colors hover:border-signal hover:text-ink"
          >
            ↻ Replay
          </button>
        </div>
        <canvas ref={canvasRef} aria-hidden className="mt-6 h-[520px] w-full sm:h-[260px] lg:h-[280px]" />
        <div className="mt-4 flex flex-wrap items-end gap-x-10 gap-y-6 font-mono uppercase">
          <div>
            <p className="type-extended text-[clamp(1.75rem,3.5vw,3rem)] leading-none">
              {STEPS.length - stage.fixed}
            </p>
            <p className="mt-2 text-label text-ink-dim">Manual steps</p>
          </div>
          <div>
            <p className="type-extended text-[clamp(1.75rem,3.5vw,3rem)] leading-none">
              {REWORK.filter(([from]) => from >= stage.fixed).length}
            </p>
            <p className="mt-2 text-label text-ink-dim">Rework loops</p>
          </div>
          <div className="ml-auto flex items-center gap-5 text-label text-ink-dim">
            <span className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full border-2 border-ink/30 bg-panel" />
              Manual
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-signal" />
              Automated
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
