"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import WaterSurface from "@/components/WaterSurface";

/* PROTOTYPE ONLY (branch visual/intro): seven candidates for the band
   between the hero and SEC.01, with a floating switcher (or arrow keys)
   so Blake can flip through them live. Once one is picked it moves to its
   own component and this file is deleted. Never merge the switcher. */

const OPTIONS = [
  "Film",
  "Ripple pool",
  "Particle mark",
  "Process, fixed",
  "Marquee",
  "Commitments",
  "None",
];

const BAND = "relative h-[42vh] overflow-hidden bg-night lg:h-[52vh]";
const ICE = "rgb(232, 238, 246)";
const BLUE = "rgb(91, 155, 232)";
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function Seam() {
  return <div aria-hidden className="absolute inset-x-0 top-0 z-10 h-[2px] bg-signal shadow-glow" />;
}

function CenterLogo() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
      <div className="relative grid place-items-center">
        <div
          aria-hidden
          className="absolute h-[340px] w-[560px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgb(1 3 8 / 0.62), transparent)" }}
        />
        <Image
          src="/logo-dark.png"
          alt=""
          width={341}
          height={256}
          className="relative h-32 w-auto drop-shadow-[0_6px_32px_rgba(1,3,8,0.75)] lg:h-44"
        />
      </div>
    </div>
  );
}

/* 1. Film: the current band, as a baseline. */
function Film() {
  return (
    <section aria-hidden className={BAND}>
      <Seam />
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.webp"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <CenterLogo />
    </section>
  );
}

/* 2. Ripple pool: the intro's water carried into the page. */
function RipplePool() {
  return (
    <section aria-hidden className={BAND}>
      <Seam />
      <WaterSurface tone="dark" />
      <CenterLogo />
    </section>
  );
}

/* 3. Particle mark: the lockup as particles that scatter from the cursor
   and spring back. Assembles from scattered when first shown. */
function ParticleMark() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, n = 0, size = 2;
    let hx = new Float32Array(0), hy = hx, x = hx, y = hx, vx = hx, vy = hx;
    let blue = new Uint8Array(0);
    const mouse = { x: -1e4, y: -1e4 };

    const img = new window.Image();
    img.src = "/logo-dark.png";

    const build = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!img.naturalWidth) return;

      // Crop to the visible lockup (found at quarter scale).
      const q = 4;
      const a = document.createElement("canvas");
      a.width = Math.ceil(img.naturalWidth / q);
      a.height = Math.ceil(img.naturalHeight / q);
      const actx = a.getContext("2d");
      if (!actx) return;
      actx.drawImage(img, 0, 0, a.width, a.height);
      const lo = actx.getImageData(0, 0, a.width, a.height).data;
      let bx0 = a.width, by0 = a.height, bx1 = 0, by1 = 0;
      for (let j = 0; j < a.height; j++) {
        for (let i = 0; i < a.width; i++) {
          const k = (j * a.width + i) * 4;
          if (lo[k + 3] > 60 && lo[k] > 40) {
            bx0 = Math.min(bx0, i); by0 = Math.min(by0, j);
            bx1 = Math.max(bx1, i); by1 = Math.max(by1, j);
          }
        }
      }
      a.width = a.height = 0;
      const cw = (bx1 - bx0 + 1) * q, ch = (by1 - by0 + 1) * q;
      const fit = Math.min((W * 0.5) / cw, (H * 0.62) / ch);
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
      for (let k = 3; k < px.length; k += 4) if (px[k] > 110) covered++;
      const gap = Math.max(2, Math.round(Math.sqrt(covered / (W < 640 ? 700 : 1400))));
      size = gap * 0.85;

      const hxs: number[] = [], hys: number[] = [], bl: number[] = [];
      const left = (W - lw) / 2, top = (H - lh) / 2;
      for (let j = 0; j < lh; j += gap) {
        for (let i = 0; i < lw; i += gap) {
          const k = (j * lw + i) * 4;
          if (px[k + 3] <= 110) continue;
          hxs.push(left + i);
          hys.push(top + j);
          bl.push(px[k + 2] > px[k] + 40 ? 1 : 0);
        }
      }
      n = hxs.length;
      hx = Float32Array.from(hxs);
      hy = Float32Array.from(hys);
      blue = Uint8Array.from(bl);
      x = new Float32Array(n); y = new Float32Array(n);
      vx = new Float32Array(n); vy = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        x[i] = reduced ? hx[i] : Math.random() * W;
        y[i] = reduced ? hy[i] : Math.random() * H;
      }
      if (reduced) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let pass = 0; pass < 2; pass++) {
        ctx.fillStyle = pass ? BLUE : ICE;
        for (let i = 0; i < n; i++) {
          if (blue[i] !== pass) continue;
          const off = Math.min(1, Math.hypot(x[i] - hx[i], y[i] - hy[i]) / 120);
          ctx.globalAlpha = 1 - off * 0.55;
          ctx.fillRect(x[i] - size / 2, y[i] - size / 2, size, size);
        }
      }
      ctx.globalAlpha = 1;
    };

    const step = () => {
      const R = 110, R2 = R * R;
      for (let i = 0; i < n; i++) {
        const dx = x[i] - mouse.x, dy = y[i] - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < R2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (1 - d / R) * 2.6;
          vx[i] += (dx / d) * f;
          vy[i] += (dy / d) * f;
        }
        vx[i] = (vx[i] + (hx[i] - x[i]) * 0.045) * 0.86;
        vy[i] = (vy[i] + (hy[i] - y[i]) * 0.045) * 0.86;
        x[i] += vx[i];
        y[i] += vy[i];
      }
    };

    let visible = false, raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || document.documentElement.dataset.intro) return;
      step();
      draw();
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(canvas);
    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    img.onload = build;
    if (!reduced) {
      raf = requestAnimationFrame(loop);
      window.addEventListener("pointermove", onMove, { passive: true });
    }
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      img.onload = null;
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <section aria-hidden className={BAND}>
      <Seam />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
    </section>
  );
}

/* 4. Process, fixed: a tangled process that straightens into a clean
   pipeline as the band scrolls into view. */
const STEPS = ["Request", "Review", "Approve", "Execute", "Record", "Report"];
const MESSY = [[130, 190], [610, 70], [300, 205], [830, 175], [470, 60], [880, 50]];
const CLEAN = STEPS.map((_, i) => [100 + i * 160, 140]);
const REWORK = [[3, 1], [5, 2], [4, 0]];

function ProcessFix() {
  const ref = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setP(1);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setP(clamp01((vh - r.top) / (vh / 2 + r.height / 2)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const e = ease(p);
  const pts = MESSY.map(([mx, my], i) => [mx + (CLEAN[i][0] - mx) * e, my + (CLEAN[i][1] - my) * e]);

  return (
    <section ref={ref} aria-hidden className={BAND}>
      <Seam />
      <div className="absolute inset-x-0 top-8 z-10 text-center font-mono text-label uppercase lg:top-12">
        <span className="text-void/50" style={{ opacity: clamp01(1 - e * 2) }}>The process, as it runs today</span>
        <span className="absolute inset-x-0 text-[#5B9BE8]" style={{ opacity: clamp01(e * 2 - 1) }}>The process, fixed</span>
      </div>
      <svg viewBox="0 0 1000 260" className="absolute inset-x-0 top-1/2 h-[70%] w-full -translate-y-1/2 px-6">
        {REWORK.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]}
            stroke={ICE} strokeOpacity={0.28 * (1 - e)} strokeDasharray="4 7" strokeWidth={1.2}
          />
        ))}
        {pts.slice(1).map((pt, i) => (
          <line
            key={i}
            x1={pts[i][0]} y1={pts[i][1]} x2={pt[0]} y2={pt[1]}
            stroke={BLUE} strokeOpacity={0.35 + 0.65 * e}
            strokeDasharray={`${6 + e * 400} ${8 * (1 - e)}`} strokeWidth={1.5 + e}
          />
        ))}
        {pts.map(([px, py], i) => (
          <g key={STEPS[i]}>
            <circle cx={px} cy={py} r={7} fill="#0b1220" stroke={BLUE} strokeWidth={1.6} />
            <circle cx={px} cy={py} r={2.6} fill={BLUE} opacity={e} />
            <text
              x={px} y={py + 28} textAnchor="middle" fill={ICE} fillOpacity={0.6}
              fontSize={11} letterSpacing="0.12em" className="font-mono uppercase"
            >
              {STEPS[i].toUpperCase()}
            </text>
          </g>
        ))}
      </svg>
    </section>
  );
}

/* 5. Marquee: what the studio works on, two rows in opposite directions. */
const ROW_A = ["AI systems", "Data pipelines", "Automation", "Infrastructure", "Analytics"];
const ROW_B = ["Vendor risk", "AI governance", "Operations", "Web platforms", "APIs"];

function MarqueeRow({ items, reverse, outline }: { items: string[]; reverse?: boolean; outline?: boolean }) {
  const run = [...items, ...items, ...items, ...items];
  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <div
        className="bz-mq flex shrink-0"
        style={{ animation: `bz-marquee 48s linear infinite${reverse ? " reverse" : ""}` }}
      >
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center">
            {run.map((t, i) => (
              <span key={`${dup}-${i}`} className="flex items-center">
                <span
                  className="type-extended px-6 text-[clamp(1.75rem,4.5vw,3.75rem)] uppercase leading-none"
                  style={
                    outline
                      ? { color: "transparent", WebkitTextStroke: "1px rgb(232 238 246 / 0.45)" }
                      : { color: ICE }
                  }
                >
                  {t}
                </span>
                <span className="text-[#5B9BE8]">●</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Marquee() {
  return (
    <section aria-hidden className={`${BAND} flex flex-col justify-center gap-6`}>
      <Seam />
      <style>{`
        @keyframes bz-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .bz-mq { animation: none !important; } }
      `}</style>
      <MarqueeRow items={ROW_A} />
      <MarqueeRow items={ROW_B} reverse outline />
    </section>
  );
}

/* 6. Commitments: three statements that are true today. */
const COMMITMENTS = [
  { big: "1 day", small: "Reply to every inquiry within one business day" },
  { big: "0", small: "Outside investors" },
  { big: "Every layer", small: "Designed, built, and run in-house" },
];

function Commitments() {
  return (
    <section className={`${BAND} flex items-center`}>
      <Seam />
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 sm:grid-cols-3 lg:px-12">
        {COMMITMENTS.map((c) => (
          <div key={c.big} className="border-l border-void/15 pl-6">
            <p className="type-extended text-[clamp(2rem,4.5vw,3.75rem)] uppercase leading-none text-void">
              {c.big}
            </p>
            <p className="mt-4 max-w-[26ch] font-mono text-label uppercase text-void/55">{c.small}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const RENDER = [Film, RipplePool, ParticleMark, ProcessFix, Marquee, Commitments, () => null];

export default function BandLab() {
  const [v, setV] = useState(0);

  useEffect(() => {
    const n = Number(new URLSearchParams(window.location.search).get("band"));
    if (n >= 1 && n <= OPTIONS.length) setV(n - 1);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setV((x) => (x + 1) % OPTIONS.length);
      if (e.key === "ArrowLeft") setV((x) => (x + OPTIONS.length - 1) % OPTIONS.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const u = new URL(window.location.href);
    u.searchParams.set("band", String(v + 1));
    window.history.replaceState(null, "", u);
  }, [v]);

  const Band = RENDER[v];
  return (
    <>
      <Band />
      <div className="fixed bottom-4 left-1/2 z-40 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-sm border border-void/15 bg-night/90 p-1.5 font-mono text-legal uppercase shadow-glow backdrop-blur">
        <span className="whitespace-nowrap px-2 text-void/50">Band</span>
        {OPTIONS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setV(i)}
            className={`whitespace-nowrap rounded-sm px-2.5 py-1.5 transition-colors ${
              i === v ? "bg-signal text-panel" : "text-void/70 hover:text-void"
            }`}
          >
            {i + 1} {label}
          </button>
        ))}
      </div>
    </>
  );
}
