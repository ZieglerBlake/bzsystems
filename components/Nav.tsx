import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line-soft bg-void/85 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
        <Link href="/" aria-label="BZ Systems home">
          <Image
            src="/logo.png"
            alt="BZ Systems"
            width={64}
            height={48}
            priority
            className="h-12 w-auto mix-blend-multiply"
          />
        </Link>
        <div className="flex items-center gap-6 font-mono text-label uppercase sm:gap-8">
          <Link href="/ventures" className="text-ink-dim transition-colors hover:text-ink">
            Ventures
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
