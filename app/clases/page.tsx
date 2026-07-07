import React from 'react';
import Link from 'next/link';
import { BookOpen, MonitorPlay, Beaker, Calculator, Brain, Code, ArrowRight, Star, PlayCircle, MessageCircle, MapPin } from 'lucide-react';

export default function ClasesLandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      
      {/* 1. HERO SECTION */}
      <header className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 z-0"></div>
        
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative z-10">
          
          {/* --- BANNER GRANDE CLASES 1A1 --- */}
          <div className="mb-12 w-full max-w-4xl">
            <img 
              src="images/LogoClases1a1big.png" 
              alt="Clases 1a1 Club de Estudio" 
              // Usamos w-full para que se expanda, h-48/h-64 para hacerlo panorámico, 
              // y object-cover para recortar lo sobrante sin deformar ni pixelar drásticamente.
              className="w-full h-48 md:h-64 object-cover object-center rounded-2xl shadow-2xl shadow-blue-900/10 border border-slate-800" 
            />
          </div>

          {/* --- ETIQUETA CON LOGO PEQUEÑO --- */}
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

      {/* 4. FOOTER SIMPLE */}
      <footer className="py-12 bg-slate-950 text-center border-t border-slate-800">
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