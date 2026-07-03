export type AppCategory = 'educativas' | 'tools' | 'juegos';
export type AppStatus = 'Publicada' | 'Fase 1 (Prueba)' | 'En desarrollo' | 'Concepto';

export interface AppItem {
  id: string;
  title: string;
  tags?: string[];
  description: string;
  category: AppCategory;
  status: AppStatus; // <-- Nueva propiedad agregada
  isExternal: boolean;
  url: string;
  coverPath?: string;
  techStack?: string[];
  subject?: string;
}

export const appsData: AppItem[] = [
  {
    id: "estructura-atomica",
    title: "Práctica de Estructura Atómica",
    description: "Herramienta interactiva para dominar la tabla periódica. A partir de un solo dato inicial (ej. Z=80), el estudiante debe deducir el resto de la estructura: elemento (Hg), protones, neutrones, electrones, masa atómica y carga.",
    category: "educativas",
    subject: "Química",
    status: "Publicada",
    isExternal: false,
    url: "/apps/educativas/estructura-atomica",
    techStack: ["Next.js", "React", "Química"]
  },
  {
    id: "venn-diagrams",
    title: "Diagramas de Venn",
    description: "Operaciones con conjuntos expresados en un diagrama de Venn.",
    category: "educativas",
    subject: "Matemáticas",
    status: "Publicada",
    isExternal: false,
    url: "/apps/educativas/venn",
    techStack: ["Next.js", "Lógica Matemática"]
  },
  {
    id: "memorama-geometrico",
    title: "Memorama Geométrico",
    description: "Juego de memoria para emparejar figuras geométricas (área y perímetro) con sus respectivas fórmulas matemáticas.",
    category: "educativas",
    subject: "Matemáticas",
    status: "Publicada",
    isExternal: false,
    url: "/apps/educativas/memorama-geometrico",
    techStack: ["Next.js", "React", "Geometría"]
  },
  {
    id: "tablas-verdad",
    title: "Tablas de Verdad",
    description: "Entrenador interactivo de lógica proposicional. Permite practicar la evaluación de conectores lógicos con validación instantánea fila por fila y sistema de auto-rellenado.",
    category: "educativas",
    subject: "Lógica",
    status: "Publicada",
    isExternal: false,
    url: "/apps/educativas/tablas-verdad",
    techStack: ["Next.js", "React", "Lógica"]
  },
  {
    id: "celula",
    title: "La Célula",
    description: "Diagrama interactivo 2D para explorar y evaluar el conocimiento de los organelos en células animales y vegetales. Incluye modo de estudio y evaluación.",
    category: "educativas",
    subject: "Biología",
    status: "Publicada",
    isExternal: false,
    url: "/apps/educativas/celula",
    techStack: ["Next.js", "React", "Biología"]
  },
  {
    id: "valencias",
    title: "Valencias Pro",
    description: "Rompecabezas interactivo de la tabla periódica. Arrastra y coloca los números de oxidación más comunes en su elemento correspondiente. Diseñado sin ayudas visuales para maximizar la retención.",
    category: "educativas",
    subject: "Química",
    status: "Publicada",
    isExternal: false,
    url: "/valencias.html",
    techStack: ["HTML", "JavaScript", "Química"]
  },
  {
    id: "legendary-tracker",
    title: "Legendary Marvel Log",
    description: "Bitácora de misiones para Marvel Legendary. Registra Masterminds, Schemes, fuerzas enemigas y puntuaciones de los agentes.",
    category: "juegos",
    subject: "Juegos de Mesa",
    status: "En desarrollo",
    isExternal: false,
    url: "/apps/juegos/MarvelLegendary",
    techStack: ["Next.js", "React", "Local Storage"]
  },
  {
    id: "series-tracker",
    title: "Series Tracker",
    description: "Herramienta local para llevar el control exacto de tus series, capítulos vistos y próximos estrenos utilizando IndexedDB para funcionar 100% offline.",
    category: "tools",
    subject: "Productividad",
    status: "En desarrollo", // O "En desarrollo" si prefieres marcarlo así
    isExternal: false,
    url: "/apps/tools/seriestracker",
    techStack: ["Next.js", "React", "Dexie", "TVmaze API"]
  },
  {
    id: "med-tracker",
    title: "MediControl",
    description: "Aplicación ligera PWA diseñada para usarse en el celular y llevar el control diario de tomas médicas.",
    category: "tools",
    subject: "Salud",
    status: "Fase 1 (Prueba)",
    isExternal: true,
    url: "https://tu-enlace-de-netlify.app", // Recuerda poner tu link real de Netlify aquí
    techStack: ["React", "PWA", "Offline"]
  }
];