import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'bootstrap-icons/font/bootstrap-icons.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mace Swinger",
  description: "Clever Description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/mace-swinger/manifest.json" />
        <link rel="apple-touch-icon" href="/resources/icons/icon-512x512.png" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css" rel="stylesheet"></link>
        <meta name="theme-color" content="#000" />
      </head>
      <body className={inter.className}>
        <div className="flex justify-center items-center w-screen h-auto bg-transparent">
          {children}
          
        </div>
        
        </body>
    </html>
  );
}
