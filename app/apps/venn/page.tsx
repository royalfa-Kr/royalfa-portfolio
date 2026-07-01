"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CheckCircle2, XCircle, RefreshCw, Wand2, Layers } from 'lucide-react';

// Regiones del diagrama de Venn para 3 conjuntos
const REGIONS_DATA = [
  { id: 'R1', a: true,  b: true,  c: true,  label: 'R-1' },
  { id: 'R2', a: true,  b: true,  c: false, label: 'R-2' },
  { id: 'R3', a: false, b: true,  c: true,  label: 'R-3' },
  { id: 'R4', a: true,  b: false, c: true,  label: 'R-4' },
  { id: 'R5', a: false, b: false, c: true,  label: 'R-5' },
  { id: 'R6', a: false, b: true,  c: false, label: 'R-6' },
  { id: 'R7', a: true,  b: false, c: false, label: 'R-7' },
  { id: 'R8', a: false, b: false, c: false, label: 'R-8' },
];

export default function VennPage() {
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set());
  const [currentOperation, setCurrentOperation] = useState<any>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [level, setLevel] = useState<1 | 2>(1);

  const generateOperation = useCallback((currentLevel: number) => {
    const sets = ['A', 'B', 'C'];
    const randSet = () => sets[Math.floor(Math.random() * sets.length)];
    
    // Nivel 1: Operaciones básicas y directas
    const templatesL1 = [
      () => { const s1 = randSet(); const s2 = sets.find(s => s !== s1)!; return { text: `${s1} ∪ ${s2}`, eval: (m:any) => m[s1] || m[s2] }; },
      () => { const s1 = randSet(); const s2 = sets.find(s => s !== s1)!; return { text: `${s1} ∩ ${s2}`, eval: (m:any) => m[s1] && m[s2] }; },
      () => { const s1 = randSet(); const s2 = sets.find(s => s !== s1)!; return { text: `${s1} - ${s2}`, eval: (m:any) => m[s1] && !m[s2] }; },
      () => { const s1 = randSet(); return { text: `${s1}'`, eval: (m:any) => !m[s1] }; },
      () => { 
        const s1 = randSet(); const s2 = sets.find(s => s !== s1)!; const s3 = sets.find(s => s !== s1 && s !== s2)!;
        return { text: `${s1} ∪ (${s2} ∩ ${s3})`, eval: (m:any) => m[s1] || (m[s2] && m[s3]) }; 
      }
    ];

    // Nivel 2: Operaciones complejas con complementos y diferencias
    const templatesL2 = [
      () => { 
        const s1 = randSet(); const s2 = sets.find(s => s !== s1)!; const s3 = sets.find(s => s !== s1 && s !== s2)!;
        return { text: `(${s1} ∪ ${s2})' - ${s3}`, eval: (m:any) => !(m[s1] || m[s2]) && !m[s3] }; 
      },
      () => {
        const s1 = randSet(); const s2 = sets.find(s => s !== s1)!; const s3 = sets.find(s => s !== s1 && s !== s2)!;
        return { text: `(${s1} ∩ ${s2})' ∩ ${s3}`, eval: (m:any) => !(m[s1] && m[s2]) && m[s3] };
      },
      () => {
        const s1 = randSet(); const s2 = sets.find(s => s !== s1)!; const s3 = sets.find(s => s !== s1 && s !== s2)!;
        return { text: `(${s1} - ${s2}) ∪ (${s2} - ${s3})`, eval: (m:any) => (m[s1] && !m[s2]) || (m[s2] && !m[s3]) };
      },
      () => {
        const s1 = randSet(); const s2 = sets.find(s => s !== s1)!; const s3 = sets.find(s => s !== s1 && s !== s2)!;
        return { text: `(${s1} ∪ ${s2}) - ${s3}'`, eval: (m:any) => (m[s1] || m[s2]) && m[s3] };
      }
    ];

    const templates = currentLevel === 1 ? templatesL1 : templatesL2;

    let newOp;
    let hasResult = false;
    
    // Bucle para asegurar que la operación pinte al menos una región
    while (!hasResult) {
      newOp = templates[Math.floor(Math.random() * templates.length)]();
      hasResult = REGIONS_DATA.some(r => newOp.eval({ A: r.a, B: r.b, C: r.c }));
    }

    setCurrentOperation(newOp);
    setSelectedRegions(new Set());
    setFeedback(null);
  }, []);

  useEffect(() => {
    generateOperation(level);
  }, [level, generateOperation]);

  const toggleRegion = (id: string) => {
    const newSelected = new Set(selectedRegions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRegions(newSelected);
    setFeedback(null);
  };

  const getCorrectIds = () => {
    if (!currentOperation) return [];
    return REGIONS_DATA.filter(r => currentOperation.eval({ A: r.a, B: r.b, C: r.c })).map(r => r.id);
  };

  const checkAnswer = () => {
    if (!currentOperation) return;
    const correctIds = getCorrectIds();
    const isCorrect = correctIds.length === selectedRegions.size && correctIds.every(id => selectedRegions.has(id));
    setFeedback(isCorrect ? 'correct' : 'incorrect');
  };

  const solveOperation = () => {
    const correctIds = getCorrectIds();
    setSelectedRegions(new Set(correctIds));
    setFeedback(null);
  };

  const handleLevelChange = (newLevel: 1 | 2) => {
    setLevel(newLevel);
    generateOperation(newLevel);
  };

  // Función auxiliar para determinar el color de cada región en el SVG
  const getRegionClass = (id: string) => {
    return selectedRegions.has(id) 
      ? 'fill-accent-gold transition-colors duration-200' 
      : 'fill-base-surface hover:fill-base-surface/80 transition-colors duration-200 cursor-pointer';
  };

  return (
    <div className="min-h-screen bg-base-dark p-4 md:p-8 font-sans text-text-main flex flex-col items-center">
      <div className="w-full max-w-5xl">
        
        {/* Navegación */}
        <div className="mb-6 w-full text-left">
          <Link href="/apps" className="text-accent-gold hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
            ← Volver al Laboratorio
          </Link>
        </div>

        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-accent-gold mb-3">Diagramas de Venn</h1>
          <p className="text-text-muted italic">Sombrea las regiones que corresponden a la operación matemática.</p>
        </header>

        <main className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Columna Izquierda: Diagrama Interactivo */}
          <div className="bg-base-surface p-6 md:p-10 rounded-sm border border-base-border flex flex-col items-center shadow-lg">
            
            {/* Selector de Nivel integrado sobre el SVG */}
            <div className="w-full flex justify-center mb-6">
              <div className="flex bg-base-dark border border-base-border rounded-sm p-1">
                <button onClick={() => handleLevelChange(1)} className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-colors ${level === 1 ? 'bg-accent-gold/20 text-accent-gold' : 'text-text-muted hover:text-text-main'}`}>Nivel 1</button>
                <button onClick={() => handleLevelChange(2)} className={`px-4 py-1.5 text-sm font-medium rounded-sm transition-colors ${level === 2 ? 'bg-accent-gold/20 text-accent-gold' : 'text-text-muted hover:text-text-main'}`}>Nivel 2</button>
              </div>
            </div>

            <div className="relative w-full aspect-square max-w-[420px]">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                <defs>
                  <circle id="cA" cx="150" cy="160" r="90" />
                  <circle id="cB" cx="250" cy="160" r="90" />
                  <circle id="cC" cx="200" cy="245" r="90" />
                  <clipPath id="clipA"><use href="#cA" /></clipPath>
                  <clipPath id="clipB"><use href="#cB" /></clipPath>
                  <clipPath id="clipC"><use href="#cC" /></clipPath>
                  <clipPath id="notA"><rect x="0" y="0" width="400" height="400" /><circle cx="150" cy="160" r="90" fill="black" /></clipPath>
                  <clipPath id="notB"><rect x="0" y="0" width="400" height="400" /><circle cx="250" cy="160" r="90" fill="black" /></clipPath>
                  <clipPath id="notC"><rect x="0" y="0" width="400" height="400" /><circle cx="200" cy="245" r="90" fill="black" /></clipPath>
                </defs>

                {/* R8: Universo */}
                <rect x="10" y="10" width="380" height="380" 
                  className={`cursor-pointer transition-colors stroke-2 stroke-base-border ${selectedRegions.has('R8') ? 'fill-accent-gold/10' : 'fill-base-dark hover:fill-base-dark/80'}`}
                  onClick={() => toggleRegion('R8')}
                />
                <text x="25" y="40" className="font-serif font-bold text-2xl fill-text-muted pointer-events-none">U</text>

                {/* Regiones individuales (Usando el mapa de clips) */}
                <g clipPath="url(#clipA)"><g clipPath="url(#notB)"><path d="M0 0h400v400H0z" clipPath="url(#notC)" className={getRegionClass('R7')} onClick={(e) => { e.stopPropagation(); toggleRegion('R7'); }} /></g></g>
                <g clipPath="url(#clipB)"><g clipPath="url(#notA)"><path d="M0 0h400v400H0z" clipPath="url(#notC)" className={getRegionClass('R6')} onClick={(e) => { e.stopPropagation(); toggleRegion('R6'); }} /></g></g>
                <g clipPath="url(#clipC)"><g clipPath="url(#notA)"><path d="M0 0h400v400H0z" clipPath="url(#notB)" className={getRegionClass('R5')} onClick={(e) => { e.stopPropagation(); toggleRegion('R5'); }} /></g></g>
                <g clipPath="url(#clipA)"><g clipPath="url(#clipB)"><path d="M0 0h400v400H0z" clipPath="url(#notC)" className={getRegionClass('R2')} onClick={(e) => { e.stopPropagation(); toggleRegion('R2'); }} /></g></g>
                <g clipPath="url(#clipA)"><g clipPath="url(#clipC)"><path d="M0 0h400v400H0z" clipPath="url(#notB)" className={getRegionClass('R4')} onClick={(e) => { e.stopPropagation(); toggleRegion('R4'); }} /></g></g>
                <g clipPath="url(#clipB)"><g clipPath="url(#clipC)"><path d="M0 0h400v400H0z" clipPath="url(#notA)" className={getRegionClass('R3')} onClick={(e) => { e.stopPropagation(); toggleRegion('R3'); }} /></g></g>
                <g clipPath="url(#clipA)"><g clipPath="url(#clipB)"><path d="M0 0h400v400H0z" clipPath="url(#clipC)" className={getRegionClass('R1')} onClick={(e) => { e.stopPropagation(); toggleRegion('R1'); }} /></g></g>

                {/* Bordes de los círculos */}
                <circle cx="150" cy="160" r="90" fill="none" stroke="currentColor" className="text-base-border stroke-[3px] pointer-events-none" />
                <circle cx="250" cy="160" r="90" fill="none" stroke="currentColor" className="text-base-border stroke-[3px] pointer-events-none" />
                <circle cx="200" cy="245" r="90" fill="none" stroke="currentColor" className="text-base-border stroke-[3px] pointer-events-none" />

                {/* Etiquetas A, B, C */}
                <text x="100" y="100" className="font-serif font-bold text-2xl fill-text-main pointer-events-none">A</text>
                <text x="280" y="100" className="font-serif font-bold text-2xl fill-text-main pointer-events-none">B</text>
                <text x="200" y="365" className="font-serif font-bold text-2xl fill-text-main pointer-events-none">C</text>
                
                {/* Etiquetas sutiles de ayuda R-X */}
                <g className="text-[10px] fill-text-muted font-mono pointer-events-none select-none opacity-40">
                  <text x="200" y="195" textAnchor="middle">R-1</text>
                  <text x="200" y="125" textAnchor="middle">R-2</text>
                  <text x="260" y="210" textAnchor="middle">R-3</text>
                  <text x="140" y="210" textAnchor="middle">R-4</text>
                  <text x="200" y="295" textAnchor="middle">R-5</text>
                  <text x="280" y="165" textAnchor="middle">R-6</text>
                  <text x="120" y="165" textAnchor="middle">R-7</text>
                  <text x="35" y="370">R-8</text>
                </g>
              </svg>
            </div>
          </div>

          {/* Columna Derecha: Controles y Feedback */}
          <div className="flex flex-col gap-6">
            
            {/* Display de Operación */}
            <section className="bg-base-dark border border-base-border p-8 rounded-sm shadow-xl flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="text-accent-gold" size={18} />
                <h2 className="text-xs font-medium uppercase text-text-muted tracking-widest">Operación a resolver</h2>
              </div>
              <div className="text-4xl md:text-5xl font-mono text-text-main">{currentOperation?.text}</div>
            </section>

            {/* Panel lateral de Feedback (Aparece justo debajo de la operación) */}
            {feedback && (
              <div className={`p-4 rounded-sm border flex items-center gap-4 transition-all duration-300 ${
                feedback === 'correct' 
                  ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                {feedback === 'correct' ? <CheckCircle2 size={28} className="shrink-0" /> : <XCircle size={28} className="shrink-0" />}
                <p className="text-base font-medium">
                  {feedback === 'correct' ? '¡Excelente! Regiones correctas.' : 'Selección incorrecta, revisa el diagrama.'}
                </p>
              </div>
            )}

            {/* Botones de Acción */}
            <section className="bg-base-surface p-6 rounded-sm border border-base-border shadow-lg">
              <div className="space-y-4">
                <button 
                  onClick={checkAnswer}
                  className="w-full py-4 bg-accent-gold/10 hover:bg-accent-gold text-accent-gold hover:text-base-dark border border-accent-gold font-serif font-bold text-lg rounded-sm transition-all duration-300"
                >
                  Verificar Selección
                </button>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => generateOperation(level)}
                    className="flex-1 py-3 bg-base-dark hover:bg-base-dark/70 text-text-main border border-base-border font-medium rounded-sm transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={18} /> Nuevo Ejercicio
                  </button>
                  
                  <button 
                    onClick={solveOperation}
                    title="Resolver automáticamente"
                    className="py-3 px-4 bg-base-dark hover:bg-accent-gold/10 text-text-muted hover:text-accent-gold border border-base-border hover:border-accent-gold/50 font-medium rounded-sm transition-all flex items-center justify-center"
                  >
                    <Wand2 size={18} />
                  </button>
                </div>

                <button 
                  onClick={() => setSelectedRegions(new Set())} 
                  className="w-full py-2 mt-2 text-text-muted text-sm hover:text-text-main transition-colors underline decoration-base-border hover:decoration-text-main underline-offset-4"
                >
                  Borrar toda la selección
                </button>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}