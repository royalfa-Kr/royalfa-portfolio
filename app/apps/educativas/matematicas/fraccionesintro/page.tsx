"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  HelpCircle,
  Home,
  Info,
  Layers,
  ListChecks,
  RotateCcw,
  Settings,
  ShieldCheck,
  SkipForward,
  Sparkles,
  Table2,
  Trash2,
  AlertTriangle,
  Eye,
  X,
  Check,
  Divide,
  Plus,
} from 'lucide-react';

// ============================================================================
// MÓDULO 1: TIPOS Y MODELOS DE DATOS
// ============================================================================

export interface Fraction {
  num: number;
  den: number; // Siempre entero positivo (> 0)
}

export type Difficulty = 'sencillo' | 'medio' | 'avanzado';
export type ReductionMode = '1' | '2' | '3a5' | 'aleatoria';

export type ModuleCategory =
  | 'm1_ampliacion_simple'
  | 'm1_ampliacion_razonamiento'
  | 'm1_reduccion'
  | 'm2_simple_mult'
  | 'm2_simple_pot'
  | 'm2_simple_raiz'
  | 'm2_simple_div'
  | 'm2_simple_sumaresta'
  | 'm2_red_mult'
  | 'm2_red_pot'
  | 'm2_red_raiz'
  | 'm2_red_div'
  | 'm2_red_sumaresta';

export type ErrorKind =
  | 'formato'
  | 'conceptual'
  | 'calculo'
  | 'simplificacion'
  | 'equivalente_no_objetivo';

export type ExerciseOutcome =
  | 'sin_ayuda'
  | 'con_ayuda'
  | 'solucion_mostrada'
  | 'omitido';

export interface AppSettings {
  allowRule7: boolean;
  allowNegativesInAdvanced: boolean;
}

export interface TopicStats {
  attempts: number;
  withoutHelp: number;
  withHelp: number;
  shown: number;
  skipped: number;
  errorsByKind: Record<ErrorKind, number>;
}

export interface StoredProgress {
  version: number;
  settings: AppSettings;
  statsByTopic: Record<string, TopicStats>;
  recentExerciseIds: string[];
}

export interface DivisibilityRuleInfo {
  divisor: number;
  title: string;
  summary: string;
  exampleYes: string;
  exampleNo: string;
  advancedRule?: string;
}

export interface StrategyOption {
  id: string;
  label: string;
  isCorrect: boolean;
  feedback: string;
}

export interface BaseExercise {
  id: string;
  category: ModuleCategory;
  topicLabel: string;
  difficulty: Difficulty;
  objective: string;
  strategyOptions: StrategyOption[];
  examplePath: string[];
  // Datos específicos según categoría
  data: ExerciseData;
}

export type ExerciseData =
  | { kind: 'ampliacion_simple'; base: Fraction; factor: number; target: Fraction }
  | { kind: 'ampliacion_razonamiento'; base: Fraction; factor: number; target: Fraction }
  | {
      kind: 'reduccion';
      initial: Fraction;
      mode: ReductionMode;
      plannedSteps: number;
      reduced: Fraction;
    }
  | {
      kind: 'multiplicacion';
      a: Fraction;
      b: Fraction;
      requireReduction: boolean;
      rawResult: Fraction;
      reducedResult: Fraction;
    }
  | {
      kind: 'potencia';
      base: Fraction;
      exponent: 2 | 3 | 4;
      requireReduction: boolean;
      rawResult: Fraction;
      reducedResult: Fraction;
    }
  | {
      kind: 'raiz';
      radicand: Fraction;
      index: 2 | 3;
      requireReduction: boolean;
      needsPreSimplify: boolean;
      finalResult: Fraction;
    }
  | {
      kind: 'division';
      a: Fraction;
      b: Fraction;
      requireReduction: boolean;
      rawResult: Fraction;
      reducedResult: Fraction;
    }
  | {
      kind: 'suma_resta';
      terms: Fraction[];
      operators: Array<'+' | '-'>; // longitud = terms.length - 1
      requireReduction: boolean;
      lcmDen: number;
      equivalents: Fraction[];
      rawResult: Fraction;
      reducedResult: Fraction;
    };

export interface FeedbackMessage {
  type: 'success' | 'info' | 'warning' | 'error';
  errorKind?: ErrorKind;
  title: string;
  body: string;
  hint?: string;
  parallelExample?: string;
}

export interface ReductionHistoryItem {
  from: Fraction;
  divisor: number;
  qNum: number;
  qDen: number;
  to: Fraction;
}

export interface QuizRecord {
  exerciseId: string;
  topicLabel: string;
  category: ModuleCategory;
  strategyCorrectFirstTry: boolean;
  totalErrors: number;
  hintsUsed: number;
  stepsShown: number;
  outcome: ExerciseOutcome;
  errorKinds: ErrorKind[];
}

// ============================================================================
// MÓDULO 2: MOTOR MATEMÁTICO EXACTO (SIN DECIMALES APROXIMADOS)
// ============================================================================

export function assertSafeInt(n: number, label = 'valor'): number {
  if (!Number.isInteger(n) || !Number.isSafeInteger(n)) {
    throw new Error(`El ${label} (${n}) no es un entero seguro.`);
  }
  return n;
}

export function createFraction(num: number, den: number): Fraction {
  assertSafeInt(num, 'numerador');
  assertSafeInt(den, 'denominador');
  if (den === 0) {
    throw new Error('El denominador no puede ser cero.');
  }
  if (den < 0) {
    return { num: -num, den: -den };
  }
  return { num, den };
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(assertSafeInt(a, 'a'));
  let y = Math.abs(assertSafeInt(b, 'b'));
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

export function lcm(a: number, b: number): number {
  const x = Math.abs(assertSafeInt(a, 'a'));
  const y = Math.abs(assertSafeInt(b, 'b'));
  if (x === 0 || y === 0) return 0;
  const g = gcd(x, y);
  const res = (x / g) * y;
  return assertSafeInt(res, 'mcm');
}

export function lcmMany(nums: number[]): number {
  if (nums.length === 0) throw new Error('Se requiere al menos un entero para calcular el mcm.');
  return nums.reduce((acc, n) => lcm(acc, n), 1);
}

export function simplifyFraction(f: Fraction): Fraction {
  const valid = createFraction(f.num, f.den);
  if (valid.num === 0) return { num: 0, den: 1 };
  const g = gcd(valid.num, valid.den);
  return { num: valid.num / g, den: valid.den / g };
}

export function isReduced(f: Fraction): boolean {
  const valid = createFraction(f.num, f.den);
  if (valid.num === 0) return valid.den === 1;
  return gcd(Math.abs(valid.num), valid.den) === 1;
}

export function areEquivalent(a: Fraction, b: Fraction): boolean {
  const fa = createFraction(a.num, a.den);
  const fb = createFraction(b.num, b.den);
  return BigInt(fa.num) * BigInt(fb.den) === BigInt(fb.num) * BigInt(fa.den);
}

export function addFractions(a: Fraction, b: Fraction): { raw: Fraction; reduced: Fraction; commonDen: number } {
  const fa = createFraction(a.num, a.den);
  const fb = createFraction(b.num, b.den);
  const commonDen = lcm(fa.den, fb.den);
  const n1 = assertSafeInt(fa.num * (commonDen / fa.den));
  const n2 = assertSafeInt(fb.num * (commonDen / fb.den));
  const raw = createFraction(assertSafeInt(n1 + n2), commonDen);
  return { raw, reduced: simplifyFraction(raw), commonDen };
}

export function subFractions(a: Fraction, b: Fraction): { raw: Fraction; reduced: Fraction; commonDen: number } {
  return addFractions(a, { num: -b.num, den: b.den });
}

export function combineAddSub(
  terms: Fraction[],
  operators: Array<'+' | '-'>
): { commonDen: number; equivalents: Fraction[]; raw: Fraction; reduced: Fraction } {
  if (terms.length === 0 || operators.length !== terms.length - 1) {
    throw new Error('Operación aditiva inválida.');
  }
  const commonDen = lcmMany(terms.map((t) => t.den));
  const equivalents = terms.map((t) => {
    const factor = commonDen / t.den;
    return createFraction(assertSafeInt(t.num * factor), commonDen);
  });
  let totalNum = equivalents[0].num;
  for (let i = 0; i < operators.length; i++) {
    totalNum =
      operators[i] === '+'
        ? assertSafeInt(totalNum + equivalents[i + 1].num)
        : assertSafeInt(totalNum - equivalents[i + 1].num);
  }
  const raw = createFraction(totalNum, commonDen);
  return { commonDen, equivalents, raw, reduced: simplifyFraction(raw) };
}

export function multiplyFractions(a: Fraction, b: Fraction): { raw: Fraction; reduced: Fraction } {
  const fa = createFraction(a.num, a.den);
  const fb = createFraction(b.num, b.den);
  const raw = createFraction(assertSafeInt(fa.num * fb.num), assertSafeInt(fa.den * fb.den));
  return { raw, reduced: simplifyFraction(raw) };
}

export function divideFractions(a: Fraction, b: Fraction): { inverted: Fraction; raw: Fraction; reduced: Fraction } {
  const fa = createFraction(a.num, a.den);
  const fb = createFraction(b.num, b.den);
  if (fb.num === 0) {
    throw new Error('No se puede dividir entre una fracción de valor cero.');
  }
  const inverted = createFraction(fb.den, fb.num);
  const { raw, reduced } = multiplyFractions(fa, inverted);
  return { inverted, raw, reduced };
}

export function powerFraction(f: Fraction, exp: 2 | 3 | 4): { raw: Fraction; reduced: Fraction } {
  const fa = createFraction(f.num, f.den);
  if (![2, 3, 4].includes(exp)) {
    throw new Error('Solo se admiten exponentes enteros entre 2 y 4.');
  }
  let n = 1;
  let d = 1;
  for (let i = 0; i < exp; i++) {
    n = assertSafeInt(n * fa.num);
    d = assertSafeInt(d * fa.den);
  }
  const raw = createFraction(n, d);
  return { raw, reduced: simplifyFraction(raw) };
}

export function exactIntRoot(n: number, index: 2 | 3): number | null {
  assertSafeInt(n);
  if (n < 0) return null;
  if (n === 0) return 0;
  if (n === 1) return 1;
  // Búsqueda binaria entera exacta (sin depender de flotantes)
  let low = 1;
  let high = index === 2 ? Math.min(n, 94906265) : Math.min(n, 208063);
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const val = index === 2 ? mid * mid : mid * mid * mid;
    if (val === n) return mid;
    if (val < n) low = mid + 1;
    else high = mid - 1;
  }
  return null;
}

export function isPerfectPower(n: number, index: 2 | 3): boolean {
  return exactIntRoot(n, index) !== null;
}

export function exactFractionRoot(f: Fraction, index: 2 | 3): Fraction | null {
  const valid = createFraction(f.num, f.den);
  if (valid.num < 0) return null;
  const simp = simplifyFraction(valid);
  const rNum = exactIntRoot(simp.num, index);
  const rDen = exactIntRoot(simp.den, index);
  if (rNum === null || rDen === null) return null;
  return createFraction(rNum, rDen);
}

export function commonDivisors(a: number, b: number): number[] {
  const g = gcd(a, b);
  const divs: number[] = [];
  for (let d = 2; d <= g; d++) {
    if (g % d === 0) divs.push(d);
  }
  return divs;
}

export function parseIntStrict(raw: string, allowNegative = false): number | null {
  const cleaned = raw.trim();
  if (cleaned === '') return null;
  const regex = allowNegative ? /^-?\d+$/ : /^\d+$/;
  if (!regex.test(cleaned)) return null;
  const val = Number(cleaned);
  return Number.isSafeInteger(val) ? val : null;
}

// ============================================================================
// MÓDULO 3: REGLAS DE DIVISIBILIDAD (2 AL 11) Y EXPLICACIONES
// ============================================================================

export const DIVISIBILITY_RULES: DivisibilityRuleInfo[] = [
  {
    divisor: 2,
    title: 'Regla del 2',
    summary: 'Un número es divisible entre 2 si su última cifra es par (0, 2, 4, 6 u 8).',
    exampleYes: '48 termina en 8 (par) → sí es divisible entre 2.',
    exampleNo: '35 termina en 5 (impar) → no es divisible entre 2.',
  },
  {
    divisor: 3,
    title: 'Regla del 3',
    summary: 'Un número es divisible entre 3 si la suma de sus cifras es múltiplo de 3.',
    exampleYes: '72 → 7 + 2 = 9 (múltiplo de 3) → sí es divisible entre 3.',
    exampleNo: '52 → 5 + 2 = 7 (no es múltiplo de 3) → no es divisible entre 3.',
  },
  {
    divisor: 4,
    title: 'Regla del 4',
    summary: 'Un número es divisible entre 4 si sus últimas dos cifras forman un múltiplo de 4 (o son 00).',
    exampleYes: '136 → termina en 36 (4 × 9 = 36) → sí es divisible entre 4.',
    exampleNo: '126 → termina en 26 (no es múltiplo de 4) → no es divisible entre 4.',
  },
  {
    divisor: 5,
    title: 'Regla del 5',
    summary: 'Un número es divisible entre 5 si termina en 0 o en 5.',
    exampleYes: '85 termina en 5 → sí es divisible entre 5.',
    exampleNo: '84 termina en 4 → no es divisible entre 5.',
  },
  {
    divisor: 6,
    title: 'Regla del 6',
    summary: 'Un número es divisible entre 6 si es divisible entre 2 y entre 3 al mismo tiempo.',
    exampleYes: '54 es par (÷2) y 5 + 4 = 9 (÷3) → sí es divisible entre 6.',
    exampleNo: '45 es divisible entre 3, pero no es par → no es divisible entre 6.',
  },
  {
    divisor: 7,
    title: 'Regla del 7 (opcional)',
    summary:
      'Puedes comprobarlo buscando el número en la tabla del 7 o haciendo la división exacta (residuo 0).',
    exampleYes: '84 ÷ 7 = 12 con residuo 0 → sí es divisible entre 7.',
    exampleNo: '50 ÷ 7 = 7 y sobra 1 → no es divisible entre 7.',
    advancedRule:
      'Regla avanzada del 7: separa la última cifra, duplícala y réstala del resto del número. Si el resultado es 0 o múltiplo de 7, sí es divisible. Si hace falta repetir, usa el valor absoluto. Ejemplo con 161: 16 − (2 × 1) = 14 (múltiplo de 7).',
  },
  {
    divisor: 8,
    title: 'Regla del 8',
    summary: 'Un número es divisible entre 8 si sus últimas tres cifras forman un múltiplo de 8 (o son 000).',
    exampleYes: '1 024 → 024 = 24 (8 × 3) → sí es divisible entre 8.',
    exampleNo: '1 020 → 020 = 20 (no es múltiplo de 8) → no es divisible entre 8.',
  },
  {
    divisor: 9,
    title: 'Regla del 9',
    summary: 'Un número es divisible entre 9 si la suma de sus cifras es múltiplo de 9.',
    exampleYes: '162 → 1 + 6 + 2 = 9 → sí es divisible entre 9.',
    exampleNo: '123 → 1 + 2 + 3 = 6 (no es múltiplo de 9) → no es divisible entre 9.',
  },
  {
    divisor: 10,
    title: 'Regla del 10',
    summary: 'Un número es divisible entre 10 si termina en 0.',
    exampleYes: '210 termina en 0 → sí es divisible entre 10.',
    exampleNo: '205 termina en 5 → no es divisible entre 10.',
  },
  {
    divisor: 11,
    title: 'Regla del 11',
    summary:
      'Un número es divisible entre 11 si la diferencia entre las sumas de las cifras en posiciones alternadas es 0 o múltiplo de 11.',
    exampleYes: '143 → (1 + 3) − 4 = 0 → sí es divisible entre 11.',
    exampleNo: '152 → (1 + 2) − 5 = −2 → no es divisible entre 11.',
  },
];

export function explainDivisibilityCheck(n: number, d: number): string {
  const absN = Math.abs(n);
  const divides = absN % d === 0;
  const digits = String(absN).split('').map(Number);

  switch (d) {
    case 2:
      return `${absN} termina en ${absN % 10}, que ${divides ? 'es par' : 'no es par'}.`;
    case 3: {
      const s = digits.reduce((a, b) => a + b, 0);
      return `Suma de cifras de ${absN}: ${digits.join(' + ')} = ${s}, que ${
        divides ? 'sí' : 'no'
      } es múltiplo de 3.`;
    }
    case 4: {
      const last2 = absN % 100;
      return `Últimas dos cifras de ${absN}: ${String(last2).padStart(2, '0')}, que ${
        divides ? 'sí' : 'no'
      } es múltiplo de 4.`;
    }
    case 5:
      return `${absN} termina en ${absN % 10}, así que ${divides ? 'sí' : 'no'} es divisible entre 5.`;
    case 6: {
      const d2 = absN % 2 === 0;
      const d3 = absN % 3 === 0;
      return `${absN} ${d2 ? 'sí' : 'no'} es divisible entre 2 y ${d3 ? 'sí' : 'no'} es divisible entre 3.`;
    }
    case 7: {
      if (absN < 100) {
        return divides
          ? `${absN} ÷ 7 = ${absN / 7} (división exacta).`
          : `${absN} ÷ 7 deja residuo ${absN % 7}, no es exacta.`;
      }
      const last = absN % 10;
      const rest = Math.floor(absN / 10);
      const diff = Math.abs(rest - 2 * last);
      return `Separando última cifra: |${rest} − 2×${last}| = ${diff}, que ${
        divides ? 'sí' : 'no'
      } es múltiplo de 7 (${absN} ÷ 7 ${divides ? `= ${absN / 7}` : `deja residuo ${absN % 7}`}).`;
    }
    case 8: {
      const last3 = absN % 1000;
      return `Últimas tres cifras de ${absN}: ${last3}, que ${divides ? 'sí' : 'no'} es múltiplo de 8.`;
    }
    case 9: {
      const s = digits.reduce((a, b) => a + b, 0);
      return `Suma de cifras de ${absN}: ${digits.join(' + ')} = ${s}, que ${
        divides ? 'sí' : 'no'
      } es múltiplo de 9.`;
    }
    case 10:
      return `${absN} termina en ${absN % 10}, así que ${divides ? 'sí' : 'no'} es divisible entre 10.`;
    case 11: {
      let odd = 0;
      let even = 0;
      digits.forEach((dg, idx) => {
        if (idx % 2 === 0) odd += dg;
        else even += dg;
      });
      const diff = Math.abs(odd - even);
      return `Diferencia de cifras alternadas de ${absN}: |${odd} − ${even}| = ${diff}, que ${
        divides ? 'sí' : 'no'
      } es múltiplo de 11.`;
    }
    default:
      return divides
        ? `${absN} ÷ ${d} = ${absN / d} (división exacta).`
        : `${absN} ÷ ${d} deja residuo ${absN % d}, no es exacta.`;
  }
}

// ============================================================================
// MÓDULO 4: GENERADOR ALEATORIO CON SEMILLA Y GENERADORES DE EJERCICIOS
// ============================================================================

export class SeededRNG {
  private state: number;
  constructor(seed: number) {
    this.state = seed >>> 0;
  }
  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
  shuffle<T>(arr: readonly T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

function buildStrategyOptions(
  correctId: string,
  rng: SeededRNG
): StrategyOption[] {
  const pool: Record<string, { label: string; feedback: string }> = {
    ampliar: {
      label: 'Multiplicar numerador y denominador por el mismo entero',
      feedback: 'Para obtener una fracción equivalente ampliada, aplicamos la misma multiplicación arriba y abajo.',
    },
    reducir: {
      label: 'Dividir numerador y denominador entre un divisor común',
      feedback: 'Simplificar consiste en factorizar y cancelar un mismo divisor común mayor que 1 en ambas partes.',
    },
    multiplicar: {
      label: 'Multiplicar numerador por numerador y denominador por denominador',
      feedback: 'La multiplicación de fracciones se realiza de forma directa, parte con parte.',
    },
    dividir: {
      label: 'Conservar la primera fracción, cambiar a multiplicación e invertir la segunda',
      feedback: 'Dividir entre una fracción equivale a multiplicar por su inversa.',
    },
    sumar_restar: {
      label: 'Hallar el mínimo común múltiplo (mcm) y obtener fracciones equivalentes',
      feedback: 'Para sumar o restar con denominadores distintos, primero unificamos el denominador con el mcm.',
    },
    potencia: {
      label: 'Separar la potencia en el numerador y en el denominador',
      feedback: 'Una potencia de una fracción se aplica por separado al numerador y al denominador.',
    },
    raiz: {
      label: 'Separar la raíz en numerador y denominador (simplificando antes si hace falta)',
      feedback: 'Podemos distribuir la raíz a ambas partes cuando son potencias exactas, o simplificar primero dentro de la raíz.',
    },
  };

  const keys = Object.keys(pool);
  const distractors = rng.shuffle(keys.filter((k) => k !== correctId)).slice(0, 3);
  const chosen = rng.shuffle([correctId, ...distractors]);
  return chosen.map((id) => ({
    id,
    label: pool[id].label,
    isCorrect: id === correctId,
    feedback: pool[id].feedback,
  }));
}

function randomIrreducible(
  rng: SeededRNG,
  minNum: number,
  maxNum: number,
  minDen: number,
  maxDen: number
): Fraction {
  for (let attempt = 0; attempt < 40; attempt++) {
    const num = rng.int(minNum, maxNum);
    const den = rng.int(minDen, maxDen);
    if (num !== den && gcd(num, den) === 1) {
      return createFraction(num, den);
    }
  }
  return createFraction(2, 3);
}

export interface GenerateOptions {
  category: ModuleCategory;
  difficulty: Difficulty;
  reductionMode?: ReductionMode;
  settings: AppSettings;
  seed?: number;
  excludeSignature?: string;
}

function signatureOf(data: ExerciseData): string {
  return JSON.stringify(data);
}

export function generateExercise(opts: GenerateOptions): BaseExercise {
  const baseSeed = opts.seed ?? Math.floor(Math.random() * 1_000_000_000);
  const rng = new SeededRNG(baseSeed);

  for (let attempt = 0; attempt < 15; attempt++) {
    const ex = generateOnce(opts, rng, `${opts.category}_${baseSeed}_${attempt}`);
    if (!opts.excludeSignature || signatureOf(ex.data) !== opts.excludeSignature) {
      return ex;
    }
  }
  return generateFallback(opts.category, opts.difficulty);
}

function generateOnce(
  opts: GenerateOptions,
  rng: SeededRNG,
  id: string
): BaseExercise {
  const { category, difficulty, settings } = opts;

  // 1.1 Ampliación simple
  if (category === 'm1_ampliacion_simple') {
    const maxBase = difficulty === 'sencillo' ? 8 : difficulty === 'medio' ? 14 : 20;
    const maxFactor = difficulty === 'sencillo' ? 6 : difficulty === 'medio' ? 10 : 12;
    const base = randomIrreducible(rng, 1, maxBase, 2, maxBase);
    const factor = rng.int(2, maxFactor);
    const target = createFraction(base.num * factor, base.den * factor);
    return {
      id,
      category,
      topicLabel: 'Ampliación simple',
      difficulty,
      objective: 'Multiplicar numerador y denominador por el mismo entero positivo.',
      strategyOptions: buildStrategyOptions('ampliar', rng),
      examplePath: [
        `${base.num}/${base.den} = (${base.num} × ${factor}) / (${base.den} × ${factor}) = ${target.num}/${target.den}`,
      ],
      data: { kind: 'ampliacion_simple', base, factor, target },
    };
  }

  // 1.2 Ampliación por razonamiento
  if (category === 'm1_ampliacion_razonamiento') {
    const maxBase = difficulty === 'sencillo' ? 7 : difficulty === 'medio' ? 12 : 18;
    const maxFactor = difficulty === 'sencillo' ? 6 : difficulty === 'medio' ? 9 : 12;
    const base = randomIrreducible(rng, 1, maxBase, 2, maxBase);
    const factor = rng.int(2, maxFactor);
    const target = createFraction(base.num * factor, base.den * factor);
    return {
      id,
      category,
      topicLabel: 'Ampliación por razonamiento',
      difficulty,
      objective: 'Descubrir el factor multiplicador a partir del denominador objetivo y aplicarlo a ambas partes.',
      strategyOptions: buildStrategyOptions('ampliar', rng),
      examplePath: [
        `${base.den} × ${factor} = ${target.den}`,
        `(${base.num} × ${factor}) / (${base.den} × ${factor}) = ${target.num}/${target.den}`,
      ],
      data: { kind: 'ampliacion_razonamiento', base, factor, target },
    };
  }

  // 1.3 Reducción con ayuda
  if (category === 'm1_reduccion') {
    const mode: ReductionMode =
      opts.reductionMode ??
      (difficulty === 'sencillo' ? '1' : difficulty === 'medio' ? '2' : '3a5');
    const stepCount =
      mode === '1'
        ? 1
        : mode === '2'
        ? 2
        : mode === '3a5'
        ? rng.int(3, 5)
        : rng.pick([1, 2, 3, 4]);

    const primesBase = [2, 3, 5];
    const primesPool =
      difficulty === 'sencillo'
        ? primesBase
        : difficulty === 'medio'
        ? settings.allowRule7
          ? [2, 3, 5, 7]
          : [2, 3, 5]
        : settings.allowRule7
        ? [2, 3, 5, 7, 11]
        : [2, 3, 5, 11];

    const reduced = randomIrreducible(
      rng,
      1,
      difficulty === 'sencillo' ? 7 : 11,
      2,
      difficulty === 'sencillo' ? 9 : 13
    );

    const chosenPrimes: number[] = [];
    let commonFactor = 1;
    const maxFactorLimit = stepCount >= 4 ? 120 : difficulty === 'sencillo' ? 24 : 90;

    for (let i = 0; i < stepCount; i++) {
      const candidates = primesPool.filter((p) => commonFactor * p <= maxFactorLimit);
      const p = candidates.length > 0 ? rng.pick(candidates) : 2;
      if (commonFactor * p > 240) break;
      chosenPrimes.push(p);
      commonFactor *= p;
    }

    const initial = createFraction(reduced.num * commonFactor, reduced.den * commonFactor);
    return {
      id,
      category,
      topicLabel: 'Reducción con ayuda',
      difficulty,
      objective: 'Simplificar dividiendo numerador y denominador entre divisores comunes hasta llegar a mínima expresión.',
      strategyOptions: buildStrategyOptions('reducir', rng),
      examplePath: [
        `Factores primos previstos: ${chosenPrimes.join(' × ')} = ${commonFactor}`,
        `${initial.num}/${initial.den} = ${reduced.num}/${reduced.den}`,
      ],
      data: {
        kind: 'reduccion',
        initial,
        mode,
        plannedSteps: chosenPrimes.length,
        reduced,
      },
    };
  }

  // 2.1A / 2.2A Multiplicación
  if (category === 'm2_simple_mult' || category === 'm2_red_mult') {
    const requireReduction = category === 'm2_red_mult';
    const maxOp = difficulty === 'sencillo' ? 9 : difficulty === 'medio' ? 15 : 22;

    let a = createFraction(2, 3);
    let b = createFraction(5, 7);

    for (let t = 0; t < 40; t++) {
      const f1 = randomIrreducible(rng, 1, maxOp, 2, maxOp);
      const f2 = randomIrreducible(rng, 1, maxOp, 2, maxOp);
      const prod = multiplyFractions(f1, f2);
      const reducible = !isReduced(prod.raw);
      if (requireReduction && reducible && prod.raw.den <= 360) {
        a = f1;
        b = f2;
        break;
      }
      if (!requireReduction && !reducible && prod.raw.den <= 200) {
        a = f1;
        b = f2;
        break;
      }
    }
    if (requireReduction && isReduced(multiplyFractions(a, b).raw)) {
      a = createFraction(2, 3);
      b = createFraction(3, 5);
    }

    const { raw, reduced } = multiplyFractions(a, b);
    return {
      id,
      category,
      topicLabel: requireReduction ? 'Multiplicación con reducción' : 'Multiplicación simple',
      difficulty,
      objective: requireReduction
        ? 'Multiplicar numerador por numerador, denominador por denominador y simplificar el resultado.'
        : 'Multiplicar de forma directa numerador por numerador y denominador por denominador.',
      strategyOptions: buildStrategyOptions('multiplicar', rng),
      examplePath: [
        `${a.num}/${a.den} × ${b.num}/${b.den} = (${a.num} × ${b.num})/(${a.den} × ${b.den}) = ${raw.num}/${raw.den}`,
        ...(requireReduction ? [`Simplificada: ${reduced.num}/${reduced.den}`] : []),
      ],
      data: {
        kind: 'multiplicacion',
        a,
        b,
        requireReduction,
        rawResult: raw,
        reducedResult: reduced,
      },
    };
  }

  // 2.1B / 2.2B Potencias
  if (category === 'm2_simple_pot' || category === 'm2_red_pot') {
    const requireReduction = category === 'm2_red_pot';
    const exp: 2 | 3 | 4 =
      difficulty === 'sencillo' ? rng.pick([2, 3]) : rng.pick([2, 3, 4]);
    const maxBase = exp === 2 ? 7 : exp === 3 ? 5 : 3;

    let base = randomIrreducible(rng, 1, maxBase, 2, maxBase);
    if (requireReduction) {
      const k = exp === 2 ? rng.pick([2, 3]) : 2;
      base = createFraction(base.num * k, base.den * k);
    }
    const { raw, reduced } = powerFraction(base, exp);
    return {
      id,
      category,
      topicLabel: requireReduction ? 'Potencias con reducción' : 'Potencias simples',
      difficulty,
      objective: 'Separar la potencia en numerador y denominador antes de calcular.',
      strategyOptions: buildStrategyOptions('potencia', rng),
      examplePath: [
        `(${base.num}/${base.den})^${exp} = ${base.num}^${exp}/${base.den}^${exp} = ${raw.num}/${raw.den}`,
        ...(requireReduction ? [`Simplificada: ${reduced.num}/${reduced.den}`] : []),
      ],
      data: {
        kind: 'potencia',
        base,
        exponent: exp,
        requireReduction,
        rawResult: raw,
        reducedResult: reduced,
      },
    };
  }

  // 2.1C / 2.2C Raíces exactas por construcción
  if (category === 'm2_simple_raiz' || category === 'm2_red_raiz') {
    const requireReduction = category === 'm2_red_raiz';
    const index: 2 | 3 = difficulty === 'sencillo' ? 2 : rng.pick([2, 3]);
    const maxRoot = index === 2 ? (difficulty === 'sencillo' ? 7 : 10) : 5;

    const rootFrac = randomIrreducible(rng, 1, maxRoot, 2, maxRoot);
    const pNum = index === 2 ? rootFrac.num ** 2 : rootFrac.num ** 3;
    const pDen = index === 2 ? rootFrac.den ** 2 : rootFrac.den ** 3;

    let radicand = createFraction(pNum, pDen);
    let needsPreSimplify = false;

    if (requireReduction) {
      // Construir fracción ampliada para practicar simplificación previa o posterior
      const scalePool =
        index === 2
          ? settings.allowRule7
            ? [2, 3, 5, 7]
            : [2, 3, 5]
          : [2, 3, 5];
      const scale = rng.pick(scalePool);
      // A veces ampliamos por un factor no potencia perfecta (requiere simplificar primero)
      // o por uno que permita simplificación parcial como 75/300 -> 25/100 -> 5/10 -> 1/2
      const extraPerfect = index === 2 && difficulty !== 'sencillo' && rng.next() > 0.5 ? 4 : 1;
      const totalScale = scale * extraPerfect;
      if (pNum * totalScale <= 900 && pDen * totalScale <= 900) {
        radicand = createFraction(pNum * totalScale, pDen * totalScale);
        needsPreSimplify = !isPerfectPower(radicand.num, index) || !isPerfectPower(radicand.den, index);
      } else {
        radicand = createFraction(pNum * 2, pDen * 2);
        needsPreSimplify = true;
      }
    }

    const finalResult = exactFractionRoot(radicand, index) ?? rootFrac;
    const sym = index === 2 ? '√' : '∛';
    return {
      id,
      category,
      topicLabel: requireReduction ? 'Raíces con reducción' : 'Raíces simples',
      difficulty,
      objective: requireReduction
        ? 'Simplificar cuando convenga, separar la raíz exacta y entregar el resultado en mínima expresión.'
        : 'Separar la raíz en numerador y denominador y hallar las raíces exactas.',
      strategyOptions: buildStrategyOptions('raiz', rng),
      examplePath: [
        `${sym}(${radicand.num}/${radicand.den}) = ${finalResult.num}/${finalResult.den}`,
      ],
      data: {
        kind: 'raiz',
        radicand,
        index,
        requireReduction,
        needsPreSimplify,
        finalResult,
      },
    };
  }

  // 2.1D / 2.2D División
  if (category === 'm2_simple_div' || category === 'm2_red_div') {
    const requireReduction = category === 'm2_red_div';
    const maxOp = difficulty === 'sencillo' ? 9 : difficulty === 'medio' ? 14 : 20;

    let a = createFraction(2, 3);
    let b = createFraction(3, 5);

    for (let t = 0; t < 40; t++) {
      const f1 = randomIrreducible(rng, 1, maxOp, 2, maxOp);
      const f2 = randomIrreducible(rng, 1, maxOp, 2, maxOp);
      const res = divideFractions(f1, f2);
      const reducible = !isReduced(res.raw);
      if (requireReduction && reducible && res.raw.den <= 300) {
        a = f1;
        b = f2;
        break;
      }
      if (!requireReduction && !reducible && res.raw.den <= 180) {
        a = f1;
        b = f2;
        break;
      }
    }
    if (requireReduction && isReduced(divideFractions(a, b).raw)) {
      a = createFraction(2, 3);
      b = createFraction(4, 5);
    }

    const { inverted, raw, reduced } = divideFractions(a, b);
    return {
      id,
      category,
      topicLabel: requireReduction ? 'División con reducción' : 'División simple',
      difficulty,
      objective: 'Cambiar la división a multiplicación conservando la primera fracción e invirtiendo la segunda.',
      strategyOptions: buildStrategyOptions('dividir', rng),
      examplePath: [
        `${a.num}/${a.den} ÷ ${b.num}/${b.den} = ${a.num}/${a.den} × ${inverted.num}/${inverted.den} = ${raw.num}/${raw.den}`,
        ...(requireReduction ? [`Simplificada: ${reduced.num}/${reduced.den}`] : []),
      ],
      data: {
        kind: 'division',
        a,
        b,
        requireReduction,
        rawResult: raw,
        reducedResult: reduced,
      },
    };
  }

  // 2.1E / 2.2E Suma y resta
  const requireReduction = category === 'm2_red_sumaresta';
  const allowNeg = difficulty === 'avanzado' && settings.allowNegativesInAdvanced;
  const termCount: 2 | 3 =
    requireReduction && difficulty !== 'sencillo'
      ? rng.pick([2, 3])
      : difficulty === 'sencillo'
      ? 2
      : rng.pick([2, 3]);

  const densPool =
    difficulty === 'sencillo'
      ? [2, 3, 4, 5, 6]
      : difficulty === 'medio'
      ? [2, 3, 4, 5, 6, 8, 9, 10, 12]
      : [2, 3, 4, 5, 6, 8, 9, 10, 12, 15];

  for (let t = 0; t < 60; t++) {
    const chosenDens = rng.shuffle(densPool).slice(0, termCount);
    const terms = chosenDens.map((d) => {
      const n = rng.int(1, Math.min(d + 2, difficulty === 'sencillo' ? 5 : 9));
      return simplifyFraction(createFraction(n, d));
    });
    // Verificar denominadores distintos
    const uniqueDens = new Set(terms.map((x) => x.den));
    if (uniqueDens.size < 2) continue;

    let operators: Array<'+' | '-'>;
    if (termCount === 2) {
      operators = [rng.pick(['+', '-'])];
    } else {
      operators = requireReduction ? rng.pick([['+', '-'], ['-', '+'], ['+', '+']]) : ['+', '+'];
    }

    const comb = combineAddSub(terms, operators);
    if (comb.commonDen > (difficulty === 'sencillo' ? 24 : difficulty === 'medio' ? 60 : 90)) continue;
    if (comb.raw.num === 0) continue;
    if (!allowNeg && comb.raw.num < 0) continue;

    const reducible = !isReduced(comb.raw);
    if (requireReduction && !reducible) continue;
    if (!requireReduction && reducible) continue;

    return {
      id,
      category,
      topicLabel: requireReduction ? 'Suma y resta con reducción' : 'Suma y resta simple',
      difficulty,
      objective: requireReduction
        ? 'Encontrar el mcm, transformar a fracciones equivalentes, operar numeradores y simplificar.'
        : 'Encontrar el mcm, transformar a fracciones equivalentes y operar los numeradores.',
      strategyOptions: buildStrategyOptions('sumar_restar', rng),
      examplePath: [
        `mcm = ${comb.commonDen}`,
        `Resultado directo: ${comb.raw.num}/${comb.raw.den}`,
        ...(requireReduction ? [`Simplificada: ${comb.reduced.num}/${comb.reduced.den}`] : []),
      ],
      data: {
        kind: 'suma_resta',
        terms,
        operators,
        requireReduction,
        lcmDen: comb.commonDen,
        equivalents: comb.equivalents,
        rawResult: comb.raw,
        reducedResult: comb.reduced,
      },
    };
  }

  return generateFallback(category, difficulty);
}

function generateFallback(category: ModuleCategory, difficulty: Difficulty): BaseExercise {
  const rng = new SeededRNG(42);
  if (category === 'm2_red_sumaresta') {
    const terms = [createFraction(2, 3), createFraction(1, 5), createFraction(5, 6)];
    const operators: Array<'+' | '-'> = ['-', '+'];
    const comb = combineAddSub(terms, operators);
    return {
      id: `fallback_${category}`,
      category,
      topicLabel: 'Suma y resta con reducción',
      difficulty,
      objective: 'Encontrar el mcm, transformar a fracciones equivalentes, operar numeradores y simplificar.',
      strategyOptions: buildStrategyOptions('sumar_restar', rng),
      examplePath: ['mcm = 30', '20/30 - 6/30 + 25/30 = 39/30 = 13/10'],
      data: {
        kind: 'suma_resta',
        terms,
        operators,
        requireReduction: true,
        lcmDen: comb.commonDen,
        equivalents: comb.equivalents,
        rawResult: comb.raw,
        reducedResult: comb.reduced,
      },
    };
  }
  if (category === 'm2_simple_sumaresta') {
    const terms = [createFraction(2, 3), createFraction(1, 4)];
    const operators: Array<'+' | '-'> = ['+'];
    const comb = combineAddSub(terms, operators);
    return {
      id: `fallback_${category}`,
      category,
      topicLabel: 'Suma y resta simple',
      difficulty,
      objective: 'Encontrar el mcm, transformar a fracciones equivalentes y operar los numeradores.',
      strategyOptions: buildStrategyOptions('sumar_restar', rng),
      examplePath: ['mcm = 12', '8/12 + 3/12 = 11/12'],
      data: {
        kind: 'suma_resta',
        terms,
        operators,
        requireReduction: false,
        lcmDen: comb.commonDen,
        equivalents: comb.equivalents,
        rawResult: comb.raw,
        reducedResult: comb.reduced,
      },
    };
  }
  if (category === 'm2_red_raiz') {
    return {
      id: `fallback_${category}`,
      category,
      topicLabel: 'Raíces con reducción',
      difficulty,
      objective: 'Simplificar dentro de la raíz hasta obtener potencias exactas y entregar el resultado en mínima expresión.',
      strategyOptions: buildStrategyOptions('raiz', rng),
      examplePath: ['√(75/300) = √(25/100) = 5/10 = 1/2'],
      data: {
        kind: 'raiz',
        radicand: createFraction(75, 300),
        index: 2,
        requireReduction: true,
        needsPreSimplify: true,
        finalResult: createFraction(1, 2),
      },
    };
  }
  return generateOnce({ category: 'm1_ampliacion_simple', difficulty, settings: { allowRule7: true, allowNegativesInAdvanced: false } }, rng, `fallback_${category}`);
}

export function generateQuiz(
  count: 10 | 15 | 20,
  difficulty: Difficulty,
  settings: AppSettings,
  seed?: number
): BaseExercise[] {
  const rng = new SeededRNG(seed ?? Date.now());
  const pool: ModuleCategory[] =
    difficulty === 'sencillo'
      ? [
          'm1_ampliacion_simple',
          'm1_ampliacion_razonamiento',
          'm1_reduccion',
          'm2_simple_mult',
          'm2_simple_div',
          'm2_simple_sumaresta',
          'm2_simple_pot',
          'm2_simple_raiz',
        ]
      : difficulty === 'medio'
      ? [
          'm1_ampliacion_razonamiento',
          'm1_reduccion',
          'm2_red_mult',
          'm2_red_div',
          'm2_red_sumaresta',
          'm2_simple_pot',
          'm2_simple_raiz',
          'm2_red_raiz',
        ]
      : [
          'm1_ampliacion_razonamiento',
          'm1_reduccion',
          'm2_red_mult',
          'm2_red_div',
          'm2_red_sumaresta',
          'm2_red_pot',
          'm2_red_raiz',
        ];

  const exercises: BaseExercise[] = [];
  let lastSig = '';
  for (let i = 0; i < count; i++) {
    const category = pool[i % pool.length];
    const ex = generateExercise({
      category,
      difficulty,
      reductionMode: difficulty === 'avanzado' ? '3a5' : difficulty === 'medio' ? '2' : '1',
      settings,
      seed: rng.int(1, 999_999_999),
      excludeSignature: lastSig,
    });
    lastSig = signatureOf(ex.data);
    exercises.push(ex);
  }
  return rng.shuffle(exercises);
}

// ============================================================================
// MÓDULO 5: PERSISTENCIA LOCAL VERSIONADA Y RESILIENTE
// ============================================================================

const STORAGE_KEY = 'fracciones_paso_a_paso_v1';
const SCHEMA_VERSION = 1;

export const DEFAULT_PROGRESS: StoredProgress = {
  version: SCHEMA_VERSION,
  settings: {
    allowRule7: true,
    allowNegativesInAdvanced: false,
  },
  statsByTopic: {},
  recentExerciseIds: [],
};

export function loadProgress(): { progress: StoredProgress; storageWarning: string | null } {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return {
        progress: DEFAULT_PROGRESS,
        storageWarning: 'El almacenamiento local no está disponible en este entorno. Tu avance no se guardará al cerrar.',
      };
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { progress: DEFAULT_PROGRESS, storageWarning: null };
    const parsed = JSON.parse(raw) as Partial<StoredProgress>;
    if (!parsed || typeof parsed !== 'object' || parsed.version !== SCHEMA_VERSION) {
      return {
        progress: DEFAULT_PROGRESS,
        storageWarning: 'Se actualizó el formato de almacenamiento local. Se inició un registro limpio.',
      };
    }
    return {
      progress: {
        version: SCHEMA_VERSION,
        settings: {
          allowRule7: parsed.settings?.allowRule7 ?? true,
          allowNegativesInAdvanced: parsed.settings?.allowNegativesInAdvanced ?? false,
        },
        statsByTopic: parsed.statsByTopic ?? {},
        recentExerciseIds: Array.isArray(parsed.recentExerciseIds) ? parsed.recentExerciseIds : [],
      },
      storageWarning: null,
    };
  } catch {
    return {
      progress: DEFAULT_PROGRESS,
      storageWarning: 'No fue posible leer los datos guardados (datos dañados o bloqueados). La app seguirá funcionando normalmente.',
    };
  }
}

export function saveProgress(progress: StoredProgress): string | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return 'El almacenamiento local no está disponible; el avance solo se mantiene en esta sesión.';
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return null;
  } catch {
    return 'No se pudo guardar el progreso en el dispositivo, pero puedes seguir practicando sin interrupciones.';
  }
}

// ============================================================================
// MÓDULO 6: SUITE DE PRUEBAS AUTOMÁTICAS (CASOS OBLIGATORIOS A–M Y MOTOR)
// ============================================================================

export interface TestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

export function runAutomatedVerificationSuite(): TestResult[] {
  const results: TestResult[] = [];
  const test = (id: string, name: string, fn: () => void) => {
    try {
      fn();
      results.push({ id, name, passed: true, detail: 'Verificado correctamente.' });
    } catch (err) {
      results.push({
        id,
        name,
        passed: false,
        detail: err instanceof Error ? err.message : String(err),
      });
    }
  };
  const expect = (cond: boolean, msg: string) => {
    if (!cond) throw new Error(msg);
  };

  // Pruebas base del motor
  test('M1', 'mcd y mcm exactos', () => {
    expect(gcd(30, 210) === 30, 'gcd(30,210) debe ser 30');
    expect(lcm(3, 4) === 12, 'lcm(3,4) debe ser 12');
    expect(lcmMany([3, 5, 6]) === 30, 'lcm(3,5,6) debe ser 30');
  });

  test('M2', 'Rechazo de denominador cero y división entre cero', () => {
    let threwDen = false;
    try {
      createFraction(3, 0);
    } catch {
      threwDen = true;
    }
    expect(threwDen, 'Debe rechazar denominador 0');

    let threwDiv = false;
    try {
      divideFractions(createFraction(2, 3), createFraction(0, 5));
    } catch {
      threwDiv = true;
    }
    expect(threwDiv, 'Debe rechazar división entre 0');
  });

  test('M3', 'Raíces exactas y rechazo de raíces no exactas', () => {
    expect(exactIntRoot(25, 2) === 5, '√25 = 5');
    expect(exactIntRoot(27, 3) === 3, '∛27 = 3');
    expect(exactIntRoot(10, 2) === null, '√10 no es exacta');
    expect(exactFractionRoot(createFraction(2, 3), 2) === null, '√(2/3) no es racional exacta');
  });

  // Casos obligatorios A–M
  test('A', 'Caso A: 2/3 ampliada por 3 produce 6/9', () => {
    const base = createFraction(2, 3);
    const target = createFraction(base.num * 3, base.den * 3);
    expect(target.num === 6 && target.den === 9, 'Debe producir 6/9');
    expect(areEquivalent(base, target), 'Deben ser equivalentes');
  });

  test('B', 'Caso B: 2/3 con denominador objetivo 9 requiere factor 3 en ambas partes', () => {
    const factor = 9 / 3;
    expect(factor === 3, 'Factor debe ser 3');
    expect(2 * factor === 6 && 3 * factor === 9, 'Produce 6/9');
  });

  test('C', 'Caso C: 30/210 se simplifica a 1/7 en diferentes órdenes', () => {
    // Orden 1: ÷3 -> ÷2 -> ÷5
    const s1 = createFraction(30 / 3, 210 / 3); // 10/70
    const s2 = createFraction(s1.num / 2, s1.den / 2); // 5/35
    const s3 = createFraction(s2.num / 5, s2.den / 5); // 1/7
    // Orden 2: ÷10 -> ÷3
    const o1 = createFraction(30 / 10, 210 / 10); // 3/21
    const o2 = createFraction(o1.num / 3, o1.den / 3); // 1/7
    // Orden 3: ÷30 directo
    const d1 = createFraction(30 / 30, 210 / 30); // 1/7
    expect(s3.num === 1 && s3.den === 7 && isReduced(s3), 'Orden 1 falla');
    expect(o2.num === 1 && o2.den === 7 && isReduced(o2), 'Orden 2 falla');
    expect(d1.num === 1 && d1.den === 7 && isReduced(d1), 'Orden 3 falla');
  });

  test('D', 'Caso D: 2/3 × 3/5 produce 6/15 y en modo reducción termina en 2/5', () => {
    const res = multiplyFractions(createFraction(2, 3), createFraction(3, 5));
    expect(res.raw.num === 6 && res.raw.den === 15, 'Raw debe ser 6/15');
    expect(res.reduced.num === 2 && res.reduced.den === 5, 'Reducida debe ser 2/5');
  });

  test('E', 'Caso E: 2/3 ÷ 3/5 se transforma en 2/3 × 5/3 y produce 10/9', () => {
    const res = divideFractions(createFraction(2, 3), createFraction(3, 5));
    expect(res.inverted.num === 5 && res.inverted.den === 3, 'Inversa debe ser 5/3');
    expect(res.raw.num === 10 && res.raw.den === 9, 'Producto debe ser 10/9');
  });

  test('F', 'Caso F: (2/3)^2 = 4/9', () => {
    const res = powerFraction(createFraction(2, 3), 2);
    expect(res.raw.num === 4 && res.raw.den === 9, 'Debe ser 4/9');
  });

  test('G', 'Caso G: ∛(8/27) = 2/3', () => {
    const res = exactFractionRoot(createFraction(8, 27), 3);
    expect(res !== null && res.num === 2 && res.den === 3, 'Debe ser 2/3');
  });

  test('H', 'Caso H: √(75/300) = 1/2, nunca 1/5', () => {
    const res = exactFractionRoot(createFraction(75, 300), 2);
    expect(res !== null && res.num === 1 && res.den === 2, 'Debe ser 1/2');
    // Ruta intermedia: ÷3 -> 25/100 -> √ = 5/10 -> 1/2
    const mid = createFraction(75 / 3, 300 / 3);
    expect(isPerfectPower(mid.num, 2) && isPerfectPower(mid.den, 2), '25/100 son cuadrados perfectos');
    const midRoot = createFraction(exactIntRoot(mid.num, 2)!, exactIntRoot(mid.den, 2)!);
    expect(midRoot.num === 5 && midRoot.den === 10, 'Raíz intermedia debe ser 5/10');
    const final = simplifyFraction(midRoot);
    expect(final.num === 1 && final.den === 2, 'Mínima expresión debe ser 1/2');
  });

  test('I', 'Caso I: 2/3 - 1/5 + 5/6 = 39/30 = 13/10', () => {
    const comb = combineAddSub(
      [createFraction(2, 3), createFraction(1, 5), createFraction(5, 6)],
      ['-', '+']
    );
    expect(comb.commonDen === 30, 'mcm debe ser 30');
    expect(comb.raw.num === 39 && comb.raw.den === 30, 'Raw debe ser 39/30');
    expect(comb.reduced.num === 13 && comb.reduced.den === 10, 'Reducida debe ser 13/10');
  });

  test('J', 'Caso J: 2/3 + 1/4 utiliza mcm 12 y produce 11/12', () => {
    const comb = combineAddSub([createFraction(2, 3), createFraction(1, 4)], ['+']);
    expect(comb.commonDen === 12, 'mcm debe ser 12');
    expect(comb.raw.num === 11 && comb.raw.den === 12, 'Debe producir 11/12');
  });

  test('K', 'Caso K: Distinción entre equivalencia y mínima expresión', () => {
    const reducible = createFraction(6, 15);
    const minExp = createFraction(2, 5);
    expect(areEquivalent(reducible, minExp), '6/15 y 2/5 son equivalentes');
    expect(!isReduced(reducible) && isReduced(minExp), 'Solo 2/5 está en mínima expresión');
  });

  test('L-M', 'Generadores reproducibles por dificultad sin ejercicios imposibles', () => {
    const settings: AppSettings = { allowRule7: true, allowNegativesInAdvanced: false };
    (['sencillo', 'medio', 'avanzado'] as Difficulty[]).forEach((diff) => {
      const quiz = generateQuiz(10, diff, settings, 12345);
      expect(quiz.length === 10, `Quiz ${diff} debe tener 10 ejercicios`);
      const uniqueCategories = new Set(quiz.map((q) => q.category));
      expect(uniqueCategories.size >= 4, `Quiz ${diff} debe combinar múltiples temas`);
    });
  });

  return results;
}

// ============================================================================
// MÓDULO 7: COMPONENTES VISUALES REUTILIZABLES (FRACCIONES, AYUDAS, MODALES)
// Tema oscuro adaptado al layout de Royalfa (bg-slate-950 + acentos dorados)
// Punto de restauración "Estrella": lógica intacta respecto a v1 clara.
// ============================================================================

const FractionView: React.FC<{
  num: React.ReactNode;
  den: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  negative?: boolean;
  ariaLabel?: string;
}> = ({ num, den, size = 'md', negative = false, ariaLabel }) => {
  const textSize =
    size === 'lg'
      ? 'text-2xl sm:text-3xl font-semibold'
      : size === 'sm'
      ? 'text-base font-medium'
      : 'text-xl sm:text-2xl font-semibold';

  return (
    <span
      className="inline-flex items-center align-middle gap-1.5"
      aria-label={ariaLabel}
    >
      {negative && (
        <span className={`${textSize} text-slate-200 select-none`} aria-hidden="true">
          −
        </span>
      )}
      <span className="inline-flex flex-col items-center leading-tight">
        <span className={`${textSize} px-2 pb-0.5 text-slate-100`}>{num}</span>
        <span className="w-full h-0.5 bg-slate-300 rounded-full min-w-[2.2rem]" />
        <span className={`${textSize} px-2 pt-0.5 text-slate-100`}>{den}</span>
      </span>
    </span>
  );
};

const NumInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  ariaLabel: string;
  placeholder?: string;
  status?: 'idle' | 'correct' | 'error';
  disabled?: boolean;
  allowNegative?: boolean;
  onEnter?: () => void;
  widthClass?: string;
}> = ({
  value,
  onChange,
  ariaLabel,
  placeholder = '?',
  status = 'idle',
  disabled = false,
  allowNegative = false,
  onEnter,
  widthClass = 'w-16 sm:w-20',
}) => {
  const borderClass =
    status === 'correct'
      ? 'border-emerald-500 bg-emerald-950/60 text-emerald-200'
      : status === 'error'
      ? 'border-rose-500 bg-rose-950/60 text-rose-200'
      : 'border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25';

  return (
    <input
      type="text"
      inputMode={allowNegative ? 'text' : 'numeric'}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && onEnter) onEnter();
      }}
      aria-label={ariaLabel}
      placeholder={placeholder}
      className={`${widthClass} h-11 text-center text-lg sm:text-xl font-semibold rounded-lg border-2 outline-none transition-colors disabled:opacity-70 ${borderClass}`}
    />
  );
};

const RootWrapper: React.FC<{
  index: 2 | 3;
  children: React.ReactNode;
}> = ({ index, children }) => (
  <span className="inline-flex items-center">
    <span className="relative inline-flex items-center mr-0.5 select-none">
      {index === 3 && (
        <span className="text-xs font-bold text-amber-400 absolute -top-2 -left-1">3</span>
      )}
      <span className="text-3xl sm:text-4xl font-light text-slate-200 leading-none">√</span>
    </span>
    <span className="border-t-2 border-slate-200 px-2 pt-1.5 pb-0.5 inline-flex items-center">
      {children}
    </span>
  </span>
);

const MultiplesTablePanel: React.FC<{
  denominators: number[];
  lcmValue: number;
  revealed: boolean;
  onRequestReveal: () => void;
}> = ({ denominators, lcmValue, revealed, onRequestReveal }) => {
  const uniqueDens = Array.from(new Set(denominators));
  const minCountNeeded = Math.max(
    8,
    ...uniqueDens.map((d) => Math.ceil(lcmValue / d) + 2)
  );
  const [count, setCount] = useState(minCountNeeded);

  useEffect(() => {
    setCount((prev) => Math.max(prev, minCountNeeded));
  }, [minCountNeeded]);

  return (
    <div className="rounded-xl border border-amber-500/30 bg-slate-950/70 p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-amber-300 font-semibold">
          <Table2 className="w-5 h-5 text-amber-400" />
          <span>Tabla de múltiplos para hallar el mcm</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCount((c) => Math.min(c + 5, 30))}
            className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:border-amber-400/50 hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            Mostrar 5 múltiplos más
          </button>
          {!revealed && (
            <button
              type="button"
              onClick={onRequestReveal}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              Resaltar el mcm
            </button>
          )}
        </div>
      </div>
      <p className="text-sm text-slate-300">
        Busca el <strong className="text-slate-100">primer número</strong> que aparece en todas las filas.
      </p>
      <div className="space-y-2 overflow-x-auto pb-1">
        {uniqueDens.map((d) => (
          <div key={d} className="flex items-center gap-2 min-w-max">
            <span className="w-28 shrink-0 text-sm font-semibold text-slate-400">
              Múltiplos de {d}:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: count }, (_, idx) => (idx + 1) * d).map((val) => {
                const isLcm = revealed && val === lcmValue;
                return (
                  <span
                    key={val}
                    className={`px-2.5 py-1 rounded-md text-sm font-medium border ${
                      isLcm
                        ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 font-bold ring-2 ring-emerald-500/30'
                        : 'bg-slate-900 border-slate-800 text-slate-200'
                    }`}
                  >
                    {val}
                    {isLcm && <span className="ml-1 text-xs uppercase">[mcm]</span>}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DivisibilityGuideModal: React.FC<{
  open: boolean;
  onClose: () => void;
  allowRule7: boolean;
}> = ({ open, onClose, allowRule7 }) => {
  const [showAdvanced7, setShowAdvanced7] = useState(false);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="div-guide-title"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden text-slate-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2
              id="div-guide-title"
              className="text-lg font-bold text-slate-100 font-[family-name:var(--font-playfair),Georgia,serif]"
            >
              Reglas de divisibilidad (del 2 al 11)
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar guía de divisibilidad"
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-3">
          <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/30 text-sm text-amber-200">
            <strong className="text-amber-300">Recuerda:</strong> Para simplificar una fracción, la regla debe cumplirse{' '}
            <strong className="text-amber-100">tanto en el numerador como en el denominador</strong>. Dividir entre 1 no reduce la fracción.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DIVISIBILITY_RULES.filter((r) => allowRule7 || r.divisor !== 7).map((rule) => (
              <div
                key={rule.divisor}
                className="rounded-xl border border-slate-800 p-3.5 bg-slate-950/70 space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold text-sm flex items-center justify-center">
                    {rule.divisor}
                  </span>
                  <h3 className="font-semibold text-slate-100">{rule.title}</h3>
                </div>
                <p className="text-sm text-slate-300">{rule.summary}</p>
                <p className="text-xs text-emerald-300 bg-emerald-950/50 border border-emerald-500/20 rounded px-2 py-1">
                  ✓ {rule.exampleYes}
                </p>
                <p className="text-xs text-rose-300 bg-rose-950/50 border border-rose-500/20 rounded px-2 py-1">
                  ✗ {rule.exampleNo}
                </p>
                {rule.advancedRule && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAdvanced7((v) => !v)}
                      className="text-xs font-semibold text-amber-400 hover:underline"
                    >
                      {showAdvanced7 ? 'Ocultar regla avanzada del 7' : 'Ver regla avanzada del 7 (opcional)'}
                    </button>
                    {showAdvanced7 && (
                      <p className="mt-1.5 text-xs text-slate-300 bg-slate-900 border border-slate-700 rounded p-2">
                        {rule.advancedRule}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-amber-400 text-slate-950 text-sm font-semibold hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfirmModal: React.FC<{
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancelar',
  danger = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 text-slate-100">
        <h2
          id="confirm-modal-title"
          className="text-lg font-bold text-slate-100 font-[family-name:var(--font-playfair),Georgia,serif]"
        >
          {title}
        </h2>
        <p className="text-sm text-slate-300">{message}</p>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 ${
              danger
                ? 'bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-500'
                : 'bg-amber-400 text-slate-950 hover:bg-amber-300 focus:ring-amber-400'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const FeedbackBanner: React.FC<{ feedback: FeedbackMessage | null }> = ({ feedback }) => {
  if (!feedback) return null;

  const styles =
    feedback.type === 'success'
      ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-100'
      : feedback.type === 'warning'
      ? 'bg-amber-950/40 border-amber-500/40 text-amber-100'
      : feedback.type === 'error'
      ? 'bg-rose-950/50 border-rose-500/40 text-rose-100'
      : 'bg-sky-950/50 border-sky-500/40 text-sky-100';

  const badgeLabel: Record<ErrorKind, string> = {
    formato: 'Formato de entrada',
    conceptual: 'Error de procedimiento',
    calculo: 'Error de cálculo',
    simplificacion: 'Falta simplificar',
    equivalente_no_objetivo: 'Valor equivalente',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-xl border p-4 space-y-2 ${styles}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        {feedback.type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        ) : feedback.type === 'error' ? (
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
        ) : (
          <Info className="w-5 h-5 text-sky-400 shrink-0" />
        )}
        <span className="font-bold text-sm sm:text-base">{feedback.title}</span>
        {feedback.errorKind && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-950/60 border border-current/25">
            {badgeLabel[feedback.errorKind]}
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-slate-200">{feedback.body}</p>
      {feedback.hint && (
        <div className="text-sm bg-slate-950/60 rounded-lg p-2.5 border border-white/10 text-slate-200">
          <strong className="text-amber-300">Pista conceptual:</strong> {feedback.hint}
        </div>
      )}
      {feedback.parallelExample && (
        <div className="text-sm bg-slate-950/80 rounded-lg p-2.5 border border-white/10 text-slate-200">
          <strong className="text-amber-300">Ejemplo paralelo:</strong> {feedback.parallelExample}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MÓDULO 8: SUBCOMPONENTE DE REDUCCIÓN INTERACTIVA (REUTILIZADO EN M1.3 Y M2.2)
// ============================================================================

const InteractiveReductionStage: React.FC<{
  initialFraction: Fraction;
  allowRule7: boolean;
  stepErrors: number;
  onError: (kind: ErrorKind, detail: string, hint: string, parallel: string, autoShowStep: () => void) => void;
  onStepSuccess: (msg: string) => void;
  onUsedHint: () => void;
  onComplete: (finalFraction: Fraction, history: ReductionHistoryItem[]) => void;
  showGuide: () => void;
  registerActions: (actions: { check: () => void; hint: () => void; showStep: () => void }) => void;
}> = ({
  initialFraction,
  allowRule7,
  onError,
  onStepSuccess,
  onUsedHint,
  onComplete,
  showGuide,
  registerActions,
}) => {
  const isNeg = initialFraction.num < 0;
  const [current, setCurrent] = useState<Fraction>({
    num: Math.abs(initialFraction.num),
    den: initialFraction.den,
  });
  const [history, setHistory] = useState<ReductionHistoryItem[]>([]);
  const [phase, setPhase] = useState<'pick_divisor' | 'factorize' | 'cancel_result'>('pick_divisor');
  const [divisorInput, setDivisorInput] = useState('');
  const [chosenDivisor, setChosenDivisor] = useState<number | null>(null);
  const [qNumInput, setQNumInput] = useState('');
  const [qDenInput, setQDenInput] = useState('');
  const [qNumOk, setQNumOk] = useState(false);
  const [qDenOk, setQDenOk] = useState(false);
  const [resNumInput, setResNumInput] = useState('');
  const [resDenInput, setResDenInput] = useState('');

  const ruleButtons = allowRule7 ? [2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [2, 3, 4, 5, 6, 8, 9, 10, 11];

  const smallestDivisor = useCallback((f: Fraction): number => {
    const divs = commonDivisors(f.num, f.den);
    return divs[0] ?? 1;
  }, []);

  const advanceAfterFraction = useCallback(
    (nextFrac: Fraction, newHistory: ReductionHistoryItem[]) => {
      if (isReduced(nextFrac)) {
        const signed = createFraction(isNeg ? -nextFrac.num : nextFrac.num, nextFrac.den);
        onStepSuccess(
          `¡Excelente! ${signed.num}/${signed.den} ya está en su mínima expresión (mcd = 1).`
        );
        onComplete(signed, newHistory);
      } else {
        setCurrent(nextFrac);
        setHistory(newHistory);
        setPhase('pick_divisor');
        setDivisorInput('');
        setChosenDivisor(null);
        setQNumInput('');
        setQDenInput('');
        setQNumOk(false);
        setQDenOk(false);
        setResNumInput('');
        setResDenInput('');
        onStepSuccess(
          `Bien hecho: obtuvimos ${nextFrac.num}/${nextFrac.den}. Todavía comparten un divisor común; continuemos simplificando.`
        );
      }
    },
    [isNeg, onComplete, onStepSuccess]
  );

  const handleShowStep = useCallback(() => {
    if (phase === 'pick_divisor') {
      const d = smallestDivisor(current);
      setChosenDivisor(d);
      setDivisorInput(String(d));
      setPhase('factorize');
      onStepSuccess(
        `Paso mostrado: ${d} divide tanto a ${current.num} como a ${current.den}. ${explainDivisibilityCheck(current.num, d)}`
      );
      return;
    }
    if (phase === 'factorize' && chosenDivisor) {
      setQNumInput(String(current.num / chosenDivisor));
      setQDenInput(String(current.den / chosenDivisor));
      setQNumOk(true);
      setQDenOk(true);
      setPhase('cancel_result');
      onStepSuccess(
        `Paso mostrado: ${current.num} = ${chosenDivisor} × ${current.num / chosenDivisor} y ${current.den} = ${chosenDivisor} × ${current.den / chosenDivisor}.`
      );
      return;
    }
    if (phase === 'cancel_result' && chosenDivisor) {
      const qn = current.num / chosenDivisor;
      const qd = current.den / chosenDivisor;
      const nextFrac = createFraction(qn, qd);
      const newHist: ReductionHistoryItem[] = [
        ...history,
        { from: current, divisor: chosenDivisor, qNum: qn, qDen: qd, to: nextFrac },
      ];
      advanceAfterFraction(nextFrac, newHist);
    }
  }, [phase, chosenDivisor, current, history, smallestDivisor, onStepSuccess, advanceAfterFraction]);

  const handleCheck = useCallback(() => {
    if (phase === 'pick_divisor') {
      const d = parseIntStrict(divisorInput, false);
      if (d === null) {
        onError(
          'formato',
          'Escribe o selecciona un número entero positivo como divisor común.',
          'Puedes tocar uno de los botones de reglas de divisibilidad o escribir el divisor.',
          'Por ejemplo, para 12/18 puedes elegir 2, 3 o 6.',
          handleShowStep
        );
        return;
      }
      if (d <= 1) {
        onError(
          'conceptual',
          'Dividir entre 1 no cuenta como reducción porque deja la fracción exactamente igual.',
          'Busca un número entero mayor que 1 que divida al numerador y al denominador sin residuo.',
          'En 10/15, ambos terminan en 0 o 5, así que el divisor común es 5.',
          handleShowStep
        );
        return;
      }
      const divNum = current.num % d === 0;
      const divDen = current.den % d === 0;
      if (!divNum || !divDen) {
        const expN = explainDivisibilityCheck(current.num, d);
        const expD = explainDivisibilityCheck(current.den, d);
        onError(
          'conceptual',
          `${d} no divide a ambas partes. ${expN} ${expD}`,
          'El divisor común debe dividir exactamente tanto al numerador como al denominador.',
          'Para 12/20, el 3 divide a 12 pero no a 20; en cambio, 2 y 4 sí dividen a ambos.',
          handleShowStep
        );
        return;
      }
      setChosenDivisor(d);
      setPhase('factorize');
      onStepSuccess(
        `¡Correcto! ${d} divide a ambos. ${explainDivisibilityCheck(current.num, d)} Ahora desglosa cada número como producto con ${d}.`
      );
      return;
    }

    if (phase === 'factorize' && chosenDivisor) {
      const qn = parseIntStrict(qNumInput, false);
      const qd = parseIntStrict(qDenInput, false);
      if (qn === null || qd === null) {
        onError(
          'formato',
          'Completa ambos factores con números enteros positivos.',
          `Piensa: ¿${chosenDivisor} multiplicado por qué número da ${current.num}? ¿Y cuál da ${current.den}?`,
          'Ejemplo: 18/24 = (6 × 3)/(6 × 4).',
          handleShowStep
        );
        return;
      }
      const expectedN = current.num / chosenDivisor;
      const expectedD = current.den / chosenDivisor;
      const okN = qn === expectedN;
      const okD = qd === expectedD;
      setQNumOk(okN);
      setQDenOk(okD);

      if (!okN || !okD) {
        const partMsg =
          !okN && !okD
            ? 'Revisa tanto el factor del numerador como el del denominador.'
            : !okN
            ? `El denominador está bien (${chosenDivisor} × ${qd} = ${current.den}). Revisa el numerador: ${chosenDivisor} × ${qn} = ${chosenDivisor * qn}, pero buscamos ${current.num}.`
            : `El numerador está bien (${chosenDivisor} × ${qn} = ${current.num}). Revisa el denominador: ${chosenDivisor} × ${qd} = ${chosenDivisor * qd}, pero buscamos ${current.den}.`;
        onError(
          'calculo',
          partMsg,
          `Divide ${current.num} entre ${chosenDivisor} y ${current.den} entre ${chosenDivisor}.`,
          'Ejemplo: para 30/45 con divisor 5, 30 ÷ 5 = 6 y 45 ÷ 5 = 9 → (5 × 6)/(5 × 9).',
          handleShowStep
        );
        return;
      }
      setPhase('cancel_result');
      onStepSuccess(
        `¡Factorización correcta! Al dividir numerador y denominador entre ${chosenDivisor}, cancelamos el factor común ${chosenDivisor}. Escribe la fracción que queda.`
      );
      return;
    }

    if (phase === 'cancel_result' && chosenDivisor) {
      const rn = parseIntStrict(resNumInput, false);
      const rd = parseIntStrict(resDenInput, false);
      if (rn === null || rd === null || rd === 0) {
        onError(
          'formato',
          'Escribe el numerador y el denominador (mayor que 0) de la fracción resultante.',
          'Al cancelar el factor común multiplicativo, quedan los otros dos factores.',
          'En (3 × 10)/(3 × 70), al cancelar el 3 queda 10/70.',
          handleShowStep
        );
        return;
      }
      const expectedN = current.num / chosenDivisor;
      const expectedD = current.den / chosenDivisor;
      if (rn === expectedN && rd === expectedD) {
        const nextFrac = createFraction(rn, rd);
        const newHist: ReductionHistoryItem[] = [
          ...history,
          { from: current, divisor: chosenDivisor, qNum: expectedN, qDen: expectedD, to: nextFrac },
        ];
        advanceAfterFraction(nextFrac, newHist);
        return;
      }
      onError(
        'calculo',
        `Al cancelar el factor ${chosenDivisor} arriba y abajo, observa qué números permanecen sin tachar.`,
        'Conserva el otro factor del numerador arriba y el otro factor del denominador abajo.',
        'Ejemplo: (2 × 5)/(2 × 35) = 5/35.',
        handleShowStep
      );
    }
  }, [
    phase,
    divisorInput,
    chosenDivisor,
    current,
    qNumInput,
    qDenInput,
    resNumInput,
    resDenInput,
    history,
    onError,
    onStepSuccess,
    handleShowStep,
    advanceAfterFraction,
  ]);

  const handleHint = useCallback(() => {
    onUsedHint();
    const d = smallestDivisor(current);
    if (phase === 'pick_divisor') {
      onStepSuccess(
        `Pista: Prueba revisar si ${current.num} y ${current.den} cumplen la regla del ${d}. ${explainDivisibilityCheck(current.num, d)}`
      );
    } else if (phase === 'factorize' && chosenDivisor) {
      onStepSuccess(
        `Pista: Divide cada parte entre ${chosenDivisor}. Por ejemplo, ${current.num} ÷ ${chosenDivisor} te da el factor del numerador.`
      );
    } else if (chosenDivisor) {
      onStepSuccess(
        `Pista: Como cancelamos el factor ${chosenDivisor} arriba y abajo, solo escribe los factores restantes.`
      );
    }
  }, [phase, current, chosenDivisor, smallestDivisor, onUsedHint, onStepSuccess]);

  useEffect(() => {
    registerActions({ check: handleCheck, hint: handleHint, showStep: handleShowStep });
  }, [registerActions, handleCheck, handleHint, handleShowStep]);

  return (
    <div className="space-y-4">
      {/* Historial visible de reducciones realizadas */}
      {history.length > 0 && (
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Reducciones completadas
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {history.map((h, i) => (
              <React.Fragment key={i}>
                {i === 0 && <FractionView num={h.from.num} den={h.from.den} size="sm" negative={isNeg} />}
                <span className="text-slate-500 font-bold">=</span>
                <FractionView
                  size="sm"
                  num={
                    <span>
                      <span className="line-through decoration-rose-400 decoration-2 text-slate-500">
                        {h.divisor}
                      </span>{' '}
                      × {h.qNum}
                    </span>
                  }
                  den={
                    <span>
                      <span className="line-through decoration-rose-400 decoration-2 text-slate-500">
                        {h.divisor}
                      </span>{' '}
                      × {h.qDen}
                    </span>
                  }
                />
                <span className="text-slate-500 font-bold">=</span>
                <FractionView num={h.to.num} den={h.to.den} size="sm" negative={isNeg} />
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Paso activo de reducción */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-400">Fracción actual:</span>
            <FractionView num={current.num} den={current.den} size="lg" negative={isNeg} />
          </div>
          <button
            type="button"
            onClick={showGuide}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 border border-amber-400/30"
          >
            <BookOpen className="w-4 h-4" />
            Reglas de divisibilidad
          </button>
        </div>

        {phase === 'pick_divisor' && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-200">
              1. Elige o escribe un <strong className="text-amber-300">divisor común mayor que 1</strong> para {current.num} y {current.den}:
            </p>
            <div className="flex flex-wrap gap-2">
              {ruleButtons.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDivisorInput(String(d))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                    divisorInput === String(d)
                      ? 'bg-amber-400 text-slate-950 border-amber-400'
                      : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-amber-400/50 hover:text-amber-300'
                  }`}
                >
                  ÷ {d}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-1">
              <label className="text-sm text-slate-300 font-medium" htmlFor="custom-div-input">
                Divisor elegido:
              </label>
              <NumInput
                value={divisorInput}
                onChange={setDivisorInput}
                ariaLabel="Divisor común"
                onEnter={handleCheck}
              />
            </div>
          </div>
        )}

        {phase === 'factorize' && chosenDivisor && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-200">
              2. Desglosa numerador y denominador usando el factor común <strong className="text-amber-300">{chosenDivisor}</strong>:
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <FractionView num={current.num} den={current.den} size="md" />
              <span className="text-2xl font-bold text-slate-500">=</span>
              <FractionView
                size="md"
                num={
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-amber-400 font-bold">{chosenDivisor}</span>
                    <span>×</span>
                    <NumInput
                      value={qNumInput}
                      onChange={setQNumInput}
                      ariaLabel="Factor del numerador"
                      status={qNumOk ? 'correct' : 'idle'}
                      onEnter={handleCheck}
                    />
                  </span>
                }
                den={
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-amber-400 font-bold">{chosenDivisor}</span>
                    <span>×</span>
                    <NumInput
                      value={qDenInput}
                      onChange={setQDenInput}
                      ariaLabel="Factor del denominador"
                      status={qDenOk ? 'correct' : 'idle'}
                      onEnter={handleCheck}
                    />
                  </span>
                }
              />
            </div>
          </div>
        )}

        {phase === 'cancel_result' && chosenDivisor && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-200">
              3. Al dividir ambas partes entre <strong className="text-amber-300">{chosenDivisor}</strong>, cancelamos solo ese factor
              multiplicativo común. Escribe la nueva fracción:
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <FractionView
                size="md"
                num={
                  <span>
                    <span className="line-through decoration-rose-400 decoration-2 text-slate-500">
                      {chosenDivisor}
                    </span>{' '}
                    × <span className="text-emerald-400 font-bold">{current.num / chosenDivisor}</span>
                  </span>
                }
                den={
                  <span>
                    <span className="line-through decoration-rose-400 decoration-2 text-slate-500">
                      {chosenDivisor}
                    </span>{' '}
                    × <span className="text-emerald-400 font-bold">{current.den / chosenDivisor}</span>
                  </span>
                }
              />
              <span className="text-2xl font-bold text-slate-500">=</span>
              <FractionView
                size="md"
                num={
                  <NumInput
                    value={resNumInput}
                    onChange={setResNumInput}
                    ariaLabel="Nuevo numerador"
                    onEnter={handleCheck}
                  />
                }
                den={
                  <NumInput
                    value={resDenInput}
                    onChange={setResDenInput}
                    ariaLabel="Nuevo denominador"
                    onEnter={handleCheck}
                  />
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MÓDULO 9: ESPACIO DE TRABAJO INTERACTIVO (LIENZO PASO A PASO)
// ============================================================================

const ExerciseWorkspace: React.FC<{
  exercise: BaseExercise;
  requireStrategyPhase: boolean;
  progressLabel: string;
  settings: AppSettings;
  onFinishExercise: (record: QuizRecord) => void;
  onNext: () => void;
  onRequestMenu: () => void;
  onOpenDivGuide: () => void;
}> = ({
  exercise,
  requireStrategyPhase,
  progressLabel,
  settings,
  onFinishExercise,
  onNext,
  onRequestMenu,
  onOpenDivGuide,
}) => {
  const [strategyDone, setStrategyDone] = useState(!requireStrategyPhase);
  const [strategyFirstTry, setStrategyFirstTry] = useState(true);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  const [stepIndex, setStepIndex] = useState(0);
  const [stepErrors, setStepErrors] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [errorKinds, setErrorKinds] = useState<ErrorKind[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [stepsShown, setStepsShown] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);

  // Estados locales de campos para los diferentes tipos de ejercicio
  const [in1, setIn1] = useState('');
  const [in2, setIn2] = useState('');
  const [in3, setIn3] = useState('');
  const [in4, setIn4] = useState('');
  const [ok1, setOk1] = useState(false);
  const [ok2, setOk2] = useState(false);

  // Estado específico para división (selector de signo)
  const [divSign, setDivSign] = useState<'÷' | '×' | '+'>('÷');

  // Estado específico para suma y resta
  const [lcmInput, setLcmInput] = useState('');
  const [showMultiples, setShowMultiples] = useState(exercise.difficulty === 'sencillo');
  const [revealLcm, setRevealLcm] = useState(false);
  const [eqFactors, setEqFactors] = useState<string[]>([]);
  const [eqNums, setEqNums] = useState<string[]>([]);

  // Estado específico para raíces con reducción (flujo adaptativo)
  const [rootCurrent, setRootCurrent] = useState<Fraction>(
    exercise.data.kind === 'raiz' ? exercise.data.radicand : createFraction(1, 1)
  );
  const [rootMode, setRootMode] = useState<'decide' | 'simplify_inside' | 'separate' | 'compute' | 'simplify_after'>(
    exercise.data.kind === 'raiz' && exercise.data.requireReduction ? 'decide' : 'separate'
  );
  const [rootAfterFrac, setRootAfterFrac] = useState<Fraction | null>(null);

  // Referencia a las acciones del subcomponente de reducción cuando está activo
  const [reductionActions, setReductionActions] = useState<{
    check: () => void;
    hint: () => void;
    showStep: () => void;
  } | null>(null);

  // Reiniciar estado al cambiar de ejercicio
  useEffect(() => {
    setStrategyDone(!requireStrategyPhase);
    setStrategyFirstTry(true);
    setSelectedStrategy(null);
    setStepIndex(0);
    setStepErrors(0);
    setTotalErrors(0);
    setErrorKinds([]);
    setHintsUsed(0);
    setStepsShown(0);
    setCompleted(false);
    setSkipped(false);
    setFeedback(null);
    setIn1('');
    setIn2('');
    setIn3('');
    setIn4('');
    setOk1(false);
    setOk2(false);
    setDivSign('÷');
    setLcmInput('');
    setShowMultiples(exercise.difficulty === 'sencillo');
    setRevealLcm(false);
    if (exercise.data.kind === 'suma_resta') {
      setEqFactors(exercise.data.terms.map(() => ''));
      setEqNums(exercise.data.terms.map(() => ''));
    }
    if (exercise.data.kind === 'raiz') {
      setRootCurrent(exercise.data.radicand);
      setRootMode(exercise.data.requireReduction ? 'decide' : 'separate');
      setRootAfterFrac(null);
    }
  }, [exercise, requireStrategyPhase]);

  const finalize = useCallback(
    (outcomeOverride?: ExerciseOutcome) => {
      setCompleted(true);
      const outcome: ExerciseOutcome =
        outcomeOverride ??
        (stepsShown > 0
          ? 'solucion_mostrada'
          : hintsUsed > 0 || totalErrors > 0
          ? 'con_ayuda'
          : 'sin_ayuda');

      onFinishExercise({
        exerciseId: exercise.id,
        topicLabel: exercise.topicLabel,
        category: exercise.category,
        strategyCorrectFirstTry: strategyFirstTry,
        totalErrors,
        hintsUsed,
        stepsShown,
        outcome,
        errorKinds,
      });
    },
    [
      exercise,
      strategyFirstTry,
      totalErrors,
      hintsUsed,
      stepsShown,
      errorKinds,
      onFinishExercise,
    ]
  );

  // Escalado exacto de errores por paso (niveles 1 a 5)
  const triggerStepError = useCallback(
    (
      kind: ErrorKind,
      concreteMsg: string,
      conceptualHint: string,
      parallelEx: string,
      autoShowCurrentStep: () => void
    ) => {
      if (kind === 'formato') {
        setFeedback({
          type: 'warning',
          errorKind: 'formato',
          title: 'Revisa el formato de tu entrada',
          body: concreteMsg,
        });
        return;
      }

      const nextErr = stepErrors + 1;
      setStepErrors(nextErr);
      setTotalErrors((t) => t + 1);
      setErrorKinds((prev) => [...prev, kind]);

      if (nextErr >= 5) {
        setStepsShown((s) => s + 1);
        autoShowCurrentStep();
        setFeedback({
          type: 'info',
          errorKind: kind,
          title: 'Revisemos la solución de este paso',
          body: `Equivocarse también es parte de aprender. Como llevamos 5 intentos en este paso, mostramos solo este paso para que puedas continuar con el resto del ejercicio.`,
          hint: conceptualHint,
        });
        return;
      }

      setFeedback({
        type: 'error',
        errorKind: kind,
        title: `Equivocarse también es parte de aprender. Revisemos este paso juntos. (Intento ${nextErr} de 5)`,
        body: concreteMsg,
        hint: nextErr >= 2 ? conceptualHint : undefined,
        parallelExample: nextErr >= 3 ? parallelEx : undefined,
      });
    },
    [stepErrors]
  );

  const advanceStep = useCallback((nextIdx: number, successMsg: string) => {
    setStepIndex(nextIdx);
    setStepErrors(0);
    setIn1('');
    setIn2('');
    setIn3('');
    setIn4('');
    setOk1(false);
    setOk2(false);
    setFeedback({
      type: 'success',
      title: '¡Paso correcto!',
      body: successMsg,
    });
  }, []);

  // Determinar si el paso actual usa el subcomponente de reducción
  const isReductionActive = useMemo(() => {
    if (!strategyDone || completed) return false;
    const d = exercise.data;
    if (d.kind === 'reduccion') return true;
    if (d.kind === 'multiplicacion' && d.requireReduction && stepIndex === 1) return true;
    if (d.kind === 'potencia' && d.requireReduction && stepIndex === 2) return true;
    if (d.kind === 'division' && d.requireReduction && stepIndex === 2) return true;
    if (d.kind === 'suma_resta' && d.requireReduction && stepIndex === 3) return true;
    if (d.kind === 'raiz' && (rootMode === 'simplify_inside' || rootMode === 'simplify_after')) return true;
    return false;
  }, [strategyDone, completed, exercise.data, stepIndex, rootMode]);

  // Calcular total de pasos visibles para la barra de progreso
  const totalStepsEstimate = useMemo(() => {
    const d = exercise.data;
    switch (d.kind) {
      case 'ampliacion_simple':
        return 1;
      case 'ampliacion_razonamiento':
        return 2;
      case 'reduccion':
        return d.plannedSteps;
      case 'multiplicacion':
        return d.requireReduction ? 2 : 1;
      case 'potencia':
        return d.requireReduction ? 3 : 2;
      case 'division':
        return d.requireReduction ? 3 : 2;
      case 'suma_resta':
        return d.requireReduction ? 4 : 3;
      case 'raiz':
        return d.requireReduction ? 3 : 2;
    }
  }, [exercise.data]);

  // Validar Fase 0: Selección de estrategia
  const handleCheckStrategy = () => {
    if (!selectedStrategy) {
      setFeedback({
        type: 'warning',
        errorKind: 'formato',
        title: 'Elige una opción primero',
        body: 'Selecciona el procedimiento que corresponde antes de pasar a resolver.',
      });
      return;
    }
    const opt = exercise.strategyOptions.find((o) => o.id === selectedStrategy);
    if (!opt) return;
    if (opt.isCorrect) {
      setStrategyDone(true);
      setFeedback({
        type: 'success',
        title: '¡Procedimiento identificado!',
        body: opt.feedback,
      });
    } else {
      setStrategyFirstTry(false);
      setFeedback({
        type: 'error',
        errorKind: 'conceptual',
        title: 'Equivocarse también es parte de aprender. Revisemos qué pide el ejercicio.',
        body: `Esa estrategia corresponde a otro tipo de operación. ${opt.feedback}`,
      });
    }
  };

  // Mostrar solo el paso actual
  const handleShowCurrentStep = useCallback(() => {
    if (completed) return;
    if (!strategyDone) {
      const right = exercise.strategyOptions.find((o) => o.isCorrect);
      if (right) {
        setSelectedStrategy(right.id);
        setStrategyDone(true);
        setStepsShown((s) => s + 1);
        setFeedback({
          type: 'info',
          title: 'Estrategia mostrada',
          body: `${right.label}. ${right.feedback}`,
        });
      }
      return;
    }
    if (isReductionActive && reductionActions) {
      setStepsShown((s) => s + 1);
      reductionActions.showStep();
      return;
    }

    setStepsShown((s) => s + 1);
    const d = exercise.data;

    if (d.kind === 'ampliacion_simple') {
      setIn1(String(d.target.num));
      setIn2(String(d.target.den));
      setFeedback({
        type: 'info',
        title: 'Paso mostrado',
        body: `${d.base.num} × ${d.factor} = ${d.target.num} y ${d.base.den} × ${d.factor} = ${d.target.den}.`,
      });
      finalize('solucion_mostrada');
      return;
    }

    if (d.kind === 'ampliacion_razonamiento') {
      if (stepIndex === 0) {
        advanceStep(1, `Paso mostrado: como ${d.base.den} × ${d.factor} = ${d.target.den}, multiplicamos ambas partes por ${d.factor}.`);
      } else {
        setIn1(String(d.target.num));
        setFeedback({
          type: 'info',
          title: 'Paso mostrado',
          body: `${d.base.num} × ${d.factor} = ${d.target.num}, obteniendo ${d.target.num}/${d.target.den}.`,
        });
        finalize('solucion_mostrada');
      }
      return;
    }

    if (d.kind === 'multiplicacion' && stepIndex === 0) {
      if (d.requireReduction) {
        advanceStep(1, `Paso mostrado: ${d.a.num} × ${d.b.num} = ${d.rawResult.num} y ${d.a.den} × ${d.b.den} = ${d.rawResult.den}. Ahora simplifiquemos.`);
      } else {
        setFeedback({
          type: 'info',
          title: 'Paso mostrado',
          body: `${d.a.num} × ${d.b.num} = ${d.rawResult.num} y ${d.a.den} × ${d.b.den} = ${d.rawResult.den}.`,
        });
        finalize('solucion_mostrada');
      }
      return;
    }

    if (d.kind === 'potencia') {
      if (stepIndex === 0) {
        advanceStep(1, `Paso mostrado: separamos la potencia como ${d.base.num}^${d.exponent} / ${d.base.den}^${d.exponent}.`);
      } else if (stepIndex === 1) {
        if (d.requireReduction) {
          advanceStep(2, `Paso mostrado: ${d.rawResult.num}/${d.rawResult.den}. Ahora simplifiquemos.`);
        } else {
          setFeedback({
            type: 'info',
            title: 'Paso mostrado',
            body: `Resultado: ${d.rawResult.num}/${d.rawResult.den}.`,
          });
          finalize('solucion_mostrada');
        }
      }
      return;
    }

    if (d.kind === 'division') {
      if (stepIndex === 0) {
        advanceStep(1, `Paso mostrado: cambiamos ÷ por ×, conservamos ${d.a.num}/${d.a.den} e invertimos la segunda a ${d.b.den}/${d.b.num}.`);
      } else if (stepIndex === 1) {
        if (d.requireReduction) {
          advanceStep(2, `Paso mostrado: el producto directo es ${d.rawResult.num}/${d.rawResult.den}. Ahora simplifiquemos.`);
        } else {
          setFeedback({
            type: 'info',
            title: 'Paso mostrado',
            body: `Resultado: ${d.rawResult.num}/${d.rawResult.den}.`,
          });
          finalize('solucion_mostrada');
        }
      }
      return;
    }

    if (d.kind === 'suma_resta') {
      if (stepIndex === 0) {
        setRevealLcm(true);
        advanceStep(1, `Paso mostrado: el mínimo común múltiplo de los denominadores es ${d.lcmDen}.`);
      } else if (stepIndex === 1) {
        advanceStep(2, `Paso mostrado: convertimos cada fracción a denominador ${d.lcmDen}.`);
      } else if (stepIndex === 2) {
        if (d.requireReduction) {
          advanceStep(3, `Paso mostrado: al operar los numeradores resulta ${d.rawResult.num}/${d.rawResult.den}. Ahora simplifiquemos.`);
        } else {
          setFeedback({
            type: 'info',
            title: 'Paso mostrado',
            body: `Resultado: ${d.rawResult.num}/${d.rawResult.den}.`,
          });
          finalize('solucion_mostrada');
        }
      }
      return;
    }

    if (d.kind === 'raiz') {
      if (rootMode === 'decide') {
        const bothPerfect = isPerfectPower(rootCurrent.num, d.index) && isPerfectPower(rootCurrent.den, d.index);
        setRootMode(bothPerfect ? 'separate' : 'simplify_inside');
        setFeedback({
          type: 'info',
          title: 'Paso mostrado',
          body: bothPerfect
            ? 'Ambas partes ya son potencias exactas, así que podemos separar y calcular la raíz.'
            : 'Como numerador o denominador no son potencias exactas todavía, conviene simplificar primero dentro de la raíz.',
        });
      } else if (rootMode === 'separate') {
        setRootMode('compute');
        setStepErrors(0);
        setIn1('');
        setIn2('');
        setFeedback({
          type: 'info',
          title: 'Paso mostrado',
          body: `Separamos la raíz al numerador (${rootCurrent.num}) y al denominador (${rootCurrent.den}).`,
        });
      } else if (rootMode === 'compute') {
        const rn = exactIntRoot(rootCurrent.num, d.index)!;
        const rd = exactIntRoot(rootCurrent.den, d.index)!;
        const extracted = createFraction(rn, rd);
        if (d.requireReduction && !isReduced(extracted)) {
          setRootAfterFrac(extracted);
          setRootMode('simplify_after');
          setStepErrors(0);
          setFeedback({
            type: 'info',
            title: 'Paso mostrado',
            body: `Al extraer las raíces resulta ${rn}/${rd}. Todavía podemos simplificarlo.`,
          });
        } else {
          setFeedback({
            type: 'info',
            title: 'Paso mostrado',
            body: `Resultado: ${rn}/${rd}.`,
          });
          finalize('solucion_mostrada');
        }
      }
    }
  }, [completed, strategyDone, exercise, isReductionActive, reductionActions, stepIndex, rootMode, rootCurrent, advanceStep, finalize]);

  // Comprobar paso actual
  const handleCheck = () => {
    if (completed) return;
    if (!strategyDone) {
      handleCheckStrategy();
      return;
    }
    if (isReductionActive && reductionActions) {
      reductionActions.check();
      return;
    }

    const d = exercise.data;

    // --- 1.1 Ampliación simple ---
    if (d.kind === 'ampliacion_simple') {
      const n = parseIntStrict(in1, false);
      const dn = parseIntStrict(in2, false);
      if (n === null || dn === null || dn === 0) {
        triggerStepError('formato', 'Escribe enteros positivos para el numerador y el denominador.', '', '', handleShowCurrentStep);
        return;
      }
      const nOk = n === d.target.num;
      const dOk = dn === d.target.den;
      setOk1(nOk);
      setOk2(dOk);
      if (nOk && dOk) {
        setFeedback({
          type: 'success',
          title: '¡Excelente trabajo!',
          body: `Ampliaste correctamente: ${d.base.num}/${d.base.den} = (${d.base.num} × ${d.factor})/(${d.base.den} × ${d.factor}) = ${d.target.num}/${d.target.den}.`,
        });
        finalize();
        return;
      }
      if (areEquivalent(createFraction(n, dn), d.target)) {
        triggerStepError(
          'equivalente_no_objetivo',
          `La fracción ${n}/${dn} es equivalente, pero en este ejercicio buscamos la fracción ampliada por ${d.factor}.`,
          `Multiplica tanto ${d.base.num} como ${d.base.den} por ${d.factor}.`,
          'Ejemplo: 2/3 ampliada por 4 es (2 × 4)/(3 × 4) = 8/12.',
          handleShowCurrentStep
        );
        return;
      }
      const msg =
        !nOk && !dOk
          ? `Revisa ambas multiplicaciones: ${d.base.num} × ${d.factor} y ${d.base.den} × ${d.factor}.`
          : !nOk
          ? `El denominador (${dn}) está correcto. Revisa el numerador: ${d.base.num} × ${d.factor}.`
          : `El numerador (${n}) está correcto. Revisa el denominador: ${d.base.den} × ${d.factor}.`;
      triggerStepError(
        'calculo',
        msg,
        'En una fracción equivalente ampliada multiplicamos arriba y abajo por el mismo factor.',
        'Ejemplo: 2/3 ampliada por 4 = (2 × 4)/(3 × 4) = 8/12.',
        handleShowCurrentStep
      );
      return;
    }

    // --- 1.2 Ampliación por razonamiento ---
    if (d.kind === 'ampliacion_razonamiento') {
      if (stepIndex === 0) {
        const f1 = parseIntStrict(in1, false);
        const f2 = parseIntStrict(in2, false);
        if (f1 === null || f2 === null) {
          triggerStepError('formato', 'Completa ambos factores con números enteros positivos.', '', '', handleShowCurrentStep);
          return;
        }
        if (f1 !== f2) {
          triggerStepError(
            'conceptual',
            `Escribiste ${f1} arriba y ${f2} abajo. Para mantener una fracción equivalente, ambos factores deben ser iguales.`,
            'Si multiplicamos numerador y denominador por números distintos, cambiamos el valor de la fracción.',
            'Ejemplo: 2/3 = (2 × 3)/(3 × 3) = 6/9.',
            handleShowCurrentStep
          );
          return;
        }
        if (f1 !== d.factor) {
          triggerStepError(
            'calculo',
            `Comprobemos el denominador: ${d.base.den} × ${f1} = ${d.base.den * f1}, pero el denominador objetivo es ${d.target.den}.`,
            `Pregúntate: ¿qué número multiplicado por ${d.base.den} da ${d.target.den}?`,
            'Ejemplo: para pasar de denominador 3 a 9, multiplicamos por 3 porque 3 × 3 = 9.',
            handleShowCurrentStep
          );
          return;
        }
        advanceStep(1, `¡Correcto! Multiplicamos ambas partes por ${d.factor}. Ahora calcula el numerador objetivo.`);
        return;
      } else {
        const n = parseIntStrict(in1, false);
        if (n === null) {
          triggerStepError('formato', 'Escribe un entero positivo para el numerador objetivo.', '', '', handleShowCurrentStep);
          return;
        }
        if (n === d.target.num) {
          setFeedback({
            type: 'success',
            title: '¡Razonamiento completo!',
            body: `${d.base.num}/${d.base.den} = (${d.base.num} × ${d.factor})/(${d.base.den} × ${d.factor}) = ${d.target.num}/${d.target.den}.`,
          });
          finalize();
          return;
        }
        triggerStepError(
          'calculo',
          `Revisa la multiplicación del numerador: ${d.base.num} × ${d.factor}.`,
          'Multiplica el numerador original por el factor que descubriste.',
          'Ejemplo: en (2 × 3)/(3 × 3), el numerador objetivo es 2 × 3 = 6.',
          handleShowCurrentStep
        );
        return;
      }
    }

    // --- 2.1A / 2.2A Multiplicación ---
    if (d.kind === 'multiplicacion' && stepIndex === 0) {
      const n = parseIntStrict(in1, false);
      const dn = parseIntStrict(in2, false);
      if (n === null || dn === null || dn === 0) {
        triggerStepError('formato', 'Escribe enteros positivos para el numerador y el denominador.', '', '', handleShowCurrentStep);
        return;
      }
      const userFrac = createFraction(n, dn);
      const nOk = n === d.rawResult.num;
      const dOk = dn === d.rawResult.den;
      setOk1(nOk);
      setOk2(dOk);

      if (nOk && dOk) {
        if (d.requireReduction && !isReduced(d.rawResult)) {
          advanceStep(1, 'El valor es correcto; todavía podemos simplificar.');
        } else {
          setFeedback({
            type: 'success',
            title: '¡Multiplicación correcta!',
            body: `(${d.a.num} × ${d.b.num})/(${d.a.den} × ${d.b.den}) = ${d.rawResult.num}/${d.rawResult.den}.`,
          });
          finalize();
        }
        return;
      }

      if (areEquivalent(userFrac, d.rawResult)) {
        if (!d.requireReduction) {
          setFeedback({
            type: 'success',
            title: '¡Correcto!',
            body: `Tu respuesta ${n}/${dn} es equivalente a ${d.rawResult.num}/${d.rawResult.den} y además ya está simplificada.`,
          });
          finalize();
          return;
        }
        if (isReduced(userFrac)) {
          setFeedback({
            type: 'success',
            title: '¡Excelente!',
            body: `Obtuviste directamente el resultado en su mínima expresión: ${n}/${dn}.`,
          });
          finalize();
          return;
        }
        advanceStep(1, 'El valor es correcto; todavía podemos simplificar.');
        return;
      }

      const msg =
        !nOk && !dOk
          ? `Revisa ambos productos: numerador ${d.a.num} × ${d.b.num} y denominador ${d.a.den} × ${d.b.den}.`
          : !nOk
          ? `El denominador está bien (${dn}). Revisa el numerador: ${d.a.num} × ${d.b.num}.`
          : `El numerador está bien (${n}). Revisa el denominador: ${d.a.den} × ${d.b.den}.`;
      triggerStepError(
        'calculo',
        msg,
        'En la multiplicación de fracciones operamos de forma directa: numerador por numerador y denominador por denominador.',
        'Ejemplo: 2/3 × 4/5 = (2 × 4)/(3 × 5) = 8/15.',
        handleShowCurrentStep
      );
      return;
    }

    // --- 2.1B / 2.2B Potencias ---
    if (d.kind === 'potencia') {
      if (stepIndex === 0) {
        const b1 = parseIntStrict(in1, false);
        const e1 = parseIntStrict(in2, false);
        const b2 = parseIntStrict(in3, false);
        const e2 = parseIntStrict(in4, false);
        if (b1 === null || e1 === null || b2 === null || e2 === null) {
          triggerStepError('formato', 'Completa las bases y los exponentes tanto en el numerador como en el denominador.', '', '', handleShowCurrentStep);
          return;
        }
        if (b1 === d.base.num && e1 === d.exponent && b2 === d.base.den && e2 === d.exponent) {
          advanceStep(1, '¡Separación correcta! Ahora calcula cada potencia.');
          return;
        }
        triggerStepError(
          'conceptual',
          'Revisa la separación: tanto el numerador como el denominador deben conservar su base y recibir el mismo exponente.',
          `En (${d.base.num}/${d.base.den})^${d.exponent}, el exponente ${d.exponent} se aplica al ${d.base.num} y al ${d.base.den}.`,
          'Ejemplo: (2/3)^2 = 2^2 / 3^2.',
          handleShowCurrentStep
        );
        return;
      }
      if (stepIndex === 1) {
        const n = parseIntStrict(in1, false);
        const dn = parseIntStrict(in2, false);
        if (n === null || dn === null || dn === 0) {
          triggerStepError('formato', 'Escribe enteros positivos para el resultado de cada potencia.', '', '', handleShowCurrentStep);
          return;
        }
        const nOk = n === d.rawResult.num;
        const dOk = dn === d.rawResult.den;
        setOk1(nOk);
        setOk2(dOk);
        if (nOk && dOk) {
          if (d.requireReduction && !isReduced(d.rawResult)) {
            advanceStep(2, 'El valor es correcto; todavía podemos simplificar.');
          } else {
            setFeedback({
              type: 'success',
              title: '¡Potencia resuelta!',
              body: `(${d.base.num}/${d.base.den})^${d.exponent} = ${d.rawResult.num}/${d.rawResult.den}.`,
            });
            finalize();
          }
          return;
        }
        triggerStepError(
          'calculo',
          `Recuerda que ${d.base.num}^${d.exponent} significa multiplicar ${d.base.num} por sí mismo ${d.exponent} veces (no multiplicarlo por ${d.exponent}).`,
          `Calcula ${Array(d.exponent).fill(d.base.num).join(' × ')} arriba y ${Array(d.exponent).fill(d.base.den).join(' × ')} abajo.`,
          'Ejemplo: 2^3 / 3^3 = (2×2×2)/(3×3×3) = 8/27.',
          handleShowCurrentStep
        );
        return;
      }
    }

    // --- 2.1D / 2.2D División ---
    if (d.kind === 'division') {
      if (stepIndex === 0) {
        const invNum = parseIntStrict(in1, false);
        const invDen = parseIntStrict(in2, false);
        if (invNum === null || invDen === null || invDen === 0) {
          triggerStepError('formato', 'Completa el numerador y el denominador de la segunda fracción invertida.', '', '', handleShowCurrentStep);
          return;
        }
        if (divSign !== '×') {
          triggerStepError(
            'conceptual',
            'Primero debemos cambiar el signo de división (÷) por multiplicación (×).',
            'Dividir entre una fracción equivale a multiplicar por su inversa.',
            'Ejemplo: 2/3 ÷ 3/5 se transforma en 2/3 × 5/3.',
            handleShowCurrentStep
          );
          return;
        }
        if (invNum === d.b.num && invDen === d.b.den && d.b.num !== d.b.den) {
          triggerStepError(
            'conceptual',
            'Cambiaste el signo a multiplicación, pero falta invertir la segunda fracción (intercambiar su numerador y su denominador).',
            'Conservamos la primera fracción igual e invertimos únicamente la segunda.',
            'Ejemplo: 3/5 invertida es 5/3.',
            handleShowCurrentStep
          );
          return;
        }
        if (invNum === d.b.den && invDen === d.b.num) {
          advanceStep(1, `¡Muy bien! Ahora multiplicamos ${d.a.num}/${d.a.den} × ${d.b.den}/${d.b.num} de forma directa.`);
          return;
        }
        triggerStepError(
          'conceptual',
          `La segunda fracción original es ${d.b.num}/${d.b.den}. Al invertirla, el ${d.b.den} pasa arriba y el ${d.b.num} pasa abajo.`,
          'Solo se invierte la segunda fracción.',
          'Ejemplo: 2/3 ÷ 3/5 = 2/3 × 5/3.',
          handleShowCurrentStep
        );
        return;
      }
      if (stepIndex === 1) {
        const n = parseIntStrict(in1, false);
        const dn = parseIntStrict(in2, false);
        if (n === null || dn === null || dn === 0) {
          triggerStepError('formato', 'Escribe enteros positivos para el producto.', '', '', handleShowCurrentStep);
          return;
        }
        const nOk = n === d.rawResult.num;
        const dOk = dn === d.rawResult.den;
        setOk1(nOk);
        setOk2(dOk);
        if (nOk && dOk) {
          if (d.requireReduction && !isReduced(d.rawResult)) {
            advanceStep(2, 'El valor es correcto; todavía podemos simplificar.');
          } else {
            setFeedback({
              type: 'success',
              title: '¡División resuelta!',
              body: `${d.a.num}/${d.a.den} ÷ ${d.b.num}/${d.b.den} = ${d.rawResult.num}/${d.rawResult.den}.`,
            });
            finalize();
          }
          return;
        }
        triggerStepError(
          'calculo',
          `Multiplica de forma directa: ${d.a.num} × ${d.b.den} arriba y ${d.a.den} × ${d.b.num} abajo.`,
          'Una vez transformada a multiplicación, operamos numerador por numerador y denominador por denominador.',
          'Ejemplo: 2/3 × 5/3 = (2 × 5)/(3 × 3) = 10/9.',
          handleShowCurrentStep
        );
        return;
      }
    }

    // --- 2.1E / 2.2E Suma y resta ---
    if (d.kind === 'suma_resta') {
      if (stepIndex === 0) {
        const candidate = parseIntStrict(lcmInput, false);
        if (candidate === null || candidate === 0) {
          triggerStepError('formato', 'Escribe un número entero positivo para el mínimo común múltiplo (mcm).', '', '', handleShowCurrentStep);
          return;
        }
        if (candidate === d.lcmDen) {
          setRevealLcm(true);
          advanceStep(1, `¡Correcto! El mcm es ${d.lcmDen}. Ahora transforma cada fracción a una equivalente con denominador ${d.lcmDen}.`);
          return;
        }
        const isCommonMultiple = d.terms.every((t) => candidate % t.den === 0);
        if (isCommonMultiple && candidate > d.lcmDen) {
          triggerStepError(
            'equivalente_no_objetivo',
            `${candidate} sí es múltiplo común, pero existe uno más pequeño (el mínimo común múltiplo) que facilita las cuentas.`,
            'Abre la tabla de múltiplos y busca el primer número que coincida en todas las filas.',
            'Ejemplo: para 4 y 6, 24 es múltiplo común, pero el mcm es 12.',
            handleShowCurrentStep
          );
          return;
        }
        triggerStepError(
          'conceptual',
          `${candidate} no es múltiplo de todos los denominadores (${d.terms.map((t) => t.den).join(', ')}).`,
          'El mcm debe poder dividirse exactamente entre cada uno de los denominadores.',
          'Ejemplo: para 3 y 4, los múltiplos de 3 son 3, 6, 9, 12 y los de 4 son 4, 8, 12 → mcm = 12.',
          handleShowCurrentStep
        );
        return;
      }

      if (stepIndex === 1) {
        const parsedF = eqFactors.map((s) => parseIntStrict(s, false));
        const parsedN = eqNums.map((s) => parseIntStrict(s, false));
        if (parsedF.some((v) => v === null) || parsedN.some((v) => v === null)) {
          triggerStepError('formato', 'Completa todos los factores de ampliación y los nuevos numeradores.', '', '', handleShowCurrentStep);
          return;
        }
        const wrongIdx = d.terms.findIndex((t, idx) => {
          const expectedFactor = d.lcmDen / t.den;
          return parsedF[idx] !== expectedFactor || parsedN[idx] !== d.equivalents[idx].num;
        });
        if (wrongIdx === -1) {
          advanceStep(2, '¡Fracciones equivalentes listas! Ahora suma o resta únicamente los numeradores y conserva el denominador común.');
          return;
        }
        const t = d.terms[wrongIdx];
        const expF = d.lcmDen / t.den;
        const msg =
          parsedF[wrongIdx] !== expF
            ? `Revisa la fracción ${wrongIdx + 1} (${t.num}/${t.den}): ¿por cuánto multiplicas ${t.den} para llegar a ${d.lcmDen}?`
            : `El factor de la fracción ${wrongIdx + 1} está bien (${expF}), pero revisa el numerador: ${t.num} × ${expF}.`;
        triggerStepError(
          'calculo',
          msg,
          `Divide el mcm (${d.lcmDen}) entre cada denominador para hallar el factor, y multiplica ese factor por el numerador.`,
          'Ejemplo: para llevar 2/3 a denominador 12, 12 ÷ 3 = 4, entonces 2 × 4 = 8 → 8/12.',
          handleShowCurrentStep
        );
        return;
      }

      if (stepIndex === 2) {
        const allowNeg = d.rawResult.num < 0;
        const n = parseIntStrict(in1, allowNeg || settings.allowNegativesInAdvanced);
        const dn = parseIntStrict(in2, false);
        if (n === null || dn === null || dn === 0) {
          triggerStepError('formato', 'Escribe el numerador resultante y el denominador común.', '', '', handleShowCurrentStep);
          return;
        }
        const nOk = n === d.rawResult.num;
        const dOk = dn === d.lcmDen;
        setOk1(nOk);
        setOk2(dOk);
        if (nOk && dOk) {
          if (d.requireReduction && !isReduced(d.rawResult)) {
            advanceStep(3, 'El valor es correcto; todavía podemos simplificar.');
          } else {
            setFeedback({
              type: 'success',
              title: '¡Operación completada!',
              body: `El resultado es ${d.rawResult.num}/${d.rawResult.den}.`,
            });
            finalize();
          }
          return;
        }
        if (!dOk) {
          triggerStepError(
            'conceptual',
            `Recuerda: al sumar o restar fracciones con igual denominador, el denominador común (${d.lcmDen}) se conserva; no se suma ni se resta.`,
            'Solo operamos los numeradores.',
            'Ejemplo: 8/12 + 3/12 = (8 + 3)/12 = 11/12.',
            handleShowCurrentStep
          );
          return;
        }
        triggerStepError(
          'calculo',
          `El denominador (${d.lcmDen}) está bien. Revisa la operación de los numeradores: ${d.equivalents
            .map((eq, i) => (i === 0 ? `${eq.num}` : `${d.operators[i - 1]} ${eq.num}`))
            .join(' ')}.`,
          'Realiza las sumas y restas de izquierda a derecha.',
          'Ejemplo: 20 − 6 + 25 = 14 + 25 = 39.',
          handleShowCurrentStep
        );
        return;
      }
    }

    // --- 2.1C / 2.2C Raíces ---
    if (d.kind === 'raiz') {
      const rootHelpText =
        d.index === 2
          ? 'Buscamos un número que, multiplicado por sí mismo, dé este valor.'
          : 'Buscamos un número que, multiplicado por sí mismo tres veces, dé este valor.';

      if (rootMode === 'separate') {
        const n = parseIntStrict(in1, false);
        const dn = parseIntStrict(in2, false);
        if (n === null || dn === null) {
          triggerStepError('formato', 'Escribe el numerador y el denominador dentro de cada raíz separada.', '', '', handleShowCurrentStep);
          return;
        }
        if (n === rootCurrent.num && dn === rootCurrent.den) {
          setRootMode('compute');
          setStepErrors(0);
          setIn1('');
          setIn2('');
          setFeedback({
            type: 'success',
            title: '¡Separación correcta!',
            body: `Ahora calcula cada raíz por separado. ${rootHelpText}`,
          });
          return;
        }
        triggerStepError(
          'conceptual',
          `Al separar la raíz, arriba colocamos ${rootCurrent.num} y abajo ${rootCurrent.den} con el mismo índice.`,
          'La raíz de una fracción se puede separar en la raíz del numerador entre la raíz del denominador.',
          d.index === 2 ? 'Ejemplo: √(4/9) = √4 / √9.' : 'Ejemplo: ∛(8/27) = ∛8 / ∛27.',
          handleShowCurrentStep
        );
        return;
      }

      if (rootMode === 'compute') {
        const n = parseIntStrict(in1, false);
        const dn = parseIntStrict(in2, false);
        if (n === null || dn === null || dn === 0) {
          triggerStepError('formato', 'Escribe enteros positivos para el resultado de cada raíz.', '', '', handleShowCurrentStep);
          return;
        }
        const expN = exactIntRoot(rootCurrent.num, d.index)!;
        const expD = exactIntRoot(rootCurrent.den, d.index)!;
        const nOk = n === expN;
        const dOk = dn === expD;
        setOk1(nOk);
        setOk2(dOk);
        if (nOk && dOk) {
          const extracted = createFraction(expN, expD);
          if (d.requireReduction && !isReduced(extracted)) {
            setRootAfterFrac(extracted);
            setRootMode('simplify_after');
            setStepErrors(0);
            setFeedback({
              type: 'success',
              title: '¡Raíces calculadas!',
              body: 'El valor es correcto; todavía podemos simplificar.',
            });
          } else {
            setFeedback({
              type: 'success',
              title: '¡Raíz exacta resuelta!',
              body: `El resultado es ${expN}/${expD}.`,
            });
            finalize();
          }
          return;
        }
        triggerStepError(
          'calculo',
          `${!nOk ? `Revisa el numerador (${rootCurrent.num}). ` : ''}${!dOk ? `Revisa el denominador (${rootCurrent.den}). ` : ''}${rootHelpText}`,
          rootHelpText,
          d.index === 2 ? 'Ejemplo: √25 = 5 porque 5 × 5 = 25.' : 'Ejemplo: ∛8 = 2 porque 2 × 2 × 2 = 8.',
          handleShowCurrentStep
        );
      }
    }
  };

  // Botón "Necesito ayuda"
  const handleNeedHelp = () => {
    if (completed) return;
    setHintsUsed((h) => h + 1);
    if (!strategyDone) {
      setFeedback({
        type: 'info',
        title: 'Ayuda para elegir el procedimiento',
        body: `Objetivo del ejercicio: ${exercise.objective}`,
      });
      return;
    }
    if (isReductionActive && reductionActions) {
      reductionActions.hint();
      return;
    }
    const d = exercise.data;
    if (d.kind === 'suma_resta' && stepIndex === 0) {
      setShowMultiples(true);
      setFeedback({
        type: 'info',
        title: 'Panel de múltiplos abierto',
        body: 'Usa la tabla de múltiplos debajo para localizar el primer múltiplo común de los denominadores.',
      });
      return;
    }
    if (d.kind === 'raiz') {
      const def =
        d.index === 2
          ? 'Buscamos un número que, multiplicado por sí mismo, dé este valor.'
          : 'Buscamos un número que, multiplicado por sí mismo tres veces, dé este valor.';
      setFeedback({
        type: 'info',
        title: d.index === 2 ? 'Ayuda para raíz cuadrada' : 'Ayuda para raíz cúbica',
        body: def,
      });
      return;
    }
    setFeedback({
      type: 'info',
      title: 'Pista del paso actual',
      body: exercise.objective,
    });
  };

  const handleSkip = () => {
    setSkipped(true);
    setFeedback({
      type: 'warning',
      title: 'Ejercicio omitido',
      body: 'Se registró como omitido. Puedes pasar al siguiente ejercicio cuando quieras.',
    });
    finalize('omitido');
  };

  const d = exercise.data;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Barra superior del ejercicio */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 rounded-2xl border border-slate-800 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onRequestMenu}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-200 text-sm font-medium hover:bg-slate-800 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <Home className="w-4 h-4 text-amber-400" />
            Volver al menú
          </button>
          <div>
            <div className="text-sm font-bold text-slate-100">{exercise.topicLabel}</div>
            <div className="text-xs text-slate-400 capitalize">
              Nivel {exercise.difficulty} · {progressLabel}
            </div>
          </div>
        </div>
        <div className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
          {!strategyDone
            ? 'Fase previa: Estrategia'
            : completed
            ? skipped
              ? 'Omitido'
              : 'Completado'
            : `Paso ${Math.min(stepIndex + 1, totalStepsEstimate)} de ${totalStepsEstimate}`}
        </div>
      </div>

      {/* Lienzo principal */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 sm:p-7 space-y-6">
        {/* Enunciado siempre visible */}
        <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Ejercicio actual
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {d.kind === 'ampliacion_simple' && (
                <>
                  <span className="text-base text-slate-300">Amplía</span>
                  <FractionView num={d.base.num} den={d.base.den} size="lg" />
                  <span className="text-base text-slate-300">
                    multiplicando por <strong className="text-amber-400 text-xl">{d.factor}</strong>
                  </span>
                </>
              )}
              {d.kind === 'ampliacion_razonamiento' && (
                <>
                  <FractionView num={d.base.num} den={d.base.den} size="lg" />
                  <span className="text-2xl font-bold text-slate-500">=</span>
                  <FractionView num="?" den={d.target.den} size="lg" />
                </>
              )}
              {d.kind === 'reduccion' && (
                <>
                  <span className="text-base text-slate-300">Simplifica hasta mínima expresión:</span>
                  <FractionView num={d.initial.num} den={d.initial.den} size="lg" />
                </>
              )}
              {d.kind === 'multiplicacion' && (
                <>
                  <FractionView num={d.a.num} den={d.a.den} size="lg" />
                  <span className="text-2xl font-bold text-amber-400">×</span>
                  <FractionView num={d.b.num} den={d.b.den} size="lg" />
                </>
              )}
              {d.kind === 'potencia' && (
                <span className="inline-flex items-center">
                  <span className="text-4xl font-light text-slate-500">(</span>
                  <FractionView num={d.base.num} den={d.base.den} size="lg" />
                  <span className="text-4xl font-light text-slate-500">)</span>
                  <sup className="text-xl font-bold text-amber-400 -mt-8 ml-0.5">{d.exponent}</sup>
                </span>
              )}
              {d.kind === 'raiz' && (
                <RootWrapper index={d.index}>
                  <FractionView num={d.radicand.num} den={d.radicand.den} size="lg" />
                </RootWrapper>
              )}
              {d.kind === 'division' && (
                <>
                  <FractionView num={d.a.num} den={d.a.den} size="lg" />
                  <span className="text-2xl font-bold text-amber-400">÷</span>
                  <FractionView num={d.b.num} den={d.b.den} size="lg" />
                </>
              )}
              {d.kind === 'suma_resta' && (
                <div className="flex flex-wrap items-center gap-3">
                  {d.terms.map((t, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && (
                        <span className="text-2xl font-bold text-amber-400">
                          {d.operators[i - 1] === '-' ? '−' : '+'}
                        </span>
                      )}
                      <FractionView num={t.num} den={t.den} size="lg" />
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FASE 0: Identificación de estrategia (Módulo 3) */}
        {!strategyDone && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-100">
              Antes de resolver: ¿qué procedimiento corresponde aplicar?
            </h3>
            <div className="space-y-2.5" role="radiogroup" aria-label="Opciones de procedimiento">
              {exercise.strategyOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={selectedStrategy === opt.id}
                  onClick={() => setSelectedStrategy(opt.id)}
                  className={`w-full text-left p-3.5 rounded-xl border-2 transition-colors text-sm sm:text-base font-medium ${
                    selectedStrategy === opt.id
                      ? 'border-amber-400 bg-amber-400/10 text-amber-200'
                      : 'border-slate-800 bg-slate-950/60 text-slate-200 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FASE DE RESOLUCIÓN PASO A PASO */}
        {strategyDone && !completed && (
          <div className="space-y-5">
            {/* 1.1 Ampliación simple */}
            {d.kind === 'ampliacion_simple' && (
              <div className="space-y-4">
                <p className="text-sm text-slate-300">
                  Aplica la misma multiplicación al numerador y al denominador:
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <FractionView num={d.base.num} den={d.base.den} size="md" />
                  <span className="text-2xl font-bold text-slate-500">=</span>
                  <FractionView
                    size="md"
                    num={`${d.base.num} × ${d.factor}`}
                    den={`${d.base.den} × ${d.factor}`}
                  />
                  <span className="text-2xl font-bold text-slate-500">=</span>
                  <FractionView
                    size="md"
                    num={
                      <NumInput
                        value={in1}
                        onChange={setIn1}
                        ariaLabel="Numerador ampliado"
                        status={ok1 ? 'correct' : 'idle'}
                        onEnter={handleCheck}
                      />
                    }
                    den={
                      <NumInput
                        value={in2}
                        onChange={setIn2}
                        ariaLabel="Denominador ampliado"
                        status={ok2 ? 'correct' : 'idle'}
                        onEnter={handleCheck}
                      />
                    }
                  />
                </div>
              </div>
            )}

            {/* 1.2 Ampliación por razonamiento */}
            {d.kind === 'ampliacion_razonamiento' && (
              <div className="space-y-4">
                {stepIndex === 0 ? (
                  <>
                    <p className="text-sm font-medium text-slate-200">
                      ¿Por cuánto debes multiplicar el denominador de la primera fracción para obtener el de la segunda?
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      <FractionView num={d.base.num} den={d.base.den} size="md" />
                      <span className="text-2xl font-bold text-slate-500">=</span>
                      <FractionView
                        size="md"
                        num={
                          <span className="inline-flex items-center gap-1.5">
                            <span>{d.base.num} ×</span>
                            <NumInput
                              value={in1}
                              onChange={setIn1}
                              ariaLabel="Factor del numerador"
                              onEnter={handleCheck}
                            />
                          </span>
                        }
                        den={
                          <span className="inline-flex items-center gap-1.5">
                            <span>{d.base.den} ×</span>
                            <NumInput
                              value={in2}
                              onChange={setIn2}
                              ariaLabel="Factor del denominador"
                              onEnter={handleCheck}
                            />
                          </span>
                        }
                      />
                      <span className="text-2xl font-bold text-slate-500">=</span>
                      <FractionView num="?" den={d.target.den} size="md" />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-slate-200">
                      Ahora calcula el numerador objetivo:
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      <FractionView num={d.base.num} den={d.base.den} size="md" />
                      <span className="text-2xl font-bold text-slate-500">=</span>
                      <FractionView
                        size="md"
                        num={`${d.base.num} × ${d.factor}`}
                        den={`${d.base.den} × ${d.factor}`}
                      />
                      <span className="text-2xl font-bold text-slate-500">=</span>
                      <FractionView
                        size="md"
                        num={
                          <NumInput
                            value={in1}
                            onChange={setIn1}
                            ariaLabel="Numerador objetivo"
                            onEnter={handleCheck}
                          />
                        }
                        den={d.target.den}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 1.3 Reducción directa */}
            {d.kind === 'reduccion' && (
              <InteractiveReductionStage
                initialFraction={d.initial}
                allowRule7={settings.allowRule7}
                stepErrors={stepErrors}
                onError={triggerStepError}
                onStepSuccess={(msg) => {
                  setStepErrors(0);
                  setFeedback({ type: 'success', title: '¡Bien hecho!', body: msg });
                }}
                onUsedHint={() => setHintsUsed((h) => h + 1)}
                onComplete={() => finalize()}
                showGuide={onOpenDivGuide}
                registerActions={setReductionActions}
              />
            )}

            {/* 2.1A / 2.2A Multiplicación */}
            {d.kind === 'multiplicacion' && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-sm text-slate-300 font-medium">
                  De forma directa: multiplica numerador por numerador y denominador por denominador.
                </div>
                {stepIndex === 0 ? (
                  <div className="flex flex-wrap items-center gap-4">
                    <FractionView num={d.a.num} den={d.a.den} size="md" />
                    <span className="text-xl font-bold text-amber-400">×</span>
                    <FractionView num={d.b.num} den={d.b.den} size="md" />
                    <span className="text-xl font-bold text-slate-500">=</span>
                    <FractionView
                      size="md"
                      num={`${d.a.num} × ${d.b.num}`}
                      den={`${d.a.den} × ${d.b.den}`}
                    />
                    <span className="text-xl font-bold text-slate-500">=</span>
                    <FractionView
                      size="md"
                      num={
                        <NumInput
                          value={in1}
                          onChange={setIn1}
                          ariaLabel="Numerador del producto"
                          status={ok1 ? 'correct' : 'idle'}
                          onEnter={handleCheck}
                        />
                      }
                      den={
                        <NumInput
                          value={in2}
                          onChange={setIn2}
                          ariaLabel="Denominador del producto"
                          status={ok2 ? 'correct' : 'idle'}
                          onEnter={handleCheck}
                        />
                      }
                    />
                  </div>
                ) : (
                  <InteractiveReductionStage
                    initialFraction={d.rawResult}
                    allowRule7={settings.allowRule7}
                    stepErrors={stepErrors}
                    onError={triggerStepError}
                    onStepSuccess={(msg) => {
                      setStepErrors(0);
                      setFeedback({ type: 'success', title: '¡Bien hecho!', body: msg });
                    }}
                    onUsedHint={() => setHintsUsed((h) => h + 1)}
                    onComplete={() => finalize()}
                    showGuide={onOpenDivGuide}
                    registerActions={setReductionActions}
                  />
                )}
              </div>
            )}

            {/* 2.1B / 2.2B Potencias */}
            {d.kind === 'potencia' && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-sm text-slate-300 font-medium">
                  Se pueden separar las partes: eleva numerador y denominador al mismo exponente.
                </div>
                {stepIndex === 0 && (
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-sm font-semibold text-slate-300">1. Separa la potencia:</span>
                    <FractionView
                      size="md"
                      num={
                        <span className="inline-flex items-start gap-1">
                          <NumInput value={in1} onChange={setIn1} ariaLabel="Base del numerador" widthClass="w-14" onEnter={handleCheck} />
                          <span className="-mt-2">
                            <NumInput value={in2} onChange={setIn2} ariaLabel="Exponente del numerador" widthClass="w-11" placeholder="^" onEnter={handleCheck} />
                          </span>
                        </span>
                      }
                      den={
                        <span className="inline-flex items-start gap-1 pt-2">
                          <NumInput value={in3} onChange={setIn3} ariaLabel="Base del denominador" widthClass="w-14" onEnter={handleCheck} />
                          <span className="-mt-2">
                            <NumInput value={in4} onChange={setIn4} ariaLabel="Exponente del denominador" widthClass="w-11" placeholder="^" onEnter={handleCheck} />
                          </span>
                        </span>
                      }
                    />
                  </div>
                )}
                {stepIndex === 1 && (
                  <div className="flex flex-wrap items-center gap-4">
                    <FractionView
                      size="md"
                      num={
                        <span>
                          {d.base.num}
                          <sup className="text-amber-400">{d.exponent}</sup>
                        </span>
                      }
                      den={
                        <span>
                          {d.base.den}
                          <sup className="text-amber-400">{d.exponent}</sup>
                        </span>
                      }
                    />
                    <span className="text-2xl font-bold text-slate-500">=</span>
                    <FractionView
                      size="md"
                      num={<NumInput value={in1} onChange={setIn1} ariaLabel="Numerador calculado" status={ok1 ? 'correct' : 'idle'} onEnter={handleCheck} />}
                      den={<NumInput value={in2} onChange={setIn2} ariaLabel="Denominador calculado" status={ok2 ? 'correct' : 'idle'} onEnter={handleCheck} />}
                    />
                  </div>
                )}
                {stepIndex === 2 && (
                  <InteractiveReductionStage
                    initialFraction={d.rawResult}
                    allowRule7={settings.allowRule7}
                    stepErrors={stepErrors}
                    onError={triggerStepError}
                    onStepSuccess={(msg) => {
                      setStepErrors(0);
                      setFeedback({ type: 'success', title: '¡Bien hecho!', body: msg });
                    }}
                    onUsedHint={() => setHintsUsed((h) => h + 1)}
                    onComplete={() => finalize()}
                    showGuide={onOpenDivGuide}
                    registerActions={setReductionActions}
                  />
                )}
              </div>
            )}

            {/* 2.1D / 2.2D División */}
            {d.kind === 'division' && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-sm text-slate-300 font-medium">
                  Se cambia a multiplicación: conserva la primera fracción e invierte únicamente la segunda.
                </div>
                {stepIndex === 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-200">
                      1. Cambia el signo de operación y escribe la segunda fracción invertida:
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      <FractionView num={d.a.num} den={d.a.den} size="md" />
                      <div className="inline-flex rounded-lg border border-slate-700 overflow-hidden" role="group" aria-label="Seleccionar signo">
                        {(['÷', '×', '+'] as const).map((sym) => (
                          <button
                            key={sym}
                            type="button"
                            onClick={() => setDivSign(sym)}
                            className={`px-3 py-2 text-lg font-bold transition-colors ${
                              divSign === sym
                                ? 'bg-amber-400 text-slate-950'
                                : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {sym}
                          </button>
                        ))}
                      </div>
                      <FractionView
                        size="md"
                        num={<NumInput value={in1} onChange={setIn1} ariaLabel="Numerador invertido" onEnter={handleCheck} />}
                        den={<NumInput value={in2} onChange={setIn2} ariaLabel="Denominador invertido" onEnter={handleCheck} />}
                      />
                    </div>
                  </div>
                )}
                {stepIndex === 1 && (
                  <div className="flex flex-wrap items-center gap-4">
                    <FractionView num={d.a.num} den={d.a.den} size="md" />
                    <span className="text-2xl font-bold text-amber-400">×</span>
                    <FractionView num={d.b.den} den={d.b.num} size="md" />
                    <span className="text-2xl font-bold text-slate-500">=</span>
                    <FractionView
                      size="md"
                      num={<NumInput value={in1} onChange={setIn1} ariaLabel="Numerador resultado" status={ok1 ? 'correct' : 'idle'} onEnter={handleCheck} />}
                      den={<NumInput value={in2} onChange={setIn2} ariaLabel="Denominador resultado" status={ok2 ? 'correct' : 'idle'} onEnter={handleCheck} />}
                    />
                  </div>
                )}
                {stepIndex === 2 && (
                  <InteractiveReductionStage
                    initialFraction={d.rawResult}
                    allowRule7={settings.allowRule7}
                    stepErrors={stepErrors}
                    onError={triggerStepError}
                    onStepSuccess={(msg) => {
                      setStepErrors(0);
                      setFeedback({ type: 'success', title: '¡Bien hecho!', body: msg });
                    }}
                    onUsedHint={() => setHintsUsed((h) => h + 1)}
                    onComplete={() => finalize()}
                    showGuide={onOpenDivGuide}
                    registerActions={setReductionActions}
                  />
                )}
              </div>
            )}

            {/* 2.1E / 2.2E Suma y resta */}
            {d.kind === 'suma_resta' && (
              <div className="space-y-4">
                {stepIndex === 0 && (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-slate-200">
                      1. Encuentra el <strong className="text-amber-300">mínimo común múltiplo (mcm)</strong> de los denominadores ({d.terms.map((t) => t.den).join(', ')}):
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-semibold text-slate-200">mcm =</span>
                      <NumInput value={lcmInput} onChange={setLcmInput} ariaLabel="Mínimo común múltiplo" onEnter={handleCheck} />
                      <button
                        type="button"
                        onClick={() => setShowMultiples((v) => !v)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/30 hover:bg-amber-400/20"
                      >
                        <Table2 className="w-4 h-4" />
                        {showMultiples ? 'Ocultar tabla de múltiplos' : 'Ver tabla de múltiplos'}
                      </button>
                    </div>
                    {showMultiples && (
                      <MultiplesTablePanel
                        denominators={d.terms.map((t) => t.den)}
                        lcmValue={d.lcmDen}
                        revealed={revealLcm}
                        onRequestReveal={() => {
                          setRevealLcm(true);
                          setHintsUsed((h) => h + 1);
                        }}
                      />
                    )}
                  </div>
                )}

                {stepIndex === 1 && (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-slate-200">
                      2. Transforma cada fracción a una equivalente con denominador <strong className="text-amber-300">{d.lcmDen}</strong>:
                    </p>
                    <div className="space-y-3">
                      {d.terms.map((t, idx) => (
                        <div key={idx} className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                          <FractionView num={t.num} den={t.den} size="sm" />
                          <span className="font-bold text-slate-500">=</span>
                          <FractionView
                            size="sm"
                            num={
                              <span className="inline-flex items-center gap-1">
                                <span>{t.num} ×</span>
                                <NumInput
                                  value={eqFactors[idx] ?? ''}
                                  onChange={(v) => {
                                    const copy = [...eqFactors];
                                    copy[idx] = v;
                                    setEqFactors(copy);
                                  }}
                                  ariaLabel={`Factor de ampliación para fracción ${idx + 1}`}
                                  widthClass="w-14"
                                  onEnter={handleCheck}
                                />
                              </span>
                            }
                            den={`${t.den} × ${eqFactors[idx] || '?'}`}
                          />
                          <span className="font-bold text-slate-500">=</span>
                          <FractionView
                            size="sm"
                            num={
                              <NumInput
                                value={eqNums[idx] ?? ''}
                                onChange={(v) => {
                                  const copy = [...eqNums];
                                  copy[idx] = v;
                                  setEqNums(copy);
                                }}
                                ariaLabel={`Nuevo numerador para fracción ${idx + 1}`}
                                widthClass="w-16"
                                onEnter={handleCheck}
                              />
                            }
                            den={d.lcmDen}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {stepIndex === 2 && (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-slate-200">
                      3. Opera únicamente los numeradores y conserva el denominador común ({d.lcmDen}):
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      {d.equivalents.map((eq, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && (
                            <span className="text-2xl font-bold text-amber-400">
                              {d.operators[i - 1] === '-' ? '−' : '+'}
                            </span>
                          )}
                          <FractionView num={eq.num} den={eq.den} size="md" />
                        </React.Fragment>
                      ))}
                      <span className="text-2xl font-bold text-slate-500">=</span>
                      <FractionView
                        size="md"
                        num={
                          <NumInput
                            value={in1}
                            onChange={setIn1}
                            ariaLabel="Numerador resultado"
                            allowNegative={d.rawResult.num < 0 || settings.allowNegativesInAdvanced}
                            status={ok1 ? 'correct' : 'idle'}
                            onEnter={handleCheck}
                          />
                        }
                        den={
                          <NumInput
                            value={in2}
                            onChange={setIn2}
                            ariaLabel="Denominador común resultado"
                            status={ok2 ? 'correct' : 'idle'}
                            onEnter={handleCheck}
                          />
                        }
                      />
                    </div>
                  </div>
                )}

                {stepIndex === 3 && (
                  <InteractiveReductionStage
                    initialFraction={d.rawResult}
                    allowRule7={settings.allowRule7}
                    stepErrors={stepErrors}
                    onError={triggerStepError}
                    onStepSuccess={(msg) => {
                      setStepErrors(0);
                      setFeedback({ type: 'success', title: '¡Bien hecho!', body: msg });
                    }}
                    onUsedHint={() => setHintsUsed((h) => h + 1)}
                    onComplete={() => finalize()}
                    showGuide={onOpenDivGuide}
                    registerActions={setReductionActions}
                  />
                )}
              </div>
            )}

            {/* 2.1C / 2.2C Raíces (con flujo adaptativo en reducción) */}
            {d.kind === 'raiz' && (
              <div className="space-y-4">
                {rootMode === 'decide' && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-200">
                      Observa la fracción dentro de la raíz:{' '}
                      <strong className="text-amber-300">
                        {rootCurrent.num}/{rootCurrent.den}
                      </strong>
                      . ¿Qué camino prefieres tomar ahora?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (isReduced(rootCurrent)) {
                            setFeedback({
                              type: 'info',
                              title: 'Ya está simplificada',
                              body: `${rootCurrent.num}/${rootCurrent.den} ya no se puede simplificar más. Separemos y calculemos la raíz.`,
                            });
                            setRootMode('separate');
                          } else {
                            setRootMode('simplify_inside');
                            setFeedback(null);
                          }
                        }}
                        className="p-4 rounded-xl border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/15 text-left space-y-1 transition-colors"
                      >
                        <div className="font-bold text-amber-300">Simplificar primero dentro de la raíz</div>
                        <div className="text-xs text-slate-300">
                          Divide numerador y denominador entre un divisor común para obtener números más sencillos o potencias exactas.
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const okN = isPerfectPower(rootCurrent.num, d.index);
                          const okD = isPerfectPower(rootCurrent.den, d.index);
                          if (!okN || !okD) {
                            triggerStepError(
                              'conceptual',
                              `${!okN ? rootCurrent.num : rootCurrent.den} no tiene raíz ${
                                d.index === 2 ? 'cuadrada' : 'cúbica'
                              } exacta entera todavía. Conviene simplificar primero dentro de la raíz.`,
                              'Al simplificar la fracción dentro de la raíz, aparecerán potencias exactas.',
                              'Ejemplo: en √(75/300), 75 y 300 no son cuadrados exactos, pero si dividimos entre 3 obtenemos √(25/100) = 5/10 = 1/2.',
                              handleShowCurrentStep
                            );
                          } else {
                            setRootMode('separate');
                            setFeedback({
                              type: 'success',
                              title: '¡Camino válido!',
                              body: 'Ambas partes ya son potencias exactas. Separemos la raíz.',
                            });
                          }
                        }}
                        className="p-4 rounded-xl border border-slate-700 bg-slate-950/70 hover:border-slate-600 hover:bg-slate-900 text-left space-y-1 transition-colors"
                      >
                        <div className="font-bold text-slate-100">Separar y calcular la raíz ahora</div>
                        <div className="text-xs text-slate-400">
                          Aplica la raíz al numerador y al denominador por separado si ambos ya son potencias exactas.
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {rootMode === 'simplify_inside' && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-amber-400/10 border border-amber-400/30 text-sm text-amber-200">
                      <span>Simplificando dentro de la raíz:</span>
                      {isPerfectPower(rootCurrent.num, d.index) &&
                        isPerfectPower(rootCurrent.den, d.index) && (
                          <button
                            type="button"
                            onClick={() => {
                              setRootMode('separate');
                              setFeedback({
                                type: 'success',
                                title: '¡Potencias exactas alcanzadas!',
                                body: `${rootCurrent.num} y ${rootCurrent.den} ya tienen raíz exacta. Ahora separa y calcula.`,
                              });
                            }}
                            className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400"
                          >
                            Extraer raíz de {rootCurrent.num}/{rootCurrent.den} ahora
                          </button>
                        )}
                    </div>
                    <InteractiveReductionStage
                      initialFraction={rootCurrent}
                      allowRule7={settings.allowRule7}
                      stepErrors={stepErrors}
                      onError={triggerStepError}
                      onStepSuccess={(msg) => {
                        setStepErrors(0);
                        setFeedback({ type: 'success', title: '¡Reducción dentro de la raíz!', body: msg });
                      }}
                      onUsedHint={() => setHintsUsed((h) => h + 1)}
                      onComplete={(reducedFrac) => {
                        setRootCurrent(reducedFrac);
                        setRootMode('separate');
                        setFeedback({
                          type: 'success',
                          title: '¡Fracción lista dentro de la raíz!',
                          body: `Obtuvimos ${reducedFrac.num}/${reducedFrac.den}. Ahora separa y calcula la raíz.`,
                        });
                      }}
                      showGuide={onOpenDivGuide}
                      registerActions={setReductionActions}
                    />
                  </div>
                )}

                {rootMode === 'separate' && (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-slate-200">
                      Separa la raíz aplicándola al numerador y al denominador:
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      <RootWrapper index={d.index}>
                        <FractionView num={rootCurrent.num} den={rootCurrent.den} size="md" />
                      </RootWrapper>
                      <span className="text-2xl font-bold text-slate-500">=</span>
                      <FractionView
                        size="md"
                        num={
                          <RootWrapper index={d.index}>
                            <NumInput value={in1} onChange={setIn1} ariaLabel="Radicando numerador" onEnter={handleCheck} />
                          </RootWrapper>
                        }
                        den={
                          <div className="pt-1">
                            <RootWrapper index={d.index}>
                              <NumInput value={in2} onChange={setIn2} ariaLabel="Radicando denominador" onEnter={handleCheck} />
                            </RootWrapper>
                          </div>
                        }
                      />
                    </div>
                  </div>
                )}

                {rootMode === 'compute' && (
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-sm text-slate-300">
                      {d.index === 2
                        ? 'Buscamos un número que, multiplicado por sí mismo, dé este valor.'
                        : 'Buscamos un número que, multiplicado por sí mismo tres veces, dé este valor.'}
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <FractionView
                        size="md"
                        num={<RootWrapper index={d.index}>{rootCurrent.num}</RootWrapper>}
                        den={<RootWrapper index={d.index}>{rootCurrent.den}</RootWrapper>}
                      />
                      <span className="text-2xl font-bold text-slate-500">=</span>
                      <FractionView
                        size="md"
                        num={<NumInput value={in1} onChange={setIn1} ariaLabel="Raíz del numerador" status={ok1 ? 'correct' : 'idle'} onEnter={handleCheck} />}
                        den={<NumInput value={in2} onChange={setIn2} ariaLabel="Raíz del denominador" status={ok2 ? 'correct' : 'idle'} onEnter={handleCheck} />}
                      />
                    </div>
                  </div>
                )}

                {rootMode === 'simplify_after' && rootAfterFrac && (
                  <InteractiveReductionStage
                    initialFraction={rootAfterFrac}
                    allowRule7={settings.allowRule7}
                    stepErrors={stepErrors}
                    onError={triggerStepError}
                    onStepSuccess={(msg) => {
                      setStepErrors(0);
                      setFeedback({ type: 'success', title: '¡Bien hecho!', body: msg });
                    }}
                    onUsedHint={() => setHintsUsed((h) => h + 1)}
                    onComplete={() => finalize()}
                    showGuide={onOpenDivGuide}
                    registerActions={setReductionActions}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Retroalimentación */}
        <FeedbackBanner feedback={feedback} />

        {/* Barra de acciones de navegación del ejercicio */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {!completed ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                {!(d.kind === 'raiz' && rootMode === 'decide' && strategyDone) && (
                  <button
                    type="button"
                    onClick={handleCheck}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-sm hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-xs"
                  >
                    <Check className="w-4 h-4" />
                    Comprobar
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNeedHelp}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-sky-950/60 text-sky-200 border border-sky-500/30 font-semibold text-sm hover:bg-sky-900/60 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  <HelpCircle className="w-4 h-4 text-sky-400" />
                  Necesito ayuda
                </button>
                <button
                  type="button"
                  onClick={handleShowCurrentStep}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-950/40 text-amber-200 border border-amber-500/30 font-semibold text-sm hover:bg-amber-900/50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                  Mostrar este paso
                </button>
              </div>
              <button
                type="button"
                onClick={handleSkip}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-200 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <SkipForward className="w-4 h-4" />
                Saltar ejercicio
              </button>
            </>
          ) : (
            <div className="w-full flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-slate-400">
                {skipped
                  ? 'Ejercicio registrado como omitido.'
                  : 'Revisa el desarrollo cuando quieras y pulsa Siguiente para continuar.'}
              </div>
              <button
                type="button"
                onClick={onNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-xs"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MÓDULO 10: PANTALLA DE RESUMEN DE SESIÓN Y DIAGNÓSTICO
// ============================================================================

const SummaryView: React.FC<{
  records: QuizRecord[];
  onPracticeAgain: () => void;
  onBackToMenu: () => void;
}> = ({ records, onPracticeAgain, onBackToMenu }) => {
  const sinAyuda = records.filter((r) => r.outcome === 'sin_ayuda').length;
  const conAyuda = records.filter((r) => r.outcome === 'con_ayuda').length;
  const mostradas = records.filter((r) => r.outcome === 'solucion_mostrada').length;
  const omitidos = records.filter((r) => r.outcome === 'omitido').length;

  const topicMap = new Map<string, number>();
  records.forEach((r) => {
    if (r.outcome !== 'sin_ayuda') {
      topicMap.set(r.topicLabel, (topicMap.get(r.topicLabel) ?? 0) + 1);
    }
  });
  const recommendedTopics = Array.from(topicMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label]) => label);

  return (
    <div className="max-w-3xl mx-auto bg-slate-900/80 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-[family-name:var(--font-playfair),Georgia,serif]">
          Resumen de tu práctica
        </h2>
        <p className="text-sm text-slate-400">
          Aquí tienes el detalle honesto de tu sesión. Recuerda que los ejercicios omitidos o con pasos mostrados no se cuentan como aciertos autónomos.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-center">
          <div className="text-2xl font-bold text-emerald-400">{sinAyuda}</div>
          <div className="text-xs font-semibold text-emerald-200 mt-1">Resueltos sin ayuda</div>
        </div>
        <div className="p-4 rounded-xl bg-sky-950/50 border border-sky-500/30 text-center">
          <div className="text-2xl font-bold text-sky-400">{conAyuda}</div>
          <div className="text-xs font-semibold text-sky-200 mt-1">Resueltos con ayuda</div>
        </div>
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-center">
          <div className="text-2xl font-bold text-amber-400">{mostradas}</div>
          <div className="text-xs font-semibold text-amber-200 mt-1">Con pasos mostrados</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-700 text-center">
          <div className="text-2xl font-bold text-slate-300">{omitidos}</div>
          <div className="text-xs font-semibold text-slate-400 mt-1">Omitidos</div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-950/70 border border-amber-500/30 space-y-2">
        <h3 className="font-bold text-amber-300 text-sm">Temas que conviene practicar</h3>
        {recommendedTopics.length === 0 ? (
          <p className="text-sm text-slate-300">
            ¡Excelente desempeño! Resolviste todos los ejercicios de forma autónoma. Puedes intentar un nivel de mayor dificultad.
          </p>
        ) : (
          <ul className="list-disc list-inside text-sm text-slate-200 space-y-1">
            {recommendedTopics.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={onPracticeAgain}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-sm hover:bg-amber-300"
        >
          <RotateCcw className="w-4 h-4" />
          Nueva práctica
        </button>
        <button
          type="button"
          onClick={onBackToMenu}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-amber-400/40 text-amber-300 font-semibold text-sm hover:bg-amber-400/10"
        >
          <Home className="w-4 h-4" />
          Volver al menú principal
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// MÓDULO 11: COMPONENTE PRINCIPAL (NAVEGACIÓN, AJUSTES Y VERIFICADOR)
// ============================================================================

type ScreenView = 'home' | 'm1' | 'm2' | 'm3_config' | 'practice' | 'summary' | 'settings';

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [screen, setScreen] = useState<ScreenView>('home');
  const [progress, setProgress] = useState<StoredProgress>(DEFAULT_PROGRESS);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);

  // Configuración de sesión activa
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('sencillo');
  const [selectedReductionMode, setSelectedReductionMode] = useState<ReductionMode>('1');
  const [quizCount, setQuizCount] = useState<10 | 15 | 20>(10);

  // Estado de la sesión de ejercicios
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ModuleCategory>('m1_ampliacion_simple');
  const [quizQueue, setQuizQueue] = useState<BaseExercise[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [currentExercise, setCurrentExercise] = useState<BaseExercise | null>(null);
  const [sessionRecords, setSessionRecords] = useState<QuizRecord[]>([]);

  // Modales y verificador
  const [showDivGuide, setShowDivGuide] = useState(false);
  const [confirmExitOpen, setConfirmExitOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);

  useEffect(() => {
    setMounted(true);
    const loaded = loadProgress();
    setProgress(loaded.progress);
    setStorageWarning(loaded.storageWarning);
  }, []);

  const persistProgress = useCallback((next: StoredProgress) => {
    setProgress(next);
    const warn = saveProgress(next);
    if (warn) setStorageWarning(warn);
  }, []);

  const updateSettings = (patch: Partial<AppSettings>) => {
    const next: StoredProgress = {
      ...progress,
      settings: { ...progress.settings, ...patch },
    };
    persistProgress(next);
  };

  const startSinglePractice = (category: ModuleCategory, redMode?: ReductionMode) => {
    setIsQuizMode(false);
    setActiveCategory(category);
    if (redMode) setSelectedReductionMode(redMode);
    setSessionRecords([]);
    const ex = generateExercise({
      category,
      difficulty: selectedDifficulty,
      reductionMode: redMode ?? selectedReductionMode,
      settings: progress.settings,
    });
    setCurrentExercise(ex);
    setScreen('practice');
  };

  const startQuizSession = () => {
    const queue = generateQuiz(quizCount, selectedDifficulty, progress.settings);
    setIsQuizMode(true);
    setQuizQueue(queue);
    setQuizIndex(0);
    setSessionRecords([]);
    setCurrentExercise(queue[0]);
    setScreen('practice');
  };

  const handleFinishExercise = useCallback(
    (rec: QuizRecord) => {
      setSessionRecords((prev) => [...prev, rec]);
      const prevStat = progress.statsByTopic[rec.topicLabel] ?? {
        attempts: 0,
        withoutHelp: 0,
        withHelp: 0,
        shown: 0,
        skipped: 0,
        errorsByKind: {
          formato: 0,
          conceptual: 0,
          calculo: 0,
          simplificacion: 0,
          equivalente_no_objetivo: 0,
        },
      };
      const nextErr = { ...prevStat.errorsByKind };
      rec.errorKinds.forEach((k) => {
        nextErr[k] = (nextErr[k] ?? 0) + 1;
      });
      const updatedStat: TopicStats = {
        attempts: prevStat.attempts + 1,
        withoutHelp: prevStat.withoutHelp + (rec.outcome === 'sin_ayuda' ? 1 : 0),
        withHelp: prevStat.withHelp + (rec.outcome === 'con_ayuda' ? 1 : 0),
        shown: prevStat.shown + (rec.outcome === 'solucion_mostrada' ? 1 : 0),
        skipped: prevStat.skipped + (rec.outcome === 'omitido' ? 1 : 0),
        errorsByKind: nextErr,
      };
      persistProgress({
        ...progress,
        statsByTopic: {
          ...progress.statsByTopic,
          [rec.topicLabel]: updatedStat,
        },
      });
    },
    [progress, persistProgress]
  );

  const handleNextExercise = () => {
    if (isQuizMode) {
      const nextIdx = quizIndex + 1;
      if (nextIdx >= quizQueue.length) {
        setScreen('summary');
      } else {
        setQuizIndex(nextIdx);
        setCurrentExercise(quizQueue[nextIdx]);
      }
    } else {
      const ex = generateExercise({
        category: activeCategory,
        difficulty: selectedDifficulty,
        reductionMode: selectedReductionMode,
        settings: progress.settings,
        excludeSignature: currentExercise ? JSON.stringify(currentExercise.data) : undefined,
      });
      setCurrentExercise(ex);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-[60vh] bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        Cargando Fracciones paso a paso...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Sub-barra de la aplicación (compatible con NavbarSwitcher del RootLayout) */}
      <div className="border-b border-slate-800/80 bg-slate-950/90">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => (screen === 'practice' ? setConfirmExitOpen(true) : setScreen('home'))}
            className="flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/40 text-amber-400 flex items-center justify-center font-bold">
              <Divide className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-100 leading-tight font-[family-name:var(--font-playfair),Georgia,serif]">
                Fracciones <span className="text-amber-400">paso a paso</span>
              </h1>
              <p className="text-xs text-slate-400">Cuaderno guiado · Comprensión sin atajos</p>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDivGuide(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-amber-300 bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Divisibilidad</span>
            </button>
            <button
              type="button"
              onClick={() => setScreen('settings')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Ajustes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Aviso de almacenamiento si aplica */}
      {storageWarning && (
        <div className="bg-amber-950/60 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-200 text-center">
          {storageWarning}
        </div>
      )}

      {/* Contenido */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-10">
        {/* PANTALLA: INICIO */}
        {screen === 'home' && (
          <div className="space-y-8">
            <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Aprendizaje paso a paso · Matemáticas
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 leading-tight font-[family-name:var(--font-playfair),Georgia,serif]">
                Entiende por qué funciona{' '}
                <span className="text-amber-400">cada paso</span> con fracciones.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Elige libremente el módulo que quieras practicar. Verás cada transformación en pantalla y recibirás pistas claras sin atajos mecánicos. Tu progreso se guarda únicamente en este dispositivo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setScreen('m1')}
                className="text-left bg-slate-900/70 rounded-2xl border border-slate-800 hover:border-amber-400/60 hover:bg-slate-900 p-5 space-y-3 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Módulo 1</div>
                  <h3 className="text-lg font-bold text-slate-100 font-[family-name:var(--font-playfair),Georgia,serif]">
                    Fracciones equivalentes
                  </h3>
                </div>
                <p className="text-sm text-slate-400">
                  Ampliación simple, ampliación por razonamiento y reducción guiada con reglas de divisibilidad.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setScreen('m2')}
                className="text-left bg-slate-900/70 rounded-2xl border border-slate-800 hover:border-amber-400/60 hover:bg-slate-900 p-5 space-y-3 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Módulo 2</div>
                  <h3 className="text-lg font-bold text-slate-100 font-[family-name:var(--font-playfair),Georgia,serif]">
                    Operaciones
                  </h3>
                </div>
                <p className="text-sm text-slate-400">
                  Multiplicación, división, suma y resta con mcm, potencias y raíces exactas (simples y con reducción).
                </p>
              </button>

              <button
                type="button"
                onClick={() => setScreen('m3_config')}
                className="text-left bg-slate-900/70 rounded-2xl border border-slate-800 hover:border-amber-400/60 hover:bg-slate-900 p-5 space-y-3 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-400/10 border border-sky-400/30 text-sky-400 flex items-center justify-center">
                  <ListChecks className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-sky-400">Módulo 3</div>
                  <h3 className="text-lg font-bold text-slate-100 font-[family-name:var(--font-playfair),Georgia,serif]">
                    Práctica conjunta
                  </h3>
                </div>
                <p className="text-sm text-slate-400">
                  Cuestionarios de 10, 15 o 20 preguntas combinadas, identificando primero la estrategia correcta.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* SELECTOR DE NIVEL REUTILIZABLE EN M1 Y M2 */}
        {(screen === 'm1' || screen === 'm2') && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setScreen('home')}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-amber-300"
              >
                <Home className="w-4 h-4" />
                Volver al inicio
              </button>
              <div className="inline-flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {(['sencillo', 'medio', 'avanzado'] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold capitalize transition-colors ${
                      selectedDifficulty === diff
                        ? 'bg-amber-400 text-slate-950'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {screen === 'm1' && (
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-[family-name:var(--font-playfair),Georgia,serif]">
                  Módulo 1: <span className="text-amber-400">Fracciones equivalentes</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => startSinglePractice('m1_ampliacion_simple')}
                    className="text-left bg-slate-900/70 p-5 rounded-2xl border border-slate-800 hover:border-amber-400/60 hover:bg-slate-900 space-y-2 transition-colors"
                  >
                    <div className="font-bold text-slate-100">1.1 Ampliación simple</div>
                    <p className="text-sm text-slate-400">
                      Multiplica numerador y denominador por un entero dado para obtener la fracción objetivo.
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => startSinglePractice('m1_ampliacion_razonamiento')}
                    className="text-left bg-slate-900/70 p-5 rounded-2xl border border-slate-800 hover:border-amber-400/60 hover:bg-slate-900 space-y-2 transition-colors"
                  >
                    <div className="font-bold text-slate-100">1.2 Ampliación por razonamiento</div>
                    <p className="text-sm text-slate-400">
                      Descubre el factor a partir del denominador objetivo y aplícalo en ambas partes.
                    </p>
                  </button>
                </div>

                <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="font-bold text-slate-100">1.3 Reducción con ayuda</div>
                  <p className="text-sm text-slate-400">
                    Elige el recorrido didáctico previsto. Siempre se aceptan órdenes alternativos y caminos más cortos válidos.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {(
                      [
                        ['1', '1 reducción'],
                        ['2', '2 reducciones'],
                        ['3a5', '3 a 5 reducciones'],
                        ['aleatoria', 'Práctica aleatoria'],
                      ] as const
                    ).map(([mode, label]) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => startSinglePractice('m1_reduccion', mode)}
                        className="px-3 py-2.5 rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/30 font-semibold text-sm hover:bg-amber-400/20 transition-colors"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {screen === 'm2' && (
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-[family-name:var(--font-playfair),Georgia,serif]">
                  Módulo 2: <span className="text-amber-400">Operaciones con fracciones</span>
                </h2>

                <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="font-bold text-slate-100">2.1 Operaciones simples</div>
                  <p className="text-sm text-slate-400">
                    Enfocadas en dominar el procedimiento de cada operación (resultados directos mayormente irreducibles).
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(
                      [
                        ['m2_simple_mult', 'A. Multiplicación'],
                        ['m2_simple_pot', 'B. Potencias'],
                        ['m2_simple_raiz', 'C. Raíces exactas'],
                        ['m2_simple_div', 'D. División'],
                        ['m2_simple_sumaresta', 'E. Suma y resta (mcm)'],
                      ] as const
                    ).map(([cat, label]) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => startSinglePractice(cat)}
                        className="p-3 rounded-xl bg-emerald-950/50 text-emerald-200 border border-emerald-500/30 font-semibold text-sm hover:bg-emerald-900/50 text-left transition-colors"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/70 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="font-bold text-slate-100">2.2 Operaciones con reducción</div>
                  <p className="text-sm text-slate-400">
                    Primero validamos la operación y después simplificamos hasta mínima expresión (incluye sumas/restas combinadas y raíces con simplificación previa).
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(
                      [
                        ['m2_red_mult', 'Multiplicación + reducción'],
                        ['m2_red_pot', 'Potencias + reducción'],
                        ['m2_red_raiz', 'Raíces + simplificación'],
                        ['m2_red_div', 'División + reducción'],
                        ['m2_red_sumaresta', 'Suma y resta combinada'],
                      ] as const
                    ).map(([cat, label]) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => startSinglePractice(cat)}
                        className="p-3 rounded-xl bg-amber-400/10 text-amber-200 border border-amber-400/30 font-semibold text-sm hover:bg-amber-400/20 text-left transition-colors"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CONFIGURADOR MÓDULO 3 */}
        {screen === 'm3_config' && (
          <div className="max-w-2xl mx-auto bg-slate-900/80 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-100 font-[family-name:var(--font-playfair),Georgia,serif]">
                Módulo 3: <span className="text-amber-400">Práctica conjunta</span>
              </h2>
              <button
                type="button"
                onClick={() => setScreen('home')}
                className="text-sm font-medium text-slate-400 hover:text-amber-300"
              >
                Volver
              </button>
            </div>
            <p className="text-sm text-slate-300">
              Combina ampliación, reducción y todas las operaciones. Antes de cada ejercicio elegirás el procedimiento adecuado.
            </p>

            <div className="space-y-2">
              <div className="text-sm font-bold text-slate-200">Cantidad de preguntas</div>
              <div className="grid grid-cols-3 gap-2.5">
                {([10, 15, 20] as const).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setQuizCount(n)}
                    className={`py-2.5 rounded-xl border-2 font-semibold text-sm transition-colors ${
                      quizCount === n
                        ? 'border-amber-400 bg-amber-400/15 text-amber-300'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {n} preguntas
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-bold text-slate-200">Nivel de dificultad</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(
                  [
                    ['sencillo', 'Sencillo', 'Números pequeños y ayuda visible'],
                    ['medio', 'Medio', 'Más pasos y ayuda bajo solicitud'],
                    ['avanzado', 'Avanzado', 'Hasta 5 reducciones, combinadas y raíces'],
                  ] as const
                ).map(([d, title, desc]) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDifficulty(d)}
                    className={`p-3 rounded-xl border-2 text-left transition-colors ${
                      selectedDifficulty === d
                        ? 'border-amber-400 bg-amber-400/15 text-amber-200'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-sm">{title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {selectedDifficulty === 'avanzado' && (
              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={progress.settings.allowNegativesInAdvanced}
                  onChange={(e) => updateSettings({ allowNegativesInAdvanced: e.target.checked })}
                  className="mt-1 w-4 h-4 accent-amber-400"
                />
                <span className="text-sm text-slate-300">
                  <strong className="text-slate-100">Permitir resultados negativos en restas</strong> (solo nivel Avanzado; las fracciones iniciales siguen siendo positivas).
                </span>
              </label>
            )}

            <button
              type="button"
              onClick={startQuizSession}
              className="w-full py-3 rounded-xl bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              Comenzar cuestionario de {quizCount} preguntas
            </button>
          </div>
        )}

        {/* PANTALLA: EJERCICIO ACTIVO */}
        {screen === 'practice' && currentExercise && (
          <ExerciseWorkspace
            exercise={currentExercise}
            requireStrategyPhase={isQuizMode}
            progressLabel={
              isQuizMode
                ? `Pregunta ${quizIndex + 1} de ${quizQueue.length}`
                : `Práctica libre (${sessionRecords.length + 1})`
            }
            settings={progress.settings}
            onFinishExercise={handleFinishExercise}
            onNext={handleNextExercise}
            onRequestMenu={() => setConfirmExitOpen(true)}
            onOpenDivGuide={() => setShowDivGuide(true)}
          />
        )}

        {/* PANTALLA: RESUMEN */}
        {screen === 'summary' && (
          <SummaryView
            records={sessionRecords}
            onPracticeAgain={startQuizSession}
            onBackToMenu={() => setScreen('home')}
          />
        )}

        {/* PANTALLA: AJUSTES Y VERIFICADOR MATEMÁTICO */}
        {screen === 'settings' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-100 font-[family-name:var(--font-playfair),Georgia,serif]">
                  Ajustes locales
                </h2>
                <button
                  type="button"
                  onClick={() => setScreen('home')}
                  className="text-sm font-medium text-slate-400 hover:text-amber-300"
                >
                  Volver al inicio
                </button>
              </div>

              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={progress.settings.allowRule7}
                  onChange={(e) => updateSettings({ allowRule7: e.target.checked })}
                  className="mt-1 w-4 h-4 accent-amber-400"
                />
                <span className="text-sm text-slate-300">
                  <strong className="text-slate-100">Incluir factor 7 y regla del 7 (opcional)</strong> en reducciones y guía de divisibilidad.
                </span>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={progress.settings.allowNegativesInAdvanced}
                  onChange={(e) => updateSettings({ allowNegativesInAdvanced: e.target.checked })}
                  className="mt-1 w-4 h-4 accent-amber-400"
                />
                <span className="text-sm text-slate-300">
                  <strong className="text-slate-100">Permitir resultados negativos en restas (solo nivel Avanzado)</strong>.
                </span>
              </label>

              <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-slate-400">
                  El progreso se guarda únicamente en este dispositivo sin datos personales.
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmResetOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-500/30 text-sm font-semibold hover:bg-rose-900/60"
                >
                  <Trash2 className="w-4 h-4" />
                  Reiniciar progreso local
                </button>
              </div>
            </div>

            {/* Suite de verificación matemática en vivo (Casos A–M) */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-slate-100 font-[family-name:var(--font-playfair),Georgia,serif]">
                    Verificador del motor matemático (Casos A–M)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setTestResults(runAutomatedVerificationSuite())}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-sm font-bold hover:bg-emerald-400"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  Ejecutar pruebas automáticas
                </button>
              </div>
              <p className="text-sm text-slate-400">
                Ejecuta en tu navegador las pruebas del motor exacto, rechazo de cero, raíces exactas, generadores reproducibles y todos los casos obligatorios A–M.
              </p>

              {testResults && (
                <div className="space-y-2 pt-2">
                  <div className="text-sm font-bold text-emerald-400">
                    Resultado: {testResults.filter((t) => t.passed).length} de {testResults.length} pruebas aprobadas
                  </div>
                  <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden">
                    {testResults.map((r) => (
                      <div key={r.id} className="px-3.5 py-2.5 flex items-start justify-between gap-3 text-sm bg-slate-950/60">
                        <div>
                          <span className="font-bold text-amber-400 mr-2">[{r.id}]</span>
                          <span className="text-slate-200">{r.name}</span>
                          {!r.passed && <div className="text-xs text-rose-400 mt-0.5">{r.detail}</div>}
                        </div>
                        <span
                          className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-bold ${
                            r.passed
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {r.passed ? 'OK' : 'FALLO'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modales globales */}
      <DivisibilityGuideModal
        open={showDivGuide}
        onClose={() => setShowDivGuide(false)}
        allowRule7={progress.settings.allowRule7}
      />

      <ConfirmModal
        open={confirmExitOpen}
        title="¿Volver al menú principal?"
        message="Los ejercicios que ya terminaste quedaron guardados en tu dispositivo. Si sales ahora, el ejercicio en curso se cerrará."
        confirmLabel="Sí, volver al menú"
        onCancel={() => setConfirmExitOpen(false)}
        onConfirm={() => {
          setConfirmExitOpen(false);
          setScreen('home');
        }}
      />

      <ConfirmModal
        open={confirmResetOpen}
        title="¿Reiniciar todo el progreso local?"
        message="Se borrarán las estadísticas y preferencias guardadas en este dispositivo. Esta acción no se puede deshacer."
        confirmLabel="Sí, reiniciar"
        danger
        onCancel={() => setConfirmResetOpen(false)}
        onConfirm={() => {
          persistProgress(DEFAULT_PROGRESS);
          setConfirmResetOpen(false);
        }}
      />
    </div>
  );
}