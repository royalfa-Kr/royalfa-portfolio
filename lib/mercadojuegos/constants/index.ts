import type {
  ListingAvailabilityStatus,
  ListingCondition,
  ListingOperationType,
  SectionLink,
} from "@/types/mercadojuegos";

export const MERCADOJUEGOS_BASE_PATH = "/apps/tools/mercadojuegos";

export const MERCADOJUEGOS_PROTECTED_ROUTES = [
  `${MERCADOJUEGOS_BASE_PATH}/profile`,
  `${MERCADOJUEGOS_BASE_PATH}/wishlist`,
  `${MERCADOJUEGOS_BASE_PATH}/listings/new`,
] as const;

export const mercadoJuegosSections: SectionLink[] = [
  {
    href: MERCADOJUEGOS_BASE_PATH,
    label: "Inicio",
    description: "Vista general de la app",
  },
  {
    href: `${MERCADOJUEGOS_BASE_PATH}/listings`,
    label: "Publicaciones",
    description: "Listado de juegos",
  },
  {
    href: `${MERCADOJUEGOS_BASE_PATH}/listings/new`,
    label: "Nueva publicación",
    description: "Crear publicación",
  },
  {
    href: `${MERCADOJUEGOS_BASE_PATH}/wishlist`,
    label: "Wishlist",
    description: "Juegos deseados",
  },
  {
    href: `${MERCADOJUEGOS_BASE_PATH}/messages`,
    label: "Mensajes",
    description: "Conversaciones",
  },
  {
    href: `${MERCADOJUEGOS_BASE_PATH}/profile`,
    label: "Perfil",
    description: "Perfil del usuario",
  },
];

export const cdmxBoroughs: string[] = [
  "Álvaro Obregón",
  "Azcapotzalco",
  "Benito Juárez",
  "Coyoacán",
  "Cuajimalpa de Morelos",
  "Cuauhtémoc",
  "Gustavo A. Madero",
  "Iztacalco",
  "Iztapalapa",
  "La Magdalena Contreras",
  "Miguel Hidalgo",
  "Milpa Alta",
  "Tláhuac",
  "Tlalpan",
  "Venustiano Carranza",
  "Xochimilco",
  "Otra / Área Metropolitana",
];

export const listingOperationTypes: ListingOperationType[] = [
  "sale",
  "trade",
  "sale_or_trade",
];

export const listingConditions: ListingCondition[] = [
  "new",
  "like_new",
  "good",
  "used_with_details",
  "incomplete",
];

export const listingAvailabilityStatuses: ListingAvailabilityStatus[] = [
  "available",
  "negotiating",
  "reserved",
  "sold",
  "traded",
  "paused",
];