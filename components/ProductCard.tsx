import Link from "next/link";

type ProductCardProps = {
  variant: "route" | "external" | "waitlist-teaser";
  eyebrow: string;
  name: string;
  oneLiner: string;
  ctaLabel: string;
  href?: string;
  flagship?: boolean;
  index?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function ProductCard({
  variant,
  eyebrow,
  name,
  oneLiner,
  ctaLabel,
  href,
  flagship,
  index,
  children,
  className = "",
}: ProductCardProps) {
  const strip = variant === "waitlist-teaser";
  const disabled = variant === "external" && !href;

  const cardClass = `group flex flex-col gap-4 rounded-md border border-border bg-surface p-8 transition-[border-color,box-shadow,transform] duration-[180ms] ease-out-quart hover:border-accent hover:shadow-lift motion-safe:hover:-translate-y-0.5 ${
    strip ? "lg:flex-row lg:items-center lg:justify-between lg:gap-8" : ""
  } ${className}`;

  const body = (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-mono text-eyebrow uppercase text-ink-muted">{eyebrow}</p>
        {index && (
          <span aria-hidden className="font-mono text-eyebrow text-accent-ink">
            {index}
          </span>
        )}
      </div>
      <h3 className={flagship ? "text-h3-flagship" : "text-h3"}>{name}</h3>
      <p className="max-w-[68ch] text-ink-muted">{oneLiner}</p>
      {children}
    </div>
  );

  const cta = (
    <p
      className={`${strip ? "lg:whitespace-nowrap" : "mt-auto"} pt-2 text-ui transition-colors duration-[180ms] ease-out-quart ${
        disabled
          ? "text-ink-muted"
          : "text-green-800 group-hover:text-green-700"
      }`}
    >
      {ctaLabel}{" "}
      <span className="inline-block transition-transform duration-[180ms] ease-out-quart motion-safe:group-hover:translate-x-0.5">
        {variant === "external" ? "↗" : "→"}
      </span>
    </p>
  );

  if (variant === "external") {
    return (
      <a
        href={href ?? "#"}
        target={href ? "_blank" : undefined}
        rel={href ? "noreferrer" : undefined}
        aria-disabled={!href}
        className={cardClass}
      >
        {body}
        {cta}
      </a>
    );
  }
  return (
    <Link href={href ?? "#"} className={cardClass}>
      {body}
      {cta}
    </Link>
  );
}
