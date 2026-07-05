"use client";

import { useState, useEffect } from 'react';
import { Star, MessageSquareQuote } from 'lucide-react';

export default function GoogleReviews() {
  // Lista maestra de reseñas (aquí luego conectaremos la base de datos o API)
  const allReviews = [
    { id: 1, name: "Alumno Universitario", date: "Hace 2 semanas", text: "Excelente metodología para entender temas complejos de ciencias exactas. Muy recomendado." },
    { id: 2, name: "Padre de familia", date: "Hace 1 mes", text: "Gran dedicación y paciencia. Las herramientas interactivas que usa en línea hacen toda la diferencia." },
    { id: 3, name: "Estudiante de Prepa", date: "Hace 3 meses", text: "Por fin logré pasar mis exámenes. Sus clases son súper claras y no te deja con dudas." },
    { id: 4, name: "Madre de familia", date: "Hace 2 meses", text: "El mejor apoyo que hemos tenido. Muy profesional y siempre puntual." }
  ];

  const [randomReviews, setRandomReviews] = useState<typeof allReviews>([]);

  useEffect(() => {
    // 1. Barajamos toda la lista al azar
    const shuffled = [...allReviews].sort(() => 0.5 - Math.random());
    // 2. Cortamos solo las primeras 2
    setRandomReviews(shuffled.slice(0, 2));
  }, []);

  return (
    <div className="bg-base-surface/40 border border-base-border p-6 rounded-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-serif text-text-main flex items-center gap-2">
            <span className="text-accent-gold"><MessageSquareQuote size={20}/></span> Reseñas
          </h2>
          <p className="text-xs text-text-muted font-serif italic mt-1">
            Google Mi Negocio
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex text-accent-gold">
            {[1, 2, 3, 4, 5].map(star => <Star key={star} size={14} fill="currentColor" />)}
          </div>
          <span className="text-[10px] text-text-main font-bold mt-1 uppercase tracking-wider">5.0 de calificación</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-grow">
        {randomReviews.map((review) => (
          <div key={review.id} className="p-4 bg-base-dark border border-base-border/50 rounded-sm">
            <div className="flex items-center gap-1 text-accent-gold mb-2">
               {[1, 2, 3, 4, 5].map(star => <Star key={star} size={10} fill="currentColor" />)}
            </div>
            <p className="text-sm text-text-main leading-relaxed mb-3 italic">"{review.text}"</p>
            <div className="flex justify-between items-center text-xs text-text-muted">
              <span className="font-semibold text-accent-gold/80">{review.name}</span>
              <span className="text-[10px]">{review.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}