import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bzsystems.io"),
  title: "BZ Systems",
  description:
    "BZ Systems LLC is a technology building company. We design, build, and operate our own software ventures, each on its own domain.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "BZ Systems",
    /* Approved hero subline. The root description above is a separate open
       copy flag (HANDOFF.md) and is deliberately not reused here. */
    description:
      "BZ Systems designs, builds, and operates its own software products. Each one is owned and operated in-house, from architecture to invoice.",
    url: "/",
    siteName: "BZ Systems",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BZ Systems",
    description:
      "BZ Systems designs, builds, and operates its own software products. Each one is owned and operated in-house, from architecture to invoice.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${jetbrainsMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
