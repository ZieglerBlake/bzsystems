export default function SectionRule({
  sec,
  title,
  dark = false,
}: {
  sec: string;
  title: string;
  dark?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-4">
      <span
        className={`whitespace-nowrap font-mono text-label uppercase ${
          dark ? "text-[#5B9BE8]" : "text-signal-bright"
        }`}
      >
        {sec}
      </span>
      <span
        className={`whitespace-nowrap font-mono text-label uppercase ${
          dark ? "text-void/40" : "text-ink-faint"
        }`}
      >
        {title}
      </span>
      <span className={`rule-draw h-px flex-1 self-center ${dark ? "bg-void/20" : "bg-line"}`} />
      <span
        className={`hidden font-mono text-legal sm:block ${
          dark ? "text-void/40" : "text-ink-faint"
        }`}
      >
        +
      </span>
    </div>
  );
}
