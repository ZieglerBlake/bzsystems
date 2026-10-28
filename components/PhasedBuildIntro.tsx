"use client";

import { useEffect, useRef, useState } from "react";

/* Entrance: "small fixes that compound." One drop lands on a dark,
   reflective floor; more follow and their rings overlap. Then particles
   rise out of the water and assemble the BZ Systems lockup (with a floor
   reflection), the blue dash ignites, a scan sweeps the mark, and a ripple
   wipe opens onto the site. Canvas 2D, no deps, ~3.8s.

   Built to stay light: the backdrop is pre-rendered once, particles draw
   in two batched passes (no per-frame string building), resolution is
   capped, the exit is a canvas wipe rather than a CSS mask, and the hero
   map + ripples pause underneath (html[data-intro]) while this covers
   them. Any input skips to the wipe; never mounts under reduced motion.
   The overlay shell (and a CSS-only exit that clears the page even
   without JS) lives in globals.css .pbi. */

// Timeline, ms from first frame.
const T = {
  firstImpact: 380,
  drops: [540, 680, 800, 920, 1040],
  fall: 380,
  depart: 900,
  departSpread: 700,
  travelMin: 750,
  travelMax: 1150,
  ignite: 2250,
  scanEnd: 2750,
  exit: 3200,
  exitDur: 600,
  skipDur: 380,
};

const BLUE = "rgb(91, 155, 232)"; // #5B9BE8, signal tuned for dark
const ICE = "rgb(232, 238, 246)";
const BLUE_A = (a: number) => `rgba(91, 155, 232, ${a})`;
const ICE_A = (a: number) => `rgba(232, 238, 246, ${a})`;

type Ripple = { x: number; y: number; t0: number; strength: number };

const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

// Plays only on a fresh document load of the home page. On a fresh load
// the server-rendered overlay is already in the DOM when this component
// hydrates; on an in-site route transition there is no server HTML, so
// the intro stays quiet. Section deep links (/#contact) never gate: the
// first client render must still match the server (so the overlay is
// cleanly removed, not stranded), so a tiny inline script hides it before
// first paint and the effect below takes it out.

export default function PhasedBuildIntro() {
  const [active, setActive] = useState(() => {
    if (typeof window === "undefined") return true;
    return !!document.querySelector(".pbi");
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.location.hash
    ) {
      setActive(false);
      return;
    }
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx) {
      setActive(false);
      return;
    }
    const html = document.documentElement;
    html.dataset.intro = "1";

    // Layout, with resolution capped so big retina screens stay cheap.
    const W = window.innerWidth;
    const H = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    if (W * H * dpr * dpr > 2_400_000) dpr = Math.sqrt(2_400_000 / (W * H));
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.scale(dpr, dpr);
    const horizon = H * 0.72;
    const cx = W / 2;
    const cy = H * 0.39;
    const small = W < 640;
    const diag = Math.hypot(W, H);

    // Pre-render the static backdrop once.
    const layer = (paint: (c: CanvasRenderingContext2D) => void) => {
      const c = document.createElement("canvas");
      c.width = canvas.width;
      c.height = canvas.height;
      const lc = c.getContext("2d");
      if (lc) {
        lc.scale(dpr, dpr);
        paint(lc);
      }
      return c;
    };
    const backdrop = layer((c) => {
      const g = c.createRadialGradient(cx, cy, 0, cx, cy, diag * 0.7);
      g.addColorStop(0, "#0b1220");
      g.addColorStop(1, "#010308");
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
    });
    const floor = layer((c) => {
      for (let k = 0; k < 9; k++) {
        const y = horizon + Math.pow(k / 8, 1.8) * (H - horizon);
        c.fillStyle = BLUE_A(0.05 * (1 - k / 10));
        c.fillRect(0, y, W, 1);
      }
      const hz = c.createLinearGradient(0, horizon, W, horizon);
      hz.addColorStop(0, BLUE_A(0));
      hz.addColorStop(0.5, BLUE_A(0.35));
      hz.addColorStop(1, BLUE_A(0));
      c.fillStyle = hz;
      c.fillRect(0, horizon, W, 1.5);
    });

    // Particles (filled once the logo image loads).
    let count = 0;
    let sx = new Float32Array(0), sy = sx, tx = sx, ty = sx;
    let kx = sx, ky = sx, dly = sx, dur = sx, ph = sx;
    let isBlue = new Uint8Array(0);
    let size = 2;
    let logoBox = { x0: cx, y0: cy, x1: cx, y1: cy };
    let dash = { x: cx, y: cy };

    const img = new Image();
    img.src = "/logo-dark.png";
    img.onload = () => {
      // Find the lockup's bounds on a quarter-size copy (cheap on memory).
      const q = 4;
      const a = document.createElement("canvas");
      a.width = Math.ceil(img.naturalWidth / q);
      a.height = Math.ceil(img.naturalHeight / q);
      const actx = a.getContext("2d");
      if (!actx) return;
      actx.drawImage(img, 0, 0, a.width, a.height);
      const lo = actx.getImageData(0, 0, a.width, a.height).data;
      let bx0 = a.width, by0 = a.height, bx1 = 0, by1 = 0;
      for (let y = 0; y < a.height; y++) {
        for (let x = 0; x < a.width; x++) {
          const i = (y * a.width + x) * 4;
          if (lo[i + 3] > 60 && lo[i] > 40) {
            if (x < bx0) bx0 = x;
            if (y < by0) by0 = y;
            if (x > bx1) bx1 = x;
            if (y > by1) by1 = y;
          }
        }
      }
      a.width = a.height = 0;
      const cw = (bx1 - bx0 + 1) * q, ch = (by1 - by0 + 1) * q;
      if (cw <= q || ch <= q) return;

      // Fit the lockup and sample it on a grid sized for the particle budget.
      const fit = Math.min(((small ? 0.78 : 0.42) * W) / cw, (0.36 * H) / ch);
      const lw = Math.round(cw * fit), lh = Math.round(ch * fit);
      const b = document.createElement("canvas");
      b.width = lw;
      b.height = lh;
      const bctx = b.getContext("2d");
      if (!bctx) return;
      bctx.drawImage(img, bx0 * q, by0 * q, cw, ch, 0, 0, lw, lh);
      const px = bctx.getImageData(0, 0, lw, lh).data;
      b.width = b.height = 0;
      let covered = 0;
      for (let i = 3; i < px.length; i += 4) if (px[i] > 110) covered++;
      const budget = small ? 1100 : 2400;
      const gap = Math.max(2, Math.round(Math.sqrt(covered / budget)));
      size = gap * 0.85;

      const xs: number[] = [], ys: number[] = [], blue: number[] = [];
      for (let y = 0; y < lh; y += gap) {
        for (let x = 0; x < lw; x += gap) {
          const i = (y * lw + x) * 4;
          if (px[i + 3] <= 110) continue;
          xs.push(x);
          ys.push(y);
          blue.push(px[i + 2] > px[i] + 40 ? 1 : 0);
        }
      }
      count = xs.length;
      const left = cx - lw / 2, top = cy - lh / 2;
      logoBox = { x0: left, y0: top, x1: left + lw, y1: top + lh };
      sx = new Float32Array(count); sy = new Float32Array(count);
      tx = new Float32Array(count); ty = new Float32Array(count);
      kx = new Float32Array(count); ky = new Float32Array(count);
      dly = new Float32Array(count); dur = new Float32Array(count);
      ph = new Float32Array(count);
      isBlue = new Uint8Array(blue);
      let bxs = 0, bys = 0, bn = 0;
      for (let i = 0; i < count; i++) {
        tx[i] = left + xs[i];
        ty[i] = top + ys[i];
        sx[i] = W * (0.06 + Math.random() * 0.88);
        sy[i] = horizon + 12 + Math.random() * (H - horizon - 12);
        kx[i] = (sx[i] + tx[i]) / 2 + (Math.random() - 0.5) * W * 0.35;
        ky[i] = Math.min(sy[i], ty[i]) - Math.random() * H * 0.22;
        // Left-to-right-ish arrival so the mark builds across.
        dly[i] = T.depart + (xs[i] / lw) * T.departSpread * 0.6 + Math.random() * T.departSpread * 0.4;
        dur[i] = T.travelMin + Math.random() * (T.travelMax - T.travelMin);
        ph[i] = Math.random() * Math.PI * 2;
        if (blue[i]) { bxs += tx[i]; bys += ty[i]; bn++; }
      }
      if (bn) dash = { x: bxs / bn, y: bys / bn };
    };

    // Drops: the first lands center-floor, the rest compound around it.
    const drops = [
      { at: T.firstImpact, x: cx, y: horizon + (H - horizon) * 0.42, strength: 1 },
      ...T.drops.map((at) => ({
        at,
        x: W * (0.15 + Math.random() * 0.7),
        y: horizon + 18 + Math.random() * (H - horizon - 40),
        strength: 0.7,
      })),
    ];
    const ripples: Ripple[] = [];
    let landed = 0;

    // Timeline control. The clock advances by at most ~2 frames per frame,
    // so a hitch while the page is still loading delays the intro instead
    // of making the drops jump. A wall-clock guard still ends it on time.
    let vt = 0;
    let lastNow = -1;
    const wall0 = performance.now();
    root.style.animationDelay = "6s"; // JS is driving; push back the CSS fallback exit
    let exitStart = T.exit;
    let exitDur = T.exitDur;
    let exiting = false;
    const skip = () => {
      if (vt < exitStart) {
        exitStart = vt;
        exitDur = T.skipDur;
      }
    };
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchmove", skip, { passive: true });

    let raf = 0;
    const frame = (now: number) => {
      vt += lastNow < 0 ? 0 : Math.min(now - lastNow, 34);
      lastNow = now;
      if (now - wall0 > 5000) skip();
      const t = vt;
      const e = clamp01((t - exitStart) / exitDur);
      const ee = easeInOutCubic(e);

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.drawImage(backdrop, 0, 0, W, H);
      ctx.globalAlpha = clamp01(t / 700);
      ctx.drawImage(floor, 0, 0, W, H);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "lighter";

      // Falling drops and their impacts.
      for (let d = 0; d < drops.length; d++) {
        const drop = drops[d];
        const start = drop.at - T.fall;
        if (t < start) continue;
        if (t < drop.at) {
          const p = (t - start) / T.fall;
          const y = -30 + (drop.y + 30) * p * p;
          // Streak grows with speed (about one frame of travel) so the
          // drop reads as a continuous fall, not a series of jumps.
          const len = Math.max(46, ((2 * (drop.y + 30) * p) / T.fall) * 20);
          const g = ctx.createLinearGradient(drop.x, y - len, drop.x, y);
          g.addColorStop(0, BLUE_A(0));
          g.addColorStop(1, ICE_A(0.9 * drop.strength));
          ctx.fillStyle = g;
          ctx.fillRect(drop.x - 1, y - len, 2, len);
        } else if (d >= landed) {
          ripples.push({ x: drop.x, y: drop.y, t0: drop.at, strength: drop.strength });
          landed = d + 1;
        }
      }

      // Rings: perspective ellipses on the floor, three echoes per impact.
      ctx.strokeStyle = BLUE;
      ctx.lineWidth = 1.4;
      for (const r of ripples) {
        const age = t - r.t0;
        for (let k = 0; k < 3; k++) {
          const a2 = age - k * 140;
          if (a2 <= 0) continue;
          const alpha = Math.max(0, 1 - a2 / 1700) * r.strength * (1 - k * 0.28) * (1 - ee) * 0.85;
          if (alpha <= 0.01) continue;
          const rad = a2 * 0.34 * (W / 1200 + 0.4);
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.ellipse(r.x, r.y, rad, rad * 0.24, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        if (age < 240) {
          ctx.globalAlpha = (1 - age / 240) * 0.5 * r.strength;
          const g = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, 60);
          g.addColorStop(0, ICE);
          g.addColorStop(1, BLUE_A(0));
          ctx.fillStyle = g;
          ctx.fillRect(r.x - 60, r.y - 60, 120, 120);
        }
      }
      ctx.globalAlpha = 1;

      // Particles: two batched passes (ice, then blue), alpha per particle.
      if (count) {
        const ignite = clamp01((t - T.ignite) / 500);
        const scan = clamp01((t - T.ignite) / (T.scanEnd - T.ignite));
        const scanning = scan > 0 && scan < 1;
        const scanX = logoBox.x0 - 80 + (logoBox.x1 - logoBox.x0 + 160) * scan;
        const scale = 1 + ee * 0.55;
        const fade = 1 - ee;
        for (let pass = 0; pass < 2; pass++) {
          ctx.fillStyle = pass ? BLUE : ICE;
          const boost = pass ? 1 + ignite * 1.4 : 1;
          for (let i = 0; i < count; i++) {
            if (isBlue[i] !== pass) continue;
            const local = (t - dly[i]) / dur[i];
            if (local <= 0) continue;
            const p = easeInOutCubic(clamp01(local));
            const q = 1 - p;
            let x = q * q * sx[i] + 2 * q * p * kx[i] + p * p * tx[i];
            let y = q * q * sy[i] + 2 * q * p * ky[i] + p * p * ty[i];
            if (p < 1) {
              const wob = q * 7;
              x += Math.sin(t * 0.006 + ph[i]) * wob;
              y += Math.cos(t * 0.005 + ph[i]) * wob;
            }
            x = cx + (x - cx) * scale;
            y = cy + (y - cy) * scale;
            const near = scanning ? Math.max(0, 1 - Math.abs(x - scanX) / 40) : 0;
            const alpha = Math.min(
              1,
              (clamp01(local * 4) * (0.35 + 0.65 * p) * fade + near * 0.6) * boost,
            );
            if (alpha <= 0.02) continue;
            const s = size * (1 + near * 0.5);
            ctx.globalAlpha = alpha;
            ctx.fillRect(x - s / 2, y - s / 2, s, s);
            // Floor reflection once the particle is above the horizon.
            if (p > 0.5 && y < horizon) {
              const ry = horizon + (horizon - y) * 0.55;
              if (ry < H) {
                ctx.globalAlpha = alpha * 0.14;
                ctx.fillRect(x - s / 2, ry, s, s * 0.6);
              }
            }
          }
        }
        ctx.globalAlpha = 1;

        // Dash ignition: a bloom at the blue dash.
        if (t > T.ignite) {
          const bloom = Math.sin(Math.min(1, (t - T.ignite) / 800) * Math.PI) * fade;
          if (bloom > 0.01) {
            ctx.globalAlpha = 0.55 * bloom;
            const g = ctx.createRadialGradient(dash.x, dash.y, 0, dash.x, dash.y, 220);
            g.addColorStop(0, BLUE);
            g.addColorStop(1, BLUE_A(0));
            ctx.fillStyle = g;
            ctx.fillRect(dash.x - 220, dash.y - 220, 440, 440);
            ctx.globalAlpha = 1;
          }
        }
      }

      // Exit: punch a widening hole through the canvas to reveal the site,
      // with a bright shockwave ring riding its edge.
      if (e > 0) {
        if (!exiting) {
          exiting = true;
          root.style.background = "transparent";
        }
        const R = ee * diag * 0.62;
        ctx.globalCompositeOperation = "destination-out";
        const hole = ctx.createRadialGradient(cx, cy, 0, cx, cy, R + 90);
        hole.addColorStop(0, "#000");
        hole.addColorStop(R / (R + 90), "#000");
        hole.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = hole;
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 0.9 * (1 - e);
        ctx.strokeStyle = BLUE;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(0.1, R), 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      if (e >= 1) {
        setActive(false);
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      img.onload = null;
      delete html.dataset.intro;
      backdrop.width = backdrop.height = 0;
      floor.width = floor.height = 0;
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
    };
  }, [active]);

  if (!active) return null;
  return (
    <div ref={rootRef} aria-hidden className="pbi fixed inset-0 z-50" suppressHydrationWarning>
      <script
        dangerouslySetInnerHTML={{
          __html: "if(location.hash)document.currentScript.parentNode.style.display='none'",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
