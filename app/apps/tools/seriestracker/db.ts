import Dexie, { type EntityTable } from 'dexie';

export interface Serie {
  id: number;
  title: string;
  poster: string;
  status: string; // 'viendo', 'espera', 'terminadas'
  currentSeason: number;
  currentEpisode: number;
  totalEpisodesSeason: number;
  seasonsData: Record<number, number>; // Ejemplo: { 1: 12, 2: 12, 3: 14 }
  episodesData: any[]; // Guardamos todos los episodios para leer las reseñas offline
  network: string;
  nextEpisodeDate: string | null;
  schedule?: any;
  updatedAt: number;
}

const db = new Dexie('SeriesTrackerDB') as Dexie & {
  series: EntityTable<Serie, 'id'>;
};

// Si ya habías guardado datos, Dexie.version(2).upgrade(...) sería lo ideal, 
// pero como es nueva, puedes borrar los datos de tu navegador o simplemente dejar versión 1 si no has guardado nada crítico.
db.version(1).stores({
  series: 'id, status, updatedAt'
});

export { db };