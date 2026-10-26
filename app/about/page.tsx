import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import SectionRule from "@/components/SectionRule";

const LINKEDIN = "https://www.linkedin.com/in/blakerobertziegler/";

export const metadata: Metadata = {
  title: "About us / BZ Systems",
  description:
    "I'm Blake Ziegler. I started BZ Systems in 2026 in Columbus, Ohio, and I build software from the idea up: my own ventures, products for people with an idea worth building, and upgrades for teams whose processes need one.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About us / BZ Systems",
    description:
      "I'm Blake Ziegler. I started BZ Systems in 2026 in Columbus, Ohio, and I build software from the idea up: my own ventures, products for people with an idea worth building, and upgrades for teams whose processes need one.",
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
      "I'm Blake Ziegler. I started BZ Systems in 2026 in Columbus, Ohio, and I build software from the idea up: my own ventures, products for people with an idea worth building, and upgrades for teams whose processes need one.",
  },
};

const LINK =
  "text-ink-dim underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-signal";

/* What I build: the same two halves as the home headline. */
const WORK = [
  {
    label: "Your idea, built",
    body: "You have an idea and maybe a sketch. I take it from there: what version one needs, the product itself, and the infrastructure it runs on, until it is live and in use.",
  },
  {
    label: "Your process, upgraded",
    body: "Your team runs on handoffs, spreadsheets, and inboxes. I find the steps that slow it down and automate them one at a time, so the work gets faster without starting over.",
  },
];

/* How I work: fixed rules, short enough to hold me to. */
const RULES = [
  { title: "You talk to the builder", body: "The person who scopes your project is the person who builds it. No account managers, no handoffs." },
  { title: "Small first, then compound", body: "The smallest version that works ships first. You see it running early, and every step builds on the last." },
  { title: "The whole stack, in-house", body: "I write all of it, from the first screen to the servers, so I can explain any part of it and stand behind it." },
  { title: "Nothing announced before it exists", body: "No roadmaps sold as products. If it is on this site, it is real." },
];

export default function About() {
  return (
    <>
      <Nav />
      <main>
        {/* Intro: the founder up top, the page is in his voice */}
        <section className="mx-auto max-w-7xl px-6 pt-36 pb-20 lg:px-12 lg:pt-44 lg:pb-28">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-20">
            <figure className="rise-in mx-auto w-full max-w-[260px] overflow-hidden lg:max-w-[360px] rounded-md bg-night">
              <Image
                src="/ziegler.webp"
                alt="Blake Ziegler, founder of BZ Systems"
                width={427}
                height={513}
                priority
                className="w-full"
              />
              <div aria-hidden className="h-[2px] bg-signal shadow-glow" />
              <figcaption className="px-4 py-3 font-mono text-legal uppercase text-void/60">
                Ziegler / Founder, Principal
              </figcaption>
            </figure>
            <div>
              <p className="rise-in font-mono text-label uppercase text-signal-bright">About</p>
              <h1
                className="rise-in rise-in-delay-1 type-extended mt-4 text-display uppercase"
                style={{ fontSize: "clamp(1.6rem, 4vw, 3.25rem)" }}
              >
                One builder.
                <br />
                <span className="text-signal-bright">The whole stack.</span>
              </h1>
              <p className="rise-in rise-in-delay-2 mt-8 max-w-[56ch] text-body text-ink-dim">
                I&apos;m Blake Ziegler. I started BZ Systems in 2026 in
                Columbus, Ohio, and I build software from the idea up: my own
                ventures, products for people with an idea worth building, and
                upgrades for teams whose processes need one.
              </p>
              <p className="rise-in rise-in-delay-3 mt-8 font-mono text-label uppercase">
                <a href={LINKEDIN} target="_blank" rel="noreferrer" className={LINK}>
                  LinkedIn ↗
                </a>
                <span className="text-ink-faint">&ensp;/&ensp;</span>
                <a href="https://blakeziegler.app" target="_blank" rel="noreferrer" className={LINK}>
                  blakeziegler.app ↗
                </a>
                <span className="text-ink-faint">&ensp;/&ensp;</span>
                <a href="mailto:blake@bzsystems.io" className={LINK}>
                  blake@bzsystems.io
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* What I build */}
        <section className="bg-wash">
          <div aria-hidden className="h-[2px] bg-signal shadow-glow" />
          <Reveal className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
            <SectionRule sec="01" title="What I build" />
            <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-line bg-line lg:grid-cols-2">
              {WORK.map((w) => (
                <div key={w.label} className="bg-panel p-8 lg:p-10">
                  <p className="type-semi-extended text-h2 uppercase">{w.label}</p>
                  <p className="mt-4 text-ink-dim">{w.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* How I work */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
          <Reveal>
            <SectionRule sec="02" title="How I work" />
            <ol className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {RULES.map((r, i) => (
                <li key={r.title} className="border-t border-line pt-6">
                  <p className="font-mono text-label text-signal-bright">{String(i + 1).padStart(2, "0")}</p>
                  <p className="type-semi-extended mt-3 text-h3 uppercase">{r.title}</p>
                  <p className="mt-2 text-ink-dim">{r.body}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>

        {/* The company */}
        <section className="relative overflow-hidden bg-night">
          <div aria-hidden className="h-[2px] bg-signal shadow-glow" />
          <Reveal className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
            <SectionRule sec="03" title="The company" dark />
            <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
              <h2 className="type-semi-extended max-w-[19ch] text-h2 uppercase text-void">
                Run like a startup.
                <br />
                Held like a holdco.
              </h2>
              <div className="flex flex-col gap-5 text-void/70">
                <p>
                  BZ Systems is a holding company. It owns a small set of my
                  own software ventures, each under its own brand, and the
                  client work runs on the same stack and the same habits.
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

        {/* Close: point at the contact form */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <p
              className="type-extended text-display uppercase"
              style={{ fontSize: "clamp(1.75rem, 4.5vw, 3.5rem)" }}
            >
              Have an idea? <span className="text-signal-bright">Let&apos;s build it.</span>
            </p>
            <Link
              href="/#contact"
              className="rounded-sm bg-signal px-8 py-3 font-mono text-label uppercase text-panel shadow-glow transition-all duration-200 hover:bg-signal-bright"
            >
              Start something
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
