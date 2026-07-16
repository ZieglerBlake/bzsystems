import Eyebrow from "./Eyebrow";

type SectionHeadingProps = {
  eyebrow: string;
  heading: string;
  lede?: string;
};

export default function SectionHeading({ eyebrow, heading, lede }: SectionHeadingProps) {
  return (
    <div>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-h2">{heading}</h2>
      {lede && <p className="mt-4 max-w-[68ch] text-ink-muted">{lede}</p>}
    </div>
  );
}
