"use client";

import Link from "next/link";
import { ChefHat, Flame } from "lucide-react";

export default function CocinaHubPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-24">
      
      {/* Navegación al Home */}
      <div className="mb-8">
        <Link href="/" className="text-accent-gold hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
          ← Volver al Inicio
        </Link>
      </div>

      <header className="mb-12 border-b border-base-border pb-8 flex items-center gap-4">
        <div className="p-3 bg-accent-gold/10 rounded-sm">
          <ChefHat size={32} className="text-accent-gold" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-text-main mb-2">
            El Rincón <span className="text-accent-gold">Culinario</span>
          </h1>
          <p className="text-text-muted text-sm md:text-base">
            Recetario familiar, técnicas y experimentos en la cocina.
          </p>
        </div>
      </header>

      {/* Cuadrícula de Recetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Tarjeta: Hamburguesas Jalapeñas */}
        <Link 
          href="/cocina/hamburguesas-jalapenas" 
          className="group border border-base-border bg-base-dark/50 rounded-sm overflow-hidden flex flex-col hover:border-accent-gold/50 transition-colors shadow-lg"
        >
          {/* Espacio para futura foto (ahora tiene un fondo estilizado) */}
          <div className="h-48 bg-base-surface flex items-center justify-center border-b border-base-border relative overflow-hidden">
            <div className="absolute inset-0 bg-accent-gold/5 group-hover:bg-accent-gold/10 transition-colors" />
            <Flame size={48} className="text-accent-gold/30 group-hover:scale-110 transition-transform duration-500" />
          </div>
          
          <div className="p-6 flex-grow flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-accent-gold mb-2 block font-medium">Plato Fuerte</span>
            <h3 className="text-xl font-serif text-text-main mb-3 group-hover:text-accent-gold transition-colors">
              Hamburguesas Jalapeñas
            </h3>
            <p className="text-sm text-text-muted mb-4 flex-grow">
              La receta secreta de la familia con un toque especial de mostaza y el nivel perfecto de picante.
            </p>
            <div className="text-xs text-text-muted font-mono flex gap-3">
              <span>⏱️ 2 hrs</span>
              <span>👨‍🍳 Tíos Jalapeños</span>
            </div>
          </div>
        </Link>

        {/* Tarjeta: Próximamente (Placeholder) */}
        <div className="border border-dashed border-base-border bg-base-dark/20 rounded-sm overflow-hidden flex flex-col items-center justify-center p-8 opacity-60">
           <ChefHat size={32} className="text-text-muted mb-4" />
           <h3 className="text-lg font-serif text-text-main mb-2">Próximamente...</h3>
           <p className="text-sm text-text-muted text-center">
             Preparando el terreno para la famosa Tinga y más recetas.
           </p>
        </div>

      </div>
    </div>
  );
}