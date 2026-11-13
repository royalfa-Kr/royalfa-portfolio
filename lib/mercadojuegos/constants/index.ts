import type {
  ListingAvailabilityStatus,
  ListingCondition,
  ListingOperationType,
  SectionLink,
} from "../../../types/mercadojuegos";

export const mercadoJuegosSections: SectionLink[] = [
  {
    href: "/apps/mercadojuegos",
    label: "Inicio",
    description: "Vista general de la app",
  },
  {
    href: "/apps/mercadojuegos/auth/login",
    label: "Login",
    description: "Acceso de usuarios",
  },
  {
    href: "/apps/mercadojuegos/auth/register",
    label: "Registro",
    description: "Alta de usuarios",
  },
  {
    href: "/apps/mercadojuegos/listings",
    label: "Publicaciones",
    description: "Listado de juegos",
  },
  {
    href: "/apps/mercadojuegos/listings/new",
    label: "Nueva publicación",
    description: "Crear publicación",
  },
  {
    href: "/apps/mercadojuegos/wishlist",
    label: "Wishlist",
    description: "Juegos deseados",
  },
  {
    href: "/apps/mercadojuegos/messages",
    label: "Mensajes",
    description: "Conversaciones",
  },
  {
    href: "/apps/mercadojuegos/profile",
    label: "Perfil",
    description: "Perfil del usuario",
  },
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