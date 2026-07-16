import Image from "next/image";
import Link from "next/link";
import Button from "./Button";

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-soft bg-bg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-16">
        <Link href="/" aria-label="BZ Systems home">
          <Image
            src="/logo.png"
            alt="BZ Systems"
            width={75}
            height={56}
            priority
            className="h-11 w-auto mix-blend-multiply lg:h-14"
          />
        </Link>
        <div className="flex items-center gap-8">
          <Link
            href="/#products"
            className="text-ui text-ink transition-colors duration-[180ms] ease-out-quart hover:text-green-700"
          >
            Products
          </Link>
          <Link
            href="/#about"
            className="text-ui text-ink transition-colors duration-[180ms] ease-out-quart hover:text-green-700"
          >
            About
          </Link>
          <span className="hidden sm:inline-flex">
            <Button href="mailto:blake@bzsystems.io">Get in touch</Button>
          </span>
        </div>
      </nav>
    </header>
  );
}
