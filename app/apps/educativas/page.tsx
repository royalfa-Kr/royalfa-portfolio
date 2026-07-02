"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { FlaskConical, Dna, Calculator, ChevronRight, Beaker, AppWindow, Brain, Atom } from 'lucide-react';

// IMPORTANTE: Ajusta esta ruta a donde realmente vive tu archivo DATA
import { appsData } from '@/data/apps'; 

// Función para asignar iconos y colores según el Subject (Materia)
const getSubjectIcon = (subject?: string) => {
  switch (subject?.toLowerCase()) {
    case 'biología':
      return <Dna size={24} className="text-emerald-500" />;
    case 'química':
      return <FlaskConical size={24} className="text-blue-500" />;
    case 'matemáticas':
      return <Calculator size={24} className="text-indigo-500" />;
    case 'lógica':
      return <Brain size={24} className="text-purple-500" />;
    case 'física':
      return <Atom size={24} className="text-amber-500" />;
    default:
      return <AppWindow size={24} className="text-slate-400" />;
  }
};

export default function EducativasPortal() {
  const [activeFilter, setActiveFilter] = useState<string>('Todas');

  // 1. Filtrar la base de datos para traer SOLO las aplicaciones con category "educativas"
  const appsEducativas = useMemo(() => {
    return appsData.filter(app => app.category === 'educativas');
  }, []);

  // 2. Extraer las materias (subjects) únicas y ordenarlas alfabéticamente
  const subjects = useMemo(() => {
    const uniqueSubjects = Array.from(new Set(appsEducativas.map(app => app.subject)));
    // Eliminamos posibles undefined/null y ordenamos alfabéticamente
    const validSubjects = uniqueSubjects.filter(Boolean).sort();
    return ['Todas', ...validSubjects];
  }, [appsEducativas]);

  // 3. Filtrar las apps según el botón seleccionado y ordenarlas alfabéticamente por Título
  const filteredAndSortedApps = useMemo(() => {
    let filtered = appsEducativas;
    if (activeFilter !== 'Todas') {
      filtered = appsEducativas.filter(app => app.subject === activeFilter);
    }
    // Orden alfabético basado en el título
    return filtered.sort((a, b) => a.title.localeCompare(b.title));
  }, [activeFilter, appsEducativas]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Cabecera del Portal */}
        <header className="border-b border-slate-800 pb-8">
          <div className="flex items-center gap-4 mb-2">
            <Beaker size={40} className="text-emerald-500" />
            <h1 className="text-4xl font-black tracking-tighter uppercase">Laboratorio Virtual</h1>
          </div>
          <p className="text-slate-400 text-sm">
            Herramientas interactivas y simuladores para el dominio de ciencias exactas.
          </p>
        </header>

        {/* Filtros de Materias Ordenados Alfabéticamente */}
        <div className="flex flex-wrap gap-2">
          {subjects.map(subject => (
            <button
              key={subject}
              onClick={() => setActiveFilter(subject as string)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                activeFilter === subject 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' 
                  : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300 hover:border-slate-600'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Lista de Aplicaciones Ordenadas Alfabéticamente */}
        <div className="space-y-4">
          {filteredAndSortedApps.map((app) => (
            <Link href={app.url} key={app.id}>
              <div className="group bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col sm:flex-row gap-6 items-start sm:items-center cursor-pointer">
                
                {/* Icono Dinámico basado en el Subject */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 group-hover:scale-110 transition-transform duration-300 shrink-0">
                  {getSubjectIcon(app.subject)}
                </div>

                {/* Contenido principal */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {app.title}
                    </h2>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                      app.status === 'Publicada' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                      app.status === 'En desarrollo' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
                      'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                    {app.description}
                  </p>
                  
                  {/* Etiquetas */}
                  <div className="flex gap-2 pt-1 flex-wrap">
                    {app.tags?.map((tag: string) => (
                      <span key={tag} className="text-[10px] text-slate-500 bg-slate-950 px-2 py-1 rounded font-medium border border-slate-800/50">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Flecha indicadora */}
                <div className="hidden sm:block shrink-0 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
                  <ChevronRight size={24} className="text-emerald-500" />
                </div>
              </div>
            </Link>
          ))}
          
          {filteredAndSortedApps.length === 0 && (
            <div className="text-center p-12 border border-slate-800 border-dashed rounded-2xl text-slate-500">
              No hay herramientas disponibles en esta categoría por el momento.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}