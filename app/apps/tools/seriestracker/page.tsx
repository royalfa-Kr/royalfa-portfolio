"use client";

import React, { useState } from 'react';
import { Tv, Search, CheckCircle2, Clock, PlayCircle, Plus, Calendar, CheckSquare, Square, Trash2, Info } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Serie } from './db';

export default function SeriesTracker() {
  const [activeTab, setActiveTab] = useState('viendo');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const misSeries = useLiveQuery(() => db.series.orderBy('updatedAt').reverse().toArray()) || [];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error buscando series", error);
    } finally {
      setIsSearching(false);
    }
  };

  const addSerie = async (showData: any) => {
    const show = showData.show;
    try {
      // Obtenemos los episodios completos para tener las reseñas y el mapa de temporadas
      const epRes = await fetch(`https://api.tvmaze.com/shows/${show.id}/episodes`);
      const epData = await epRes.json();
      
      const seasonsData: Record<number, number> = {};
      epData.forEach((ep: any) => {
        if (ep.season > 0) {
          if (!seasonsData[ep.season]) seasonsData[ep.season] = 0;
          if (ep.number > seasonsData[ep.season]) seasonsData[ep.season] = ep.number;
        }
      });

      await db.series.put({
        id: show.id,
        title: show.name,
        poster: show.image?.medium || "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=200&auto=format&fit=crop",
        status: 'viendo',
        currentSeason: 1,
        currentEpisode: 0,
        totalEpisodesSeason: seasonsData[1] || 1,
        seasonsData: seasonsData,
        episodesData: epData,
        network: show.network?.name || show.webChannel?.name || "Desconocido",
        nextEpisodeDate: null,
        updatedAt: Date.now()
      });
      alert(`¡${show.name} añadida a tu lista!`);
      setActiveTab('viendo');
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error("Error al guardar", error);
      alert("Hubo un error al obtener los detalles de la serie.");
    }
  };

  const updateProgress = async (serieId: number, newEpisode: number) => {
    await db.series.update(serieId, { currentEpisode: newEpisode, updatedAt: Date.now() });
  };

  const changeSeason = async (serie: Serie, direction: number) => {
    const newSeason = serie.currentSeason + direction;
    const newTotal = serie.seasonsData[newSeason];
    if (newTotal) {
      await db.series.update(serie.id, {
        currentSeason: newSeason,
        currentEpisode: 0,
        totalEpisodesSeason: newTotal,
        updatedAt: Date.now()
      });
    }
  };

  const handleSeasonFinish = async (serie: Serie) => {
    const nextSeason = serie.currentSeason + 1;
    if (serie.seasonsData[nextSeason]) {
      // Avanzar de temporada
      await db.series.update(serie.id, {
        currentSeason: nextSeason,
        currentEpisode: 0,
        totalEpisodesSeason: serie.seasonsData[nextSeason],
        updatedAt: Date.now()
      });
    } else {
      // Mandar a En Espera
      await db.series.update(serie.id, {
        status: 'espera',
        updatedAt: Date.now()
      });
      alert(`¡Has llegado al final de ${serie.title}! Movida a la lista de 'En Espera'.`);
    }
  };

  const deleteSerie = async (serieId: number) => {
    if(confirm('¿Seguro que quieres borrar esta serie de tu lista?')) {
      await db.series.delete(serieId);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500/30 pb-20 md:pb-0">
      
      {/* CABECERA */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20 shadow-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-400">
            <Tv size={24} />
            <h1 className="font-bold text-xl tracking-tight text-white">Series<span className="text-purple-400">Tracker</span></h1>
          </div>
          <button onClick={() => setActiveTab('buscar')} className="md:hidden p-2 text-slate-400 hover:text-purple-400 transition-colors">
            <Search size={20} />
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 p-4 md:py-8">
        
        {/* BARRA DE NAVEGACIÓN */}
        <aside className="fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 p-2 md:relative md:w-64 md:bg-transparent md:border-none md:p-0 z-20">
          <nav className="flex md:flex-col justify-around md:justify-start gap-1 md:gap-2">
            {[
              { id: 'viendo', label: 'Viendo', icon: PlayCircle, color: 'text-emerald-400' },
              { id: 'espera', label: 'En Espera', icon: Clock, color: 'text-amber-400' },
              { id: 'terminadas', label: 'Terminadas', icon: CheckCircle2, color: 'text-blue-400' },
              { id: 'buscar', label: 'Buscar', icon: Search, color: 'text-purple-400', hiddenMobile: true },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-xl transition-all ${
                  activeTab === tab.id ? 'bg-slate-800 text-white shadow-inner' : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'
                } ${tab.hiddenMobile ? 'hidden md:flex' : 'flex'}`}
              >
                <tab.icon size={20} className={activeTab === tab.id ? tab.color : ''} />
                <span className="text-[10px] md:text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* ÁREA DE CONTENIDO */}
        <main className="flex-1 space-y-6">
          
          {/* VISTA: VIENDO */}
          {activeTab === 'viendo' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h2 className="text-2xl font-black tracking-tight mb-6 flex justify-between items-center">
                Siguiendo Actualmente
                <span className="text-sm font-normal text-slate-500 bg-slate-900 px-3 py-1 rounded-full">{misSeries.filter(s => s.status === 'viendo').length} series</span>
              </h2>
              
              {/* ESTADO VACÍO (EMPTY STATE) */}
              {misSeries.filter(s => s.status === 'viendo').length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl">
                  <div className="bg-slate-950 p-4 rounded-full mb-4 border border-slate-800">
                    <Search size={32} className="text-purple-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Tu lista está vacía</h3>
                  <p className="text-sm text-slate-400 max-w-sm mb-6">
                    Aún no estás siguiendo ninguna serie. Busca tu programa favorito para agregarlo a tu base de datos local y comenzar a registrar tu progreso.
                  </p>
                  <button 
                    onClick={() => setActiveTab('buscar')}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-purple-900/20"
                  >
                    Ir al Buscador
                  </button>
                </div>
              ) : (
                /* LISTA DE SERIES (Si hay datos) */
                misSeries.filter(s => s.status === 'viendo').map(serie => {
                  // Obtener datos del episodio actual para mostrar el resumen
                  const currentEpData = serie.currentEpisode > 0 
                    ? serie.episodesData?.find(e => e.season === serie.currentSeason && e.number === serie.currentEpisode) 
                    : null;

                  return (
                    <div key={serie.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col sm:flex-row relative">
                      <button onClick={() => deleteSerie(serie.id)} className="absolute top-2 right-2 p-2 text-slate-500 hover:text-red-400 transition-colors z-10 bg-slate-950/80 rounded-lg backdrop-blur">
                        <Trash2 size={16} />
                      </button>

                      <div className="w-full sm:w-32 h-48 sm:h-auto shrink-0 relative bg-slate-800">
                        <img src={serie.poster} alt={serie.title} className="w-full h-full object-cover opacity-80" />
                        <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur text-[10px] px-2 py-1 rounded text-purple-400 font-bold border border-purple-900/50">
                          {serie.network}
                        </div>
                      </div>
                      
                      <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1 pr-8">{serie.title}</h3>
                          
                          {/* Selector de Temporadas */}
                          <div className="flex items-center gap-3 mt-2 mb-4 bg-slate-950 border border-slate-800 w-fit px-3 py-1.5 rounded-lg">
                            <button onClick={() => changeSeason(serie, -1)} disabled={serie.currentSeason === 1} className="text-slate-400 hover:text-white disabled:opacity-30">-</button>
                            <span className="text-sm text-slate-300 font-medium">Temporada {serie.currentSeason}</span>
                            <button onClick={() => changeSeason(serie, 1)} disabled={!serie.seasonsData?.[serie.currentSeason + 1]} className="text-slate-400 hover:text-white disabled:opacity-30">+</button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {/* Cuadrícula de Episodios */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {Array.from({ length: serie.totalEpisodesSeason }).map((_, i) => (
                              <button 
                                key={i}
                                onClick={() => updateProgress(serie.id, i + 1)}
                                className={`flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors ${
                                  i < serie.currentEpisode 
                                    ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-400' 
                                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'
                                }`}
                              >
                                {i < serie.currentEpisode ? <CheckSquare size={14} /> : <Square size={14} />}
                                {i + 1}
                              </button>
                            ))}
                          </div>

                          {/* Bloque de Reseña con Anti-Spoiler */}
                          {currentEpData && currentEpData.summary && (
                            <div className="mt-4 p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                              <div className="flex items-center gap-2 mb-2">
                                <Info size={14} className="text-purple-400" />
                                <h5 className="text-xs font-bold text-slate-300">Ep {serie.currentEpisode}: {currentEpData.name}</h5>
                              </div>
                              <div className="relative group cursor-pointer overflow-hidden rounded">
                                  <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-[2px] flex items-center justify-center z-10 group-hover:opacity-0 transition-opacity duration-300">
                                      <span className="text-[10px] font-bold text-purple-400 border border-purple-500/50 px-2 py-1 rounded bg-purple-950/50 tracking-wider uppercase">Spoiler - Pasar cursor para revelar</span>
                                  </div>
                                  <div className="text-[11px] text-slate-400 leading-relaxed max-h-24 overflow-y-auto pr-2 custom-scrollbar select-none group-hover:select-auto transition-opacity opacity-20 group-hover:opacity-100" 
                                    dangerouslySetInnerHTML={{__html: currentEpData.summary}}>
                                  </div>
                              </div>
                            </div>
                          )}

                          {/* Botón de Transición */}
                          {serie.currentEpisode === serie.totalEpisodesSeason && (
                            <button 
                              onClick={() => handleSeasonFinish(serie)}
                              className="w-full mt-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              <CheckCircle2 size={18} />
                              {serie.seasonsData?.[serie.currentSeason + 1] ? "Continuar a la siguiente Temporada" : "Al día - Mover a En Espera"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}      

          {/* VISTA: EN ESPERA */}
          {activeTab === 'espera' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h2 className="text-2xl font-black tracking-tight mb-6 text-amber-400">Esperando Nuevos Episodios</h2>
              
              {misSeries.filter(s => s.status === 'espera').length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl">
                  <Clock size={32} className="text-amber-500/50 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Todo al día</h3>
                  <p className="text-sm text-slate-400 max-w-sm">No tienes series en espera actualmente. ¡Parece que necesitas buscar algo nuevo para ver!</p>
                </div>
              ) : (
                misSeries.filter(s => s.status === 'espera').map(serie => {
                  // Obtener datos del último episodio visto para usarlo como resumen de temporada
                  const lastEpData = serie.currentEpisode > 0 
                    ? serie.episodesData?.find(e => e.season === serie.currentSeason && e.number === serie.currentEpisode) 
                    : null;

                  return (
                    <div key={serie.id} className="bg-slate-900 border border-amber-900/30 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 relative">
                      <button 
                        onClick={() => updateProgress(serie.id, 0).then(() => changeSeason(serie, 0)).then(() => db.series.update(serie.id, {status: 'viendo'}))} 
                        className="absolute top-2 right-2 text-[10px] text-amber-400 hover:text-amber-300 bg-amber-950/30 px-3 py-1.5 rounded-lg border border-amber-900/50 transition-colors z-10"
                      >
                        Volver a Viendo
                      </button>
                      
                      <div className="w-full md:w-32 h-48 md:h-auto shrink-0 relative">
                        <img src={serie.poster} className="w-full h-full object-cover rounded-xl shadow-lg border border-slate-800" alt="poster" />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="font-bold text-xl text-white mb-1">{serie.title}</h3>
                        <p className="text-sm text-slate-400 mb-4">Visto hasta: Temporada {serie.currentSeason} (Ep {serie.currentEpisode})</p>
                        
                        <div className="inline-flex items-center w-fit gap-2 bg-amber-950/30 text-amber-400 text-xs px-3 py-1.5 rounded-full border border-amber-900/50 mb-4">
                          <Calendar size={14} />
                          Esperando confirmación
                        </div>

                        {/* Bloque de Reseña (Final de temporada) con Anti-Spoiler */}
                        {lastEpData && lastEpData.summary && (
                          <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                            <div className="flex items-center gap-2 mb-2">
                              <Info size={14} className="text-amber-400" />
                              <h5 className="text-xs font-bold text-slate-300">Último capítulo visto: {lastEpData.name}</h5>
                            </div>
                            <div className="relative group cursor-pointer overflow-hidden rounded">
                                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-[2px] flex items-center justify-center z-10 group-hover:opacity-0 transition-opacity duration-300">
                                    <span className="text-[10px] font-bold text-amber-400 border border-amber-500/50 px-2 py-1 rounded bg-amber-950/50 tracking-wider uppercase">Spoiler - Revelar final de temporada</span>
                                </div>
                                <div className="text-[11px] text-slate-400 leading-relaxed max-h-24 overflow-y-auto pr-2 custom-scrollbar select-none group-hover:select-auto transition-opacity opacity-20 group-hover:opacity-100" 
                                  dangerouslySetInnerHTML={{__html: lastEpData.summary}}>
                                </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* VISTA: BUSCAR */}
          {activeTab === 'buscar' && (
            <div className="animate-in fade-in duration-300">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 mb-6">
                <h2 className="text-xl font-bold mb-2">Añadir nueva serie</h2>
                <p className="text-xs text-slate-400 mb-5">Ingresa el título oficial de la serie para conectarte con la base de datos de TVmaze. Al agregarla, se descargarán todos los episodios para que puedas marcar tu progreso.</p>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-slate-500" size={20} />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ej. Breaking Bad..." 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <button type="submit" disabled={isSearching} className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 rounded-xl font-bold transition-colors shadow-lg shadow-purple-900/20">
                    {isSearching ? 'Buscando...' : 'Buscar'}
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {searchResults.map((item, index) => (
                  <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-4">
                    <img 
                      src={item.show.image?.medium || "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=200&auto=format&fit=crop"} 
                      className="w-16 h-24 object-cover rounded border border-slate-800" 
                      alt="poster" 
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-white leading-tight">{item.show.name}</h4>
                      <p className="text-xs text-slate-400 mt-1">{item.show.premiered?.split('-')[0] || 'N/A'}</p>
                    </div>
                    <button 
                      onClick={() => addSerie(item)}
                      className="text-purple-400 hover:text-white p-2 bg-purple-950/30 hover:bg-purple-600 rounded-lg transition-colors border border-purple-900/50"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}