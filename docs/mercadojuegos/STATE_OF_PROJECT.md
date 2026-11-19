# State of Project - MercadoJuegos

## 1. Estado general
Proyecto en desarrollo del MVP (Sprint 1 inicial en curso) para una app web de compra, venta e intercambio de juegos de mesa.

## 2. Ruta del proyecto dentro del repo
- app/apps/tools/mercadojuegos
- components/mercadojuegos
- lib/mercadojuegos
- types/mercadojuegos
- docs/mercadojuegos

## 3. Stack aprobado
- Next.js
- Supabase
- Vercel
- GitHub

## 4. Objetivo actual
Continuar Sprint 1 inicial para implementar los servicios de autenticación y perfil, formularios funcionales y protección de rutas.

## 5. Alcance aprobado del MVP
- autenticación
- perfil básico
- publicaciones CRUD básicas
- búsqueda y filtros iniciales
- wishlist
- mensajería interna básica
- estados de disponibilidad
- reportes básicos

## 6. Funcionalidades implementadas
- [x] documentación base del proyecto
- [x] estructura base de carpetas de MercadoJuegos
- [x] layout base de la app
- [x] home de MercadoJuegos
- [x] placeholders de rutas principales
- [x] componentes base AppHeader, MercadoJuegosShell y SectionPlaceholder
- [x] constantes base del dominio (con rutas `/apps/tools/mercadojuegos` y catálogo de alcaldías CDMX)
- [x] utilidades base
- [x] tipos base del dominio (incluyendo `BgProfile` y `UpdateBgProfileInput`)
- [x] tabla `bg_profiles` con trigger de `updated_at` y políticas RLS en Supabase (`docs/mercadojuegos/sql/001_bg_profiles.sql`)
- [x] clientes base de Supabase (navegador y servidor) en `lib/mercadojuegos/supabase/`

## 7. Funcionalidades pendientes
- implementar servicios de autenticación y perfil (`auth.ts` y `profiles.ts`)
- implementar login y registro real en UI
- implementar vista funcional de perfil básico con creación automática al primer acceso
- implementar protección de rutas (`profile`, `wishlist`, `listings/new`)
- actualizar `AppHeader` con estado de sesión y logout
- definir esquema SQL restante de publicaciones, wishlist, mensajería y reportes
- implementar CRUD de publicaciones
- implementar wishlist
- implementar mensajería
- implementar reportes
- agregar validaciones
- agregar estados de carga y error más robustos
- documentar pruebas manuales por feature

## 8. Decisiones aprobadas
- nombre técnico del proyecto: mercadojuegos
- ruta principal: app/apps/tools/mercadojuegos
- documentación del proyecto: docs/mercadojuegos
- enfoque inicial: web app responsive
- mercado inicial: CDMX
- stack: Next.js + Supabase + Vercel
- no integrar pagos en MVP
- no rediseñar globalmente el sitio principal
- la app debe convivir con el portfolio existente sin romper otras secciones
- enums y tipos internos del dominio se manejan en inglés
- contenido visible al usuario puede mantenerse en español durante la fase inicial
- estrategia de perfil: asegurar creación automática al primer acceso si no existe
- rutas protegidas en Sprint 1: `profile`, `wishlist` y `listings/new`

## 9. Restricciones
- no modificar otras apps o rutas sin autorización
- no tocar estilos globales sin autorización
- no cambiar componentes aprobados sin autorización
- no cambiar stack sin autorización
- no separar esta app en otro repo sin autorización
- hacer cambios pequeños e incrementales

## 10. Riesgos abiertos
- pérdida de contexto en sesiones de IA
- diferencias entre documentación y código real
- refactors no solicitados
- crecimiento desordenado si no se modulariza bien
- posible necesidad futura de suavizar integración visual con el layout global del sitio

## 11. Última actualización
- Fecha: 2026-11-17
- Responsable: Equipo MercadoJuegos
- Resumen: Avance parcial de Sprint 1 inicial: instalación de paquetes Supabase, creación de tabla `bg_profiles` con RLS en Supabase y script SQL respaldado, actualización de tipos y constantes con rutas canónicas y alcaldías de CDMX, y creación de clientes base `client.ts` y `server.ts`.