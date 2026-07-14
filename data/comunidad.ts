// data/reviews.ts

export const casosDeExito = [
  {
    id: 1,
    nombre: "Luis Diaz Flores",
    profesion: "Comunicación",
    ubicacion: "CDMX, México",
    negocio: "Luigizelda streaming",
    logo: "images/comunidad/LogoLuigizelda.jpg", // URL del logo real
    testimonio: "La verdad Roy es una de las personas más empaticas y carismáticas que conozco a la hora de conocerlo como persona y también llevarlo de la mano de sus clases , aparte de que su amor por lo que enseña se nota. Espero le puedan dar la oportunidad de brindarles esta excelente experiencia!!! ",
    calificacion: 5,
    servicios: ["Valorant","Marvel Rivals","League of Legends"],
    redes: [
      { nombre: "Twitch", url: "https://twitch.tv/luigizelda" },
      { nombre: "Instagram", url: "https://instagram.com/luigizelda" },
      { nombre: "Linktree", url: "https://linktr.ee/luigizelda" }
    ]
  },
  {
    id: 2,
    nombre: "Andrea Guzman", 
    profesion: "Bachelor's in Science",
    ubicacion: "Miami, FL, USA",
    negocio: "Estudiante de Medicina en FIU HWCOM",
    logo: "",
    testimonio: "Roy me ayudó muchísimo cuando estaba en la secundaria. El siempre hacía espacio para mi y mi familia. Con el, aprendí química y matemáticas. Siempre sali super bien en mis exámenes y de hecho recibí muchos reconocimientos en la secundaria gracias a su apoyo. Cada semestre, mi escuela solía reconocer a los tres promedios más altos en diferentes materias y yo siempre tuve algún lugar en las materias en las que me apoyó. ",
    calificacion: 5,
    servicios: ["Student of Chemistry with Emphasis in Biochemistry"],
    redes: [
      { nombre: "Instagram", url: "https://instagram.com/andrea_paolagm" }
    ]
  },
  {
    id: 3,
    nombre: "Fernando Gómez",
    profesion: " ",
    ubicacion: "Estado de México y CDMX, México",
    negocio: "G.E. Asociados",
    logo: "", // Si se deja vacío o no existe, pondrá la inicial del negocio ("C")
    testimonio: "Me ayudó con conocimiento para complementar cursos y diplomados con un mayor dominio de los conceptos",
    calificacion: 5,
    servicios: ["Servicios Contables","Asesoría Fiscal"],
    redes: [
      { nombre: "Correo", url: "mailto:jfernandoge@geasociados.com.mx" },
      { nombre: "WhatsApp", url: "5215521282147" }
    ]
  }
];

export const resenas = [
  {
    nombre: "María Pérez",
    contexto: "Preparatoria Física y Matemáticas",
    texto: "Excelente maestro. \n\n Rodrigo dió clases de física y matemáticas a nivel preparatoria y salieron muy bien. \n\n Una de ellas es ingeniera. Gracias Rodrigo. Súper recomendado.",
    calificacion: 5
  },
  {
    nombre: "M N",
    contexto: " ",
    texto: " ",
    calificacion: 5
  },
  {
    nombre: "Emiliano Carrillo Albrarrán",
    contexto: "Preparatoria",
    texto: " ",
    calificacion: 5
  },
  {
  nombre: "Grecia García",
  contexto: "Preparatoria",
  texto: `Excelente profesor! dedicado con gran conocimiento en diferentes temas, enseña con perfección.

        Aspectos positivos:
        Comunicación, Calidad, Profesionalismo y Valor`,
  calificacion: 5
    },
  {
    nombre: "Beatriz Garay",
    contexto: "Universidad",
    texto: "Explica muy bien y tiene mucha paciencia.",
    calificacion: 5
  },
  {
    nombre: "Erika V. Morales",
    contexto: " ",
    texto: " ",
    calificacion: 5
  },
  {
    nombre: "AG MA",
    contexto: " ",
    texto: "Me ayudó muchísimo con las materias que necesitaba apoyo, siempre buscaba los mejores ejemplos y estrategias para aprender mejor ☺️ y l diversión nunca faltó ❤️ 100% recomendado",
    calificacion: 5
  },
  // ... las demás reseñas de Google Mi Negocio
];