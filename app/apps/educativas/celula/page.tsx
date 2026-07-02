"use client";

import React, { useState, useMemo } from 'react';
import { LucideInfo, LucideDna, LucideMousePointer2, LucideCheckCircle, LucideX, LucideTarget, LucideChevronRight } from 'lucide-react';

// Coordenadas recalibradas y textos enriquecidos con formas y colores
const ORGANELLES_DATA = {
  animal: [
    { id: 'nucleus', name: 'Núcleo', color: '#FF55FF', info: 'Centro de control que contiene el ADN. Forma una gran esfera central (color rosa fuerte).', top: '30%', left: '55%' },
    { id: 'nucleolus', name: 'Nucleolo', color: '#FFFF00', info: 'Estructura densa dentro del núcleo que fabrica ribosomas. Es la pequeña esfera brillante en su interior (color amarillo).', top: '38%', left: '62%' },
    { id: 'er', name: 'Retículo Endoplasmático', color: '#00AAFF', info: 'Sintetiza proteínas. Parece un laberinto de túbulos plegados que abraza al núcleo (estructuras verdes alrededor del rosa).', top: '35%', left: '40%' },
    { id: 'mitochondria', name: 'Mitocondria', color: '#FF8800', info: 'La central energética (produce ATP). Tienen forma de frijol u óvalo con una línea en zigzag adentro (color rosa con amarillo).', top: '67%', left: '30%' },
    { id: 'golgi', name: 'Aparato de Golgi', color: '#FFDD00', info: 'Empaqueta y distribuye proteínas. Parece una pila de sacos curvos aplanados, apilados unos sobre otros (color naranja abajo).', top: '80%', left: '50%' },
    { id: 'lysosome', name: 'Lisosoma', color: '#FF4444', info: 'Vesículas de limpieza celular. Son los pequeños círculos dispersos por la célula (color naranja claro/amarillo).', top: '46%', left: '25%' },
  ],
  plant: [
    { id: 'cell_wall', name: 'Pared Celular', color: '#22AA55', info: 'Capa externa que da soporte. Es el contorno más grueso y rígido que rodea toda la célula (color verde oscuro exterior).', top: '15%', left: '10%' },
    { id: 'nucleus', name: 'Núcleo', color: '#FF55FF', info: 'Almacena la información genética. Es la gran esfera desplazada hacia un costado (color morado/lila).', top: '25%', left: '70%' },
    { id: 'vacuole', name: 'Vacuola Central', color: '#44CCFF', info: 'Almacena agua y da presión. Es la enorme bolsa que ocupa casi todo el centro de la célula (color azul claro).', top: '55%', left: '45%' },
    { id: 'chloroplast', name: 'Cloroplasto', color: '#00FF66', info: 'Lugar de la fotosíntesis. Son óvalos con estructuras que parecen pilas de monedas adentro (color verde brillante). NOTA: Hay varios dispersos.', top: '79%', left: '29%' },
    { id: 'mitochondria', name: 'Mitocondria', color: '#FF8800', info: 'Produce energía celular. Tiene forma de frijol con pliegues internos (color fucsia/rojo con amarillo).', top: '61%', left: '80%' },
  ]
};

export default function CelulaApp() {
  const [cellType, setCellType] = useState<'animal' | 'plant'>('animal');
  const [mode, setMode] = useState<'study' | 'quiz'>('study'); 
  const [selectedOrganelle, setSelectedOrganelle] = useState<any>(null);
  
  const [solved, setSolved] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{type: string, text: string} | null>(null);
  
  // --- HERRAMIENTA DE CALIBRACIÓN VISUAL (APAGADA) ---
  // const [coordenadas, setCoordenadas] = useState<string | null>(null);
  
  // const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //   const rect = e.currentTarget.getBoundingClientRect();
  //   const x = ((e.clientX - rect.left) / rect.width) * 100;
  //   const y = ((e.clientY - rect.top) / rect.height) * 100;
  //   setCoordenadas(`top: '${y.toFixed(0)}%', left: '${x.toFixed(0)}%'`);
  // }; 
  // ---------------------------------------------------

  const currentQuizTarget = useMemo(() => {
    if (mode !== 'quiz') return null;
    const pending = ORGANELLES_DATA[cellType].filter(o => !solved.includes(o.id));
    if (pending.length === 0) return null;
    return pending[Math.floor(Math.random() * pending.length)];
  }, [cellType, mode, solved]);

  const handlePinClick = (org: any) => {
    if (mode === 'study') {
      setSelectedOrganelle(org);
    } else if (mode === 'quiz' && currentQuizTarget) {
      if (org.id === currentQuizTarget.id) {
        setSolved(prev => [...prev, org.id]);
        setFeedback({ type: 'success', text: '¡Correcto!' });
        setTimeout(() => setFeedback(null), 1500);
      } else {
        setFeedback({ type: 'error', text: 'Incorrecto, intenta de nuevo.' });
        setTimeout(() => setFeedback(null), 1500);
      }
    }
  };

  const resetQuiz = () => {
    setSolved([]);
    setFeedback(null);
    setSelectedOrganelle(null);
  };

  const toggleMode = (newMode: 'study' | 'quiz') => {
    setMode(newMode);
    resetQuiz();
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* Navbar Superior */}
      <header className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center z-30">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500 p-2 rounded-lg">
            <LucideDna size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-md font-bold tracking-tight">Biología: La Célula</h1>
            <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">Diagrama Interactivo 2D</p>
          </div>
        </div>
        <div className="flex gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button onClick={() => { setCellType('animal'); resetQuiz(); }}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${cellType === 'animal' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
            Animal
          </button>
          <button onClick={() => { setCellType('plant'); resetQuiz(); }}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${cellType === 'plant' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
            Vegetal
          </button>
        </div>
      </header>

      {/* Main a 3 Columnas */}
      <main className="flex flex-1 relative overflow-hidden">
        
        {/* Columna 1: Sidebar de Control */}
        <aside className="w-72 bg-slate-900/95 border-r border-slate-800 p-4 flex flex-col gap-5 z-20 shadow-2xl shrink-0">
          <div className="flex p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button onClick={() => toggleMode('study')}
              className={`flex-1 py-2 rounded text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${mode === 'study' ? 'bg-slate-800 text-indigo-400' : 'text-slate-500'}`}>
              <LucideInfo size={14} /> Estudiar
            </button>
            <button onClick={() => toggleMode('quiz')}
              className={`flex-1 py-2 rounded text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${mode === 'quiz' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>
              <LucideMousePointer2 size={14} /> Evaluar
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {mode === 'study' ? (
              <div className="space-y-2">
                <p className="text-xs text-slate-400 mb-4">Selecciona un organelo para ver su información detallada.</p>
                {ORGANELLES_DATA[cellType].map((org) => {
                  const isSelected = selectedOrganelle?.id === org.id;
                  return (
                    <button 
                      key={org.id} 
                      onClick={() => setSelectedOrganelle(org)}
                      className={`w-full text-left group p-3 rounded-xl border transition-all duration-300 flex items-center justify-between
                        ${isSelected 
                          ? 'bg-slate-100 border-white text-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                          : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-400 text-slate-300'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: org.color }} />
                        <span className={`text-sm font-bold ${isSelected ? 'text-slate-900' : 'text-slate-300'}`}>{org.name}</span>
                      </div>
                      {isSelected && <LucideChevronRight size={18} className="text-slate-900" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                {!currentQuizTarget ? (
                  <div className="animate-in fade-in zoom-in">
                    <LucideCheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">¡Misión Cumplida!</h3>
                    <p className="text-xs text-slate-400 mb-6">Has identificado todos los organelos correctamente.</p>
                    <button onClick={resetQuiz} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg text-xs font-bold uppercase transition-colors">
                      Jugar de nuevo
                    </button>
                  </div>
                ) : (
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 w-full animate-in fade-in">
                    <LucideTarget size={32} className="mx-auto text-indigo-400 mb-4 animate-pulse" />
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-black mb-2">Encuentra el:</p>
                    <h3 className="text-xl font-bold text-white mb-4">{currentQuizTarget.name}</h3>
                    <p className="text-xs text-slate-500">Haz clic en el pin correspondiente en el diagrama.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Columna 2: Panel de Información Elevado */}
        {mode === 'study' && selectedOrganelle && (
          <aside className="w-72 bg-slate-900 border-r border-slate-800 p-6 pt-12 z-15 shadow-2xl flex flex-col justify-start animate-in slide-in-from-left-8 shrink-0">
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl relative shadow-lg">
              <button onClick={() => setSelectedOrganelle(null)} className="absolute top-3 right-3 text-slate-500 hover:text-white bg-slate-900 rounded-full p-1 transition-colors">
                <LucideX size={16} />
              </button>
              <div className="flex items-center gap-3 mb-4 pr-6">
                <div className="w-4 h-4 rounded-full border-2 border-white/20 shrink-0" style={{ backgroundColor: selectedOrganelle.color }} />
                <h2 className="text-xl font-black text-white leading-tight">{selectedOrganelle.name}</h2>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed border-l-2 border-indigo-500 pl-3">
                {selectedOrganelle.info}
              </p>
            </div>
          </aside>
        )}

        {/* Columna 3: Visor 2D Principal */}
        <section className="flex-1 relative bg-slate-950 flex items-center justify-center p-4 overflow-hidden">
          
          {/* EL LETRERO DE CALIBRACIÓN (APAGADO) */}
          {/* 
          {coordenadas && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white px-8 py-4 rounded-full font-mono text-lg font-bold shadow-2xl border-4 border-white animate-pulse">
              📍 {coordenadas}
            </div>
          )} 
          */}

          <div 
            className="relative max-w-4xl w-full aspect-[4/3] bg-slate-900 rounded-3xl border-2 border-slate-800 overflow-hidden shadow-2xl"
          >
            <img 
              src={cellType === 'animal' ? '/images/celula-animal.avif' : '/images/celula-vegetal.jpg'} 
              alt={`Célula ${cellType}`}
              className="w-full h-full object-contain opacity-90 pointer-events-none" 
            />

            {/* Pines Interactivos */}
            {ORGANELLES_DATA[cellType].map((org) => {
              const isSolved = solved.includes(org.id);
              const isSelected = selectedOrganelle?.id === org.id;

              return (
                <button
                  key={org.id}
                  onClick={() => handlePinClick(org)}
                  style={{ top: org.top, left: org.left }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-300 z-10 hover:scale-125
                    ${mode === 'quiz' && isSolved ? 'w-10 h-10 bg-green-500 text-white' : 'w-8 h-8 bg-black/40 backdrop-blur-md border-2 border-white/80 hover:bg-black/60'}
                    ${isSelected ? 'scale-150 ring-4 ring-white ring-offset-4 ring-offset-slate-900 bg-indigo-600 border-transparent' : ''}
                  `}
                >
                  {mode === 'quiz' && isSolved && <LucideCheckCircle size={20} />}
                  {isSelected && <LucideTarget size={18} className="text-white animate-pulse" />}
                  {!isSolved && !isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />}
                </button>
              );
            })}
          </div>

          {/* Feedback Visual del Quiz */}
          {feedback && (
            <div className={`absolute top-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl border-2 flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4 
              ${feedback.type === 'success' ? 'bg-green-600/90 border-green-300' : 'bg-red-600/90 border-red-300'}`}>
              <span className="font-black text-sm uppercase tracking-wider text-white">{feedback.text}</span>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}