/* Circuit-trace field — deterministic manhattan traces with two live
   blue pulses. Pure SVG, server-rendered, zero assets. Decorative. */

// Seeded LCG so server and client render identical markup.
function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 48271) % 2147483647;
    return s / 2147483647;
  };
}

function buildTraces() {
  const rnd = lcg(7);
  const traces: string[] = [];
  const vias: { x: number; y: number }[] = [];
  for (let i = 0; i < 14; i++) {
    const fromLeft = rnd() > 0.5;
    let x = fromLeft ? 0 : 1200;
    let y = Math.round(60 + rnd() * 480);
    let d = `M ${x} ${y}`;
    const segs = 3 + Math.floor(rnd() * 3);
    for (let s = 0; s < segs; s++) {
      const horiz = s % 2 === 0;
      const len = Math.round(70 + rnd() * 160);
      if (horiz) x += (fromLeft ? 1 : -1) * len;
      else y += (rnd() > 0.5 ? 1 : -1) * Math.round(len * 0.55);
      d += ` L ${x} ${y}`;
    }
    traces.push(d);
    vias.push({ x, y });
  }
  return { traces, vias };
}

const { traces, vias } = buildTraces();

export default function CircuitField({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {traces.map((d, i) => (
        <path key={i} d={d} stroke="rgb(16 19 18 / 0.09)" strokeWidth="1" />
      ))}
      {vias.map((v, i) => (
        <circle key={i} cx={v.x} cy={v.y} r="3" stroke="rgb(16 19 18 / 0.16)" strokeWidth="1" />
      ))}
      {/* Two live pulses retracing existing paths */}
      <path d={traces[2]} className="circuit-pulse" strokeWidth="1.5" />
      <path d={traces[9]} className="circuit-pulse circuit-pulse-2" strokeWidth="1.5" />
    </svg>
  );
}
