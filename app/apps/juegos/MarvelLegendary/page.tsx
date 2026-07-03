"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Shield, Users, Save, Database, BookOpen, Plus, Skull, 
  Trash2, MenuSquare, Settings, CheckSquare, Square, Info
} from 'lucide-react';

import { EXPANSIONS, KEYWORDS_DB } from '@/data/legendary';

export default function LegendaryApp() {
  const [view, setView] = useState('capture');
  const [history, setHistory] = useState<any[]>([]);
  const [ownedExpansions, setOwnedExpansions] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

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

  // Cargar datos locales al iniciar
  useEffect(() => {
    const savedHistory = localStorage.getItem('legendary_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedCollection = localStorage.getItem('legendary_collection');
    if (savedCollection) {
      setOwnedExpansions(JSON.parse(savedCollection));
    } else {
      setOwnedExpansions(Object.keys(EXPANSIONS)); // Por defecto todas si es nuevo
    }
    setIsMounted(true);
  }, []);

  // Guardar colección cuando cambia
  const toggleExpansion = (expKey: string) => {
    const updated = ownedExpansions.includes(expKey) 
      ? ownedExpansions.filter(k => k !== expKey)
      : [...ownedExpansions, expKey];
    setOwnedExpansions(updated);
    localStorage.setItem('legendary_collection', JSON.stringify(updated));
  };

  // Aplanar datos para los selectores basándose SÓLO en la colección
  const allData = useMemo(() => {
    const m: string[] = [], s: string[] = [], v: string[] = [], h: string[] = [], her: string[] = [];
    ownedExpansions.forEach(exp => {
      const data = EXPANSIONS[exp as keyof typeof EXPANSIONS];
      if (!data) return;
      if (data.masterminds) m.push(...data.masterminds.map((x: any) => `${x.name} [${exp}]`));
      if (data.schemes) s.push(...data.schemes.map((x: string) => `${x} [${exp}]`));
      if (data.villains) v.push(...data.villains.map((x: string) => `${x} [${exp}]`));
      if (data.henchmen) h.push(...data.henchmen.map((x: string) => `${x} [${exp}]`));
      if (data.heros) her.push(...data.heros.map((x: string) => `${x} [${exp}]`));
    });
    return { masterminds: m.sort(), schemes: s.sort(), villains: v.sort(), henchmen: h.sort(), heroes: her.sort() };
  }, [ownedExpansions]);

  // Extraer qué expansiones se están usando actualmente en el formulario
  const activeExpansionsInMatch = useMemo(() => {
    const active = new Set<string>();
    const extractKey = (str: string) => {
      const match = str.match(/\[(.*?)\]/);
      return match ? match[1] : null;
    };
    
    if (captureForm.mastermind) active.add(extractKey(captureForm.mastermind) || '');
    if (captureForm.scheme) active.add(extractKey(captureForm.scheme) || '');
    captureForm.villains.forEach(v => { if(v) active.add(extractKey(v) || ''); });
    captureForm.heroes.forEach(h => { if(h) active.add(extractKey(h) || ''); });
    
    return Array.from(active).filter(Boolean);
  }, [captureForm]);

  // Filtrar keywords para la partida actual
  const matchKeywords = useMemo(() => {
    return KEYWORDS_DB.filter(k => {
      const expansions = k.expansions ?? [];
      const expansionList = Array.isArray(expansions) ? expansions : [expansions];
      return expansionList.some(e => activeExpansionsInMatch.includes(e));
    });
  }, [activeExpansionsInMatch]);

  // Manejadores del Formulario
  const updateArrayField = (field: any, index: number, value: any) => {
    const newArr = [...(captureForm as any)[field]];
    newArr[index] = value;
    setCaptureForm({ ...captureForm, [field]: newArr });
  };
  const addArrayField = (field: any, defaultValue: any = '') => {
    setCaptureForm({ ...captureForm, [field]: [...(captureForm as any)[field], defaultValue] });
  };
  const removeArrayField = (field: any, index: number) => {
    const newArr = [...(captureForm as any)[field]];
    newArr.splice(index, 1);
    setCaptureForm({ ...captureForm, [field]: newArr });
  };
  const updatePlayer = (index: number, key: any, value: any) => {
    const newPlayers = [...captureForm.players];
    newPlayers[index] = { ...newPlayers[index], [key]: value }; 
    setCaptureForm({ ...captureForm, players: newPlayers });
  };

  const saveGame = () => {
    const newRecord = { ...captureForm, date: new Date().toLocaleDateString() };
    const updatedHistory = [newRecord, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('legendary_history', JSON.stringify(updatedHistory));
    
    setCaptureForm({
      mastermind: '', scheme: '', horrorCards: false,
      villains: [''], henchmen: [''], heroes: [''],
      players: [{ name: '', score: 0 }], result: 'Victoria'
    });
    setView('history');
  };

  // Componente Tooltip de Keyword
  const KeywordBadge = ({ keyword }: { keyword: typeof KEYWORDS_DB[0] }) => (
    <div className="relative group cursor-help inline-block">
      <span className="bg-indigo-900/50 text-indigo-300 border border-indigo-700/50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
        <Info size={12} /> {keyword.name}
      </span>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 text-slate-200 text-xs p-3 rounded-xl shadow-2xl border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        <p className="font-bold text-indigo-400 mb-1">{keyword.name}</p>
        <p className="leading-relaxed">{keyword.effect}</p>
      </div>
    </div>
  );

  const SidebarItem = ({ icon: Icon, label, id }: { icon: any, label: string, id: string }) => (
    <button onClick={() => setView(id)} className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${view === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 text-slate-400'}`}>
      <Icon size={18} />
      <span className="font-bold text-[10px] uppercase tracking-[0.1em]">{label}</span>
    </button>
  );

  if (!isMounted) return null; // Evitar hidratación mismatch en Next.js

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
          <SidebarItem icon={BookOpen} label="Glosario" id="glossary" />
          <SidebarItem icon={Settings} label="Mi Colección" id="settings" />
        </nav>
      </aside>

      {/* ÁREA PRINCIPAL CENTRAL */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black relative">
        <div className="max-w-4xl mx-auto p-6 md:p-12 pb-24">
          
          {/* VISTA: CAPTURAR MISIÓN */}
          {view === 'capture' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="border-b border-slate-800 pb-6 flex justify-between items-end">
                <div>
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Capturar Misión</h2>
                  <p className="text-slate-500 text-sm mt-2">Registra los parámetros exactos de la partida.</p>
                </div>
              </div>

              {/* BARRA INTELIGENTE DE KEYWORDS */}
              {matchKeywords.length > 0 && (
                <div className="bg-indigo-950/20 border border-indigo-900/30 p-4 rounded-xl flex items-center gap-3 flex-wrap">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mr-2">Keywords en juego:</span>
                  {matchKeywords.map(k => <KeywordBadge key={k.name} keyword={k} />)}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Panel Villanos */}
                <div className="bg-red-950/20 border border-red-900/30 p-6 rounded-2xl space-y-4">
                  <h3 className="text-red-500 font-black uppercase text-sm tracking-widest border-b border-red-900/30 pb-2">Fuerzas Enemigas</h3>
                  
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block">Mastermind</label>
                    <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-300" value={captureForm.mastermind} onChange={e => setCaptureForm({...captureForm, mastermind: e.target.value})}>
                      <option value="">Seleccionar...</option>
                      {allData.masterminds.map(m => <option key={m} value={m}>{m.replace(/\[.*?\]/, '')}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block">Scheme</label>
                    <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-300" value={captureForm.scheme} onChange={e => setCaptureForm({...captureForm, scheme: e.target.value})}>
                      <option value="">Seleccionar...</option>
                      {allData.schemes.map(s => <option key={s} value={s}>{s.replace(/\[.*?\]/, '')}</option>)}
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
                        <select className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-300" value={v} onChange={e => updateArrayField('villains', i, e.target.value)}>
                          <option value="">Seleccionar...</option>
                          {allData.villains.map(opt => <option key={opt} value={opt}>{opt.replace(/\[.*?\]/, '')}</option>)}
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
                        <select className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-300" value={h} onChange={e => updateArrayField('henchmen', i, e.target.value)}>
                          <option value="">Seleccionar...</option>
                          {allData.henchmen.map(opt => <option key={opt} value={opt}>{opt.replace(/\[.*?\]/, '')}</option>)}
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
                        <select className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-300" value={h} onChange={e => updateArrayField('heroes', i, e.target.value)}>
                          <option value="">Seleccionar...</option>
                          {allData.heroes.map(opt => <option key={opt} value={opt}>{opt.replace(/\[.*?\]/, '')}</option>)}
                        </select>
                        <button onClick={() => removeArrayField('heroes', i)} className="p-2 text-slate-600 hover:text-red-500"><Trash2 size={16}/></button>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <h3 className="text-slate-300 font-black uppercase text-sm tracking-widest">Jugadores</h3>
                      <button onClick={() => addArrayField('players', {name:'', score:0})} className="text-blue-400 hover:text-blue-300 text-[10px] font-bold flex items-center"><Plus size={12}/> Jugador</button>
                    </div>
                    
                    {/* SOLUCIÓN CSS PARA LOS INPUTS (Grid estricto) */}
                    {captureForm.players.map((p, i) => (
                      <div key={i} className="grid grid-cols-12 gap-2 items-center">
                        <span className="col-span-1 text-[10px] font-bold text-slate-500 text-center">#{i+1}</span>
                        <input type="text" placeholder="Nombre" className="col-span-7 bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm outline-none focus:border-blue-500" value={p.name} onChange={e => updatePlayer(i, 'name', e.target.value)} />
                        <input type="number" placeholder="Pts" className="col-span-3 bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-center outline-none focus:border-blue-500" value={p.score} onChange={e => updatePlayer(i, 'score', parseInt(e.target.value) || 0)} />
                        <button onClick={() => removeArrayField('players', i)} className="col-span-1 p-2 text-slate-600 hover:text-red-500 flex justify-center"><Trash2 size={16}/></button>
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

          {/* VISTA: HISTORIAL */}
          {view === 'history' && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white border-b border-slate-800 pb-6">Archivo</h2>
              {history.length === 0 ? (
                <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8 text-center text-slate-500">
                  Aún no hay partidas registradas.
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((game, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                      <div>
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full mb-2 inline-block ${game.result === 'Victoria' ? 'bg-emerald-900/50 text-emerald-400' : game.result === 'Derrota' ? 'bg-red-900/50 text-red-400' : 'bg-amber-900/50 text-amber-400'}`}>{game.result}</span>
                        <h4 className="font-bold text-lg text-white">{game.mastermind?.replace(/\[.*?\]/, '') || 'Mastermind Desconocido'}</h4>
                        <p className="text-xs text-slate-400">{game.scheme?.replace(/\[.*?\]/, '')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">{game.date}</p>
                        <div className="flex gap-2 mt-2">
                          {game.players.map((p:any, idx:number) => (
                            <span key={idx} className="bg-slate-950 border border-slate-800 text-slate-300 text-xs px-2 py-1 rounded">
                              {p.name}: {p.score} pts
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VISTA: GLOSARIO */}
          {view === 'glossary' && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white border-b border-slate-800 pb-6">Glosario Completo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {KEYWORDS_DB.map(k => (
                  <div key={k.name} className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <h4 className="text-indigo-400 font-black uppercase tracking-widest text-sm mb-2">{k.name}</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{k.effect}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VISTA: MI COLECCIÓN */}
          {view === 'settings' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="border-b border-slate-800 pb-6">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Mi Colección</h2>
                <p className="text-slate-500 text-sm mt-2">Selecciona las expansiones que posees para filtrar las opciones en tus capturas.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(EXPANSIONS).map(([key, data]) => (
                  <div key={key} onClick={() => toggleExpansion(key)} className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${ownedExpansions.includes(key) ? 'bg-blue-900/20 border-blue-500/50' : 'bg-slate-900/50 border-slate-800'}`}>
                    <span className={`font-bold ${ownedExpansions.includes(key) ? 'text-blue-400' : 'text-slate-400'}`}>{data.name}</span>
                    {ownedExpansions.includes(key) ? <CheckSquare className="text-blue-500" size={20} /> : <Square className="text-slate-600" size={20} />}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}