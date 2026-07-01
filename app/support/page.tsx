export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-24 flex flex-col items-center text-center">
      
      {/* Imagen del Dragón */}
      {/* Imagen del Dragón con pie de página */}
      <figure className="w-full max-w-lg mb-12 flex flex-col items-center">
        <div className="rounded-sm overflow-hidden border border-accent-gold/20 shadow-lg w-full">
          <img 
            src="images/books/DragonKofi.jpg" 
            alt="Dragón erudito tomando café" 
            className="w-full h-auto object-cover"
          />
        </div>
        <figcaption className="text-xs text-text-muted mt-3 font-mono opacity-70">
          Made with Gemini AI
        </figcaption>
      </figure>
      
      {/* Encabezado */}
      <h1 className="text-4xl md:text-5xl font-serif text-text-main mb-6">
        Apoya a <span className="text-accent-gold">Royalfa</span>
      </h1>
      
      <p className="text-xl text-text-muted font-serif italic mb-12 max-w-2xl">
        Ayúdame a seguir construyendo historias, mundos, diseños custom y herramientas creativas.
      </p>

      {/* Cuerpo del texto */}
      <div className="space-y-6 text-text-muted leading-relaxed text-left max-w-2xl mx-auto mb-12">
        <p className="text-lg text-text-main text-center mb-8">
          Royalfa es mi archivo creativo: un espacio donde convergen las historias, el worldbuilding, el diseño custom y las herramientas interactivas.
        </p>
        <p>
          Aquí comparto libros publicados, investigadores personalizados, apps experimentales, escenarios fantásticos y proyectos que crecen a través de la escritura, el diseño y la iteración constante.
        </p>
        <p>
          Si disfrutas mi trabajo y te gustaría apoyarlo, Ko-fi es la forma más sencilla de hacerlo. Tu apoyo me ayuda a seguir creando nuevas historias, refinando contenido custom, desarrollando herramientas educativas y creativas, y expandiendo este ecosistema con el tiempo.
        </p>
        <p>
          Ya sea que llegues por la ficción, el diseño de juegos, el worldbuilding o las apps, cada aporte ayuda a mantener vivos estos proyectos y a seguirlos llevando más lejos.
        </p>
      </div>

      {/* Llamado a la acción */}
      <div className="flex flex-col items-center gap-6">
        <p className="text-text-main font-serif text-lg">
          Si quieres apoyar a Royalfa, puedes hacerlo aquí:
        </p>
        
        <a 
          href="https://ko-fi.com/royalfa" 
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 px-8 py-4 bg-accent-gold/10 text-accent-gold border border-accent-gold rounded-sm hover:bg-accent-gold hover:text-base-dark transition-all duration-300 shadow-lg shadow-accent-gold/5"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 10h2a2 2 0 012 2v2a2 2 0 01-2 2h-2"></path>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 4v1"></path>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 4v1"></path>
          </svg>
          <span className="font-serif text-xl font-bold">Apoyar en Ko-fi</span>
        </a>
      </div>

    </div>
  );
}