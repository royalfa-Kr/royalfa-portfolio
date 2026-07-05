"use client";
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="flex flex-col items-start gap-6">
      {/* Etiqueta de Formación */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-base-surface border border-base-border text-xs tracking-wider uppercase text-text-muted font-semibold">
        <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse"></span>
        Formación Actuarial • UNAM
      </div>
      
      {/* Título Principal */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-text-main leading-tight">
        Aprendizaje profundo. <br />
        <span className="text-accent-gold">Desarrollo interactivo.</span> <br />
        Mundos narrativos.
      </h1>
      
      {/* Descripción */}
      <p className="text-lg text-text-muted font-serif italic max-w-xl leading-relaxed">
        Soy Roy. Conecto la lógica de las ciencias exactas con la tecnología para crear herramientas de aprendizaje, impartir clases personalizadas y diseñar experiencias creativas.
      </p>
      
      {/* Botones de Acción */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
        <Link 
          href="/clases" 
          className="w-full sm:w-auto flex items-center justify-center text-center leading-tight gap-2 bg-accent-gold text-base-dark px-8 py-3 rounded-sm font-semibold hover:bg-accent-goldHover transition-colors"
        >
          Agendar Asesoría<br/>clases 1a1
        </Link>
        
        <Link 
          href="/apps" 
          className="w-full sm:w-auto flex items-center justify-center text-center leading-tight gap-2 bg-transparent border border-accent-gold/50 text-accent-gold px-8 py-3 rounded-sm font-semibold hover:bg-accent-gold/10 transition-colors"
        >
          Explorar<br/>Proyectos
        </Link>
        
        <a 
          href="#archivo-creativo" 
          className="w-full sm:w-auto flex items-center justify-center text-center leading-tight gap-2 bg-transparent border border-base-border text-text-muted px-8 py-3 rounded-sm font-semibold hover:border-text-main hover:text-text-main transition-colors"
        >
          Archivo<br/>Creativo <span className="text-lg leading-none">↓</span>
        </a>
      </div>
    </div>
  );
}