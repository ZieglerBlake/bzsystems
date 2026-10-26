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
    "An independent studio that builds software from the idea up: for our own ventures, for people with an idea worth building, and for teams whose processes need upgrading.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "BZ Systems",
    description:
      "An independent studio that builds software from the idea up: for our own ventures, for people with an idea worth building, and for teams whose processes need upgrading.",
    url: "/",
    siteName: "BZ Systems",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BZ Systems",
    description:
      "An independent studio that builds software from the idea up: for our own ventures, for people with an idea worth building, and for teams whose processes need upgrading.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${archivo.variable} ${jetbrainsMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
