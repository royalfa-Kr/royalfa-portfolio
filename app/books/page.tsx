import { booksData } from "@/data/books";
import Link from "next/link";

export default function BooksPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-24">
      <header className="mb-16 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-serif text-text-main mb-4">
          Published <span className="text-accent-gold">Books & Anthologies.</span>
        </h1>
        <p className="text-lg text-text-muted leading-relaxed">
          Colecciones de cuentos, antologías de relatos cortos y ficción exploratoria ya disponibles en formato digital.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {booksData.map((book) => (
          <div key={book.id} className="flex flex-col md:flex-row bg-base-surface border border-base-border rounded-sm overflow-hidden hover:border-accent-gold/30 transition-colors p-6 gap-6">
            {/* Portada del libro */}
            <div className="w-full md:w-48 flex-shrink-0">
              {book.coverPath ? (
                <img 
                  src={book.coverPath} 
                  alt={`Portada de ${book.title}`} 
                  className="w-full h-auto rounded-sm border border-base-border/50 shadow-lg"
                />
              ) : (
                <div className="w-full h-64 bg-base-dark flex items-center justify-center border border-base-border rounded-sm">
                  <span className="font-serif text-text-muted text-xs text-center px-2">[ Sin portada ]</span>
                </div>
              )}
            </div>
            
            {/* Información del libro */}
            <div className="flex flex-col justify-between flex-grow">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-serif text-text-main">{book.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-sm border border-accent-gold/40 text-accent-gold bg-accent-gold/5">
                    {book.status}
                  </span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed mb-6">
                  {book.synopsis}
                </p>
              </div>

              {book.kindleUrl && (
                <Link 
                  href={book.kindleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-accent-gold text-base-dark font-medium text-sm px-4 py-2 rounded-sm hover:bg-accent-goldHover transition-colors text-center md:w-max"
                >
                  Ver en Kindle Store
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}