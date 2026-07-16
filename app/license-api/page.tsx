import ProductPageLayout from "@/components/ProductPageLayout";
import WaitlistForm from "@/components/WaitlistForm";

/* One screen, per FOUNDING-BRIEF §3/§6 — coming soon, do not pad. */

export default function LicenseApi() {
  return (
    <ProductPageLayout
      eyebrow="License Verification API · Coming soon"
      headline="Professional-license verification as one API call."
      lede="Verify a professional license programmatically instead of scraping state boards. Built for developers; docs arrive with the beta."
    >
      <section className="border-t border-border-soft pt-12 pb-24 lg:pt-16 lg:pb-32">
        <p className="mb-8 max-w-[68ch] text-ink-muted">
          Join the developer waitlist and you&rsquo;ll get the endpoint,
          docs, and a key when the beta opens.
        </p>
        <WaitlistForm product="license-api" />
      </section>
    </ProductPageLayout>
  );
}
