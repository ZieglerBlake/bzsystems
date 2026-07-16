export default function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-block w-fit border-b border-accent pb-1 font-mono text-eyebrow uppercase text-accent-ink">
      {children}
    </p>
  );
}
