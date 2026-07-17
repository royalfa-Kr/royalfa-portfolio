"use client";

import React from 'react';
import { Book, Feather, Globe, Map, Sparkles, ExternalLink, Trophy, Flame, ArrowRight } from 'lucide-react';

// ============================================================================
// IMPORTACIÓN REAL DESDE TU CARPETA DATA
// ============================================================================
import { summerCamp2026, configMundos } from '@/data/mundos';

export default function MundosPage() {
  
  // Calculamos el porcentaje de progreso para la barra visual
  const porcentajeProgreso = (summerCamp2026.articulosCompletados / summerCamp2026.metaArticulos) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* 1. HERO SECTION: Presentación del Mundo */}
      <header className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950 z-0"></div>
        
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative z-10 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
          
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/30 border border-purple-900/50 text-purple-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Globe size={14} />
              Worldbuilding & Lore
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
              Explora los misterios <br className="hidden md:block" />
              del mundo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400">{configMundos.nombreMundo}.</span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-xl mb-8 leading-relaxed">
              Un universo en constante expansión. Aquí documento historias, culturas, magias y misterios desarrollados a través de años de diseño y escritura en World Anvil.
            </p>

            <a href={configMundos.urlPrincipal} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:border-purple-500/50">
              <Book size={18} /> Visitar mi World Anvil
            </a>
          </div>

          {/* DASHBOARD SUMMER CAMP (Dinámico) */}
          <div className="flex-1 w-full max-w-md relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-purple-600 rounded-2xl blur opacity-25"></div>
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500">
                    <Flame size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100">{summerCamp2026.nombreEvento}</h3>
                    <p className="text-xs text-slate-400">Evento Activo de World Anvil</p>
                  </div>
                </div>
                <Trophy className="text-slate-700" size={32} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-300">Progreso del Reto</span>
                  <span className="text-amber-400">{summerCamp2026.articulosCompletados} / {summerCamp2026.metaArticulos} Artículos</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-purple-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${porcentajeProgreso}%` }}></div>
                </div>
                <p className="text-xs text-slate-500 text-right mt-2">Nivel {summerCamp2026.nivelEnProgreso} en progreso...</p>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* 2. ARTÍCULOS DESTACADOS */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
                <Feather className="text-purple-500" /> Publicaciones Recientes
              </h2>
              <p className="text-slate-400">Mis últimas contribuciones literarias al universo de {configMundos.nombreMundo}.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Iteramos sobre los artículos del archivo data/mundos.ts */}
            {summerCamp2026.articulos.map((articulo) => {
              const IconoComponente = articulo.icono; // Renderizamos el icono que pusiste en data/mundos.ts
              return (
                <div key={articulo.id} className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col transition-all hover:border-purple-900/50 hover:shadow-lg hover:shadow-purple-900/10 hover:-translate-y-1">
                  
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl border ${articulo.bgIcono} ${articulo.bordeIcono} shrink-0`}>
                      {/* Aquí se usa el IconoComponente */}
                      <IconoComponente size={24} className={articulo.color} />
                    </div>
                    <div>
                      <div className="inline-block px-2 py-1 bg-slate-950 border border-slate-800 rounded text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Prompt Summer Camp
                      </div>
                      <h3 className="text-xl font-bold text-slate-100 group-hover:text-purple-400 transition-colors leading-tight">
                        {articulo.titulo}
                      </h3>
                    </div>
                  </div>

                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 mb-6 flex-grow">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Respondiendo a:</p>
                    <p className="text-sm text-slate-300 italic">"{articulo.prompt}"</p>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
                    {articulo.extracto}
                  </p>

                  <a href={articulo.url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 rounded-xl font-semibold transition-colors mt-auto">
                    Leer artículo completo <ExternalLink size={16} className="text-slate-400" />
                  </a>
                </div>
              );
            })}

            {/* Tarjeta de "Próximamente" para el siguiente artículo. */}
            {summerCamp2026.articulosCompletados < summerCamp2026.metaArticulos && (
              <div className="bg-slate-950 border border-dashed border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all hover:border-slate-600">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4">
                  <Sparkles size={24} className="text-slate-500" />
                </div>
                <h4 className="font-bold text-slate-300 mb-2">Trabajando en el próximo...</h4>
                <p className="text-sm text-slate-500 mb-6 max-w-xs">
                  La pluma no descansa. El artículo {summerCamp2026.articulosCompletados + 1} del Summer Camp está actualmente en fase de borrador.
                </p>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 3. FOOTER SIMPLE PARA LA SECCIÓN DE MUNDOS */}
      <footer className="py-12 bg-slate-950 text-center border-t border-slate-800">
        <div className="flex justify-center items-center gap-6 mb-6">
          <Map size={24} className="text-slate-700" />
        </div>
        <p className="text-slate-500 text-sm font-bold mb-2">Universo {configMundos.nombreMundo} | World Anvil</p>
        <p className="text-slate-600 text-xs flex items-center justify-center gap-1">
          Creado por {configMundos.creador}
        </p>
      </footer>

    </div>
  );
}