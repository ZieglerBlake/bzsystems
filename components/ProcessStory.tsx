"use client";

import { useEffect, useRef, useState } from "react";

/* How we work: two stories in one band that auto-alternate (tabs switch).
   YOUR IDEA, BUILT: a spark at the first stage builds the line stage by
   stage until the product is live and work flows through it.
   YOUR PROCESS, UPGRADED: a manual, siloed six-step process (queues, rework
   loops) gets fixed one step at a time, straightens, then folds from six
   steps to three. Both loop while on screen and never pin the scroll.
   Illustrative, not claims about any client. Canvas 2D for the flow, HTML
   for type. Reduced motion: each story's finished state, static. */

type Mode = "idea" | "process";

const STEPS: Record<Mode, string[]> = {
  idea: ["Idea", "Sketch", "Prototype", "Build", "Launch", "Run"],
  process: ["Request", "Review", "Approve", "Execute", "Record", "Report"],
};
const LAST = 5;
// Gentle zigzag that straightens as fixes land (offsets as a share of height).
const ZIG = [0.16, -0.14, 0.12, -0.16, 0.14, -0.1];
// Rework loops: items leaving step [from] get sent back to step [to].
const REWORK = [[2, 1], [4, 3]];
// After automation, each step folds into its surviving parent.
const MERGE_INTO = [0, 0, 3, 3, 5, 5];
const KEPT = [0, 3, 5];

// Each story loops: lead-in, six steps, hold, quick reset.
const LEAD_MS = 2600; // sit in the starting state first
const STEP_MS = 650; // one step lands every 650ms
const HOLD_MS = 4200; // hold on the finished state
const RESET_MS = 600; // fade back to the start
const CYCLE = LEAD_MS + STEP_MS * 6 + HOLD_MS + RESET_MS;
const ALL_DONE = LEAD_MS + STEP_MS * 5 + STEP_MS * 0.7;
const STRAIGHTEN_MS = 800;
const MERGE_MS = 900;

const INK = "rgb(16, 19, 18)";
const FAINT = "rgba(16, 19, 18, 0.32)";
const BLUE = "rgb(30, 112, 205)"; // signal
const PANEL = "#ffffff";
const WASH = "rgba(238, 243, 250, 0.92)"; // label backdrop, matches the band
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Item = { u: number; wait: number };
type Stage = { mode: Mode; done: number; finished: boolean; merged: boolean };

const COPY: Record<Mode, {
  tab: string;
  start: { tag: string; line: [string, string] };
  end: { tag: string; line: [string, string] };
}> = {
  idea: {
    tab: "Your idea, built",
    start: { tag: "Day one", line: ["An idea", "and a sketch."] },
    end: { tag: "Launch day", line: ["Built", "and running."] },
  },
  process: {
    tab: "Your process, upgraded",
    start: { tag: "Current state", line: ["Manual", "and siloed."] },
    end: { tag: "Future state", line: ["Automated", "and efficient."] },
  },
};

export default function ProcessStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const switchRef = useRef<(m: Mode) => void>(() => {});
  const [stage, setStage] = useState<Stage>({ mode: "idea", done: 0, finished: false, merged: false });

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

    // Positions: evenly spaced line, zigzag offset, and the 3-slot merge.
    const slot = (i: number, of: number) =>
      tall
        ? ([W * 0.42, H * (0.07 + (i * 0.86) / of)] as const)
        : ([W * (0.07 + (i * 0.86) / of), H * 0.46] as const);
    const nodes = (straight: number, merge: number) =>
      [0, 1, 2, 3, 4, 5].map((i) => {
        const [ex, ey] = slot(i, LAST);
        const off = ZIG[i] * (1 - straight);
        const zx = tall ? ex + W * off * 0.6 : ex;
        const zy = tall ? ey : ey + H * off;
        if (merge <= 0) return [zx, zy] as const;
        const [mx, my] = slot(KEPT.indexOf(MERGE_INTO[i]), 2);
        const m = ease(merge);
        return [lerp(zx, mx, m), lerp(zy, my, m)] as const;
      });

    let mode: Mode = "idea";
    const items: Item[] = Array.from({ length: 12 }, (_, i) => ({ u: (i / 12) * LAST, wait: 0 }));
    const resetItems = () => items.forEach((it, i) => ((it.u = (i / 12) * LAST), (it.wait = 0)));
    let start = -1; // set when the section first comes into view
    let last = performance.now();
    let shown = "";

    const stateAt = (t: number, finished: boolean) => {
      if (finished) return { done: STEPS[mode].map(() => 1), straight: 1, merge: mode === "process" ? 1 : 0, head: LAST, settled: 1 };
      if (t > CYCLE - RESET_MS) {
        const r = (t - (CYCLE - RESET_MS)) / RESET_MS;
        return {
          done: STEPS[mode].map(() => 1 - r),
          merge: mode === "process" ? 1 - clamp01(r * 2) : 0,
          straight: mode === "process" ? 1 - clamp01((r - 0.5) * 2) : 1,
          head: LAST * (1 - r),
          settled: 1 - r,
        };
      }
      const soft = mode === "process" ? 0.7 : 0.4;
      return {
        done: STEPS[mode].map((_, k) => clamp01((t - LEAD_MS - k * STEP_MS) / (STEP_MS * soft))),
        straight: mode === "process" ? clamp01((t - ALL_DONE) / STRAIGHTEN_MS) : 1,
        merge: mode === "process" ? clamp01((t - ALL_DONE - STRAIGHTEN_MS) / MERGE_MS) : 0,
        head: Math.min(LAST, Math.max(0, (t - LEAD_MS) / STEP_MS)),
        settled: clamp01((t - ALL_DONE) / 400),
      };
    };

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

    // Point at a fraction s (0..1) of the polyline's length.
    const along = (pts: readonly (readonly [number, number])[], s: number) => {
      const seg: number[] = [];
      let total = 0;
      for (let k = 0; k < LAST; k++) {
        const d = Math.hypot(pts[k + 1][0] - pts[k][0], pts[k + 1][1] - pts[k][1]);
        seg.push(d);
        total += d;
      }
      let d = s * total;
      for (let k = 0; k < LAST; k++) {
        if (d <= seg[k] || k === LAST - 1) {
          const f = seg[k] ? Math.min(1, d / seg[k]) : 0;
          return [lerp(pts[k][0], pts[k + 1][0], f), lerp(pts[k][1], pts[k + 1][1], f)] as const;
        }
        d -= seg[k];
      }
      return pts[LAST];
    };

    const frame = (now: number, finished = false) => {
      const dt = Math.min(50, now - last);
      last = now;
      const t = start < 0 ? 0 : now - start;
      const { done, straight, merge, head, settled } = stateAt(t, finished);
      const steps = STEPS[mode];
      const auto = done.reduce((a, b) => a + b, 0) / 6;
      const pts = nodes(straight, merge);

      const doneCount = done.filter((f) => f >= 0.5).length;
      const next: Stage = { mode, done: doneCount, finished: doneCount === 6, merged: merge >= 0.5 };
      const key = JSON.stringify(next);
      if (key !== shown) {
        shown = key;
        setStage(next);
      }

      ctx.clearRect(0, 0, W, H);

      if (mode === "process") {
        // Rework loops: dashed arcs that fade as their step gets fixed.
        ctx.setLineDash([5, 7]);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = INK;
        for (const [from, to] of REWORK) {
          const a = 0.35 * (1 - done[from]);
          if (a <= 0.01) continue;
          const [x1, y1] = pts[from], [x2, y2] = pts[to];
          ctx.globalAlpha = a;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          if (tall) ctx.quadraticCurveTo(Math.max(x1, x2) + 80, (y1 + y2) / 2, x2, y2);
          else ctx.quadraticCurveTo((x1 + x2) / 2, Math.max(y1, y2) + 80, x2, y2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      // Segments: dashed and faint until done; in the idea story the solid
      // line grows with the build head.
      for (let k = 0; k < LAST; k++) {
        const [x1, y1] = pts[k], [x2, y2] = pts[k + 1];
        const built = mode === "idea" ? clamp01(head - k) : Math.min(done[k], done[k + 1]) > 0.5 ? 1 : 0;
        const bx = lerp(x1, x2, built), by = lerp(y1, y2, built);
        if (built > 0) {
          ctx.setLineDash([]);
          ctx.strokeStyle = BLUE;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
        if (built < 1) {
          ctx.setLineDash([8, 6]);
          ctx.strokeStyle = FAINT;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
      ctx.setLineDash([]);

      // Work items. Process: queue at manual steps, stream through fixed
      // ones. Idea: appear once the product is running.
      if (!reduced && !finished) {
        const speed = mode === "idea" ? 0.0013 : 0.0004 + auto * 0.0009;
        for (const it of items) {
          if (it.wait > 0) {
            it.wait -= dt;
            continue;
          }
          const before = Math.floor(it.u);
          it.u += speed * dt;
          const after = Math.floor(it.u);
          if (mode === "process" && after !== before && after <= LAST) {
            const fx = done[after];
            it.wait = 900 * (1 - fx);
            const loop = REWORK.find(([from]) => from === after);
            if (loop && Math.random() < 0.4 * (1 - fx)) it.u = loop[1];
          }
          if (it.u >= LAST) it.u = 0;
        }
      }
      const itemAlpha = mode === "idea" ? settled : 1;
      if (itemAlpha > 0.01) {
        const queued = new Array(6).fill(0);
        for (const it of items) {
          const k = Math.min(Math.floor(it.u), LAST);
          let x: number, y: number;
          if (mode === "idea" || merge > 0) {
            [x, y] = along(pts, it.u / LAST);
          } else if (it.wait > 0 || k >= LAST) {
            const q = queued[k]++;
            const [nx, ny] = pts[k];
            x = tall ? nx - 26 - q * 10 : nx - 10 + q * 10;
            y = tall ? ny : ny + 58;
          } else {
            const fr = it.u - k;
            x = lerp(pts[k][0], pts[k + 1][0], fr);
            y = lerp(pts[k][1], pts[k + 1][1], fr);
          }
          const on = mode === "idea" || done[k] > 0.5;
          ctx.fillStyle = on ? BLUE : INK;
          ctx.globalAlpha = (on ? 0.9 : 0.4) * itemAlpha;
          ctx.fillRect(x - 3.5, y - 3.5, 7, 7);
        }
        ctx.globalAlpha = 1;
      }

      // The idea spark: glows at the build head while the product is built.
      if (mode === "idea" && settled < 1) {
        const [sx, sy] = along(pts, head / LAST);
        const pulse = 0.75 + 0.25 * Math.sin(now / 180);
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 26);
        g.addColorStop(0, `rgba(30, 112, 205, ${0.45 * pulse * (1 - settled)})`);
        g.addColorStop(1, "rgba(30, 112, 205, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(sx - 26, sy - 26, 52, 52);
      }

      // Steps: hollow while pending, filled signal blue once done. Process
      // steps that fold away during the merge fade out with their labels.
      for (let k = 0; k <= LAST; k++) {
        const [x, y] = pts[k];
        const f = done[k];
        const fold = mode === "process" && !KEPT.includes(k) ? 1 - ease(merge) : 1;
        if (fold <= 0.01) continue;
        ctx.globalAlpha = fold;
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, Math.PI * 2);
        ctx.fillStyle = f > 0.5 ? BLUE : PANEL;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = f > 0.5 ? BLUE : FAINT;
        if (mode === "idea" && f <= 0.5) ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.textAlign = tall ? "left" : "center";
        const lx = tall ? x + 24 : x;
        const status =
          mode === "process"
            ? f > 0.5 ? "AUTOMATED" : "MANUAL"
            : f > 0.5 ? (k === LAST ? "LIVE" : "DONE") : "PLANNED";
        label(steps[k].toUpperCase(), lx, tall ? y - 2 : y - 24, 13, f > 0.5 ? INK : "rgba(16, 19, 18, 0.62)");
        label(status, lx, tall ? y + 14 : y + 36, 11, f > 0.5 ? BLUE : "rgba(16, 19, 18, 0.5)");
        ctx.globalAlpha = 1;
      }

      // Rings: the moment a step lands, plus a heartbeat on a live product.
      ctx.strokeStyle = BLUE;
      ctx.lineWidth = 2;
      for (let k = 0; k <= LAST; k++) {
        const f = done[k];
        if (f <= 0 || f >= 1) continue;
        ctx.globalAlpha = 0.6 * Math.sin(f * Math.PI);
        ctx.beginPath();
        ctx.arc(pts[k][0], pts[k][1], 14 + f * 26, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (mode === "idea" && settled > 0 && !finished) {
        const beat = (now % 1400) / 1400;
        ctx.globalAlpha = 0.5 * (1 - beat) * settled;
        ctx.beginPath();
        ctx.arc(pts[LAST][0], pts[LAST][1], 13 + beat * 28, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    if (reduced) {
      const draw = () => frame(performance.now(), true);
      switchRef.current = (m) => {
        mode = m;
        draw();
      };
      draw();
      const ro = new ResizeObserver(() => {
        resize();
        draw();
      });
      ro.observe(canvas);
      return () => ro.disconnect();
    }

    switchRef.current = (m) => {
      mode = m;
      start = performance.now();
      resetItems();
    };

    let visible = false, raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || document.documentElement.dataset.intro) {
        last = now;
        return;
      }
      // One full story, then hand off to the other one.
      if (start >= 0 && now - start >= CYCLE) {
        mode = mode === "idea" ? "process" : "idea";
        start = now;
        resetItems();
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

  const steps = STEPS[stage.mode];
  const copy = COPY[stage.mode];
  const caption =
    stage.mode === "process"
      ? stage.merged
        ? "Six steps became three"
        : stage.finished
          ? "Every step automated"
          : stage.done === 0
            ? "Handoffs, rework, waiting"
            : `Fix ${String(stage.done).padStart(2, "0")} / ${steps[stage.done - 1]} automated`
      : stage.finished
        ? "Shipped and live"
        : stage.done === 0
          ? "Where every product starts"
          : `Stage ${String(stage.done).padStart(2, "0")} / ${steps[stage.done - 1]} done`;

  const counters =
    stage.mode === "process"
      ? [
          { big: String(6 - stage.done), small: "Manual steps" },
          { big: String(REWORK.filter(([from]) => from >= stage.done).length), small: "Rework loops" },
          { big: stage.merged ? "3" : "6", small: "Steps" },
        ]
      : [
          { big: `${stage.done}/6`, small: "Stages done" },
          { big: stage.finished ? "Live" : "In build", small: "Status" },
        ];

  return (
    <section ref={sectionRef} aria-label="How we work" className="relative overflow-hidden bg-wash">
      <div aria-hidden className="h-[2px] bg-signal shadow-glow" />
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-24">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <p className="font-mono text-label uppercase text-signal-bright">How we work</p>
          <div role="tablist" aria-label="Story" className="flex flex-wrap gap-2">
            {(["idea", "process"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={stage.mode === m}
                onClick={() => switchRef.current(m)}
                className={`rounded-sm px-4 py-2 font-mono text-label uppercase transition-colors ${
                  stage.mode === m
                    ? "bg-signal text-panel"
                    : "border border-line text-ink-dim hover:border-signal hover:text-ink"
                }`}
              >
                {COPY[m].tab}
              </button>
            ))}
          </div>
        </div>

        {/* Start and end states share one cell and crossfade. */}
        <div className="mt-6 grid">
          {[
            { on: !stage.finished, ...copy.start, tone: "text-ink", tagTone: "text-ink-dim" },
            { on: stage.finished, ...copy.end, tone: "text-signal", tagTone: "text-signal-bright" },
          ].map((s) => (
            <div
              key={s.tag}
              aria-hidden={!s.on}
              className="transition-opacity duration-700 [grid-area:1/1]"
              style={{ opacity: s.on ? 1 : 0 }}
            >
              <p className={`font-mono text-label uppercase ${s.tagTone}`}>{s.tag}</p>
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

        <canvas ref={canvasRef} aria-hidden className="mt-6 h-[520px] w-full sm:h-[260px] lg:h-[280px]" />
        <div className="mt-4 flex flex-wrap items-end gap-x-10 gap-y-6 font-mono uppercase">
          {counters.map((c) => (
            <div key={c.small}>
              <p className="type-extended text-[clamp(1.75rem,3.5vw,3rem)] leading-none">{c.big}</p>
              <p className="mt-2 text-label text-ink-dim">{c.small}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
