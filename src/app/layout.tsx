import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mace Swinger",
  description: "Description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/mace-swinger/manifest.json" />
        <link rel="apple-touch-icon" href="/resources/icons/icon-512x512.png" />
        <meta name="theme-color" content="#000" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
