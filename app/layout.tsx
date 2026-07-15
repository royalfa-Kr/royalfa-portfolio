import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import NavbarSwitcher from "@/components/layout/NavbarSwitcher";
import Footer from "@/components/layout/Footer";

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
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        {/* El selector decidirá de forma automática cuál de los dos menús renderizar */}
        <NavbarSwitcher />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="border-t border-base-border py-8 text-center mt-12">
          <p className="text-sm text-text-muted">
            <Footer />
          </p>
          <p className="text-sm text-text-muted mt-2">
            © {new Date().getFullYear()} Royalfa. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}