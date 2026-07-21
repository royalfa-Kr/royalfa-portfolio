"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Ruler, Compass, Trophy, Sparkles, Play, BookOpen, ArrowLeft, ArrowRight, RotateCcw, ArrowLeftCircle, ArrowRightCircle, MoveHorizontal, Calculator, ArrowRightLeft, Target, PenTool, LayoutGrid, Bookmark, CheckCircle2, Eye } from 'lucide-react';

/* =========================================================================
   1. DATOS DE UNIDADES Y PREFIJOS
   ========================================================================= */
const METRIC_PREFIXES = [
  { key: 'T',  name: 'tera',  exp: 12 },
  { key: 'G',  name: 'giga',  exp: 9 },
  { key: 'M',  name: 'mega',  exp: 6 },
  { key: 'k',  name: 'kilo',  exp: 3 },
  { key: 'h',  name: 'hecto', exp: 2 },
  { key: 'da', name: 'deca',  exp: 1 },
  { key: '',   name: 'Unidad Base', exp: 0 },
  { key: 'd',  name: 'deci',  exp: -1 },
  { key: 'c',  name: 'centi', exp: -2 },
  { key: 'm',  name: 'mili',  exp: -3 },
  { key: 'µ',  name: 'micro', exp: -6 },
  { key: 'n',  name: 'nano',  exp: -9 },
  { key: 'p',  name: 'pico',  exp: -12 }
];

const UNITS_DATA: Record<string, any> = {
  'm':   { name: 'Metro', symbol: 'm', category: 'SI Fundamental', concept: '📏 <strong>Mide:</strong> Longitud, Distancia y Posición.', area: 'Geometría y Cinemática', filterGroup: 'fundamental' },
  'g':   { name: 'Gramo', symbol: 'g', category: 'SI Fundamental', concept: '⚖️ <strong>Mide:</strong> Masa y Cantidad de Materia.', area: 'Mecánica y Química', filterGroup: 'fundamental' },
  's':   { name: 'Segundo', symbol: 's', category: 'SI Fundamental', concept: '⏱️ <strong>Mide:</strong> Tiempo e Intervalo de Duración.', area: 'Cinemática y Dinámica', filterGroup: 'fundamental' },
  'A':   { name: 'Ampere', symbol: 'A', category: 'SI Fundamental', concept: '⚡ <strong>Mide:</strong> Intensidad de Corriente Eléctrica.', area: 'Circuitos y Electromagnetismo', filterGroup: 'circuits' },
  'K':   { name: 'Kelvin', symbol: 'K', category: 'SI Fundamental', concept: '🌡️ <strong>Mide:</strong> Temperatura Absoluta.', area: 'Termodinámica', filterGroup: 'fundamental' },
  'mol': { name: 'Mol', symbol: 'mol', category: 'SI Fundamental', concept: '🧪 <strong>Mide:</strong> Cantidad de Sustancia.', area: 'Física Molecular', filterGroup: 'fundamental' },
  'cd':  { name: 'Candela', symbol: 'cd', category: 'SI Fundamental', concept: '🕯️ <strong>Mide:</strong> Intensidad Luminosa.', area: 'Óptica', filterGroup: 'waves' },
  'N':   { name: 'Newton', symbol: 'N', category: 'Unidad Derivada', concept: '🏋️‍♂️ <strong>Mide:</strong> Fuerza y Peso (F = m · a).', area: 'Dinámica', filterGroup: 'newton' },
  'J':   { name: 'Joule', symbol: 'J', category: 'Unidad Derivada', concept: '🔥 <strong>Mide:</strong> Trabajo, Energía y Calor.', area: 'Energía', filterGroup: 'newton' },
  'W':   { name: 'Watt', symbol: 'W', category: 'Unidad Derivada', concept: '💡 <strong>Mide:</strong> Potencia Eléctrica/Mecánica.', area: 'Mecánica y Electro', filterGroup: 'newton' },
  'Pa':  { name: 'Pascal', symbol: 'Pa', category: 'Unidad Derivada', concept: '🌊 <strong>Mide:</strong> Presión y Esfuerzo.', area: 'Fluidos', filterGroup: 'newton' },
  'V':   { name: 'Volt', symbol: 'V', category: 'Unidad Derivada', concept: '🔋 <strong>Mide:</strong> Tensión y Voltaje.', area: 'Circuitos', filterGroup: 'circuits' },
  'Ω':   { name: 'Ohm', symbol: 'Ω', category: 'Unidad Derivada', concept: '🔌 <strong>Mide:</strong> Resistencia Eléctrica.', area: 'Circuitos', filterGroup: 'circuits' },
  'Hz':  { name: 'Hertz', symbol: 'Hz', category: 'Unidad Derivada', concept: '📻 <strong>Mide:</strong> Frecuencia de Ondas.', area: 'Ondas', filterGroup: 'waves' },
  'L':   { name: 'Litro', symbol: 'L', category: 'Aceptada en SI', concept: '🥛 <strong>Mide:</strong> Volumen de Líquidos.', area: 'Fluidos', filterGroup: 'fundamental' }
};

export default function SMDApp() {
  /* =========================================================================
     2. ESTADOS DE LA APP (Reemplazan el objeto global 'state' de JS)
     ========================================================================= */
  const [activeTab, setActiveTab] = useState<'explorer' | 'practice'>('explorer');
  const [baseValue, setBaseValue] = useState<number>(20);
  const [initialIndex, setInitialIndex] = useState<number>(3); // 'k'
  const [currentIndex, setCurrentIndex] = useState<number>(3);
  const [baseUnit, setBaseUnit] = useState<string>('m');
  
  // Práctica
  const [practiceType, setPracticeType] = useState<'direct' | 'table'>('table');
  const [exerciseDifficulty, setExerciseDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [exerciseCategoryFilter, setExerciseCategoryFilter] = useState<string>('all');
  const [score, setScore] = useState<number>(0);
  const [currentExercise, setCurrentExercise] = useState<any>(null);
  const [feedback, setFeedback] = useState<{type: string, message: React.ReactNode} | null>(null);

  // Referencias para inputs manuales y scroll
  const smartInputRef = useRef<HTMLInputElement>(null);
  const numInputRef = useRef<HTMLInputElement>(null);
  const directAnswerRef = useRef<HTMLInputElement>(null);
  const tableAnswerRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Calcular valor actual basado en el índice
  const currentValue = baseValue * Math.pow(10, currentIndex - initialIndex);
  const uData = UNITS_DATA[baseUnit] || { name: baseUnit, symbol: baseUnit, category: 'General', concept: 'Magnitud', area: 'Física' };

  // Formateador de números (para que no salgan cosas raras)
  const formatNumber = (num: number) => {
    if (num === 0) return "0";
    if (Math.abs(num) >= 1e-6 && Math.abs(num) <= 1e9) {
      return num.toLocaleString('es-MX', { maximumFractionDigits: 8 });
    }
    return num.toExponential(4);
  };

  // Sonidos muy básicos usando Web Audio API
  const playSound = (type: 'step' | 'success' | 'error') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'step') {
        osc.frequency.setValueAtTime(400 + (currentIndex * 30), ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start(); osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(); osc.stop(ctx.currentTime + 0.3);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start(); osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) { /* Fallback silencioso */ }
  };

  // Auto-scroll de la tabla
  useEffect(() => {
    if (scrollContainerRef.current) {
      const col = document.getElementById(`col-${currentIndex}`);
      if (col) {
        const offset = col.offsetLeft - (scrollContainerRef.current.clientWidth / 2) + (col.clientWidth / 2);
        scrollContainerRef.current.scrollTo({ left: offset, behavior: 'smooth' });
      }
    }
  }, [currentIndex, activeTab]);

  const moveStep = (direction: number) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < METRIC_PREFIXES.length) {
      setCurrentIndex(newIndex);
      playSound('step');
    } else {
      playSound('error');
    }
  };

  const processSmartInput = () => {
    const raw = smartInputRef.current?.value.trim();
    if (!raw) return;
    const match = raw.match(/^([+-]?\d*(?:\.\d+)?)\s*([a-zA-ZµΩ]*)$/);

    if (!match || !match[1]) {
      alert("Formato inválido. Usa: '20 km' o '1.5 MJ'");
      return;
    }
    const num = parseFloat(match[1]);
    const unitStr = match[2].trim();

    if (isNaN(num)) return;
    setBaseValue(num);

    if (unitStr) {
      let matchedBaseKey: string | null = null;
      let matchedPrefixKey = '';
      const sortedUnitKeys = Object.keys(UNITS_DATA).sort((a, b) => b.length - a.length);

      for (let uKey of sortedUnitKeys) {
        if (unitStr === uKey || unitStr.toLowerCase() === uKey.toLowerCase()) {
          matchedBaseKey = uKey; break;
        } else if (unitStr.toLowerCase().endsWith(uKey.toLowerCase())) {
          const prefixPart = unitStr.substring(0, unitStr.length - uKey.length);
          const prefixObj = METRIC_PREFIXES.find(p => 
            p.key.toLowerCase() === prefixPart.toLowerCase() ||
            (prefixPart.toLowerCase() === 'u' && p.key === 'µ') || (prefixPart.toLowerCase() === 'mc' && p.key === 'µ')
          );
          if (prefixObj) { matchedBaseKey = uKey; matchedPrefixKey = prefixObj.key; break; }
        }
      }

      if (matchedBaseKey) {
        setBaseUnit(matchedBaseKey);
        const foundIdx = METRIC_PREFIXES.findIndex(p => p.key === matchedPrefixKey);
        const newIdx = foundIdx !== -1 ? foundIdx : 6;
        setInitialIndex(newIdx);
        setCurrentIndex(newIdx);
      } else {
        alert(`Unidad "${unitStr}" no reconocida.`);
      }
    }
    playSound('step');
  };

  const loadPreset = (val: number, pKey: string, bUnit: string) => {
    setBaseValue(val);
    setBaseUnit(bUnit);
    const idx = METRIC_PREFIXES.findIndex(p => p.key === pKey);
    const newIdx = idx !== -1 ? idx : 6;
    setInitialIndex(newIdx);
    setCurrentIndex(newIdx);
    if(smartInputRef.current) smartInputRef.current.value = `${val} ${pKey}${bUnit}`;
    playSound('step');
  };

  const generateExercise = (cat = exerciseCategoryFilter, diff = exerciseDifficulty) => {
    let minIdx = 3, maxIdx = 9;
    if (diff === 'easy') { minIdx = 3; maxIdx = 9; } 
    else if (diff === 'medium') { minIdx = 2; maxIdx = 10; } 
    else if (diff === 'hard') { minIdx = 0; maxIdx = 12; }

    let fromIdx = Math.floor(Math.random() * (maxIdx - minIdx + 1)) + minIdx;
    let toIdx = Math.floor(Math.random() * (maxIdx - minIdx + 1)) + minIdx;
    while (toIdx === fromIdx) { toIdx = Math.floor(Math.random() * (maxIdx - minIdx + 1)) + minIdx; }

    const randomValues = [1, 2, 5, 10, 15, 20, 25, 35, 50, 100, 250, 500, 1.5, 2.5];
    const val = randomValues[Math.floor(Math.random() * randomValues.length)];

    let availableKeys = Object.keys(UNITS_DATA);
    if (cat !== 'all') availableKeys = availableKeys.filter(k => UNITS_DATA[k].filterGroup === cat);
    if (availableKeys.length === 0) availableKeys = ['m', 'g'];
    
    const baseU = availableKeys[Math.floor(Math.random() * availableKeys.length)];
    const fromUnitStr = METRIC_PREFIXES[fromIdx].key + baseU;
    const toUnitStr = METRIC_PREFIXES[toIdx].key + baseU;
    const correctAnswer = val * Math.pow(10, toIdx - fromIdx);

    setCurrentExercise({ val, fromIdx, toIdx, baseU, fromUnitStr, toUnitStr, correctAnswer });
    setFeedback(null);
    if(directAnswerRef.current) directAnswerRef.current.value = '';
    if(tableAnswerRef.current) tableAnswerRef.current.value = '';
  };

  // Iniciar el primer ejercicio al cargar
  useEffect(() => { generateExercise(); }, []);

  const checkAnswer = () => {
    if (!currentExercise) return;
    let userAns = NaN;
    if (practiceType === 'direct' && directAnswerRef.current) {
      userAns = parseFloat(directAnswerRef.current.value);
    } else if (practiceType === 'table' && tableAnswerRef.current) {
      userAns = parseFloat(tableAnswerRef.current.value);
    }

    if (isNaN(userAns)) {
      setFeedback({type: 'warn', message: '⚠️ Ingresa tu respuesta numérica.'});
      return;
    }

    const expected = currentExercise.correctAnswer;
    const isCorrect = Math.abs(userAns - expected) < 1e-9 || Math.abs((userAns - expected) / expected) < 1e-5;

    if (isCorrect) {
      setScore(s => s + 10);
      playSound('success');
      setFeedback({
        type: 'success', 
        message: <>🎉 <strong>¡Correcto!</strong> +10 puntos.<br/><span className="text-xs font-normal">{currentExercise.val} {currentExercise.fromUnitStr} = {formatNumber(expected)} {currentExercise.toUnitStr}</span></>
      });
    } else {
      playSound('error');
      setFeedback({type: 'error', message: <>❌ <strong>Incorrecto.</strong> Intenta de nuevo.</>});
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* HEADER */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2.5 rounded-xl shadow-md">
              <Ruler className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-wide text-white">Explorador Métrico <span className="text-indigo-400">SI</span></h1>
                <span className="bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Oficial</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Conversiones y Unidades de la Física</p>
            </div>
          </div>
          <nav className="flex bg-slate-800/90 p-1.5 rounded-xl border border-slate-700/80 shadow-inner">
            <button onClick={() => setActiveTab('explorer')} className={`px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 ${activeTab === 'explorer' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}>
              <Compass className="w-4 h-4" /> <span>Explorador Visual</span>
            </button>
            <button onClick={() => setActiveTab('practice')} className={`px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 ${activeTab === 'practice' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}>
              <Trophy className="w-4 h-4 text-amber-400" /> <span>Modo Ejercicios</span>
              <span className="bg-amber-400 text-slate-950 text-xs px-2 py-0.5 rounded-full font-black">{score} pts</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 w-full flex-grow space-y-6">
        
        {/* ================================== MODO EXPLORADOR ================================== */}
        {activeTab === 'explorer' && (
          <section className="space-y-6">
            
            {/* Controles y Entradas */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
                <div className="lg:col-span-7 space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Escribe una cantidad y unidad del SI (Ej: <span className="text-indigo-600 font-semibold">20 km</span>):
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-grow">
                      <input ref={smartInputRef} type="text" defaultValue="20 km" placeholder="Ej: 20 km" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold text-base transition-all" />
                      <Sparkles className="w-5 h-5 text-indigo-500 absolute left-3 top-3.5" />
                    </div>
                    <button onClick={processSmartInput} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm shrink-0">
                      <Play className="w-4 h-4 fill-current" /> <span>Cargar Valor</span>
                    </button>
                  </div>
                </div>
                
                {/* Selectores Manuales */}
                <div className="lg:col-span-5 grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Cantidad</label>
                    <input type="number" value={baseValue} onChange={(e) => setBaseValue(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-800 bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Prefijo Inicial</label>
                    <select value={initialIndex} onChange={(e) => { setInitialIndex(Number(e.target.value)); setCurrentIndex(Number(e.target.value)); }} className="w-full px-2 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50">
                      {METRIC_PREFIXES.map((p, i) => <option key={i} value={i}>{p.key || '(base)'} - {p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Unidad del SI</label>
                    <select value={baseUnit} onChange={(e) => setBaseUnit(e.target.value)} className="w-full px-2 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50">
                      {Object.keys(UNITS_DATA).map(key => <option key={key} value={key}>{UNITS_DATA[key].name} ({key})</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Info de la Unidad */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-md border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-400 text-slate-950 p-2.5 rounded-xl font-black text-lg min-w-[48px] text-center shadow-sm">{uData.symbol}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-base">{uData.name}</span>
                      <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{uData.category}</span>
                    </div>
                    <p className="text-slate-300 mt-1 text-xs leading-relaxed" dangerouslySetInnerHTML={{__html: uData.concept}}></p>
                  </div>
                </div>
                <div className="bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-lg text-amber-300 font-bold text-[11px] flex items-center gap-1.5 shrink-0">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" /> <span>{uData.area}</span>
                </div>
              </div>

              {/* Presets */}
              <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                <span className="font-bold">Pruebas rápidas:</span>
                {[
                  {v: 20, p: 'k', u: 'm'}, {v: 1.5, p: 'M', u: 'J'}, {v: 500, p: 'm', u: 's'}, {v: 2.4, p: 'G', u: 'Hz'}, {v: 100, p: 'k', u: 'Pa'}, {v: 220, p: '', u: 'V'}
                ].map((pre, i) => (
                  <button key={i} onClick={() => loadPreset(pre.v, pre.p, pre.u)} className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-100 text-slate-700 rounded-lg font-semibold transition">{pre.v} {pre.p}{pre.u}</button>
                ))}
              </div>
            </div>

            {/* Controles de Movimiento */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button onClick={() => moveStep(-1)} disabled={currentIndex === 0} className="flex-1 md:flex-initial bg-slate-900 hover:bg-indigo-900 text-white disabled:opacity-40 px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 group text-sm">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-indigo-400" /> <span>Múltiplos (÷10)</span>
                </button>
                <button onClick={() => moveStep(1)} disabled={currentIndex === METRIC_PREFIXES.length - 1} className="flex-1 md:flex-initial bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 group text-sm">
                  <span>Submúltiplos (×10)</span> <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <button onClick={() => { setCurrentIndex(initialIndex); playSound('step'); }} className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition flex items-center gap-1.5 text-xs font-bold border border-slate-200">
                <RotateCcw className="w-4 h-4 text-indigo-600" /> <span>Volver a Origen</span>
              </button>
            </div>

            {/* TABLA METRICA VISUAL */}
            <div className="bg-slate-950 rounded-2xl p-5 shadow-2xl overflow-hidden border border-slate-800">
              <div className="flex justify-between items-center mb-3 text-xs border-b border-slate-800/80 pb-3">
                <span className="flex items-center gap-1 font-bold text-indigo-400"><ArrowLeftCircle className="w-4 h-4"/> Mayores (÷10)</span>
                <span className="font-black text-slate-300 uppercase tracking-widest hidden md:inline">Tabla de Conversión Oficial SI</span>
                <span className="flex items-center gap-1 font-bold text-purple-400">Menores (×10) <ArrowRightCircle className="w-4 h-4"/></span>
              </div>
              
              <div ref={scrollContainerRef} className="overflow-x-auto pb-4 pt-2 no-scrollbar">
                <div className="flex items-stretch min-w-[1380px] gap-2 px-1">
                  {METRIC_PREFIXES.map((p, idx) => {
                    const isInitial = (idx === initialIndex);
                    const isActive = (idx === currentIndex);
                    const isInPath = (initialIndex < currentIndex && idx > initialIndex && idx < currentIndex) || (initialIndex > currentIndex && idx < initialIndex && idx > currentIndex);
                    
                    let bgClass = "bg-slate-900/60 border-slate-800 text-slate-500 opacity-60";
                    let valDisplay = "-";
                    let badge = null;

                    if (isActive && isInitial) {
                      bgClass = "bg-indigo-950/90 border-indigo-500 ring-2 ring-indigo-400/50 scale-105 shadow-xl";
                      valDisplay = formatNumber(baseValue);
                      badge = <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 px-1.5 py-0.5 rounded">Origen y Actual</span>;
                    } else if (isInitial) {
                      bgClass = "bg-emerald-950/80 border-emerald-600/70";
                      valDisplay = formatNumber(baseValue);
                      badge = <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">📍 Origen</span>;
                    } else if (isActive) {
                      bgClass = "bg-indigo-900 border-indigo-400 ring-2 ring-indigo-400/60 scale-105 shadow-xl";
                      valDisplay = formatNumber(currentValue);
                      badge = <span className="bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded animate-pulse">🎯 Actual</span>;
                    } else if (isInPath) {
                      bgClass = "bg-slate-900/90 border-indigo-500/40 text-slate-300";
                      valDisplay = "• • •";
                      badge = <span className="text-[9px] text-indigo-400/60 font-bold">Paso</span>;
                    }

                    return (
                      <div key={idx} id={`col-${idx}`} className={`flex-1 min-w-[102px] flex flex-col justify-between p-2.5 rounded-xl border transition-all duration-300 text-center relative ${bgClass}`}>
                        <div className="text-[10px] font-mono text-indigo-400 font-bold mb-0.5">10<sup>{p.exp}</sup></div>
                        <div className="text-lg sm:text-xl font-extrabold text-white mb-0.5">{p.key}{baseUnit}</div>
                        <div className="text-[10px] font-semibold text-slate-400 mb-2 truncate">{p.key ? p.name : 'Base'}</div>
                        <div className="min-h-[48px] flex flex-col justify-center items-center py-1 px-1 rounded-lg bg-slate-950/80 border border-slate-800">
                          <span className={`text-xs font-bold font-mono ${isActive ? 'text-amber-300 text-sm' : isInitial ? 'text-emerald-400' : 'text-slate-600'}`}>{valDisplay}</span>
                        </div>
                        <div className="mt-2 text-[9px] font-bold uppercase tracking-wider min-h-[18px]">{badge}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="text-center text-[11px] text-slate-500 mt-1 md:hidden flex items-center justify-center gap-1"><MoveHorizontal className="w-3.5 h-3.5"/> Desliza horizontalmente</div>
            </div>

            {/* Explicación Matemática */}
            <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm"><Calculator className="w-5 h-5 text-indigo-600"/> <span>Explicación Paso a Paso</span></div>
                <span className="bg-indigo-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full">{Math.abs(currentIndex - initialIndex)} Pasos</span>
              </div>
              
              <div className="text-sm text-slate-800 leading-relaxed font-medium">
                {currentIndex === initialIndex ? (
                  <>Estás en la posición inicial. Usa los botones para moverte.</>
                ) : (
                  <>
                    Convertir de <strong>{METRIC_PREFIXES[initialIndex].key}{baseUnit}</strong> a <strong>{METRIC_PREFIXES[currentIndex].key}{baseUnit}</strong> son 
                    <span className="bg-indigo-100 text-indigo-900 px-2 rounded mx-1">{Math.abs(currentIndex - initialIndex)} posiciones a la {currentIndex > initialIndex ? 'DERECHA' : 'IZQUIERDA'}</span>.
                    <br/>Cálculo: {baseValue} {currentIndex > initialIndex ? '×' : '÷'} 10<sup>{Math.abs(currentIndex - initialIndex)}</sup> = 
                    <strong className="text-amber-600 ml-1">{formatNumber(currentValue)} {METRIC_PREFIXES[currentIndex].key}{baseUnit}</strong>.
                  </>
                )}
              </div>
              <div className="bg-white rounded-xl p-3 border border-indigo-100 flex items-center gap-3 text-xs font-semibold text-slate-700">
                <ArrowRightLeft className="w-4 h-4 text-purple-600 shrink-0"/>
                <span>Corrimiento Decimal: {currentIndex === initialIndex ? 'Sin movimiento' : `${Math.abs(currentIndex - initialIndex)} lugares a la ${currentIndex > initialIndex ? 'DERECHA' : 'IZQUIERDA'}`}.</span>
              </div>
            </div>
          </section>
        )}

        {/* ================================== MODO PRÁCTICA ================================== */}
        {activeTab === 'practice' && (
          <section className="space-y-6">
            <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-slate-200 max-w-4xl mx-auto space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between border-b border-slate-100 pb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2.5 rounded-xl text-amber-700"><Target className="w-6 h-6"/></div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Desafío de Conversiones</h2>
                    <p className="text-xs text-slate-500">Aplica tus conocimientos</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-500">Nivel:</label>
                  <select value={exerciseDifficulty} onChange={(e) => { setExerciseDifficulty(e.target.value as any); generateExercise(exerciseCategoryFilter, e.target.value as any); }} className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50">
                    <option value="easy">Fácil (kilo a mili)</option>
                    <option value="medium">Medio (Mega a micro)</option>
                    <option value="hard">Experto (Tera a pico)</option>
                  </select>
                </div>
              </div>

              {/* Selector de Tipo */}
              <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold">
                <button onClick={() => setPracticeType('direct')} className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-2 ${practiceType==='direct' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
                  <PenTool className="w-4 h-4"/> <span>Tipo 1: Directa</span>
                </button>
                <button onClick={() => setPracticeType('table')} className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-2 ${practiceType==='table' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
                  <LayoutGrid className="w-4 h-4"/> <span>Tipo 2: Tabla Visual</span>
                </button>
              </div>

              {/* Filtro Tema */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
                <span className="font-bold text-slate-500 mr-1">Tema:</span>
                {['all', 'fundamental', 'newton', 'circuits', 'waves'].map(cat => (
                  <button key={cat} onClick={() => { setExerciseCategoryFilter(cat); generateExercise(cat, exerciseDifficulty); }} className={`px-2.5 py-1 rounded-lg font-semibold ${exerciseCategoryFilter===cat ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 text-slate-700'}`}>
                    {cat==='all' ? 'Todos' : cat==='fundamental' ? 'Fundamentales' : cat==='newton' ? 'Mecánica' : cat==='circuits' ? 'Circuitos' : 'Ondas'}
                  </button>
                ))}
              </div>

              {/* Pregunta */}
              {currentExercise && (
                <div className="bg-slate-900 text-white rounded-2xl p-6 text-center space-y-2 shadow-md">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5"/> <span>{UNITS_DATA[currentExercise.baseU].area}</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black">
                    ¿Cuánto es <span className="text-amber-400">{currentExercise.val} {currentExercise.fromUnitStr}</span> en <span className="text-indigo-400">{currentExercise.toUnitStr}</span>?
                  </div>
                </div>
              )}

              {/* Interfaz Directa */}
              {practiceType === 'direct' && currentExercise && (
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="flex gap-2">
                    <input ref={directAnswerRef} type="number" step="any" placeholder="Ingresa la cifra..." className="flex-grow text-center text-xl font-bold py-3 px-4 rounded-xl border border-slate-300 font-mono" />
                    <span className="bg-slate-100 border border-slate-200 font-bold px-4 py-3 rounded-xl min-w-[70px] flex items-center justify-center">{currentExercise.toUnitStr}</span>
                  </div>
                  <button onClick={checkAnswer} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5"/> Comprobar</button>
                </div>
              )}

              {/* Interfaz Tabla */}
              {practiceType === 'table' && currentExercise && (
                <div className="space-y-4">
                   <div className="bg-slate-950 rounded-2xl p-4 overflow-x-auto no-scrollbar border border-slate-800">
                    <div className="flex items-stretch min-w-[1300px] gap-2">
                      {METRIC_PREFIXES.map((p, idx) => {
                        const isOrigin = idx === currentExercise.fromIdx;
                        const isTarget = idx === currentExercise.toIdx;
                        let bgClass = "bg-slate-900/60 border-slate-800 text-slate-500 opacity-50";
                        if(isOrigin) bgClass = "bg-emerald-950/80 border-emerald-500";
                        if(isTarget) bgClass = "bg-pink-950/80 border-pink-500 ring-2 ring-pink-500/50";

                        return (
                          <div key={idx} className={`flex-1 min-w-[95px] flex flex-col justify-between p-2 rounded-xl border text-center ${bgClass}`}>
                            <div className="text-[10px] font-mono opacity-80">10<sup>{p.exp}</sup></div>
                            <div className="text-base font-black">{p.key}{currentExercise.baseU}</div>
                            <div className="min-h-[44px] flex flex-col justify-center items-center py-1 rounded-lg my-1">
                              {isOrigin && <span className="text-xs font-black text-emerald-300 font-mono">{currentExercise.val}</span>}
                              {isTarget && <input ref={tableAnswerRef} type="number" step="any" placeholder="Escribe..." className="w-full text-center bg-slate-800 text-amber-300 font-black text-xs py-1.5 rounded border border-pink-400 font-mono" />}
                              {!isOrigin && !isTarget && <span>-</span>}
                            </div>
                            <span className="text-[9px] font-bold">{isOrigin ? '📍 Origen' : isTarget ? '🎯 Objetivo' : '-'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <button onClick={checkAnswer} className="w-full max-w-md mx-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5"/> Comprobar Respuesta</button>
                </div>
              )}

              {feedback && (
                <div className={`rounded-xl p-4 text-center text-sm font-bold border ${feedback.type==='success'?'bg-emerald-100 text-emerald-950 border-emerald-300':feedback.type==='error'?'bg-rose-100 text-rose-950 border-rose-300':'bg-amber-100 text-amber-950 border-amber-300'}`}>
                  {feedback.message}
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <button onClick={() => { loadPreset(currentExercise.val, METRIC_PREFIXES[currentExercise.fromIdx].key, currentExercise.baseU); setActiveTab('explorer'); }} className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1.5"><Eye className="w-4 h-4"/> Ver paso a paso en Explorador</button>
                <button onClick={() => generateExercise()} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-amber-500"/> Siguiente</button>
              </div>

            </div>
          </section>
        )}
      </main>
    </div>
  );
}