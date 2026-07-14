"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MonitorPlay, MessageSquareQuote, Users, Coffee, ArrowLeft } from 'lucide-react';

export default function ClasesNav() {
  const pathname = usePathname();
  
  // LÓGICA INTELIGENTE: Detectar si estamos DENTRO de una app específica 
  // (ej. /apps/educativas/celula) para mostrar el botón de regreso.
  const isInsideApp = pathname?.startsWith('/apps/educativas/') && pathname !== '/apps/educativas';

  return (
    <div className="w-full bg-slate-950 border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* IZQUIERDA: Logo Royalfa */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl md:text-2xl font-serif font-bold text-accent-gold hover:text-yellow-400 transition-colors">
              Royalfa
            </span>
          </Link>

          {/* CENTRO: Navegación de Clases (Con scroll en celulares) */}
          <nav className="flex items-center gap-1 md:gap-4 overflow-x-auto custom-scrollbar px-2 mx-auto">
            
            {/* BOTÓN DINÁMICO: Solo aparece si estás adentro de una App */}
            {isInsideApp && (
              <Link href="/apps/educativas" className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-950 bg-accent-gold hover:bg-yellow-400 rounded-lg transition-all whitespace-nowrap shadow-lg shadow-accent-gold/20">
                <ArrowLeft size={16} /> <span className="hidden sm:inline">Laboratorio Virtual</span>
              </Link>
            )}

            <Link href="/clases" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 hover:text-accent-gold hover:bg-slate-900 rounded-lg transition-all whitespace-nowrap">
              <Home size={16} /> <span className="hidden md:inline">Inicio Clases</span>
            </Link>
            
            <Link href="/apps/educativas" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 hover:text-accent-gold hover:bg-slate-900 rounded-lg transition-all whitespace-nowrap">
              <MonitorPlay size={16} /> <span className="hidden md:inline">Apps Educativas</span>
            </Link>
            
            <Link href="/apps/testimonios" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 hover:text-accent-gold hover:bg-slate-900 rounded-lg transition-all whitespace-nowrap">
              <MessageSquareQuote size={16} /> <span className="hidden md:inline">Reseñas</span>
            </Link>

            <Link href="/comunidad" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 hover:text-accent-gold hover:bg-slate-900 rounded-lg transition-all whitespace-nowrap border border-slate-800 bg-slate-900/50">
              <Users size={16} /> <span className="hidden sm:inline">Directorio VIP</span>
            </Link>
          </nav>

          {/* DERECHA: Botón de Café */}
          <a 
            href="https://buymeacoffee.com/royramirez" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 text-accent-gold rounded-xl text-sm font-bold hover:bg-slate-800 hover:border-accent-gold transition-colors shrink-0"
          >
            <Coffee size={16} /> Invítame un café
          </a>

        </div>
      </div>
    </div>
  );
}