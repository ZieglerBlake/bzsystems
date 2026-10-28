import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import RegistryLock from "@/components/RegistryLock";
import SectionRule from "@/components/SectionRule";
import SystemMap from "@/components/SystemMap";

export const metadata: Metadata = {
  title: "Ventures / BZ Systems",
  description:
    "The venture registry of BZ Systems. Each venture gets listed here as it goes live, with what it does, where it stands, and how to reach it.",
  alternates: { canonical: "/ventures" },
  openGraph: {
    title: "Ventures / BZ Systems",
    description:
      "The venture registry of BZ Systems. Each venture gets listed here as it goes live.",
    url: "/ventures",
    siteName: "BZ Systems",
    locale: "en_US",
    type: "website",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image.png"],
    title: "Ventures / BZ Systems",
    description:
      "The venture registry of BZ Systems. Each venture gets listed here as it goes live.",
  },
};

export default function Ventures() {
  return (
    <>
      <Nav />
      <main>
        <section className="relative flex min-h-svh flex-col justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-60">
            <SystemMap />
          </div>
          <div className="relative mx-auto w-full max-w-7xl px-6 py-32 lg:px-12">
            <SectionRule sec="VENTURES" title="Registry" />
            <h1 className="type-extended mt-10 max-w-[16ch] text-display uppercase">
              The registry is{" "}
              <span className="text-signal-bright">in build.</span>
            </h1>
            <p className="mt-8 max-w-[52ch] text-body text-ink-dim">
              Each venture gets listed here as it goes live, with what it does,
              where it stands, and how to reach it.
            </p>

            <RegistryLock />

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/"
                className="rounded-sm border border-line bg-void px-8 py-3 font-mono text-label uppercase text-ink transition-all duration-200 hover:border-signal hover:shadow-glow"
              >
                Back to home
              </Link>
              <Link
                href="/#contact"
                className="rounded-sm border border-signal bg-void px-8 py-3 font-mono text-label uppercase text-signal-bright transition-all duration-200 hover:bg-signal hover:text-panel hover:shadow-glow"
              >
                Send an inquiry
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
