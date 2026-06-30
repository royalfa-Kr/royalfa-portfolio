import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Royalfa | Stories, worlds, custom creations, and curious tools.",
  description: "The digital archive and creative portfolio of Royalfa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        {/* Footer simple integrado en el layout para Fase 1 */}
        <footer className="border-t border-base-border py-8 text-center mt-12">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} Royalfa. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}