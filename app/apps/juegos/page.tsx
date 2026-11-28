"use client";

import React, { useState } from "react";
import Link from "next/link";
import { appsData } from "@/data/apps";
import { Swords, Dices, BookOpen, ChevronRight, Shield, Compass } from "lucide-react";

function getGameIcon(id: string) {
  if (id.includes("arkham")) return <Compass size={24} className="text-amber-500" />;
  if (id.includes("legendary")) return <Shield size={24} className="text-blue-500" />;
  if (id.includes("pathfinder")) return <Dices size={24} className="text-red-500" />;
  return <BookOpen size={24} className="text-indigo-400" />;
}

export default function JuegosPortal() {
  const [activeFilter, setActiveFilter] = useState<string>("Todas");

  const juegosApps = appsData.filter((app) => app.category === "juegos");
  const subjects = [
    "Todas",
    ...Array.from(new Set(juegosApps.map((app) => app.subject).filter(Boolean))),
  ];

  const displayedApps =
    activeFilter === "Todas"
      ? juegosApps
      : juegosApps.filter((app) => app.subject === activeFilter);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Enlace de regreso */}
        <div>
          <Link
            href="/apps"
            className="text-indigo-400 hover:text-white inline-flex items-center gap-2 text-sm font-medium transition-colors"
          >
            ← Volver al Hub de Apps
          </Link>
        </div>

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

        {/* Barra de Filtros (igual que en Tools) */}
        {subjects.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                type="button"
                onClick={() => setActiveFilter(subject as string)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeFilter === subject
                    ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-indigo-500/50 hover:text-slate-100"
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        )}

        {/* Lista de Herramientas */}
        <div className="space-y-4">
          {displayedApps.map((juego) => {
            const statusLower = (juego.status || "").toLowerCase();
            const isPublished = statusLower === "publicada";
            const isDev = statusLower === "en desarrollo";

            const cardContent = (
              <div className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col sm:flex-row gap-6 items-start sm:items-center cursor-pointer">
                {/* Icono */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 group-hover:scale-110 transition-transform duration-300 shrink-0">
                  {getGameIcon(juego.id)}
                </div>

                {/* Contenido principal */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {juego.title}
                    </h2>
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                        isPublished
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : isDev
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {juego.status}
                    </span>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
                    {juego.description}
                  </p>

                  {/* Etiquetas (subject + techStack) */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {juego.subject && (
                      <span className="text-[10px] text-indigo-300 bg-indigo-950/60 border border-indigo-500/20 px-2 py-1 rounded font-medium">
                        {juego.subject}
                      </span>
                    )}
                    {juego.techStack?.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-slate-500 bg-slate-950 px-2 py-1 rounded font-medium"
                      >
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
            );

            return juego.isExternal ? (
              <a
                href={juego.url}
                key={juego.id}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {cardContent}
              </a>
            ) : (
              <Link href={juego.url} key={juego.id} className="block">
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
