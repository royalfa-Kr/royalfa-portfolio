"use client";

import React from 'react';
import Link from 'next/link';
import { Cinzel } from 'next/font/google'; 
import { Users, BookOpen, Tv, Calendar, ExternalLink, ArrowRight, ShieldAlert, Compass } from 'lucide-react';

const arkhamFont = Cinzel({ subsets: ['latin'], weight: ['700', '900'] });

export default function ArkhamDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500/30">
      
      {/* 1. CABECERA MITOS (HERO) */}
      <header className="relative overflow-hidden border-b border-slate-800 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-950/40 via-slate-950 to-slate-950 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Texto */}
            <div className="md:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-900/50 text-purple-400 text-xs font-bold uppercase tracking-widest animate-pulse w-fit">
                <ShieldAlert size={14} /> Registro de la Logia de Arkham
              </div>
              
              <h1 className={`${arkhamFont.className} text-5xl md:text-6xl font-black tracking-wider uppercase leading-tight drop-shadow-2xl`}>
                Arkham Horror <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">LCG Hub</span>
              </h1>
              
              <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-lg">
                Central de operaciones para el seguimiento de campañas, diseño de investigadores personalizados (como los mazos de Marina y las mecánicas de Pecado), recursos de la comunidad y transmisiones en vivo.
              </p>
            </div>

            {/* Imagen del Primigenio (Ahora rectangular) */}
            <div className="md:col-span-5 relative flex justify-center md:justify-end">
              <div className="relative w-full max-w-md aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden border-2 border-purple-900/50 shadow-[0_0_60px_rgba(147,51,234,0.25)] group">
                 <img
                   src="/images/arkham/chultu.png"
                   alt="Horror Cósmico"
                   className="w-full h-full object-cover object-center opacity-85 transition-transform duration-1000 group-hover:scale-105"
                 />
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* 2. REJILLA DE MÓDULOS PRINCIPALES */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="group bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="bg-purple-950/50 border border-purple-900/50 p-3 rounded-xl w-fit text-purple-400">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">Investigadores Custom</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Explora la galería de investigadores creados a mano. Revisa las hojas de personaje, habilidades únicas y las cartas específicas de debilidad y apoyo personalizadas.
              </p>
            </div>
            <div className="pt-6">
              <Link href="/arkham/investigadores" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors">
                Ver Galería <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="bg-indigo-950/50 border border-indigo-900/50 p-3 rounded-xl w-fit text-indigo-400">
                <BookOpen size={24} />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">Bitácora de Campañas</h3>
                <span className="text-[8px] font-black uppercase bg-slate-950 text-slate-500 border border-slate-800 px-2 py-0.5 rounded">Próximamente</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Historial de escenarios jugados, registro de traumas físicos y mentales, resolución de historias y recuento de caos para mantener tus partidas organizadas.
              </p>
            </div>
            <div className="pt-6">
              <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-600 cursor-not-allowed">
                Bloqueado <ArrowRight size={14} />
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SECCIÓN MIXTA: TWITCH / EN VIVO Y CALENDARIO */}
      <section className="bg-slate-900/50 border-y border-slate-800 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-purple-400">
              <Tv size={20} />
              <h3 className="font-bold uppercase tracking-wider text-xs">Transmisión en directo (Twitch)</h3>
            </div>
            
            <div className="aspect-video bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600 shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/10 to-transparent pointer-events-none"></div>
              <Tv size={40} className="mb-2 opacity-40 text-purple-500 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Canal de Streaming</p>
              <p className="text-[10px] text-slate-500 mt-1 max-w-xs text-center">Aquí se incrustará tu pantalla de Twitch para transmitir tus partidas y armados de mazos.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <Calendar size={20} />
              <h3 className="font-bold uppercase tracking-wider text-xs">Próximos Eventos</h3>
            </div>
            
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 h-full">
              <div className="border-l-2 border-purple-500 bg-slate-900/60 p-3 rounded-r-xl space-y-1">
                <span className="text-[9px] font-black uppercase text-purple-400">Streaming de Campaña</span>
                <h4 className="text-xs font-bold text-slate-200">El Camino a Carcosa - Escenario 3</h4>
                <p className="text-[10px] text-slate-500">Próximamente por definir horario</p>
              </div>

              <div className="border-l-2 border-indigo-500 bg-slate-900/60 p-3 rounded-r-xl space-y-1">
                <span className="text-[9px] font-black uppercase text-indigo-400">Análisis y Diseño</span>
                <h4 className="text-xs font-bold text-slate-200">Armado de Mazos: Mecánica de Pecado</h4>
                <p className="text-[10px] text-slate-500">Próximamente por definir horario</p>
              </div>
              
              <div className="text-center py-4 text-[10px] text-slate-600 italic">
                Los horarios se sincronizarán con tu agenda de Twitch.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. ENLACES EXTERNOS / ENLACES DE LA COMUNIDAD */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-r from-slate-900 to-purple-950/20 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <Compass size={18} /> Recursos del Investigador
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              Enlaces directos a las plataformas y herramientas esenciales de la comunidad global de Arkham Horror LCG.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <a 
              href="https://arkhamdb.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1 md:flex-none text-center bg-slate-950 border border-slate-800 hover:border-purple-500/50 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              ArkhamDB <ExternalLink size={12} />
            </a>
            <a 
              href="https://arkhambuild.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1 md:flex-none text-center bg-slate-950 border border-slate-800 hover:border-purple-500/50 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              ArkhamBuild <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}