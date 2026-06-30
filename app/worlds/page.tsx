export default function WorldsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-24">
      <header className="mb-16 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-serif text-text-main mb-4">
          Fantasy <span className="text-accent-gold">Worlds.</span>
        </h1>
        <p className="text-lg text-text-muted leading-relaxed">
          El archivo central de lore, mapas y mitología. 
        </p>
      </header>

      <div className="bg-base-surface border border-base-border border-dashed p-8 md:p-16 rounded-sm text-center max-w-3xl mx-auto">
        <div className="text-accent-gold/50 mb-6 flex justify-center">
          {/* Un ícono simple de SVG que parece un candado o archivo */}
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-serif text-text-main mb-4">El Archivo está Sellado (Temporalmente)</h2>
        <p className="text-text-muted mb-8 max-w-lg mx-auto leading-relaxed">
          Los registros de este mundo nacieron en plataformas externas. Actualmente estamos en proceso de transcribir los antiguos tomos, reconectar las líneas ley y construir una wiki propia aquí mismo, para que el lore sea siempre accesible y nuestro.
        </p>
        <span className="inline-block border border-accent-gold/40 text-accent-gold bg-accent-gold/5 text-xs px-4 py-2 rounded-sm uppercase tracking-wider">
          Status: Migration in Progress
        </span>
      </div>
    </div>
  );
}