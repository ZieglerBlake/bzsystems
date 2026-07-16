import ProductPageLayout from "@/components/ProductPageLayout";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import WaitlistForm from "@/components/WaitlistForm";

export default function SkillShelf() {
  return (
    <ProductPageLayout
      eyebrow="SkillShelf"
      headline="The AI skills your team trusts, in one place."
      lede="Prompts and skills that work end up scattered across chats, docs, and someone's memory. SkillShelf keeps them."
    >
      {/* Benefit sections */}
      <Reveal>
        <section className="grid gap-12 border-t border-border-soft py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <SectionHeading
              eyebrow="The problem"
              heading="Good skills die in scrollback"
            />
            <p className="mt-6 max-w-[68ch] text-ink-muted">
              When a prompt or skill finally works, it lives wherever it
              happened to be born — a chat log, a gist, a teammate&rsquo;s
              notes. Six weeks later someone rebuilds it from scratch, worse.
            </p>
          </div>
          <div>
            <SectionHeading
              eyebrow="The product"
              heading="A shelf, not another workspace"
            />
            <p className="mt-6 max-w-[68ch] text-ink-muted">
              SkillShelf is deliberately small: keep the skills that earn
              their place, version them as they improve, and reuse them
              anywhere you work. No pipeline to adopt, no platform to migrate
              to.
            </p>
          </div>
        </section>
      </Reveal>

      {/* Conversion block */}
      <section id="waitlist" className="border-t border-border-soft py-16 lg:py-32">
        <SectionHeading
          eyebrow="Waitlist"
          heading="Be first on the shelf"
          lede="One email when it opens. Nothing else."
        />
        <div className="mt-8">
          <WaitlistForm product="skillshelf" />
        </div>
      </section>
    </ProductPageLayout>
  );
}
