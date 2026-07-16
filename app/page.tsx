import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { SENTINEL_URL } from "@/lib/site";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero — copy-forward editorial, no CTA competing with the grid */}
        <section className="relative">
          {/* Structural hairlines + brass registration marks, aligned to the
              content gutters — decorative only. */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="mx-auto h-full max-w-6xl px-6 lg:px-16">
              <div className="relative h-full border-x border-border-soft">
                <span className="absolute -left-[5px] top-12 font-mono text-legal text-accent">
                  +
                </span>
                <span className="absolute -right-[5px] top-12 font-mono text-legal text-accent">
                  +
                </span>
                <span className="absolute -left-[5px] bottom-12 font-mono text-legal text-accent">
                  +
                </span>
                <span className="absolute -right-[5px] bottom-12 font-mono text-legal text-accent">
                  +
                </span>
                <div className="absolute left-2/3 top-0 hidden h-full border-l border-border-soft lg:block" />
              </div>
            </div>
          </div>
          <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-24 lg:px-16 lg:pt-32 lg:pb-32">
            <div className="flex flex-col gap-5 lg:gap-7">
              <h1 className="rise-in max-w-[22ch] text-h1">
                An independent studio building tools that solve real problems.
              </h1>
              <p className="rise-in rise-in-delay-1 max-w-[58ch] text-ink-muted">
                Every product here is designed, built, and shipped in-house —
                AI vendor diligence, skill infrastructure, and verification
                APIs. No hype, no outsourcing.
              </p>
              <ul className="rise-in rise-in-delay-2 flex flex-wrap gap-3 pt-2">
                {["Ohio LLC", "Four products", "Self-authored"].map((fact) => (
                  <li
                    key={fact}
                    className="rounded-sm border border-border px-4 py-2 font-mono text-eyebrow uppercase text-ink-muted"
                  >
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Portfolio bento — VRC weighted largest, License API smallest */}
        <section
          id="products"
          className="mx-auto max-w-6xl px-6 pb-16 lg:px-16 lg:pb-24"
        >
          <SectionHeading eyebrow="Products" heading="What the studio ships" />
          <div className="mt-12 grid gap-6 lg:grid-cols-6">
            <ProductCard
              variant="route"
              flagship
              index="P1"
              className="lg:col-span-4 lg:row-span-2"
              eyebrow="Flagship · AI vendor diligence"
              name="Vendor Reality Check"
              oneLiner="A grounded verdict on whether an AI vendor is actually worth buying — scored across five axes an operator cares about, with go/no-go reasoning instead of a brochure."
              ctaLabel="Get your free verdict"
              href="/vendor-reality-check#get-your-verdict"
            >
              <ul className="mt-2 hidden flex-col gap-3 border-t border-border-soft pt-5 lg:flex">
                {[
                  ["ROI Honesty", "Are the claimed returns real?"],
                  ["Integration Tax", "How easily does it connect?"],
                  ["Build-vs-Buy Moat", "Real value, or a wrapper?"],
                  ["Time-to-Value", "How fast to payback?"],
                  ["Lock-in Safety", "How safe is it to exit?"],
                ].map(([axis, question]) => (
                  <li
                    key={axis}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <span className="font-mono text-eyebrow uppercase">
                      {axis}
                    </span>
                    <span className="text-right text-ui text-ink-muted">
                      {question}
                    </span>
                  </li>
                ))}
              </ul>
            </ProductCard>
            <ProductCard
              variant="external"
              index="P2"
              className="lg:col-span-2"
              eyebrow="Compliance intelligence"
              name="Sentinel"
              oneLiner="White-label regulatory-change briefs for boutique compliance consultancies. Lives on its own domain."
              ctaLabel="Visit Sentinel"
              href={SENTINEL_URL}
            />
            <ProductCard
              variant="route"
              index="P3"
              className="lg:col-span-2"
              eyebrow="Skill infrastructure"
              name="SkillShelf"
              oneLiner="A home for the AI skills your team actually trusts — kept, versioned, reusable."
              ctaLabel="Join the waitlist"
              href="/skillshelf#waitlist"
            />
            <ProductCard
              variant="waitlist-teaser"
              index="P4"
              className="lg:col-span-6"
              eyebrow="Coming soon · For developers"
              name="License Verification API"
              oneLiner="Professional-license verification as a single API call."
              ctaLabel="Join the developer waitlist"
              href="/license-api"
            />
          </div>
        </section>

        {/* About — tinted band for rhythm variation */}
        <section id="about" className="bg-green-100">
          <Reveal className="mx-auto max-w-6xl px-6 py-16 lg:px-16 lg:py-24">
            <SectionHeading eyebrow="About" heading="A studio of one, deliberately" />
            <div className="mt-8 flex max-w-[68ch] flex-col gap-4">
              <p>
                BZ Systems is an independent software studio run by Blake
                Ziegler. Everything on this page is self-authored — designed,
                built, and maintained by the person whose name is on the LLC.
              </p>
              <p>
                The through-line is credibility: tools that tell you the truth
                about what works, whether that&rsquo;s an AI vendor&rsquo;s
                real fit or a professional license&rsquo;s real status.
              </p>
              <p>
                The person behind the studio lives at{" "}
                <a
                  href="https://blakeziegler.app"
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-800 underline decoration-border underline-offset-4 transition-colors duration-[180ms] ease-out-quart hover:decoration-accent"
                >
                  blakeziegler.app
                </a>
                .
              </p>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
