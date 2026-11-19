# Changelog - MercadoJuegos

## [Unreleased]

### Added
- Documentación inicial del proyecto MercadoJuegos
- PRD base
- arquitectura base
- esquema inicial de datos
- reglas de UI
- backlog inicial
- prompts de trabajo para IA
- estructura inicial de la app en `app/apps/tools/mercadojuegos`
- layout base de MercadoJuegos
- página principal inicial
- páginas placeholder para login, registro, publicaciones, nueva publicación, detalle de publicación, mensajes, perfil y wishlist
- componentes base `AppHeader`, `MercadoJuegosShell` y `SectionPlaceholder`
- constantes y utilidades iniciales del dominio
- tipos base del dominio
- script SQL `docs/mercadojuegos/sql/001_bg_profiles.sql` y tabla `bg_profiles` con políticas RLS en Supabase
- tipos `BgProfile` y `UpdateBgProfileInput` en `types/mercadojuegos/index.ts`
- catálogo de alcaldías de CDMX y rutas protegidas en `lib/mercadojuegos/constants.ts`
- clientes base de Supabase (`client.ts` y `server.ts`) en `lib/mercadojuegos/supabase/`

### Fixed
- Rutas de navegación en `lib/mercadojuegos/constants.ts` corregidas al prefijo canónico `/apps/tools/mercadojuegos`

clave supabase proyect: i$,4dE/wNb#UBLL