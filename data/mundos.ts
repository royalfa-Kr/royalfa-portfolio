// ============================================================================
// DATOS DEL SUMMER CAMP 2026 (DAIMON)
// ============================================================================
// Aquí puedes agregar, editar o eliminar los artículos que vayas completando.
// Puedes usar diferentes iconos de Lucide importándolos arriba.

import { Heart, ScrollText } from "lucide-react";

export const summerCamp2026 = {
  eventoActivo: true,
  nombreEvento: "Summer Camp 2026",
  metaArticulos: 30,
  articulosCompletados: 3, 
  nivelEnProgreso: "Cobre",
  
  articulos: [
    {
        id: 1,
        titulo: "The Craftsman's Curse",
        prompt: "Myth: A famous love story.",
        extracto: "An ancient myth retold across generations and cultures:a master craftsman consumed by ambition, redeemed by love, and ultimately destroyed by the very merchant he once served. Now immortalized as theater and literature.",
        icono: Heart,
        color: "text-amber-400",
        bgIcono: "bg-amber-950/30",
        bordeIcono: "border-amber-900/50",
        url: "https://www.worldanvil.com/w/daimon-royalfa/a/the-craftsman-s-curse-myth" // Tu link real de World Anvil aquí
    },
      {
      id: 2,
      titulo: "Hidden Mirror Cult",
      prompt: "Organization: A faction that employs questionable methods for the love of their people.",
      extracto: " Emerging from the ruins of an ancient mansion, a secretive cult worships a mirror and the phantom daughter of its creator, believing communion with her grants visions of an ideal world.",
      icono: ScrollText,
      color: "text-purple-400",
      bgIcono: "bg-purple-950/30",
      bordeIcono: "border-purple-900/50",
      url: "https://www.worldanvil.com/w/daimon-royalfa/a/hidden-mirror-cult-organization" // CAMBIA ESTO por tu link real
    },
      {
      id: 3,
      titulo: "The Daughter of the Artificer",
      prompt: "Person: A fictional character some believe to be real",
      extracto: " Revered by the Hidden Mirror Cult as the child of the Creator, the Daughter embodies comfort, belonging, and surrender—though ancient sources suggest she may be the reflection of a dream rather than a life once lived.",
      icono: ScrollText,
      color: "text-purple-400",
      bgIcono: "bg-purple-950/30",
      bordeIcono: "border-purple-900/50",
      url: "https://www.worldanvil.com/w/daimon-royalfa/a/the-daughter-of-the-artificer-person" // CAMBIA ESTO por tu link real
    }
    // Para agregar el tercer artículo, solo copia un bloque de arriba, ponle id: 3, 
    // y llena los datos. Automáticamente aparecerá en la página.
  ]
};

// ============================================================================
// OTRAS CONFIGURACIONES DE LA PÁGINA (Opcional para el futuro)
// ============================================================================
export const configMundos = {
  urlPrincipal: "https://www.worldanvil.com/w/daimon-royalfa",
  creador: "Roy Ramirez",
  nombreMundo: "Daimon"
};