"use client";

import { useState } from "react";
import { appsData, AppCategory } from "@/data/apps";
import Link from "next/link";

export default function AppsPage() {
  const [activeTab, setActiveTab] = useState<AppCategory | 'todas'>('todas');

  const filteredApps = activeTab === 'todas' 
    ? appsData 
    : appsData.filter(app => app.category === activeTab);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-24">
      
      {/* Encabezado */}
      <header className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-serif text-text-main mb-4">
          Laboratorio <span className="text-accent-gold">Interactivo</span>
        </h1>
        <p className="text-lg text-text-muted max-w-2xl">
          Explora mis aplicaciones, desde herramientas educativas personalizadas para mis alumnos, hasta utilidades de uso diario y recursos para juegos de rol.
        </p>
      </header>

      {/* Pestañas de Navegación */}
      <div className="flex flex-wrap gap-2 md:gap-4 mb-10 border-b border-base-border/50 pb-4">
        {[
          { id: 'todas', label: 'Todas las Apps' },
          { id: 'educativas', label: 'Educativas' },
          { id: 'tools', label: 'Herramientas (Tools)' },
          { id: 'juegos', label: 'Juegos & Rol' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AppCategory | 'todas')}
            className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
              activeTab === tab.id 
                ? 'bg-accent-gold/10 text-accent-gold border border-accent-gold/30' 
                : 'text-text-muted hover:text-text-main hover:bg-base-dark border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Banner de Comisiones (Se muestra en Todas o Educativas) */}
      {(activeTab === 'todas' || activeTab === 'educativas') && (
        <div className="bg-base-dark border border-accent-gold/20 p-6 rounded-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-serif text-text-main mb-1">¿Necesitas una herramienta educativa a medida?</h3>
            <p className="text-sm text-text-muted">Diseño y programo aplicaciones interactivas personalizadas. </p>
          </div>
          <Link href="/about" className="px-6 py-2 bg-accent-gold text-base-dark text-sm font-bold rounded-sm hover:bg-white transition-colors whitespace-nowrap">
            Solicitar Comisión
          </Link>
        </div>
      )}

      {/* Cuadrícula de Aplicaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app) => (
          <div key={app.id} className="border border-base-border bg-base-dark/50 rounded-sm p-6 flex flex-col hover:border-accent-gold/30 transition-colors group">
            <h3 className="text-xl font-serif text-text-main mb-2">{app.title}</h3>
            <p className="text-sm text-text-muted mb-6 flex-grow">{app.description}</p>
            
            {/* Tags de Tecnologías */}
            {app.techStack && (
              <div className="flex flex-wrap gap-2 mb-6">
                {app.techStack.map(tech => (
                  <span key={tech} className="text-xs font-mono text-accent-gold bg-accent-gold/5 px-2 py-1 rounded-sm">
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* Botón de Enlace Dinámico (Interno o Externo) */}
            {app.isExternal ? (
              <a 
                href={app.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full text-center py-2 border border-base-border text-sm text-text-main hover:border-accent-gold hover:text-accent-gold transition-colors rounded-sm"
              >
                Abrir App (Externa) ↗
              </a>
            ) : (
              <Link 
                href={app.url}
                className="w-full text-center py-2 bg-accent-gold/10 text-accent-gold border border-accent-gold/30 text-sm hover:bg-accent-gold hover:text-base-dark transition-colors rounded-sm"
              >
                Abrir App
              </Link>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}