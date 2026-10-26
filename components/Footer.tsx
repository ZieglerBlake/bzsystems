import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-line-soft">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 py-14 text-center lg:px-12">
        <Image
          src="/logo-mark.png"
          alt="BZ Systems logo"
          width={94}
          height={80}
          className="h-20 w-auto"
        />
        <div className="flex max-w-3xl flex-col gap-2 font-mono text-legal text-ink-faint">
          <p>© 2026 BZ SYSTEMS LLC, OHIO, USA. ALL RIGHTS RESERVED.</p>
          <p>
            BZ SYSTEMS LLC IS A PRIVATELY HELD HOLDING COMPANY. EACH VENTURE OPERATES UNDER ITS OWN
            BRAND AND IS OWNED BY BZ SYSTEMS LLC OR ITS AFFILIATES.
          </p>
        </div>
      </div>
    </footer>
  );
}
