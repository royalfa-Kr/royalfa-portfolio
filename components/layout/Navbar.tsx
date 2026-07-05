"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "About", href: "/about" },
  { name: "Clases 1a1", href: "/clases" },
  { name: "Arkham Horror LCG", href: "/arkham" },
  { name: "Books", href: "/books" },
  { name: "Worlds", href: "/worlds" },
  { name: "Apps", href: "/apps" },
  { name: "Support", href: "/support" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="border-b border-base-border bg-base-dark/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="font-serif text-2xl text-accent-gold hover:text-accent-goldHover transition-colors">
          Royalfa
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm tracking-wider uppercase transition-colors ${
                  isActive ? "text-accent-gold" : "text-text-muted hover:text-text-main"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* Botón de Ko-fi para el menú */}
            <a 
              href="https://ko-fi.com/royalfa" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-accent-gold/10 text-accent-gold border border-accent-gold/30 rounded-sm hover:bg-accent-gold hover:text-base-dark transition-all duration-300"
          >
          {/* Ícono de tacita de café SVG */}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 10h2a2 2 0 012 2v2a2 2 0 01-2 2h-2"></path>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 4v1"></path>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 4v1"></path>
              </svg>
              <span>Invítame un café</span>
            </a>

        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-text-main focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-base-surface border-b border-base-border">
          <div className="px-6 py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm tracking-wider uppercase text-text-muted hover:text-accent-gold transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}