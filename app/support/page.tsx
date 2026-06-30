import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-24 text-center">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-text-main mb-6">
          Support the <span className="text-accent-gold">Archive.</span>
        </h1>
        <p className="text-lg text-text-muted leading-relaxed max-w-2xl mx-auto">
          Todo el contenido en este sitio —desde los investigadores personalizados y aplicaciones interactivas, hasta los relatos cortos— se crea con mucha dedicación. Si mi trabajo te ha sido útil o te ha inspirado, considera invitarme un café.
        </p>
      </header>

      <div className="bg-base-surface border border-base-border p-8 md:p-12 rounded-sm mx-auto max-w-lg hover:border-accent-gold/30 transition-colors">
        <h2 className="text-2xl font-serif text-text-main mb-4">Ko-fi</h2>
        <p className="text-sm text-text-muted mb-8">
          Tu apoyo me ayuda a pagar el hosting, mantener las herramientas gratuitas y dedicar más tiempo a diseñar nuevos sistemas de juego e historias.
        </p>
        <Link 
          href="https://ko-fi.com/TU_USUARIO_AQUI" /* <-- Reemplaza cuando crees tu cuenta */
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-accent-gold text-base-dark font-medium px-8 py-3 rounded-sm hover:bg-accent-goldHover transition-colors"
        >
          ☕ Invítame un café
        </Link>
      </div>
    </div>
  );
}