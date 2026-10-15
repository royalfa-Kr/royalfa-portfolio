'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Zap, CheckCircle2, RefreshCw, Sliders, Play, HelpCircle, ArrowLeft } from 'lucide-react';

// --- TIPOS DE DATOS ---
type AppMode = 'menu' | 'study' | 'practice' | 'editor';
type Level = 1 | 2 | 3 | 4;
type CircuitTopology = 'serie' | 'paralelo' | 'mixto1' | 'mixto2';

interface ResistorData {
  id: string;
  R: number;
  V: number;
  I: number;
}

interface CircuitProblem {
  title: string;
  topology: CircuitTopology;
  Vt: number;
  It: number;
  Rt: number;
  resistors: ResistorData[];
  requiresFullTable: boolean;
}

// --- PARES DE RESISTENCIAS EN PARALELO QUE DAN ENTEROS EXACTOS ---
const CLEAN_PARALLEL_PAIRS = [
  [3, 6, 2],    
  [4, 12, 3],   
  [6, 12, 4],   
  [10, 15, 6],  
  [8, 24, 6],   
  [12, 24, 8],  
  [20, 30, 12], 
  [6, 6, 3],    
  [8, 8, 4],    
  [10, 10, 5],  
];

// --- GENERADOR MATEMÁTICO DE CIRCUITOS EXACTOS ---
function generateRandomCircuit(level: Level): CircuitProblem {
  const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  if (level === 1) {
    const r1 = randInt(2, 8);
    const r2 = randInt(2, 8);
    const r3 = randInt(2, 8);
    const rt = r1 + r2 + r3;
    const it = randInt(2, 10);
    const vt = it * rt;

    return {
      title: "Nivel 1: Circuito en Serie",
      topology: 'serie',
      Vt: vt, It: it, Rt: rt,
      requiresFullTable: true,
      resistors: [
        { id: 'R1', R: r1, V: it * r1, I: it },
        { id: 'R2', R: r2, V: it * r2, I: it },
        { id: 'R3', R: r3, V: it * r3, I: it },
      ]
    };
  }

  if (level === 2) {
    const [r1, r2, rt] = pickRandom(CLEAN_PARALLEL_PAIRS);
    const lcm = (r1 * r2) / rt; 
    const multiplier = randInt(1, 4);
    const vt = lcm * multiplier;
    const it = vt / rt;

    return {
      title: "Nivel 2: Circuito en Paralelo",
      topology: 'paralelo',
      Vt: vt, It: it, Rt: rt,
      requiresFullTable: true,
      resistors: [
        { id: 'R1', R: r1, V: vt, I: vt / r1 },
        { id: 'R2', R: r2, V: vt, I: vt / r2 },
      ]
    };
  }

  const mixTemplates = [
    { r1: 4, r2: 10, r3: 9, r4: 8, r5: 24, rt: 10, baseIt: 5 }, 
    { r1: 5, r2: 6, r3: 3, r4: 4, r5: 12, rt: 8, baseIt: 8 },
    { r1: 6, r2: 6, r3: 8, r4: 6, r5: 12, rt: 10, baseIt: 9 },
    { r1: 4, r2: 12, r3: 4, r4: 3, r5: 6, rt: 8, baseIt: 9 },
  ];

  const tpl = pickRandom(mixTemplates);
  const mult = randInt(1, 2); 
  const it = tpl.baseIt * mult;
  const vt = it * tpl.rt;

  const v1 = it * tpl.r1;
  const vParallelMain = vt - v1;
  const i2 = vParallelMain / tpl.r2;
  const iBranchB = it - i2;
  const v3 = iBranchB * tpl.r3;
  const vSubParallel = vParallelMain - v3;
  const i4 = vSubParallel / tpl.r4;
  const i5 = vSubParallel / tpl.r5;

  return {
    title: level === 3 ? "Nivel 3: Mixto (Reducción y Ley de Ohm)" : "Nivel 4: Mixto Completo (Todos los Nodos)",
    topology: 'mixto1',
    Vt: vt, It: it, Rt: tpl.rt,
    requiresFullTable: level === 4,
    resistors: [
      { id: 'R1', R: tpl.r1, V: v1, I: it },
      { id: 'R2', R: tpl.r2, V: vParallelMain, I: i2 },
      { id: 'R3', R: tpl.r3, V: v3, I: iBranchB },
      { id: 'R4', R: tpl.r4, V: vSubParallel, I: i4 },
      { id: 'R5', R: tpl.r5, V: vSubParallel, I: i5 },
    ]
  };
}

// ==========================================
// COMPONENTE DE DIBUJO AUTOMÁTICO (SVG)
// ==========================================
function CircuitDiagramSVG({ topology, Vt, resistors }: { topology: CircuitTopology, Vt: number, resistors: { id: string, R: number }[] }) {
  const getR = (id: string) => resistors.find(r => r.id === id)?.R ?? 0;

  return (
    <div className="w-full bg-slate-900 dark:bg-[#060913] rounded-xl p-4 shadow-inner border border-slate-700 flex flex-col items-center justify-center">
      <svg viewBox="0 0 500 280" className="w-full max-w-lg h-auto stroke-sky-400 stroke-2 fill-none font-mono">
        <circle cx="50" cy="140" r="22" className="stroke-amber-400 fill-slate-800 dark:fill-[#0A0F1C]" strokeWidth="2.5" />
        <text x="50" y="136" textAnchor="middle" className="fill-amber-400 stroke-none text-xs font-bold">+</text>
        <text x="50" y="152" textAnchor="middle" className="fill-amber-400 stroke-none text-xs font-bold">-</text>
        <text x="15" y="105" className="fill-amber-300 stroke-none text-sm font-bold">Vt = {Vt}V</text>

        {topology === 'serie' && (
          <>
            <path d="M 50 118 L 50 40 L 140 40" />
            <polyline points="140,40 145,30 155,50 165,30 175,50 185,30 195,50 200,40" className="stroke-emerald-400" strokeWidth="2.5" />
            <text x="170" y="22" textAnchor="middle" className="fill-emerald-300 stroke-none text-xs">R1={getR('R1')}Ω</text>
            <path d="M 200 40 L 380 40 L 380 110" />
            <polyline points="380,110 390,115 370,125 390,135 370,145 390,155 370,165 380,170" className="stroke-emerald-400" strokeWidth="2.5" />
            <text x="405" y="145" className="fill-emerald-300 stroke-none text-xs">R2={getR('R2')}Ω</text>
            <path d="M 380 170 L 380 240 L 240 240" />
            <polyline points="240,240 235,230 225,250 215,230 205,250 195,230 185,250 180,240" className="stroke-emerald-400" strokeWidth="2.5" />
            <text x="210" y="268" textAnchor="middle" className="fill-emerald-300 stroke-none text-xs">R3={getR('R3')}Ω</text>
            <path d="M 180 240 L 50 240 L 50 162" />
          </>
        )}

        {topology === 'paralelo' && (
          <>
            <path d="M 50 118 L 50 40 L 360 40" />
            <path d="M 50 162 L 50 240 L 360 240" />
            <line x1="200" y1="40" x2="200" y2="110" />
            <circle cx="200" cy="40" r="3" className="fill-sky-400" />
            <polyline points="200,110 210,115 190,125 210,135 190,145 210,155 190,165 200,170" className="stroke-emerald-400" strokeWidth="2.5" />
            <text x="155" y="145" textAnchor="middle" className="fill-emerald-300 stroke-none text-xs">R1={getR('R1')}Ω</text>
            <line x1="200" y1="170" x2="200" y2="240" />
            <circle cx="200" cy="240" r="3" className="fill-sky-400" />
            <line x1="360" y1="40" x2="360" y2="110" />
            <polyline points="360,110 370,115 350,125 370,135 350,145 370,155 350,165 360,170" className="stroke-emerald-400" strokeWidth="2.5" />
            <text x="415" y="145" textAnchor="middle" className="fill-emerald-300 stroke-none text-xs">R2={getR('R2')}Ω</text>
            <line x1="360" y1="170" x2="360" y2="240" />
          </>
        )}

        {topology === 'mixto1' && (
          <>
            <path d="M 50 118 L 50 40 L 90 40" />
            <polyline points="90,40 95,30 105,50 115,30 125,50 135,30 145,50 150,40" className="stroke-emerald-400" strokeWidth="2.5" />
            <text x="120" y="22" textAnchor="middle" className="fill-emerald-300 stroke-none text-xs">R1={getR('R1')}Ω</text>
            <line x1="150" y1="40" x2="210" y2="40" />
            <circle cx="210" cy="40" r="3.5" className="fill-rose-400 stroke-none" />
            <line x1="210" y1="40" x2="210" y2="110" />
            <polyline points="210,110 220,115 200,125 220,135 200,145 220,155 200,165 210,170" className="stroke-emerald-400" strokeWidth="2.5" />
            <text x="165" y="145" textAnchor="middle" className="fill-emerald-300 stroke-none text-xs">R2={getR('R2')}Ω</text>
            <line x1="210" y1="170" x2="210" y2="240" />
            <circle cx="210" cy="240" r="3.5" className="fill-rose-400 stroke-none" />
            <line x1="210" y1="40" x2="260" y2="40" />
            <polyline points="260,40 265,30 275,50 285,30 295,50 305,30 315,50 320,40" className="stroke-emerald-400" strokeWidth="2.5" />
            <text x="290" y="22" textAnchor="middle" className="fill-emerald-300 stroke-none text-xs">R3={getR('R3')}Ω</text>
            <line x1="320" y1="40" x2="390" y2="40" />
            <circle cx="390" cy="40" r="3.5" className="fill-amber-400 stroke-none" />
            <path d="M 345 40 L 345 110" />
            <polyline points="345,110 355,115 335,125 355,135 335,145 355,155 335,165 345,170" className="stroke-emerald-400" strokeWidth="2.5" />
            <text x="305" y="145" textAnchor="middle" className="fill-emerald-300 stroke-none text-xs">R4={getR('R4')}Ω</text>
            <path d="M 345 170 L 345 240" />
            <path d="M 390 40 L 435 40 L 435 110" />
            <polyline points="435,110 445,115 425,125 445,135 425,145 445,155 425,165 435,170" className="stroke-emerald-400" strokeWidth="2.5" />
            <text x="470" y="145" textAnchor="middle" className="fill-emerald-300 stroke-none text-xs">R5={getR('R5')}Ω</text>
            <path d="M 435 170 L 435 240 L 50 240 L 50 162" />
          </>
        )}
      </svg>
      <span className="text-xs text-slate-400 dark:text-slate-500 mt-2">Diagrama generado dinámicamente</span>
    </div>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL DE LA APLICACIÓN
// ==========================================
export default function CircuitApp() {
  const [mode, setMode] = useState<AppMode>('menu');
  const [currentLevel, setCurrentLevel] = useState<Level>(1);
  const [customProblem, setCustomProblem] = useState<CircuitProblem | null>(null);

  const startCustomProblem = (problem: CircuitProblem) => {
    setCustomProblem(problem);
    setMode('practice');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0A0F1C] text-slate-800 dark:text-slate-200 font-sans p-4 md:p-8 transition-colors">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row items-center justify-between bg-white dark:bg-[#111827] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="bg-yellow-500 dark:bg-yellow-600 p-3 rounded-xl text-white shadow-md">
              <Zap size={32} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Circuitos Master</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Entrenador Interactivo de Ley de Ohm y Nodos de Kirchhoff</p>
            </div>
          </div>
          {mode !== 'menu' && (
            <button 
              onClick={() => { setMode('menu'); setCustomProblem(null); }}
              className="flex items-center gap-2 bg-slate-100 dark:bg-[#1A233A] hover:bg-slate-200 dark:hover:bg-[#232D48] text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-semibold transition"
            >
              <ArrowLeft size={18} /> Volver al Inicio
            </button>
          )}
        </header>

        {mode === 'menu' && (
          <div className="grid md:grid-cols-3 gap-6">
            <button 
              onClick={() => setMode('study')}
              className="bg-white dark:bg-[#111827] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-yellow-500 dark:hover:border-yellow-500 transition-all group text-left flex flex-col justify-between"
            >
              <div>
                <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="text-blue-600 dark:text-blue-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">1. Modo Estudio</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Aprende las reglas de serie, paralelo y el <strong>truco de calcular corrientes primero</strong> para evitar fracciones complicadas.
                </p>
              </div>
              <span className="mt-6 inline-block text-yellow-600 dark:text-yellow-500 font-bold text-sm group-hover:translate-x-2 transition-transform"> Ir a la teoría &rarr;</span>
            </button>

            <button 
              onClick={() => { setCustomProblem(null); setMode('practice'); }}
              className="bg-white dark:bg-[#111827] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-emerald-500 dark:hover:border-emerald-500 transition-all group text-left flex flex-col justify-between"
            >
              <div>
                <div className="bg-emerald-100 dark:bg-emerald-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Play className="text-emerald-600 dark:text-emerald-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">2. Práctica Infinita</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  4 niveles progresivos. Incluye un <strong>generador de circuitos al azar</strong> que garantiza resultados exactos sin decimales infinitos.
                </p>
              </div>
              <span className="mt-6 inline-block text-emerald-600 dark:text-emerald-400 font-bold text-sm group-hover:translate-x-2 transition-transform"> Empezar a resolver &rarr;</span>
            </button>

            <button 
              onClick={() => setMode('editor')}
              className="bg-white dark:bg-[#111827] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-amber-500 dark:hover:border-amber-500 transition-all group text-left flex flex-col justify-between"
            >
              <div>
                <div className="bg-amber-100 dark:bg-amber-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sliders className="text-amber-600 dark:text-amber-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">3. Editor / Laboratorio</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  ¿Tienes un circuito en el pizarrón o cuaderno? <strong>Ármalo aquí con tus propios valores</strong> para resolverlo paso a paso o verificar respuestas.
                </p>
              </div>
              <span className="mt-6 inline-block text-amber-600 dark:text-amber-500 font-bold text-sm group-hover:translate-x-2 transition-transform"> Abrir constructor &rarr;</span>
            </button>
          </div>
        )}

        {mode === 'study' && <StudyView />}
        {mode === 'practice' && (
          <PracticeView 
            level={currentLevel} 
            setLevel={setCurrentLevel} 
            customProblem={customProblem}
            clearCustom={() => setCustomProblem(null)}
          />
        )}
        {mode === 'editor' && <EditorView onLaunchProblem={startCustomProblem} />}
      </div>
    </div>
  );
}

// ==========================================
// VISTA 1: MODO ESTUDIO
// ==========================================
function StudyView() {
  return (
    <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
      <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-b dark:border-slate-800 pb-2">Reglas de Oro (Serie vs Paralelo)</h3>
        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
            <h4 className="font-bold text-blue-900 dark:text-blue-300 text-base mb-1">🔗 Circuito en Serie</h4>
            <p className="mb-2">Solo hay un camino para los electrones.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Corriente (I):</strong> Es EXACTAMENTE IGUAL en todas las resistencias (<code className="font-bold dark:text-white">It = I1 = I2</code>).</li>
              <li><strong>Voltaje (V):</strong> Se reparte y se suma (<code className="font-bold dark:text-white">Vt = V1 + V2 + ...</code>).</li>
              <li><strong>Resistencia Total:</strong> Suma directa (<code className="font-bold dark:text-white">Rt = R1 + R2</code>).</li>
            </ul>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-base mb-1">🛤️ Circuito en Paralelo</h4>
            <p className="mb-2">El camino se divide en varios nodos o ramas independientes.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Voltaje (V):</strong> Es EXACTAMENTE IGUAL en todas las ramas conectadas al mismo nodo (<code className="font-bold dark:text-white">Vt = V1 = V2</code>).</li>
              <li><strong>Corriente (I):</strong> Se divide y se suma (<code className="font-bold dark:text-white">It = I1 + I2 + ...</code>).</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
        <div>
          <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase">Hack de Prepa</span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2 mb-3">El "Truco" de los Nodos en Paralelo</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Cuando tienes un circuito puramente en paralelo y conoces el Voltaje Total, <strong>¡no tienes que usar la fórmula de fracciones</strong> <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">1/Rt = 1/R1 + 1/R2</code> al principio!
          </p>
          <div className="bg-slate-800 dark:bg-[#0A0F1C] text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2 mb-4 border dark:border-slate-800">
            <p className="text-amber-400">// Ejemplo: Fuente de 24V con R1 = 6Ω y R2 = 3Ω</p>
            <p>1. Sabemos que ambas reciben 24V por estar en paralelo.</p>
            <p>2. Calculamos corriente de cada rama directo con Ley de Ohm:</p>
            <p className="pl-4 text-emerald-400">I1 = 24V / 6Ω = 4 A</p>
            <p className="pl-4 text-emerald-400">I2 = 24V / 3Ω = 8 A</p>
            <p>3. Sumamos las corrientes para sacar la Total:</p>
            <p className="pl-4 text-sky-400">It = 4A + 8A = 12 A</p>
            <p>4. Sacamos Resistencia Total sin usar fracciones:</p>
            <p className="pl-4 text-rose-300">Rt = Vt / It = 24V / 12A = 2 Ω  ¡Listo!</p>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <HelpCircle size={20} className="text-blue-500 dark:text-blue-400 shrink-0" />
          <span>En el Nivel 2 de práctica puedes resolver la tabla de nodos primero si quieres aplicar este truco.</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// VISTA 2: PRÁCTICA INTERACTIVA Y ALEATORIA
// ==========================================
function PracticeView({ level, setLevel, customProblem, clearCustom }: { 
  level: Level, setLevel: (l: Level) => void, customProblem: CircuitProblem | null, clearCustom: () => void 
}) {
  const [problem, setProblem] = useState<CircuitProblem>(() => customProblem || generateRandomCircuit(level));
  
  const [inputRt, setInputRt] = useState('');
  const [inputIt, setInputIt] = useState('');
  const [tableInputs, setTableInputs] = useState<Record<string, {V: string, I: string}>>({});
  const [useParallelTrick, setUseParallelTrick] = useState(false);

  useEffect(() => {
    const newProb = customProblem || generateRandomCircuit(level);
    setProblem(newProb);
    resetInputs();
  }, [level, customProblem]);

  const resetInputs = () => {
    setInputRt('');
    setInputIt('');
    setTableInputs({});
    setUseParallelTrick(false);
  };

  const handleNewRandom = () => {
    clearCustom();
    setProblem(generateRandomCircuit(level));
    resetInputs();
  };

  const isCloseEnough = (valStr: string, target: number) => {
    const num = parseFloat(valStr);
    if (isNaN(num)) return false;
    return Math.abs(num - target) <= 0.15;
  };

  const isRtOk = isCloseEnough(inputRt, problem.Rt);
  const isItOk = isCloseEnough(inputIt, problem.It);

  const checkAllNodesOk = () => {
    return problem.resistors.every(r => {
      const inp = tableInputs[r.id];
      return inp && isCloseEnough(inp.V, r.V) && isCloseEnough(inp.I, r.I);
    });
  };

  return (
    <div className="bg-white dark:bg-[#111827] p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4 border-b dark:border-slate-800 pb-4">
        <div className="flex flex-wrap gap-2">
          {([1, 2, 3, 4] as Level[]).map(l => (
            <button 
              key={l}
              onClick={() => { clearCustom(); setLevel(l); }}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                !customProblem && level === l 
                  ? 'bg-yellow-500 dark:bg-yellow-600 text-white shadow-md' 
                  : 'bg-slate-100 dark:bg-[#1A233A] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#232D48]'
              }`}
            >
              Nivel {l}
            </button>
          ))}
          {customProblem && (
            <span className="bg-amber-500 text-white px-4 py-2 rounded-xl font-bold text-sm">
              ⚡ Modo Personalizado
            </span>
          )}
        </div>

        <button 
          onClick={handleNewRandom}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow transition"
        >
          <RefreshCw size={16} /> Nuevo Circuito
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">{problem.title}</h2>
          
          <CircuitDiagramSVG 
            topology={problem.topology} 
            Vt={problem.Vt} 
            resistors={problem.resistors} 
          />

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex justify-between items-center">
            <span>💡 <strong>Tip:</strong> Si un cálculo tiene decimales, puedes redondear a 1 o 2 dígitos.</span>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-5">
          {problem.topology === 'paralelo' && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-xl flex justify-between items-center">
              <span className="text-xs text-amber-900 dark:text-amber-400 font-medium">
                ¿Usar el <strong>Truco en Paralelo</strong> (calcular ramas primero)?
              </span>
              <button 
                onClick={() => setUseParallelTrick(!useParallelTrick)}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
              >
                {useParallelTrick ? 'Modo Normal' : 'Activar Truco'}
              </button>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border-2 transition-all ${isRtOk ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1A233A]'}`}>
              <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
                1. Resistencia Total (Rt)
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" step="any"
                  value={inputRt}
                  onChange={e => setInputRt(e.target.value)}
                  placeholder="Ej. 10"
                  className="w-full p-2 border dark:border-slate-600 rounded-lg font-mono text-lg outline-none focus:border-yellow-500 bg-white dark:bg-[#0A0F1C] dark:text-white"
                />
                <span className="font-bold text-slate-400 dark:text-slate-500">Ω</span>
                {isRtOk && <CheckCircle2 className="text-emerald-500 shrink-0" />}
              </div>
            </div>

            <div className={`p-4 rounded-xl border-2 transition-all ${isItOk ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1A233A]'}`}>
              <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block mb-1">
                2. Corriente Total (It)
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" step="any"
                  value={inputIt}
                  onChange={e => setInputIt(e.target.value)}
                  placeholder="Ej. 5"
                  className="w-full p-2 border dark:border-slate-600 rounded-lg font-mono text-lg outline-none focus:border-yellow-500 bg-white dark:bg-[#0A0F1C] dark:text-white"
                />
                <span className="font-bold text-slate-400 dark:text-slate-500">A</span>
                {isItOk && <CheckCircle2 className="text-emerald-500 shrink-0" />}
              </div>
            </div>
          </div>

          {problem.requiresFullTable && ( (isRtOk && isItOk) || useParallelTrick ) ? (
            <div className="border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 animate-fade-in">
              <h4 className="font-bold text-slate-800 dark:text-white mb-1">Desglose en cada Resistencia (Nodos)</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Las casillas se pondrán verdes al estar correctas.</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-[#1A233A] text-slate-600 dark:text-slate-300 text-left">
                      <th className="p-2.5 rounded-tl-lg">Resistencia</th>
                      <th className="p-2.5">Voltaje (V)</th>
                      <th className="p-2.5 rounded-tr-lg">Corriente (A)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {problem.resistors.map(r => {
                      const rowInp = tableInputs[r.id] || { V: '', I: '' };
                      const vOk = isCloseEnough(rowInp.V, r.V);
                      const iOk = isCloseEnough(rowInp.I, r.I);

                      return (
                        <tr key={r.id}>
                          <td className="p-2.5 font-mono font-bold text-slate-700 dark:text-slate-200">
                            {r.id} <span className="text-xs font-normal text-slate-400 dark:text-slate-500">({r.R}Ω)</span>
                          </td>
                          <td className="p-2">
                            <input 
                              type="number" step="any"
                              placeholder="V"
                              value={rowInp.V}
                              onChange={e => setTableInputs(p => ({ ...p, [r.id]: { ...rowInp, V: e.target.value } }))}
                              className={`w-full p-1.5 border dark:border-slate-600 rounded-lg font-mono outline-none transition ${
                                vOk ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 text-emerald-900 dark:text-emerald-400 font-bold' : 'bg-slate-50 dark:bg-[#0A0F1C] focus:bg-white dark:focus:bg-[#111827] dark:text-white'
                              }`}
                            />
                          </td>
                          <td className="p-2">
                            <input 
                              type="number" step="any"
                              placeholder="A"
                              value={rowInp.I}
                              onChange={e => setTableInputs(p => ({ ...p, [r.id]: { ...rowInp, I: e.target.value } }))}
                              className={`w-full p-1.5 border dark:border-slate-600 rounded-lg font-mono outline-none transition ${
                                iOk ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 text-emerald-900 dark:text-emerald-400 font-bold' : 'bg-slate-50 dark:bg-[#0A0F1C] focus:bg-white dark:focus:bg-[#111827] dark:text-white'
                              }`}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            problem.requiresFullTable && (
              <div className="p-6 bg-slate-50 dark:bg-[#1A233A] border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center text-slate-400 dark:text-slate-500 text-sm">
                🔒 Calcula primero la <strong>Resistencia Total</strong> y la <strong>Corriente Total</strong> para desbloquear la tabla.
              </div>
            )
          )}

          {isRtOk && isItOk && (!problem.requiresFullTable || checkAllNodesOk()) && (
            <div className="p-5 bg-emerald-600 dark:bg-emerald-700 text-white rounded-xl shadow-lg flex items-center justify-between animate-bounce">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={32} />
                <div>
                  <h4 className="font-extrabold text-lg">¡Circuito Resuelto!</h4>
                  <p className="text-emerald-100 text-xs">Todos los nodos cuadran perfecto.</p>
                </div>
              </div>
              <button 
                onClick={handleNewRandom}
                className="bg-white text-emerald-700 px-4 py-2 rounded-lg font-bold text-xs hover:bg-emerald-50 shrink-0"
              >
                Siguiente Reto &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// VISTA 3: EDITOR / CONSTRUCTOR DE CIRCUITOS
// ==========================================
function EditorView({ onLaunchProblem }: { onLaunchProblem: (p: CircuitProblem) => void }) {
  const [topology, setTopology] = useState<CircuitTopology>('mixto1');
  const [vt, setVt] = useState<number>(80);
  const [rValues, setRValues] = useState({ R1: 4, R2: 10, R3: 9, R4: 8, R5: 24 });

  const buildCustomProblem = (): CircuitProblem => {
    const { R1, R2, R3, R4, R5 } = rValues;

    if (topology === 'serie') {
      const rt = R1 + R2 + R3;
      const it = vt / rt;
      return {
        title: "Circuito en Serie Personalizado", topology: 'serie',
        Vt: vt, Rt: rt, It: it, requiresFullTable: true,
        resistors: [
          { id: 'R1', R: R1, V: it * R1, I: it },
          { id: 'R2', R: R2, V: it * R2, I: it },
          { id: 'R3', R: R3, V: it * R3, I: it },
        ]
      };
    }

    if (topology === 'paralelo') {
      const rt = (R1 * R2) / (R1 + R2);
      const it = vt / rt;
      return {
        title: "Circuito en Paralelo Personalizado", topology: 'paralelo',
        Vt: vt, Rt: rt, It: it, requiresFullTable: true,
        resistors: [
          { id: 'R1', R: R1, V: vt, I: vt / R1 },
          { id: 'R2', R: R2, V: vt, I: vt / R2 },
        ]
      };
    }

    const r45 = (R4 * R5) / (R4 + R5);
    const r345 = R3 + r45;
    const r2345 = (R2 * r345) / (R2 + r345);
    const rt = R1 + r2345;
    const it = vt / rt;

    const v1 = it * R1;
    const vPar = vt - v1;
    const i2 = vPar / R2;
    const iBranch = it - i2;
    const v3 = iBranch * R3;
    const vSub = vPar - v3;

    return {
      title: "Circuito Mixto de Laboratorio", topology: 'mixto1',
      Vt: vt, Rt: rt, It: it, requiresFullTable: true,
      resistors: [
        { id: 'R1', R: R1, V: v1, I: it },
        { id: 'R2', R: R2, V: vPar, I: i2 },
        { id: 'R3', R: R3, V: v3, I: iBranch },
        { id: 'R4', R: R4, V: vSub, I: vSub / R4 },
        { id: 'R5', R: R5, V: vSub, I: vSub / R5 },
      ]
    };
  };

  const previewProblem = buildCustomProblem();

  return (
    <div className="bg-white dark:bg-[#111827] p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Constructor de Circuitos</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
        Elige la forma del circuito, ingresa el voltaje y las resistencias de tu ejercicio de clase, y lánzalo para practicar.
      </p>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block mb-2">1. Elige el tipo de circuito</label>
            <div className="grid grid-cols-3 gap-3">
              {(['serie', 'paralelo', 'mixto1'] as CircuitTopology[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTopology(t)}
                  className={`p-3 rounded-xl font-bold text-sm border dark:border-slate-700 text-center capitalize transition ${
                    topology === t ? 'bg-yellow-500 dark:bg-yellow-600 text-white border-yellow-500 dark:border-yellow-600 shadow' : 'bg-slate-50 dark:bg-[#1A233A] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#232D48]'
                  }`}
                >
                  {t === 'mixto1' ? 'Mixto (5 Res)' : t}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#1A233A] p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-yellow-700 dark:text-yellow-500 block mb-1">Voltaje de la Fuente (Vt)</label>
              <input 
                type="number" value={vt} onChange={e => setVt(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full p-2 border dark:border-slate-600 rounded-lg font-mono font-bold bg-white dark:bg-[#0A0F1C] dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t dark:border-slate-700">
              {previewProblem.resistors.map(r => (
                <div key={r.id}>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">{r.id} (Ω)</label>
                  <input 
                    type="number" 
                    value={rValues[r.id as keyof typeof rValues]}
                    onChange={e => setRValues(prev => ({ ...prev, [r.id]: Math.max(0.1, parseFloat(e.target.value) || 1) }))}
                    className="w-full p-2 border dark:border-slate-600 rounded-lg font-mono bg-white dark:bg-[#0A0F1C] dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onLaunchProblem(previewProblem)}
            className="w-full bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-slate-900 dark:text-white font-bold py-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-lg"
          >
            <Play size={20} /> Resolver este Circuito Paso a Paso
          </button>
        </div>

        <div className="space-y-4">
          <CircuitDiagramSVG topology={topology} Vt={vt} resistors={previewProblem.resistors} />
          
          <details className="bg-slate-100 dark:bg-[#1A233A] rounded-xl p-4 border border-slate-200 dark:border-slate-700 cursor-pointer">
            <summary className="font-bold text-sm text-slate-700 dark:text-slate-300">👁️ Ver Hoja de Respuestas (Profesor)</summary>
            <div className="mt-3 pt-3 border-t dark:border-slate-600 text-xs font-mono space-y-2 text-slate-700 dark:text-slate-300">
              <p><strong>Resistencia Total (Rt):</strong> {previewProblem.Rt.toFixed(2)} Ω</p>
              <p><strong>Corriente Total (It):</strong> {previewProblem.It.toFixed(2)} A</p>
              <div className="grid grid-cols-3 bg-white dark:bg-[#0A0F1C] p-2 rounded border dark:border-slate-600 mt-2 font-sans font-bold">
                <span>Nodo</span><span>Voltaje</span><span>Corriente</span>
              </div>
              {previewProblem.resistors.map(r => (
                <div key={r.id} className="grid grid-cols-3 px-2 py-1 border-b dark:border-slate-700">
                  <span className="font-bold">{r.id} ({r.R}Ω)</span>
                  <span>{r.V.toFixed(2)} V</span>
                  <span>{r.I.toFixed(2)} A</span>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}