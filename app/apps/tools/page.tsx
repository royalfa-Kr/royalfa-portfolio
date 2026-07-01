"use client";

import { useState } from "react";
import Link from "next/link";
import { appsData } from "@/data/apps";
import { Wrench } from "lucide-react";

export default function ToolsPage() {
  const [activeFilter, setActiveFilter] = useState<string>('Todas');

  const toolsApps = appsData.filter(app => app.category === 'tools');
  const subjects = ['Todas', ...Array.from(new Set(toolsApps.map(app => app.subject).filter(Boolean)))];

  const displayedApps = activeFilter === 'Todas' 
    ? toolsApps 
    : toolsApps.filter(app => app.subject === activeFilter);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-24">
      
      <div className="mb-8">
        <Link href="/apps" className="text-accent-gold hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
          ← Volver al Hub de Apps
        </Link>
      </div>

      <header className="mb-8 border-b border-base-border pb-8 flex items-center gap-4">
        <div className="p-3 bg-accent-gold/10 rounded-sm">
          <Wrench size={32} className="text-accent-gold" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-text-main mb-2">
            Mis <span className="text-accent-gold">Herramientas</span>
          </h1>
          <p className="text-text-muted text-sm md:text-base">
            Aplicaciones utilitarias, PWAs y conversores de uso diario.
          </p>
        </div>
      </header>

      {/* Barra de Filtros */}
      {subjects.length > 1 && (
        <div className="flex flex-wrap gap-3 mb-10">
          {subjects.map(subject => (
            <button
              key={subject}
              onClick={() => setActiveFilter(subject as string)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === subject
                  ? 'bg-accent-gold text-base-dark shadow-md shadow-accent-gold/20'
                  : 'bg-base-surface text-text-muted border border-base-border hover:border-accent-gold/50 hover:text-text-main'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      )}

      {/* Cuadrícula de Aplicaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedApps.map((app) => (
          <div key={app.id} className="border border-base-border bg-base-dark/50 rounded-sm p-6 flex flex-col hover:border-accent-gold/30 transition-colors group shadow-lg animate-in fade-in duration-300">
            
            <div className="flex justify-between items-start mb-3 gap-2">
              <div>
                <h3 className="text-xl font-serif text-text-main">{app.title}</h3>
                {app.subject && <span className="text-xs text-accent-gold/80">{app.subject}</span>}
              </div>
              <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm border whitespace-nowrap ${
                app.status === 'Publicada' 
                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                  : 'bg-accent-gold/10 text-accent-gold border-accent-gold/20'
              }`}>
                {app.status}
              </span>
            </div>

            <p className="text-sm text-text-muted mb-6 mt-2 flex-grow">{app.description}</p>
            
            {app.techStack && (
              <div className="flex flex-wrap gap-2 mb-6">
                {app.techStack.map(tech => (
                  <span key={tech} className="text-xs font-mono text-text-muted bg-base-dark border border-base-border px-2 py-1 rounded-sm">
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {app.isExternal ? (
              <a href={app.url} target="_blank" rel="noopener noreferrer" className="w-full text-center py-2 border border-base-border text-sm text-text-main hover:border-accent-gold hover:text-accent-gold transition-colors rounded-sm">
                Abrir App (Externa) ↗
              </a>
            ) : (
              <Link href={app.url} className="w-full text-center py-2 bg-accent-gold/10 text-accent-gold border border-accent-gold/30 text-sm hover:bg-accent-gold hover:text-base-dark transition-colors rounded-sm">
                Abrir App
              </Link>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}