"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Trophy, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Timer, 
  CheckCircle2, 
  HelpCircle,
  BrainCircuit,
  Zap,
  Flame
} from 'lucide-react';

type GameLevel = 'basico' | 'avanzado' | 'experto';

interface MultiplicationPair {
  pairId: string;
  factorA: number;
  factorB: number;
  result: number;
  matched: boolean;
}

interface CardItem {
  id: string;
  pairId: string;
  type: 'operation' | 'result';
  text: string;
  subText?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// Generador de sonidos limpios con Web Audio API (sin archivos externos)
class SoundFX {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playFlip() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  playMatch() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);
      gain.gain.setValueAtTime(0.12, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.25);
    });
  }

  playMismatch() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(160, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }

  playVictory() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.4);
    });
  }
}

const sfx = new SoundFX();

export default function MemoramaTablasPage() {
  const [level, setLevel] = useState<GameLevel>('basico');
  const [pairs, setPairs] = useState<MultiplicationPair[]>([]);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [matches, setMatches] = useState<number>(0);
  const [showGuide, setShowGuide] = useState<boolean>(true);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateNewGame = useCallback((targetLevel: GameLevel = level) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFlippedIndices([]);
    setIsLocked(false);
    setAttempts(0);
    setMatches(0);
    setStreak(0);
    setSecondsElapsed(0);
    setIsTimerActive(false);
    setIsGameWon(false);

    // Ajustar visibilidad inicial de la lista guía según nivel
    if (targetLevel === 'experto') {
      setShowGuide(false);
    } else {
      setShowGuide(true);
    }

    // 1. Generar 8 multiplicaciones con resultados ÚNICOS para evitar ambigüedades
    const selectedPairs: MultiplicationPair[] = [];
    const usedResults = new Set<number>();
    const usedOperations = new Set<string>();

    let minFactor = 2;
    let maxFactor = 5;
    let multiplierLimit = 10;

    if (targetLevel === 'avanzado') {
      minFactor = 2;
      maxFactor = 9;
      multiplierLimit = 10;
    } else if (targetLevel === 'experto') {
      minFactor = 1;
      maxFactor = 12;
      multiplierLimit = 12;
    }

    // Pool de posibles operaciones
    const pool: { a: number; b: number; res: number }[] = [];
    for (let a = minFactor; a <= maxFactor; a++) {
      for (let b = 1; b <= multiplierLimit; b++) {
        // En nivel avanzado y experto evitar 1xN para que tenga mayor reto
        if (targetLevel !== 'experto' && (a === 1 || b === 1)) continue;
        pool.push({ a, b, res: a * b });
      }
    }

    // Mezclar el pool
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());

    for (const op of shuffledPool) {
      if (selectedPairs.length >= 8) break;
      const opKey = `${op.a}x${op.b}`;
      const revOpKey = `${op.b}x${op.a}`;

      // Garantizamos resultados únicos entre las 8 cartas para que el memorama sea 100% justo
      if (!usedResults.has(op.res) && !usedOperations.has(opKey) && !usedOperations.has(revOpKey)) {
        usedResults.add(op.res);
        usedOperations.add(opKey);
        usedOperations.add(revOpKey);

        selectedPairs.push({
          pairId: `pair-${op.a}-${op.b}`,
          factorA: op.a,
          factorB: op.b,
          result: op.res,
          matched: false
        });
      }
    }

    // En el caso muy raro de no completar 8 resultados únicos por rango, rellenar permitiendo variación
    if (selectedPairs.length < 8) {
      for (const op of shuffledPool) {
        if (selectedPairs.length >= 8) break;
        const opKey = `${op.a}x${op.b}`;
        if (!usedOperations.has(opKey)) {
          usedOperations.add(opKey);
          selectedPairs.push({
            pairId: `pair-${op.a}-${op.b}-${Math.random()}`,
            factorA: op.a,
            factorB: op.b,
            result: op.res,
            matched: false
          });
        }
      }
    }

    setPairs(selectedPairs);

    // 2. Crear las 16 cartas (8 operaciones y 8 resultados)
    const newCards: CardItem[] = [];
    selectedPairs.forEach((p) => {
      // Tarjeta de la Operación
      newCards.push({
        id: `card-op-${p.pairId}`,
        pairId: p.pairId,
        type: 'operation',
        text: `${p.factorA} × ${p.factorB}`,
        subText: 'Multiplicación',
        isFlipped: false,
        isMatched: false
      });

      // Tarjeta del Resultado
      newCards.push({
        id: `card-res-${p.pairId}`,
        pairId: p.pairId,
        type: 'result',
        text: `${p.result}`,
        subText: 'Producto',
        isFlipped: false,
        isMatched: false
      });
    });

    // Barajar las 16 cartas (4x4)
    const randomizedCards = [...newCards].sort(() => 0.5 - Math.random());
    setCards(randomizedCards);
  }, [level]);

  useEffect(() => {
    generateNewGame(level);
  }, [level, generateNewGame]);

  useEffect(() => {
    if (isTimerActive && !isGameWon) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive, isGameWon]);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sfx.enabled = next;
  };

  const handleCardClick = (index: number) => {
    if (isLocked) return;
    const clickedCard = cards[index];
    if (clickedCard.isMatched || clickedCard.isFlipped) return;

    // Iniciar temporizador al primer clic
    if (!isTimerActive && !isGameWon) {
      setIsTimerActive(true);
    }

    sfx.playFlip();

    // Voltear la carta seleccionada
    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);

    const currentFlipped = [...flippedIndices, index];
    setFlippedIndices(currentFlipped);

    // Si volteó 2 cartas, evaluar pareja
    if (currentFlipped.length === 2) {
      setIsLocked(true);
      setAttempts((a) => a + 1);

      const [firstIdx, secondIdx] = currentFlipped;
      const card1 = updatedCards[firstIdx];
      const card2 = updatedCards[secondIdx];

      const isMatch = card1.pairId === card2.pairId && card1.type !== card2.type;

      if (isMatch) {
        // Acierto
        sfx.playMatch();
        setStreak((s) => s + 1);
        setMatches((m) => {
          const newMatches = m + 1;
          if (newMatches === 8) {
            setIsGameWon(true);
            setIsTimerActive(false);
            sfx.playVictory();
          }
          return newMatches;
        });

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === firstIdx || idx === secondIdx
                ? { ...c, isMatched: true, isFlipped: true }
                : c
            )
          );
          setPairs((prev) =>
            prev.map((p) => (p.pairId === card1.pairId ? { ...p, matched: true } : p))
          );
          setFlippedIndices([]);
          setIsLocked(false);
        }, 400);
      } else {
        // Fallo
        sfx.playMismatch();
        setStreak(0);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === firstIdx || idx === secondIdx
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1100);
      }
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-base-dark p-3 md:p-8 font-sans text-text-main select-none">
      {/* Estilos CSS nativos para garantizar el efecto 3D flip en cualquier navegador */}
      <style>{`
        .memorama-perspective {
          perspective: 1000px;
          -webkit-perspective: 1000px;
        }
        .memorama-flipper {
          transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
          -webkit-transform-style: preserve-3d;
          position: relative;
          width: 100%;
          height: 100%;
        }
        .memorama-flipper.is-flipped {
          transform: rotateY(180deg);
          -webkit-transform: rotateY(180deg);
        }
        .memorama-face {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .memorama-back {
          transform: rotateY(0deg);
          -webkit-transform: rotateY(0deg);
          z-index: 2;
        }
        .memorama-front {
          transform: rotateY(180deg);
          -webkit-transform: rotateY(180deg);
          z-index: 1;
        }
        .memorama-flipper.is-flipped .memorama-front {
          z-index: 3;
        }
        .memorama-flipper.is-flipped .memorama-back {
          z-index: 1;
        }
      `}</style>

      <div className="max-w-[85rem] mx-auto">
        
        {/* Navegación superior */}
        <div className="mb-4 flex items-center justify-between">
          <Link 
            href="/apps" 
            className="text-accent-gold hover:text-white flex items-center gap-2 text-xs md:text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} /> Volver al Laboratorio
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleSound}
              className="p-1.5 rounded-sm bg-base-surface border border-base-border text-accent-gold hover:text-white transition-colors"
              title={soundOn ? 'Silenciar sonidos' : 'Activar sonidos'}
            >
              {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            <button
              onClick={() => generateNewGame(level)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-gold/10 hover:bg-accent-gold text-accent-gold hover:text-base-dark border border-accent-gold rounded-sm text-xs font-serif font-bold transition-all shadow-sm"
            >
              <RotateCcw size={14} /> Nueva Partida
            </button>
          </div>
        </div>

        <header className="mb-6 text-center">
          <h1 className="text-2xl md:text-4xl font-serif text-accent-gold mb-1.5 flex items-center justify-center gap-2.5">
            <BrainCircuit className="text-accent-gold shrink-0" size={28} />
            Memorama de Tablas de Multiplicar
          </h1>
          <p className="text-text-muted italic max-w-xl mx-auto text-xs md:text-sm">
            Encuentra las 8 parejas asociando cada operación de multiplicación con su resultado correcto en el tablero de 4×4.
          </p>
        </header>

        {}
        <div className="bg-base-surface border border-base-border rounded-sm p-3 mb-5 shadow-lg flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-serif uppercase tracking-wider text-text-muted">Nivel:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setLevel('basico')}
                className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all ${
                  level === 'basico'
                    ? 'bg-accent-gold text-base-dark shadow-md font-black'
                    : 'bg-base-dark border border-base-border text-text-muted hover:text-accent-gold'
                }`}
              >
                1. Básico (Tablas 2 al 5)
              </button>

              <button
                onClick={() => setLevel('avanzado')}
                className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all ${
                  level === 'avanzado'
                    ? 'bg-accent-gold text-base-dark shadow-md font-black'
                    : 'bg-base-dark border border-base-border text-text-muted hover:text-accent-gold'
                }`}
              >
                2. Avanzado (Tablas 2 al 9)
              </button>

              <button
                onClick={() => setLevel('experto')}
                className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all ${
                  level === 'experto'
                    ? 'bg-accent-gold text-base-dark shadow-md font-black'
                    : 'bg-base-dark border border-base-border text-text-muted hover:text-accent-gold'
                }`}
              >
                3. Experto (Tablas 1 al 12)
              </button>
            </div>
          </div>

          {/* Estadísticas en vivo */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="bg-base-dark border border-base-border px-2.5 py-1 rounded-sm flex items-center gap-1.5 text-accent-gold">
              <Timer size={14} />
              <span>{formatTime(secondsElapsed)}</span>
            </div>

            <div className="bg-base-dark border border-base-border px-2.5 py-1 rounded-sm text-text-muted">
              Intentos: <strong className="text-text-main">{attempts}</strong>
            </div>

            <div className="bg-base-dark border border-base-border px-2.5 py-1 rounded-sm text-text-muted">
              Aciertos: <strong className="text-emerald-400 font-bold">{matches} / 8</strong>
            </div>

            {streak >= 2 && (
              <div className="bg-accent-gold/20 text-accent-gold border border-accent-gold/40 px-2 py-1 rounded-sm flex items-center gap-1 font-bold animate-pulse">
                <Flame size={13} /> {streak} seguidos
              </div>
            )}
          </div>
        </div>

        {}
        <div className="bg-base-surface border border-accent-gold/30 rounded-sm p-3.5 mb-5 text-xs text-text-muted leading-relaxed">
          <div className="flex items-start gap-2.5">
            <HelpCircle className="text-accent-gold shrink-0 mt-0.5" size={18} />
            <div>
              <strong className="text-accent-gold font-serif uppercase tracking-wider block mb-1">
                ¿Cómo jugar?
              </strong>
              <p>
                Haz clic o pulsa sobre <strong>dos tarjetas</strong> para voltearlas. Una tarjeta contiene la multiplicación (ej. <span className="text-text-main font-bold">4 × 7</span>) y su pareja contiene el producto (ej. <span className="text-emerald-400 font-bold">28</span>). Si coinciden, quedarán descubiertas permanentemente.
                {level === 'basico' && ' A la derecha tienes la guía completa de las multiplicaciones de esta ronda.'}
                {level === 'avanzado' && ' Puedes ocultar o mostrar la guía de apoyo según tu confianza.'}
                {level === 'experto' && ' ¡En el modo experto no hay acordeón! Todo depende de tu memoria y cálculo mental.'}
              </p>
            </div>
          </div>
        </div>

        {/* ZONA PRINCIPAL DE JUEGO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* TABLERO DE 4x4 (16 CARTAS) */}
          <div className="lg:col-span-8 bg-base-surface border border-base-border rounded-sm p-4 md:p-6 shadow-xl flex flex-col items-center">
            
            <div className="w-full max-w-[560px] aspect-square grid grid-cols-4 grid-rows-4 gap-2.5 md:gap-3.5">
              {cards.map((card, idx) => {
                const isSelected = flippedIndices.includes(idx);
                const showFace = card.isFlipped || card.isMatched;

                return (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(idx)}
                    className="relative w-full h-full cursor-pointer memorama-perspective"
                  >
                    <div
                      className={`memorama-flipper rounded-sm border shadow-md ${
                        showFace ? 'is-flipped' : 'hover:scale-[1.02] active:scale-95'
                      } ${
                        card.isMatched
                          ? 'border-emerald-500 bg-emerald-950/40 shadow-emerald-950/50'
                          : isSelected
                          ? 'border-accent-gold bg-base-surface ring-2 ring-accent-gold/40'
                          : 'border-base-border bg-base-dark hover:border-accent-gold/60'
                      }`}
                    >
                      {/* REVERSO DE LA CARTA (Estrella y número cuando está boca abajo) */}
                      <div className="memorama-face memorama-back rounded-sm bg-base-dark p-2 border border-base-border/70">
                        <div className="w-9 h-9 md:w-11 md:h-11 rounded-sm border border-dashed border-accent-gold/40 flex items-center justify-center bg-base-surface/40">
                          <Sparkles className="text-accent-gold/70" size={18} />
                        </div>
                        <span className="text-[0.62rem] font-mono text-text-muted mt-2 uppercase tracking-widest">
                          {idx + 1}
                        </span>
                      </div>

                      {/* FRENTE DE LA CARTA (Operación o Resultado cuando se voltea) */}
                      <div className="memorama-face memorama-front rounded-sm p-2 bg-base-surface">
                        <span className="text-[0.55rem] uppercase font-mono tracking-widest text-text-muted mb-1">
                          {card.type === 'operation' ? 'Factor' : 'Producto'}
                        </span>
                        
                        <span
                          className={`font-black leading-tight tracking-tight ${
                            card.type === 'operation'
                              ? 'text-lg sm:text-2xl md:text-3xl text-accent-gold font-serif'
                              : 'text-2xl sm:text-3xl md:text-4xl text-emerald-400 font-mono'
                          }`}
                        >
                          {card.text}
                        </span>

                        {card.isMatched && (
                          <div className="mt-1 flex items-center gap-1 text-[0.6rem] text-emerald-400 font-bold uppercase tracking-wider">
                            <CheckCircle2 size={11} /> Pareja
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between w-full max-w-[560px] text-xs text-text-muted font-mono px-1">
              <span>Tablero 4×4 (16 tarjetas)</span>
              <span>8 multiplicaciones en juego</span>
            </div>
          </div>

          {}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Panel de Acordeón / Guía de Respuestas */}
            <div className="bg-base-surface border border-base-border rounded-sm p-4 shadow-xl">
              <div className="flex items-center justify-between mb-3 border-b border-base-border/80 pb-2.5">
                <div>
                  <h3 className="font-serif text-accent-gold text-sm font-bold flex items-center gap-1.5">
                    <Zap size={16} /> Guía de Tablas en Juego
                  </h3>
                  <span className="text-[0.65rem] text-text-muted">
                    {level === 'experto' ? 'Desactivado en modo experto' : 'Se tachan al descubrir la pareja'}
                  </span>
                </div>

                {level === 'avanzado' && (
                  <button
                    onClick={() => setShowGuide(!showGuide)}
                    className="flex items-center gap-1 text-[0.7rem] bg-base-dark border border-base-border px-2 py-1 rounded-sm text-text-muted hover:text-accent-gold transition-colors"
                  >
                    {showGuide ? <EyeOff size={13} /> : <Eye size={13} />}
                    <span>{showGuide ? 'Ocultar' : 'Mostrar'}</span>
                  </button>
                )}
              </div>

              {level === 'experto' ? (
                <div className="p-6 text-center border border-dashed border-base-border/60 rounded-sm bg-base-dark/50 text-text-muted text-xs leading-relaxed">
                  <BrainCircuit size={28} className="mx-auto text-accent-gold/50 mb-2" />
                  <strong className="text-text-main block mb-1">¡Modo Experto Activo!</strong>
                  La lista de apoyo está bloqueada para entrenar tu velocidad mental y memorización pura de las tablas del 1 al 12.
                </div>
              ) : !showGuide ? (
                <div className="p-6 text-center border border-dashed border-base-border/60 rounded-sm bg-base-dark/50 text-text-muted text-xs leading-relaxed">
                  <EyeOff size={28} className="mx-auto text-text-muted/60 mb-2" />
                  <strong className="text-text-main block mb-1">Guía oculta</strong>
                  Haz clic en &quot;Mostrar&quot; arriba si necesitas una pista para recordar los resultados.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                  {pairs.map((p) => {
                    return (
                      <div
                        key={p.pairId}
                        className={`p-2 rounded-sm border text-xs font-mono flex items-center justify-between transition-all ${
                          p.matched
                            ? 'bg-emerald-950/40 border-emerald-500/70 text-emerald-300'
                            : 'bg-base-dark border-base-border/70 text-text-main'
                        }`}
                      >
                        <span className="font-bold">
                          {p.factorA} × {p.factorB}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className={p.matched ? 'text-emerald-400 font-black' : 'text-accent-gold font-bold'}>
                            = {p.result}
                          </span>
                          {p.matched && <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cuadro de resumen pedagógico */}
            <div className="bg-base-surface border border-base-border rounded-sm p-4 text-xs text-text-muted space-y-2">
              <span className="font-serif text-text-main font-bold block text-sm">Consejos para el Alumno:</span>
              <ul className="space-y-1.5 list-disc list-inside text-[0.75rem]">
                <li>Recuerda la propiedad conmutativa: <strong className="text-text-main">a × b = b × a</strong>.</li>
                <li>Si dudas del resultado, puedes sumar sucesivamente o apoyarte en tablas conocidas (como la del 2 o la del 5).</li>
                <li>Intenta retener la ubicación visual de los números grandes en las esquinas.</li>
              </ul>
            </div>

          </div>
        </div>

        {}
        {isGameWon && (
          <div className="fixed inset-0 bg-base-dark/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-base-surface border-2 border-accent-gold rounded-sm max-w-md w-full p-6 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-accent-gold/20 border border-accent-gold rounded-full flex items-center justify-center mx-auto mb-4 text-accent-gold">
                <Trophy size={36} />
              </div>

              <h2 className="text-2xl font-serif text-accent-gold font-bold mb-1">
                ¡Memorama Completado!
              </h2>
              <p className="text-xs text-text-muted mb-5">
                Has encontrado con éxito las 8 parejas de multiplicaciones en el nivel{' '}
                <strong className="text-text-main capitalize">{level}</strong>.
              </p>

              <div className="grid grid-cols-3 gap-2.5 bg-base-dark p-3.5 rounded-sm border border-base-border mb-6 font-mono text-xs">
                <div>
                  <span className="text-text-muted block text-[0.68rem]">Tiempo</span>
                  <strong className="text-accent-gold text-sm">{formatTime(secondsElapsed)}</strong>
                </div>
                <div>
                  <span className="text-text-muted block text-[0.68rem]">Intentos</span>
                  <strong className="text-accent-gold text-sm">{attempts}</strong>
                </div>
                <div>
                  <span className="text-text-muted block text-[0.68rem]">Efectividad</span>
                  <strong className="text-emerald-400 text-sm">
                    {Math.round((8 / Math.max(attempts, 8)) * 100)}%
                  </strong>
                </div>
              </div>

              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => generateNewGame(level)}
                  className="w-full py-2.5 bg-accent-gold hover:bg-accent-gold/90 text-base-dark font-serif font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-md"
                >
                  Jugar Otra Ronda
                </button>
                {level !== 'experto' && (
                  <button
                    onClick={() => {
                      setLevel(level === 'basico' ? 'avanzado' : 'experto');
                    }}
                    className="w-full py-2.5 bg-base-dark hover:bg-base-dark/80 text-accent-gold border border-accent-gold font-serif font-bold text-xs uppercase tracking-wider rounded-sm transition-all"
                  >
                    Subir de Nivel
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}