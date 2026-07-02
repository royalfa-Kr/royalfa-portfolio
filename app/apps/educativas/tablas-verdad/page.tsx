"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HelpCircle, CheckCircle2, XCircle, Wand2, Info } from 'lucide-react';

// ==========================================
// MOTOR LÓGICO
// ==========================================
type LogicEval = (p: boolean, q: boolean, r?: boolean) => boolean;
interface LogicExercise { id: string; text: string; eval: LogicEval; }

const level1Operations: LogicExercise[] = [
  { id: 'l1-1', text: '~P', eval: (p) => !p },
  { id: 'l1-2', text: '~Q', eval: (p, q) => !q },
  { id: 'l1-3', text: 'P ∧ Q', eval: (p, q) => p && q },
  { id: 'l1-4', text: 'Q ∧ P', eval: (p, q) => q && p },
  { id: 'l1-5', text: 'P ∨ Q', eval: (p, q) => p || q },
  { id: 'l1-6', text: 'P → Q', eval: (p, q) => !p || q },
  { id: 'l1-7', text: 'Q → P', eval: (p, q) => !q || p },
  { id: 'l1-8', text: 'P ↔ Q', eval: (p, q) => p === q },
];

const level2Operations: LogicExercise[] = [
  { id: 'l2-1', text: '~(P ∧ Q)', eval: (p, q) => !(p && q) },
  { id: 'l2-2', text: '~P ∨ ~Q', eval: (p, q) => !p || !q },
  { id: 'l2-3', text: '(P ∨ Q) → ~P', eval: (p, q) => !(p || q) || !p },
  { id: 'l2-4', text: '(P → Q) ∧ P', eval: (p, q) => (!p || q) && p },
  { id: 'l2-5', text: '(P ↔ Q) ∨ ~Q', eval: (p, q) => (p === q) || !q },
  { id: 'l2-6', text: '~(P → Q)', eval: (p, q) => !(!p || q) },
];

const level3Operations: LogicExercise[] = [
  { id: 'l3-1', text: 'P ∧ (Q ∨ R)', eval: (p, q, r) => p && (q || r!) },
  { id: 'l3-2', text: '(P ∧ Q) → R', eval: (p, q, r) => !(p && q) || r! },
  { id: 'l3-3', text: 'P → (Q → R)', eval: (p, q, r) => !p || (!q || r!) },
  { id: 'l3-4', text: '(P ∨ Q) ↔ R', eval: (p, q, r) => (p || q) === r! },
  { id: 'l3-5', text: '~P ∧ (Q ↔ R)', eval: (p, q, r) => !p && (q === r!) },
  { id: 'l3-6', text: '~(P ∨ Q) → R', eval: (p, q, r) => (p || q) || r! },
];

// Filas para 2 variables (4 combinaciones)
const baseRows2Vars = [
  { p: true, q: true, r: false },
  { p: true, q: false, r: false },
  { p: false, q: true, r: false },
  { p: false, q: false, r: false },
];

// Filas para 3 variables (8 combinaciones)
const baseRows3Vars = [
  { p: true, q: true, r: true },
  { p: true, q: true, r: false },
  { p: true, q: false, r: true },
  { p: true, q: false, r: false },
  { p: false, q: true, r: true },
  { p: false, q: true, r: false },
  { p: false, q: false, r: true },
  { p: false, q: false, r: false },
];

export default function TablasVerdadPage() {
  const [level, setLevel] = useState<number>(1);
  const [columns, setColumns] = useState<LogicExercise[]>([]);
  const [userAnswers, setUserAnswers] = useState<(boolean | null)[][]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Filas activas dependiendo del nivel
  const activeBaseRows = level === 3 ? baseRows3Vars : baseRows2Vars;

  useEffect(() => {
    generateBoard(level);
  }, [level]);

  const generateBoard = (currentLevel: number) => {
    let pool = currentLevel === 1 ? level1Operations : currentLevel === 2 ? level2Operations : level3Operations;
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 2); // Manteniendo 2 columnas
    setColumns(selected);
    
    const rowsToUse = currentLevel === 3 ? baseRows3Vars : baseRows2Vars;
    const initialAnswers = rowsToUse.map(() => selected.map(() => null));
    setUserAnswers(initialAnswers);
    setIsSubmitted(false);
  };

  const toggleAnswer = (rowIndex: number, colIndex: number) => {
    const newAnswers = [...userAnswers];
    const current = newAnswers[rowIndex][colIndex];
    if (current === null) newAnswers[rowIndex][colIndex] = true;
    else if (current === true) newAnswers[rowIndex][colIndex] = false;
    else newAnswers[rowIndex][colIndex] = null;
    setUserAnswers(newAnswers);
  };

  const autoFillCell = (rowIndex: number, colIndex: number) => {
    const newAnswers = [...userAnswers];
    const { p, q, r } = activeBaseRows[rowIndex];
    newAnswers[rowIndex][colIndex] = columns[colIndex].eval(p, q, r);
    setUserAnswers(newAnswers);
  };

  const checkRowStatus = (rowIndex: number) => {
    const rowAnswers = userAnswers[rowIndex];
    if (!rowAnswers) return 'incomplete';

    const { p, q, r } = activeBaseRows[rowIndex];
    if (rowAnswers.some(ans => ans === null)) return 'incomplete';
    
    const isCorrect = rowAnswers.every((ans, colIndex) => {
      return ans === columns[colIndex].eval(p, q, r);
    });

    return isCorrect ? 'correct' : 'incorrect';
  };

  return (
    <div className="min-h-screen bg-base-dark p-4 md:p-8 font-sans text-text-main flex flex-col items-center">
      <div className="w-full max-w-5xl">
        
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/apps/educativas" className="text-accent-gold hover:text-white flex items-center gap-2 text-sm font-medium transition-colors self-start md:self-auto">
            ← Volver a Educativas
          </Link>
          
          <div className="flex gap-2">
            {[1, 2, 3].map(l => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`px-4 py-2 rounded-sm text-sm font-bold transition-all ${
                  level === l ? 'bg-accent-gold text-base-dark' : 'bg-base-surface text-text-muted border border-base-border hover:border-accent-gold/50'
                }`}
              >
                Nivel {l}
              </button>
            ))}
            <button 
              onClick={() => setShowHelp(!showHelp)}
              className="px-4 py-2 bg-accent-gold/10 text-accent-gold border border-accent-gold/30 rounded-sm hover:bg-accent-gold hover:text-base-dark transition-all flex items-center gap-2 text-sm font-bold"
            >
              <HelpCircle size={16} /> Guía
            </button>
          </div>
        </div>

        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-accent-gold mb-2">Tablas de Verdad</h1>
          <p className="text-text-muted text-sm">Completa los valores lógicos. Haz clic en las celdas vacías para alternar entre V y F.</p>
        </header>

        {showHelp && (
          <div className="mb-8 bg-base-surface border border-accent-gold/30 p-6 rounded-sm shadow-xl animate-in fade-in zoom-in duration-300">
            <h3 className="text-xl font-serif text-accent-gold mb-4 flex items-center gap-2">
              <Info size={20} /> Reglas Básicas
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-center">
              <div className="bg-base-dark p-3 rounded-sm border border-base-border">
                <span className="font-bold text-accent-gold block mb-1">Negación (~)</span>
                <p className="text-text-muted text-xs">Invierte el valor. Lo V es F, lo F es V.</p>
              </div>
              <div className="bg-base-dark p-3 rounded-sm border border-base-border">
                <span className="font-bold text-accent-gold block mb-1">Conjunción (∧)</span>
                <p className="text-text-muted text-xs">Verdadera SOLO si ambas son V.</p>
              </div>
              <div className="bg-base-dark p-3 rounded-sm border border-base-border">
                <span className="font-bold text-accent-gold block mb-1">Disyunción (∨)</span>
                <p className="text-text-muted text-xs">Falsa SOLO si ambas son F.</p>
              </div>
              <div className="bg-base-dark p-3 rounded-sm border border-base-border">
                <span className="font-bold text-accent-gold block mb-1">Condicional (→)</span>
                <p className="text-text-muted text-xs">Falsa SOLO si V → F.</p>
              </div>
              <div className="bg-base-dark p-3 rounded-sm border border-base-border">
                <span className="font-bold text-accent-gold block mb-1">Bicondicional (↔)</span>
                <p className="text-text-muted text-xs">Verdadera SOLO si son iguales.</p>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto bg-base-surface border border-base-border rounded-sm shadow-2xl">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-base-dark border-b border-base-border text-lg font-serif">
                <th className="p-4 border-r border-base-border text-text-muted w-24">P</th>
                <th className="p-4 border-r border-base-border text-text-muted w-24">Q</th>
                {/* Mostramos R solo en el Nivel 3 */}
                {level === 3 && (
                  <th className="p-4 border-r border-base-border text-text-muted w-24">R</th>
                )}
                {columns.map((col, i) => (
                  <th key={col.id} className="p-4 border-r border-base-border text-accent-gold min-w-[150px]">
                    {col.text}
                  </th>
                ))}
                <th className="p-4 w-24 text-text-muted">Estado</th>
              </tr>
            </thead>
            <tbody>
              {activeBaseRows.map((row, rowIndex) => {
                const status = checkRowStatus(rowIndex);
                
                return (
                  <tr key={rowIndex} className="border-b border-base-border hover:bg-base-dark/50 transition-colors">
                    <td className="p-4 border-r border-base-border font-bold text-lg">
                      <span className={row.p ? 'text-green-400' : 'text-red-400'}>{row.p ? 'V' : 'F'}</span>
                    </td>
                    <td className="p-4 border-r border-base-border font-bold text-lg">
                      <span className={row.q ? 'text-green-400' : 'text-red-400'}>{row.q ? 'V' : 'F'}</span>
                    </td>
                    {/* Renderizamos la celda de R solo en el Nivel 3 */}
                    {level === 3 && (
                      <td className="p-4 border-r border-base-border font-bold text-lg">
                        <span className={row.r ? 'text-green-400' : 'text-red-400'}>{row.r ? 'V' : 'F'}</span>
                      </td>
                    )}
                    
                    {columns.map((col, colIndex) => {
                      const ans = userAnswers[rowIndex]?.[colIndex];
                      let displayAns = '';
                      if (ans === true) displayAns = 'V';
                      if (ans === false) displayAns = 'F';

                      return (
                        <td key={`${rowIndex}-${colIndex}`} className="p-3 border-r border-base-border">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => toggleAnswer(rowIndex, colIndex)}
                              className={`w-12 h-12 flex items-center justify-center rounded-sm font-bold text-xl border transition-all ${
                                ans === true ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                                ans === false ? 'bg-red-500/20 text-red-400 border-red-500/50' :
                                'bg-base-dark border-base-border hover:border-accent-gold/50 text-text-main'
                              }`}
                            >
                              {displayAns}
                            </button>
                            <button 
                              onClick={() => autoFillCell(rowIndex, colIndex)}
                              className="p-2 text-text-muted hover:text-accent-gold transition-colors"
                              title="Ayuda: Rellenar celda"
                            >
                              <Wand2 size={16} />
                            </button>
                          </div>
                        </td>
                      );
                    })}

                    <td className="p-4 flex justify-center items-center h-full">
                      {!isSubmitted ? (
                        <div className="w-7 h-7 rounded-full border-2 border-dashed border-base-border opacity-50" title="Pendiente de verificación" />
                      ) : (
                        <>
                          {status === 'correct' && <CheckCircle2 size={28} className="text-green-500 animate-in zoom-in" />}
                          {status === 'incorrect' && <XCircle size={28} className="text-red-500 animate-in zoom-in" />}
                          {status === 'incomplete' && <div className="w-7 h-7 rounded-full border-2 border-dashed border-base-border opacity-50" title="Fila incompleta" />}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 flex flex-col md:flex-row justify-center items-center gap-4">
           <button 
             onClick={() => setIsSubmitted(true)}
             className="px-8 py-3 bg-accent-gold text-base-dark font-bold hover:bg-accent-gold/90 transition-colors rounded-sm shadow-lg shadow-accent-gold/20"
           >
             Verificar Respuestas
           </button>
           <button 
             onClick={() => generateBoard(level)}
             className="px-6 py-3 border border-base-border hover:border-accent-gold text-text-main hover:text-accent-gold transition-colors rounded-sm"
           >
             Generar Nuevo Ejercicio
           </button>
        </div>

      </div>
    </div>
  );
}