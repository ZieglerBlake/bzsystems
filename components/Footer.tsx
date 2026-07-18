import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-line-soft">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-14 lg:flex-row lg:items-end lg:justify-between lg:px-12">
        <Image
          src="/logo.png"
          alt="BZ Systems logo"
          width={107}
          height={80}
          className="h-20 w-auto self-start mix-blend-multiply"
        />
        <div className="flex flex-col gap-2 font-mono text-legal text-ink-faint lg:text-right">
          <p>© 2026 BZ SYSTEMS LLC, OHIO, USA. ALL RIGHTS RESERVED.</p>
          <p>VENTURES SHIP ON THEIR OWN DOMAINS. THIS IS THE PARENT.</p>
        </div>
      </div>
    </footer>
  );
}
