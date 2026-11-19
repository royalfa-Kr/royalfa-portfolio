"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  RotateCcw, 
  Award, 
  Trophy, 
  BrainCircuit, 
  SearchCheck, 
  Dices, 
  Lightbulb, 
  Eraser, 
  Check, 
  Info, 
  Star, 
  Target, 
  HelpCircle, 
  Table as TableIcon, 
  BarChart3, 
  XCircle,
  SlidersHorizontal,
  Binary,
  Percent
} from 'lucide-react';

// --- CONSTANTES DE SESIÓN ---
const SESSION_LENGTH = 5;

// --- UTILIDADES ---
const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const pickRandom = <T,>(arr: T[]): T => arr[arr.length * Math.random() | 0];
const variables = ['x', 'y', 'a', 'b', 'm', 'n'];

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

const normalizeMathString = (str: string) => {
  if (!str) return "";
  let clean = str.trim().toLowerCase();
  clean = clean.replace(/(^|[+-])1([a-z])/g, '$1$2');
  if (clean.startsWith('1') && clean.length > 1 && /[a-z]/.test(clean[1])) {
    clean = clean.substring(1);
  }
  return clean.replace(/\s+/g, '');
};

const getFactorPairs = (n: number): number[][] => {
  const absN = Math.abs(n);
  const pairs = [];
  for (let i = 1; i <= Math.sqrt(absN); i++) {
    if (absN % i === 0) pairs.push([i, absN / i]);
  }
  return pairs;
};

// --- COMPONENTES DE APOYO ---
const KatexResources = () => (
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
);

const MathView = ({ tex, className = "", isLoaded }: { tex: string; className?: string; isLoaded: boolean }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    const katex = (window as Window & { katex?: { render: (tex: string, element: HTMLElement, options: { throwOnError: boolean; displayMode: boolean }) => void } }).katex;
    if (containerRef.current && katex) {
      try {
        katex.render(tex, containerRef.current, { throwOnError: false, displayMode: true });
      } catch (e) { console.error("KaTeX Error:", e); }
    }
  }, [tex, isLoaded]);
  return <div ref={containerRef} className={`math-container flex justify-center ${className}`} />;
};

// --- MOTOR DE GENERACIÓN v2.8 (Con Cubos, Fracciones y Exponentes Mayores) ---
const GENERATORS = {
  diff_squares: (config: { highPowers: boolean; fractions: boolean }) => {
    const v = pickRandom(variables);
    const expBase = config.highPowers ? pickRandom([2, 3, 4]) : 1;
    const expTotal = expBase * 2;
    const vExpr = `${v}^{${expTotal}}`;
    const r1Var = expBase === 1 ? v : `${v}^${expBase}`;

    if (config.fractions && Math.random() > 0.4) {
      const den = pickRandom([2, 3, 4, 5]);
      const num = getRandomInt(1, 4);
      const b = getRandomInt(1, 6);
      const r1 = `\\frac{${num}}{${den}}${r1Var}`;
      const r2 = `${b}`;
      const r1Palette = `${num}/${den}${r1Var}`;

      return {
        id: `ds_${Date.now()}`,
        expression: `\\frac{${num * num}}{${den * den}}${vExpr} - ${b * b}`,
        type: "diff_squares",
        typeName: "Diferencia de Cuadrados",
        hint: "Resta de dos cuadrados. En fracciones, extrae la raíz del numerador y del denominador.",
        solveHint: "Extrae la raíz cuadrada de cada término (incluyendo fracciones).",
        assembleHint: "Los binomios conjugados tienen los mismos términos: uno suma (+) y otro resta (-).",
        steps: [
          { prompt: `Raíz de la fracción con ${vExpr}`, answer: r1Palette },
          { prompt: `Raíz de ${b * b}`, answer: r2 }
        ],
        buildSchemas: [
          ["(", "R0", "+", "R1", ")", "(", "R0", "-", "R1", ")"],
          ["(", "R0", "-", "R1", ")", "(", "R0", "+", "R1", ")"]
        ],
        palette: [r1Palette, r2, "+", "-"]
      };
    }

    const a = getRandomInt(1, 8);
    const b = getRandomInt(1, 10);
    const r1 = `${a === 1 ? '' : a}${r1Var}`;
    const r2 = `${b}`;
    return {
      id: `ds_${Date.now()}`,
      expression: `${a * a === 1 ? '' : a * a}${vExpr} - ${b * b}`,
      type: "diff_squares",
      typeName: "Diferencia de Cuadrados",
      hint: "Busca si son solo 2 términos cuadrados con una resta en medio.",
      solveHint: "Extrae la raíz cuadrada de cada término dividiendo los exponentes pares entre 2.",
      assembleHint: "Los binomios conjugados tienen los mismos términos: uno suma (+) y otro resta (-).",
      steps: [
        { prompt: `Raíz cuadrada de ${a * a === 1 ? '' : a * a}${vExpr}`, answer: r1 },
        { prompt: `Raíz cuadrada de ${b * b}`, answer: r2 }
      ],
      buildSchemas: [
        ["(", "R0", "+", "R1", ")", "(", "R0", "-", "R1", ")"],
        ["(", "R0", "-", "R1", ")", "(", "R0", "+", "R1", ")"]
      ],
      palette: [r1, r2, "+", "-"]
    };
  },

  cubos: (config: { highPowers: boolean; fractions: boolean }, forcedType: 'suma_cubos' | 'diff_cubes' | null = null) => {
    const isSum = forcedType ? forcedType === 'suma_cubos' : Math.random() > 0.5;
    const v = pickRandom(variables);
    const expBase = config.highPowers ? pickRandom([2, 3]) : 1;
    const expTotal = expBase * 3;
    const vExpr = `${v}^{${expTotal}}`;
    const r1Var = expBase === 1 ? v : `${v}^${expBase}`;
    const sign = isSum ? "+" : "-";
    const opSign = isSum ? "-" : "+";

    let a = getRandomInt(1, 4);
    let b = getRandomInt(1, 5);

    let expr = "";
    let r1 = "";
    let r2 = `${b}`;

    if (config.fractions && Math.random() > 0.4) {
      const den = pickRandom([2, 3]);
      const num = 1;
      const denCube = den * den * den;
      expr = `\\frac{1}{${denCube}}${vExpr} ${sign} ${b * b * b}`;
      r1 = `1/${den}${r1Var}`;
    } else {
      const aCube = a * a * a;
      expr = `${aCube === 1 ? '' : aCube}${vExpr} ${sign} ${b * b * b}`;
      r1 = `${a === 1 ? '' : a}${r1Var}`;
    }

    const typeKey = isSum ? "suma_cubos" : "diff_cubes";
    const typeTitle = isSum ? "Suma de Cubos" : "Diferencia de Cubos";

    // Regla de cubos: (a ± b)(a² ∓ ab + b²)
    return {
      id: `cub_${Date.now()}`,
      expression: expr,
      type: typeKey,
      typeName: typeTitle,
      hint: `${typeTitle}: se factoriza en un binomio por un trinomio especial (a ${sign} b)(a² ${opSign} ab + b²).`,
      solveHint: "Extrae las raíces cúbicas de ambos términos primero.",
      assembleHint: `El binomio lleva signo (${sign}). El trinomio tiene signos alternados con (${opSign}) en el centro.`,
      steps: [
        { prompt: `Raíz cúbica del 1er término`, answer: r1 },
        { prompt: `Raíz cúbica del 2do término`, answer: r2 }
      ],
      buildSchemas: [
        ["(", "R0", sign, "R1", ")", "(", "R0^2", opSign, "prod", "+", "R1^2", ")"]
      ],
      palette: [r1, r2, "+", "-", `${r1}^2`, `${r2}^2`]
    };
  },

  tcp: (config: { highPowers: boolean }) => {
    const v = pickRandom(variables);
    const expBase = config.highPowers ? 2 : 1;
    const expTotal = expBase * 2;
    const vExpr = expBase === 1 ? `${v}^2` : `${v}^{${expTotal}}`;
    const r1Var = expBase === 1 ? v : `${v}^${expBase}`;
    const a = getRandomInt(1, 4);
    const b = getRandomInt(1, 7);
    const sign = pickRandom(['+', '-']);
    const r1 = `${a === 1 ? '' : a}${r1Var}`;
    const r2 = `${b}`;
    const midExp = expBase === 1 ? v : `${v}^${expBase}`;

    return {
      id: `tcp_${Date.now()}`,
      expression: `${a * a === 1 ? '' : a * a}${vExpr} ${sign} ${2 * a * b}${midExp} + ${b * b}`,
      type: "tcp",
      typeName: "Trinomio Cuadrado Perfecto",
      hint: "Extremos cuadrados y centro = 2 veces sus raíces.",
      solveHint: "Calcula las raíces de los extremos y valida el signo central.",
      assembleHint: `El binomio hereda el signo del centro (${sign}).`,
      steps: [
        { prompt: `Raíz del primer término`, answer: r1 },
        { prompt: `Raíz del tercer término`, answer: r2 },
        { prompt: `Validación: 2 ⋅ (${r1}) ⋅ (${r2})`, answer: `${2 * a * b}${midExp}`, isValidation: true }
      ],
      buildSchemas: [["(", "R0", sign, "R1", ")", "^2"]],
      palette: [r1, r2, "+", "-"]
    };
  },

  factor_comun: (config: { highPowers: boolean; fractions: boolean }) => {
    const v = pickRandom(variables);
    const hasVar = Math.random() > 0.4;
    const fNum = getRandomInt(2, 9);
    const fVar = hasVar ? v : "";
    const commonFactor = `${fNum}${fVar}`;

    const c1 = getRandomInt(2, 5);
    const c2 = getRandomInt(2, 5);
    const powShift = config.highPowers ? 2 : 1;
    
    const r1 = `${c1}${hasVar ? `${v}^${powShift}` : `${v}`}`;
    const r2 = `${c2}`;

    const term1_v = hasVar ? `${v}^${powShift + 1}` : `${v}^${powShift}`;
    const term2_v = hasVar ? v : "";

    return {
      id: `fc_${Date.now()}`,
      expression: `${fNum * c1}${term1_v} + ${fNum * c2}${term2_v ? term2_v : ''}`,
      type: "factor_comun",
      typeName: "Factor Común",
      hint: "Busca el MCD de los números y las letras comunes con menor exponente.",
      solveHint: "Divide cada término de la expresión entre el factor común.",
      assembleHint: "El factor común queda fuera multiplicando al paréntesis.",
      steps: [
        { prompt: `¿Cuál es el factor común?`, answer: commonFactor },
        { prompt: `Divide 1er término / ${commonFactor}`, answer: r1 },
        { prompt: `Divide 2do término / ${commonFactor}`, answer: r2 }
      ],
      buildSchemas: [["R0", "(", "R1", "+", "R2", ")"]],
      palette: [commonFactor, r1, r2, "+", "-"]
    };
  },

  trinomio_simple: (config: { highPowers: boolean }) => {
    const v = pickRandom(variables);
    const expBase = config.highPowers ? 2 : 1;
    const vQuad = expBase === 1 ? `${v}^2` : `${v}^{${expBase * 2}}`;
    const vMid = expBase === 1 ? v : `${v}^${expBase}`;

    let n1 = getRandomInt(-8, 8);
    let n2 = getRandomInt(-8, 8);
    if (n1 === 0) n1 = 1; if (n2 === 0) n2 = 1;
    const b = n1 + n2;
    const c = n1 * n2;
    const r1 = `${Math.abs(n1)}`;
    const r2 = `${Math.abs(n2)}`;
    const s1 = n1 >= 0 ? '+' : '-';
    const s2 = n2 >= 0 ? '+' : '-';

    return {
      id: `ts_${Date.now()}`,
      expression: `${vQuad} ${b >= 0 ? '+' : ''}${b}${vMid} ${c >= 0 ? '+' : ''}${c}`,
      type: "trinomio_simple",
      typeName: "Trinomio x² + bx + c",
      termC: c,
      termB: b,
      hint: "Busca dos números que multiplicados den C y sumados den B.",
      solveHint: "Usa la tabla de factores de C para encontrar el par que sume B.",
      assembleHint: "Si C es (+), los signos son iguales. Si C es (-), son diferentes.",
      steps: [
        { prompt: `Número que multiplicado por ${n2} da ${c}`, answer: `${n1}` },
        { prompt: `Número que multiplicado por ${n1} da ${c}`, answer: `${n2}` }
      ],
      buildSchemas: [
        ["(", vMid, s1, r1, ")", "(", vMid, s2, r2, ")"],
        ["(", vMid, s2, r2, ")", "(", vMid, s1, r1, ")"]
      ],
      palette: [vMid, r1, r2, "+", "-"]
    };
  }
};

type Exercise = {
  id: string;
  expression: string;
  type: string;
  typeName: string;
  hint: string;
  solveHint: string;
  assembleHint: string;
  steps: Array<{ prompt: string; answer: string; isValidation?: boolean }>;
  buildSchemas: string[][];
  palette: string[];
  termC?: number;
  termB?: number;
};

type SessionHistoryItem = {
  expression: string;
  type: string;
  status: 'success';
};

export default function App() {
  const [appMode, setAppMode] = useState('guide'); 
  const [exerciseConfig, setExerciseConfig] = useState({
    fractions: false,
    highPowers: false
  });
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [phase, setPhase] = useState('identify');
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [score, setScore] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<SessionHistoryItem[]>([]);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, mistakes: 0, currentMistakes: 0 });
  const [answers, setAnswers] = useState<string[]>([]);
  const [isKatexLoaded, setIsKatexLoaded] = useState(false);
  const [slots, setSlots] = useState<Array<string | null>>([]);
  const [showManualTip, setShowManualTip] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js";
    script.async = true;
    script.onload = () => {
      setIsKatexLoaded(true);
      startNewSession();
    };
    document.head.appendChild(script);
  }, []);

  const startNewSession = () => {
    setSessionCount(0);
    setSessionHistory([]);
    setIsSessionFinished(false);
    setScore(0);
    setSessionStats({ correct: 0, mistakes: 0, currentMistakes: 0 });
    nextExercise(true);
  };

  const nextExercise = (isFirst = false) => {
    if (!isFirst && sessionCount >= SESSION_LENGTH - 1) {
      setIsSessionFinished(true);
      return;
    }
    if (!isFirst) setSessionCount(prev => prev + 1);

    const types: Array<'diff_squares' | 'tcp' | 'factor_comun' | 'trinomio_simple' | 'diff_cubes' | 'suma_cubos'> = [
      'diff_squares', 'tcp', 'factor_comun', 'trinomio_simple', 'diff_cubes', 'suma_cubos'
    ];
    const chosenType = pickRandom(types);

    let nextEx;
    if (chosenType === 'diff_cubes') {
      nextEx = GENERATORS.cubos(exerciseConfig, 'diff_cubes');
    } else if (chosenType === 'suma_cubos') {
      nextEx = GENERATORS.cubos(exerciseConfig, 'suma_cubos');
    } else {
      nextEx = GENERATORS[chosenType](exerciseConfig);
    }

    setCurrentExercise(nextEx);
    setPhase('identify');
    setCurrentStep(0);
    setUserInput('');
    setAnswers([]);
    setFeedback({ message: '', type: '' });
    setSlots([]);
    setShowManualTip(false);
    setSessionStats(prev => ({ ...prev, currentMistakes: 0 }));
  };

  const handleIdentify = (typeId: 'diff_squares' | 'tcp' | 'factor_comun' | 'trinomio_simple' | 'diff_cubes' | 'suma_cubos') => {
    if (!currentExercise) return;

    const isMatch = typeId === currentExercise.type || 
      (currentExercise.type.startsWith('factor_comun') && typeId === 'factor_comun') ||
      ((currentExercise.type === 'diff_cubes' || currentExercise.type === 'suma_cubos') && typeId === currentExercise.type);

    if (isMatch) {
      setFeedback({ message: `¡Correcto! Es una ${currentExercise.typeName}.`, type: 'success' });
      setSessionStats(prev => ({ ...prev, correct: prev.correct + 1, currentMistakes: 0 }));
      setTimeout(() => { setPhase('solve'); setFeedback({ message: '', type: '' }); }, 800);
    } else {
      setFeedback({ message: 'Ese tipo no corresponde a la estructura dada.', type: 'error' });
      handleMistake();
    }
  };

  const handleMistake = () => {
    setSessionStats(prev => ({ 
      ...prev, 
      mistakes: prev.mistakes + 1, 
      currentMistakes: prev.currentMistakes + 1 
    }));
  };

  const handleStepSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput || !currentExercise) return;
    const step = currentExercise.steps[currentStep];
    const isCorrect = normalizeMathString(userInput) === normalizeMathString(step.answer);

    if (isCorrect) {
      setAnswers([...answers, userInput.trim()]);
      setFeedback({ message: '¡Muy bien!', type: 'success' });
      if (currentStep < currentExercise.steps.length - 1) {
        setTimeout(() => { 
          setCurrentStep(currentStep + 1); 
          setUserInput(''); 
          setFeedback({ message: '', type: '' }); 
          setShowManualTip(false); 
        }, 600);
      } else {
        const schema = currentExercise.buildSchemas[0];
        const initialSlots = schema.map(s => {
          const interactive = ["R0", "R1", "R2", "R3", "+", "-", currentExercise.palette[0]];
          if (interactive.includes(s) || (currentExercise.type.includes('cub') && ["R0^2", "R1^2", "prod"].includes(s))) return null;
          return s;
        });
        setSlots(initialSlots);
        setTimeout(() => { 
          setPhase('assemble'); 
          setFeedback({ message: '', type: '' }); 
          setShowManualTip(false); 
        }, 600);
      }
    } else {
      setFeedback({ message: 'Revisa tu cálculo e inténtalo de nuevo.', type: 'error' });
      handleMistake();
    }
  };

  const handlePieceClick = (piece: string) => {
    const firstEmpty = slots.findIndex(s => s === null);
    if (firstEmpty === -1) return;
    setSlots(prev => {
      const next = [...prev];
      next[firstEmpty] = piece;
      return next;
    });
  };

  const clearSlotByIndex = (index: number) => {
    if (slots[index] === null) return;
    const fixed = ["(", ")", "^2"];
    if (fixed.includes(slots[index])) return;
    setSlots(prev => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const clearLastSlot = () => {
    const fixed = ["(", ")", "^2"];
    const lastFilledIndex = [...slots].reverse().findIndex(s => s !== null && !fixed.includes(s));
    if (lastFilledIndex === -1) return;
    const actualIndex = slots.length - 1 - lastFilledIndex;
    clearSlotByIndex(actualIndex);
  };

  const validateAssembly = () => {
    if (!currentExercise) {
      setFeedback({ message: "Primero selecciona un ejercicio.", type: 'error' });
      return;
    }
    if (slots.some(s => s === null)) {
      setFeedback({ message: "Aún hay espacios vacíos por completar.", type: 'error' });
      return;
    }
    const isAnyCorrect = currentExercise.buildSchemas.some(schema => {
      const correctSequence = schema.map(s => {
        if (s === "R0") return normalizeMathString(currentExercise.steps[0].answer);
        if (s === "R1") return normalizeMathString(currentExercise.steps[1].answer);
        if (s === "R2") return normalizeMathString(currentExercise.steps[2]?.answer || '');
        if (s === "R3") return normalizeMathString(currentExercise.steps[3]?.answer || '');
        if (s === "R0^2") return normalizeMathString(`${currentExercise.steps[0].answer}^2`);
        if (s === "R1^2") return normalizeMathString(`${currentExercise.steps[1].answer}^2`);
        return s;
      });
      const normalizedSlots = slots.map(s => normalizeMathString(s ?? ''));
      return JSON.stringify(normalizedSlots) === JSON.stringify(correctSequence);
    });

    if (isAnyCorrect) {
      setScore(s => s + 20);
      setSessionHistory(prev => [...prev, { expression: currentExercise.expression, type: currentExercise.typeName, status: 'success' }]);
      setPhase('completed');
    } else {
      setFeedback({ message: "La estructura no es correcta.", type: 'error' });
      handleMistake();
    }
  };

  const finalResultTex = useMemo(() => {
    if (phase !== 'completed' || !slots.length) return '';
    return slots.join(" ").replace(/\^2/g, "^2");
  }, [phase, slots]);

  const canShowTip = (appMode === 'guide' && sessionStats.currentMistakes >= 1) || (appMode === 'practice' && sessionStats.currentMistakes >= 3);

  if (isSessionFinished) {
    return (
      <div className="min-h-screen bg-[#FDFDFF] text-slate-900 p-4 md:p-6 font-sans flex flex-col items-center justify-center animate-in fade-in duration-700">
        <KatexResources />
        <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="bg-indigo-600 p-12 text-center text-white">
            <Trophy className="w-20 h-20 mx-auto mb-4 animate-bounce" />
            <h1 className="text-4xl font-black mb-2 tracking-tighter text-white">¡Sesión Finalizada!</h1>
            <p className="opacity-90 font-medium tracking-wide">Resultados de tu práctica actual</p>
          </div>
          <div className="p-10">
            <div className="grid grid-cols-2 gap-4 mb-8 text-center">
              <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
                <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Aciertos</p>
                <p className="text-3xl font-black text-green-700">{sessionStats.correct}</p>
              </div>
              <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Errores Totales</p>
                <p className="text-3xl font-black text-red-700">{sessionStats.mistakes}</p>
              </div>
            </div>
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Desglose de la Sesión
            </h3>
            <div className="space-y-3 mb-10 overflow-y-auto max-h-60 pr-2">
              {sessionHistory.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex-1">
                    <MathView tex={item.expression} className="text-sm !justify-start" isLoaded={isKatexLoaded} />
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{item.type}</p>
                  </div>
                  <CheckCircle2 className="text-green-500 w-6 h-6" />
                </div>
              ))}
            </div>
            <button onClick={startNewSession} className="w-full bg-indigo-600 text-white font-black py-6 rounded-3xl shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95">
              Nueva Sesión <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentExercise) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 p-4 md:p-6 font-sans flex flex-col items-center">
      <KatexResources />
      <nav className="w-full max-w-3xl flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg">
            <BrainCircuit className="text-white w-5 h-5" />
          </div>
          <h1 className="text-lg font-black text-slate-800 tracking-tight">FactorizApp <span className="text-indigo-400 font-medium text-xs ml-1 tracking-normal italic">v2.8</span></h1>
        </div>
        <div className="flex gap-2 items-center">
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 mr-2 shadow-inner">
            <button onClick={() => setAppMode('guide')} className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${appMode === 'guide' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>GUÍA</button>
            <button onClick={() => setAppMode('practice')} className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${appMode === 'practice' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>PRÁCTICA</button>
          </div>
          <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{sessionCount + 1}/{SESSION_LENGTH}</span>
          </div>
        </div>
      </nav>

      {/* Controles de Configuración ON/OFF (Fracciones y Exponentes Mayores) */}
      <div className="w-full max-w-3xl mb-4 flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
          <span>Dificultad Personalizada:</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setExerciseConfig(prev => ({ ...prev, fractions: !prev.fractions }))}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              exerciseConfig.fractions 
                ? 'bg-indigo-50 text-indigo-600 border-indigo-200' 
                : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Fracciones:</span>
            <span className={`text-[10px] uppercase font-black px-1.5 py-0.5 rounded ${exerciseConfig.fractions ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              {exerciseConfig.fractions ? 'ON' : 'OFF'}
            </span>
          </button>

          <button 
            onClick={() => setExerciseConfig(prev => ({ ...prev, highPowers: !prev.highPowers }))}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              exerciseConfig.highPowers 
                ? 'bg-indigo-50 text-indigo-600 border-indigo-200' 
                : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            <span>Exponentes Mayores:</span>
            <span className={`text-[10px] uppercase font-black px-1.5 py-0.5 rounded ${exerciseConfig.highPowers ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              {exerciseConfig.highPowers ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>

      <main className="w-full max-w-3xl">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/40 border border-white overflow-hidden transition-all duration-500 relative">
          <div className="bg-slate-50/50 px-8 py-3 border-b border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 tracking-widest uppercase">
            <div className="flex items-center gap-2">
               <div className={`w-1.5 h-1.5 rounded-full ${phase === 'completed' ? 'bg-green-500' : 'bg-indigo-500'}`} />
               Fase: {phase === 'assemble' ? 'Construcción' : phase}
            </div>
            <div className="flex gap-1 items-center font-black text-slate-700 text-xs">
               <Star className={`w-3 h-3 ${score > 0 ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
               <span>{score} pts</span>
            </div>
          </div>
          <div className="p-8 md:p-10">
            <div className="text-center mb-6">
              <div className="py-8 px-4 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
                <MathView tex={currentExercise.expression} isLoaded={isKatexLoaded} className="text-4xl md:text-5xl text-slate-800 font-light" />
              </div>
            </div>

            {/* Tip del Profesor Recuperado */}
            {(appMode === 'guide' || showManualTip) && (
              <div className="mb-6 bg-amber-50/60 border border-amber-100 rounded-2xl p-4 flex gap-4 items-start relative transition-all animate-in slide-in-from-top-2">
                 <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><BookOpen className="w-4 h-4" /></div>
                 <div className="flex-1 text-balance">
                    <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1 flex items-center gap-1"><Info className="w-3 h-3" /> Soporte Pedagógico</h4>
                    <p className="text-sm text-amber-900/80 font-medium leading-tight">{phase === 'identify' ? currentExercise.hint : phase === 'assemble' ? currentExercise.assembleHint : currentExercise.solveHint}</p>
                 </div>
              </div>
            )}

            {/* Tabla de Factores RECUPERADA (Solo para Trinomio Simple) */}
            {currentExercise.type === 'trinomio_simple' && phase === 'solve' && (appMode === 'guide' || showManualTip) && (
              <div className="mb-6 animate-in fade-in duration-500">
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                  <h5 className="text-[10px] font-black text-indigo-700 uppercase mb-3 flex items-center gap-2">
                    <TableIcon className="w-3 h-3" /> Factores de C = {Math.abs(currentExercise.termC ?? 0)}
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {getFactorPairs(currentExercise.termC ?? 0).map((p, i) => (
                      <div key={i} className="bg-white border border-indigo-200 px-4 py-2 rounded-xl text-xs font-mono text-indigo-600 font-bold shadow-sm">
                        {p[0]} × {p[1]}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-indigo-500 mt-2 italic">Deduce los signos. Deben sumar B = {currentExercise.termB}.</p>
                </div>
              </div>
            )}

            {appMode === 'practice' && canShowTip && !showManualTip && (
              <div className="mb-6 text-center">
                <button onClick={() => setShowManualTip(true)} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black shadow-sm border border-indigo-100 flex items-center gap-2 mx-auto"><HelpCircle className="w-4 h-4" /> ¿OBTENER PISTA?</button>
              </div>
            )}

            <div className="min-h-[280px] flex flex-col items-center justify-center">
              {phase === 'identify' && (
                <div className="w-full animate-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-center text-lg font-black text-slate-700 mb-6">Clasifica la expresión:</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {([
                      { id: 'factor_comun', label: 'Factor Común' },
                      { id: 'diff_squares', label: 'Diferencia de Cuadrados' },
                      { id: 'tcp', label: 'Trinomio Cuadrado Perfecto' },
                      { id: 'trinomio_simple', label: 'Trinomio x² + bx + c' },
                      { id: 'diff_cubes', label: 'Diferencia de Cubos' },
                      { id: 'suma_cubos', label: 'Suma de Cubos' }
                    ] as const).map(type => (
                      <button key={type.id} onClick={() => handleIdentify(type.id)} className="p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 transition-all font-bold text-slate-700 text-xs shadow-sm active:scale-95">
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {phase === 'solve' && (
                <div className="w-full max-w-sm animate-in zoom-in-95 duration-300">
                  <div className="text-center mb-6">
                    <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase mb-1 tracking-tighter">Paso {currentStep + 1} de {currentExercise.steps.length}</p>
                    <h3 className="text-xl font-black text-slate-800 leading-tight">{currentExercise.steps[currentStep].prompt}</h3>
                  </div>
                  <form onSubmit={handleStepSubmit} className="space-y-4">
                    <input type="text" autoFocus value={userInput} onChange={e => setUserInput(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-2xl text-center font-mono focus:border-indigo-500 focus:bg-white outline-none shadow-inner" placeholder="..." />
                    <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-indigo-700 flex justify-center items-center gap-2 active:scale-95">Confirmar <ChevronRight className="w-5 h-5"/></button>
                  </form>
                </div>
              )}
              {phase === 'assemble' && (
                <div className="w-full animate-in fade-in duration-500 text-center">
                  <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tighter">Construcción Final</h2>
                  <div className="flex flex-wrap justify-center items-center gap-2 mb-8 p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 min-h-[120px]">
                    {slots.map((s, i) => (
                      <div key={i} onClick={() => clearSlotByIndex(i)} className={`flex items-center justify-center transition-all duration-300 cursor-pointer ${s === "^2" ? 'w-10 h-12 -mt-10' : 'min-w-[48px] h-[64px] rounded-xl text-xl font-mono border-2'} ${s === null ? 'bg-white border-indigo-200 shadow-inner scale-105' : ['(', ')'].includes(s) ? 'bg-transparent border-transparent text-slate-300 font-black cursor-default' : s === "^2" ? 'bg-indigo-600 border-indigo-700 text-white scale-125 font-bold shadow-md cursor-default' : 'bg-white border-indigo-600 text-indigo-700 shadow-sm font-bold hover:bg-red-50 hover:border-red-400'}`}>
                        {s === "^2" ? "²" : (s || "?")}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-wrap justify-center gap-2">
                      {currentExercise.palette.map((p, i) => (
                        <button key={i} onClick={() => handlePieceClick(p)} className="px-5 py-3 bg-white border-2 border-slate-200 rounded-xl font-mono text-lg font-bold hover:border-indigo-500 hover:text-indigo-600 active:scale-90 transition-all shadow-sm">{p}</button>
                      ))}
                      <button onClick={clearLastSlot} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 border border-red-100 transition-colors"><Eraser className="w-5 h-5" /></button>
                    </div>
                    <button onClick={validateAssembly} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl flex justify-center items-center gap-2 shadow-lg active:scale-95">Verificar Estructura <Check className="w-5 h-5" /></button>
                  </div>
                </div>
              )}
              {phase === 'completed' && (
                <div className="text-center space-y-6 animate-in zoom-in-95 duration-700">
                  <div className="bg-green-100 p-6 rounded-full inline-block border-4 border-white shadow-xl text-green-600"><Award className="w-10 h-10" /></div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tighter italic">¡Excelente Logro!</h2>
                  <div className="bg-green-50 border-2 border-green-100 p-8 rounded-[2.5rem] shadow-inner"><MathView tex={finalResultTex} isLoaded={isKatexLoaded} className="text-4xl md:text-5xl font-black text-green-700" /></div>
                  <button onClick={() => nextExercise()} className="bg-indigo-600 text-white font-black px-12 py-4 rounded-2xl shadow-xl flex items-center gap-2 mx-auto active:scale-95 transition-all">Siguiente Ejercicio <ChevronRight className="w-5 h-5"/></button>
                </div>
              )}
            </div>
            {feedback.message && (
              <div className={`mt-6 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 border-2 ${feedback.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                 {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <p className="font-bold text-[10px] uppercase tracking-wider leading-tight">{feedback.message}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}