"use client";

import Link from "next/link";
import { appsData } from "@/data/apps";
import { Dices } from "lucide-react";

export default function JuegosPage() {
  const juegosApps = appsData.filter(app => app.category === 'juegos').sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-24">
      
      <div className="mb-8">
        <Link href="/apps" className="text-accent-gold hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
          ← Volver al Hub de Apps
        </Link>
      </div>

      <header className="mb-12 border-b border-base-border pb-8 flex items-center gap-4">
        <div className="p-3 bg-accent-gold/10 rounded-sm">
          <Dices size={32} className="text-accent-gold" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-text-main mb-2">
            Juegos <span className="text-accent-gold">& Rol</span>
          </h1>
          <p className="text-text-muted text-sm md:text-base">
            Generadores, utilidades para TTRPGs y herramientas para el director de juego.
          </p>
        </div>
      </header>

      {juegosApps.length > 0 ? (
        <div className="flex flex-col gap-4">
          {juegosApps.map((app) => (
            <div 
              key={app.id} 
              className="border border-base-border bg-base-dark/50 rounded-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-accent-gold/30 transition-colors group shadow-md"
            >
              
              {/* Información de la App (Izquierda) */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-serif text-text-main">{app.title}</h3>
                  {/* Aquí se mostrará el sistema, ej: "Shadows over Brimstone" */}
                  {app.subject && (
                    <span className="text-xs font-medium px-2 py-1 bg-base-surface border border-base-border text-accent-gold/80 rounded-sm">
                      {app.subject}
                    </span>
                  )}
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm border whitespace-nowrap hidden md:inline-block ${
                    app.status === 'Publicada' 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-accent-gold/10 text-accent-gold border-accent-gold/20'
                  }`}>
                    {app.status}
                  </span>
                </div>
                
                <p className="text-sm text-text-muted mb-4 max-w-3xl">{app.description}</p>
                
                {app.techStack && (
                  <div className="flex flex-wrap gap-2">
                    {app.techStack.map(tech => (
                      <span key={tech} className="text-[10px] font-mono text-text-muted bg-base-dark border border-base-border px-2 py-1 rounded-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Botón de Acción (Derecha) */}
              <div className="w-full md:w-auto shrink-0 mt-4 md:mt-0">
                {app.isExternal ? (
                  <a href={app.url} target="_blank" rel="noopener noreferrer" className="block w-full md:w-40 text-center py-3 border border-base-border text-sm text-text-main hover:border-accent-gold hover:text-accent-gold transition-colors rounded-sm">
                    Abrir ↗
                  </a>
                ) : (
                  <Link href={app.url} className="block w-full md:w-40 text-center py-3 bg-accent-gold/10 text-accent-gold border border-accent-gold/30 text-sm hover:bg-accent-gold hover:text-base-dark transition-colors rounded-sm font-medium">
                    Ejecutar
                  </Link>
                )}
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-base-border rounded-sm bg-base-dark/30">
          <p className="text-text-muted font-serif italic text-lg">
            Las bóvedas están cerradas. Nuevos artefactos y herramientas en desarrollo...
          </p>
        </div>
      )}
    </div>
  );
}