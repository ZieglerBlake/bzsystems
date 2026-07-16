import Button from "@/components/Button";
import ProductPageLayout from "@/components/ProductPageLayout";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { VRC_FALLBACK_MAILTO, VRC_FUNNEL_URL } from "@/lib/site";

const axes = [
  ["ROI Honesty", "Are the claimed returns real and provable?"],
  ["Integration Tax", "How easily does it connect to what you already run?"],
  ["Build-vs-Buy Moat", "Real defensible value, or a thin wrapper?"],
  ["Time-to-Value", "How fast until real payback?"],
  ["Lock-in Safety", "How safe is it to exit?"],
] as const;

const steps = [
  ["Answer a short readiness audit", "A few minutes on where your business actually stands — no sales call."],
  ["Get your free verdict", "Your readiness result and buyer archetype, stated plainly."],
  ["Upgrade for the full analysis", "Profile-matched vendor recommendations with go/no-go reasoning, from $99."],
] as const;

export default function VendorRealityCheck() {
  return (
    <ProductPageLayout
      eyebrow="Vendor Reality Check"
      headline="Know whether an AI vendor is worth it — before you sign."
      lede="A grounded verdict on any AI vendor, scored the way an operator scores it, not the way a brochure does."
    >
      {/* Benefit sections — editorial columns, prose over icon grids */}
      <Reveal>
        <section className="grid gap-12 border-t border-border-soft py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <SectionHeading
              eyebrow="The problem"
              heading="Every vendor demo looks the same"
            />
            <p className="mt-6 max-w-[68ch] text-ink-muted">
              AI vendors are pitched on inflated ROI, hidden integration
              costs, and contracts that are easy to enter and expensive to
              leave. The materials you&rsquo;re handed are built to close, not
              to inform. Vendor Reality Check exists to give you the other
              document — the one written for the buyer.
            </p>
          </div>
          <div>
            <SectionHeading
              eyebrow="The method"
              heading="Five axes, no charts, no hype"
            />
            <ul className="mt-6 flex flex-col gap-4">
              {axes.map(([name, question]) => (
                <li key={name} className="flex flex-col gap-1">
                  <span className="font-mono text-eyebrow uppercase text-accent-ink">
                    {name}
                  </span>
                  <span className="text-ink-muted">{question}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Reveal>

      {/* How it works */}
      <Reveal>
        <section className="border-t border-border-soft py-16 lg:py-24">
          <SectionHeading eyebrow="How it works" heading="Three steps to a straight answer" />
          <ol className="mt-12 grid gap-8 lg:grid-cols-3">
            {steps.map(([title, detail], i) => (
              <li key={title} className="flex flex-col gap-3">
                <span className="font-mono text-eyebrow uppercase text-ink-muted">
                  Step {i + 1}
                </span>
                <h3 className="text-h3">{title}</h3>
                <p className="text-ink-muted">{detail}</p>
              </li>
            ))}
          </ol>
        </section>
      </Reveal>

      {/* Conversion block — free verdict → paid tiers */}
      <section
        id="get-your-verdict"
        className="border-t border-border-soft py-16 lg:py-32"
      >
        <SectionHeading
          eyebrow="Pricing"
          heading="Start free. Pay only for the full picture."
        />
        <div className="mt-12 flex flex-col gap-6">
          {[
            {
              no: "01",
              name: "The free verdict",
              body: "Answer a short readiness audit and get your result and buyer archetype, stated plainly. This is the honest baseline — where your business actually stands before anyone tries to sell you anything.",
              chips: ["Free", "A few minutes", "No sales call"],
            },
            {
              no: "02",
              name: "The full analysis",
              body: "Profile-matched vendor recommendations, each scored across the five axes, with go/no-go reasoning for your shortlist. The same vendor gets a different verdict depending on who you are — that fit analysis is what you're paying for.",
              chips: ["$99–299", "Five-axis scoring", "Go / no-go verdicts"],
            },
          ].map(({ no, name, body, chips }) => (
            <div
              key={no}
              className="rounded-md border border-border bg-surface p-8"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-eyebrow text-accent-ink">
                  {no}
                </span>
                <h3 className="text-h3">{name}</h3>
              </div>
              <p className="mt-4 max-w-[68ch] text-ink-muted">{body}</p>
              <ul className="mt-6 flex flex-wrap gap-3">
                {chips.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-sm border border-border px-4 py-2 font-mono text-eyebrow uppercase text-ink-muted"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Button href={VRC_FUNNEL_URL ?? VRC_FALLBACK_MAILTO}>
            Get your free verdict
          </Button>
        </div>
        <p className="mt-6 font-mono text-legal text-ink-muted">
          No charts. No sales call. A verdict you can act on.
        </p>
      </section>
    </ProductPageLayout>
  );
}
