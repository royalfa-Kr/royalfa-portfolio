import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-base-dark border-t border-base-border pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Usamos flex-col en móvil para poder cambiar el orden, y grid en desktop */}
        <div className="flex flex-col md:grid md:grid-cols-4 gap-12 mb-16">
          
          {/* Columna 1 — Brand (Siempre primero) */}
          <div className="order-1 md:order-none flex flex-col items-start">
            <Link href="/" className="font-serif text-2xl text-accent-gold mb-4 hover:text-accent-goldHover transition-colors">
              Royalfa
            </Link>
            <p className="text-sm text-text-muted leading-relaxed">
              Stories, worlds, educational tools, and creative projects.
            </p>
          </div>

          {/* Columna 3 — Work With Me (Sube al 2do lugar en móvil, se queda en 3er lugar en PC) */}
          <div className="order-2 md:order-3">
            <h3 className="text-sm uppercase tracking-wider text-text-main font-semibold mb-4">Work With Me</h3>
            <ul className="space-y-3">
              <li><Link href="/clases" className="text-sm text-text-muted hover:text-accent-gold transition-colors">1:1 Science Classes</Link></li>
              <li><Link href="/apps" className="text-sm text-text-muted hover:text-accent-gold transition-colors">Educational Apps</Link></li>
              <li><Link href="/contact" className="text-sm text-text-muted hover:text-accent-gold transition-colors">Custom Development</Link></li>
              <li><Link href="/contact" className="text-sm text-text-muted hover:text-accent-gold transition-colors">Contact</Link></li>
              <li><Link href="/support" className="text-sm text-text-muted hover:text-accent-gold transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Columna 2 — Explore (Baja al 3er lugar en móvil, se queda en 2do lugar en PC) */}
          <div className="order-3 md:order-2">
            <h3 className="text-sm uppercase tracking-wider text-text-main font-semibold mb-4">Explore</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-text-muted hover:text-accent-gold transition-colors">About</Link></li>
              <li><Link href="/projects" className="text-sm text-text-muted hover:text-accent-gold transition-colors">Projects</Link></li>
              <li><Link href="/books" className="text-sm text-text-muted hover:text-accent-gold transition-colors">Books</Link></li>
              <li><Link href="/apps" className="text-sm text-text-muted hover:text-accent-gold transition-colors">Apps</Link></li>
              <li><Link href="/arkham" className="text-sm text-text-muted hover:text-accent-gold transition-colors">Investigators</Link></li>
              <li><Link href="/worlds" className="text-sm text-text-muted hover:text-accent-gold transition-colors">Worlds</Link></li>
            </ul>
          </div>

          {/* Columna 4 — Elsewhere (Siempre al final) */}
          <div className="order-4 md:order-4">
            <h3 className="text-sm uppercase tracking-wider text-text-main font-semibold mb-4">Elsewhere</h3>
            <ul className="space-y-3">
              <li><a href="https://ko-fi.com/royalfa" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-accent-gold transition-colors">Ko-fi</a></li>
              <li><a href="https://www.amazon.es/stores/Roy-Ramirez-Tomasini/author/B0GWTXRQQ3" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-accent-gold transition-colors">Kindle</a></li>
              <li><a href="https://www.linkedin.com/in/royalfa28/" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-accent-gold transition-colors">LinkedIn</a></li>
              {/* <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-accent-gold transition-colors">World Anvil</a></li> */}
              <li><a href="https://www.worldanvil.com/w/daimon-royalfa" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-accent-gold transition-colors">World Anvil</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom line */}
        <div className="pt-8 border-t border-base-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-muted">
            © 2026 Royalfa.
          </p>
          <p className="text-sm text-text-muted italic">
            Learning, systems, stories, and things built with curiosity.
          </p>
        </div>
        
      </div>
    </footer>
  );
}