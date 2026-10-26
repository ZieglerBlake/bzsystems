"use client";

import { useEffect, useRef, useState } from "react";

/* How we work: two stories in one band that auto-alternate (tabs switch).
   YOUR IDEA, BUILT: loose sticky notes and scribbled arrows (an idea in
   pieces) straighten into a dashed wireframe (the notes that do not make
   version one fall away), a browser window forms, each box fills in as a
   real interface, and the product goes LIVE with a moving chart.
   YOUR PROCESS, UPGRADED: a manual, siloed six-step process (queues, rework
   loops) gets fixed one step at a time, straightens, then folds from six
   steps to three. Both loop while on screen and never pin the scroll.
   Illustrative, not claims about any client. Canvas 2D for the motion,
   HTML for type. Reduced motion: each story's finished state, static. */

type Mode = "idea" | "process";

/* ---------- Process story ---------- */
const STEPS = ["Request", "Review", "Approve", "Execute", "Record", "Report"];
const LAST = 5;
// Gentle zigzag that straightens as fixes land (offsets as a share of height).
const ZIG = [0.16, -0.14, 0.12, -0.16, 0.14, -0.1];
// Rework loops: items leaving step [from] get sent back to step [to].
const REWORK = [[2, 1], [4, 3]];
// After automation, each step folds into its surviving parent.
const MERGE_INTO = [0, 0, 3, 3, 5, 5];
const KEPT = [0, 3, 5];
const LEAD_MS = 2600; // sit in the current state first
const STEP_MS = 650; // one fix lands every 650ms
const HOLD_MS = 4200; // hold on the future state
const RESET_MS = 600; // fade back to the start
const PROCESS_CYCLE = LEAD_MS + STEP_MS * 6 + HOLD_MS + RESET_MS;
const ALL_DONE = LEAD_MS + STEP_MS * 5 + STEP_MS * 0.7;
const STRAIGHTEN_MS = 800;
const MERGE_MS = 900;

/* ---------- Idea story ---------- */
const PHASES = ["Idea", "Sketch", "Build", "Live"];
const I_LEAD = 2600; // the idea, in pieces
const I_SKETCH = 1600; // notes snap into a wireframe
const I_BUILD = 1800; // boxes fill in, one after another
const I_HOLD = 4200; // live
const I_FADE = 600;
const IDEA_CYCLE = I_LEAD + I_SKETCH + I_BUILD + I_HOLD + I_FADE;
type Kind = "nav" | "side" | "stat" | "chart" | "cut";
// Each note and where it lands in the app (x, y, w, h as shares of the
// window's content area). "cut" notes do not make version one.
const NOTES: { text: string; kind: Kind; slot?: [number, number, number, number]; value?: string }[] = [
  { text: "sign up", kind: "nav", slot: [0, 0, 1, 0.13] },
  { text: "dashboard", kind: "side", slot: [0.02, 0.2, 0.17, 0.12] },
  { text: "reports", kind: "side", slot: [0.02, 0.36, 0.17, 0.12] },
  { text: "alerts", kind: "side", slot: [0.02, 0.52, 0.17, 0.12] },
  { text: "users?", kind: "stat", slot: [0.22, 0.2, 0.245, 0.25], value: "2,418" },
  { text: "payments", kind: "stat", slot: [0.485, 0.2, 0.245, 0.25], value: "$18.2K" },
  { text: "AI helper", kind: "stat", slot: [0.75, 0.2, 0.23, 0.25], value: "312" },
  { text: "the data", kind: "chart", slot: [0.22, 0.5, 0.76, 0.44] },
  { text: "pricing?", kind: "cut" },
  { text: "mobile app?", kind: "cut" },
];
// Fixed scatter (x, y as shares of the canvas, rotation in radians).
const SCATTER: [number, number, number][] = [
  [0.14, 0.2, -0.16], [0.4, 0.12, 0.1], [0.66, 0.24, -0.08], [0.88, 0.14, 0.15],
  [0.24, 0.62, 0.12], [0.52, 0.5, -0.14], [0.8, 0.66, 0.07], [0.1, 0.84, -0.06],
  [0.44, 0.86, 0.17], [0.7, 0.9, -0.12],
];
const SCRIBBLES: [number, number][] = [[0, 4], [1, 5], [2, 6], [5, 8], [3, 9], [4, 7]];

/* ---------- Shared ---------- */
const INK = "rgb(16, 19, 18)";
const FAINT = "rgba(16, 19, 18, 0.32)";
const BLUE = "rgb(30, 112, 205)"; // signal
const PANEL = "#ffffff";
const WASH = "rgba(238, 243, 250, 0.92)"; // label backdrop, matches the band
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Item = { u: number; wait: number };
type Stage = { mode: Mode; step: number; finished: boolean; merged: boolean };

const COPY: Record<Mode, {
  tab: string;
  start: { tag: string; line: [string, string] };
  end: { tag: string; line: [string, string] };
}> = {
  idea: {
    tab: "Your idea, built",
    start: { tag: "Day one", line: ["An idea", "in pieces."] },
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
  const [stage, setStage] = useState<Stage>({ mode: "idea", step: 0, finished: false, merged: false });

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

    let mode: Mode = "idea";
    let start = -1; // set when the section first comes into view
    let last = performance.now();
    let shown = "";
    const report = (next: Stage) => {
      const key = JSON.stringify(next);
      if (key !== shown) {
        shown = key;
        setStage(next);
      }
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

    /* ===================== Idea story ===================== */
    const drawIdea = (t: number, now: number, finished: boolean) => {
      // Phase progress.
      const s = finished ? 1 : ease(clamp01((t - I_LEAD) / I_SKETCH)); // sketch
      const buildT = finished ? I_BUILD : t - I_LEAD - I_SKETCH;
      const frameIn = finished ? 1 : ease(clamp01((t - I_LEAD - I_SKETCH * 0.6) / 600));
      const liveT = finished ? 1 : clamp01((t - I_LEAD - I_SKETCH - I_BUILD) / 400);
      const fadeOut = finished ? 1 : 1 - clamp01((t - (IDEA_CYCLE - I_FADE)) / I_FADE);
      const fadeIn = finished ? 1 : clamp01(t / 400);
      const alpha = Math.min(fadeOut, fadeIn);
      const phase = finished ? 3 : t < I_LEAD ? 0 : t < I_LEAD + I_SKETCH ? 1 : liveT < 1 ? 2 : 3;
      report({ mode, step: phase, finished: phase === 3, merged: false });

      // The app window the idea becomes.
      const fw = Math.min(tall ? W * 0.94 : W * 0.62, 780);
      const fh = Math.min(H * 0.92, tall ? fw * 1.25 : fw * 0.5);
      const fx = (W - fw) / 2, fy = (H - fh) / 2;
      const bar = 22; // browser chrome
      const cx0 = fx, cy0 = fy + bar, cw = fw, ch = fh - bar;
      const fs = Math.max(9, Math.min(12, fw * 0.016));

      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = alpha;

      // Scribbled arrows between notes while the idea is still in pieces.
      if (s < 1) {
        ctx.strokeStyle = INK;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 5]);
        for (const [a, b] of SCRIBBLES) {
          const [ax, ay] = SCATTER[a], [bx, by] = SCATTER[b];
          const x1 = ax * W, y1 = ay * H, x2 = bx * W, y2 = by * H;
          const wob = Math.sin(now / 900 + a) * 10;
          ctx.globalAlpha = alpha * 0.28 * (1 - s);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.quadraticCurveTo((x1 + x2) / 2 + wob + 30, (y1 + y2) / 2 - 30, x2, y2);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      // Browser window: chrome bar, three dots, LIVE badge once launched.
      if (frameIn > 0) {
        ctx.globalAlpha = alpha * frameIn;
        ctx.fillStyle = PANEL;
        ctx.fillRect(fx, fy, fw, fh);
        ctx.strokeStyle = FAINT;
        ctx.lineWidth = 1;
        ctx.strokeRect(fx + 0.5, fy + 0.5, fw - 1, fh - 1);
        ctx.fillStyle = "rgba(238, 243, 250, 1)";
        ctx.fillRect(fx + 1, fy + 1, fw - 2, bar - 1);
        for (let d = 0; d < 3; d++) {
          ctx.fillStyle = FAINT;
          ctx.beginPath();
          ctx.arc(fx + 12 + d * 11, fy + bar / 2, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        if (liveT > 0) {
          ctx.globalAlpha = alpha * liveT;
          const pulse = 0.5 + 0.5 * Math.sin(now / 260);
          ctx.fillStyle = BLUE;
          ctx.beginPath();
          ctx.arc(fx + fw - 52, fy + bar / 2, 3.5 + pulse * 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = `700 ${fs}px ${mono}`;
          ctx.textAlign = "left";
          ctx.fillText("LIVE", fx + fw - 44, fy + bar / 2 + fs * 0.36);
        }
      }

      // Notes: scattered sticky notes -> dashed wireframe -> built UI.
      ctx.textAlign = "left";
      NOTES.forEach((note, i) => {
        const [sxn, syn, rot] = SCATTER[i];
        const nw = Math.max(76, Math.min(124, W * 0.1)), nh = 38;
        const bob = finished ? 0 : Math.sin(now / 1100 + i * 1.7) * 5 * (1 - s);
        let x: number, y: number, w: number, h: number, r: number;
        if (note.slot) {
          const [ux, uy, uw, uh] = note.slot;
          x = lerp(Math.min(Math.max(sxn * W - nw / 2, 4), W - nw - 4), cx0 + ux * cw, s);
          y = lerp(syn * H - nh / 2 + bob, cy0 + uy * ch, s);
          w = lerp(nw, uw * cw, s);
          h = lerp(nh, uh * ch, s);
          r = rot * (1 - s);
        } else {
          // Not in version one: drifts down and fades during the sketch.
          x = Math.min(Math.max(sxn * W - nw / 2, 4), W - nw - 4);
          y = syn * H - nh / 2 + bob + s * 30;
          w = nw;
          h = nh;
          r = rot;
        }
        // Built boxes fill in one after another, in note order.
        const k = NOTES.slice(0, i).filter((n) => n.slot).length;
        const b = note.slot ? (finished ? 1 : ease(clamp01((buildT - k * 180) / 500))) : 0;
        // Note fades out before the wireframe label fades in, so text never doubles up.
        const noteA = clamp01(1 - s * 2);
        const wireA = note.slot ? clamp01(s * 2 - 1) * (1 - b) : 0;

        ctx.save();
        ctx.translate(x + w / 2, y + h / 2);
        ctx.rotate(r);
        const lx = -w / 2, ly = -h / 2;

        if (noteA > 0.01) {
          ctx.globalAlpha = alpha * noteA;
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          ctx.fillRect(lx, ly, w, h);
          ctx.strokeStyle = "rgba(16, 19, 18, 0.22)";
          ctx.lineWidth = 1;
          ctx.strokeRect(lx + 0.5, ly + 0.5, w - 1, h - 1);
          ctx.fillStyle = "rgba(30, 112, 205, 0.55)";
          ctx.fillRect(lx, ly, 4, h);
          ctx.font = `600 ${fs + 1}px ${mono}`;
          ctx.fillStyle = "rgba(16, 19, 18, 0.75)";
          ctx.fillText(note.text, lx + 12, ly + h / 2 + fs * 0.38);
        }
        if (wireA > 0.01) {
          ctx.globalAlpha = alpha * wireA;
          ctx.setLineDash([5, 4]);
          ctx.strokeStyle = "rgba(16, 19, 18, 0.4)";
          ctx.lineWidth = 1.2;
          ctx.strokeRect(lx + 2, ly + 2, w - 4, h - 4);
          ctx.setLineDash([]);
          ctx.font = `600 ${fs}px ${mono}`;
          ctx.fillStyle = "rgba(16, 19, 18, 0.5)";
          ctx.fillText(note.text.replace("?", "").toUpperCase(), lx + 8, ly + fs + 6);
        }
        if (b > 0.01) {
          ctx.globalAlpha = alpha * b;
          const name = note.text.replace("?", "").toUpperCase();
          if (note.kind === "nav") {
            ctx.fillStyle = PANEL;
            ctx.fillRect(lx, ly, w, h);
            ctx.fillStyle = "rgba(16, 19, 18, 0.08)";
            ctx.fillRect(lx, ly + h - 1, w, 1);
            ctx.fillStyle = BLUE;
            ctx.fillRect(lx + 12, ly + h / 2 - 5, 10, 10);
            ctx.fillStyle = "rgba(16, 19, 18, 0.18)";
            ctx.fillRect(lx + 30, ly + h / 2 - 3, Math.min(90, w * 0.15), 6);
            const pw = Math.min(84, w * 0.18);
            ctx.fillStyle = BLUE;
            ctx.fillRect(lx + w - pw - 10, ly + h / 2 - 9, pw, 18);
            ctx.font = `700 ${fs}px ${mono}`;
            ctx.fillStyle = PANEL;
            ctx.textAlign = "center";
            ctx.fillText(name, lx + w - pw / 2 - 10, ly + h / 2 + fs * 0.36);
            ctx.textAlign = "left";
          } else if (note.kind === "side") {
            ctx.fillStyle = "rgba(30, 112, 205, 0.08)";
            ctx.fillRect(lx, ly, w, h);
            ctx.fillStyle = BLUE;
            ctx.fillRect(lx + 6, ly + h / 2 - 4, 8, 8);
            ctx.font = `600 ${fs}px ${mono}`;
            ctx.fillStyle = INK;
            if (ctx.measureText(name).width < w - 24) ctx.fillText(name, lx + 20, ly + h / 2 + fs * 0.36);
          } else if (note.kind === "stat") {
            ctx.fillStyle = PANEL;
            ctx.fillRect(lx, ly, w, h);
            ctx.strokeStyle = "rgba(16, 19, 18, 0.12)";
            ctx.lineWidth = 1;
            ctx.strokeRect(lx + 0.5, ly + 0.5, w - 1, h - 1);
            ctx.font = `600 ${fs}px ${mono}`;
            ctx.fillStyle = "rgba(16, 19, 18, 0.55)";
            ctx.fillText(name, lx + 10, ly + fs + 8);
            ctx.font = `700 ${Math.round(Math.min(h * 0.3, fs * 1.9))}px ${mono}`;
            ctx.fillStyle = INK;
            ctx.fillText(note.value ?? "", lx + 10, ly + h * 0.7);
            const grow = liveT > 0 ? 0.55 + 0.35 * (0.5 + 0.5 * Math.sin(now / 900 + i)) : 0.55;
            ctx.fillStyle = BLUE;
            ctx.fillRect(lx + 10, ly + h - 12, (w - 20) * grow, 4);
          } else if (note.kind === "chart") {
            ctx.fillStyle = PANEL;
            ctx.fillRect(lx, ly, w, h);
            ctx.strokeStyle = "rgba(16, 19, 18, 0.12)";
            ctx.lineWidth = 1;
            ctx.strokeRect(lx + 0.5, ly + 0.5, w - 1, h - 1);
            ctx.font = `600 ${fs}px ${mono}`;
            ctx.fillStyle = "rgba(16, 19, 18, 0.55)";
            ctx.fillText("ACTIVITY", lx + 10, ly + fs + 8);
            const shift = liveT > 0 ? now / 700 : 0;
            const gx = lx + 10, gw = w - 20, gy = ly + fs + 18, gh = h - fs - 28;
            ctx.beginPath();
            for (let p = 0; p <= 40; p++) {
              const px = gx + (p / 40) * gw;
              const v = 0.5 + 0.22 * Math.sin(p * 0.45 + shift) + 0.12 * Math.sin(p * 1.3 + shift * 1.7) + (p / 40) * 0.18;
              const py = gy + gh - v * gh;
              if (p === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.strokeStyle = BLUE;
            ctx.lineWidth = 2.2;
            ctx.stroke();
            ctx.lineTo(gx + gw, gy + gh);
            ctx.lineTo(gx, gy + gh);
            ctx.closePath();
            ctx.fillStyle = "rgba(30, 112, 205, 0.08)";
            ctx.fill();
          }
        }
        ctx.restore();
      });
      ctx.globalAlpha = 1;
    };

    /* ===================== Process story ===================== */
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

    const items: Item[] = Array.from({ length: 12 }, (_, i) => ({ u: (i / 12) * LAST, wait: 0 }));
    const resetItems = () => items.forEach((it, i) => ((it.u = (i / 12) * LAST), (it.wait = 0)));

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

    const processState = (t: number, finished: boolean) => {
      if (finished) return { done: STEPS.map(() => 1), straight: 1, merge: 1 };
      if (t > PROCESS_CYCLE - RESET_MS) {
        const r = (t - (PROCESS_CYCLE - RESET_MS)) / RESET_MS;
        return {
          done: STEPS.map(() => 1 - r),
          merge: 1 - clamp01(r * 2),
          straight: 1 - clamp01((r - 0.5) * 2),
        };
      }
      return {
        done: STEPS.map((_, k) => clamp01((t - LEAD_MS - k * STEP_MS) / (STEP_MS * 0.7))),
        straight: clamp01((t - ALL_DONE) / STRAIGHTEN_MS),
        merge: clamp01((t - ALL_DONE - STRAIGHTEN_MS) / MERGE_MS),
      };
    };

    const drawProcess = (t: number, dt: number, finished: boolean) => {
      const { done, straight, merge } = processState(t, finished);
      const auto = done.reduce((a, b) => a + b, 0) / 6;
      const pts = nodes(straight, merge);
      const doneCount = done.filter((f) => f >= 0.5).length;
      report({ mode, step: doneCount, finished: doneCount === 6, merged: merge >= 0.5 });

      ctx.clearRect(0, 0, W, H);

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

      // Segments: faint and dashed while manual, solid signal blue once fixed.
      for (let k = 0; k < LAST; k++) {
        const f = Math.min(done[k], done[k + 1]);
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
      if (!reduced && !finished) {
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
            const fx = done[after];
            it.wait = 900 * (1 - fx);
            const loop = REWORK.find(([from]) => from === after);
            if (loop && Math.random() < 0.4 * (1 - fx)) it.u = loop[1];
          }
          if (it.u >= LAST) it.u = 0;
        }
      }
      const queued = new Array(6).fill(0);
      for (const it of items) {
        const k = Math.min(Math.floor(it.u), LAST);
        let x: number, y: number;
        if (merge > 0) {
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
        ctx.fillStyle = done[k] > 0.5 ? BLUE : INK;
        ctx.globalAlpha = done[k] > 0.5 ? 0.9 : 0.4;
        ctx.fillRect(x - 3.5, y - 3.5, 7, 7);
      }
      ctx.globalAlpha = 1;

      // Steps: hollow while manual, filled signal blue once fixed. Steps that
      // fold away during the merge fade out with their labels.
      for (let k = 0; k <= LAST; k++) {
        const [x, y] = pts[k];
        const f = done[k];
        const fold = KEPT.includes(k) ? 1 : 1 - ease(merge);
        if (fold <= 0.01) continue;
        ctx.globalAlpha = fold;
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, Math.PI * 2);
        ctx.fillStyle = f > 0.5 ? BLUE : PANEL;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = f > 0.5 ? BLUE : FAINT;
        ctx.stroke();
        ctx.textAlign = tall ? "left" : "center";
        const lx = tall ? x + 24 : x;
        label(STEPS[k].toUpperCase(), lx, tall ? y - 2 : y - 24, 13, f > 0.5 ? INK : "rgba(16, 19, 18, 0.62)");
        label(f > 0.5 ? "AUTOMATED" : "MANUAL", lx, tall ? y + 14 : y + 36, 11, f > 0.5 ? BLUE : "rgba(16, 19, 18, 0.5)");
        ctx.globalAlpha = 1;
      }

      // The moment of a fix: an expanding ring, drawn last so labels never clip it.
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
      ctx.globalAlpha = 1;
    };

    const cycleOf = (m: Mode) => (m === "idea" ? IDEA_CYCLE : PROCESS_CYCLE);
    const frame = (now: number, finished = false) => {
      const dt = Math.min(50, now - last);
      last = now;
      const t = start < 0 ? 0 : now - start;
      if (mode === "idea") drawIdea(t, now, finished);
      else drawProcess(t, dt, finished);
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
      if (start >= 0 && now - start >= cycleOf(mode)) {
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

  const copy = COPY[stage.mode];
  const caption =
    stage.mode === "process"
      ? stage.merged
        ? "Six steps became three"
        : stage.finished
          ? "Every step automated"
          : stage.step === 0
            ? "Handoffs, rework, waiting"
            : `Fix ${String(stage.step).padStart(2, "0")} / ${STEPS[stage.step - 1]} automated`
      : ["Scattered notes and a hunch", "Sketch: the shape comes together", "Build: the first real version", "Live: shipped and in use"][stage.step];

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

        <canvas ref={canvasRef} aria-hidden className="mt-6 h-[520px] w-full sm:h-[300px] lg:h-[320px]" />

        {stage.mode === "process" ? (
          <div className="mt-4 flex flex-wrap items-end gap-x-10 gap-y-6 font-mono uppercase">
            {[
              { big: String(6 - stage.step), small: "Manual steps" },
              { big: String(REWORK.filter(([from]) => from >= stage.step).length), small: "Rework loops" },
              { big: stage.merged ? "3" : "6", small: "Steps" },
            ].map((c) => (
              <div key={c.small}>
                <p className="type-extended text-[clamp(1.75rem,3.5vw,3rem)] leading-none">{c.big}</p>
                <p className="mt-2 text-label text-ink-dim">{c.small}</p>
              </div>
            ))}
          </div>
        ) : (
          /* Phase tracker: Idea, Sketch, Build, Live. */
          <ol className="mt-6 grid grid-cols-4 gap-2 font-mono text-label uppercase">
            {PHASES.map((p, i) => (
              <li key={p} className="flex flex-col gap-2">
                <span
                  className={`h-1 rounded-full transition-colors duration-500 ${
                    i <= stage.step ? "bg-signal" : "bg-line"
                  }`}
                />
                <span
                  className={`transition-colors duration-500 ${
                    i === stage.step ? "text-signal-bright" : i < stage.step ? "text-ink" : "text-ink-faint"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")} {p}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
