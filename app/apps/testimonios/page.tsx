"use client";

import React, { useState } from 'react';
import { Star, Send, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function TestimonioForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    contexto: '',
    texto: '',
    calificacion: 5,
  });
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    
    if (!aceptaPrivacidad) {
      setError('Debes aceptar el aviso de privacidad para continuar.');
      return;
    }
    if (formData.texto.length < 5) {
      setError('El testimonio debe ser un poco más largo (mínimo 20 caracteres) para que sea de utilidad.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      // AQUÍ ESTÁ LA RUTA AJUSTADA
      const response = await fetch('/apps/api/testimonios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // ¡NUEVO DIAGNÓSTICO!: Si falla, leemos el error exacto del servidor
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error del Servidor:", errorData);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      setIsSuccess(true);
    } catch (err: any) {
      // Mostramos el error técnico en la pantalla para saber qué arreglar
      setError(`Detalle técnico: ${err.message}. Revisa la consola (F12) para más info.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-10 max-w-md shadow-2xl shadow-amber-900/10">
          <CheckCircle2 size={64} className="text-amber-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-slate-100 mb-4">¡Mil Gracias!</h2>
          <p className="text-slate-400 mb-8">
            Tu experiencia es invaluable y ayuda a que más estudiantes conozcan el impacto de nuestras clases.
          </p>
          <button 
            onClick={() => window.location.href = '/comunidad'}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-8 rounded-xl transition-all"
          >
            Ver la Comunidad
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-20 px-6 font-sans selection:bg-amber-500/30">
      <div className="max-w-2xl mx-auto">
        
        {/* Cabecera */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/30 border border-amber-900/50 text-amber-500 text-xs font-bold uppercase tracking-widest mb-6">
            <Star size={14} className="fill-amber-500" /> Deja tu Huella
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-amber-400">
            Cuéntanos tu Experiencia
          </h1>
          <p className="text-slate-400">
            Tu opinión nos ayuda a seguir mejorando y motiva a nuevos alumnos a alcanzar sus metas.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 md:p-10 shadow-xl">
          
          <div className="space-y-6">
            
            {/* Nombre y Contexto */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Tu Nombre Completo o Nickname</label>
                <input 
                  type="text"
                  name="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-600"
                  placeholder="Ej. Juan Pérez o Luigizelda"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Contexto / Materias</label>
                <input 
                  type="text"
                  name="contexto"
                  required
                  value={formData.contexto}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-600"
                  placeholder="Ej. Física y Química en prepa..."
                />
              </div>
            </div>

            {/* Selector de Estrellas */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3 text-center md:text-left">
                ¿Cómo calificarías tus asesorías?
              </label>
              <div className="flex gap-2 justify-center md:justify-start">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, calificacion: star }))}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(null)}
                    className="focus:outline-none transform transition-transform hover:scale-110"
                  >
                    <Star 
                      size={32} 
                      className={`transition-colors duration-200 ${
                        star <= (hoveredStar ?? formData.calificacion) 
                          ? 'text-amber-500 fill-amber-500' 
                          : 'text-slate-700'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea del Testimonio */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Tu Reseña</label>
              <textarea 
                name="texto"
                required
                rows={5}
                value={formData.texto}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none placeholder:text-slate-600"
                placeholder="Cuéntanos cómo te ayudaron las clases, qué fue lo que más te gustó y qué lograste gracias a ellas..."
              />
              <p className="text-right text-xs text-slate-500 mt-2">
                {formData.texto.length} caracteres
              </p>
            </div>

            {/* Checkbox Legal (Requisito del Canvas) */}
            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 flex gap-4 items-start cursor-pointer hover:border-slate-700 transition-colors" onClick={() => setAceptaPrivacidad(!aceptaPrivacidad)}>
              <div className="pt-0.5 flex-shrink-0">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${aceptaPrivacidad ? 'bg-amber-500 border-amber-500' : 'bg-slate-900 border-slate-600'}`}>
                  {aceptaPrivacidad && <CheckCircle2 size={14} className="text-slate-900" />}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-200 flex items-center gap-1.5 mb-1">
                  <ShieldCheck size={16} className="text-amber-500" />
                  Acepto el Aviso de Privacidad
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Autorizo el uso de mi nombre, profesión y reseña para ser publicados en la sección de "Comunidad" de esta plataforma. Tus datos de contacto directo nunca serán compartidos sin tu permiso expreso.
                </p>
              </div>
            </div>

            {/* Manejo de Errores Visuales (Ahora más descriptivo) */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg text-sm border border-red-400/20">
                <AlertCircle size={20} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Botón de Enviar */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-lg py-4 rounded-xl transition-all shadow-lg shadow-amber-500/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  Guardando reseña...
                </span>
              ) : (
                <>Enviar Reseña <Send size={20} /></>
              )}
            </button>
            
          </div>
        </form>
      </div>
    </div>
  );
}