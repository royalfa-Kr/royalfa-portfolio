import React from 'react';
import Link from 'next/link';
import { Swords, Dices, BookOpen, ChevronRight, Shield } from 'lucide-react';

// Si prefieres importar tu DATA real, puedes sustituir este arreglo.
// Aquí te dejo una muestra de cómo se vería la lista con tus herramientas de mesa.
const JUEGOS_DATA = [
  {
    id: "legendary-tracker",
    title: "Legendary Marvel Log",
    description: "Bitácora de misiones y tracker de puntuaciones para partidas de Marvel Legendary. Incluye soporte para expansiones y horror cards.",
    status: "En Desarrollo",
    url: "/apps/juegos/MarvelLegendary",
    icon: <Shield size={24} className="text-blue-500" />,
    tags: ["Deck Building", "Marvel"]
  },
  {
    id: "arkham-campaign",
    title: "Arkham Horror: Diario de Campaña",
    description: "Registro de trauma, experiencia y resoluciones de escenarios para investigadores.",
    status: "Planeación",
    url: "#",
    icon: <BookOpen size={24} className="text-amber-600" />,
    tags: ["LCG", "Horror"]
  },
  {
    id: "pathfinder-gm",
    title: "Pathfinder 2e: GM Screen",
    description: "Herramienta de referencia rápida para el Game Master con DCs por nivel y generador de loot.",
    status: "Planeación",
    url: "#",
    icon: <Dices size={24} className="text-red-500" />,
    tags: ["TTRPG", "Rol"]
  }
];

export default function JuegosPortal() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Cabecera del Portal */}
        <header className="border-b border-slate-800 pb-8">
          <div className="flex items-center gap-4 mb-2">
            <Swords size={40} className="text-indigo-500" />
            <h1 className="text-4xl font-black tracking-tighter uppercase">Arsenal Lúdico</h1>
          </div>
          <p className="text-slate-400 text-sm">
            Directorio de herramientas, bitácoras y utilidades para la mesa de juego.
          </p>
        </header>

        {/* Lista de Herramientas */}
        <div className="space-y-4">
          {JUEGOS_DATA.map((juego) => (
            <Link href={juego.url} key={juego.id}>
              <div className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col sm:flex-row gap-6 items-start sm:items-center cursor-pointer">
                
                {/* Icono */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 group-hover:scale-110 transition-transform duration-300 shrink-0">
                  {juego.icon}
                </div>

                {/* Contenido principal */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {juego.title}
                    </h2>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                      juego.status === 'Publicada' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                      juego.status === 'En Desarrollo' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
                      'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {juego.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                    {juego.description}
                  </p>
                  
                  {/* Etiquetas */}
                  <div className="flex gap-2 pt-1">
                    {juego.tags.map(tag => (
                      <span key={tag} className="text-[10px] text-slate-500 bg-slate-950 px-2 py-1 rounded font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Flecha indicadora */}
                <div className="hidden sm:block shrink-0 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
                  <ChevronRight size={24} className="text-indigo-500" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}