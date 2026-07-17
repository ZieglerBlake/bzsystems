import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import SectionRule from "@/components/SectionRule";

export const metadata: Metadata = {
  title: "About Us / BZ Systems",
};

const LINKEDIN = "https://www.linkedin.com/in/blakerobertziegler/";

const standards = [
  {
    n: "01",
    title: "Built in-house, end to end",
    body: "Interface to infrastructure, we write the whole stack ourselves. If it's in the product, we can take it apart, explain it, and stand behind it.",
  },
  {
    n: "02",
    title: "Ships standalone",
    body: "Each venture gets its own name, its own brand, and its own front door. It stands alone with its own P&L. The studio backs it, but never props it up.",
  },
  {
    n: "03",
    title: "Honest by structure",
    body: "The structure makes honesty automatic. Every claim is checkable, every number is real, and every venture is stated exactly as it stands. The standard doesn't move.",
  },
];

export default function About() {
  return (
    <>
      <Nav />
      <main>
        {/* Page header */}
        <section className="mx-auto max-w-7xl px-6 pt-40 lg:px-12">
          <p className="rise-in font-mono text-label uppercase text-ink-dim">
            BZ SYSTEMS LLC / ABOUT US
          </p>
          <h1 className="rise-in rise-in-delay-1 type-extended mt-6 max-w-[18ch] text-display uppercase">
            One studio.
            <br />
            <span className="text-signal-bright">One standard.</span>
          </h1>
        </section>

        {/* Ownership */}
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
          <Reveal>
            <SectionRule sec="SEC.01" title="Ownership" />
            <div className="mt-14 grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <figure className="relative max-w-sm overflow-hidden rounded-md bg-ink">
                <Image
                  src="/ziegler.webp"
                  alt="Blake Ziegler, founder of BZ Systems"
                  width={427}
                  height={513}
                  className="w-full"
                />
                <div aria-hidden className="h-[2px] bg-signal shadow-glow" />
                <figcaption className="flex items-baseline justify-between gap-3 px-4 py-3 font-mono text-legal uppercase text-void/60">
                  <span>Ziegler / Founder, Principal</span>
                  <span className="whitespace-nowrap text-[#5B9BE8]">EST. 2026</span>
                </figcaption>
              </figure>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-5 text-ink-dim">
                  <p>
                    BZ Systems is founded and run by Blake Ziegler. Design,
                    code, infrastructure, operations: every layer of every
                    venture is built in-house, by the person whose name is on
                    the LLC.
                  </p>
                  <p>
                    The standard is the same across the board: built in-house,
                    owned outright, operated with intent. We design it, we run
                    it, we answer for it.
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

        {/* The standard */}
        <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-12 lg:pb-32">
          <Reveal>
            <SectionRule sec="SEC.02" title="The standard" />
            <div className="mt-14 grid gap-12 lg:grid-cols-3">
              {standards.map((s) => (
                <div key={s.n} className="flex flex-col gap-4 border-t border-line pt-6">
                  <span className="font-mono text-label text-signal-bright">{s.n}</span>
                  <h2 className="type-semi-extended text-h3 uppercase">{s.title}</h2>
                  <p className="text-ink-dim">{s.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Contact hand-off */}
        <section className="relative overflow-hidden bg-ink">
          <div aria-hidden className="h-[2px] bg-signal shadow-glow" />
          <Reveal className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-6 py-20 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-24">
            <h2 className="type-semi-extended max-w-[18ch] text-h2 uppercase text-void">
              Reach us directly.
            </h2>
            <Link
              href="/#contact"
              className="rounded-sm border border-signal px-8 py-3 font-mono text-label uppercase text-void transition-all duration-200 hover:bg-signal hover:shadow-glow"
            >
              Send an inquiry
            </Link>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
