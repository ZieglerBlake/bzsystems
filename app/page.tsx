import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import PhasedBuildIntro from "@/components/PhasedBuildIntro";
import ProcessStory from "@/components/ProcessStory";
import Reveal from "@/components/Reveal";
import SectionRule from "@/components/SectionRule";
import SystemMap from "@/components/SystemMap";
import WaterSurface from "@/components/WaterSurface";

const LINKEDIN = "https://www.linkedin.com/in/blakerobertziegler/";

/* Organization schema. Facts only, all stated on this site: name, place,
   founding year, founder, public contact address. */
const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BZ Systems LLC",
  url: "https://bzsystems.io",
  logo: "https://bzsystems.io/logo.png",
  description:
    "An independent studio that builds software from the idea up: for our own ventures, for people with an idea worth building, and for teams whose processes need fixing.",
  foundingDate: "2026",
  email: "blake@bzsystems.io",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Columbus",
    addressRegion: "OH",
    addressCountry: "US",
  },
  founder: {
    "@type": "Person",
    name: "Blake Robert Ziegler",
    sameAs: [LINKEDIN],
  },
};

/* What we build, in two groups that mirror the hero headline. */
const CAPABILITIES = [
  {
    label: "Your idea, built",
    items: [
      { title: "Web apps & platforms", body: "Customer-facing products, portals, and dashboards, built from the first screen up." },
      { title: "AI products", body: "Assistants and tools built on current AI models, wired into real data and real work." },
      { title: "APIs & integrations", body: "Connect the systems you already use so they finally talk to each other." },
    ],
  },
  {
    label: "Your process, fixed",
    items: [
      { title: "Workflow automation", body: "Intake, approvals, and handoffs that run themselves instead of living in inboxes." },
      { title: "Data & reporting", body: "Data lands where it is needed, and the reports build themselves." },
      { title: "Infrastructure", body: "Hosting, security, and monitoring set up to stay up." },
    ],
  },
];

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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
      />
      <PhasedBuildIntro />
      <Nav />

      <main id="top">
        {/* Hero: calm live map behind the text */}
        <section className="relative flex min-h-svh flex-col justify-end overflow-hidden">
          <div className="absolute inset-0">
            <SystemMap still />
            <WaterSurface />
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
            <h1
              className="rise-in rise-in-delay-1 type-extended mt-6 text-display uppercase"
              style={{ fontSize: "clamp(1.75rem, 5.4vw, 4.25rem)" }}
            >
              <span className="text-signal-bright">YOUR IDEA,</span> BUILT.
              <br />
              <span className="text-signal-bright">YOUR PROCESS,</span> FIXED.
            </h1>
            <p className="rise-in rise-in-delay-2 mt-8 max-w-[52ch] text-body text-ink-dim">
              An independent studio that builds software from the idea up:
              for our own ventures, for people with an idea worth building,
              and for teams whose processes need fixing.
            </p>
            <div className="rise-in rise-in-delay-3 mt-8">
              <Link
                href="/#contact"
                className="inline-block rounded-sm bg-signal px-8 py-3 font-mono text-label uppercase text-panel shadow-glow transition-all duration-200 hover:bg-signal-bright"
              >
                Get in touch
              </Link>
            </div>
            <ul className="rise-in rise-in-delay-3 mt-10 flex flex-wrap gap-3">
              {["FOUNDER RUN", "CUSTOM BUILT", "PROCESS ENHANCING"].map((f) => (
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

        {/* The process, fixed: pinned scroll story (ProcessStory.tsx) */}
        <ProcessStory />

        {/* SEC.01: Ventures. The black slab band. No names, ever. */}
        <section id="ventures" className="relative scroll-mt-24 overflow-hidden bg-night">
          <div aria-hidden className="h-[2px] bg-signal shadow-glow" />
          <div className="absolute inset-0 opacity-70">
            <SystemMap variant="dark" />
          </div>
          <Reveal className="relative mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-36">
            <SectionRule sec="SEC.01" title="The company" dark />
            <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
              <h2 className="type-semi-extended max-w-[19ch] text-h2 uppercase text-void">
                Run like a startup.
                <br />
                Held like a holdco.
              </h2>
              <div className="flex flex-col gap-5 text-void/70">
                <p>
                  BZ Systems is a holding company. It builds and runs a small
                  set of its own software ventures. The same stack and the
                  same habits go into client work: small, targeted fixes to
                  the processes a team already runs.
                </p>
                <p>
                  The focus runs from small businesses to regulated teams in
                  finance.
                </p>
                <p>
                  Each venture gets listed on the ventures page as it goes
                  live. For now that page is locked, open to clients and
                  partners on request.
                </p>
              </div>
            </div>
          </Reveal>
          <div aria-hidden className="h-[2px] bg-signal shadow-glow" />
        </section>

        {/* SEC.02: How we build */}
        <section className="relative overflow-hidden bg-wash">
          <Image
            src="/tex/blueprint.webp"
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className="pointer-events-none object-cover opacity-[0.05]"
          />
          <Reveal className="relative mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-36">
            <SectionRule sec="SEC.02" title="How we build" />
            <div className="mt-14 grid gap-12 lg:grid-cols-3">
              {[
                {
                  n: "01",
                  title: "Built in-house, end to end",
                  body: "From the first sketch of an idea, or the first look at a process, all the way to the infrastructure it runs on, we write the whole stack ourselves. If it's in the product, we can take it apart, explain it, and stand behind it.",
                },
                {
                  n: "02",
                  title: "Small first, then compound",
                  body: "We ship the smallest version that works, then improve it step by step. You see it running early, and every step builds on the last.",
                },
                {
                  n: "03",
                  title: "One builder, no handoffs",
                  body: "The person who scopes your project is the person who builds it. No relay team, no game of telephone, and one person who answers for all of it.",
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
            {/* What we build, grouped to mirror the hero: idea work, process work */}
            <div className="mt-20 grid gap-12 lg:grid-cols-2">
              {CAPABILITIES.map((group) => (
                <div key={group.label}>
                  <p className="font-mono text-label uppercase text-signal-bright">{group.label}</p>
                  <ul className="mt-5 grid gap-px overflow-hidden rounded-md border border-line bg-line">
                    {group.items.map((it) => (
                      <li key={it.title} className="bg-panel/85 p-6 transition-colors duration-200 hover:bg-panel">
                        <p className="type-semi-extended text-h3 uppercase">{it.title}</p>
                        <p className="mt-2 text-ink-dim">{it.body}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-16 font-mono text-label uppercase text-ink-faint">
              Architecture over assurances.
            </p>
          </Reveal>
        </section>

        {/* SEC.03: Contact */}
        <section id="contact" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24 lg:px-12 lg:py-36">
          <Reveal>
            <SectionRule sec="SEC.03" title="Contact" />
            <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
              <div>
                <h2 className="type-semi-extended max-w-[14ch] text-h2 uppercase">
                  Get in touch.
                </h2>
                <p className="mt-6 max-w-[44ch] text-ink-dim">
                  Have an idea you want built, or a process software should be
                  fixing? Email me directly. You'll hear back within one
                  business day.
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
              </div>
              <ContactForm />
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
