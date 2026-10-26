"use client";

import { useEffect, useRef, useState } from "react";

/* The process, fixed. A six-step process starts MANUAL (work queues up,
   two rework loops bounce items back); while the section is on screen the
   fixes land one step at a time on their own (no scroll pinning): each
   step turns blue and reads AUTOMATED, its queue drains, its loop fades,
   and the line straightens. It holds, resets, and loops. Illustrative,
   not a claim about any client.
   Canvas 2D for the flow, HTML for type. Runs only while on screen;
   reduced motion gets the finished state, static. */

const STEPS = ["Request", "Review", "Approve", "Execute", "Record", "Report"];
const LAST = STEPS.length - 1;
// Gentle zigzag that straightens as fixes land (offsets as a share of height).
const ZIG = [0.16, -0.14, 0.12, -0.16, 0.14, -0.1];
// Rework loops: items leaving step [from] get sent back to step [to].
const REWORK = [[2, 1], [4, 3]];
// The story loops while on screen: lead-in, six fixes, hold, quick reset.
const LEAD_MS = 2600; // sit in the current state first
const FIX_MS = 650; // one fix lands every 650ms
const HOLD_MS = 4200; // hold on the future state
const RESET_MS = 600; // everything fades back to manual
const CYCLE = LEAD_MS + FIX_MS * 6 + HOLD_MS + RESET_MS;

const INK = "rgb(16, 19, 18)";
const FAINT = "rgba(16, 19, 18, 0.32)";
const BLUE = "rgb(30, 112, 205)"; // signal
const PANEL = "#ffffff";
const WASH = "rgba(238, 243, 250, 0.92)"; // label backdrop, matches the band
// The line only straightens once every step is fixed, so labels hold still
// while the fixes land.
const ALL_FIXED = LEAD_MS + FIX_MS * 5 + FIX_MS * 0.7;
const STRAIGHTEN_MS = 800;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

type Item = { u: number; wait: number };

export default function ProcessStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

    const stateAt = (now: number) => {
      if (start < 0) return { fixes: STEPS.map(() => 0), straight: 0 };
      const t = (now - start) % CYCLE;
      if (t > CYCLE - RESET_MS) {
        const back = 1 - (t - (CYCLE - RESET_MS)) / RESET_MS;
        return { fixes: STEPS.map(() => back), straight: back };
      }
      return {
        fixes: STEPS.map((_, k) => clamp01((t - LEAD_MS - k * FIX_MS) / (FIX_MS * 0.7))),
        straight: clamp01((t - ALL_FIXED) / STRAIGHTEN_MS),
      };
    };

    const frame = (now: number, finished = false) => {
      const dt = Math.min(50, now - last);
      last = now;
      const { fixes, straight } = finished
        ? { fixes: STEPS.map(() => 1), straight: 1 }
        : stateAt(now);
      const auto = fixes.reduce((a, b) => a + b, 0) / STEPS.length;
      const pts = nodes(ease(straight));

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
          y = tall ? ny : ny + 58;
        } else {
          x = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * fr;
          y = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * fr;
        }
        ctx.fillStyle = fixes[k] > 0.5 ? BLUE : INK;
        ctx.globalAlpha = fixes[k] > 0.5 ? 0.9 : 0.4;
        ctx.fillRect(x - 3.5, y - 3.5, 7, 7);
      }
      ctx.globalAlpha = 1;

      // Labels sit on a small band-colored backdrop so lines and moving
      // items pass behind the text instead of through it.
      const label = (text: string, x: number, y: number, size: number, color: string) => {
        ctx.font = `600 ${size}px ${mono}`;
        const w = ctx.measureText(text).width;
        ctx.fillStyle = WASH;
        ctx.fillRect((tall ? x : x - w / 2) - 4, y - size, w + 8, size + 5);
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
      };

      // Steps: hollow ink ring while manual, filled signal blue once fixed.
      for (let k = 0; k <= LAST; k++) {
        const [x, y] = pts[k];
        const f = fixes[k];
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, Math.PI * 2);
        ctx.fillStyle = f > 0.5 ? BLUE : PANEL;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = f > 0.5 ? BLUE : FAINT;
        ctx.stroke();
        // Step name above the bubble, its status below it.
        ctx.textAlign = tall ? "left" : "center";
        const lx = tall ? x + 24 : x;
        label(STEPS[k].toUpperCase(), lx, tall ? y - 2 : y - 24, 13, f > 0.5 ? INK : "rgba(16, 19, 18, 0.62)");
        label(f > 0.5 ? "AUTOMATED" : "MANUAL", lx, tall ? y + 14 : y + 36, 11, f > 0.5 ? BLUE : "rgba(16, 19, 18, 0.5)");
      }

      // The moment of a fix: an expanding ring, drawn last so labels never clip it.
      ctx.strokeStyle = BLUE;
      ctx.lineWidth = 2;
      for (let k = 0; k <= LAST; k++) {
        const f = fixes[k];
        if (f <= 0 || f >= 1) continue;
        ctx.globalAlpha = 0.6 * Math.sin(f * Math.PI);
        ctx.beginPath();
        ctx.arc(pts[k][0], pts[k][1], 14 + f * 26, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
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
      ? "Handoffs, rework, waiting"
      : `Fix ${String(stage.fixed).padStart(2, "0")} / ${STEPS[stage.fixed - 1]} automated`;

  return (
    <section ref={sectionRef} aria-label="How a process gets fixed" className="relative overflow-hidden bg-wash">
      <div aria-hidden className="h-[2px] bg-signal shadow-glow" />
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-24">
        <div>
          <p className="font-mono text-label uppercase text-signal-bright">The process, fixed</p>
          {/* Current state and future state share one cell and crossfade. */}
          <div className="mt-5 grid">
            {[
              { on: !stage.done, tag: "Current state", line: ["Manual", "and siloed."], tone: "text-ink", tagTone: "text-ink-dim" },
              { on: stage.done, tag: "Future state", line: ["Automated", "and efficient."], tone: "text-signal", tagTone: "text-signal-bright" },
            ].map((s) => (
              <div
                key={s.tag}
                aria-hidden={!s.on}
                className="transition-opacity duration-700 [grid-area:1/1]"
                style={{ opacity: s.on ? 1 : 0 }}
              >
                <p className={`font-mono text-label uppercase ${s.tagTone}`}>
                  {s.tag}
                </p>
                <h2
                  className={`type-extended mt-2 text-display uppercase ${s.tone}`}
                  style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
                >
                  {s.line[0]}
                  <br />
                  {s.line[1]}
                </h2>
              </div>
            ))}
          </div>
          <p className="mt-4 font-mono text-label uppercase text-ink-dim" aria-live="polite">
            {caption}
          </p>
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
        </div>
      </div>
    </section>
  );
}
