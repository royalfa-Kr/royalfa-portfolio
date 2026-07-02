"use client";

import React, { useState, useMemo } from 'react';
import { 
  Shield, Users, Save, Database, BookOpen, Plus, Trophy, XCircle, Minus, 
  Search, BarChart2, Settings, CheckSquare, Square, Trash2, SidebarClose, 
  MenuSquare, Skull
} from 'lucide-react';

// --- BASE DE DATOS DE EXPANSIONES ---
const EXPANSIONS = {
  core: { name: "Legendary Core (2012)", heros: ["Black Widow", "Captain America", "Cyclops", "Deadpool", "Emma Frost", "Gambit", "Hawkeye", "Hulk", "Iron Man", "Nick Fury", "Rogue", "Spider-Man", "Storm", "Thor", "Wolverine"], masterminds: [{name: "Loki", leads: "Enemies of Asgard"}, {name: "Magneto", leads: "Brotherhood"}, {name: "Red Skull", leads: "Hydra"}, {name: "Dr. Doom", leads: "Doombot Legion"}], schemes: ["The Legacy Virus", "Midtown Bank Robbery", "Negative Zone Prison Breakout", "Portals to Hell"], villains: ["Enemies of Asgard", "Hydra", "Masters of Evil", "Radiation", "Skrulls", "Spider-Foes", "Brotherhood", "Doombot Legion"], henchmen: ["Hand Ninjas", "Savage Land Mutates", "Sentinels", "Spider-Slayers"] },
  dark_city: { name: "Dark City (2013)", heros: ["Angel", "Bishop", "Blade", "Cable", "Colossus", "Daredevil", "Domino", "Elektra", "Forge", "Ghost Rider", "Iceman", "Iron Fist", "Jean Grey", "Nightcrawler", "Professor X", "Punisher", "Spider-Woman"], masterminds: [{name: "Apocalypse", leads: "Four Horsemen"}, {name: "Kingpin", leads: "Underworld"}, {name: "Mephisto", leads: "Underworld"}, {name: "Mr. Sinister", leads: "Marauders"}], schemes: ["Capture Baby Hope", "Detonate the Helicarrier", "Massive Earthquake Generator", "Organized Crime Wave", "Save Humanity"], villains: ["Emissaries of Evil", "Four Horsemen", "Marauders", "MLF", "Underworld"], henchmen: ["Maggia Goons", "Phalanx"] },
  fantastic_four: { name: "Fantastic Four (2013)", heros: ["Mr. Fantastic", "Invisible Woman", "Human Torch", "The Thing", "Silver Surfer"], masterminds: [{name: "Galactus", leads: "Herald of Galactus"}, {name: "Mole Man", leads: "Subterranea"}], schemes: ["Invade the Daily Bugle", "The Coming of Galactus"], villains: ["Herald of Galactus", "Subterranea"], henchmen: [] },
  paint_town_red: { name: "Paint the Town Red (2014)", heros: ["Black Cat", "Moon Knight", "Scarlet Spider", "Spider-Man (Symbiote)", "Spider-Ham"], masterminds: [{name: "Carnage", leads: "Maximum Carnage"}, {name: "Mysterio", leads: "Sinister Six"}], schemes: ["Splitting Image", "Invade the Daily Bugle"], villains: ["Maximum Carnage", "Sinister Six"], henchmen: [] },
  villains_set: { name: "Villains (2014)", heros: ["Dr. Octopus", "Electro", "Enchantress", "Green Goblin", "Juggernaut", "Kingpin", "Loki", "Magneto", "Mysterio", "Sabretooth", "Ultron", "Venom"], masterminds: [{name: "Nick Fury", leads: "Avengers"}, {name: "Professor X", leads: "Uncanny X-Men"}], schemes: ["Build an Army of Annihilation", "Establish a Police State"], villains: ["Avengers", "Defenders", "Marvel Knights", "Uncanny X-Men"], henchmen: ["Asgardian Warriors", "Cops"] }
};

// --- DATA DE KEYWORDS ---
const KEYWORDS_DB = [
  { name: "Abomination", effect: "El villano gana +ataque igual al ataque impreso del héroe en el HQ justo debajo de su posición actual.", set: "Captain America / Realm of Kings" },
  { name: "Ambush", effect: "Villanos: Se activa al entrar a la ciudad. Héroes: Se activa al entrar al HQ si tienes la clase requerida.", set: "Core / Black Panther" },
  { name: "Artifacts", effect: "Cartas que permanecen en juego tras tu turno. Su poder puede reusarse en turnos futuros.", set: "Fear Itself / Guardians" },
  { name: "Astral Plane", effect: "Espacio único a la derecha del mazo de villanos. Solo se combate con RECLUTAMIENTO.", set: "Doctor Strange" },
  { name: "Bribe", effect: "Puedes combatir usando cualquier combinación de ataque Y reclutamiento.", set: "Dark City / Civil War" },
  { name: "Focus", effect: "Paga reclutamiento para activar la habilidad de la carta.", set: "Annihilation" },
  { name: "Piercing Energy", effect: "Combate gastando energía igual a los PV del enemigo.", set: "X-Men" }
];

export default function App() {
  const [view, setView] = useState('capture');
  const [history, setHistory] = useState([]);
  const [agents, setAgents] = useState([]);
  const [ownedExpansions, setOwnedExpansions] = useState(Object.keys(EXPANSIONS));
  
  // UI States
  const [showKeywords, setShowKeywords] = useState(false);
  const [keywordSearch, setKeywordSearch] = useState('');

  // Formulario de Captura
  const [captureForm, setCaptureForm] = useState({
    mastermind: '',
    scheme: '',
    horrorCards: false,
    villains: [''],
    henchmen: [''],
    heroes: [''],
    players: [{ name: '', score: 0 }],
    result: 'Victoria'
  });

  // Aplanar datos para los selectores
  const allData = useMemo(() => {
    // 1. Le decimos explícitamente a TypeScript que son arreglos de strings
    const m: string[] = [], s: string[] = [], v: string[] = [], h: string[] = [], her: string[] = [];
    
    ownedExpansions.forEach(exp => {
      // 2. Le aseguramos a TypeScript que 'exp' es una llave válida de nuestro objeto
      const data = EXPANSIONS[exp as keyof typeof EXPANSIONS];
      if (!data) return;
      
      // 3. Tipamos temporalmente con 'any' o 'string' en los mapeos para evitar más quejas
      if (data.masterminds) m.push(...data.masterminds.map((x: any) => `${x.name} (${data.name})`));
      if (data.schemes) s.push(...data.schemes.map((x: string) => `${x} (${data.name})`));
      if (data.villains) v.push(...data.villains.map((x: string) => `${x} (${data.name})`));
      if (data.henchmen) h.push(...data.henchmen.map((x: string) => `${x} (${data.name})`));
      if (data.heros) her.push(...data.heros.map((x: string) => `${x} (${data.name})`));
    });
    
    return { 
      masterminds: m.sort(), schemes: s.sort(), 
      villains: v.sort(), henchmen: h.sort(), heroes: her.sort() 
    };
  }, [ownedExpansions]);

  // Manejadores del Formulario
  const updateArrayField = (field, index, value) => {
    const newArr = [...captureForm[field]];
    newArr[index] = value;
    setCaptureForm({ ...captureForm, [field]: newArr });
  };
  const addArrayField = (field, defaultValue = '') => {
    setCaptureForm({ ...captureForm, [field]: [...captureForm[field], defaultValue] });
  };
  const removeArrayField = (field, index) => {
    const newArr = [...captureForm[field]];
    newArr.splice(index, 1);
    setCaptureForm({ ...captureForm, [field]: newArr });
  };

  const updatePlayer = (index, key, value) => {
    const newPlayers = [...captureForm.players];
    newPlayers[index][key] = value;
    setCaptureForm({ ...captureForm, players: newPlayers });
  };

  const saveGame = () => {
    // Por ahora solo reseteamos el formulario.
    // Mañana implementamos el guardado en localStorage.
    setCaptureForm({
      mastermind: '', scheme: '', horrorCards: false,
      villains: [''], henchmen: [''], heroes: [''],
      players: [{ name: '', score: 0 }], result: 'Victoria'
    });
    setView('history');
  };

  const SidebarItem = ({ icon: Icon, label, id }) => (
    <button onClick={() => setView(id)} className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${view === id ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
      <Icon size={18} />
      <span className="font-bold text-[10px] uppercase tracking-[0.1em]">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* NAVEGACIÓN IZQUIERDA */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 hidden md:flex flex-col z-20">
        <div className="flex items-center space-x-3 mb-10 px-2">
          <Shield className="text-blue-500" size={32} />
          <div>
            <h1 className="text-xl font-black italic tracking-tighter leading-none text-white">LEGENDARY</h1>
            <p className="text-[8px] font-bold text-blue-400 tracking-[0.2em] uppercase">S.H.I.E.L.D. Log</p>
          </div>
        </div>
        <nav className="space-y-1 flex-1 overflow-y-auto">
          <SidebarItem icon={MenuSquare} label="Capturar Misión" id="capture" />
          <SidebarItem icon={Database} label="Historial" id="history" />
          <SidebarItem icon={Users} label="Agentes" id="agents" />
          <SidebarItem icon={BarChart2} label="Estadísticas" id="stats" />
          <SidebarItem icon={Settings} label="Mi Colección" id="settings" />
        </nav>
      </aside>

      {/* ÁREA PRINCIPAL CENTRAL */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black relative">
        
        <button 
          onClick={() => setShowKeywords(!showKeywords)}
          className="absolute top-6 right-6 z-30 bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-full shadow-2xl flex items-center gap-2 border-2 border-indigo-400 transition-all"
        >
          <BookOpen size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Keywords</span>
        </button>

        <div className="max-w-4xl mx-auto p-6 md:p-12 pb-24">
          
          {view === 'capture' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="border-b border-slate-800 pb-6">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Capturar Misión</h2>
                <p className="text-slate-500 text-sm mt-2">Registra los parámetros exactos de la partida. Rompe las reglas de construcción si el Scheme lo dicta.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Panel Villanos */}
                <div className="bg-red-950/20 border border-red-900/30 p-6 rounded-2xl space-y-4">
                  <h3 className="text-red-500 font-black uppercase text-sm tracking-widest border-b border-red-900/30 pb-2">Fuerzas Enemigas</h3>
                  
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block">Mastermind</label>
                    <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm" value={captureForm.mastermind} onChange={e => setCaptureForm({...captureForm, mastermind: e.target.value})}>
                      <option value="">Seleccionar...</option>
                      {allData.masterminds.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block">Scheme</label>
                    <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm" value={captureForm.scheme} onChange={e => setCaptureForm({...captureForm, scheme: e.target.value})}>
                      <option value="">Seleccionar...</option>
                      {allData.schemes.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <label className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-red-900/30 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 accent-red-600" checked={captureForm.horrorCards} onChange={e => setCaptureForm({...captureForm, horrorCards: e.target.checked})} />
                    <span className="text-sm font-bold text-red-200">Incluir Horror Cards</span>
                    <Skull size={16} className="text-red-500 ml-auto" />
                  </label>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] text-slate-400 uppercase font-bold">Grupos de Villanos</label>
                      <button onClick={() => addArrayField('villains')} className="text-blue-400 hover:text-blue-300 text-[10px] font-bold flex items-center"><Plus size={12}/> Agregar</button>
                    </div>
                    {captureForm.villains.map((v, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <select className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm" value={v} onChange={e => updateArrayField('villains', i, e.target.value)}>
                          <option value="">Seleccionar...</option>
                          {allData.villains.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <button onClick={() => removeArrayField('villains', i)} className="p-2 text-slate-600 hover:text-red-500"><Trash2 size={16}/></button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] text-slate-400 uppercase font-bold">Henchmen</label>
                      <button onClick={() => addArrayField('henchmen')} className="text-blue-400 hover:text-blue-300 text-[10px] font-bold flex items-center"><Plus size={12}/> Agregar</button>
                    </div>
                    {captureForm.henchmen.map((h, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <select className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm" value={h} onChange={e => updateArrayField('henchmen', i, e.target.value)}>
                          <option value="">Seleccionar...</option>
                          {allData.henchmen.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <button onClick={() => removeArrayField('henchmen', i)} className="p-2 text-slate-600 hover:text-red-500"><Trash2 size={16}/></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Panel Héroes y Resultado */}
                <div className="space-y-6">
                  <div className="bg-blue-950/20 border border-blue-900/30 p-6 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center border-b border-blue-900/30 pb-2">
                      <h3 className="text-blue-500 font-black uppercase text-sm tracking-widest">Héroes Seleccionados</h3>
                      <button onClick={() => addArrayField('heroes')} className="text-blue-400 hover:text-blue-300 text-[10px] font-bold flex items-center"><Plus size={12}/> Agregar</button>
                    </div>
                    {captureForm.heroes.map((h, i) => (
                      <div key={i} className="flex gap-2">
                        <select className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm" value={h} onChange={e => updateArrayField('heroes', i, e.target.value)}>
                          <option value="">Héroe...</option>
                          {allData.heroes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <button onClick={() => removeArrayField('heroes', i)} className="p-2 text-slate-600 hover:text-red-500"><Trash2 size={16}/></button>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <h3 className="text-slate-300 font-black uppercase text-sm tracking-widest">Jugadores (Orden de Turno)</h3>
                      <button onClick={() => addArrayField('players', {name:'', score:0})} className="text-blue-400 hover:text-blue-300 text-[10px] font-bold flex items-center"><Plus size={12}/> Jugador</button>
                    </div>
                    {captureForm.players.map((p, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <span className="text-[10px] font-bold text-slate-500">#{i+1}</span>
                        <input type="text" placeholder="Nombre" className="flex-[2] bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm" value={p.name} onChange={e => updatePlayer(i, 'name', e.target.value)} />
                        <input type="number" placeholder="Pts" className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-center" value={p.score} onChange={e => updatePlayer(i, 'score', parseInt(e.target.value) || 0)} />
                        <button onClick={() => removeArrayField('players', i)} className="p-2 text-slate-600 hover:text-red-500"><Trash2 size={16}/></button>
                      </div>
                    ))}
                    
                    <div className="pt-4 mt-2 border-t border-slate-800">
                      <label className="text-[10px] text-slate-400 uppercase font-bold mb-2 block">Resultado de la Misión</label>
                      <div className="flex gap-2">
                        {['Victoria', 'Empate', 'Derrota'].map(res => (
                          <button key={res} onClick={() => setCaptureForm({...captureForm, result: res})} className={`flex-1 py-2 rounded-lg font-black uppercase text-[10px] transition-all border-2 ${captureForm.result === res ? (res === 'Victoria' ? 'bg-emerald-600 border-emerald-400 text-white' : res === 'Derrota' ? 'bg-red-600 border-red-400 text-white' : 'bg-amber-600 border-amber-400 text-white') : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                            {res}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 flex justify-end">
                <button onClick={saveGame} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl font-black uppercase italic shadow-xl flex items-center gap-3">
                  <Save size={20} /> Guardar Registro
                </button>
              </div>
            </div>
          )}

          {view === 'history' && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">Archivo</h2>
              <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-x-auto p-8 text-center text-slate-500">
                Aún no hay partidas registradas. (El guardado local se implementará en la próxima actualización).
              </div>
            </div>
          )}
        </div>
      </main>

      {/* PANEL LATERAL DERECHO: KEYWORDS */}
      <aside className={`fixed inset-y-0 right-0 w-80 bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${showKeywords ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black italic uppercase text-indigo-400">Glosario</h3>
            <button onClick={() => setShowKeywords(false)} className="text-slate-500 hover:text-white"><SidebarClose size={20} /></button>
          </div>
          
          <div className="relative mb-6 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar keyword..." 
              className="w-full bg-slate-950 border border-slate-800 py-2 pl-10 pr-4 rounded-lg text-sm outline-none focus:border-indigo-500 transition-colors" 
              value={keywordSearch} 
              onChange={(e) => setKeywordSearch(e.target.value)} 
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {KEYWORDS_DB.filter(k => k.name.toLowerCase().includes(keywordSearch.toLowerCase())).map((k, i) => (
              <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
                <h4 className="text-sm font-black text-indigo-300 uppercase italic mb-1">{k.name}</h4>
                <p className="text-slate-300 text-xs leading-relaxed">{k.effect}</p>
                <p className="text-[8px] text-slate-600 mt-2 uppercase tracking-widest font-black italic">{k.set}</p>
              </div>
            ))}
            {KEYWORDS_DB.filter(k => k.name.toLowerCase().includes(keywordSearch.toLowerCase())).length === 0 && (
              <p className="text-center text-slate-500 text-xs mt-10">No se encontraron resultados.</p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}