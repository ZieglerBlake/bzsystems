import Image from "next/image";
import Link from "next/link";

const products = [
  { label: "Vendor Reality Check", href: "/vendor-reality-check" },
  { label: "SkillShelf", href: "/skillshelf" },
  { label: "License Verification API", href: "/license-api" },
];

const sentinelUrl = process.env.NEXT_PUBLIC_SENTINEL_URL;

export default function Footer() {
  return (
    <footer className="bg-green-900">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-16 lg:py-24">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          {/* Supplied light asset, luminance-inverted in CSS (no dark asset was
              provided); hue-rotate restores the blue dash, screen drops the bg. */}
          <Image
            src="/logo.png"
            alt="BZ Systems"
            width={139}
            height={104}
            className="h-[104px] w-auto self-start contrast-[1.1] invert hue-rotate-180 mix-blend-screen"
          />
          <div className="flex flex-col gap-12 sm:flex-row sm:gap-24">
            <div>
              <p className="font-mono text-eyebrow uppercase text-accent">Products</p>
              <ul className="mt-4 flex flex-col gap-3">
                {products.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-ui text-bg/66 transition-colors duration-[180ms] ease-out-quart hover:text-bg"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href={sentinelUrl ?? "#"}
                    target={sentinelUrl ? "_blank" : undefined}
                    rel={sentinelUrl ? "noreferrer" : undefined}
                    aria-disabled={!sentinelUrl}
                    className="text-ui text-bg/66 transition-colors duration-[180ms] ease-out-quart hover:text-bg"
                  >
                    Sentinel ↗
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-eyebrow uppercase text-accent">Contact</p>
              <ul className="mt-4 flex flex-col gap-3">
                <li>
                  <a
                    href="mailto:blake@bzsystems.io"
                    className="text-ui text-bg/66 transition-colors duration-[180ms] ease-out-quart hover:text-bg"
                  >
                    blake@bzsystems.io
                  </a>
                </li>
                <li>
                  <a
                    href="https://blakeziegler.app"
                    target="_blank"
                    rel="noreferrer"
                    className="text-ui text-bg/66 transition-colors duration-[180ms] ease-out-quart hover:text-bg"
                  >
                    blakeziegler.app ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-bg/14 pt-8">
          <p className="font-mono text-legal text-bg/45">
            © 2026 BZ Systems LLC. An independent studio.
          </p>
        </div>
      </div>
    </footer>
  );
}
