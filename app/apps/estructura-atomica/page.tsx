"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CheckCircle2, XCircle, RefreshCw, Info, Wand2 } from 'lucide-react';

// Base de datos de elementos (1-105, excluyendo lantánidos y actínidos)
const PERIODIC_TABLE = [
  { z: 1, s: "H", n: "Hidrógeno", a: 1 }, { z: 2, s: "He", n: "Helio", a: 4 },
  { z: 3, s: "Li", n: "Litio", a: 7 }, { z: 4, s: "Be", n: "Berilio", a: 9 },
  { z: 5, s: "B", n: "Boro", a: 11 }, { z: 6, s: "C", n: "Carbono", a: 12 },
  { z: 7, s: "N", n: "Nitrógeno", a: 14 }, { z: 8, s: "O", n: "Oxígeno", a: 16 },
  { z: 9, s: "F", n: "Flúor", a: 19 }, { z: 10, s: "Ne", n: "Neón", a: 20 },
  { z: 11, s: "Na", n: "Sodio", a: 23 }, { z: 12, s: "Mg", n: "Magnesio", a: 24 },
  { z: 13, s: "Al", n: "Aluminio", a: 27 }, { z: 14, s: "Si", n: "Silicio", a: 28 },
  { z: 15, s: "P", n: "Fósforo", a: 31 }, { z: 16, s: "S", n: "Azufre", a: 32 },
  { z: 17, s: "Cl", n: "Cloro", a: 35 }, { z: 18, s: "Ar", n: "Argón", a: 40 },
  { z: 19, s: "K", n: "Potasio", a: 39 }, { z: 20, s: "Ca", n: "Calcio", a: 40 },
  { z: 21, s: "Sc", n: "Escandio", a: 45 }, { z: 22, s: "Ti", n: "Titanio", a: 48 },
  { z: 23, s: "V", n: "Vanadio", a: 51 }, { z: 24, s: "Cr", n: "Cromo", a: 52 },
  { z: 25, s: "Mn", n: "Manganeso", a: 55 }, { z: 26, s: "Fe", n: "Hierro", a: 56 },
  { z: 27, s: "Co", n: "Cobalto", a: 59 }, { z: 28, s: "Ni", n: "Níquel", a: 59 },
  { z: 29, s: "Cu", n: "Cobre", a: 64 }, { z: 30, s: "Zn", n: "Zinc", a: 65 },
  { z: 31, s: "Ga", n: "Galio", a: 70 }, { z: 32, s: "Ge", n: "Germanio", a: 73 },
  { z: 33, s: "As", n: "Arsénico", a: 75 }, { z: 34, s: "Se", n: "Selenio", a: 79 },
  { z: 35, s: "Br", n: "Bromo", a: 80 }, { z: 36, s: "Kr", n: "Kriptón", a: 84 },
  { z: 37, s: "Rb", n: "Rubidio", a: 85 }, { z: 38, s: "Sr", n: "Estroncio", a: 88 },
  { z: 39, s: "Y", n: "Itrio", a: 89 }, { z: 40, s: "Zr", n: "Zirconio", a: 91 },
  { z: 41, s: "Nb", n: "Niobio", a: 93 }, { z: 42, s: "Mo", n: "Molibdeno", a: 96 },
  { z: 43, s: "Tc", n: "Tecnecio", a: 98 }, { z: 44, s: "Ru", n: "Rutenio", a: 101 },
  { z: 45, s: "Rh", n: "Rodio", a: 103 }, { z: 46, s: "Pd", n: "Paladio", a: 106 },
  { z: 47, s: "Ag", n: "Plata", a: 108 }, { z: 48, s: "Cd", n: "Cadmio", a: 112 },
  { z: 49, s: "In", n: "Indio", a: 115 }, { z: 50, s: "Sn", n: "Estaño", a: 119 },
  { z: 51, s: "Sb", n: "Antimonio", a: 122 }, { z: 52, s: "Te", n: "Telurio", a: 128 },
  { z: 53, s: "I", n: "Yodo", a: 127 }, { z: 54, s: "Xe", n: "Xenón", a: 131 },
  { z: 55, s: "Cs", n: "Cesio", a: 133 }, { z: 56, s: "Ba", n: "Bario", a: 137 },
  { z: 72, s: "Hf", n: "Hafnio", a: 178 }, { z: 73, s: "Ta", n: "Tántalo", a: 181 },
  { z: 74, s: "W", n: "Wolframio", a: 184 }, { z: 75, s: "Re", n: "Renio", a: 186 },
  { z: 76, s: "Os", n: "Osmio", a: 190 }, { z: 77, s: "Ir", n: "Iridio", a: 192 },
  { z: 78, s: "Pt", n: "Platino", a: 195 }, { z: 79, s: "Au", n: "Oro", a: 197 },
  { z: 80, s: "Hg", n: "Mercurio", a: 201 }, { z: 81, s: "Tl", n: "Talio", a: 204 },
  { z: 82, s: "Pb", n: "Plomo", a: 207 }, { z: 83, s: "Bi", n: "Bismuto", a: 209 },
  { z: 84, s: "Po", n: "Polonio", a: 209 }, { z: 85, s: "At", n: "Astato", a: 210 },
  { z: 86, s: "Rn", n: "Radón", a: 222 }, { z: 87, s: "Fr", n: "Francio", a: 223 },
  { z: 88, s: "Ra", n: "Radio", a: 226 }, { z: 104, s: "Rf", n: "Rutherfordio", a: 267 },
  { z: 105, s: "Db", n: "Dubnio", a: 268 }
];

const POSSIBLE_CHARGES = ["0", "1+", "2+", "3+", "1-", "2-", "3-"];

const FIELDS = [
  { key: 'nombre', label: 'Nombre', type: 'text' },
  { key: 'simbolo', label: 'Símbolo', type: 'text' },
  { key: 'carga', label: 'Carga', type: 'text' },
  { key: 'a', label: 'A', type: 'number' },
  { key: 'z', label: 'Z', type: 'number' },
  { key: 'p', label: 'p+', type: 'number' },
  { key: 'e', label: 'e-', type: 'number' },
  { key: 'n', label: 'n°', type: 'number' },
  { key: 'tipo', label: 'Tipo', type: 'select', options: ['', 'catión', 'anión', 'neutro'] }
];

export default function EstructuraAtomicaPage() {
  const [rows, setRows] = useState<any[]>([]);

  const generateGame = useCallback(() => {
    const shuffled = [...PERIODIC_TABLE].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);

    const gameRows = selected.map((baseElem) => {
      const isIon = Math.random() > 0.5;
      const chargeStr = isIon ? POSSIBLE_CHARGES[Math.floor(Math.random() * (POSSIBLE_CHARGES.length - 1)) + 1] : "0";
      
      const chargeVal = chargeStr === "0" ? 0 : 
                       chargeStr.includes('+') ? parseInt(chargeStr) : -parseInt(chargeStr);
      
      let displayNombre = baseElem.n;
      if (chargeVal > 0) {
        const romans = ["", "I", "II", "III"];
        displayNombre = `${baseElem.n} (${romans[chargeVal] || chargeVal + '+'})`;
      } else if (chargeVal < 0) {
        displayNombre = `${baseElem.n} (${Math.abs(chargeVal)}-)`;
      }

      const fullData: any = {
        nombre: displayNombre,
        simbolo: chargeStr === "0" ? baseElem.s : `${baseElem.s}${chargeStr}`,
        carga: chargeStr,
        z: baseElem.z,
        a: baseElem.a,
        p: baseElem.z,
        n: baseElem.a - baseElem.z,
        e: baseElem.z - chargeVal,
        tipo: chargeVal > 0 ? 'catión' : chargeVal < 0 ? 'anión' : 'neutro'
      };

      const identityKeys = ['nombre', 'simbolo', 'z', 'p'];
      const mainClueKey = identityKeys[Math.floor(Math.random() * identityKeys.length)];
      
      const clues = [mainClueKey];
      if (chargeStr !== "0") clues.push('carga');

      const userAnswers: any = {};
      FIELDS.forEach(f => {
        userAnswers[f.key] = clues.includes(f.key) ? String(fullData[f.key]) : '';
      });

      return {
        id: Math.random(),
        clueKeys: clues,
        userAnswers: userAnswers,
        targetData: fullData
      };
    });

    setRows(gameRows);
  }, []);

  useEffect(() => {
    generateGame();
  }, [generateGame]);

  const handleInputChange = (rowId: number, key: string, value: string) => {
    setRows(prev => prev.map(row => {
      if (row.id === rowId) {
        return { ...row, userAnswers: { ...row.userAnswers, [key]: value } };
      }
      return row;
    }));
  };

  const validateField = (row: any, key: string) => {
    const val = String(row.userAnswers[key]).trim().toLowerCase();
    if (val === '') return { valid: null, msg: "" };

    const currentZ = parseInt(row.userAnswers.z) || parseInt(row.userAnswers.p);
    const element = currentZ ? PERIODIC_TABLE.find(e => e.z === currentZ) : null;

    switch(key) {
      case 'z':
      case 'p': {
        const num = parseInt(val);
        if (isNaN(num)) return { valid: false, msg: "Debe ser número" };
        const otherKey = key === 'z' ? 'p' : 'z';
        const otherVal = parseInt(row.userAnswers[otherKey]);
        if (!isNaN(otherVal) && num !== otherVal) return { valid: false, msg: "Z y p+ deben ser iguales" };
        return { valid: true, msg: "" };
      }
      case 'nombre':
      case 'simbolo': {
        if (!element) return { valid: true, msg: "" };
        const expected = key === 'nombre' ? element.n.toLowerCase() : element.s.toLowerCase();
        if (!expected.includes(val) && !val.includes(expected)) {
          return { valid: false, msg: `Dato incorrecto para Z=${currentZ}` };
        }
        return { valid: true, msg: "" };
      }
      case 'a': {
        const aNum = parseInt(val);
        const protonsNum = parseInt(row.userAnswers.p);
        const neutronsNum = parseInt(row.userAnswers.n);
        if (isNaN(aNum)) return { valid: false, msg: "Debe ser número" };
        if (!isNaN(protonsNum) && !isNaN(neutronsNum) && aNum !== (protonsNum + neutronsNum)) return { valid: false, msg: "A = p+ + n°" };
        return { valid: true, msg: "" };
      }
      case 'n': {
        const nNum = parseInt(val);
        const massNum = parseInt(row.userAnswers.a);
        const protonsNum = parseInt(row.userAnswers.p);
        if (isNaN(nNum)) return { valid: false, msg: "Debe ser número" };
        if (!isNaN(massNum) && !isNaN(protonsNum) && nNum !== (massNum - protonsNum)) return { valid: false, msg: "n° = A - p+" };
        return { valid: true, msg: "" };
      }
      case 'e': {
        const eNum = parseInt(val);
        const protonsNum = parseInt(row.userAnswers.p);
        const cargaStr = String(row.userAnswers.carga);
        if (isNaN(eNum)) return { valid: false, msg: "Debe ser número" };
        if (!isNaN(protonsNum) && cargaStr !== "") {
          const cv = cargaStr === "0" ? 0 : cargaStr.includes('+') ? parseInt(cargaStr) : -parseInt(cargaStr);
          if (eNum !== (protonsNum - cv)) return { valid: false, msg: `Revisa: e- = p+ - carga` };
        }
        return { valid: true, msg: "" };
      }
      case 'carga': {
        const norm = val.toUpperCase();
        if (!POSSIBLE_CHARGES.includes(norm) && !POSSIBLE_CHARGES.includes(val)) 
          return { valid: false, msg: "Formato: 0, 1+, 2-, etc." };
        return { valid: true, msg: "" };
      }
      case 'tipo': {
        const cargaStr = String(row.userAnswers.carga);
        if (cargaStr === "") return { valid: true, msg: "" };
        const cv = cargaStr === "0" ? 0 : cargaStr.includes('+') ? parseInt(cargaStr) : -parseInt(cargaStr);
        const expectedType = cv > 0 ? 'catión' : cv < 0 ? 'anión' : 'neutro';
        if (val !== expectedType) return { valid: false, msg: `La carga ${cargaStr} es un ${expectedType}` };
        return { valid: true, msg: "" };
      }
      default:
        return { valid: true, msg: "" };
    }
  };

  // Función inteligente que busca el primer error o celda vacía y lo resuelve
  const handleSolveHint = (row: any) => {
    for (const field of FIELDS) {
      if (row.clueKeys.includes(field.key)) continue; // Ignorar pistas base
      
      const val = String(row.userAnswers[field.key]).trim();
      const validation = validateField(row, field.key);
      
      if (val === '' || validation.valid === false) {
        handleInputChange(row.id, field.key, String(row.targetData[field.key]));
        break; // Solo da una pista por clic
      }
    }
  };

  return (
    <div className="min-h-screen bg-base-dark p-4 md:p-8 font-sans text-text-main">
      <div className="max-w-[90rem] mx-auto">
        
        <div className="mb-6">
          <Link href="/apps" className="text-accent-gold hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
            ← Volver al Laboratorio
          </Link>
        </div>

        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-accent-gold mb-2">Práctica de Estructura Atómica</h1>
          <p className="text-text-muted italic">Analiza las pistas marcadas y deduce los datos faltantes del átomo o ion.</p>
          <p className="text-text-muted italic">NOTA: Los nombres de los elementos químicos deben tener acento.</p>
        </header>

        <div className="bg-base-surface rounded-sm shadow-xl overflow-hidden border border-base-border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center border-collapse">
              <thead>
                <tr className="bg-base-dark text-text-main border-b border-base-border">
                  {FIELDS.map(f => (
                    <th key={f.key} className="p-4 border-r border-base-border last:border-0 min-w-[120px] font-serif font-normal">
                      {f.label}
                    </th>
                  ))}
                  <th className="p-4 font-serif font-normal min-w-[140px]">Estado / Ayuda</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const isComplete = FIELDS.every(f => String(row.userAnswers[f.key]).trim() !== "");
                  const isCorrect = FIELDS.every(f => validateField(row, f.key).valid !== false);

                  return (
                    <tr key={row.id} className="border-b border-base-border hover:bg-base-dark/50 transition-colors">
                      {FIELDS.map(f => {
                        const isClue = row.clueKeys.includes(f.key);
                        const res = validateField(row, f.key);
                        
                        return (
                          <td key={f.key} className="p-3 border-r border-base-border last:border-0 relative group">
                            {isClue ? (
                              <div className="font-bold text-base-dark bg-accent-gold px-2 py-2 rounded-sm border border-accent-gold/50 shadow-sm">
                                {row.userAnswers[f.key]}
                              </div>
                            ) : f.type === 'select' ? (
                              <select
                                value={row.userAnswers[f.key]}
                                onChange={(e) => handleInputChange(row.id, f.key, e.target.value)}
                                className={`w-full p-2 border rounded-sm outline-none cursor-pointer transition-all bg-base-dark text-text-main
                                  ${res.valid === true ? 'border-green-500/50 text-green-400' : 
                                    res.valid === false ? 'border-red-500/80 text-red-400' : 'border-base-border focus:border-accent-gold'
                                  }`}
                              >
                                {f.options.map(opt => (
                                  <option key={opt} value={opt}>{opt || '...'}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={row.userAnswers[f.key]}
                                onChange={(e) => handleInputChange(row.id, f.key, e.target.value)}
                                className={`w-full p-2 border rounded-sm text-center outline-none transition-all bg-base-dark text-text-main
                                  ${res.valid === true ? 'border-green-500/50 text-green-400 font-medium' : 
                                    res.valid === false ? 'border-red-500/80 text-red-400' : 'border-base-border focus:border-accent-gold'
                                  }`}
                                placeholder="?"
                              />
                            )}
                            
                            {/* Tooltip rediseñado (Error) */}
                            {res.valid === false && res.msg && (
                              <div className="absolute z-[100] bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-[200px] p-2 bg-base-dark border border-red-500/50 text-red-200 text-xs rounded-sm shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
                                {String(res.msg)}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-red-500/50"></div>
                              </div>
                            )}
                          </td>
                        );
                      })}
                      <td className="p-3 flex items-center justify-center gap-3">
                        {isComplete ? (
                          isCorrect ? (
                            <CheckCircle2 size={24} className="text-green-500" />
                          ) : (
                            <XCircle size={24} className="text-red-500" />
                          )
                        ) : (
                          <div className="w-5 h-5 border-2 border-base-border border-dashed rounded-full animate-pulse" />
                        )}
                        
                        {/* Botón de Autocompletar / Pista */}
                        {(!isComplete || !isCorrect) && (
                          <button
                            onClick={() => handleSolveHint(row)}
                            title="Completar una celda incorrecta o vacía"
                            className="p-1.5 text-text-muted hover:text-accent-gold hover:bg-accent-gold/10 rounded-sm transition-colors border border-transparent hover:border-accent-gold/30"
                          >
                            <Wand2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="bg-base-surface p-5 rounded-sm border border-base-border flex items-start gap-4 max-w-2xl shadow-sm w-full md:w-auto">
            <Info className="text-accent-gold shrink-0 mt-1" size={24} />
            <div className="text-sm text-text-muted leading-relaxed w-full">
              <p className="font-serif text-text-main mb-3">Formulario y Relaciones:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-base-dark border border-base-border text-text-main px-2 py-0.5 rounded-sm text-sm">
                    Z = p+
                  </span>
                  <span className="text-xs">(Número Atómico)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-base-dark border border-base-border text-text-main px-2 py-0.5 rounded-sm text-sm">
                    A = p+ + n°
                  </span>
                  <span className="text-xs">(Masa)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-base-dark border border-base-border text-text-main px-2 py-0.5 rounded-sm text-sm">
                    e- = p+ - carga
                  </span>
                  <span className="text-xs">(Electrones)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent-gold font-medium text-sm">Catión (+)</span>
                  <span className="text-xs">(Pierde e-)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-accent-gold font-medium text-sm">Anión (-)</span>
                  <span className="text-xs">(Gana e-)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-text-main font-medium text-sm">Neutro (0)</span>
                  <span className="text-xs">(Carga cero)</span>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={generateGame}
            className="group flex items-center justify-center gap-3 bg-accent-gold/10 hover:bg-accent-gold text-accent-gold hover:text-base-dark border border-accent-gold px-10 py-4 rounded-sm font-serif font-bold transition-all duration-300 shrink-0"
          >
            <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-700" />
            Nueva Tabla
          </button>
        </footer>
      </div>
    </div>
  );
}