import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";

const LINKEDIN = "https://www.linkedin.com/in/blakerobertziegler/";

export const metadata: Metadata = {
  title: "About us / BZ Systems",
  description:
    "I started BZ Systems in 2026, in Columbus, Ohio, to do one thing: build software products worth owning, and then own them.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About us / BZ Systems",
    description:
      "I started BZ Systems in 2026, in Columbus, Ohio, to do one thing: build software products worth owning, and then own them.",
    url: "/about",
    siteName: "BZ Systems",
    locale: "en_US",
    type: "website",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image.png"],
    title: "About us / BZ Systems",
    description:
      "I started BZ Systems in 2026, in Columbus, Ohio, to do one thing: build software products worth owning, and then own them.",
  },
};

const sections = [
  {
    label: "The company",
    paragraphs: [
      "I started BZ Systems in 2026, in Columbus, Ohio, to do one thing: build software products worth owning, and then own them.",
      "It runs as a holding company. Under it sits a small set of customer-facing ventures, each with its own name and its own books, and all of it built, operated, and supported by me. Nothing is acquired, nothing is outsourced, and nothing ships that I wouldn't run myself.",
    ],
  },
  {
    label: "The thesis",
    paragraphs: [
      "Most software companies are built to be sold. BZ Systems is built to be kept.",
      "Durable products come from durable structure: full ownership, no outside capital, and no exit plan driving the roadmap. When a company answers only to its customers and its own standard, accountability is structural, not aspirational. The system is the strategy. The products will be the proof.",
    ],
  },
  {
    label: "What I build",
    paragraphs: [
      "I build software businesses from nothing: idea, product, infrastructure, revenue. Some ventures are customer-facing applications, some are APIs and data systems other software depends on. All of them are built to earn their keep and built to last.",
    ],
  },
  {
    label: "How I operate",
    paragraphs: [
      "The company runs on a few fixed rules. Everything that ships stays owned and stays run, for years. Nothing gets announced before it exists. Growth comes from what the products earn, not from raised money. None of this is philosophy. It is just how the company is built, and that part does not change.",
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
                alt="BZ Systems logo, white mark on a black plate"
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

            {/* Founder sign-off: the page is written in his voice, so it ends with him */}
            <Reveal>
              <div aria-hidden className="my-14 h-px bg-line-soft" />
              <figure className="mx-auto max-w-xs overflow-hidden rounded-md bg-ink">
                <Image
                  src="/ziegler.webp"
                  alt="Blake Ziegler, founder of BZ Systems"
                  width={427}
                  height={513}
                  className="w-full"
                />
                <div aria-hidden className="h-[2px] bg-signal shadow-glow" />
                <figcaption className="px-4 py-3 font-mono text-legal uppercase text-void/60">
                  Ziegler / Founder, Principal
                </figcaption>
              </figure>
              <p className="mt-6 font-mono text-label uppercase">
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
            </Reveal>

            <div className="mt-16 flex justify-center">
              <Link
                href="/"
                className="rounded-sm border border-line px-8 py-3 font-mono text-label uppercase text-ink transition-all duration-200 hover:border-signal hover:shadow-glow"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
