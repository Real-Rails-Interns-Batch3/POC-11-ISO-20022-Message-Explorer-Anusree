import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ISO 20022 Message Explorer | Real Rails Intelligence Library",
  description:
    "Production-style demo for exploring ISO 20022 payment message structures. Parse, validate, compare MT vs MX formats, and browse the field glossary across FedNow, SEPA, and SWIFT networks.",
  keywords: [
    "ISO 20022",
    "payment messages",
    "SWIFT",
    "FedNow",
    "SEPA",
    "pacs.008",
    "message explorer",
    "fintech",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
