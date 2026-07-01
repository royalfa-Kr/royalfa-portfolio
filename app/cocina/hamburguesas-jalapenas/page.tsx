"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChefHat, Clock, Users, Utensils, Flame, Info } from 'lucide-react';

export default function HamburguesasJalapenasPage() {
  const [checkedIngredients, setCheckedIngredients] = useState<number[]>([]);

  const toggleIngredient = (index: number) => {
    setCheckedIngredients(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const ingredients = [
    "½ Kg Carne de Res",
    "½ Kg Carne de Puerco",
    "100 g de Tocino",
    "1 Lata de Chiles en Vinagre (no necesariamente jalapeños)",
    "1 Frasco pequeño de Mostaza",
    "1 L de leche",
    "1 Bolsa de Pan Molido",
    "1 Bolsa de Pan para Hamburguesas",
    "Queso Manchego o Amarillo (según el gusto)",
    "1 Aguacate",
    "½ Limón",
    "1 Barra de Mantequilla",
    "Sal y Pimienta al gusto"
  ];

  const optionalIngredients = [
    "Lechuga", "Jitomate", "Cebolla", "Cátsup", "Mayonesa", "Pepinillos"
  ];

  return (
    <div className="min-h-screen bg-base-dark p-4 md:p-8 font-sans text-text-main">
      <div className="max-w-5xl mx-auto">
        
        {/* Navegación */}
        <div className="mb-8">
          <Link href="/apps" className="text-accent-gold hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
            ← Volver al Inicio
          </Link>
        </div>

        {/* Encabezado de la Receta */}
        <header className="mb-12 border-b border-base-border pb-8">
          <div className="flex items-center gap-3 text-accent-gold mb-4">
            <ChefHat size={24} />
            <span className="font-mono text-sm uppercase tracking-widest">Recetario Familiar</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-text-main mb-4">
            Hamburguesas <span className="text-accent-gold">Jalapeñas</span>
          </h1>
          <p className="text-lg text-text-muted italic border-l-4 border-accent-gold pl-4 mb-6">
            "El nombre surge de forma evidente ya que esta receta pertenece a Cesar y Omar; mis tíos jalapeños."
          </p>
          
          <div className="flex flex-wrap gap-6 text-sm text-text-muted">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-accent-gold" />
              <span>Reposo: 1.5 - 2 horas</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-accent-gold" />
              <span>Rinde: Múltiples porciones</span>
            </div>
          </div>
        </header>

        {/* Contenido Principal a dos columnas en Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Columna Izquierda: Ingredientes */}
          <div className="md:col-span-4 space-y-8">
            <div className="bg-base-surface border border-base-border p-6 rounded-sm shadow-lg sticky top-8">
              <h3 className="text-2xl font-serif text-accent-gold mb-6 flex items-center gap-2">
                <Utensils size={20} /> Ingredientes
              </h3>
              
              <div className="bg-accent-gold/10 border border-accent-gold/30 p-3 rounded-sm mb-6 flex items-start gap-3">
                <Info size={18} className="text-accent-gold shrink-0 mt-0.5" />
                <p className="text-xs text-text-muted leading-relaxed">
                  <strong className="text-accent-gold block mb-1">Nota del Chef:</strong>
                  Los dos tipos de carne y el tocino se muelen juntos.
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {ingredients.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 cursor-pointer group" onClick={() => toggleIngredient(index)}>
                    <div className={`w-5 h-5 mt-0.5 rounded-sm border flex items-center justify-center transition-colors shrink-0 ${
                      checkedIngredients.includes(index) ? 'bg-accent-gold border-accent-gold text-base-dark' : 'border-base-border group-hover:border-accent-gold/50'
                    }`}>
                      {checkedIngredients.includes(index) && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className={`text-sm leading-snug transition-all ${checkedIngredients.includes(index) ? 'text-text-muted line-through opacity-50' : 'text-text-main'}`}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <h4 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4 pb-2 border-b border-base-border">
                Opcionales (Al gusto)
              </h4>
              <p className="text-sm text-text-muted leading-relaxed">
                {optionalIngredients.join(', ')}
              </p>
            </div>
          </div>

          {/* Columna Derecha: Preparación */}
          <div className="md:col-span-8 space-y-12">
            
            {/* Sección: Mise en place */}
            <section>
              <h2 className="text-3xl font-serif text-text-main mb-6 flex items-center gap-3">
                <span className="bg-accent-gold text-base-dark w-8 h-8 rounded-full flex items-center justify-center text-lg">1</span>
                Mise en place
              </h2>
              
              <div className="space-y-6 text-text-muted">
                <p className="text-lg text-text-main">Se coloca la carne en un recipiente para condimentarla.</p>
                
                <ol className="list-decimal list-outside ml-6 space-y-4">
                  <li className="pl-2">
                    <strong className="text-text-main font-medium">El toque jalapeño:</strong> Se le agrega <em>todo</em> el vinagre de la lata de los chiles (sólo el vinagre). Apartar los chiles como condimento de la hamburguesa.
                  </li>
                  <li className="pl-2">
                    <strong className="text-text-main font-medium">Mostaza:</strong> Agregar la mitad del frasco. El sabor a mostaza es fuerte; si sólo quieres un toque, agrega 1/4. En mi caso, por mi gusto, utilizo todo el frasco.
                  </li>
                  <li className="pl-2">
                    <strong className="text-text-main font-medium">Líquidos:</strong> Agregar el litro de leche. Por experiencia procuro ponerle un poco menos de leche (¾ aproximadamente).
                  </li>
                  <li className="pl-2">Sazonar con sal y pimienta al gusto.</li>
                  <li className="pl-2">Agregar el pan molido hasta que la carne tenga buena consistencia.</li>
                </ol>

                <div className="bg-base-dark/50 border-l-4 border-accent-gold p-4 rounded-r-sm my-6">
                  <p className="text-sm">
                    <strong>Sobre el reposo:</strong> Se supone que lo "ideal" es dejar esta mezcla reposar durante la noche en el refrigerador. En lo particular, dejo reposar la carne entre 1.5 y 2 horas. Una vez terminado, se puede adelantar haciendo las hamburguesas (con las manos o un tortillero).
                  </p>
                </div>

                <ol className="list-decimal list-outside ml-6 space-y-4" start={6}>
                  <li className="pl-2">En un plato hondo o salsera, moler el aguacate a punto de guacamole. Agregarle únicamente unas gotitas de limón para evitar que se oxide y reservar.</li>
                  <li className="pl-2">Abrir los panes. En la parte superior de la tapa y en ambos lados de la base, embarrar un poco de mantequilla (ayuda a que doren y da un sabor especial, aunque puede llenar un poco más).</li>
                  <li className="pl-2">En la parte interior de la tapa, embarrar un poco de aguacate.</li>
                  <li className="pl-2">Desinfectar las verduras y cortar en rodajas (jitomate y cebolla). Dejarlas en la mesa al gusto del comensal.</li>
                  <li className="pl-2">Tener una plancha o sartén con aceite (suelo poner un poco y limpiar el exceso con servilleta; recuerda que la carne con tocino soltará su propia grasa). Prender a fuego lento.</li>
                </ol>
              </div>
            </section>

            <hr className="border-base-border" />

            {/* Sección: Preparación */}
            <section>
              <h2 className="text-3xl font-serif text-text-main mb-6 flex items-center gap-3">
                <span className="bg-accent-gold text-base-dark w-8 h-8 rounded-full flex items-center justify-center text-lg"><Flame size={18} /></span>
                La Cocción
              </h2>

              <div className="space-y-6 text-text-muted">
                <ol className="list-decimal list-outside ml-6 space-y-4">
                  <li className="pl-2">Subir un poco el fuego y poner la hamburguesa en el sartén.</li>
                  <li className="pl-2">Una vez que está cocida de un lado, voltear (la cocción depende del sartén y el fuego, puedes verificar con la misma pala).</li>
                  <li className="pl-2">Poner, encima de la carne, una rebanada de queso para que se funda un poco.</li>
                  <li className="pl-2">
                    <strong className="text-text-main font-medium">El Pan:</strong> Poner al sartén los panes sólo unos minutos para que se calienten o se doren con la mantequilla. 
                    <br/><span className="text-xs text-accent-gold uppercase tracking-wider">¡Cuidado!</span> Si el sartén está muy caliente pueden quemarse.
                  </li>
                  <li className="pl-2">Una vez que está el pan, poner la tapa encima de la carne y la base en el plato (por lo regular tengo un "platón" donde pongo varias).</li>
                  <li className="pl-2">Una vez cocida la carne, se retira del fuego y se pone sobre la base.</li>
                </ol>

                <p className="italic mt-8 text-lg text-text-main border-l-4 border-green-500/50 pl-4">
                  "Si la plancha es lo suficientemente grande y con un poco de pericia, se pueden hacer varias al mismo tiempo. ¡Que las disfruten!"
                </p>
              </div>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
}