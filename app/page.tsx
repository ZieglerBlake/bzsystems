import Image from "next/image";
import BootSequence from "@/components/BootSequence";
import CircuitField from "@/components/CircuitField";
import ContactForm from "@/components/ContactForm";
import CoreArtifact from "@/components/CoreArtifact";
import Reveal from "@/components/Reveal";
import SystemMap from "@/components/SystemMap";

const SENTINEL_URL = process.env.NEXT_PUBLIC_SENTINEL_URL;

const ventures = [
  {
    tag: "P1",
    name: "Vendor Reality Check",
    desc: "AI vendor diligence for operators — five-axis scoring, go/no-go verdicts, zero brochure.",
    status: "IN BUILD",
    href: undefined as string | undefined,
  },
  {
    tag: "P2",
    name: "Sentinel",
    desc: "White-label regulatory-change intelligence for boutique compliance consultancies.",
    status: "PRE-LAUNCH",
    href: SENTINEL_URL,
  },
  {
    tag: "P3",
    name: "SkillShelf",
    desc: "Infrastructure for keeping, versioning, and reusing the AI skills a team trusts.",
    status: "QUEUED",
    href: undefined,
  },
  {
    tag: "P4",
    name: "License API",
    desc: "Professional-license verification as a single API call, built for developers.",
    status: "QUEUED",
    href: undefined,
  },
];

const principles = [
  {
    n: "01",
    title: "Built in-house, end to end",
    body: "Design, code, infrastructure, operations — every layer of every venture is authored inside the company. No agencies, no outsourcing, no assembly from parts we don't understand.",
  },
  {
    n: "02",
    title: "Each system stands alone",
    body: "Every venture ships on its own domain with its own brand and its own P&L logic. The parent company is the factory, not the product.",
  },
  {
    n: "03",
    title: "Truth over theater",
    body: "No invented metrics, no fake logos, no manufactured social proof. A system either works or it doesn't — and we say which.",
  },
];

/* Self-drawing schematic marks for the three principles */
function Glyph({ variant }: { variant: number }) {
  const stroke = { stroke: "currentColor", strokeWidth: 1.5, fill: "none" } as const;
  return (
    <svg aria-hidden viewBox="0 0 56 56" className="glyph h-14 w-14 text-ink">
      {variant === 0 && (
        <>
          {/* built in-house: block inside its own frame */}
          <path {...stroke} d="M8 8 H48 V48 H8 Z" />
          <path {...stroke} d="M20 20 H36 V36 H20 Z" stroke="var(--color-signal)" />
          <line {...stroke} x1="8" y1="8" x2="20" y2="20" />
          <line {...stroke} x1="48" y1="48" x2="36" y2="36" />
        </>
      )}
      {variant === 1 && (
        <>
          {/* stands alone: node with its own orbit */}
          <circle {...stroke} cx="28" cy="28" r="19" strokeDasharray="2 5" />
          <circle {...stroke} cx="28" cy="28" r="6" stroke="var(--color-signal)" />
          <line {...stroke} x1="28" y1="3" x2="28" y2="12" />
        </>
      )}
      {variant === 2 && (
        <>
          {/* truth over theater: gauge reading true */}
          <path {...stroke} d="M8 40 A22 22 0 0 1 48 40" />
          <line {...stroke} x1="28" y1="40" x2="42" y2="24" stroke="var(--color-signal)" />
          <line {...stroke} x1="8" y1="46" x2="48" y2="46" />
        </>
      )}
    </svg>
  );
}

function SectionRule({ sec, title }: { sec: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="whitespace-nowrap font-mono text-label uppercase text-signal-bright">
        {sec}
      </span>
      <span className="whitespace-nowrap font-mono text-label uppercase text-ink-faint">
        {title}
      </span>
      <span className="rule-draw h-px flex-1 self-center bg-line" />
      <span className="hidden font-mono text-legal text-ink-faint sm:block">+</span>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <BootSequence />
      {/* Nav */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-line-soft bg-void/85 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
          <a href="#top" aria-label="BZ Systems home">
            <Image src="/logo.png" alt="BZ Systems" width={64} height={48} priority className="h-12 w-auto mix-blend-multiply" />
          </a>
          <div className="flex items-center gap-6 font-mono text-label uppercase sm:gap-8">
            <a href="#charter" className="hidden text-ink-dim transition-colors hover:text-ink sm:block">
              Charter
            </a>
            <a href="#ventures" className="text-ink-dim transition-colors hover:text-ink">
              Ventures
            </a>
            <a href="#principles" className="hidden text-ink-dim transition-colors hover:text-ink sm:block">
              Principles
            </a>
            <a
              href="#contact"
              className="rounded-sm border border-line px-4 py-2 text-ink transition-all duration-200 hover:border-signal hover:shadow-glow"
            >
              Contact
            </a>
          </div>
        </nav>
      </header>

      <main id="top">
        {/* Hero — live system map with type layered above */}
        <section className="relative flex min-h-svh flex-col justify-end overflow-hidden">
          <div className="absolute inset-0">
            <SystemMap />
          </div>
          {/* Bottom fade so type sits on solid ground */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-64"
            style={{ background: "linear-gradient(to top, #f7f8f6 20%, transparent)" }}
          />
          <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-40 lg:px-12 lg:pb-28">
            <p className="rise-in caret font-mono text-label uppercase text-ink-dim">
              BZ SYSTEMS LLC / PARENT COMPANY / ALL SYSTEMS NOMINAL
            </p>
            <h1 className="rise-in rise-in-delay-1 type-extended mt-6 max-w-5xl text-display uppercase">
              One company.
              <br />
              <span className="text-signal-bright">Many machines.</span>
            </h1>
            <p className="rise-in rise-in-delay-2 mt-8 max-w-[52ch] text-body text-ink-dim">
              BZ Systems is the parent company behind a growing portfolio of
              software ventures — each one designed, built, and operated
              in-house, each one shipped on its own domain.
            </p>
            <ul className="rise-in rise-in-delay-3 mt-10 flex flex-wrap gap-3">
              {["Ohio LLC", "04+ systems", "Self-operated"].map((f) => (
                <li
                  key={f}
                  className="rounded-sm border border-line px-4 py-2 font-mono text-label uppercase text-ink-faint"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SEC.01 — Charter */}
        <section id="charter" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24 lg:px-12 lg:py-36">
          <Reveal>
            <SectionRule sec="SEC.01" title="Charter" />
            <div className="mt-14 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="flex flex-col gap-3">
                <div className="aspect-square w-full max-w-sm">
                  <CoreArtifact />
                </div>
                <p className="font-mono text-legal uppercase text-ink-faint">
                  FIG.01 — The core / self-contained system
                </p>
              </div>
              <div className="flex flex-col gap-8">
                <h2 className="type-semi-extended max-w-[18ch] text-h2 uppercase">
                  The product is the company that makes the products.
                </h2>
                <div className="flex flex-col gap-5 text-ink-dim">
                <p>
                  Most software companies are one bet. BZ Systems is built to
                  be a system of bets — an umbrella under which independent
                  ventures are designed, launched, and run, from AI diligence
                  tools to compliance intelligence to developer infrastructure.
                </p>
                <p>
                  The ventures don&rsquo;t share a brand. They share an
                  operator, a standard, and a build philosophy: ship real
                  things, own every layer, and let each system prove itself on
                  its own domain.
                </p>
                <p className="font-mono text-label uppercase text-ink-faint">
                  Founded by Blake Ziegler ·{" "}
                  <a
                    href="https://blakeziegler.app"
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink-dim underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-signal"
                  >
                    blakeziegler.app ↗
                  </a>
                </p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* SEC.02 — Ventures */}
        <section id="ventures" className="relative scroll-mt-24 py-24 lg:py-36">
          <CircuitField />
          <Reveal className="relative mx-auto max-w-7xl px-6 lg:px-12">
            <SectionRule sec="SEC.02" title="Ventures / Live registry" />
            <div className="mt-14 grid gap-px overflow-hidden rounded-md border border-line bg-line-soft sm:grid-cols-2">
              {ventures.map((v) => {
                const inner = (
                  <>
                    <div className="flex items-baseline justify-between">
                      <span className="font-mono text-label text-signal-bright">{v.tag}</span>
                      <span
                        className={`font-mono text-legal uppercase ${
                          v.status === "PRE-LAUNCH" ? "text-signal-bright" : "text-ink-faint"
                        }`}
                      >
                        ● {v.status}
                      </span>
                    </div>
                    <h3 className="type-semi-extended mt-6 text-h3 uppercase">{v.name}</h3>
                    <p className="mt-3 text-body text-ink-dim">{v.desc}</p>
                    <p className="mt-6 font-mono text-label uppercase text-ink-faint">
                      {v.href ? (
                        <span className="text-ink transition-colors group-hover:text-signal-bright">
                          Enter system ↗
                        </span>
                      ) : (
                        "Own domain at launch"
                      )}
                    </p>
                  </>
                );
                const cls =
                  "group flex flex-col bg-void p-8 transition-all duration-200 lg:p-10 hover:bg-panel";
                return v.href ? (
                  <a key={v.tag} href={v.href} target="_blank" rel="noreferrer" className={cls}>
                    {inner}
                  </a>
                ) : (
                  <div key={v.tag} className={cls}>
                    {inner}
                  </div>
                );
              })}
              {/* The next machine — implied pipeline */}
              <div className="flex flex-col justify-center gap-3 border-t border-dashed border-line bg-void p-8 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between lg:p-10">
                <span className="font-mono text-label uppercase text-ink-faint">
                  PX / Next system — in design
                </span>
                <span className="font-mono text-legal uppercase text-ink-faint">
                  Registry expands as systems clear the gate
                </span>
              </div>
            </div>
          </Reveal>
        </section>

        {/* SEC.03 — Principles */}
        <section id="principles" className="relative scroll-mt-24 py-24 lg:py-36">
          <Image
            src="/tex/blueprint.webp"
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className="pointer-events-none object-cover opacity-[0.05]"
          />
          <Reveal className="relative mx-auto max-w-7xl px-6 lg:px-12">
            <SectionRule sec="SEC.03" title="Operating principles" />
            <div className="mt-14 grid gap-12 lg:grid-cols-3">
              {principles.map((p, i) => (
                <div key={p.n} className="flex flex-col gap-4 border-t border-line pt-6">
                  <div className="flex items-center justify-between">
                    <Glyph variant={i} />
                    <span className="font-mono text-label text-signal-bright">{p.n}</span>
                  </div>
                  <h3 className="type-semi-extended text-h3 uppercase">{p.title}</h3>
                  <p className="text-ink-dim">{p.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* SEC.04 — Contact */}
        <section id="contact" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24 lg:px-12 lg:py-36">
          <Reveal>
            <SectionRule sec="SEC.04" title="Open a channel" />
            <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
              <div>
                <h2 className="type-semi-extended max-w-[14ch] text-h2 uppercase">
                  Talk to the operator.
                </h2>
                <p className="mt-6 max-w-[44ch] text-ink-dim">
                  Partnerships, products, press, or something that doesn&rsquo;t
                  fit a form — direct line either way.
                </p>
                <p className="mt-6 font-mono text-label">
                  <a
                    href="mailto:blake@bzsystems.io"
                    className="text-ink-dim underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-signal"
                  >
                    blake@bzsystems.io
                  </a>
                </p>
                <figure className="mt-12 hidden max-w-sm lg:block">
                  <Image
                    src="/tex/contour.webp"
                    alt="Blue contour line drawing on white drafting paper"
                    width={1400}
                    height={763}
                    className="w-full brightness-105 mix-blend-multiply"
                  />
                  <figcaption className="mt-2 font-mono text-legal uppercase text-ink-faint">
                    FIG.02 — Terrain, uncharted
                  </figcaption>
                </figure>
              </div>
              <ContactForm />
            </div>
          </Reveal>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-line-soft">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-14 lg:flex-row lg:items-end lg:justify-between lg:px-12">
          <Image src="/logo.png" alt="BZ Systems" width={107} height={80} className="h-20 w-auto self-start mix-blend-multiply" />
          <Image
            src="/tex/titleblock.webp"
            alt=""
            aria-hidden
            width={830}
            height={600}
            className="hidden w-52 brightness-110 mix-blend-multiply opacity-70 lg:block"
          />
          <div className="flex flex-col gap-2 font-mono text-legal text-ink-faint lg:text-right">
            <p>© 2026 BZ SYSTEMS LLC — OHIO, USA. ALL RIGHTS RESERVED.</p>
            <p>SYSTEMS SHIP ON THEIR OWN DOMAINS. THIS IS THE PARENT.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
