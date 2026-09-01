"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  RefreshCw, 
  RotateCcw, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Sparkles, 
  BookOpen, 
  ArrowLeft,
  MousePointerClick,
  Move,
  Info
} from 'lucide-react';

interface ElementData {
  z: number;
  s: string;
  n: string;
  l: string;
  r: number;
  c: number;
  isF?: boolean;
}

const ELEMENTS_DATA: ElementData[] = [
  // Periodo 1
  { z: 1, s: 'H', n: 'Hidrógeno', l: 'Hydrogenium', r: 1, c: 1 },
  { z: 2, s: 'He', n: 'Helio', l: 'Helium', r: 1, c: 18 },
  // Periodo 2
  { z: 3, s: 'Li', n: 'Litio', l: 'Lithium', r: 2, c: 1 },
  { z: 4, s: 'Be', n: 'Berilio', l: 'Beryllium', r: 2, c: 2 },
  { z: 5, s: 'B', n: 'Boro', l: 'Borium', r: 2, c: 13 },
  { z: 6, s: 'C', n: 'Carbono', l: 'Carboneum', r: 2, c: 14 },
  { z: 7, s: 'N', n: 'Nitrógeno', l: 'Nitrogenium', r: 2, c: 15 },
  { z: 8, s: 'O', n: 'Oxígeno', l: 'Oxygenium', r: 2, c: 16 },
  { z: 9, s: 'F', n: 'Flúor', l: 'Fluorum', r: 2, c: 17 },
  { z: 10, s: 'Ne', n: 'Neón', l: 'Neon', r: 2, c: 18 },
  // Periodo 3
  { z: 11, s: 'Na', n: 'Sodio', l: 'Natrium', r: 3, c: 1 },
  { z: 12, s: 'Mg', n: 'Magnesio', l: 'Magnesium', r: 3, c: 2 },
  { z: 13, s: 'Al', n: 'Aluminio', l: 'Aluminium', r: 3, c: 13 },
  { z: 14, s: 'Si', n: 'Silicio', l: 'Silicium', r: 3, c: 14 },
  { z: 15, s: 'P', n: 'Fósforo', l: 'Phosphorum', r: 3, c: 15 },
  { z: 16, s: 'S', n: 'Azufre', l: 'Sulfur', r: 3, c: 16 },
  { z: 17, s: 'Cl', n: 'Cloro', l: 'Chlorum', r: 3, c: 17 },
  { z: 18, s: 'Ar', n: 'Argón', l: 'Argon', r: 3, c: 18 },
  // Periodo 4
  { z: 19, s: 'K', n: 'Potasio', l: 'Kalium', r: 4, c: 1 },
  { z: 20, s: 'Ca', n: 'Calcio', l: 'Calcium', r: 4, c: 2 },
  { z: 21, s: 'Sc', n: 'Escandio', l: 'Scandium', r: 4, c: 3 },
  { z: 22, s: 'Ti', n: 'Titanio', l: 'Titanium', r: 4, c: 4 },
  { z: 23, s: 'V', n: 'Vanadio', l: 'Vanadium', r: 4, c: 5 },
  { z: 24, s: 'Cr', n: 'Cromo', l: 'Chromium', r: 4, c: 6 },
  { z: 25, s: 'Mn', n: 'Manganeso', l: 'Manganum', r: 4, c: 7 },
  { z: 26, s: 'Fe', n: 'Hierro', l: 'Ferrum', r: 4, c: 8 },
  { z: 27, s: 'Co', n: 'Cobalto', l: 'Cobaltum', r: 4, c: 9 },
  { z: 28, s: 'Ni', n: 'Níquel', l: 'Niccolum', r: 4, c: 10 },
  { z: 29, s: 'Cu', n: 'Cobre', l: 'Cuprum', r: 4, c: 11 },
  { z: 30, s: 'Zn', n: 'Zinc', l: 'Zincum', r: 4, c: 12 },
  { z: 31, s: 'Ga', n: 'Galio', l: 'Gallium', r: 4, c: 13 },
  { z: 32, s: 'Ge', n: 'Germanio', l: 'Germanium', r: 4, c: 14 },
  { z: 33, s: 'As', n: 'Arsénico', l: 'Arsenicum', r: 4, c: 15 },
  { z: 34, s: 'Se', n: 'Selenio', l: 'Selenium', r: 4, c: 16 },
  { z: 35, s: 'Br', n: 'Bromo', l: 'Bromum', r: 4, c: 17 },
  { z: 36, s: 'Kr', n: 'Kriptón', l: 'Krypton', r: 4, c: 18 },
  // Periodo 5
  { z: 37, s: 'Rb', n: 'Rubidio', l: 'Rubidium', r: 5, c: 1 },
  { z: 38, s: 'Sr', n: 'Estroncio', l: 'Strontium', r: 5, c: 2 },
  { z: 39, s: 'Y', n: 'Itrio', l: 'Yttrium', r: 5, c: 3 },
  { z: 40, s: 'Zr', n: 'Zirconio', l: 'Zirconium', r: 5, c: 4 },
  { z: 41, s: 'Nb', n: 'Niobio', l: 'Niobium', r: 5, c: 5 },
  { z: 42, s: 'Mo', n: 'Molibdeno', l: 'Molybdaenum', r: 5, c: 6 },
  { z: 43, s: 'Tc', n: 'Tecnecio', l: 'Technetium', r: 5, c: 7 },
  { z: 44, s: 'Ru', n: 'Rutenio', l: 'Ruthenium', r: 5, c: 8 },
  { z: 45, s: 'Rh', n: 'Rodio', l: 'Rhodium', r: 5, c: 9 },
  { z: 46, s: 'Pd', n: 'Paladio', l: 'Palladium', r: 5, c: 10 },
  { z: 47, s: 'Ag', n: 'Plata', l: 'Argentum', r: 5, c: 11 },
  { z: 48, s: 'Cd', n: 'Cadmio', l: 'Cadmium', r: 5, c: 12 },
  { z: 49, s: 'In', n: 'Indio', l: 'Indium', r: 5, c: 13 },
  { z: 50, s: 'Sn', n: 'Estaño', l: 'Stannum', r: 5, c: 14 },
  { z: 51, s: 'Sb', n: 'Antimonio', l: 'Stibium', r: 5, c: 15 },
  { z: 52, s: 'Te', n: 'Telurio', l: 'Tellurium', r: 5, c: 16 },
  { z: 53, s: 'I', n: 'Yodo', l: 'Iodum', r: 5, c: 17 },
  { z: 54, s: 'Xe', n: 'Xenón', l: 'Xenon', r: 5, c: 18 },
  // Periodo 6
  { z: 55, s: 'Cs', n: 'Cesio', l: 'Caesium', r: 6, c: 1 },
  { z: 56, s: 'Ba', n: 'Bario', l: 'Barium', r: 6, c: 2 },
  { z: 72, s: 'Hf', n: 'Hafnio', l: 'Hafnium', r: 6, c: 4 },
  { z: 73, s: 'Ta', n: 'Tántalo', l: 'Tantalum', r: 6, c: 5 },
  { z: 74, s: 'W', n: 'Wolframio', l: 'Wolframium', r: 6, c: 6 },
  { z: 75, s: 'Re', n: 'Renio', l: 'Rhenium', r: 6, c: 7 },
  { z: 76, s: 'Os', n: 'Osmio', l: 'Osmium', r: 6, c: 8 },
  { z: 77, s: 'Ir', n: 'Iridio', l: 'Iridium', r: 6, c: 9 },
  { z: 78, s: 'Pt', n: 'Platino', l: 'Platinum', r: 6, c: 10 },
  { z: 79, s: 'Au', n: 'Oro', l: 'Aurum', r: 6, c: 11 },
  { z: 80, s: 'Hg', n: 'Mercurio', l: 'Hydrargyrum', r: 6, c: 12 },
  { z: 81, s: 'Tl', n: 'Talio', l: 'Thallium', r: 6, c: 13 },
  { z: 82, s: 'Pb', n: 'Plomo', l: 'Plumbum', r: 6, c: 14 },
  { z: 83, s: 'Bi', n: 'Bismuto', l: 'Bismuthum', r: 6, c: 15 },
  { z: 84, s: 'Po', n: 'Polonio', l: 'Polonium', r: 6, c: 16 },
  { z: 85, s: 'At', n: 'Ástato', l: 'Astatium', r: 6, c: 17 },
  { z: 86, s: 'Rn', n: 'Radón', l: 'Radon', r: 6, c: 18 },
  // Periodo 7
  { z: 87, s: 'Fr', n: 'Francio', l: 'Francium', r: 7, c: 1 },
  { z: 88, s: 'Ra', n: 'Radio', l: 'Radium', r: 7, c: 2 },
  { z: 104, s: 'Rf', n: 'Rutherfordio', l: 'Rutherfordium', r: 7, c: 4 },
  { z: 105, s: 'Db', n: 'Dubnio', l: 'Dubnium', r: 7, c: 5 },
  { z: 106, s: 'Sg', n: 'Seaborgio', l: 'Seaborgium', r: 7, c: 6 },
  { z: 107, s: 'Bh', n: 'Bohrio', l: 'Bohrium', r: 7, c: 7 },
  { z: 108, s: 'Hs', n: 'Hassio', l: 'Hassium', r: 7, c: 8 },
  { z: 109, s: 'Mt', n: 'Meitnerio', l: 'Meitnerium', r: 7, c: 9 },
  { z: 110, s: 'Ds', n: 'Darmstatio', l: 'Darmstadtium', r: 7, c: 10 },
  { z: 111, s: 'Rg', n: 'Roentgenio', l: 'Roentgenium', r: 7, c: 11 },
  { z: 112, s: 'Cn', n: 'Copernicio', l: 'Copernicium', r: 7, c: 12 },
  { z: 113, s: 'Nh', n: 'Nihonio', l: 'Nihonium', r: 7, c: 13 },
  { z: 114, s: 'Fl', n: 'Flerovio', l: 'Flerovium', r: 7, c: 14 },
  { z: 115, s: 'Mc', n: 'Moscovio', l: 'Moscovium', r: 7, c: 15 },
  { z: 116, s: 'Lv', n: 'Livermorio', l: 'Livermorium', r: 7, c: 16 },
  { z: 117, s: 'Ts', n: 'Teneso', l: 'Tennessine', r: 7, c: 17 },
  { z: 118, s: 'Og', n: 'Oganesón', l: 'Oganesson', r: 7, c: 18 },

  // Lantánidos (Bloque f)
  { z: 57, s: 'La', n: 'Lantano', l: 'Lanthanum', r: 8, c: 4, isF: true },
  { z: 58, s: 'Ce', n: 'Cerio', l: 'Cerium', r: 8, c: 5, isF: true },
  { z: 59, s: 'Pr', n: 'Praseodimio', l: 'Praseodymium', r: 8, c: 6, isF: true },
  { z: 60, s: 'Nd', n: 'Neodimio', l: 'Neodymium', r: 8, c: 7, isF: true },
  { z: 61, s: 'Pm', n: 'Prometio', l: 'Promethium', r: 8, c: 8, isF: true },
  { z: 62, s: 'Sm', n: 'Samario', l: 'Samarium', r: 8, c: 9, isF: true },
  { z: 63, s: 'Eu', n: 'Europio', l: 'Europium', r: 8, c: 10, isF: true },
  { z: 64, s: 'Gd', n: 'Gadolinio', l: 'Gadolinium', r: 8, c: 11, isF: true },
  { z: 65, s: 'Tb', n: 'Terbio', l: 'Terbium', r: 8, c: 12, isF: true },
  { z: 66, s: 'Dy', n: 'Disprosio', l: 'Dysprosium', r: 8, c: 13, isF: true },
  { z: 67, s: 'Ho', n: 'Holmio', l: 'Holmium', r: 8, c: 14, isF: true },
  { z: 68, s: 'Er', n: 'Erbio', l: 'Erbium', r: 8, c: 15, isF: true },
  { z: 69, s: 'Tm', n: 'Tulio', l: 'Thulium', r: 8, c: 16, isF: true },
  { z: 70, s: 'Yb', n: 'Iterbio', l: 'Ytterbium', r: 8, c: 17, isF: true },
  { z: 71, s: 'Lu', n: 'Lutecio', l: 'Lutetium', r: 8, c: 18, isF: true },

  // Actínidos (Bloque f)
  { z: 89, s: 'Ac', n: 'Actinio', l: 'Actinium', r: 9, c: 4, isF: true },
  { z: 90, s: 'Th', n: 'Torio', l: 'Thorium', r: 9, c: 5, isF: true },
  { z: 91, s: 'Pa', n: 'Protactinio', l: 'Protactinium', r: 9, c: 6, isF: true },
  { z: 92, s: 'U', n: 'Uranio', l: 'Uranium', r: 9, c: 7, isF: true },
  { z: 93, s: 'Np', n: 'Neptunio', l: 'Neptunium', r: 9, c: 8, isF: true },
  { z: 94, s: 'Pu', n: 'Plutonio', l: 'Plutonium', r: 9, c: 9, isF: true },
  { z: 95, s: 'Am', n: 'Americio', l: 'Americium', r: 9, c: 10, isF: true },
  { z: 96, s: 'Cm', n: 'Curio', l: 'Curium', r: 9, c: 11, isF: true },
  { z: 97, s: 'Bk', n: 'Berkelio', l: 'Berkelium', r: 9, c: 12, isF: true },
  { z: 98, s: 'Cf', n: 'Californio', l: 'Californium', r: 9, c: 13, isF: true },
  { z: 99, s: 'Es', n: 'Einstenio', l: 'Einsteinium', r: 9, c: 14, isF: true },
  { z: 100, s: 'Fm', n: 'Fermio', l: 'Fermium', r: 9, c: 15, isF: true },
  { z: 101, s: 'Md', n: 'Mendelevio', l: 'Mendelevium', r: 9, c: 16, isF: true },
  { z: 102, s: 'No', n: 'Nobelio', l: 'Nobelium', r: 9, c: 17, isF: true },
  { z: 103, s: 'Lr', n: 'Laurencio', l: 'Lawrencium', r: 9, c: 18, isF: true }
];

interface TileItem {
  id: string;
  elementZ: number;
  element: ElementData;
  type: 'name' | 'symbol';
  isDistractor: boolean;
  used: boolean;
}

interface TargetState {
  element: ElementData;
  given: 'symbol' | 'name';
  expectedType: 'name' | 'symbol';
  solved: boolean;
}

export default function RompecabezasSimbolosPage() {
  const [targetCount, setTargetCount] = useState<number>(10);
  const [targetStates, setTargetStates] = useState<Record<number, TargetState>>({});
  const [activeTargets, setActiveTargets] = useState<ElementData[]>([]);
  const [tiles, setTiles] = useState<TileItem[]>([]);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const [failCount, setFailCount] = useState<number>(0);
  const [errorCellZ, setErrorCellZ] = useState<number | null>(null);
  const [dragOverZ, setDragOverZ] = useState<number | null>(null);

  const startNewGame = useCallback(() => {
    setFailCount(0);
    setSelectedTileId(null);
    setErrorCellZ(null);

    // 1. Elegir elementos aleatorios
    const shuffled = [...ELEMENTS_DATA].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, targetCount);
    setActiveTargets(selected);

    // 2. Definir estado de cada objetivo
    const statesMap: Record<number, TargetState> = {};
    selected.forEach((el, index) => {
      const showSymbolOnTable = (index % 2 === 0);
      statesMap[el.z] = {
        element: el,
        given: showSymbolOnTable ? 'symbol' : 'name',
        expectedType: showSymbolOnTable ? 'name' : 'symbol',
        solved: false
      };
    });
    setTargetStates(statesMap);

    // 3. Crear fichas correctas
    const correctTiles: TileItem[] = selected.map(el => {
      const st = statesMap[el.z];
      return {
        id: `tile-correct-${el.z}-${st.expectedType}`,
        elementZ: el.z,
        element: el,
        type: st.expectedType,
        isDistractor: false,
        used: false
      };
    });

    // 4. Crear 5 distractores similares
    const targetZs = new Set(selected.map(e => e.z));
    const available = ELEMENTS_DATA.filter(e => !targetZs.has(e.z));
    const targetSymbols = selected.map(e => e.s);

    const smartDistractors = available.sort((a, b) => {
      const aSim = targetSymbols.some(ts => ts[0] === a.s[0] || a.n[0] === ts[0]) ? 1 : 0;
      const bSim = targetSymbols.some(ts => ts[0] === b.s[0] || b.n[0] === ts[0]) ? 1 : 0;
      return (bSim + Math.random()) - (aSim + Math.random());
    }).slice(0, 5);

    const distractorTiles: TileItem[] = smartDistractors.map(el => {
      const distType = Math.random() > 0.5 ? 'symbol' : 'name';
      return {
        id: `tile-dist-${el.z}-${distType}-${Math.random()}`,
        elementZ: el.z,
        element: el,
        type: distType,
        isDistractor: true,
        used: false
      };
    });

    // 5. Mezclar las 15 fichas
    const allTiles = [...correctTiles, ...distractorTiles].sort(() => 0.5 - Math.random());
    setTiles(allTiles);
  }, [targetCount]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleAttempt = (targetZ: number, tileId: string) => {
    const tile = tiles.find(t => t.id === tileId);
    const state = targetStates[targetZ];

    if (!tile || !state || state.solved || tile.used) return;

    if (tile.elementZ === targetZ && tile.type === state.expectedType) {
      // Acierto
      setTargetStates(prev => ({
        ...prev,
        [targetZ]: { ...prev[targetZ], solved: true }
      }));
      setTiles(prev => prev.map(t => t.id === tileId ? { ...t, used: true } : t));
      setSelectedTileId(null);
    } else {
      // Fallo
      setFailCount(f => f + 1);
      setErrorCellZ(targetZ);
      setTimeout(() => setErrorCellZ(null), 600);
    }
  };

  const handleShowSolutions = () => {
    setTargetStates(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(k => {
        const z = Number(k);
        updated[z] = { ...updated[z], solved: true };
      });
      return updated;
    });
    setTiles(prev => prev.map(t => ({ ...t, used: true })));
    setSelectedTileId(null);
  };

  const handleResetGame = () => {
    setFailCount(0);
    setSelectedTileId(null);
    setErrorCellZ(null);
    setTargetStates(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(k => {
        const z = Number(k);
        updated[z] = { ...updated[z], solved: false };
      });
      return updated;
    });
    setTiles(prev => prev.map(t => ({ ...t, used: false })));
  };

  const solvedCount = Object.values(targetStates).filter(s => s.solved).length;
  const isAllSolved = activeTargets.length > 0 && solvedCount === activeTargets.length;

  const renderCell = (r: number, c: number) => {
    // Casillas marcadoras de las series f en periodo 6 y 7
    if (r === 6 && c === 3) {
      return (
        <div key="marker-la" className="aspect-[1/1.15] text-[0.55rem] bg-base-dark/60 border border-dashed border-base-border rounded-sm flex items-center justify-center text-text-muted font-mono text-center leading-tight">
          57-71<br/>La-Lu
        </div>
      );
    }
    if (r === 7 && c === 3) {
      return (
        <div key="marker-ac" className="aspect-[1/1.15] text-[0.55rem] bg-base-dark/60 border border-dashed border-base-border rounded-sm flex items-center justify-center text-text-muted font-mono text-center leading-tight">
          89-103<br/>Ac-Lr
        </div>
      );
    }

    const el = ELEMENTS_DATA.find(e => !e.isF && e.r === r && e.c === c);
    if (!el) {
      return <div key={`empty-${r}-${c}`} className="invisible" />;
    }

    const isTarget = activeTargets.some(t => t.z === el.z);
    const state = targetStates[el.z];
    const isError = errorCellZ === el.z;
    const isDragOver = dragOverZ === el.z;

    if (!isTarget) {
      return (
        <div 
          key={el.z}
          className="aspect-[1/1.15] border border-base-border/50 bg-base-dark/40 rounded-sm p-1 flex flex-col items-center justify-center text-center relative opacity-40 hover:opacity-80 transition-opacity"
        >
          <span className="absolute top-0.5 left-1 text-[0.5rem] font-mono text-text-muted/60">{el.z}</span>
          <span className="font-bold text-xs text-text-muted">{el.s}</span>
          <span className="text-[0.45rem] text-text-muted truncate max-w-full px-0.5">{el.n}</span>
        </div>
      );
    }

    // Elemento objetivo
    const isSolved = state?.solved;

    return (
      <div
        key={el.z}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isSolved) setDragOverZ(el.z);
        }}
        onDragLeave={() => setDragOverZ(null)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOverZ(null);
          const tileId = e.dataTransfer.getData('text/plain');
          if (tileId) handleAttempt(el.z, tileId);
        }}
        onClick={() => {
          if (!isSolved && selectedTileId) {
            handleAttempt(el.z, selectedTileId);
          }
        }}
        className={`aspect-[1/1.15] rounded-sm p-1 flex flex-col items-center justify-center text-center relative transition-all cursor-pointer border
          ${isSolved ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-300 shadow-sm' :
            isError ? 'bg-red-950/60 border-red-500 text-red-300 animate-shake' :
            isDragOver ? 'bg-accent-gold/20 border-accent-gold scale-105 z-10' :
            'bg-base-dark border-dashed border-accent-gold/80 hover:border-accent-gold hover:bg-accent-gold/10'
          }
        `}
      >
        <span className={`absolute top-0.5 left-1 text-[0.52rem] font-mono ${isSolved ? 'text-emerald-400 font-bold' : 'text-accent-gold'}`}>
          {el.z}
        </span>

        {isSolved ? (
          <div className="flex flex-col items-center leading-tight">
            <span className="font-black text-sm text-emerald-300">{el.s}</span>
            <span className="font-medium text-[0.62rem] text-emerald-100">{el.n}</span>
            {el.l && <span className="text-[0.52rem] italic text-accent-gold/90 font-serif">({el.l})</span>}
          </div>
        ) : state.given === 'symbol' ? (
          <div className="flex flex-col items-center">
            <span className="font-black text-sm text-accent-gold leading-none mb-0.5">{el.s}</span>
            <span className="text-[0.5rem] bg-accent-gold/20 text-accent-gold px-1 rounded-sm border border-accent-gold/30">¿Nombre?</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-[0.52rem] bg-accent-gold/20 text-accent-gold px-1 rounded-sm border border-accent-gold/30 font-bold mb-0.5">¿?</span>
            <span className="font-semibold text-[0.6rem] text-text-main leading-tight">{el.n}</span>
            {el.l && <span className="text-[0.5rem] italic text-accent-gold/80 font-serif">({el.l})</span>}
          </div>
        )}
      </div>
    );
  };

  const renderFCell = (r: number, c: number) => {
    const el = ELEMENTS_DATA.find(e => e.isF && e.r === r && e.c === c);
    if (!el) return <div key={`empty-f-${r}-${c}`} className="invisible" />;

    const isTarget = activeTargets.some(t => t.z === el.z);
    const state = targetStates[el.z];
    const isSolved = state?.solved;
    const isError = errorCellZ === el.z;
    const isDragOver = dragOverZ === el.z;

    if (!isTarget) {
      return (
        <div 
          key={el.z}
          className="aspect-[1/1.15] border border-base-border/50 bg-base-dark/40 rounded-sm p-1 flex flex-col items-center justify-center text-center relative opacity-40 hover:opacity-80 transition-opacity"
        >
          <span className="absolute top-0.5 left-1 text-[0.5rem] font-mono text-text-muted/60">{el.z}</span>
          <span className="font-bold text-xs text-text-muted">{el.s}</span>
          <span className="text-[0.45rem] text-text-muted truncate max-w-full px-0.5">{el.n}</span>
        </div>
      );
    }

    return (
      <div
        key={el.z}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isSolved) setDragOverZ(el.z);
        }}
        onDragLeave={() => setDragOverZ(null)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOverZ(null);
          const tileId = e.dataTransfer.getData('text/plain');
          if (tileId) handleAttempt(el.z, tileId);
        }}
        onClick={() => {
          if (!isSolved && selectedTileId) {
            handleAttempt(el.z, selectedTileId);
          }
        }}
        className={`aspect-[1/1.15] rounded-sm p-1 flex flex-col items-center justify-center text-center relative transition-all cursor-pointer border
          ${isSolved ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-300 shadow-sm' :
            isError ? 'bg-red-950/60 border-red-500 text-red-300 animate-shake' :
            isDragOver ? 'bg-accent-gold/20 border-accent-gold scale-105 z-10' :
            'bg-base-dark border-dashed border-accent-gold/80 hover:border-accent-gold hover:bg-accent-gold/10'
          }
        `}
      >
        <span className={`absolute top-0.5 left-1 text-[0.52rem] font-mono ${isSolved ? 'text-emerald-400 font-bold' : 'text-accent-gold'}`}>
          {el.z}
        </span>

        {isSolved ? (
          <div className="flex flex-col items-center leading-tight">
            <span className="font-black text-sm text-emerald-300">{el.s}</span>
            <span className="font-medium text-[0.62rem] text-emerald-100">{el.n}</span>
            {el.l && <span className="text-[0.52rem] italic text-accent-gold/90 font-serif">({el.l})</span>}
          </div>
        ) : state.given === 'symbol' ? (
          <div className="flex flex-col items-center">
            <span className="font-black text-sm text-accent-gold leading-none mb-0.5">{el.s}</span>
            <span className="text-[0.5rem] bg-accent-gold/20 text-accent-gold px-1 rounded-sm border border-accent-gold/30">¿Nombre?</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-[0.52rem] bg-accent-gold/20 text-accent-gold px-1 rounded-sm border border-accent-gold/30 font-bold mb-0.5">¿?</span>
            <span className="font-semibold text-[0.6rem] text-text-main leading-tight">{el.n}</span>
            {el.l && <span className="text-[0.5rem] italic text-accent-gold/80 font-serif">({el.l})</span>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-base-dark p-3 md:p-8 font-sans text-text-main">
      <div className="max-w-[90rem] mx-auto">
        
        {/* Navegación y Encabezado integrado al estilo de la app */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            href="/apps" 
            className="text-accent-gold hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} /> Volver al Laboratorio
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">Elementos por ronda:</span>
            <select
              value={targetCount}
              onChange={(e) => setTargetCount(Number(e.target.value))}
              className="bg-base-surface border border-base-border text-accent-gold font-bold text-xs rounded-sm px-2 py-1 outline-none cursor-pointer focus:border-accent-gold"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        <header className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-accent-gold mb-2 flex items-center justify-center gap-3">
            <Sparkles className="text-accent-gold shrink-0" size={28} />
            Rompecabezas de Nombres, Símbolos y Raíces Latinas
          </h1>
          <p className="text-text-muted italic max-w-2xl mx-auto text-sm">
            Ubica los elementos químicos emparejando su símbolo con su nombre oficial y su raíz etimológica en latín.
          </p>
        </header>

        {/* Cuadro de Instrucciones Ultra Claras */}
        <div className="bg-base-surface border-2 border-accent-gold/40 rounded-sm p-4 md:p-5 mb-6 shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <Info className="text-accent-gold shrink-0" size={22} />
            <h2 className="text-base md:text-lg font-serif font-black text-accent-gold tracking-wide uppercase">
              INSTRUCCIONES (Paso a Paso)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed">
            {/* Paso 1 */}
            <div className="bg-base-dark/80 p-3 rounded-sm border border-base-border flex flex-col justify-between">
              <div>
                <span className="font-bold text-accent-gold font-mono text-sm block mb-1">1. Mira la Tabla</span>
                <p className="text-text-muted">
                  En la tabla de abajo hay casillas con borde <strong className="text-accent-gold">dorado punteado</strong>.
                  Si ves un símbolo (ej. <span className="text-accent-gold font-bold">Fe</span>), te pide su nombre (<span className="text-emerald-400 font-bold">Hierro</span>). Si ves un nombre, te pide su símbolo.
                </p>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="bg-base-dark/80 p-3 rounded-sm border border-base-border flex flex-col justify-between">
              <div>
                <span className="font-bold text-accent-gold font-mono text-sm block mb-1">2. Elige tu Método</span>
                <p className="text-text-muted">
                  Puedes hacerlo de <strong>DOS FORMAS MUY FÁCILES</strong>:
                </p>
                <ul className="mt-1.5 space-y-1 text-[0.72rem] text-text-main">
                  <li className="flex items-center gap-1.5">
                    <Move size={13} className="text-accent-gold shrink-0" />
                    <span><strong>Arrastrar:</strong> Toma la ficha y suéltala sobre su casilla.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <MousePointerClick size={13} className="text-accent-gold shrink-0" />
                    <span><strong>O con 2 Clics:</strong> Haz clic a la ficha y luego clic a su casilla.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="bg-base-dark/80 p-3 rounded-sm border border-base-border flex flex-col justify-between">
              <div>
                <span className="font-bold text-accent-gold font-mono text-sm block mb-1">3. ¡Cuidado con las Trampas!</span>
                <p className="text-text-muted">
                  En el banco de fichas hay <strong className="text-red-400">5 fichas trampa</strong> que se parecen mucho pero son incorrectas (ej. confundir <em>Ca</em> con <em>Cd</em> o <em>Co</em>). Si te equivocas, la casilla parpadeará en rojo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Banco de Fichas / Etiquetas (Arriba de la tabla) */}
        <div className="bg-base-surface border border-base-border rounded-sm p-4 md:p-5 shadow-xl mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
            <div>
              <h2 className="font-serif text-accent-gold text-base font-bold flex items-center gap-2">
                <BookOpen size={18} /> Banco de Fichas Disponibles ({tiles.filter(t => !t.used).length} restantes)
              </h2>
              <p className="text-xs text-text-muted">
                Arrastra una ficha a su casilla en la tabla, o <strong>haz clic en una ficha y después clic en su casilla</strong>.
              </p>
            </div>

            {selectedTileId && (
              <div className="text-xs bg-accent-gold/20 text-accent-gold border border-accent-gold/40 px-3 py-1.5 rounded-sm animate-pulse flex items-center gap-1.5 font-bold">
                <HelpCircle size={15} /> Ficha seleccionada lista: Ahora haz clic sobre su casilla en la tabla periódica
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5 justify-center min-h-[90px] p-3 bg-base-dark rounded-sm border border-base-border/70">
            {tiles.map((tile) => {
              const isSelected = selectedTileId === tile.id;
              
              if (tile.used) {
                return (
                  <div 
                    key={tile.id}
                    className="p-2.5 rounded-sm border border-base-border/30 bg-base-surface/20 opacity-20 min-w-[100px] text-center pointer-events-none"
                  >
                    <span className="text-xs font-mono text-text-muted line-through">Colocada ✓</span>
                  </div>
                );
              }

              return (
                <div
                  key={tile.id}
                  draggable={!tile.used}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', tile.id);
                    setSelectedTileId(tile.id);
                  }}
                  onClick={() => {
                    setSelectedTileId(prev => prev === tile.id ? null : tile.id);
                  }}
                  className={`cursor-grab active:cursor-grabbing p-2.5 rounded-sm min-w-[100px] max-w-[140px] flex flex-col items-center justify-center text-center transition-all select-none border
                    ${isSelected ? 'bg-accent-gold text-base-dark border-accent-gold shadow-lg scale-105 font-bold ring-2 ring-accent-gold/50' :
                      'bg-base-surface hover:bg-base-surface/80 border-base-border hover:border-accent-gold text-text-main shadow-sm hover:-translate-y-0.5'
                    }
                  `}
                >
                  {tile.type === 'symbol' ? (
                    <>
                      <span className={`text-xl font-black ${isSelected ? 'text-base-dark' : 'text-accent-gold'}`}>
                        {tile.element.s}
                      </span>
                      <span className="text-[0.55rem] uppercase tracking-wider opacity-60 font-mono">Símbolo</span>
                    </>
                  ) : (
                    <>
                      <span className={`font-bold text-sm ${isSelected ? 'text-base-dark' : 'text-text-main'}`}>
                        {tile.element.n}
                      </span>
                      {tile.element.l && (
                        <span className={`text-[0.55rem] italic font-serif leading-tight ${isSelected ? 'text-base-dark/80 font-medium' : 'text-accent-gold'}`}>
                          ({tile.element.l})
                        </span>
                      )}
                      <span className="text-[0.52rem] uppercase tracking-wider opacity-60 font-mono mt-0.5">Nombre</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Barra de Controles y Estadísticas */}
        <div className="bg-base-surface border border-base-border rounded-sm p-3 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-base-dark border border-base-border px-3 py-1.5 rounded-sm flex items-center gap-2">
              <span className="text-xs text-text-muted">Progreso:</span>
              <span className="font-mono font-bold text-accent-gold text-sm">{solvedCount} / {activeTargets.length}</span>
            </div>
            
            <div className="bg-base-dark border border-base-border px-3 py-1.5 rounded-sm flex items-center gap-2">
              <span className="text-xs text-text-muted">Fallos:</span>
              <span className={`font-mono font-bold text-sm ${failCount > 0 ? 'text-red-400' : 'text-text-main'}`}>
                {failCount}
              </span>
            </div>

            {isAllSolved && (
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-950/60 border border-emerald-500/50 px-3 py-1.5 rounded-sm">
                <CheckCircle2 size={16} /> ¡Completado exitosamente!
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleShowSolutions}
              className="flex items-center gap-2 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-600/60 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors"
            >
              <Eye size={15} /> Ver Soluciones
            </button>

            <button
              onClick={handleResetGame}
              className="flex items-center gap-2 bg-base-dark hover:bg-base-dark/80 text-text-muted hover:text-text-main border border-base-border px-3 py-1.5 rounded-sm text-xs font-medium transition-colors"
            >
              <RotateCcw size={15} /> Reiniciar
            </button>

            <button
              onClick={startNewGame}
              className="flex items-center gap-2 bg-accent-gold/10 hover:bg-accent-gold text-accent-gold hover:text-base-dark border border-accent-gold px-4 py-1.5 rounded-sm text-xs font-serif font-bold transition-all"
            >
              <RefreshCw size={15} /> Nuevo Ejercicio
            </button>
          </div>
        </div>

        {/* Tablero de la Tabla Periódica */}
        <div className="bg-base-surface border border-base-border rounded-sm p-4 shadow-xl mb-6 overflow-x-auto">
          <div className="min-w-[920px]">
            {/* Encabezados de Columnas (1-18) */}
            <div className="grid grid-cols-18 gap-1 mb-1 text-center font-mono text-[0.65rem] text-text-muted/70">
              {Array.from({ length: 18 }, (_, i) => (
                <div key={i + 1}>{i + 1}</div>
              ))}
            </div>

            {/* Grid Principal (Periodos 1 a 7) */}
            <div className="grid grid-cols-18 gap-1">
              {Array.from({ length: 7 }, (_, rIndex) => (
                Array.from({ length: 18 }, (_, cIndex) => renderCell(rIndex + 1, cIndex + 1))
              ))}
            </div>

            {/* Separador visual para Lantánidos y Actínidos */}
            <div className="mt-4 pt-3 border-t border-base-border/60">
              <div className="text-[0.65rem] font-serif text-accent-gold/80 uppercase tracking-widest mb-1.5 ml-14">
                Series de Lantánidos y Actínidos (Bloque f)
              </div>
              <div className="grid grid-cols-18 gap-1">
                {Array.from({ length: 2 }, (_, rIndex) => (
                  Array.from({ length: 18 }, (_, cIndex) => {
                    const col = cIndex + 1;
                    if (col < 4) return <div key={`spacer-${rIndex}-${col}`} className="invisible" />;
                    return renderFCell(rIndex + 8, col);
                  })
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Informativo */}
        <footer className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="bg-base-surface p-5 rounded-sm border border-base-border flex items-start gap-4 max-w-2xl shadow-sm w-full md:w-auto">
            <AlertCircle className="text-accent-gold shrink-0 mt-1" size={24} />
            <div className="text-sm text-text-muted leading-relaxed">
              <p className="font-serif text-text-main mb-2 font-bold">Guía de Raíces Latinas Notables:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-xs">
                <div><strong className="text-text-main">Au:</strong> Oro <em>(Aurum)</em></div>
                <div><strong className="text-text-main">Ag:</strong> Plata <em>(Argentum)</em></div>
                <div><strong className="text-text-main">Fe:</strong> Hierro <em>(Ferrum)</em></div>
                <div><strong className="text-text-main">Cu:</strong> Cobre <em>(Cuprum)</em></div>
                <div><strong className="text-text-main">Na:</strong> Sodio <em>(Natrium)</em></div>
                <div><strong className="text-text-main">K:</strong> Potasio <em>(Kalium)</em></div>
                <div><strong className="text-text-main">Pb:</strong> Plomo <em>(Plumbum)</em></div>
                <div><strong className="text-text-main">Sn:</strong> Estaño <em>(Stannum)</em></div>
                <div><strong className="text-text-main">Sb:</strong> Antimonio <em>(Stibium)</em></div>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}