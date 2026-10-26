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
    "BZ Systems is a software company based in Columbus, Ohio, founded on two backgrounds: investment banking and software engineering. We build software from the idea up: our own ventures, products for people with an idea worth building, and upgrades for teams whose processes need one.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About us / BZ Systems",
    description:
      "BZ Systems is a software company based in Columbus, Ohio, founded on two backgrounds: investment banking and software engineering. We build software from the idea up: our own ventures, products for people with an idea worth building, and upgrades for teams whose processes need one.",
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
      "BZ Systems is a software company based in Columbus, Ohio, founded on two backgrounds: investment banking and software engineering. We build software from the idea up: our own ventures, products for people with an idea worth building, and upgrades for teams whose processes need one.",
  },
};

const LINK =
  "text-ink-dim underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-signal";

/* What we build: the same two halves as the home headline, each with
   the kinds of work that fall under it. */
const WORK = [
  {
    label: "Your idea, built",
    title: "From a sketch to a live product",
    body: [
      "You bring the idea, even if it is only a page of notes and a rough sketch. We work out what version one actually needs, cut what can wait, and build the whole thing: the screens your users see, the systems behind them, and the infrastructure it runs on.",
      "You see it working early, not at the end. It ships when it is ready for real users, and it keeps improving from there.",
    ],
    items: [
      { title: "Web apps & platforms", body: "Customer-facing products, portals, and dashboards, built from the first screen up." },
      { title: "AI products", body: "Assistants and tools built on current AI models, wired into real data and real work." },
      { title: "APIs & integrations", body: "Connect the systems you already use so they finally talk to each other." },
    ],
  },
  {
    label: "Your process, upgraded",
    title: "The same work, minus the busywork",
    body: [
      "Most teams do not need a new system. They need the one they have to stop leaking time. We start by mapping your process exactly as it runs today, every step, every handoff, and identify the inefficiencies: the manual work, the waiting, and the rework that slow it down.",
      "From that map, we fix them one at a time. Nothing gets ripped out and nobody gets replaced. The fixes take the busywork off your team, so their time goes to the work that actually needs them. Every fix builds on the last.",
    ],
    items: [
      { title: "Workflow automation", body: "Intake, approvals, and handoffs that run themselves instead of living in inboxes." },
      { title: "Data & reporting", body: "Data lands where it is needed, and the reports build themselves." },
      { title: "Infrastructure", body: "Hosting, security, and monitoring set up to stay up." },
    ],
  },
];

export default function About() {
  return (
    <>
      <Nav />
      <main>
        {/* Intro: the founder's photo up top beside the company line */}
        <section className="relative overflow-hidden">
          {/* Oversized BZ mark, barely there, behind the intro */}
          <Image
            src="/logo-mark.png"
            alt=""
            aria-hidden
            width={732}
            height={626}
            priority
            className="pointer-events-none absolute right-[-12%] top-1/2 w-[110vw] max-w-[1000px] -translate-y-1/2 select-none opacity-[0.035] lg:right-[-4%] lg:opacity-[0.05] lg:w-[62vw]"
          />
          <div className="relative mx-auto max-w-7xl px-6 pt-36 pb-20 lg:px-12 lg:pt-44 lg:pb-28">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-20">
            {/* Founder card: the BZ mark sits with the photo, on a navy plate
                with an offset signal-blue frame behind it */}
            <div className="rise-in relative mx-auto w-full max-w-[280px] lg:max-w-[380px]">
              <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rounded-md border border-signal/50" />
              <figure className="relative overflow-hidden rounded-md bg-night p-3 shadow-glow">
                <div className="flex items-center justify-between px-1 pb-3">
                  <Image src="/logo-dark.png" alt="BZ Systems logo" width={1448} height={1086} className="-my-2 -ml-2 h-16 w-auto lg:h-20" />
                  <span className="font-mono text-legal uppercase text-void/50">Columbus, OH</span>
                </div>
                <div className="overflow-hidden rounded-sm">
                  <Image
                    src="/ziegler.webp"
                    alt="Blake Ziegler, founder of BZ Systems"
                    width={427}
                    height={513}
                    priority
                    className="w-full"
                  />
                </div>
                <div aria-hidden className="h-[2px] bg-signal shadow-glow" />
                <figcaption className="px-1 pt-3 font-mono text-legal uppercase text-void/60">
                  Blake Ziegler / Founder, Principal
                  <br />
                  <span className="text-void/85">Formerly Morgan Stanley</span>
                </figcaption>
              </figure>
            </div>
            <div>
              <p className="rise-in font-mono text-label uppercase text-signal-bright">About</p>
              <h1
                className="rise-in rise-in-delay-1 type-extended mt-4 text-display uppercase"
                style={{ fontSize: "clamp(1.3rem, 3.3vw, 2.7rem)" }}
              >
                Built from Columbus.
                <br />
                <span className="text-signal-bright">Built in America.</span>
              </h1>
              <p className="rise-in rise-in-delay-2 mt-8 max-w-[56ch] text-body text-ink-dim">
                BZ Systems is a software company based in Columbus, Ohio,
                founded on two backgrounds: investment banking and software
                engineering. The company runs on both: institutional standards
                and the speed of an agile team. We build software from the
                idea up: our own ventures, products for people with an idea
                worth building, and upgrades for teams whose processes need one.
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
          </div>
        </section>

        {/* What we build */}
        <section className="bg-wash">
          <div aria-hidden className="h-[2px] bg-signal shadow-glow" />
          <Reveal className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
            <SectionRule sec="01" title="What we build" />
            <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-line bg-line lg:grid-cols-2">
              {WORK.map((w) => (
                <div key={w.label} className="flex flex-col bg-panel p-8 lg:p-12">
                  <p className="font-mono text-label uppercase text-signal-bright">{w.label}</p>
                  <h2 className="type-semi-extended mt-4 text-h2 uppercase">{w.title}</h2>
                  <div className="mt-6 flex flex-col gap-4 text-ink-dim">
                    {w.body.map((p) => (
                      <p key={p.slice(0, 24)}>{p}</p>
                    ))}
                  </div>
                  <ul className="mt-10 flex flex-col">
                    {w.items.map((it) => (
                      <li key={it.title} className="border-t border-line py-5">
                        <p className="type-semi-extended text-h3 uppercase">{it.title}</p>
                        <p className="mt-1 text-ink-dim">{it.body}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
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
