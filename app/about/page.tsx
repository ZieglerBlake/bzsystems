import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About Us / BZ Systems",
};

const sections = [
  {
    label: "The company",
    paragraphs: [
      "BZ Systems LLC is an independent software studio out of Columbus, Ohio, founded in 2026 by Blake Robert Ziegler. The company exists to do one thing: build software products worth owning, and then own them.",
      "The studio operates as a parent company. Each venture ships under its own name and brand, stands on its own P&L, and is built, operated, and supported entirely in-house. Nothing is acquired, nothing is outsourced, and nothing ships that we wouldn't run ourselves.",
    ],
  },
  {
    label: "The thesis",
    paragraphs: [
      "Most software companies are built to be sold. BZ Systems is built to be kept.",
      "We believe durable products come from durable structure: full ownership, no outside capital, and no exit plan driving the roadmap. When a company answers only to its customers and its own standard, honesty stops being a policy and becomes a byproduct. The system is the strategy. The products are the proof.",
    ],
  },
  {
    label: "What we build",
    paragraphs: [
      "We build software businesses from nothing: idea, product, infrastructure, revenue. Some ventures are customer-facing applications, some are APIs and data systems other software depends on. All of them are built to generate revenue and built to last.",
    ],
  },
  {
    label: "How we operate",
    paragraphs: [
      "The company runs on a few fixed rules. Everything we ship, we own outright and intend to run for years. Nothing gets announced before it exists. And growth comes from what the products earn, not from raised money. None of this is philosophy, it's just how the company is structured, and the structure doesn't move.",
    ],
  },
];

export default function About() {
  return (
    <>
      <Nav />
      <main>
        <div className="mx-auto max-w-7xl px-6 pt-40 pb-24 lg:px-12 lg:pb-32">
          {/* Nameplate: white knockout mark on an ink plate, centered */}
          <div className="rise-in flex justify-center">
            <div className="rounded-sm bg-ink px-4 py-2">
              <Image
                src="/logo-dark.png"
                alt="BZ Systems"
                width={1448}
                height={1086}
                priority
                className="h-40 w-auto"
              />
            </div>
          </div>

          {/* Sections: centered under the nameplate */}
          <div className="mx-auto mt-20 max-w-3xl text-center">
            {sections.map((s, i) => (
              <Reveal key={s.label}>
                {i > 0 && <div aria-hidden className="my-14 h-px bg-line-soft" />}
                <section>
                  <p className="font-mono text-label uppercase text-signal-bright">
                    {s.label}
                  </p>
                  <div className="mt-6 flex flex-col gap-5 text-ink-dim">
                    {s.paragraphs.map((p) => (
                      <p key={p.slice(0, 24)}>{p}</p>
                    ))}
                  </div>
                </section>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
