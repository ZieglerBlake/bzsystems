import Link from "next/link";

type ButtonProps = {
  variant?: "primary" | "secondary" | "text";
  href?: string;
  type?: "submit" | "button";
  disabled?: boolean;
  children: React.ReactNode;
};

const variants = {
  primary:
    "rounded-md bg-green-800 px-6 py-3 text-bg hover:bg-green-700 disabled:opacity-60",
  secondary: "rounded-md border border-border px-6 py-3 text-ink hover:border-accent",
  text: "text-green-800 underline decoration-border underline-offset-4 hover:decoration-accent",
};

export default function Button({
  variant = "primary",
  href,
  type = "button",
  disabled,
  children,
}: ButtonProps) {
  const className = `inline-flex items-center justify-center gap-2 text-ui transition-colors duration-[180ms] ease-out-quart ${variants[variant]}`;

  if (href) {
    const external = href.startsWith("http") || href.startsWith("mailto:");
    return external ? (
      <a href={href} className={className}>
        {children}
      </a>
    ) : (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} disabled={disabled} className={className}>
      {children}
    </button>
  );
}
