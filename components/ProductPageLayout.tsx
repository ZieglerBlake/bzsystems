import Eyebrow from "./Eyebrow";
import Footer from "./Footer";
import Nav from "./Nav";

type ProductPageLayoutProps = {
  eyebrow: string;
  headline: string;
  lede?: string;
  children: React.ReactNode;
};

export default function ProductPageLayout({
  eyebrow,
  headline,
  lede,
  children,
}: ProductPageLayoutProps) {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-6 lg:px-16">
        <header className="pt-16 pb-12 lg:pt-24 lg:pb-16">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-6 max-w-[24ch] text-h1">{headline}</h1>
          {lede && <p className="mt-6 max-w-[58ch] text-ink-muted">{lede}</p>}
        </header>
        {children}
      </main>
      <Footer />
    </>
  );
}
