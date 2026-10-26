"use client";

import { useEffect, useRef, useState } from "react";

/* The process, fixed: the band pins while you scroll, and scrolling drives
   the story. A tangled six-step process with MANUAL steps (work queues up,
   rework loops bounce items back) gets fixed one step at a time: each step
   flips to AUTOMATED, its queue drains, its loop disappears, and the whole
   flow speeds up and straightens into a clean pipeline. Illustrative, not
   a claim about any client. Canvas 2D for the flow, HTML for type. Runs
   only while on screen; reduced motion gets the finished state, static. */

const STEPS = ["Request", "Review", "Approve", "Execute", "Record", "Report"];
const LAST = STEPS.length - 1;
// Tangled starting layouts (normalized), wide and phone.
const MESSY_WIDE = [[0.12, 0.66], [0.6, 0.28], [0.3, 0.74], [0.82, 0.62], [0.47, 0.24], [0.88, 0.22]];
const MESSY_TALL = [[0.3, 0.1], [0.72, 0.24], [0.26, 0.38], [0.7, 0.5], [0.32, 0.62], [0.68, 0.72]];
// Rework loops: items leaving step [from] get sent back to step [to].
const REWORK = [[2, 1], [4, 2], [5, 3]];
const FIX_START = 0.14;
const FIX_STEP = 0.11; // one fix lands every 11% of the scroll
const FIX_LEN = 0.07;

const ICE = "rgb(232, 238, 246)";
const BLUE = "rgb(91, 155, 232)";
const NIGHT = "#0b1220";
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const fixOf = (p: number, k: number) => clamp01((p - FIX_START - k * FIX_STEP) / FIX_LEN);

type Item = { u: number; wait: number };

export default function ProcessStory() {
  const outerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState({ fixed: 0, done: false });

  useEffect(() => {
    const outer = outerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!outer || !canvas || !ctx) return;
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

    // Node positions: tangled -> clean as the overall fix progresses.
    const nodes = (e: number) =>
      STEPS.map((_, i) => {
        const [mx, my] = (tall ? MESSY_TALL : MESSY_WIDE)[i];
        const cxn = tall ? 0.5 : 0.1 + (i * 0.8) / LAST;
        const cyn = tall ? 0.08 + (i * 0.64) / LAST : 0.5;
        return [(mx + (cxn - mx) * e) * W, (my + (cyn - my) * e) * H] as const;
      });

    const items: Item[] = Array.from({ length: 26 }, (_, i) => ({ u: (i / 26) * LAST, wait: 0 }));

    const progress = () => {
      const r = outer.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      return span > 0 ? clamp01(-r.top / span) : 1;
    };

    let last = performance.now();
    let shownFixed = -1, shownDone = false;

    const frame = (now: number, p: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      const fixes = STEPS.map((_, k) => fixOf(p, k));
      const auto = fixes.reduce((a, b) => a + b, 0) / STEPS.length;
      const e = ease(clamp01((p - FIX_START) / (FIX_STEP * LAST + FIX_LEN)));
      const pts = nodes(e);

      // Push stage changes to React only when they actually change.
      const fixed = fixes.filter((f) => f >= 0.5).length;
      const done = fixed === STEPS.length;
      if (fixed !== shownFixed || done !== shownDone) {
        shownFixed = fixed;
        shownDone = done;
        setStage({ fixed, done });
      }

      ctx.clearRect(0, 0, W, H);

      // Rework loops: dashed arcs that fade as their step gets fixed.
      ctx.setLineDash([4, 7]);
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = ICE;
      for (const [from, to] of REWORK) {
        const a = 0.32 * (1 - fixes[from]);
        if (a <= 0.01) continue;
        const [x1, y1] = pts[from], [x2, y2] = pts[to];
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        const bend = tall ? [Math.max(x1, x2) + 70, (y1 + y2) / 2] : [(x1 + x2) / 2, Math.min(y1, y2) - 70];
        ctx.quadraticCurveTo(bend[0], bend[1], x2, y2);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Pipeline segments: dim and broken when manual, solid blue when fixed.
      for (let k = 0; k < LAST; k++) {
        const f = Math.min(fixes[k], fixes[k + 1]);
        ctx.globalAlpha = 0.3 + 0.7 * f;
        ctx.strokeStyle = f > 0.5 ? BLUE : ICE;
        ctx.lineWidth = 1.3 + f * 1.4;
        ctx.setLineDash(f >= 1 ? [] : [10, 6 * (1 - f) + 0.01]);
        ctx.beginPath();
        ctx.moveTo(pts[k][0], pts[k][1]);
        ctx.lineTo(pts[k + 1][0], pts[k + 1][1]);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      // Work items: crawl and queue at manual steps, stream through fixed ones.
      if (!reduced) {
        const speed = 0.00045 + auto * 0.0011;
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
            it.wait = 700 * (1 - fx) + Math.random() * 300 * (1 - fx);
            const loop = REWORK.find(([from]) => from === after);
            if (loop && Math.random() < 0.35 * (1 - fx)) it.u = loop[1];
          }
          if (it.u >= LAST) it.u = 0;
        }
      }
      const queued = new Array(STEPS.length).fill(0);
      for (const it of items) {
        const k = Math.floor(it.u), fr = it.u - k;
        let x: number, y: number;
        if (it.wait > 0 || k >= LAST) {
          // Waiting: stack beside the step it is stuck at.
          const q = queued[Math.min(k, LAST)]++;
          const [nx, ny] = pts[Math.min(k, LAST)];
          x = tall ? nx - 20 - (q % 3) * 9 : nx - 10 + (q % 3) * 9;
          y = tall ? ny - 4 + Math.floor(q / 3) * 9 : ny + 22 + Math.floor(q / 3) * 9;
        } else {
          x = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * fr;
          y = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * fr;
        }
        const f = fixes[Math.min(k, LAST)];
        ctx.fillStyle = f > 0.5 ? BLUE : ICE;
        ctx.globalAlpha = 0.55 + 0.45 * f;
        ctx.fillRect(x - 3, y - 3, 6, 6);
      }
      ctx.globalAlpha = 1;

      // Steps: node, MANUAL -> AUTOMATED tag, name.
      ctx.textAlign = "center";
      for (let k = 0; k <= LAST; k++) {
        const [x, y] = pts[k];
        const f = fixes[k];
        if (f > 0 && f < 1) {
          // The moment of the fix: a quick blue pulse.
          ctx.globalAlpha = 0.5 * Math.sin(f * Math.PI);
          ctx.fillStyle = BLUE;
          ctx.beginPath();
          ctx.arc(x, y, 14 + f * 26, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        ctx.fillStyle = NIGHT;
        ctx.strokeStyle = f > 0.5 ? BLUE : "rgba(232, 238, 246, 0.45)";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (f > 0.5) {
          ctx.fillStyle = BLUE;
          ctx.beginPath();
          ctx.arc(x, y, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
        const tx = tall ? x + 22 : x;
        ctx.textAlign = tall ? "left" : "center";
        ctx.font = `500 10px ${mono}`;
        ctx.fillStyle = f > 0.5 ? BLUE : "rgba(232, 238, 246, 0.45)";
        ctx.fillText(f > 0.5 ? "AUTOMATED" : "MANUAL", tx, tall ? y - 6 : y - 20);
        ctx.font = `500 11px ${mono}`;
        ctx.fillStyle = "rgba(232, 238, 246, 0.7)";
        ctx.fillText(STEPS[k].toUpperCase(), tx, tall ? y + 9 : y + (f > 0.5 ? 30 : 58));
      }
    };

    if (reduced) {
      frame(performance.now(), 1);
      const ro = new ResizeObserver(() => {
        resize();
        frame(performance.now(), 1);
      });
      ro.observe(canvas);
      return () => ro.disconnect();
    }

    let visible = false, raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || document.documentElement.dataset.intro) {
        last = now;
        return;
      }
      frame(now, progress());
    };
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(outer);
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
    ? "Fixed: every handoff runs itself"
    : stage.fixed === 0
      ? "Today: manual handoffs, rework, waiting"
      : `Fix ${String(stage.fixed).padStart(2, "0")} / ${STEPS[stage.fixed - 1]} automated`;

  return (
    <section ref={outerRef} aria-label="How a process gets fixed" className="relative h-[260vh] bg-night">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div aria-hidden className="absolute inset-x-0 top-0 z-10 h-[2px] bg-signal shadow-glow" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-24 lg:px-12 lg:pt-28">
          <p className="font-mono text-label uppercase text-[#5B9BE8]">The process, fixed</p>
          <h2 className="type-semi-extended mt-4 max-w-[22ch] text-h2 uppercase text-void">
            {stage.done ? "The manual work is gone." : "Small fixes. One step at a time."}
          </h2>
          <p className="mt-3 font-mono text-label uppercase text-void/55" aria-live="polite">
            {caption}
          </p>
        </div>
        <canvas ref={canvasRef} aria-hidden className="absolute inset-x-0 bottom-0 top-[30%] h-[70%] w-full" />
        <div className="absolute inset-x-0 bottom-8 z-10 mx-auto flex max-w-7xl gap-10 px-6 font-mono uppercase lg:px-12">
          <div>
            <p className="type-extended text-[clamp(1.75rem,3.5vw,3rem)] leading-none text-void">
              {STEPS.length - stage.fixed}
            </p>
            <p className="mt-2 text-label text-void/50">Manual steps</p>
          </div>
          <div>
            <p className="type-extended text-[clamp(1.75rem,3.5vw,3rem)] leading-none text-void">
              {REWORK.filter(([from]) => from >= stage.fixed).length}
            </p>
            <p className="mt-2 text-label text-void/50">Rework loops</p>
          </div>
        </div>
      </div>
    </section>
  );
}
