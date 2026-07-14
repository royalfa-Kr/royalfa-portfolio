"use client";

import React, { useEffect, useState } from 'react';
import { Star, MessageSquareQuote } from 'lucide-react';

// Componente interno para mostrar 2 reseñas aleatorias de la Base de Datos
function RandomReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const data = await res.json();
          // Revolver el arreglo al azar y tomar solo 2
          const shuffled = data.sort(() => 0.5 - Math.random());
          setReviews(shuffled.slice(0, 2));
        }
      } catch (error) {
        console.error("Error cargando reseñas en About:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-40 bg-slate-800/20 border border-base-border/30 rounded-xl"></div>
        <div className="h-40 bg-slate-800/20 border border-base-border/30 rounded-xl"></div>
      </div>
    );
  }

  // Si no hay reseñas en la base de datos aún, no mostramos nada para no romper el diseño
  if (reviews.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-accent-gold mb-6">
        <MessageSquareQuote size={20} />
        <h3 className="text-lg font-serif font-bold text-text-main">Lo que dice la comunidad</h3>
      </div>
      
      {reviews.map((resena, idx) => (
        <div key={idx} className="bg-slate-950/50 border border-base-border/50 p-6 rounded-2xl relative">
          <div className="flex gap-1 mb-3 text-accent-gold">
            {[...Array(resena.calificacion || 5)].map((_, i) => (
              <Star key={i} size={14} fill="currentColor" />
            ))}
          </div>
          <p className="text-text-muted text-sm italic mb-4 whitespace-pre-line leading-relaxed">
            "{resena.texto}"
          </p>
          <div>
            <p className="text-text-main font-bold text-sm">{resena.nombre}</p>
            {resena.contexto && <p className="text-slate-500 text-xs">{resena.contexto}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
      <header className="mb-16 border-b border-base-border pb-8">
        <h1 className="text-4xl md:text-5xl font-serif text-text-main mb-4">
          The mind behind <span className="text-accent-gold">Royalfa.</span>
        </h1>
        <p className="text-xl text-text-muted font-serif italic">
          by Rodrigo Jesus Ramirez Tomasini
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* COLUMNA IZQUIERDA: Biografía + Habilidades */}
        <div className="md:col-span-2 space-y-10">
          
          <div className="space-y-6 text-text-muted leading-relaxed">
            <p className="text-lg text-text-main">
              Royalfa es el espacio donde la vocación docente, el pensamiento analítico y el diseño narrativo convergen.
            </p>
            <p>
              Con formación actuarial en la Facultad de Ciencias de la UNAM y más de tres décadas de trayectoria como asesor académico de tiempo completo, mi labor principal es la enseñanza. Me especializo en desglosar la complejidad de las ciencias exactas y naturales —matemáticas, física, química, cómputo, biología y lógica— para construir puentes de comprensión reales y duraderos para mis estudiantes.
            </p>
            <p>
              Esta dedicación a la educación ha evolucionado naturalmente hacia el desarrollo de software. Combino mi experiencia en el aula con el código para crear herramientas de aprendizaje interactivas e intuitivas. Actualmente, mi ecosistema cuenta con tres aplicaciones educativas probadas y publicadas, y dos nuevos proyectos tecnológicos en fase de desarrollo activo.
            </p>
            <p>
              Al mismo tiempo, la mente analítica necesita un lienzo creativo. El rigor que aplico al enseñar matemáticas o estructurar una base de datos es el mismo que utilizo para equilibrar mecánicas en Arkham Horror LCG, escribir antologías de ficción o diseñar el worldbuilding de escenarios fantásticos. Al final, ya sea en un aula, en una aplicación o en un juego de rol, el objetivo siempre es construir sistemas robustos que dejen huella.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-base-border/30">
            <div>
              <h3 className="text-sm uppercase tracking-wider text-accent-gold font-semibold mb-4">Academic & Tech</h3>
              <ul className="space-y-2 text-sm text-text-muted">
                <li>Asesoría en Ciencias Exactas</li>
                <li>Desarrollo de Apps Educativas</li>
                <li>React, Next.js & Python</li>
                <li>Diseño Lógico y Estructural</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-wider text-accent-gold font-semibold mb-4">Creative Design</h3>
              <ul className="space-y-2 text-sm text-text-muted">
                <li>TTRPG Mechanics & Testing</li>
                <li>Narrative & Worldbuilding</li>
                <li>Escritura de Ficción</li>
                <li>Game Balance</li>
              </ul>
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA: Solo Reseñas (Con efecto sticky) */}
        <div className="md:col-span-1">
          <div className="sticky top-24 pt-2">
            <RandomReviews />
          </div>
        </div>

      </div>
    </div>
  );
}