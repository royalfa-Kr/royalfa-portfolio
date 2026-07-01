"use client";

import Link from "next/link";
import { BookOpen, Wrench, Dices } from "lucide-react";

export default function AppsHubPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-24">
      
      {/* Encabezado */}
      <header className="mb-16 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-serif text-text-main mb-4">
          Laboratorio <span className="text-accent-gold">Interactivo</span>
        </h1>
        <p className="text-lg text-text-muted max-w-2xl">
          Explora mis colecciones de software. Selecciona un área para ver las herramientas, aplicaciones y recursos interactivos disponibles.
        </p>
      </header>

      {/* Portales de Categorías */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        
        {/* Portal Educativo */}
        <Link href="/apps/educativas" className="group bg-base-surface border border-base-border p-8 rounded-sm hover:border-accent-gold/50 transition-all duration-300 shadow-lg flex flex-col items-center text-center">
          <div className="p-4 bg-accent-gold/10 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
            <BookOpen size={40} className="text-accent-gold" />
          </div>
          <h2 className="text-2xl font-serif text-text-main mb-3">Educativas</h2>
          <p className="text-sm text-text-muted">
            Herramientas interactivas de ciencias exactas, lógica y matemáticas diseñadas para el aprendizaje activo.
          </p>
        </Link>

        {/* Portal Tools */}
        <Link href="/apps/tools" className="group bg-base-surface border border-base-border p-8 rounded-sm hover:border-accent-gold/50 transition-all duration-300 shadow-lg flex flex-col items-center text-center">
          <div className="p-4 bg-accent-gold/10 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
            <Wrench size={40} className="text-accent-gold" />
          </div>
          <h2 className="text-2xl font-serif text-text-main mb-3">Herramientas</h2>
          <p className="text-sm text-text-muted">
            Aplicaciones utilitarias, PWAs de uso diario y conversores rápidos para optimizar tareas.
          </p>
        </Link>

        {/* Portal Juegos */}
        <Link href="/apps/juegos" className="group bg-base-surface border border-base-border p-8 rounded-sm hover:border-accent-gold/50 transition-all duration-300 shadow-lg flex flex-col items-center text-center">
          <div className="p-4 bg-accent-gold/10 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
            <Dices size={40} className="text-accent-gold" />
          </div>
          <h2 className="text-2xl font-serif text-text-main mb-3">Juegos & Rol</h2>
          <p className="text-sm text-text-muted">
            Generadores de escenarios, utilidades para TTRPGs y herramientas para directores de juego.
          </p>
        </Link>

      </div>

      {/* Banner de Comisiones Generales */}
      <div className="bg-base-dark border border-accent-gold/20 p-8 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <h3 className="text-xl font-serif text-accent-gold mb-2">¿Necesitas desarrollo a medida?</h3>
          <p className="text-sm text-text-muted max-w-xl">
            Diseño y programo aplicaciones interactivas personalizadas. Ya sea una herramienta didáctica para tus alumnos o un sistema complejo para tu campaña de rol, podemos construirlo.
          </p>
        </div>
        <Link href="/about" className="px-8 py-3 bg-accent-gold/10 text-accent-gold border border-accent-gold rounded-sm hover:bg-accent-gold hover:text-base-dark transition-all duration-300 font-bold whitespace-nowrap">
          Solicitar Comisión
        </Link>
      </div>

    </div>
  );
}