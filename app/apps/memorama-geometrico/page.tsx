"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Triangle, Square, Circle, RectangleHorizontal, Trophy } from 'lucide-react';

// Definición de las cartas y sus parejas
const CARD_PAIRS = [
  // Triángulo
  { id: 't-p-1', type: 'shape', shape: 'triangle', filled: false, label: 'Perímetro', matchId: 'tri-perim' },
  { id: 't-p-2', type: 'formula', text: 'P = L + L + L', matchId: 'tri-perim' },
  { id: 't-a-1', type: 'shape', shape: 'triangle', filled: true, label: 'Área', matchId: 'tri-area' },
  { id: 't-a-2', type: 'formula', text: 'A = (b × h) / 2', matchId: 'tri-area' },
  
  // Cuadrado
  { id: 's-p-1', type: 'shape', shape: 'square', filled: false, label: 'Perímetro', matchId: 'sq-perim' },
  { id: 's-p-2', type: 'formula', text: 'P = 4L', matchId: 'sq-perim' },
  { id: 's-a-1', type: 'shape', shape: 'square', filled: true, label: 'Área', matchId: 'sq-area' },
  { id: 's-a-2', type: 'formula', text: 'A = L²', matchId: 'sq-area' },
  
  // Rectángulo
  { id: 'r-p-1', type: 'shape', shape: 'rectangle', filled: false, label: 'Perímetro', matchId: 'rect-perim' },
  { id: 'r-p-2', type: 'formula', text: 'P = 2b + 2h', matchId: 'rect-perim' },
  { id: 'r-a-1', type: 'shape', shape: 'rectangle', filled: true, label: 'Área', matchId: 'rect-area' },
  { id: 'r-a-2', type: 'formula', text: 'A = b × h', matchId: 'rect-area' },
  
  // Círculo
  { id: 'c-p-1', type: 'shape', shape: 'circle', filled: false, label: 'Perímetro', matchId: 'circ-perim' },
  { id: 'c-p-2', type: 'formula', text: 'P = 2πr', matchId: 'circ-perim' },
  { id: 'c-a-1', type: 'shape', shape: 'circle', filled: true, label: 'Área', matchId: 'circ-area' },
  { id: 'c-a-2', type: 'formula', text: 'A = πr²', matchId: 'circ-area' },
];

export default function MemoramaPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Inicializar y barajar el juego
  const initializeGame = () => {
    const shuffledCards = [...CARD_PAIRS].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedIndices([]);
    setMatchedIds([]);
    setMoves(0);
    setIsProcessing(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  // Manejar el clic en una carta
  const handleCardClick = (index: number) => {
    // Evitar clics si está procesando, si la carta ya está volteada o si ya fue emparejada
    if (
      isProcessing || 
      flippedIndices.includes(index) || 
      matchedIds.includes(cards[index].matchId)
    ) {
      return;
    }

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      setMoves(prev => prev + 1);

      const [firstIndex, secondIndex] = newFlipped;
      
      // Comprobar si coinciden
      if (cards[firstIndex].matchId === cards[secondIndex].matchId) {
        setMatchedIds(prev => [...prev, cards[firstIndex].matchId]);
        setFlippedIndices([]);
        setIsProcessing(false);
      } else {
        // Si no coinciden, esperar 1 segundo y voltearlas de nuevo
        setTimeout(() => {
          setFlippedIndices([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  // Renderizar el ícono de la figura
  const renderShape = (shape: string, filled: boolean) => {
    const props = { 
      size: 48, 
      className: `mb-2 ${filled ? 'text-accent-gold' : 'text-text-main'}`,
      fill: filled ? 'currentColor' : 'none',
      strokeWidth: 1.5
    };

    switch (shape) {
      case 'triangle': return <Triangle {...props} />;
      case 'square': return <Square {...props} />;
      case 'rectangle': return <RectangleHorizontal {...props} />;
      case 'circle': return <Circle {...props} />;
      default: return null;
    }
  };

  // Formatear fórmulas matemáticas con CSS puro
  const renderFormula = (text: string) => {
    if (text === 'A = (b × h) / 2') {
      return (
        <div className="flex items-center gap-2 text-xl font-serif">
          <span>A =</span>
          <div className="flex flex-col items-center">
            <span className="border-b border-current px-2 leading-tight">b × h</span>
            <span className="leading-tight mt-0.5">2</span>
          </div>
        </div>
      );
    }
    return <span className="text-xl font-serif">{text}</span>;
  };

  const isGameWon = matchedIds.length === CARD_PAIRS.length / 2;

  return (
    <div className="min-h-screen bg-base-dark p-4 md:p-8 font-sans text-text-main flex flex-col items-center">
      <div className="w-full max-w-4xl">
        
        {/* Navegación */}
        <div className="mb-6 w-full text-left">
          <Link href="/apps" className="text-accent-gold hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
            ← Volver al Laboratorio
          </Link>
        </div>

        <header className="mb-8 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-left">
            <h1 className="text-3xl font-serif text-accent-gold mb-1">Memorama Geométrico</h1>
            <p className="text-text-muted italic text-sm">Empareja el concepto visual con su fórmula correcta.</p>
          </div>
          
          <div className="flex items-center gap-6 bg-base-surface border border-base-border px-6 py-3 rounded-sm">
            <div className="flex flex-col items-center">
              <span className="text-xs text-text-muted uppercase">Movimientos</span>
              <span className="text-2xl font-mono text-text-main">{moves}</span>
            </div>
            <button 
              onClick={initializeGame}
              className="p-2 text-text-muted hover:text-accent-gold hover:bg-accent-gold/10 rounded-sm transition-colors border border-transparent hover:border-accent-gold/30"
              title="Reiniciar Juego"
            >
              <RefreshCw size={24} />
            </button>
          </div>
        </header>

        {isGameWon && (
          <div className="mb-8 bg-green-500/10 border border-green-500/30 text-green-400 p-6 rounded-sm flex flex-col items-center justify-center animate-in zoom-in duration-500 shadow-xl shadow-green-900/20">
            <Trophy size={48} className="mb-3 text-accent-gold" />
            <h2 className="text-2xl font-serif font-bold mb-1">¡Completado!</h2>
            <p className="text-sm opacity-90">Resolviste el tablero en {moves} movimientos.</p>
          </div>
        )}

        {/* Tablero del Memorama */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card, index) => {
            const isFlipped = flippedIndices.includes(index);
            const isMatched = matchedIds.includes(card.matchId);
            const showContent = isFlipped || isMatched;

            return (
              <div 
                key={`${card.id}-${index}`}
                onClick={() => handleCardClick(index)}
                className={`relative aspect-square cursor-pointer transition-all duration-300 transform perspective-1000 ${
                  showContent ? 'rotate-y-0' : 'rotate-y-180'
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div 
                  className={`w-full h-full absolute inset-0 rounded-sm border shadow-md flex flex-col items-center justify-center p-4 text-center transition-colors duration-300 ${
                    showContent 
                      ? isMatched 
                        ? 'bg-accent-gold/10 border-accent-gold/30 text-accent-gold' 
                        : 'bg-base-surface border-accent-gold/50 text-text-main'
                      : 'bg-base-dark border-base-border hover:border-accent-gold/50'
                  }`}
                >
                  {showContent ? (
                    // Cara frontal (Contenido)
                    <div className="flex flex-col items-center justify-center animate-in fade-in duration-300">
                      {card.type === 'shape' ? (
                        <>
                          {renderShape(card.shape, card.filled)}
                          <span className="text-sm font-medium tracking-wide uppercase opacity-90">
                            {card.label}
                          </span>
                        </>
                      ) : (
                        renderFormula(card.text)
                      )}
                    </div>
                  ) : (
                    // Cara trasera (Patrón Oculto)
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="w-2 h-2 rounded-full bg-text-muted"></div>
                        <div className="w-2 h-2 rounded-full bg-text-muted"></div>
                        <div className="w-2 h-2 rounded-full bg-text-muted"></div>
                        <div className="w-2 h-2 rounded-full bg-text-muted"></div>
                        <div className="w-2 h-2 bg-accent-gold rotate-45"></div>
                        <div className="w-2 h-2 rounded-full bg-text-muted"></div>
                        <div className="w-2 h-2 rounded-full bg-text-muted"></div>
                        <div className="w-2 h-2 rounded-full bg-text-muted"></div>
                        <div className="w-2 h-2 rounded-full bg-text-muted"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}