"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, MonitorPlay, Beaker, Calculator, Brain, Code, ArrowRight, Star, PlayCircle, MessageCircle, MapPin, Quote, ExternalLink, MessageSquareQuote } from 'lucide-react';

// Importamos tus datos locales como "respaldo"
import { casosDeExito, resenas as resenasLocales } from '@/data/comunidad';

export default function ClasesLandingPage() {
  
  // Estado para guardar las reseñas de la base de datos + las locales
      const [resenasDinamicas, setResenasDinamicas] = useState<any[]>(resenasLocales);

  // Efecto para buscar las reseñas de Upstash al cargar la página
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // En tu proyecto real, usa '/apps/api/testimonios'. 
        // Aquí uso una URL simulada para que el visor de React no de error 404
        const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
          ? '/apps/api/testimonios' 
          : 'https://jsonplaceholder.typicode.com/posts/1'; // Simulador inofensivo
          
        const res = await fetch(apiUrl);
        if (res.ok) {
          const data = await res.json();
          // Verificamos que Upstash nos devolvió un arreglo con datos
          if (Array.isArray(data) && data.length > 0) {
            // Combinamos las nuevas con las viejas
            setResenasDinamicas([...data, ...resenasLocales]);
          }
        }
      } catch (error) {
        console.error("Usando solo reseñas locales:", error);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
               
      {/* 1. HERO SECTION */}
      <header className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 z-0"></div>
        
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative z-10">
          
          <div className="mb-12 w-full max-w-4xl bg-slate-900 h-48 md:h-64 rounded-2xl border border-slate-800 flex items-center justify-center text-slate-600 font-bold uppercase tracking-widest shadow-2xl shadow-blue-900/10">
             <img 
              src="images/LogoClases1a1big.png" 
              alt="Clases 1a1 Club de Estudio" 
              className="w-full h-48 md:h-64 object-cover object-center rounded-2xl shadow-2xl shadow-blue-900/10 border border-slate-800" 
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/30 border border-blue-900/50 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            <img 
              src="images/LogoClases1a1small.png" 
              alt="Icono Clases 1a1" 
              className="w-5 h-5 rounded-full"
            />
            Asesorías 1 a 1 Disponibles
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-tight">
            Domina las ciencias exactas con <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">experiencia real.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
            Soy Roy, con más de 30 años transformando la frustración académica en resultados sobresalientes mediante tecnología interactiva y pedagogía comprobada.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="https://www.facebook.com/clases1a1" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
              <MessageCircle size={20} /> Contactar en Facebook
            </a>
            <Link href="#especialidades" className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              Ver especialidades <ArrowRight size={20} />
            </Link>
            <Link href="#metodologia" className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              Conoce mi método <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. ÁREAS DE EXPERTISE */}
      <section id="especialidades" className="py-20 bg-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black tracking-tight mb-4">Especialidades Académicas</h2>
            <p className="text-slate-400">Preparación intensiva para nivel medio superior y superior.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'Matemáticas', icon: Calculator, color: 'text-indigo-400', bg: 'bg-indigo-950/30', border: 'border-indigo-900/50' },
              { name: 'Física', icon: MonitorPlay, color: 'text-amber-400', bg: 'bg-amber-950/30', border: 'border-amber-900/50' },
              { name: 'Química', icon: Beaker, color: 'text-blue-400', bg: 'bg-blue-950/30', border: 'border-blue-900/50' },
              { name: 'Lógica', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-950/30', border: 'border-purple-900/50' },
              { name: 'Computación', icon: Code, color: 'text-emerald-400', bg: 'bg-emerald-950/30', border: 'border-emerald-900/50' }
            ].map((subject) => (
              <div key={subject.name} className={`flex flex-col items-center p-6 rounded-2xl border ${subject.border} ${subject.bg} transition-transform hover:-translate-y-1`}>
                <subject.icon size={32} className={`${subject.color} mb-3`} />
                <span className="font-bold text-slate-200 text-sm">{subject.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. EL DIFERENCIADOR (Laboratorio Virtual) */}
      <section id="metodologia" className="py-20 bg-slate-900 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tight mb-6">No solo explicamos. <br/>Lo visualizamos en tiempo real.</h2>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-emerald-950/50 border border-emerald-900/50 rounded-xl text-emerald-400 shrink-0">
                  <MonitorPlay size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-200 mb-1">Tecnología de Clase</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">Uso de GeoGebra y renderizado de ecuaciones en LaTeX para que la pizarra virtual sea perfecta y comprensible al 100%.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-blue-950/50 border border-blue-900/50 rounded-xl text-blue-400 shrink-0">
                  <Beaker size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-200 mb-1">Laboratorio Virtual Propio</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">Mis estudiantes tienen acceso exclusivo a simuladores desarrollados por mí, como el Rompecabezas de Valencias y el visor de organelos celulares.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Link href="/apps/educativas" className="text-blue-400 font-bold hover:text-blue-300 flex items-center gap-2">
                Explorar el Laboratorio Virtual <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-video bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600 shadow-2xl">
              <PlayCircle size={48} className="mb-4 opacity-50" />
              <p className="text-sm font-bold uppercase tracking-widest">Espacio para Video Destacado</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMUNIDAD Y CASOS DE ÉXITO */}
      <section id="comunidad" className="py-20 bg-slate-950 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 z-0 pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-950/30 border border-yellow-900/50 text-yellow-500 text-xs font-bold uppercase tracking-widest mb-4">
              <Star size={14} className="fill-yellow-500" /> Testimonios Reales
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Comunidad Clases 1a1</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Mis estudiantes no solo aprueban materias, construyen carreras. Conoce a los profesionales y emprendedores que forman parte de nuestra red de excelencia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {casosDeExito.map((caso: any) => (
              <div key={caso.id} className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 flex flex-col transition-all hover:border-blue-900/50 hover:shadow-lg hover:shadow-blue-900/10">
                <Quote size={32} className="text-slate-800 mb-4" />
                <p className="text-slate-300 italic text-sm leading-relaxed mb-6 flex-grow">
                  "{caso.testimonio}"
                </p>
                
                <div className="flex gap-1 mb-6">
                  {[...Array(caso.calificacion)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                  ))}
                </div>

                <hr className="border-slate-800 mb-6" />

                <div>
                  <h4 className="font-bold text-slate-100">{caso.nombre}</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-3">
                    <p className="text-xs text-blue-400 font-semibold">{caso.profesion}</p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase tracking-wider">
                      <MapPin size={10} />
                      {caso.ubicacion}
                    </div>
                  </div>
                  
                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                    <p className="text-sm font-semibold text-slate-200 mb-3">{caso.negocio}</p> 
                  <div className="flex flex-wrap gap-2 mb-4">
                    {caso.servicios?.map((servicio: string, index: number) => (
                      <span key={index} className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 px-2 py-1 rounded">
                        {servicio}
                      </span>
                    ))}
                  </div>

                  {caso.redes && caso.redes.length > 0 && (
                    <a href={caso.redes[0].url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2 px-4 rounded-lg transition-colors">
                      Contactar negocio <ExternalLink size={14} />
                    </a>
                  )}
                  </div>
                </div>
              </div>
            ))}

            {/* Tarjeta CTA para sumarse a la comunidad */}
            <div className="bg-slate-950 border border-dashed border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all hover:border-blue-500/50 hover:bg-slate-900/50 group">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <BookOpen size={24} className="text-blue-400" />
              </div>
              <h4 className="font-bold text-slate-200 mb-2">¿Eres exalumno?</h4>
              <p className="text-sm text-slate-400 mb-6">
                Suma tu consultorio, agencia o emprendimiento al directorio exclusivo de la comunidad.
              </p>
              <a href="https://www.facebook.com/clases1a1" target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm font-bold hover:text-blue-300 flex items-center gap-2">
                Solicitar invitación <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4.5. CARRUSEL DE RESEÑAS (Conectado a Upstash / Local) */}
      <section id="resenas" className="py-16 bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 mb-10 text-center flex flex-col items-center">
          <h3 className="text-2xl font-bold text-slate-200 mb-2">Lo que opina nuestra comunidad</h3>
          <p className="text-slate-400 text-sm mb-6">Reseñas reales de años de experiencia transformando resultados.</p>
          
          {/* Botón para que los visitantes dejen su reseña */}
          <Link href="apps/testimonios" className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg">
            <MessageSquareQuote size={18} className="text-accent-gold" /> Dejar una reseña
          </Link>
        </div>

        <div className="relative w-full flex overflow-x-hidden group">
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-100%); }
            }
            .animate-marquee {
              animation: marquee 35s linear infinite;
            }
            .group:hover .animate-marquee {
              animation-play-state: paused;
            }
          `}</style>

          <div className="flex w-max animate-marquee gap-6 px-3 mt-4">
            {/* Iteramos directamente sobre nuestro estado que ya combinó ambas listas */}
            {[...resenasDinamicas, ...resenasDinamicas].map((resena, index) => {
              const tieneTexto = resena.texto && resena.texto.trim() !== "";

              return (
                <div key={index} className="w-80 md:w-96 flex-shrink-0 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col transition-colors hover:border-slate-700">
                  {tieneTexto ? (
                    <>
                      <div className="flex gap-1 mb-3">
                        {[...Array(resena.calificacion || 5)].map((_, i) => (
                          <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                      <p className="text-slate-300 text-sm italic mb-6 flex-grow leading-relaxed whitespace-pre-line">
                        {resena.texto}
                      </p>
                      <div className="border-t border-slate-800 pt-4 mt-auto">
                        <p className="font-bold text-slate-200 text-sm">{resena.nombre}</p>
                        {resena.contexto && <p className="text-xs text-blue-400">{resena.contexto}</p>}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full flex-grow text-center gap-4">
                      <div className="flex gap-1.5 mb-2">
                        {[...Array(resena.calificacion || 5)].map((_, i) => (
                          <Star key={i} size={24} className="text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                      <div>
                        <p className="font-black text-slate-100 text-xl mb-1">{resena.nombre}</p>
                        {resena.contexto && <p className="text-sm text-blue-400 font-medium">{resena.contexto}</p>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. FOOTER SIMPLE */}
      <footer id="contacto" className="py-12 bg-slate-950 text-center border-t border-slate-800">
        <div className="flex justify-center items-center gap-6 mb-6">
          <a href="https://www.facebook.com/clases1a1" className="text-slate-500 hover:text-blue-500 transition-colors">
            <MessageCircle size={24} />
          </a>
          <a href="#" className="text-slate-500 hover:text-red-500 transition-colors">
            <PlayCircle size={24} />
          </a>
        </div>
        <p className="text-slate-500 text-sm font-bold mb-2">Clases 1 a 1 | Prof. Roy Ramirez Tomasini</p>
        <p className="text-slate-600 text-xs flex items-center justify-center gap-1">
          <MapPin size={12} /> CDMX, México
        </p>
      </footer>
    </div>
  );
}