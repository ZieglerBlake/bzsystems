import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import SectionRule from "@/components/SectionRule";
import SystemMap from "@/components/SystemMap";

export const metadata: Metadata = {
  title: "Ventures / BZ Systems",
};

export default function Ventures() {
  return (
    <>
      <Nav />
      <main>
        <section className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-ink">
          <div className="absolute inset-0 opacity-70">
            <SystemMap variant="dark" />
          </div>
          <div className="relative mx-auto w-full max-w-7xl px-6 pt-24 lg:px-12">
            <SectionRule sec="VENTURES" title="Live registry" dark />
            <h1 className="type-extended mt-10 max-w-[16ch] text-display uppercase text-void">
              The registry is{" "}
              <span className="text-[#5B9BE8]">in build.</span>
            </h1>
            <p className="mt-8 max-w-[52ch] text-body text-void/70">
              The full lineup, live and in build, will be published here. Each
              venture will state what it does, where it stands, and how to get
              in.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                href="/#contact"
                className="rounded-sm border border-signal px-8 py-3 font-mono text-label uppercase text-void transition-all duration-200 hover:bg-signal hover:shadow-glow"
              >
                Send an inquiry
              </Link>
              <p className="font-mono text-label uppercase text-void/50">
                Registry entries publish as ventures clear the gate.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
