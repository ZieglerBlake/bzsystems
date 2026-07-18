import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line-soft bg-void/85 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
        <Link href="/" aria-label="BZ Systems home">
          <Image
            src="/logo.png"
            alt="BZ Systems logo"
            width={64}
            height={48}
            priority
            className="h-12 w-auto mix-blend-multiply"
          />
        </Link>
        <div className="flex items-center gap-6 font-mono text-label uppercase sm:gap-8">
          <Link
            href="/ventures"
            className="flex items-center gap-1.5 text-ink-dim transition-colors hover:text-ink"
          >
            Ventures
            {/* Padlock: the registry is sealed while in build */}
            <svg aria-hidden viewBox="0 0 12 12" className="h-3 w-3 shrink-0">
              <rect x="2" y="5.5" width="8" height="5" rx="1" fill="currentColor" />
              <path
                d="M4 5.5V4a2 2 0 0 1 4 0v1.5"
                stroke="currentColor"
                strokeWidth="1.3"
                fill="none"
              />
            </svg>
          </Link>
          <Link href="/about" className="text-ink-dim transition-colors hover:text-ink">
            About us
          </Link>
          <Link
            href="/#contact"
            className="rounded-sm border border-line px-4 py-2 text-ink transition-all duration-200 hover:border-signal hover:shadow-glow"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
