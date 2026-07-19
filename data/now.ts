export const currentFocusData = [
  {
    id: "dev-educativo",
    title: "Software Educativo",
    description: "Construyendo herramientas interactivas en React y Next.js. De laboratorios de estructura atómica a visualizadores de biología celular.",
    linkText: "Probar herramientas",
    href: "/apps",
    priority: 8 // Alta prioridad, saldrá arriba
  },
  {
    id: "mundos",
    title: "Summer Camp 2026",
    description: "Escribiendo articulos de ficción y lore para el universo de Daimon. Cada artículo es un prompt que exploro y desarrollo.",
    linkText: "Lee los nuevos artículos",
    href: "/worlds",
    priority: 5 // Prioridad media, saldrá en segundo lugar
  },
  {
    id: "Presencia",
    title: "Presencia en Internet",
    description: "Llegar a mas personas: Tener el link de la página en la bio de Instagram, X y LinkedIn. Tener un portafolio profesional.",
    priority: 2 // Prioridad baja, saldrá en tercer lugar 
  },
  {
    id: "manual-monstruos",
    title: "Manual para sobrevivir a monstruos",
    description: "Siguiente entrega de la serie 10 en 10. Explorando nuevas narrativas y mecánicas de terror.",
    linkText: "En escritura...",
    href: "",
    priority: 0 // Prioridad 0: Está en tu radar, pero NO se mostrará en la página
  }
];

// NUEVO: Datos de tu próxima clase
export const upcomingClass = {
  isActive: true, // Ponlo en false si quieres ocultar la tarjeta temporalmente
  date: "Lunes 6",
  time: "12:00 PM",
  subject: "Lógica",
  topic: "Tablas de Verdad",
  modality: "En vivo" // Puede ser "En línea" o "En vivo",
};
