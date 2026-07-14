"use client";

import React, { useState } from 'react';

import { casosDeExito } from '@/data/comunidad';

const ExternalLink = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>;
const MapPin = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const Star = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const BookOpen = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const Quote = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>;
const ArrowRight = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const Copy = ({ size = 16, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>;
const Check = ({ size = 16, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"></polyline></svg>;

const EmailCopyBox = ({ emailUrl }: { emailUrl: string }) => {
  const [copied, setCopied] = useState(false);
  const cleanEmail = emailUrl.replace('mailto:', '');

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 mb-2 flex items-center justify-between bg-slate-950/80 border border-slate-800 rounded-xl p-2 px-4 group hover:border-slate-700 transition-colors">
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Correo Electrónico</span>
        <span className="text-sm text-slate-300 font-medium">{cleanEmail}</span>
      </div>
      <button 
        onClick={handleCopy}
        className={`p-2 rounded-lg transition-all duration-300 ${copied ? 'bg-green-500/20 text-green-400' : 'bg-slate-900 text-slate-400 hover:text-amber-400 hover:bg-slate-800'}`}
        title="Copiar correo"
      >
        {copied ? <Check size={18} /> : <Copy size={18} />}
      </button>
    </div>
  );
};

export default function ComunidadPage() {
  
  const getIcon = (nombre: string) => {
    const lowerName = nombre.toLowerCase();
    if (lowerName.includes('instagram')) return (
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
    );
    if (lowerName.includes('twitch')) return (
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"></path></svg>
    );
    if (lowerName.includes('tiktok')) return (
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
    );
    if (lowerName.includes('linkedin')) return (
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
    );
    if (lowerName.includes('whatsapp')) return (
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
    );
    return <ExternalLink size={16} />;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30">
      
      {}
      <header className="relative border-b border-slate-800 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/10 via-slate-950 to-slate-950 z-0"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/30 border border-amber-900/50 text-amber-500 text-xs font-bold uppercase tracking-widest mb-6">
            <Star size={14} className="fill-amber-500" /> Directorio de Exalumnos
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-tight text-amber-400">
            Nuestra Comunidad
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Mis estudiantes no solo aprueban materias, construyen carreras.<br /> 
            Conoce a los profesionales y emprendedores que forman parte de nuestra red de excelencia.
          </p>
        </div>
      </header>

      {}
      <section className="py-16 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {casosDeExito.map((caso: any) => {
              
              // Separamos el correo, whatsapp y las redes "normales"
              const redCorreo = caso.redes?.find((r: any) => r.nombre.toLowerCase().includes('correo') || r.nombre.toLowerCase().includes('email'));
              const redWhatsapp = caso.redes?.find((r: any) => r.nombre.toLowerCase().includes('whatsapp'));
              const redesSociales = caso.redes?.filter((r: any) => !r.nombre.toLowerCase().includes('correo') && !r.nombre.toLowerCase().includes('email') && !r.nombre.toLowerCase().includes('whatsapp'));

              // Limpiamos el número de WhatsApp para el enlace
              let numWhatsapp = '';
              let linkWhatsapp = '';
              if (redWhatsapp) {
                numWhatsapp = redWhatsapp.url.replace(/^https?:\/\//, '').replace('wa.me/', '').replace(/\s+/g, '');
                linkWhatsapp = `https://wa.me/${numWhatsapp}`;
              }

              return (
                <div key={caso.id} className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 flex flex-col transition-all hover:border-amber-900/50 hover:shadow-lg hover:shadow-amber-900/10 relative overflow-hidden h-full">
                  
                  {/* Marca de agua decorativa */}
                  <Quote size={120} className="absolute text-slate-800/20 -top-4 -left-4 z-0 pointer-events-none transform -rotate-6" />

                  {/* 1. Encabezado: Logo y Proyecto */}
                  <div className="flex items-center gap-4 mb-6 relative z-10 flex-none">
                    <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
                      {caso.logo ? (
                        <img src={caso.logo} alt={`Logo de ${caso.negocio}`} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-black text-amber-500">{caso.negocio.charAt(0)}</span>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-slate-100 leading-tight mb-1">{caso.negocio}</h3>
                      <h4 className="font-bold text-amber-500 text-sm">{caso.nombre}</h4>
                      <p className="text-xs text-slate-400">{caso.profesion}</p>
                    </div>
                  </div>

                  {/* 2. Contenedor Central Flex-Grow (Llena el espacio vacío) */}
                  <div className="flex-grow flex flex-col relative z-10 mb-6">
                    
                    {/* Ubicación */}
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase tracking-wider mb-4 font-bold">
                      <MapPin size={12} className="text-amber-500" />
                      {caso.ubicacion}
                    </div>

                    {/* Split Layout: Servicios (Izq) y Redes (Der) centradas verticalmente */}
                    <div className="flex justify-between items-center gap-4 mb-6">
                      
                      {/* Izquierda: Servicios en lista vertical */}
                      <div className="flex flex-col gap-2 w-full">
                        {caso.servicios && caso.servicios.map((servicio: string, index: number) => (
                          <span key={index} className="text-[10px] font-bold uppercase tracking-wider bg-slate-950 border border-slate-800 text-slate-400 px-3 py-1.5 rounded-md w-fit">
                            {servicio}
                          </span>
                        ))}
                      </div>

                      {/* Derecha: Redes Sociales en lista vertical */}
                      {redesSociales && redesSociales.length > 0 && (
                        <div className="flex flex-col gap-2 flex-none">
                          {redesSociales.map((red: any, index: number) => {
                            let finalUrl = red.url;
                            if (!finalUrl.startsWith('http')) {
                              finalUrl = `https://${finalUrl.replace('@', '')}`;
                            }
                            return (
                              <a
                                key={index}
                                href={finalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={red.nombre}
                                className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/50 hover:-translate-y-1 transition-all shadow-sm"
                              >
                                {getIcon(red.nombre)}
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Contactos Directos: Botón WhatsApp y Cajón de Correo (Empujados hacia abajo) */}
                    <div className="mt-auto space-y-3">
                      {redWhatsapp && (
                        <a href={linkWhatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-colors text-sm font-bold">
                          {getIcon('whatsapp')} WhatsApp
                        </a>
                      )}
                      
                      {redCorreo && <EmailCopyBox emailUrl={redCorreo.url} />}
                    </div>

                  </div>

                  {/* 3. Reseña (Testimonio) anclada al fondo */}
                  <div className="pt-6 border-t border-slate-800/60 relative z-10 text-center flex flex-col items-center flex-none">
                    <p className="text-slate-400 italic text-sm leading-relaxed mb-4 max-w-[95%]">
                      "{caso.testimonio}"
                    </p>
                    
                    <div className="flex gap-1 justify-center">
                      {[...Array(caso.calificacion)].map((_, i) => (
                        <Star key={i} size={14} className="text-amber-500/50 fill-amber-500/50" />
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}

            {/* Tarjeta de Call to Action (CTA) para invitar a nuevos exalumnos */}
            <div className="bg-slate-950 border border-dashed border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all hover:border-amber-500/50 hover:bg-slate-900/50 group min-h-[300px]">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <BookOpen size={24} className="text-amber-400" />
              </div>
              <h4 className="font-bold text-slate-200 mb-2">¿Eres exalumno?</h4>
              <p className="text-sm text-slate-400 mb-6">
                Suma tu consultorio, agencia o emprendimiento a nuestro directorio exclusivo.
              </p>
              <a href="https://www.facebook.com/clases1a1" target="_blank" rel="noopener noreferrer" className="text-amber-400 text-sm font-bold hover:text-amber-300 flex items-center gap-2">
                Solicitar invitación <ArrowRight size={16} />
              </a>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}