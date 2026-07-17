import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import PhasedBuildIntro from "@/components/PhasedBuildIntro";
import Reveal from "@/components/Reveal";
import SystemMap from "@/components/SystemMap";

const LINKEDIN = "https://www.linkedin.com/in/blakerobertziegler/";

/* Self-drawing schematic marks for the build principles */
function Glyph({ variant }: { variant: number }) {
  const stroke = { stroke: "currentColor", strokeWidth: 1.5, fill: "none" } as const;
  return (
    <svg aria-hidden viewBox="0 0 56 56" className="glyph h-14 w-14 text-ink">
      {variant === 0 && (
        <>
          <path {...stroke} d="M8 8 H48 V48 H8 Z" />
          <path {...stroke} d="M20 20 H36 V36 H20 Z" stroke="var(--color-signal)" />
          <line {...stroke} x1="8" y1="8" x2="20" y2="20" />
          <line {...stroke} x1="48" y1="48" x2="36" y2="36" />
        </>
      )}
      {variant === 1 && (
        <>
          <circle {...stroke} cx="28" cy="28" r="19" strokeDasharray="2 5" />
          <circle {...stroke} cx="28" cy="28" r="6" stroke="var(--color-signal)" />
          <line {...stroke} x1="28" y1="3" x2="28" y2="12" />
        </>
      )}
      {variant === 2 && (
        <>
          <path {...stroke} d="M8 40 A22 22 0 0 1 48 40" />
          <line {...stroke} x1="28" y1="40" x2="42" y2="24" stroke="var(--color-signal)" />
          <line {...stroke} x1="8" y1="46" x2="48" y2="46" />
        </>
      )}
    </svg>
  );
}

function SectionRule({
  sec,
  title,
  dark = false,
}: {
  sec: string;
  title: string;
  dark?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-4">
      <span
        className={`whitespace-nowrap font-mono text-label uppercase ${
          dark ? "text-[#5B9BE8]" : "text-signal-bright"
        }`}
      >
        {sec}
      </span>
      <span
        className={`whitespace-nowrap font-mono text-label uppercase ${
          dark ? "text-void/40" : "text-ink-faint"
        }`}
      >
        {title}
      </span>
      <span className={`rule-draw h-px flex-1 self-center ${dark ? "bg-void/20" : "bg-line"}`} />
      <span
        className={`hidden font-mono text-legal sm:block ${
          dark ? "text-void/40" : "text-ink-faint"
        }`}
      >
        +
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <PhasedBuildIntro />
      {/* Nav */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-line-soft bg-void/85 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
          <a href="#top" aria-label="BZ Systems home">
            <Image
              src="/logo.png"
              alt="BZ Systems"
              width={64}
              height={48}
              priority
              className="h-12 w-auto mix-blend-multiply"
            />
          </a>
          <div className="flex items-center gap-6 font-mono text-label uppercase sm:gap-8">
            <a href="#ventures" className="text-ink-dim transition-colors hover:text-ink">
              Ventures
            </a>
            <a href="#about" className="text-ink-dim transition-colors hover:text-ink">
              About us
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
        {/* Hero: calm live map behind the text */}
        <section className="relative flex min-h-svh flex-col justify-end overflow-hidden">
          <div className="absolute inset-0">
            <SystemMap />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-64"
            style={{ background: "linear-gradient(to top, #f7f8f6 20%, transparent)" }}
          />
          <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-40 lg:px-12 lg:pb-24">
            <p className="rise-in caret font-mono text-label uppercase text-ink-dim">
              BZ SYSTEMS LLC / INDEPENDENT SOFTWARE STUDIO / COLUMBUS, OH
            </p>
            <h1 className="rise-in rise-in-delay-1 type-extended mt-6 max-w-5xl text-display uppercase">
              DESIGNED BY US.
              <br />
              <span className="text-signal-bright">BUILT BY US.</span> OWNED BY
              US.
            </h1>
            <p className="rise-in rise-in-delay-2 mt-8 max-w-[52ch] text-body text-ink-dim">
              BZ Systems designs, builds, and operates its own software
              products. Each one is owned and operated in-house, from
              architecture to invoice.
            </p>
            <ul className="rise-in rise-in-delay-3 mt-10 flex flex-wrap gap-3">
              {["FOUNDER-BUILT", "REVENUE-FUNDED", "EST. 2026"].map((f) => (
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

        {/* The slab film: full-bleed, no text, pure theme */}
        <section aria-hidden className="relative h-[42vh] overflow-hidden bg-ink lg:h-[52vh]">
          <div className="absolute inset-x-0 top-0 z-10 h-[2px] bg-signal shadow-glow" />
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
        </section>

        {/* SEC.01: Ventures. The black slab band. No names, ever. */}
        <section id="ventures" className="relative scroll-mt-24 overflow-hidden bg-ink">
          <div aria-hidden className="h-[2px] bg-signal shadow-glow" />
          <div className="absolute inset-0 opacity-70">
            <SystemMap variant="dark" />
          </div>
          <Reveal className="relative mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-36">
            <SectionRule sec="SEC.01" title="Ventures" dark />
            <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
              <h2 className="type-semi-extended max-w-[16ch] text-h2 uppercase text-void">
                We build them. They leave home.
              </h2>
              <div className="flex flex-col gap-5 text-void/70">
                <p>
                  Every venture BZ Systems builds ships on its own domain, with
                  its own name and its own brand. Some are live. Some are in
                  build. Some are still on the drafting table.
                </p>
                <p>
                  You will not find a catalog here, by design. The company is
                  the factory, not the showroom, and this page does not chase
                  what the factory is making.
                </p>
                <p className="font-mono text-label uppercase text-void/50">
                  If a venture wants you to find it, it will find you.
                </p>
              </div>
            </div>
          </Reveal>
          <div aria-hidden className="h-[2px] bg-signal shadow-glow" />
        </section>

        {/* SEC.02: About us */}
        <section id="about" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24 lg:px-12 lg:py-36">
          <Reveal>
            <SectionRule sec="SEC.02" title="About us" />
            <div className="mt-14 grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <figure className="relative max-w-sm overflow-hidden rounded-md bg-ink">
                <Image
                  src="/blake.webp"
                  alt="Blake Ziegler, founder of BZ Systems"
                  width={800}
                  height={962}
                  className="w-full"
                />
                <div aria-hidden className="h-[2px] bg-signal shadow-glow" />
                <figcaption className="flex items-baseline justify-between px-4 py-3 font-mono text-legal uppercase text-void/60">
                  <span>B. Ziegler / Founder, Operator</span>
                  <span className="text-[#5B9BE8]">EST. 2026</span>
                </figcaption>
              </figure>
              <div className="flex flex-col gap-8">
                <h2 className="type-semi-extended max-w-[18ch] text-h2 uppercase">
                  A building company, built by one operator.
                </h2>
                <div className="flex flex-col gap-5 text-ink-dim">
                  <p>
                    BZ Systems is founded and run by Blake Ziegler. Design,
                    code, infrastructure, operations: every layer of every
                    venture is authored in-house, by the person whose name is
                    on the LLC.
                  </p>
                  <p>
                    The thesis is simple. Most software companies are one bet.
                    A building company is a system of bets, and the system
                    itself is the product that compounds.
                  </p>
                </div>
                <p className="font-mono text-label uppercase">
                  <a
                    href={LINKEDIN}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink-dim underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-signal"
                  >
                    LinkedIn ↗
                  </a>
                  <span className="text-ink-faint">&ensp;/&ensp;</span>
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
          </Reveal>
        </section>

        {/* SEC.03: How we build */}
        <section className="relative overflow-hidden">
          <Image
            src="/tex/blueprint.webp"
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className="pointer-events-none object-cover opacity-[0.05]"
          />
          <Reveal className="relative mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-36">
            <SectionRule sec="SEC.03" title="How we build" />
            <div className="mt-14 grid gap-12 lg:grid-cols-3">
              {[
                {
                  n: "01",
                  title: "Built in-house, end to end",
                  body: "Every layer is authored inside the company, from the interface down to the infrastructure. Nothing is assembled from parts we don't understand.",
                },
                {
                  n: "02",
                  title: "Ships standalone",
                  body: "Each venture gets its own name, its own domain, and its own brand. It has to survive on its own merits, without the parent holding its hand.",
                },
                {
                  n: "03",
                  title: "Truth over theater",
                  body: "No invented metrics, no manufactured social proof. If a system works, we say so. If it doesn't, it gets rebuilt or retired.",
                },
              ].map((p, i) => (
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
            <ul className="mt-16 flex flex-wrap gap-3">
              {[
                "AI systems",
                "Web platforms",
                "APIs",
                "Automation",
                "Data pipelines",
                "Operations",
              ].map((c) => (
                <li
                  key={c}
                  className="rounded-sm border border-line px-4 py-2 font-mono text-label uppercase text-ink-faint"
                >
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* The thesis slab */}
        <section className="relative overflow-hidden bg-ink">
          <div aria-hidden className="h-[2px] bg-signal shadow-glow" />
          <Reveal className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
            <p className="type-extended max-w-[16ch] text-display uppercase text-void">
              The build is the business.{" "}
              <span className="text-[#5B9BE8]">The factory is the product.</span>
            </p>
            <p className="mt-8 font-mono text-label uppercase text-void/40">
              BZ Systems LLC / Est. 2026
            </p>
          </Reveal>
          <div aria-hidden className="h-[2px] bg-signal shadow-glow" />
        </section>

        {/* SEC.04: Contact */}
        <section id="contact" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24 lg:px-12 lg:py-36">
          <Reveal>
            <SectionRule sec="SEC.04" title="Open a channel" />
            <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
              <div>
                <h2 className="type-semi-extended max-w-[14ch] text-h2 uppercase">
                  Talk to the operator.
                </h2>
                <p className="mt-6 max-w-[44ch] text-ink-dim">
                  Partnerships, press, or something that doesn&rsquo;t fit a
                  form. Direct line either way.
                </p>
                <p className="mt-6 font-mono text-label">
                  <a
                    href="mailto:blake@bzsystems.io"
                    className="text-ink-dim underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-signal"
                  >
                    blake@bzsystems.io
                  </a>
                  <span className="text-ink-faint">&ensp;/&ensp;</span>
                  <a
                    href={LINKEDIN}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink-dim underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-signal"
                  >
                    LinkedIn ↗
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
                    FIG.02, terrain uncharted
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
          <Image
            src="/logo.png"
            alt="BZ Systems"
            width={107}
            height={80}
            className="h-20 w-auto self-start mix-blend-multiply"
          />
          <div className="flex flex-col gap-2 font-mono text-legal text-ink-faint lg:text-right">
            <p>© 2026 BZ SYSTEMS LLC, OHIO, USA. ALL RIGHTS RESERVED.</p>
            <p>VENTURES SHIP ON THEIR OWN DOMAINS. THIS IS THE PARENT.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
