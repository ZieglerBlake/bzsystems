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
  /* Drawn verbatim from the hero subline; replaces the retired
     "own domain" description (see HANDOFF copy flags). */
  description:
    "An independent software studio building AI, data, and automation products, and putting the same stack to work for financial institutions, auditees, and operators who need systems that hold up.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "BZ Systems",
    description:
      "An independent software studio building AI, data, and automation products, and putting the same stack to work for financial institutions, auditees, and operators who need systems that hold up.",
    url: "/",
    siteName: "BZ Systems",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BZ Systems",
    description:
      "An independent software studio building AI, data, and automation products, and putting the same stack to work for financial institutions, auditees, and operators who need systems that hold up.",
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
